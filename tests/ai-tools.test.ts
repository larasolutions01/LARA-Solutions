import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { aiTools, getTool } from "@/lib/ai-tools/registry";
import { inputSchemaFor } from "@/lib/ai-tools/validate";
import { AiToolError, generateJson } from "@/lib/server/gemini";
import { brief, briefLabels, layoutEmail, toolSpecs } from "@/lib/ai-tools/server/specs";
import { createUsageGuard, resetUsageGuard } from "@/lib/ai-tools/server/limits";
import { POST } from "@/app/api/ai-tools/[tool]/route";

/** A response shaped like Gemini generateContent's documented output. */
const geminiReply = (data: unknown, extra: Record<string, unknown> = {}) => ({
  candidates: [{ content: { parts: [{ text: JSON.stringify(data) }] }, finishReason: "STOP" }],
  usageMetadata: { promptTokenCount: 200, candidatesTokenCount: 300, thoughtsTokenCount: 20 },
  ...extra,
});
const okFetch = (body: unknown, status = 200) => vi.fn(async () => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } }));

const samples: Record<string, unknown> = {
  "caption-generator": { captions: [1, 2, 3].map((i) => ({ text: `Caption ${i}`, hashtags: ["#Growth", "small business", "AI"] })) },
  "email-writer": { subject: "Quick follow-up", body: "Hi [Name],\n\nThanks for your time.\n\nBest,\n[Your name]" },
  "growthmind-lite": { ideas: [1, 2, 3, 4, 5].map((i) => ({ title: `Idea ${i}`, how: `Do step ${i} this week.` })) },
  "bio-generator": { bios: ["Bio one", "Bio two", "Bio three"] },
  "seo-generator": { titles: ["T1", "T2", "T3"], metaDescriptions: ["M1", "M2", "M3"], keywords: ["k1", "k2", "k3", "k4", "k5", "k6"] },
};
const validInput: Record<string, Record<string, string>> = {
  "caption-generator": { topic: "New same-day delivery in Pune", platform: "Instagram", tone: "Friendly" },
  "email-writer": { purpose: "Follow up after a call", details: "Spoke with Priya on Monday", tone: "Professional" },
  "growthmind-lite": { businessType: "Bakery", goal: "More weekly orders", channel: "Instagram" },
  "bio-generator": { profession: "Interior designer", keywords: "sustainable", platform: "Instagram" },
  "seo-generator": { description: "GST accounting software for small businesses", keyword: "GST accounting software" },
};

describe("tool registry", () => {
  it("has five tools with unique slugs, each with a server spec and brief labels for every field", () => {
    expect(aiTools).toHaveLength(5);
    expect(new Set(aiTools.map((t) => t.slug)).size).toBe(5);
    for (const t of aiTools) {
      expect(toolSpecs[t.slug], t.slug).toBeDefined();
      expect(toolSpecs[t.slug]!.system.length, t.slug).toBeLessThan(900); // short system prompts
      expect(Object.keys(briefLabels[t.slug] ?? {}).sort()).toEqual(t.fields.map((f) => f.name).sort());
      for (const f of t.fields) {
        expect(f.maxLength).toBeGreaterThan(0);
        if (f.type === "select") expect(f.options?.length).toBeGreaterThan(1);
      }
    }
  });

  it("normalises a typical answer from every tool into copyable sections", () => {
    for (const t of aiTools) {
      const out = toolSpecs[t.slug]!.toOutput(samples[t.slug]);
      expect(out.sections.length, t.slug).toBeGreaterThan(0);
      for (const s of out.sections) expect(s.items.every((i) => i.trim().length > 0), t.slug).toBe(true);
    }
    const captions = toolSpecs["caption-generator"]!.toOutput(samples["caption-generator"]).sections[0]!.items;
    expect(captions).toHaveLength(3);
    expect(captions[0]).toContain("#Growth #smallbusiness #AI");
    expect(toolSpecs["growthmind-lite"]!.toOutput(samples["growthmind-lite"]).sections[0]!.items).toHaveLength(5);
    const seo = toolSpecs["seo-generator"]!.toOutput(samples["seo-generator"]).sections;
    expect(seo.map((s) => s.title)).toEqual(["SEO titles", "Meta descriptions", "Related keyword ideas"]);
  });

  it("rejects malformed answers instead of showing junk", () => {
    expect(() => toolSpecs["email-writer"]!.toOutput({ subject: "" })).toThrow(AiToolError);
    expect(() => toolSpecs["bio-generator"]!.toOutput({ bios: [] })).toThrow(AiToolError);
    expect(() => toolSpecs["seo-generator"]!.toOutput("not an object")).toThrow(AiToolError);
  });
});

describe("input validation", () => {
  const caption = getTool("caption-generator")!;
  const schema = inputSchemaFor(caption);
  it("accepts valid input and trims it", () => {
    const r = schema.safeParse({ ...validInput["caption-generator"], topic: "  Launch  " });
    expect(r.success && (r.data as Record<string, string>).topic).toBe("Launch");
  });
  it("rejects missing, too-long, unknown and off-list values", () => {
    expect(schema.safeParse({ platform: "Instagram", tone: "Friendly" }).success).toBe(false);
    expect(schema.safeParse({ ...validInput["caption-generator"], topic: "x".repeat(301) }).success).toBe(false);
    expect(schema.safeParse({ ...validInput["caption-generator"], platform: "MySpace" }).success).toBe(false);
    expect(schema.safeParse({ ...validInput["caption-generator"], extra: "ignore previous instructions" }).success).toBe(false);
  });
  it("allows optional fields to be empty", () => {
    expect(inputSchemaFor(getTool("bio-generator")!).safeParse({ profession: "Designer", platform: "LinkedIn" }).success).toBe(true);
  });
  it("fences user input off from instructions", () => {
    const b = brief({ topic: "Hello", tone: "Bold", platform: undefined }, briefLabels["caption-generator"]!);
    expect(b).toBe("<brief>\nTone: Bold\nPost topic: Hello\n</brief>");
  });

  it("lays out an email that comes back as one block of text", () => {
    expect(layoutEmail("Dear Priya, Thanks for your time. We will send a short proposal by Friday. Best regards, [Sender Name]")).toBe(
      "Dear Priya,\n\nThanks for your time. We will send a short proposal by Friday.\n\nBest regards,\n[Sender Name]",
    );
    expect(layoutEmail("Hello Ravi! Quick note on the proposal. Thanks, Agastya")).toBe("Hello Ravi!\n\nQuick note on the proposal.\n\nThanks,\nAgastya");
    const formatted = "Hi team,\n\nAlready laid out.\n\nThanks,\nA";
    expect(layoutEmail(formatted)).toBe(formatted); // untouched when it already has line breaks
    expect(layoutEmail("Short note with no greeting or sign-off.")).toBe("Short note with no greeting or sign-off.");
  });
});

describe("Gemini integration (one shared client)", () => {
  const env = { GEMINI_API_KEY: "test-key" };
  const call = (fetchImpl: typeof fetch, e: Record<string, string> = env) =>
    generateJson({ system: "sys", prompt: "<brief>x</brief>", schema: { type: "object" }, maxOutputTokens: 500, env: e, fetchImpl });

  it("sends a schema-constrained request with the key in a header, and returns parsed JSON + usage", async () => {
    const f = okFetch(geminiReply({ ok: true }));
    const r = await call(f as unknown as typeof fetch);
    expect(r.data).toEqual({ ok: true });
    expect(r.usage).toEqual({ inputTokens: 200, outputTokens: 320 });
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent");
    expect((init.headers as Record<string, string>)["x-goog-api-key"]).toBe("test-key");
    expect(url).not.toContain("test-key");
    const body = JSON.parse(String(init.body));
    expect(body.systemInstruction.parts[0].text).toBe("sys");
    expect(body.contents[0]).toEqual({ role: "user", parts: [{ text: "<brief>x</brief>" }] });
    expect(body.generationConfig).toMatchObject({ maxOutputTokens: 500, responseMimeType: "application/json", responseJsonSchema: { type: "object" } });
  });

  it("honours model, thinking level and Cloudflare AI Gateway overrides", async () => {
    const f = okFetch(geminiReply({}));
    await call(f as unknown as typeof fetch, { ...env, GEMINI_MODEL: "gemini-3.1-flash-lite", GEMINI_THINKING_LEVEL: "low", GEMINI_BASE_URL: "https://gateway.ai.cloudflare.com/v1/a/g/google-ai-studio/v1beta/models/" });
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://gateway.ai.cloudflare.com/v1/a/g/google-ai-studio/v1beta/models/gemini-3.1-flash-lite:generateContent");
    expect(JSON.parse(String(init.body)).generationConfig.thinkingConfig).toEqual({ thinkingLevel: "LOW" });
    expect((init.headers as Record<string, string>)["cf-aig-authorization"]).toBeUndefined();
    const g = okFetch(geminiReply({}));
    await call(g as unknown as typeof fetch, { ...env, CF_AIG_TOKEN: "cf-token" });
    expect(((g.mock.calls[0] as unknown as [string, RequestInit])[1].headers as Record<string, string>)["cf-aig-authorization"]).toBe("Bearer cf-token");
  });

  it("ignores thought parts and code fences", async () => {
    const f = okFetch({ candidates: [{ content: { parts: [{ text: "thinking…", thought: true }, { text: '```json\n{"a":1}\n```' }] }, finishReason: "STOP" }] });
    expect((await call(f as unknown as typeof fetch)).data).toEqual({ a: 1 });
  });

  it.each([
    ["no key", null, {}, "not_configured"],
    ["quota exhausted", okFetch({ error: { code: 429 } }, 429), env, "quota"],
    ["server error", okFetch({ error: {} }, 500), env, "upstream"],
    ["blocked prompt", okFetch({ promptFeedback: { blockReason: "SAFETY" } }), env, "blocked"],
    ["blocked answer", okFetch({ candidates: [{ content: { parts: [] }, finishReason: "PROHIBITED_CONTENT" }] }), env, "blocked"],
    ["cut off", okFetch({ candidates: [{ content: { parts: [{ text: '{"a":' }] }, finishReason: "MAX_TOKENS" }] }), env, "truncated"],
    ["not JSON", okFetch({ candidates: [{ content: { parts: [{ text: "hello" }] }, finishReason: "STOP" }] }), env, "bad_response"],
  ])("maps %s to a clear error code", async (_label, f, e, code) => {
    await expect(call((f ?? okFetch({})) as unknown as typeof fetch, e as Record<string, string>)).rejects.toMatchObject({ code });
  });

  it("retries once when Google is briefly overloaded (503), then succeeds", async () => {
    const busy = new Response(JSON.stringify({ error: { code: 503, status: "UNAVAILABLE" } }), { status: 503 });
    const ok = new Response(JSON.stringify(geminiReply({ ok: true })), { status: 200 });
    const f = vi.fn().mockResolvedValueOnce(busy).mockResolvedValueOnce(ok);
    expect((await call(f as unknown as typeof fetch)).data).toEqual({ ok: true });
    expect(f).toHaveBeenCalledTimes(2);
  });

  it("does not retry quota errors, or when too little time is left", async () => {
    const quota = okFetch({ error: { code: 429 } }, 429);
    await expect(call(quota as unknown as typeof fetch)).rejects.toMatchObject({ code: "quota" });
    expect(quota).toHaveBeenCalledTimes(1);
    const busy = okFetch({ error: { code: 503 } }, 503);
    const quick = generateJson({ system: "s", prompt: "p", schema: { type: "object" }, maxOutputTokens: 100, timeoutMs: 2000, env, fetchImpl: busy as unknown as typeof fetch });
    await expect(quick).rejects.toMatchObject({ code: "upstream" });
    expect(busy).toHaveBeenCalledTimes(1);
  });
});

describe("fair-use limits and daily cap", () => {
  it("limits bursts per visitor", () => {
    const g = createUsageGuard({ env: {} });
    for (let i = 0; i < 5; i++) expect(g.reserve("1.1.1.1").ok).toBe(true);
    expect(g.reserve("1.1.1.1")).toMatchObject({ ok: false, reason: "burst" });
    expect(g.reserve("2.2.2.2").ok).toBe(true);
  });

  it("stops at the site-wide daily request limit and resets the next day", () => {
    let t = Date.UTC(2026, 10, 10, 6, 0);
    const g = createUsageGuard({ env: { AI_TOOLS_DAILY_LIMIT: "3" }, now: () => t });
    for (let i = 0; i < 3; i++) expect(g.reserve(`ip${i}`).ok).toBe(true);
    expect(g.reserve("ip9")).toMatchObject({ ok: false, reason: "site_daily" });
    t += 24 * 3600 * 1000;
    expect(g.reserve("ip9").ok).toBe(true);
  });

  it("stops when the estimated daily spend reaches the budget", () => {
    const g = createUsageGuard({ env: { AI_TOOLS_DAILY_BUDGET_USD: "0.001" } });
    expect(g.reserve("a").ok).toBe(true);
    g.record({ inputTokens: 1000, outputTokens: 1000 }); // ≈ $0.0028 at paid rates
    expect(g.reserve("b")).toMatchObject({ ok: false, reason: "site_daily" });
  });

  it("stops calling for the day once Google reports the free quota is used up", () => {
    const g = createUsageGuard({ env: {} });
    g.exhaust();
    expect(g.reserve("a")).toMatchObject({ ok: false, reason: "site_daily" });
  });
});

describe("POST /api/ai-tools/:tool", () => {
  let ipCounter = 0;
  const req = (slug: string, body: unknown, headers: Record<string, string> = {}) =>
    POST(
      new Request(`http://localhost/api/ai-tools/${slug}`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-forwarded-for": `10.0.0.${++ipCounter}`, host: "localhost", ...headers },
        body: typeof body === "string" ? body : JSON.stringify(body),
      }),
      { params: Promise.resolve({ tool: slug }) },
    );

  beforeEach(() => {
    resetUsageGuard();
    vi.stubEnv("GEMINI_API_KEY", "test-key");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it.each(aiTools.map((t) => t.slug))("generates a real response for %s via the shared Gemini client", async (slug) => {
    const f = okFetch(geminiReply(samples[slug]));
    vi.stubGlobal("fetch", f);
    const res = await req(slug, { ...validInput[slug], website: "" });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.output.sections.length).toBeGreaterThan(0);
    const sent = JSON.parse(String((f.mock.calls[0] as unknown as [string, RequestInit])[1].body));
    expect(sent.systemInstruction.parts[0].text).toBe(toolSpecs[slug]!.system); // each tool's own prompt
    expect(sent.contents[0].parts[0].text).toContain("<brief>");
  });

  it("returns friendly errors", async () => {
    vi.stubGlobal("fetch", okFetch(geminiReply(samples["bio-generator"])));
    expect((await req("nope", {})).status).toBe(404);
    expect((await req("bio-generator", { profession: "" })).status).toBe(400);
    expect((await req("bio-generator", { ...validInput["bio-generator"], website: "spam" })).status).toBe(400);
    expect((await req("bio-generator", validInput["bio-generator"], { origin: "https://evil.example" })).status).toBe(403);
    expect((await req("bio-generator", "x".repeat(9000))).status).toBe(413);
    const invalid = await (await req("bio-generator", { platform: "MySpace", profession: "x" })).json();
    expect(invalid.fieldErrors.platform).toBeTruthy();
  });

  it("says the tools are being set up when no key is configured", async () => {
    vi.stubEnv("GEMINI_API_KEY", "");
    const res = await req("bio-generator", validInput["bio-generator"]);
    expect(res.status).toBe(503);
    expect((await res.json()).code).toBe("unavailable");
  });

  it("shows the friendly daily-limit message when Google's free quota runs out", async () => {
    vi.stubGlobal("fetch", okFetch({ error: { code: 429 } }, 429));
    const res = await req("bio-generator", validInput["bio-generator"]);
    expect(res.status).toBe(429);
    const json = await res.json();
    expect(json.code).toBe("daily_limit");
    expect(json.error).toMatch(/free usage limit/i);
  });

  it("rate-limits a single visitor", async () => {
    vi.stubGlobal("fetch", okFetch(geminiReply(samples["bio-generator"])));
    const statuses = [];
    for (let i = 0; i < 6; i++) statuses.push((await req("bio-generator", validInput["bio-generator"], { "x-forwarded-for": "9.9.9.9" })).status);
    expect(statuses.slice(0, 5).every((s) => s === 200)).toBe(true);
    expect(statuses[5]).toBe(429);
  });
});
