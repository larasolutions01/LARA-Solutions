import { authenticate, fetchProfile, saveProfile, SupabaseUnavailable } from "@/lib/lara-ai/server/supabase";
import { AUTH_MESSAGES, reply } from "@/lib/lara-ai/server/respond";
import { fieldErrorsOf, profileFromMetadata, profileSchema } from "@/lib/lara-ai/profile";
import { deliverLead } from "@/lib/server/leads";
import { clientIp } from "@/lib/rate-limit";

/**
 * GET /api/lara-ai/profile — the signed-in member's profile (null until completed),
 *   plus what the app can prefill (name from Google, or the sign-up form).
 * PUT /api/lara-ai/profile — create or update it. The first save also sends a
 *   "lara_ai_signup" lead through the normal lead pipeline (email/CRM/storage).
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 4 * 1024;

export async function GET(request: Request) {
  const auth = await authenticate(request);
  if (!auth.ok) return reply(auth.status, { error: AUTH_MESSAGES[auth.code], code: auth.code });
  try {
    const profile = await fetchProfile(auth.user, auth.token);
    const meta = auth.user.metadata;
    return reply(200, {
      email: auth.user.email,
      provider: auth.user.provider,
      profile,
      prefill: profileFromMetadata(meta),
      suggestedName: (meta.full_name || meta.name || "").slice(0, 100),
    });
  } catch (e) {
    console.error("[lara-ai] profile read failed", (e as Error).message);
    return reply(503, { error: "We couldn't load your profile just now. Please try again.", code: "profile_unavailable" });
  }
}

export async function PUT(request: Request) {
  const auth = await authenticate(request);
  if (!auth.ok) return reply(auth.status, { error: AUTH_MESSAGES[auth.code], code: auth.code });

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return reply(413, { error: "That's too much text.", code: "too_large" });
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return reply(400, { error: "Invalid request.", code: "invalid" });
  }
  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) return reply(400, { error: "Please check the highlighted fields.", code: "invalid", fieldErrors: fieldErrorsOf(parsed.error) });

  try {
    const { profile, created } = await saveProfile(auth.user, auth.token, parsed.data);
    if (created) {
      // New member → a lead for the team. Never block or fail the sign-up on this.
      try {
        const report = await deliverLead({
          type: "lara_ai_signup",
          name: profile.fullName,
          email: profile.email,
          company: profile.businessName || undefined,
          phone: profile.phone || undefined,
          message: "Created a free LARA AI account.",
          details: { newsletter: profile.newsletter, signupMethod: profile.signupMethod },
          consent: true,
          meta: { ip: clientIp(request.headers), userAgent: request.headers.get("user-agent") ?? undefined, referer: request.headers.get("referer") ?? undefined },
        });
        if (!report.ok) console.warn("[lara-ai] sign-up lead not delivered", { configured: report.configured, failed: report.failed });
      } catch (e) {
        console.error("[lara-ai] sign-up lead failed", (e as Error).message);
      }
    }
    return reply(200, { profile, created });
  } catch (e) {
    console.error("[lara-ai] profile save failed", (e as Error).message);
    const status = e instanceof SupabaseUnavailable ? 503 : 500;
    return reply(status, { error: "We couldn't save your details just now. Please try again.", code: "profile_unavailable" });
  }
}
