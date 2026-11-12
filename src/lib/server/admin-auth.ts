/**
 * Minimal, dependency-free admin authentication.
 *
 *  - Password: ADMIN_PASSWORD (server-only env var). Compared in constant time.
 *  - Session: `v1.<expiry>.<HMAC-SHA256 signature>` in an httpOnly, Secure,
 *    SameSite=Strict cookie, signed with ADMIN_SESSION_SECRET (≥ 32 chars).
 *
 * Uses Web Crypto so it works in both the Node.js and edge runtimes.
 */

export const ADMIN_COOKIE = "lara_admin";
export const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

type Env = Record<string, string | undefined>;

export function adminConfigured(env: Env = process.env) {
  return Boolean(env.ADMIN_PASSWORD && env.ADMIN_PASSWORD.length >= 12 && (env.ADMIN_SESSION_SECRET?.length ?? 0) >= 32);
}

const enc = new TextEncoder();

function toBase64Url(buf: ArrayBuffer) {
  let s = "";
  for (const b of new Uint8Array(buf)) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function sign(data: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return toBase64Url(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}

async function sha256(input: string) {
  return toBase64Url(await crypto.subtle.digest("SHA-256", enc.encode(input)));
}

export async function createSessionToken(env: Env = process.env, now = Date.now()) {
  const secret = env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not configured");
  const payload = `v1.${now + SESSION_TTL_MS}`;
  return `${payload}.${await sign(payload, secret)}`;
}

export async function verifySessionToken(token: string | undefined, env: Env = process.env, now = Date.now()) {
  const secret = env.ADMIN_SESSION_SECRET;
  if (!token || !secret) return false;
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "v1") return false;
  const exp = Number(parts[1]);
  if (!Number.isFinite(exp) || exp <= now) return false;
  const expected = await sign(`${parts[0]}.${parts[1]}`, secret);
  return safeEqual(expected, parts[2]!);
}

export async function checkPassword(input: string, env: Env = process.env) {
  const real = env.ADMIN_PASSWORD;
  if (!real) return false;
  // Hash both sides so comparison time doesn't depend on length or content.
  return safeEqual(await sha256(input), await sha256(real));
}
