/**
 * Basic abuse and cost protection for Gemini usage — no database.
 *
 *  - Per LARA AI member (account), AI tools: a short burst limit and a daily limit.
 *  - Site-wide, shared by the AI tools and the website assistant (they use the
 *    same Gemini key and free quota): a daily request cap and a daily spending
 *    cap (estimated from the token counts Gemini reports, at paid-tier prices,
 *    so the cap still protects you if billing is ever enabled).
 *
 * Counters live in server memory, so on serverless hosting each running
 * instance keeps its own count and a cold start resets it. That makes these
 * caps a soft guard; the hard ceiling is Google's own free-tier quota (no
 * charges are possible on a key without billing). See docs/AI-TOOLS.md.
 */
import { createRateLimiter, type RateLimiter } from "@/lib/rate-limit";
import type { AiUsage } from "@/lib/server/gemini";

type Env = Record<string, string | undefined>;

/** Paid-tier prices for the default model (USD per 1M tokens), used only for the spending estimate. */
export const PRICE_PER_M = { input: 0.3, output: 2.5 };

const num = (v: string | undefined, fallback: number) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

/** Day key in India time, so the site-wide cap resets at midnight IST. */
const dayKey = (t: number) => new Date(t + 5.5 * 3600 * 1000).toISOString().slice(0, 10);

export function createUsageGuard({ env = process.env, now = () => Date.now() }: { env?: Env; now?: () => number } = {}) {
  const dailyLimit = num(env.AI_TOOLS_DAILY_LIMIT, 300);
  const dailyBudgetUsd = num(env.AI_TOOLS_DAILY_BUDGET_USD, 1);
  const perMemberDaily = num(env.AI_TOOLS_USER_DAILY_LIMIT, 30);
  const burst: RateLimiter = createRateLimiter({ limit: 5, windowMs: 60_000, now });
  const memberDay: RateLimiter = createRateLimiter({ limit: perMemberDaily, windowMs: 24 * 3600 * 1000, now });
  let day = dayKey(now());
  let requests = 0;
  let costUsd = 0;

  const roll = () => {
    const d = dayKey(now());
    if (d !== day) {
      day = d;
      requests = 0;
      costUsd = 0;
    }
  };

  const siteFull = () => requests >= dailyLimit || costUsd >= dailyBudgetUsd;

  return {
    /** Reserve one AI tool generation for this member (key = their account id), or explain why not. */
    reserve(key: string): { ok: true } | { ok: false; reason: "burst" | "member_daily" | "site_daily"; retryAfterSeconds?: number } {
      roll();
      if (siteFull()) return { ok: false, reason: "site_daily" };
      const b = burst.check(key);
      if (!b.allowed) return { ok: false, reason: "burst", retryAfterSeconds: b.retryAfterSeconds };
      const d = memberDay.check(key);
      if (!d.allowed) return { ok: false, reason: "member_daily", retryAfterSeconds: d.retryAfterSeconds };
      requests += 1;
      return { ok: true };
    },
    /**
     * Reserve one call against the site-wide caps only (the website assistant
     * has its own per-visitor limiter). False once today's shared cap is used.
     */
    reserveSite(): boolean {
      roll();
      if (siteFull()) return false;
      requests += 1;
      return true;
    },
    /** Add the actual token cost after a successful generation. */
    record(usage: AiUsage) {
      roll();
      costUsd += (usage.inputTokens * PRICE_PER_M.input + usage.outputTokens * PRICE_PER_M.output) / 1_000_000;
    },
    /** Upstream quota exhausted (Google 429): stop calling for the rest of the day. */
    exhaust() {
      roll();
      requests = Math.max(requests, dailyLimit);
    },
    snapshot: () => ({ day, requests, costUsd, dailyLimit, dailyBudgetUsd, perMemberDaily }),
  };
}

let guard: ReturnType<typeof createUsageGuard> | undefined;
export const usageGuard = () => (guard ??= createUsageGuard());
/** Test helper. */
export const resetUsageGuard = () => {
  guard = undefined;
};
