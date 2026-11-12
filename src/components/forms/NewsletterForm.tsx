"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { newsletterSchema } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { FormStatusMessage, Honeypot, Spinner } from "./fields";
import { useFormSubmit } from "./useFormSubmit";

export function NewsletterForm({ className, labelledBy = "newsletter-label" }: { className?: string; labelledBy?: string }) {
  const uid = useId();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const { status, message, errors, submit } = useFormSubmit("/api/newsletter", newsletterSchema);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (await submit({ email, consent: consent as true }, honeypot)) setEmail("");
  };

  if (status === "success") return <FormStatusMessage status={status} message={message} />;

  return (
    <form onSubmit={onSubmit} noValidate className={cn("relative space-y-3", className)} aria-labelledby={labelledBy}>
      <Honeypot value={honeypot} onChange={setHoneypot} />
      <div className="flex rounded-full border border-line-strong bg-card p-1 focus-within:border-accent">
        <label htmlFor={`${uid}-email`} className="sr-only">
          Email address
        </label>
        <input
          id={`${uid}-email`}
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={Boolean(errors.email) || undefined}
          aria-describedby={errors.email ? `${uid}-error` : undefined}
          className="min-w-0 flex-1 bg-transparent px-4 text-sm text-fg placeholder:text-muted/70 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          aria-label="Subscribe"
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-ink transition-transform hover:scale-105"
        >
          {status === "submitting" ? <Spinner /> : <ArrowRight aria-hidden className="size-4" />}
        </button>
      </div>
      <label className="flex items-start gap-2 text-xs leading-relaxed text-muted">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 accent-electric" />
        <span>
          I agree to receive emails and accept the{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-fg">
            Privacy Policy
          </Link>
          .
        </span>
      </label>
      {(errors.email || errors.consent || status === "error") && (
        <p id={`${uid}-error`} role="alert" className="text-xs text-danger">
          {errors.email || errors.consent || message}
        </p>
      )}
    </form>
  );
}
