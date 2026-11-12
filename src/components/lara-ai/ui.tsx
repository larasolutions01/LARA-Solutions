"use client";

import { useState, type ComponentProps, type ReactNode } from "react";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Info } from "lucide-react";
import type { AuthError } from "@supabase/supabase-js";
import { TextInput } from "@/components/forms/fields";
import { cn } from "@/lib/utils";

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-3xl border border-line bg-white p-6 shadow-[0_24px_60px_-36px_rgb(8_20_39/0.35)] sm:p-8", className)}>{children}</div>;
}

export function Notice({ tone = "info", children, className }: { tone?: "info" | "success" | "error"; children: ReactNode; className?: string }) {
  const Icon = tone === "success" ? CheckCircle2 : tone === "error" ? AlertCircle : Info;
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm leading-relaxed text-fg",
        tone === "success" && "border-fresh/40 bg-fresh/10",
        tone === "error" && "border-danger/35 bg-danger/[0.07]",
        tone === "info" && "border-accent/25 bg-accent/[0.06]",
        className,
      )}
    >
      <Icon aria-hidden className={cn("mt-0.5 size-4 shrink-0", tone === "success" ? "text-[#0b8a73]" : tone === "error" ? "text-danger" : "text-accent")} />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function PasswordInput(props: { id: string; error?: string; hint?: string } & Omit<ComponentProps<"input">, "type">) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <TextInput {...props} type={show ? "text" : "password"} className="pr-12" />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted hover:text-fg"
        aria-label={show ? "Hide password" : "Show password"}
        aria-pressed={show}
      >
        {show ? <EyeOff aria-hidden className="size-4" /> : <Eye aria-hidden className="size-4" />}
      </button>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className="size-5">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

export function GoogleButton({ onClick, busy, label = "Continue with Google" }: { onClick: () => void; busy?: boolean; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-line-strong bg-white text-[0.95rem] font-semibold text-fg transition-colors hover:border-accent hover:bg-section-tint disabled:opacity-60"
    >
      <GoogleMark /> {label}
    </button>
  );
}

export function OrDivider() {
  return (
    <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-muted" aria-hidden>
      <span className="h-px flex-1 bg-line" /> or <span className="h-px flex-1 bg-line" />
    </div>
  );
}

/** Supabase Auth errors → plain-English messages. */
export function authErrorMessage(error: Pick<AuthError, "message"> & { code?: string; status?: number }) {
  const code = error.code ?? "";
  const msg = error.message ?? "";
  if (code === "invalid_credentials" || /invalid login credentials/i.test(msg)) return "That email and password don't match. Please try again, or reset your password.";
  if (code === "email_not_confirmed" || /email not confirmed/i.test(msg)) return "Please confirm your email first — check your inbox for the link we sent.";
  if (code === "user_already_exists" || /already registered/i.test(msg)) return "An account with this email already exists. Please sign in instead.";
  if (code === "weak_password" || /password should/i.test(msg)) return "Please choose a stronger password (at least 8 characters, mixing letters and numbers).";
  if (code === "over_email_send_rate_limit" || /email rate limit/i.test(msg)) return "We've sent several emails already. Please wait a few minutes before trying again.";
  if (code === "over_request_rate_limit" || error.status === 429) return "Too many attempts. Please wait a minute and try again.";
  if (code === "captcha_failed" || /captcha/i.test(msg)) return "Please complete the security check and try again.";
  if (code === "email_address_invalid" || /email address .* invalid/i.test(msg)) return "Please enter a valid email address.";
  if (code === "signup_disabled") return "New sign-ups are paused right now. Please try again later.";
  if (code === "same_password") return "Please choose a password you haven't used before.";
  if (/provider is not enabled/i.test(msg)) return "Google sign-in isn't available yet. Please use email and password.";
  if (/fetch|network/i.test(msg)) return "Network error — please check your connection and try again.";
  return msg || "Something went wrong. Please try again.";
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
