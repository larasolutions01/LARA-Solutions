/**
 * Simple in-memory sliding-window rate limiter.
 * Good enough for a single instance / low-traffic marketing site. For
 * multi-instance production deployments, swap the store for Redis/Upstash
 * (same interface) — see README.
 */

export interface RateLimiter {
  check(key: string): { allowed: boolean; retryAfterSeconds: number };
}

export function createRateLimiter({ limit, windowMs, now = () => Date.now() }: { limit: number; windowMs: number; now?: () => number }): RateLimiter {
  const hits = new Map<string, number[]>();

  return {
    check(key: string) {
      const t = now();
      const recent = (hits.get(key) ?? []).filter((ts) => t - ts < windowMs);
      if (recent.length >= limit) {
        hits.set(key, recent);
        const oldest = recent[0] ?? t;
        return { allowed: false, retryAfterSeconds: Math.ceil((windowMs - (t - oldest)) / 1000) };
      }
      recent.push(t);
      hits.set(key, recent);
      // opportunistic cleanup to bound memory
      if (hits.size > 5000) {
        for (const [k, v] of hits) if (!v.some((ts) => t - ts < windowMs)) hits.delete(k);
      }
      return { allowed: true, retryAfterSeconds: 0 };
    },
  };
}

export function clientIp(headers: Headers) {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
}
