import { z } from "zod";
import { antiSpamSchema, toFieldErrors, type FieldErrors } from "@/lib/validation";
import { clientIp, createRateLimiter, type RateLimiter } from "@/lib/rate-limit";
import { deliverLead, type DeliveryReport, type Lead } from "./leads";

export type SubmissionResponse =
  | { ok: true; id: string; message: string }
  | { ok: false; error: string; fieldErrors?: FieldErrors };

const MIN_FILL_MS = 2500;

/** Optional first-touch attribution sent by the browser (session only, never required). */
const attributionSchema = z
  .object({
    landingPage: z.string().max(300).optional(),
    referrer: z.string().max(300).optional(),
    aiSource: z.string().max(60).optional(),
    utmSource: z.string().max(100).optional(),
    utmMedium: z.string().max(100).optional(),
    utmCampaign: z.string().max(100).optional(),
  })
  .optional();

const defaultLimiter = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

export async function verifyTurnstile(token: string | undefined, ip: string, env = process.env): Promise<boolean> {
  const secret = env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not configured → honeypot + time trap + rate limit only
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret, response: token, remoteip: ip });
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body, signal: AbortSignal.timeout(6000) });
    const data = (await res.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch {
    return false;
  }
}

function json(body: SubmissionResponse, status: number, headers?: Record<string, string>) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

interface HandleOptions<S extends z.ZodTypeAny> {
  schema: S;
  toLead: (data: z.output<S>, meta: Lead["meta"]) => Lead;
  successMessage: string;
  limiter?: RateLimiter;
  deliver?: (lead: Lead) => Promise<DeliveryReport>;
  now?: () => number;
}

/**
 * Shared request pipeline for every public form:
 * size guard → rate limit → anti-spam → validation → delivery → response.
 */
export async function handleSubmission<S extends z.ZodTypeAny>(request: Request, opts: HandleOptions<S>): Promise<Response> {
  const { schema, toLead, successMessage, limiter = defaultLimiter, deliver = deliverLead, now = Date.now } = opts;

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return json({ ok: false, error: "Unsupported content type." }, 415);

  const raw = await request.text();
  if (raw.length > 20_000) return json({ ok: false, error: "Submission is too large." }, 413);

  const ip = clientIp(request.headers);
  const rl = limiter.check(ip);
  if (!rl.allowed) {
    return json({ ok: false, error: "Too many submissions. Please try again in a few minutes." }, 429, { "Retry-After": String(rl.retryAfterSeconds) });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "Invalid request body." }, 400);
  }

  const spam = antiSpamSchema.safeParse(body);
  const spamData = spam.success ? spam.data : undefined;
  const filledTooFast = spamData?.startedAt !== undefined && now() - spamData.startedAt < MIN_FILL_MS;
  if (!spam.success || filledTooFast) {
    // Respond as if successful so bots learn nothing; nothing is stored.
    return json({ ok: true, id: "discarded", message: successMessage }, 200);
  }

  if (!(await verifyTurnstile(spamData?.turnstileToken, ip))) {
    return json({ ok: false, error: "We couldn’t verify you’re human. Please refresh and try again." }, 400);
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return json({ ok: false, error: "Please check the highlighted fields.", fieldErrors: toFieldErrors(parsed.error) }, 422);
  }

  const attribution = attributionSchema.safeParse((body as { attribution?: unknown }).attribution);
  const lead = toLead(parsed.data, {
    ip,
    userAgent: request.headers.get("user-agent")?.slice(0, 300) ?? undefined,
    referer: request.headers.get("referer")?.slice(0, 500) ?? undefined,
  });
  if (attribution.success && attribution.data && Object.values(attribution.data).some(Boolean)) {
    lead.details = { ...(lead.details ?? {}), attribution: attribution.data };
  }

  try {
    const report = await deliver(lead);
    if (!report.ok) {
      const notConfigured = report.configured.length === 0;
      console.error("[leads] delivery failed", { configured: report.configured, failed: report.failed });
      return json(
        {
          ok: false,
          error: notConfigured
            ? "Our enquiry system is being set up. Please try again later or reach us through another channel."
            : "We couldn’t send your message just now. Please try again in a moment.",
        },
        503,
      );
    }
    return json({ ok: true, id: report.id, message: successMessage }, 200);
  } catch (err) {
    console.error("[leads] unexpected error", err);
    return json({ ok: false, error: "Something went wrong on our side. Please try again." }, 500);
  }
}
