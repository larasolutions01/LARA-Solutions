/**
 * The one shared AI integration for the whole site: Google Gemini
 * `generateContent` (REST, no SDK dependency). Used by every LARA AI tool
 * (schema-constrained JSON) and by the website assistant (short plain text).
 * Server-only — the API key is read from the environment here and never
 * reaches the browser.
 *
 * Docs: https://aistudio.google.com/api-reference/generate-content.md
 */

export const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";
/** Stable, low-cost model that is available on the Gemini API free tier. */
export const DEFAULT_GEMINI_MODEL = "gemini-3.5-flash-lite";

export type AiErrorCode = "not_configured" | "quota" | "blocked" | "truncated" | "bad_response" | "timeout" | "upstream";

export class AiToolError extends Error {
  constructor(
    public code: AiErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "AiToolError";
  }
}

export interface AiUsage {
  inputTokens: number;
  /** Visible output plus thinking tokens (both are billed as output). */
  outputTokens: number;
}

/** One conversation turn. Gemini calls the assistant side "model". */
export interface GeminiTurn {
  role: "user" | "model";
  text: string;
}

type Env = Record<string, string | undefined>;

export function geminiConfigured(env: Env = process.env) {
  return Boolean(env.GEMINI_API_KEY?.trim());
}

interface GeminiPart {
  text?: string;
  thought?: boolean;
}
interface GeminiResponse {
  candidates?: { content?: { parts?: GeminiPart[] }; finishReason?: string }[];
  promptFeedback?: { blockReason?: string };
  usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number; thoughtsTokenCount?: number };
}

const BLOCKED_FINISH = new Set(["SAFETY", "RECITATION", "BLOCKLIST", "PROHIBITED_CONTENT", "SPII", "LANGUAGE"]);
const TRANSIENT_STATUS = new Set([500, 503]);
const RETRY_DELAY_MS = 600;

interface CallOptions {
  system: string;
  turns: GeminiTurn[];
  maxOutputTokens: number;
  /** When set, Gemini must answer with JSON matching this schema. */
  schema?: Record<string, unknown>;
  timeoutMs?: number;
  env?: Env;
  fetchImpl?: typeof fetch;
}

/** Shared request/response handling: returns the answer text (thoughts removed). */
async function callGemini({ system, turns, maxOutputTokens, schema, timeoutMs = 9000, env = process.env, fetchImpl = fetch }: CallOptions) {
  const key = env.GEMINI_API_KEY?.trim();
  if (!key) throw new AiToolError("not_configured", "GEMINI_API_KEY is not set");
  const model = env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
  // Optional: route through Cloudflare AI Gateway (logs, caching, rate limits) —
  // e.g. https://gateway.ai.cloudflare.com/v1/<account>/<gateway>/google-ai-studio/v1beta/models
  const base = (env.GEMINI_BASE_URL?.trim() || GEMINI_ENDPOINT).replace(/\/+$/, "");
  const thinkingLevel = env.GEMINI_THINKING_LEVEL?.trim().toUpperCase();

  const url = `${base}/${encodeURIComponent(model)}:generateContent`;
  const init: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": key,
      // Only needed for an *authenticated* Cloudflare AI Gateway.
      ...(env.CF_AIG_TOKEN?.trim() ? { "cf-aig-authorization": `Bearer ${env.CF_AIG_TOKEN.trim()}` } : {}),
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: turns.map((t) => ({ role: t.role, parts: [{ text: t.text }] })),
      generationConfig: {
        maxOutputTokens,
        ...(schema ? { responseMimeType: "application/json", responseJsonSchema: schema } : {}),
        ...(thinkingLevel ? { thinkingConfig: { thinkingLevel } } : {}),
      },
    }),
    cache: "no-store",
  };

  // One overall deadline, so a retry never pushes past the serverless time limit.
  const deadline = Date.now() + timeoutMs;
  let res: Response;
  for (let attempt = 1; ; attempt++) {
    try {
      res = await fetchImpl(url, { ...init, signal: AbortSignal.timeout(Math.max(1, deadline - Date.now())) });
    } catch (e) {
      const name = (e as Error)?.name;
      if (name === "TimeoutError" || name === "AbortError") throw new AiToolError("timeout", "Gemini request timed out");
      throw new AiToolError("upstream", `Gemini request failed: ${(e as Error)?.message ?? e}`);
    }
    // Google's "high demand" (503) and internal (500) errors are usually momentary:
    // retry once after a short pause if there's still comfortable time left.
    if (attempt === 1 && TRANSIENT_STATUS.has(res.status) && deadline - Date.now() > RETRY_DELAY_MS + 3000) {
      await res.body?.cancel().catch(() => {});
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
      continue;
    }
    break;
  }

  if (!res.ok) {
    const detail = (await res.text().catch(() => "")).slice(0, 300);
    if (res.status === 429) throw new AiToolError("quota", `Gemini quota/rate limit (429): ${detail}`);
    throw new AiToolError("upstream", `Gemini responded ${res.status}: ${detail}`);
  }

  const json = (await res.json().catch(() => null)) as GeminiResponse | null;
  if (!json) throw new AiToolError("bad_response", "Gemini returned invalid JSON");
  if (json.promptFeedback?.blockReason) throw new AiToolError("blocked", `Prompt blocked: ${json.promptFeedback.blockReason}`);

  const candidate = json.candidates?.[0];
  const finish = candidate?.finishReason ?? "";
  if (BLOCKED_FINISH.has(finish)) throw new AiToolError("blocked", `Response blocked: ${finish}`);
  if (finish === "MAX_TOKENS") throw new AiToolError("truncated", "Response hit the output token limit");

  const text = (candidate?.content?.parts ?? [])
    .filter((p) => typeof p.text === "string" && !p.thought)
    .map((p) => p.text)
    .join("")
    .trim();
  if (!text) throw new AiToolError("bad_response", `Empty response (finishReason=${finish || "none"})`);

  const u = json.usageMetadata ?? {};
  const usage: AiUsage = { inputTokens: u.promptTokenCount ?? 0, outputTokens: (u.candidatesTokenCount ?? 0) + (u.thoughtsTokenCount ?? 0) };
  return { text, usage, model };
}

type Common = Omit<CallOptions, "turns" | "schema">;

/** One prompt in, schema-shaped JSON out (used by the AI tools). */
export async function generateJson({
  prompt,
  schema,
  ...rest
}: Common & { prompt: string; schema: Record<string, unknown> }): Promise<{ data: unknown; usage: AiUsage; model: string }> {
  const { text, usage, model } = await callGemini({ ...rest, schema, turns: [{ role: "user", text: prompt }] });
  let data: unknown;
  try {
    data = JSON.parse(text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, ""));
  } catch {
    throw new AiToolError("bad_response", "Response was not valid JSON");
  }
  return { data, usage, model };
}

/** A short conversation in, plain text out (used by the website assistant). */
export async function generateText(opts: Common & { turns: GeminiTurn[] }): Promise<{ text: string; usage: AiUsage; model: string }> {
  return callGemini(opts);
}
