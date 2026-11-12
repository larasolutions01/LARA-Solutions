import { describe, expect, it } from "vitest";
import { classifyAiReferrer } from "@/lib/analytics";

describe("AI referral classification", () => {
  it.each([
    ["https://chatgpt.com/", "ChatGPT"],
    ["https://chat.openai.com/c/123", "ChatGPT"],
    ["https://www.perplexity.ai/search?q=x", "Perplexity"],
    ["https://copilot.microsoft.com/", "Microsoft Copilot"],
    ["https://gemini.google.com/app", "Gemini"],
    ["https://claude.ai/chat/abc", "Claude"],
  ])("%s → %s", (ref, source) => {
    expect(classifyAiReferrer(ref)).toBe(source);
  });

  it.each(["https://www.google.com/", "https://evilchatgpt.com/", "https://claude.ai.example.com/", "not a url", ""])("ignores %s", (ref) => {
    expect(classifyAiReferrer(ref)).toBeUndefined();
  });
});
