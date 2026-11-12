import { getTool } from "@/lib/ai-tools/registry";
import { inputSchemaFor } from "@/lib/ai-tools/validate";
import { AiToolError, generateJson, geminiConfigured } from "@/lib/server/gemini";
import { brief, briefLabels, toolSpecs } from "@/lib/ai-tools/server/specs";
import { usageGuard } from "@/lib/ai-tools/server/limits";
import { authenticate } from "@/lib/lara-ai/server/supabase";
import { AUTH_MESSAGES } from "@/lib/lara-ai/server/respond";

/**
 * POST /api/ai-tools/:tool — one endpoint for every LARA AI tool.
 * Requires a signed-in LARA AI member: `Authorization: Bearer <access token>`.
 * Body: the tool's field values (+ an empty `website` honeypot).
 * Returns { output } on success, or { error, code } with a friendly message.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 8 * 1024;

const reply = (status: number, body: Record<string, unknown>, headers: Record<string, string> = {}) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

const MESSAGES = {
  unavailable: "The AI tools are being set up. Please check back soon.",
  burst: "You're generating very quickly — please wait a minute and try again.",
  member_daily: "You've reached today's free limit for your LARA AI account. Please come back tomorrow.",
  site_daily: "Today's free usage limit for the AI tools has been reached. Please try again tomorrow.",
  blocked: "We couldn't generate a response for that request. Please rephrase your input and try again.",
  incomplete: "The AI response came back incomplete. Please press Try again.",
  timeout: "The AI took too long to respond. Please try again.",
  upstream: "The AI service is temporarily unavailable. Please try again in a moment.",
};

export async function POST(request: Request, { params }: { params: Promise<{ tool: string }> }) {
  const { tool: slug } = await params;
  const tool = getTool(slug);
  const spec = tool && toolSpecs[tool.slug];
  if (!tool || !spec) return reply(404, { error: "Tool not found.", code: "not_found" });

  // Only accept calls from this website's own pages.
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return reply(403, { error: "Forbidden.", code: "forbidden" });
    } catch {
      return reply(403, { error: "Forbidden.", code: "forbidden" });
    }
  }

  if (!geminiConfigured()) return reply(503, { error: MESSAGES.unavailable, code: "unavailable" });

  // Free, but members only: verify the LARA AI sign-in before doing any work.
  const auth = await authenticate(request);
  if (!auth.ok) return reply(auth.status, { error: AUTH_MESSAGES[auth.code], code: auth.code });

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return reply(413, { error: "Your input is too long.", code: "too_large" });
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return reply(400, { error: "Invalid request.", code: "invalid" });
  }
  if (!body || typeof body !== "object") return reply(400, { error: "Invalid request.", code: "invalid" });

  // Honeypot: real visitors never fill this hidden field.
  const { website, ...fields } = body;
  if (typeof website === "string" && website.trim() !== "") return reply(400, { error: "Invalid request.", code: "invalid" });

  const parsed = inputSchemaFor(tool).safeParse(fields);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const k = String(issue.path[0] ?? "");
      if (k && !fieldErrors[k]) fieldErrors[k] = issue.message;
    }
    return reply(400, { error: "Please check the highlighted fields.", code: "invalid", fieldErrors });
  }
  const input = parsed.data as Record<string, string | undefined>;

  const guard = usageGuard();
  const slot = guard.reserve(`member:${auth.user.id}`);
  if (!slot.ok) {
    return reply(
      429,
      { error: MESSAGES[slot.reason], code: slot.reason === "burst" ? "rate_limited" : "daily_limit" },
      slot.retryAfterSeconds ? { "Retry-After": String(slot.retryAfterSeconds) } : {},
    );
  }

  try {
    const { data, usage } = await generateJson({
      system: spec.system,
      prompt: brief(input, briefLabels[tool.slug] ?? {}),
      schema: spec.schema,
      maxOutputTokens: spec.maxOutputTokens,
    });
    guard.record(usage);
    return reply(200, { output: spec.toOutput(data) });
  } catch (e) {
    const err = e instanceof AiToolError ? e : new AiToolError("upstream", String(e));
    console.error(`[ai-tools] ${tool.slug} failed`, { code: err.code, message: err.message });
    switch (err.code) {
      case "quota":
        guard.exhaust();
        return reply(429, { error: MESSAGES.site_daily, code: "daily_limit" });
      case "not_configured":
        return reply(503, { error: MESSAGES.unavailable, code: "unavailable" });
      case "blocked":
        return reply(422, { error: MESSAGES.blocked, code: "blocked" });
      case "truncated":
      case "bad_response":
        return reply(502, { error: MESSAGES.incomplete, code: "incomplete" });
      case "timeout":
        return reply(504, { error: MESSAGES.timeout, code: "timeout" });
      default:
        return reply(502, { error: MESSAGES.upstream, code: "upstream" });
    }
  }
}
