import { describe, expect, it } from "vitest";
import { AI_SEARCH_AGENTS, AI_TRAINING_AGENTS, crawlerRules, PRIVATE_PATHS } from "@/lib/crawlers";

type Rule = { userAgent: string | string[]; allow?: string | string[]; disallow?: string | string[] };
const rules = (env: Record<string, string | undefined>) => crawlerRules(env) as Rule[];
const groupFor = (rs: Rule[], agent: string) => rs.find((r) => Array.isArray(r.userAgent) && r.userAgent.includes(agent))!;

describe("crawler policy", () => {
  it("allows search engines everywhere except private paths", () => {
    const star = rules({}).find((r) => r.userAgent === "*")!;
    expect(star.allow).toBe("/");
    expect(star.disallow).toEqual(PRIVATE_PATHS);
  });

  it("defaults to allowing AI search and training crawlers, still excluding private paths", () => {
    const rs = rules({});
    expect(groupFor(rs, "OAI-SearchBot").disallow).toEqual(PRIVATE_PATHS);
    expect(groupFor(rs, "GPTBot").disallow).toEqual(PRIVATE_PATHS);
  });

  it("can block AI training crawlers without affecting AI search", () => {
    const rs = rules({ AI_TRAINING_CRAWLERS: "block" });
    for (const a of AI_TRAINING_AGENTS) expect(groupFor(rs, a).disallow).toBe("/");
    for (const a of AI_SEARCH_AGENTS) expect(groupFor(rs, a).allow).toBe("/");
  });

  it("can block AI search crawlers independently", () => {
    const rs = rules({ AI_SEARCH_CRAWLERS: "BLOCK" });
    expect(groupFor(rs, "PerplexityBot").disallow).toBe("/");
    expect(groupFor(rs, "ClaudeBot").allow).toBe("/");
  });

  it("does not list search-engine bots in AI groups", () => {
    const all = [...AI_SEARCH_AGENTS, ...AI_TRAINING_AGENTS] as string[];
    expect(all).not.toContain("Googlebot");
    expect(all).not.toContain("Bingbot");
  });
});
