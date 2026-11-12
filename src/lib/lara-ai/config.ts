/**
 * LARA AI — the signed-in app that hosts the free AI tools (browser-safe).
 *
 * Accounts use Supabase Auth (email & password, plus Google when enabled).
 * The publishable key is designed to be public; it only allows what Row Level
 * Security permits. Server-only settings live in ./server/supabase.ts.
 */

export const LARA_AI_BASE = "/lara-ai";
export const laraAiPath = (slug?: string) => (slug ? `${LARA_AI_BASE}/${slug}` : LARA_AI_BASE);

// NEXT_PUBLIC_* values must be referenced literally so Next.js can inline them in the browser bundle.
export const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/+$/, "");
export const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/** True once the Supabase project URL and publishable key are set. */
export const laraAiAuthConfigured = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);

/** Show "Continue with Google" only after the Google provider is switched on in Supabase. */
export const googleSignInEnabled = process.env.NEXT_PUBLIC_LARA_AI_GOOGLE_SIGNIN === "true";

export const PASSWORD_MIN = 8;

/**
 * Where to send someone after an auth redirect. Only paths inside LARA AI are
 * allowed, so a crafted link can't bounce users to another site.
 */
export function safeNext(next: string | null | undefined, fallback: string = LARA_AI_BASE) {
  if (!next || typeof next !== "string") return fallback;
  if (!next.startsWith(`${LARA_AI_BASE}`) || next.startsWith("//") || next.includes("\\") || /[\r\n]/.test(next)) return fallback;
  const rest = next.slice(LARA_AI_BASE.length);
  if (rest && !/^[/?#]/.test(rest)) return fallback; // e.g. "/lara-ai.evil.com"
  return next;
}

/** The OAuth / email-link landing page, carrying where to go afterwards. */
export const authCallbackUrl = (origin: string, next: string) => `${origin}${LARA_AI_BASE}/auth/callback?next=${encodeURIComponent(safeNext(next))}`;
