"use client";

import Link from "next/link";
import { useEffect, useId, useRef, type ComponentProps, type ReactNode } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FormStatus } from "./useFormSubmit";

const control =
  "w-full rounded-xl border bg-card px-4 py-3 text-[0.95rem] text-fg placeholder:text-muted/70 transition-colors focus:border-accent focus:bg-card focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2";

export function Field({
  id,
  label,
  error,
  hint,
  optional,
  children,
  className,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between text-sm font-medium text-fg">
        <span>{label}</span>
        {optional && <span className="text-xs font-normal text-muted">Optional</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-xs text-danger" role="alert">
          <AlertCircle aria-hidden className="size-3.5" /> {error}
        </p>
      )}
    </div>
  );
}

const describedBy = (id: string, error?: string, hint?: string) => (error ? `${id}-error` : hint ? `${id}-hint` : undefined);

export function TextInput({ id, error, hint, className, ...rest }: { id: string; error?: string; hint?: string } & ComponentProps<"input">) {
  return (
    <input
      id={id}
      name={id}
      aria-invalid={Boolean(error) || undefined}
      aria-describedby={describedBy(id, error, hint)}
      className={cn(control, error ? "border-danger/70" : "border-line-strong", className)}
      {...rest}
    />
  );
}

export function TextArea({ id, error, hint, className, ...rest }: { id: string; error?: string; hint?: string } & ComponentProps<"textarea">) {
  return (
    <textarea
      id={id}
      name={id}
      aria-invalid={Boolean(error) || undefined}
      aria-describedby={describedBy(id, error, hint)}
      className={cn(control, "min-h-36 resize-y", error ? "border-danger/70" : "border-line-strong", className)}
      {...rest}
    />
  );
}

export function Select({
  id,
  error,
  options,
  placeholder,
  className,
  ...rest
}: { id: string; error?: string; options: readonly string[]; placeholder?: string } & ComponentProps<"select">) {
  return (
    <select
      id={id}
      name={id}
      aria-invalid={Boolean(error) || undefined}
      aria-describedby={describedBy(id, error)}
      className={cn(control, "appearance-none bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-10", error ? "border-danger/70" : "border-line-strong", className)}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
      }}
      {...rest}
    >
      {placeholder && (
        <option value="" className="bg-section-tint">
          {placeholder}
        </option>
      )}
      {options.map((o) => (
        <option key={o} value={o} className="bg-section-tint">
          {o}
        </option>
      ))}
    </select>
  );
}

export function ConsentCheckbox({
  id,
  checked,
  onChange,
  error,
  children,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: string;
  children?: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-body">
        <input
          id={id}
          name={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-1 size-4 shrink-0 cursor-pointer rounded border-line-strong accent-electric"
        />
        <span>
          {children ?? (
            <>
              I agree that LARA Solutions may store my details and contact me about this enquiry, as described in the{" "}
              <Link href="/privacy" className="text-muted underline underline-offset-2 hover:text-fg" target="_blank">
                Privacy Policy
              </Link>
              .
            </>
          )}
        </span>
      </label>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-danger">
          <AlertCircle aria-hidden className="size-3.5" /> {error}
        </p>
      )}
    </div>
  );
}

/** Off-screen honeypot. Real users never see or fill it. */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const id = useId();
  return (
    <div aria-hidden className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
      <label htmlFor={id}>Website</label>
      <input id={id} name="website" type="text" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export function FormStatusMessage({ status, message }: { status: FormStatus; message: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (status === "success" || status === "error") ref.current?.focus();
  }, [status, message]);
  if (!message || status === "idle" || status === "submitting") return <div aria-live="polite" className="sr-only" />;
  const ok = status === "success";
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role={ok ? "status" : "alert"}
      aria-live="polite"
      className={cn(
        "flex items-start gap-3 rounded-xl border px-4 py-3 text-sm",
        ok ? "border-success/40 bg-success/10 text-fg" : "border-danger/40 bg-danger/10 text-fg",
      )}
    >
      {ok ? <CheckCircle2 aria-hidden className="mt-0.5 size-4 shrink-0 text-success" /> : <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0 text-danger" />}
      <span>{message}</span>
    </div>
  );
}

export function Spinner() {
  return <Loader2 aria-hidden className="size-4 animate-spin" />;
}
