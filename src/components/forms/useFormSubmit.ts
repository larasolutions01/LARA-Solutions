"use client";

import { useCallback, useRef, useState } from "react";
import type { z } from "zod";
import { toFieldErrors, type FieldErrors } from "@/lib/validation";
import { readAttribution, track } from "@/lib/analytics";

export type FormStatus = "idle" | "submitting" | "success" | "error";

/**
 * Client-side submission helper: validates with the shared zod schema,
 * attaches anti-spam fields, posts JSON, and normalises server responses.
 */
export function useFormSubmit<S extends z.ZodTypeAny>(endpoint: string, schema: S) {
  const startedAt = useRef<number>(Date.now());
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState<string>("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [turnstileToken, setTurnstileToken] = useState<string | undefined>();

  const submit = useCallback(
    async (values: z.input<S>, honeypot = "") => {
      const parsed = schema.safeParse(values);
      if (!parsed.success) {
        setErrors(toFieldErrors(parsed.error));
        setStatus("error");
        setMessage("Please check the highlighted fields.");
        return false;
      }
      setErrors({});
      setStatus("submitting");
      setMessage("");
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...(values as object), website: honeypot, startedAt: startedAt.current, turnstileToken, attribution: readAttribution() }),
        });
        const data = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string; error?: string; fieldErrors?: FieldErrors };
        if (res.ok && data.ok) {
          setStatus("success");
          const attribution = readAttribution();
          track("generate_lead", { form: endpoint.replace("/api/", ""), ai_source: attribution?.aiSource });
          setMessage(data.message ?? "Thank you — we’ve received your message.");
          return true;
        }
        setErrors(data.fieldErrors ?? {});
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
        return false;
      } catch {
        setStatus("error");
        setMessage("Network error — please check your connection and try again.");
        return false;
      }
    },
    [endpoint, schema, turnstileToken],
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setMessage("");
    setErrors({});
    startedAt.current = Date.now();
  }, []);

  return { status, message, errors, setErrors, submit, reset, setTurnstileToken };
}
