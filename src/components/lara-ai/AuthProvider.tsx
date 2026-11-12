"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { laraAiFetch, laraAiSupabase } from "@/lib/lara-ai/supabase-browser";
import type { LaraAiProfile, ProfileInput } from "@/lib/lara-ai/profile";
import { track } from "@/lib/analytics";

export type AuthStatus = "unconfigured" | "loading" | "signed_out" | "signed_in";

export interface ProfileState {
  /** undefined = not loaded yet, null = signed in but no profile yet (needs onboarding). */
  profile: LaraAiProfile | null | undefined;
  email: string;
  provider: string;
  suggestedName: string;
  error?: string;
}

interface AuthContextValue {
  status: AuthStatus;
  session: Session | null;
  profileState: ProfileState;
  setProfile: (p: LaraAiProfile) => void;
  reloadProfile: () => void;
  signOut: () => Promise<void>;
}

const emptyProfile: ProfileState = { profile: undefined, email: "", provider: "email", suggestedName: "" };
const AuthContext = createContext<AuthContextValue | null>(null);

export function useLaraAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useLaraAuth must be used inside <LaraAuthProvider>");
  return ctx;
}

export function LaraAuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [session, setSession] = useState<Session | null>(null);
  const [profileState, setProfileState] = useState<ProfileState>(emptyProfile);
  const [reloadKey, setReloadKey] = useState(0);
  const userId = session?.user.id;

  // Session: read what this browser has, then follow sign-in / sign-out / refresh events.
  useEffect(() => {
    const sb = laraAiSupabase();
    if (!sb) {
      setStatus("unconfigured");
      return;
    }
    let active = true;
    sb.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setStatus(data.session ? "signed_in" : "signed_out");
    });
    // Only set state here — Supabase advises against awaiting its own calls inside this callback.
    const { data: sub } = sb.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setStatus(s ? "signed_in" : "signed_out");
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // Profile: load once per member (not on every token refresh).
  useEffect(() => {
    if (status !== "signed_in" || !userId) {
      setProfileState(emptyProfile);
      return;
    }
    let cancelled = false;
    (async () => {
      setProfileState((p) => ({ ...p, error: undefined }));
      try {
        const res = await laraAiFetch("/api/lara-ai/profile");
        const data = (await res.json().catch(() => ({}))) as {
          profile?: LaraAiProfile | null;
          prefill?: ProfileInput | null;
          email?: string;
          provider?: string;
          suggestedName?: string;
          error?: string;
        };
        if (res.status === 401) {
          await laraAiSupabase()?.auth.signOut();
          return;
        }
        if (!res.ok) throw new Error(data.error ?? "We couldn't load your account. Please try again.");
        let profile = data.profile ?? null;
        // Signed up with the LARA AI form: create the profile from those details without asking again.
        if (!profile && data.prefill) {
          const saved = await laraAiFetch("/api/lara-ai/profile", { method: "PUT", body: JSON.stringify(data.prefill) });
          if (saved.ok) {
            profile = ((await saved.json()) as { profile: LaraAiProfile }).profile;
            track("lara_ai_signup", { method: "email" });
          }
        }
        if (!cancelled)
          setProfileState({ profile, email: data.email ?? "", provider: data.provider ?? "email", suggestedName: data.suggestedName ?? "" });
      } catch (e) {
        if (!cancelled) setProfileState((p) => ({ ...p, error: (e as Error).message || "We couldn't load your account. Please try again." }));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status, userId, reloadKey]);

  const setProfile = useCallback((profile: LaraAiProfile) => setProfileState((p) => ({ ...p, profile, error: undefined })), []);
  const reloadProfile = useCallback(() => setReloadKey((k) => k + 1), []);
  const signOut = useCallback(async () => {
    await laraAiSupabase()?.auth.signOut();
    track("lara_ai_sign_out");
  }, []);

  const value = useMemo(() => ({ status, session, profileState, setProfile, reloadProfile, signOut }), [status, session, profileState, setProfile, reloadProfile, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
