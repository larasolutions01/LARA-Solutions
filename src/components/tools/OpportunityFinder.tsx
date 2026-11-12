"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Info, Lightbulb, RotateCcw, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { track } from "@/lib/analytics";
import { industryOptions, site } from "@/content/site";
import { getService, servicePath } from "@/content/services";
import type { PhotoKey } from "@/content/media";
import { areaOptions, challengeOptions, goalOptions, recommend, sizeOptions, techOptions, type AreaKey, type FinderAnswers, type OpportunityCategory } from "@/lib/opportunity";
import { roadmapSchema } from "@/lib/validation";
import { Button, ButtonLink, ExternalButtonLink } from "@/components/ui/Button";
import { Media } from "@/components/ui/Media";
import { ConsentCheckbox, Field, FormStatusMessage, Honeypot, Spinner, TextInput } from "@/components/forms/fields";
import { useFormSubmit } from "@/components/forms/useFormSubmit";
import { cn } from "@/lib/utils";

type SingleKey = "industry" | "size" | "challenge" | "goal" | "tech";

type Question =
  | { key: SingleKey; kind: "single"; title: string; guide: string; photo: PhotoKey; options: readonly string[] }
  | { key: "areas"; kind: "multi"; title: string; guide: string; photo: PhotoKey; options: readonly { key: AreaKey; label: string }[] };

const questions: Question[] = [
  { key: "industry", kind: "single", title: "What industry is your business in?", guide: "Different sectors share patterns — this helps us surface what typically works in yours.", photo: "ind-saas", options: industryOptions },
  { key: "size", kind: "single", title: "How large is your business?", guide: "Size shapes the right first step: quick wins for small teams, governed pilots for larger ones.", photo: "people-team", options: sizeOptions },
  { key: "challenge", kind: "single", title: "What is your biggest operational challenge?", guide: "Pick the one that would make the biggest difference if it improved this year.", photo: "process-chalkboard", options: challengeOptions },
  { key: "goal", kind: "single", title: "What is your top growth priority?", guide: "We weight recommendations towards the outcome you care about most.", photo: "people-planning", options: goalOptions },
  { key: "tech", kind: "single", title: "How would you describe your current use of technology?", guide: "There’s no wrong answer — it simply tells us where you’re starting from.", photo: "svc-transformation", options: techOptions },
  { key: "areas", kind: "multi", title: "Where does your team spend time on repetitive work?", guide: "Select all that apply. These are often the fastest places to win back time.", photo: "svc-ai", options: areaOptions },
];

const categoryColor: Record<OpportunityCategory, string> = {
  Automation: "bg-electric/10 text-electric",
  Marketing: "bg-sunrise/20 text-[#9a5a12]",
  Analytics: "bg-fresh/15 text-[#0b7f69]",
  Operations: "bg-aqua/15 text-[#06788b]",
  Technology: "bg-lavender/15 text-[#5a3fd1]",
};

export function OpportunityFinder() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Record<SingleKey, string>>>({});
  const [areas, setAreas] = useState<AreaKey[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const total = questions.length;
  const done = step >= total;

  const full = useMemo(() => ({ ...(answers as Omit<FinderAnswers, "areas">), areas }) as FinderAnswers, [answers, areas]);
  const result = useMemo(() => (done ? recommend(full) : null), [done, full]);

  useEffect(() => {
    if (result) track("opportunity_finder_complete", { industry: full.industry, challenge: full.challenge, top_service: result.services[0] });
  }, [result, full.industry, full.challenge]);

  const go = (n: number) => {
    setStep(n);
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  const q = questions[Math.min(step, total - 1)]!;
  const canContinue = q.kind === "multi" ? true : Boolean(answers[q.key]);

  return (
    <div className="theme-light overflow-hidden rounded-[2rem] bg-white shadow-[0_40px_100px_-40px_rgb(8_20_39/0.45)] ring-1 ring-line">
      <div className="grid lg:grid-cols-12">
        {/* Visual rail */}
        <div className="relative hidden lg:col-span-4 lg:block">
          <AnimatePresence mode="wait">
            <motion.div key={done ? "done" : q.key} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="absolute inset-0">
              <Media photo={done ? "people-celebrate" : q.photo} sizes="33vw" className="absolute inset-0" />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
          <div className="absolute inset-x-6 bottom-6 text-white">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-aqua">
              <Lightbulb aria-hidden className="size-4" /> Guidance
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/90">{done ? "These are preliminary ideas based on your answers — a starting point for a proper conversation." : q.guide}</p>
          </div>
        </div>

        <div className="p-6 sm:p-10 lg:col-span-8">
          {/* Progress */}
          <div className="flex items-center justify-between gap-4">
            <p className="eyebrow flex items-center gap-2">
              <Sparkles aria-hidden className="size-4" /> AI Opportunity Finder
            </p>
            <p className="text-xs font-medium text-muted" aria-live="polite">
              {done ? "Your preliminary results" : `Question ${step + 1} of ${total}`}
            </p>
          </div>
          <div className="mt-5 flex gap-1.5" role="progressbar" aria-label="Progress" aria-valuemin={0} aria-valuemax={total} aria-valuenow={Math.min(step, total)}>
            {Array.from({ length: total }).map((_, i) => (
              <span key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-section-tint">
                <motion.span
                  className="block h-full rounded-full bg-gradient-to-r from-electric to-aqua"
                  initial={false}
                  animate={{ width: i < step || done ? "100%" : i === step ? "45%" : "0%" }}
                  transition={{ duration: 0.5 }}
                />
              </span>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {!done ? (
              <motion.fieldset key={q.key} initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -28 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="mt-9">
                <legend className="sr-only">{q.title}</legend>
                <h3 ref={headingRef} tabIndex={-1} className="text-2xl font-semibold text-fg outline-none sm:text-3xl">
                  {q.title}
                </h3>
                <p className="mt-2 text-sm text-muted lg:hidden">{q.guide}</p>
                <div className={cn("mt-7 grid gap-2.5", q.options.length > 6 ? "sm:grid-cols-2 xl:grid-cols-3" : "sm:grid-cols-2")}>
                  {q.kind === "single"
                    ? q.options.map((opt) => {
                        const checked = answers[q.key] === opt;
                        return (
                          <label
                            key={opt}
                            className={cn(
                              "group flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm transition-all duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent",
                              checked ? "border-electric bg-electric/5 text-fg shadow-[0_8px_24px_-12px_rgb(40_100_255/0.6)]" : "border-line-strong bg-card text-body hover:-translate-y-0.5 hover:border-electric/50 hover:text-fg",
                            )}
                          >
                            <input type="radio" name={q.key} value={opt} checked={checked} onChange={() => setAnswers((a) => ({ ...a, [q.key]: opt }))} className="sr-only" />
                            <span aria-hidden className={cn("flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition", checked ? "border-electric bg-electric" : "border-line-strong")}>
                              {checked && <Check className="size-3 text-white" strokeWidth={3} />}
                            </span>
                            {opt}
                          </label>
                        );
                      })
                    : q.options.map((opt) => {
                        const checked = areas.includes(opt.key);
                        return (
                          <label
                            key={opt.key}
                            className={cn(
                              "flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm transition-all duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent",
                              checked ? "border-electric bg-electric/5 text-fg" : "border-line-strong bg-card text-body hover:border-electric/50 hover:text-fg",
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => setAreas((a) => (checked ? a.filter((x) => x !== opt.key) : [...a, opt.key]))}
                              className="sr-only"
                            />
                            <span aria-hidden className={cn("flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition", checked ? "border-electric bg-electric" : "border-line-strong")}>
                              {checked && <Check className="size-3 text-white" strokeWidth={3} />}
                            </span>
                            {opt.label}
                          </label>
                        );
                      })}
                </div>
                <div className="mt-8 flex items-center justify-between">
                  <Button variant="ghost" type="button" onClick={() => go(step - 1)} disabled={step === 0} className={cn(step === 0 && "invisible")}>
                    <ArrowLeft aria-hidden className="size-4" /> Back
                  </Button>
                  <Button type="button" onClick={() => go(step + 1)} disabled={!canContinue}>
                    {step === total - 1 ? (areas.length ? "See my opportunities" : "Skip & see results") : "Continue"} <ArrowRight aria-hidden className="size-4" />
                  </Button>
                </div>
              </motion.fieldset>
            ) : (
              result && (
                <motion.div key="results" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mt-9">
                  <h3 ref={headingRef} tabIndex={-1} className="text-2xl font-semibold text-fg outline-none sm:text-3xl">
                    Your top opportunities
                  </h3>
                  <p className="mt-2 text-sm text-muted">
                    {full.industry} · {full.size} · {full.challenge} · {full.goal}
                  </p>

                  <ol className="mt-7 grid gap-4 md:grid-cols-3">
                    {result.opportunities.map((o, i) => {
                      const svc = getService(o.service);
                      return (
                        <motion.li key={o.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.12 }} className="card-surface flex flex-col rounded-2xl p-5">
                          <div className="flex items-center justify-between">
                            <span className="font-display text-xs font-semibold text-muted">#{i + 1}</span>
                            <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold", categoryColor[o.category])}>{o.category}</span>
                          </div>
                          <h4 className="mt-3 text-lg font-semibold leading-snug text-fg">{o.title}</h4>
                          <p className="mt-2 text-sm leading-relaxed text-body">{o.description}</p>
                          {o.reasons.length > 0 && (
                            <details className="mt-3 text-xs text-muted">
                              <summary className="cursor-pointer select-none font-medium text-accent">Why this?</summary>
                              <ul className="mt-2 list-disc space-y-1 pl-4">
                                {o.reasons.map((r) => (
                                  <li key={r}>{r}</li>
                                ))}
                              </ul>
                            </details>
                          )}
                          {svc && (
                            <Link href={servicePath(svc.slug)} className="mt-auto pt-4 text-sm font-semibold text-accent hover:text-fg">
                              {svc.shortName} →
                            </Link>
                          )}
                        </motion.li>
                      );
                    })}
                  </ol>

                  <div className="mt-6 grid gap-4 lg:grid-cols-5">
                    <div className="rounded-2xl bg-section-tint p-5 lg:col-span-3">
                      <h4 className="font-display font-semibold text-fg">Suggested first implementation steps</h4>
                      <ol className="mt-3 space-y-2.5 text-sm leading-relaxed text-body">
                        {result.firstSteps.map((s, i) => (
                          <li key={s} className="flex gap-3">
                            <span className="font-display font-semibold text-electric">{i + 1}.</span>
                            {s}
                          </li>
                        ))}
                      </ol>
                    </div>
                    <div className="rounded-2xl bg-section-tint p-5 lg:col-span-2">
                      <h4 className="font-display font-semibold text-fg">Best-fit services</h4>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {result.services.map((slug) => {
                          const s = getService(slug);
                          return s ? (
                            <li key={slug}>
                              <Link href={servicePath(slug)} className="inline-block rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-fg ring-1 ring-line hover:ring-electric">
                                {s.shortName}
                              </Link>
                            </li>
                          ) : null;
                        })}
                      </ul>
                      <p className="mt-4 text-sm text-body">Opportunity areas: {result.categories.join(", ")}.</p>
                    </div>
                  </div>

                  <p className="mt-5 flex gap-2 text-xs leading-relaxed text-muted">
                    <Info aria-hidden className="mt-0.5 size-3.5 shrink-0" />
                    A preliminary, rule-based indication generated from your answers. It is not a guarantee of results or verified savings — a proper assessment requires understanding your processes and data.
                  </p>

                  <RoadmapRequest answers={full} opportunities={result.opportunities.map((o) => o.title)} />

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    {site.contact.bookingUrl ? (
                      <ExternalButtonLink href={site.contact.bookingUrl} variant="secondary">
                        Book a Discovery Call
                      </ExternalButtonLink>
                    ) : (
                      <ButtonLink href="/contact" variant="secondary">
                        Book a Discovery Call
                      </ButtonLink>
                    )}
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() => {
                        setAnswers({});
                        setAreas([]);
                        go(0);
                      }}
                    >
                      <RotateCcw aria-hidden className="size-4" /> Start again
                    </Button>
                  </div>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function RoadmapRequest({ answers, opportunities }: { answers: FinderAnswers; opportunities: string[] }) {
  const [open, setOpen] = useState(false);
  const [v, setV] = useState({ fullName: "", businessName: "", email: "", consent: false });
  const [honeypot, setHoneypot] = useState("");
  const { status, message, errors, submit } = useFormSubmit("/api/roadmap", roadmapSchema);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await submit(
      {
        ...v,
        consent: v.consent as true,
        answers: { industry: answers.industry, size: answers.size, challenge: answers.challenge, goal: answers.goal, tech: answers.tech, areas: answers.areas },
        opportunities,
      },
      honeypot,
    );
  };

  if (!open) {
    return (
      <div className="mt-7">
        <Button size="lg" variant="sunrise" type="button" onClick={() => setOpen(true)} aria-expanded={false} aria-controls="roadmap-form">
          Request a consultation & roadmap <ArrowRight aria-hidden className="size-4" />
        </Button>
      </div>
    );
  }

  if (status === "success")
    return (
      <div className="mt-7">
        <FormStatusMessage status={status} message={message} />
      </div>
    );

  return (
    <motion.form id="roadmap-form" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} onSubmit={onSubmit} noValidate className="card-surface relative mt-7 rounded-2xl p-6">
      <Honeypot value={honeypot} onChange={setHoneypot} />
      <h4 className="font-display text-lg font-semibold text-fg">Get your personalised growth roadmap</h4>
      <p className="mt-1 text-sm text-body">We’ll review your answers and contact you to arrange a consultation. Your answers are included automatically.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Field id="rm-name" label="Full name" error={errors.fullName}>
          <TextInput id="rm-name" autoComplete="name" value={v.fullName} onChange={(e) => setV({ ...v, fullName: e.target.value })} error={errors.fullName} />
        </Field>
        <Field id="rm-business" label="Business name" error={errors.businessName}>
          <TextInput id="rm-business" autoComplete="organization" value={v.businessName} onChange={(e) => setV({ ...v, businessName: e.target.value })} error={errors.businessName} />
        </Field>
        <Field id="rm-email" label="Work email" error={errors.email}>
          <TextInput id="rm-email" type="email" autoComplete="email" value={v.email} onChange={(e) => setV({ ...v, email: e.target.value })} error={errors.email} />
        </Field>
      </div>
      <div className="mt-5">
        <ConsentCheckbox id="rm-consent" checked={v.consent} onChange={(c) => setV({ ...v, consent: c })} error={errors.consent} />
      </div>
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? (
            <>
              <Spinner /> Sending…
            </>
          ) : (
            "Request my roadmap"
          )}
        </Button>
        <FormStatusMessage status={status} message={message} />
      </div>
    </motion.form>
  );
}
