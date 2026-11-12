import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/assistant/route";
import { POST as POST_LEAD } from "@/app/api/assistant-lead/route";
import { assistantEnabled } from "@/lib/features";
import { ASSISTANT_SYSTEM_PROMPT, aiAssistantEnabled, askAssistant, buildKnowledge } from "@/lib/server/assistant-ai";
import { resetUsageGuard, usageGuard } from "@/lib/ai-tools/server/limits";
import { services } from "@/content/services";

let ipCounter = 0;
const req = (body: unknown, ip = `7.7.7.${++ipCounter}`) =>
  new Request("http://localhost/api/assistant", { method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": ip }, body: JSON.stringify(body) });

const geminiText = (text: string, finishReason = "STOP") => ({
  candidates: [{ content: { parts: [{ text }] }, finishReason }],
  usageMetadata: { promptTokenCount: 1200, candidatesTokenCount: 60 },
});
const okFetch = (body: unknown, status = 200) => vi.fn(async () => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } }));
const sentBody = (f: ReturnType<typeof okFetch>) => JSON.parse(String((f.mock.calls[0] as unknown as [string, RequestInit])[1].body));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("assistant switch", () => {
  it("is off unless explicitly enabled", () => {
    expect(assistantEnabled({})).toBe(false);
    expect(assistantEnabled({ NEXT_PUBLIC_ENABLE_ASSISTANT: "false" })).toBe(false);
    expect(assistantEnabled({ NEXT_PUBLIC_ENABLE_ASSISTANT: "true" })).toBe(true);
  });

  it("closes both assistant endpoints while switched off", async () => {
    vi.stubEnv("NEXT_PUBLIC_ENABLE_ASSISTANT", "");
    expect((await POST(req({ message: "hello" }))).status).toBe(404);
    expect((await POST_LEAD(req({ fullName: "A", email: "a@b.co", message: "hi", consent: true }))).status).toBe(404);
  });
});

describe("website assistant API", () => {
  beforeEach(() => {
    resetUsageGuard();
    vi.stubEnv("NEXT_PUBLIC_ENABLE_ASSISTANT", "true");
  });

  it("is AI-enabled only when the shared Gemini key is configured", () => {
    expect(aiAssistantEnabled({})).toBe(false);
    expect(aiAssistantEnabled({ GEMINI_API_KEY: " " })).toBe(false);
    expect(aiAssistantEnabled({ GEMINI_API_KEY: "test-key" })).toBe(true);
  });

  it("falls back to the approved FAQ when no AI backend is configured", async () => {
    vi.stubEnv("GEMINI_API_KEY", "");
    const res = await POST(req({ message: "How much does it cost?" }));
    const json = await res.json();
    expect(json.mode).toBe("faq");
    expect(json.answer).toMatch(/pricing depends|scoped/i);
  });

  it("is honest when nothing matches", async () => {
    vi.stubEnv("GEMINI_API_KEY", "");
    const json = await (await POST(req({ message: "zxqv blorp" }))).json();
    expect(json.answer).toMatch(/don’t have an approved answer/);
    expect(json.offerLead).toBe(true);
  });

  it("validates input", async () => {
    expect((await POST(req({ message: "" }))).status).toBe(422);
    expect((await POST(req({ message: "x".repeat(600) }))).status).toBe(422);
  });

  it("grounds the AI on every enabled service", () => {
    const k = buildKnowledge();
    for (const s of services) expect(k).toContain(s.name);
    expect(ASSISTANT_SYSTEM_PROMPT).toContain(k);
  });

  it("answers with Gemini through the shared client when a key is set", async () => {
    vi.stubEnv("GEMINI_API_KEY", "test-key");
    const f = okFetch(geminiText("We help with **AI automation** — see /solutions/ai-automation or reach us via /contact."));
    vi.stubGlobal("fetch", f);
    const res = await POST(req({ message: "Can you automate my invoices?", history: [{ role: "user", content: "Hi" }, { role: "assistant", content: "Hello! How can I help?" }] }));
    const json = await res.json();
    expect(json.mode).toBe("ai");
    expect(json.answer).toBe("We help with AI automation — see /solutions/ai-automation or reach us via /contact."); // markdown stripped
    expect(json.links.map((l: { href: string }) => l.href)).toContain("/contact");
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toMatch(/generativelanguage\.googleapis\.com\/v1beta\/models\/gemini-3\.5-flash-lite:generateContent$/);
    expect((init.headers as Record<string, string>)["x-goog-api-key"]).toBe("test-key");
    const body = sentBody(f);
    expect(body.systemInstruction.parts[0].text).toBe(ASSISTANT_SYSTEM_PROMPT);
    expect(body.contents.map((c: { role: string }) => c.role)).toEqual(["user", "model", "user"]);
    expect(body.contents.at(-1)?.parts[0].text).toBe("Can you automate my invoices?");
    expect(body.generationConfig.responseMimeType).toBeUndefined(); // plain text, not JSON
    expect(usageGuard().snapshot().requests).toBe(1); // counts towards the shared daily cap
    expect(usageGuard().snapshot().costUsd).toBeGreaterThan(0);
  });

  it("keeps the conversation well-formed for Gemini", async () => {
    const f = okFetch(geminiText("Sure."));
    await askAssistant(
      "Next question",
      [
        { role: "assistant", content: "Leading assistant turn is dropped" },
        { role: "user", content: "First" },
        { role: "user", content: "Duplicate role is dropped" },
        { role: "assistant", content: "Reply" },
        { role: "user", content: "Unanswered trailing user turn is dropped" },
      ],
      { env: { GEMINI_API_KEY: "k" }, fetchImpl: f },
    );
    expect(sentBody(f).contents.map((c: { role: string; parts: { text: string }[] }) => `${c.role}:${c.parts[0]?.text}`)).toEqual([
      "user:First",
      "model:Reply",
      "user:Next question",
    ]);
  });

  it("falls back to the FAQ when Gemini blocks or cuts off the answer", async () => {
    vi.stubEnv("GEMINI_API_KEY", "test-key");
    vi.stubGlobal("fetch", okFetch(geminiText("", "SAFETY")));
    expect((await (await POST(req({ message: "How much does it cost?" }))).json()).mode).toBe("faq");
    vi.stubGlobal("fetch", okFetch(geminiText("partial", "MAX_TOKENS")));
    expect((await (await POST(req({ message: "How much does it cost?" }))).json()).mode).toBe("faq");
  });

  it("switches to the FAQ for the rest of the day when Google's free quota runs out", async () => {
    vi.stubEnv("GEMINI_API_KEY", "test-key");
    const quota = okFetch({ error: { code: 429 } }, 429);
    vi.stubGlobal("fetch", quota);
    const res = await POST(req({ message: "How much does it cost?" }));
    expect(res.status).toBe(200);
    expect((await res.json()).mode).toBe("faq");
    const later = okFetch(geminiText("Should not be called"));
    vi.stubGlobal("fetch", later);
    expect((await (await POST(req({ message: "What do you do?" }))).json()).mode).toBe("faq");
    expect(later).not.toHaveBeenCalled();
  });

  it("shares the site-wide daily cap with the AI tools", async () => {
    vi.stubEnv("GEMINI_API_KEY", "test-key");
    vi.stubEnv("AI_TOOLS_DAILY_LIMIT", "2");
    resetUsageGuard();
    expect(usageGuard().reserve("1.1.1.1").ok).toBe(true);
    expect(usageGuard().reserve("1.1.1.2").ok).toBe(true); // tools used today's cap
    const f = okFetch(geminiText("Should not be called"));
    vi.stubGlobal("fetch", f);
    expect((await (await POST(req({ message: "How much does it cost?" }))).json()).mode).toBe("faq");
    expect(f).not.toHaveBeenCalled();
  });

  it("falls back to the FAQ on network errors", async () => {
    vi.stubEnv("GEMINI_API_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn(async () => Promise.reject(new TypeError("fetch failed"))));
    const json = await (await POST(req({ message: "How much does it cost?" }))).json();
    expect(json.mode).toBe("faq");
  });
});
