/**
 * Server-side Supabase access for LARA AI (REST, no SDK — like lib/server/leads.ts).
 *
 *  - Verifies a member's access token with Supabase Auth (`/auth/v1/user`).
 *  - Reads/writes the member's own profile row through PostgREST using *their*
 *    token, so Row Level Security (supabase/migrations/0002) is the guard.
 *  - Deletes an account with the service-role key (only for "delete my account").
 */
import type { LaraAiProfile, ProfileValues, SignupMetadata } from "../profile";

type Env = Record<string, string | undefined>;
interface Opts {
  env?: Env;
  fetchImpl?: typeof fetch;
}

export const PROFILES_TABLE = "lara_ai_profiles";

export function supabaseServerConfig(env: Env = process.env) {
  const url = (env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL || "").trim().replace(/\/+$/, "");
  const key = (env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();
  const serviceKey = (env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  return { url, key, serviceKey, configured: Boolean(url && key) };
}

/** Supabase couldn't be reached or answered unexpectedly (not the member's fault). */
export class SupabaseUnavailable extends Error {
  name = "SupabaseUnavailable";
}

export interface AuthUser {
  id: string;
  email: string;
  provider: string;
  metadata: SignupMetadata;
}

export function bearerToken(headers: Headers) {
  const m = /^Bearer\s+([A-Za-z0-9._~+/=-]{20,4096})$/.exec(headers.get("authorization")?.trim() ?? "");
  return m?.[1] ?? null;
}

async function call(fetchImpl: typeof fetch, url: string, init: RequestInit) {
  try {
    return await fetchImpl(url, { ...init, cache: "no-store", signal: AbortSignal.timeout(6000) });
  } catch (e) {
    throw new SupabaseUnavailable(`Supabase request failed: ${(e as Error)?.message ?? e}`);
  }
}

/** The signed-in member for this access token, or null if it's missing, expired or invalid. */
export async function getUserFromToken(token: string, { env = process.env, fetchImpl = fetch }: Opts = {}): Promise<AuthUser | null> {
  const { url, key } = supabaseServerConfig(env);
  const res = await call(fetchImpl, `${url}/auth/v1/user`, { headers: { apikey: key, Authorization: `Bearer ${token}` } });
  if (res.status === 401 || res.status === 403) return null;
  if (!res.ok) throw new SupabaseUnavailable(`Supabase Auth responded ${res.status}`);
  const u = (await res.json().catch(() => null)) as {
    id?: string;
    email?: string;
    app_metadata?: { provider?: string };
    user_metadata?: SignupMetadata;
  } | null;
  if (!u?.id || !u.email) return null;
  return { id: u.id, email: u.email, provider: u.app_metadata?.provider ?? "email", metadata: u.user_metadata ?? {} };
}

export type AuthResult = { ok: true; user: AuthUser; token: string } | { ok: false; status: 401 | 503; code: "auth_required" | "unavailable" | "auth_unavailable" };

/** Authenticate an API request from its `Authorization: Bearer <token>` header. */
export async function authenticate(request: Request, opts: Opts = {}): Promise<AuthResult> {
  if (!supabaseServerConfig(opts.env).configured) return { ok: false, status: 503, code: "unavailable" };
  const token = bearerToken(request.headers);
  if (!token) return { ok: false, status: 401, code: "auth_required" };
  try {
    const user = await getUserFromToken(token, opts);
    return user ? { ok: true, user, token } : { ok: false, status: 401, code: "auth_required" };
  } catch (e) {
    console.error("[lara-ai] auth check failed", (e as Error).message);
    return { ok: false, status: 503, code: "auth_unavailable" };
  }
}

interface ProfileRow {
  id: string;
  email: string;
  full_name: string;
  business_name: string | null;
  phone: string | null;
  newsletter: boolean;
  signup_method: string;
  created_at: string;
}

const toProfile = (r: ProfileRow): LaraAiProfile => ({
  email: r.email,
  fullName: r.full_name,
  businessName: r.business_name ?? "",
  phone: r.phone ?? "",
  newsletter: Boolean(r.newsletter),
  signupMethod: r.signup_method === "google" ? "google" : "email",
  createdAt: r.created_at,
});

const restHeaders = (key: string, token: string, extra: Record<string, string> = {}) => ({
  apikey: key,
  Authorization: `Bearer ${token}`,
  Accept: "application/json",
  ...extra,
});

/** The member's profile, or null if they haven't completed it yet. */
export async function fetchProfile(user: AuthUser, token: string, { env = process.env, fetchImpl = fetch }: Opts = {}) {
  const { url, key } = supabaseServerConfig(env);
  const res = await call(fetchImpl, `${url}/rest/v1/${PROFILES_TABLE}?id=eq.${encodeURIComponent(user.id)}&select=*`, { headers: restHeaders(key, token) });
  if (!res.ok) throw new SupabaseUnavailable(`Profile read responded ${res.status}`);
  const rows = (await res.json().catch(() => [])) as ProfileRow[];
  return rows[0] ? toProfile(rows[0]) : null;
}

/** Create or update the member's own profile. `created` is true the first time. */
export async function saveProfile(user: AuthUser, token: string, values: ProfileValues, opts: Opts = {}) {
  const { env = process.env, fetchImpl = fetch } = opts;
  const { url, key } = supabaseServerConfig(env);
  const existing = await fetchProfile(user, token, opts);
  const now = new Date().toISOString();
  const fields = {
    email: user.email,
    full_name: values.fullName,
    business_name: values.businessName || null,
    phone: values.phone || null,
    newsletter: values.newsletter,
    updated_at: now,
  };
  const res = existing
    ? await call(fetchImpl, `${url}/rest/v1/${PROFILES_TABLE}?id=eq.${encodeURIComponent(user.id)}`, {
        method: "PATCH",
        headers: restHeaders(key, token, { "Content-Type": "application/json", Prefer: "return=representation" }),
        body: JSON.stringify(fields),
      })
    : await call(fetchImpl, `${url}/rest/v1/${PROFILES_TABLE}`, {
        method: "POST",
        headers: restHeaders(key, token, { "Content-Type": "application/json", Prefer: "return=representation" }),
        body: JSON.stringify({ id: user.id, ...fields, signup_method: user.provider === "google" ? "google" : "email", terms_accepted_at: now }),
      });
  if (!res.ok) throw new SupabaseUnavailable(`Profile save responded ${res.status}: ${(await res.text().catch(() => "")).slice(0, 200)}`);
  const rows = (await res.json().catch(() => [])) as ProfileRow[];
  if (!rows[0]) throw new SupabaseUnavailable("Profile save returned no row");
  return { profile: toProfile(rows[0]), created: !existing };
}

/** Permanently delete a member's account (their profile row is removed with it). Needs the service-role key. */
export async function deleteAuthUser(userId: string, { env = process.env, fetchImpl = fetch }: Opts = {}) {
  const { url, serviceKey } = supabaseServerConfig(env);
  if (!serviceKey) throw new SupabaseUnavailable("SUPABASE_SERVICE_ROLE_KEY is not set");
  const res = await call(fetchImpl, `${url}/auth/v1/admin/users/${encodeURIComponent(userId)}`, {
    method: "DELETE",
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
  });
  if (!res.ok && res.status !== 404) throw new SupabaseUnavailable(`Account delete responded ${res.status}`);
}
