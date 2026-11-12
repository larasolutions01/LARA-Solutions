import type { MetadataRoute } from "next";

/**
 * Crawler policy — distinguishes three kinds of automated visitor so the
 * owner can make a deliberate choice for each (see docs/SEO-AUDIT.md):
 *
 * 1. Search engines (Googlebot, Bingbot, …) — always allowed via "*".
 * 2. AI search / retrieval agents — fetch pages to answer a user's question
 *    and usually link back to the source. Controlled by AI_SEARCH_CRAWLERS.
 * 3. AI training crawlers — collect content to train models. Controlled by
 *    AI_TRAINING_CRAWLERS. Owner decision (8 Nov 2026): allow both groups.
 *
 * Values: "allow" (default) or "block". robots.txt is a voluntary standard:
 * reputable crawlers follow it, malicious bots do not — keep rate limiting,
 * Turnstile and any CDN bot protection in place regardless of this policy.
 * User-agent tokens change over time; re-check each vendor's documentation.
 */

export const AI_SEARCH_AGENTS = [
  "OAI-SearchBot", // ChatGPT search results
  "ChatGPT-User", // fetches made on behalf of a ChatGPT user
  "Claude-SearchBot", // Claude search results
  "Claude-User", // fetches made on behalf of a Claude user
  "PerplexityBot", // Perplexity search index
  "Perplexity-User", // fetches made on behalf of a Perplexity user
] as const;

export const AI_TRAINING_AGENTS = [
  "GPTBot", // OpenAI model training
  "ClaudeBot", // Anthropic model training
  "Google-Extended", // Gemini training/grounding control token — does NOT affect Google Search
  "Applebot-Extended", // Apple AI training control token — does NOT affect Apple search
  "CCBot", // Common Crawl (widely used in training datasets)
  "Meta-ExternalAgent", // Meta AI training
] as const;

/** Paths no crawler should fetch. */
export const PRIVATE_PATHS = ["/api/", "/admin", "/cms"];

type Policy = "allow" | "block";
const policy = (v: string | undefined): Policy => (v?.trim().toLowerCase() === "block" ? "block" : "allow");

export function crawlerRules(env: Record<string, string | undefined> = process.env): MetadataRoute.Robots["rules"] {
  const search = policy(env.AI_SEARCH_CRAWLERS);
  const training = policy(env.AI_TRAINING_CRAWLERS);
  // A crawler that matches a named group ignores the "*" group, so every
  // group repeats the private-path rules.
  const group = (agents: readonly string[], p: Policy) =>
    p === "allow" ? { userAgent: [...agents], allow: "/", disallow: PRIVATE_PATHS } : { userAgent: [...agents], disallow: "/" };

  return [{ userAgent: "*", allow: "/", disallow: PRIVATE_PATHS }, group(AI_SEARCH_AGENTS, search), group(AI_TRAINING_AGENTS, training)];
}
