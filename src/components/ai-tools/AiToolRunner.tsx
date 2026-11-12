"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { AlertCircle, Check, Copy, RotateCcw, Sparkles, Wand2 } from "lucide-react";
import type { AiTool, ToolOutput } from "@/lib/ai-tools/registry";
import { Field, Honeypot, Select, Spinner, TextArea, TextInput } from "@/components/forms/fields";
import { buttonClasses } from "@/components/ui/Button";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "done" | "error";
type Values = Record<string, string>;

const initialValues = (tool: AiTool): Values => Object.fromEntries(tool.fields.map((f) => [f.name, f.type === "select" ? (f.options?.[0] ?? "") : ""]));

/** Copy text to the clipboard, with a fallback for older browsers. */
async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

function CopyButton({ text, label = "Copy", onCopied, className }: { text: string; label?: string; onCopied?: () => void; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        if (await copyText(text)) {
          setCopied(true);
          onCopied?.();
          window.setTimeout(() => setCopied(false), 1600);
        }
      }}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
        copied ? "border-fresh/50 bg-fresh/15 text-[#0b8a73]" : "border-line-strong bg-white text-fg hover:border-accent hover:text-accent",
        className,
      )}
      aria-label={copied ? "Copied" : label}
    >
      {copied ? <Check aria-hidden className="size-3.5" /> : <Copy aria-hidden className="size-3.5" />}
      {copied ? "Copied" : label}
    </button>
  );
}

const allText = (o: ToolOutput) => o.sections.map((s) => `${s.title}\n${s.items.join(s.style === "chips" ? ", " : "\n\n")}`).join("\n\n");

export function AiToolRunner({ tool }: { tool: AiTool }) {
  const [values, setValues] = useState<Values>(() => initialValues(tool));
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [output, setOutput] = useState<ToolOutput | null>(null);
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [runId, setRunId] = useState(0);
  // Until the page is interactive, Generate stays disabled so an early tap can't
  // fall back to a native form submit (which would put inputs in the URL).
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const lastValues = useRef<Values | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const loading = status === "loading";

  const set = (name: string, v: string) => {
    setValues((p) => ({ ...p, [name]: v }));
    if (fieldErrors[name]) setFieldErrors(({ [name]: _removed, ...rest }) => rest);
  };

  const clientErrors = (v: Values) => {
    const errs: Record<string, string> = {};
    for (const f of tool.fields) {
      const val = (v[f.name] ?? "").trim();
      if (f.required && !val) errs[f.name] = "This field is required.";
      else if (val.length > f.maxLength) errs[f.name] = `Please keep this under ${f.maxLength} characters.`;
    }
    return errs;
  };

  async function run(v: Values) {
    const errs = clientErrors(v);
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }
    lastValues.current = v;
    setStatus("loading");
    setError(null);
    setFieldErrors({});
    if (window.innerWidth < 1024 && resultsRef.current) {
      const lenis = (window as Window & { __lenis?: { scrollTo: (t: HTMLElement, o?: object) => void } }).__lenis;
      if (lenis) lenis.scrollTo(resultsRef.current, { offset: -96 });
      else resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    try {
      const res = await fetch(`/api/ai-tools/${tool.slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...v, website: honeypot }),
      });
      const data = (await res.json().catch(() => ({}))) as { output?: ToolOutput; error?: string; code?: string; fieldErrors?: Record<string, string> };
      if (!res.ok || !data.output) {
        setFieldErrors(data.fieldErrors ?? {});
        setError({ message: data.error ?? "Something went wrong. Please try again.", code: data.code });
        setStatus("error");
        return;
      }
      setOutput(data.output);
      setRunId((n) => n + 1);
      setStatus("done");
      track("ai_tool_generate", { tool: tool.slug });
    } catch {
      setError({ message: "Network error — please check your connection and try again." });
      setStatus("error");
    }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!loading) run(values);
  };

  const fillExample = () => {
    const ex: Values = { ...values };
    for (const f of tool.fields) if (f.type !== "select" && f.placeholder) ex[f.name] = f.placeholder.replace(/^e\.g\.\s*/i, "");
    setValues(ex);
    setFieldErrors({});
  };

  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
      {/* Inputs */}
      <form onSubmit={onSubmit} method="post" noValidate className="card-surface relative space-y-5 rounded-3xl p-6 sm:p-8 lg:sticky lg:top-28 lg:col-span-5">
        <div className="flex items-center justify-between gap-3">
          <p className="eyebrow">Your brief</p>
          <button type="button" onClick={fillExample} className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline" disabled={loading}>
            <Wand2 aria-hidden className="size-3.5" /> Try an example
          </button>
        </div>
        {tool.fields.map((f) => {
          const id = `${tool.slug}-${f.name}`;
          const err = fieldErrors[f.name];
          const len = (values[f.name] ?? "").length;
          return (
            <Field key={f.name} id={id} label={f.label} error={err} hint={f.hint} optional={!f.required}>
              {f.type === "select" ? (
                <Select id={id} options={f.options ?? []} value={values[f.name]} onChange={(e) => set(f.name, e.target.value)} error={err} disabled={loading} />
              ) : f.type === "textarea" ? (
                <div className="relative">
                  <TextArea id={id} value={values[f.name]} onChange={(e) => set(f.name, e.target.value)} placeholder={f.placeholder} maxLength={f.maxLength} error={err} hint={f.hint} className="min-h-32" disabled={loading} />
                  <span aria-hidden className="pointer-events-none absolute bottom-2.5 right-3 text-[11px] text-muted">
                    {len}/{f.maxLength}
                  </span>
                </div>
              ) : (
                <TextInput id={id} value={values[f.name]} onChange={(e) => set(f.name, e.target.value)} placeholder={f.placeholder} maxLength={f.maxLength} error={err} hint={f.hint} disabled={loading} />
              )}
            </Field>
          );
        })}
        <Honeypot value={honeypot} onChange={setHoneypot} />
        <button type="submit" className={buttonClasses({ size: "lg", className: "w-full" })} disabled={!ready || loading}>
          {loading ? (
            <>
              <Spinner /> Generating…
            </>
          ) : (
            <>
              <Sparkles aria-hidden className="size-4" /> Generate
            </>
          )}
        </button>
        <p className="text-xs leading-relaxed text-muted">
          Free, no sign-up. Powered by Google Gemini — on the free tier Google may use what you enter to improve its products, so please don&apos;t include personal or
          confidential information. Always review AI-generated text before you use it.{" "}
          <Link href="/privacy#ai-tools" className="underline hover:text-fg">
            Privacy
          </Link>
        </p>
      </form>

      {/* Results */}
      <div ref={resultsRef} className="scroll-mt-28 lg:col-span-7" aria-live="polite" aria-busy={loading}>
        <div className="card-surface min-h-[22rem] rounded-3xl p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold text-fg">Your results</h2>
            {status === "done" && output && (
              <div className="flex flex-wrap gap-2">
                <CopyButton text={allText(output)} label="Copy all" onCopied={() => track("ai_tool_copy", { tool: tool.slug, scope: "all" })} />
                <button
                  type="button"
                  onClick={() => lastValues.current && run(lastValues.current)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-white px-3 py-1.5 text-xs font-semibold text-fg transition-colors hover:border-accent hover:text-accent"
                >
                  <RotateCcw aria-hidden className="size-3.5" /> Try again
                </button>
              </div>
            )}
          </div>

          {/* Results render immediately (enter-only fades) — they never wait on an exit animation. */}
            {loading && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="mt-6 space-y-4">
                <p className="flex items-center gap-2 text-sm text-muted">
                  <Spinner /> Writing your {tool.returns.toLowerCase()}…
                </p>
                {[0, 1, 2].map((i) => (
                  <div key={i} className="space-y-2.5 rounded-2xl border border-line p-5">
                    <div className="h-3 w-11/12 animate-pulse rounded-full bg-section-tint" />
                    <div className="h-3 w-4/5 animate-pulse rounded-full bg-section-tint" />
                    <div className="h-3 w-2/3 animate-pulse rounded-full bg-section-tint" />
                  </div>
                ))}
              </motion.div>
            )}

            {status === "error" && error && (
              <motion.div key="error" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                <div role="alert" className="flex items-start gap-3 rounded-2xl border border-danger/30 bg-danger/[0.07] p-5 text-sm text-fg">
                  <AlertCircle aria-hidden className="mt-0.5 size-5 shrink-0 text-danger" />
                  <div>
                    <p>{error.message}</p>
                    {error.code === "daily_limit" ? (
                      <p className="mt-2 text-body">
                        Need more? We build custom AI tools for businesses —{" "}
                        <Link href="/contact" className="font-semibold text-accent hover:underline">
                          talk to us
                        </Link>
                        .
                      </p>
                    ) : (
                      lastValues.current &&
                      !["invalid", "daily_limit", "unavailable"].includes(error.code ?? "") && (
                        <button type="button" onClick={() => lastValues.current && run(lastValues.current)} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline">
                          <RotateCcw aria-hidden className="size-3.5" /> Try again
                        </button>
                      )
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {status === "done" && output && (
              <motion.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="mt-6 space-y-7">
                {output.sections.map((s, si) => (
                  <section key={`${runId}-${si}`} aria-label={s.title}>
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-accent">{s.title}</h3>
                      {s.style === "chips" && <CopyButton text={s.items.join(", ")} label="Copy keywords" onCopied={() => track("ai_tool_copy", { tool: tool.slug, scope: "keywords" })} />}
                    </div>
                    {s.style === "chips" ? (
                      <ul className="flex flex-wrap gap-2">
                        {s.items.map((k, ki) => (
                          <li key={`${runId}-${si}-${ki}`} className="rounded-full border border-line bg-section-tint px-3 py-1.5 text-sm text-fg">
                            {k}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <ol className="space-y-3">
                        {s.items.map((item, i) => (
                          <motion.li
                            key={`${runId}-${si}-${i}`}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.06 }}
                            className="group flex items-start gap-4 rounded-2xl border border-line bg-white p-5"
                          >
                            <p className="flex-1 whitespace-pre-line text-[0.95rem] leading-relaxed text-fg">{item}</p>
                            <CopyButton text={item} onCopied={() => track("ai_tool_copy", { tool: tool.slug, scope: "item" })} />
                          </motion.li>
                        ))}
                      </ol>
                    )}
                  </section>
                ))}
                <p className="text-xs text-muted">AI-generated — please check facts, names and claims before publishing.</p>
              </motion.div>
            )}

            {status === "idle" && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-line-strong p-8 text-center">
                <Sparkles aria-hidden className="size-8 text-accent" />
                <p className="mt-4 font-display text-lg text-fg">Your {tool.returns.toLowerCase()} will appear here</p>
                <p className="mt-1.5 max-w-sm text-sm text-body">Fill in the brief and press Generate. Not sure what to write? Use “Try an example”.</p>
              </motion.div>
            )}
        </div>
      </div>
    </div>
  );
}
