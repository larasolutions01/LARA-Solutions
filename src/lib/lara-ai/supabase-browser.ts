"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL, laraAiAuthConfigured } from "./config";

/**
 * The browser's Supabase client, used only for sign-up / sign-in / sign-out.
 * PKCE flow; the callback page exchanges codes explicitly (detectSessionInUrl
 * off) so there's exactly one place that handles auth redirects. Sessions are
 * kept in this browser and refreshed automatically; API calls send the access
 * token as a Bearer header, which the server verifies with Supabase.
 */
let client: SupabaseClient | null = null;

export function laraAiSupabase(): SupabaseClient | null {
  if (!laraAiAuthConfigured) return null;
  client ??= createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { flowType: "pkce", detectSessionInUrl: false, persistSession: true, autoRefreshToken: true, storageKey: "lara-ai-auth" },
  });
  return client;
}

/** Current access token (refreshed first if it has expired), or null when signed out. */
export async function laraAiAccessToken() {
  const sb = laraAiSupabase();
  if (!sb) return null;
  const { data } = await sb.auth.getSession();
  return data.session?.access_token ?? null;
}

/** fetch() to a LARA AI API route with the member's access token attached. */
export async function laraAiFetch(path: string, init: RequestInit = {}) {
  const token = await laraAiAccessToken();
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  return fetch(path, { ...init, headers, cache: "no-store" });
}
