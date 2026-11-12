"use client";

import Link from "next/link";
import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import { ArrowUpRight, Info } from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";
import { estimateRoi, estimateScenarios, recommendedServices, ROI_ASSUMPTIONS, SCENARIOS, type RoiInput } from "@/lib/roi";
import { getService, servicePath } from "@/content/services";
import { cn } from "@/lib/utils";

const currencies = ["INR", "USD", "AED", "GBP", "EUR", "SGD", "AUD", "CAD"] as const;
type Currency = (typeof currencies)[number];

/** Default currency — LARA Solutions operates mainly in India. */
const DEFAULT_CURRENCY: Currency = "INR";

/**
 * Hourly-cost slider per currency. `initial` is only an editable starting
 * point for the visitor's own scenario — not a market statistic. Switching
 * currency resets the value to that currency's starting point (no exchange
 * rates are applied).
 */
const HOURLY: Record<Currency, { initial: number; min: number; max: number; step: number }> = {
  INR: { initial: 400, min: 50, max: 5000, step: 25 },
  USD: { initial: 32, min: 1, max: 250, step: 1 },
  AED: { initial: 115, min: 5, max: 900, step: 5 },
  GBP: { initial: 26, min: 1, max: 200, step: 1 },
  EUR: { initial: 30, min: 1, max: 250, step: 1 },
  SGD: { initial: 42, min: 1, max: 350, step: 1 },
  AUD: { initial: 48, min: 1, max: 350, step: 1 },
  CAD: { initial: 44, min: 1, max: 350, step: 1 },
};

/** Indian digit grouping (₹8,83,200) for rupees; international grouping otherwise. */
const localeFor = (c: Currency) => (c === "INR" ? "en-IN" : "en");

function AnimatedNumber({ value, format }: { value: number; format: (n: number) => string }) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(value);
  const [display, setDisplay] = useState(format(value));
  useEffect(() => {
    if (reduce) {
      setDisplay(format(value));
      return;
    }
    const c = animate(mv, value, { duration: 0.7, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setDisplay(format(v)) });
    return () => c.stop();
  }, [value, format, mv, reduce]);
  return <>{display}</>;
}

function Slider({ label, value, onChange, min, max, step = 1, suffix, hint }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; step?: number; suffix?: string; hint?: string }) {
  const id = useId();
  const pct = ((Math.min(max, Math.max(min, value)) - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <label htmlFor={id} className="text-sm font-medium text-fg">
          {label}
        </label>
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            aria-label={`${label} value`}
            min={min}
            max={max}
            step={step}
            value={Number.isFinite(value) ? value : ""}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-20 rounded-lg border border-line-strong bg-card px-2 py-1 text-right text-sm font-semibold text-fg focus:border-accent focus:outline-none"
          />
          {suffix && <span className="min-w-8 text-xs text-muted">{suffix}</span>}
        </div>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={Math.min(max, Math.max(min, value || 0))}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-describedby={hint ? `${id}-h` : undefined}
        className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full accent-electric"
        style={{ background: `linear-gradient(90deg, #2864FF 0%, #00C9E8 ${pct}%, rgb(8 20 39 / 0.1) ${pct}%)` }}
      />
      {hint && (
        <p id={`${id}-h`} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}

function Ring({ value, label, color }: { value: number; label: string; color: string }) {
  const reduce = useReducedMotion();
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative size-28">
        <svg viewBox="0 0 36 36" className="size-full -rotate-90" aria-hidden>
          <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgb(255 255 255 / 0.12)" strokeWidth="3.5" />
          <motion.circle
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            stroke={color}
            strokeWidth="3.5"
            strokeLinecap="round"
            initial={false}
            animate={{ pathLength: Math.max(0.001, value) }}
            transition={{ duration: reduce ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-display text-xl font-semibold text-white">{Math.round(value * 100)}%</span>
      </div>
      <p className="mt-2 max-w-[9rem] text-xs text-white/70">{label}</p>
    </div>
  );
}

export function ImpactSimulator() {
  const [currency, setCurrencyState] = useState<Currency>(DEFAULT_CURRENCY);
  const [input, setInput] = useState<RoiInput>({ employees: 15, hoursPerWeek: 8, hourlyCost: HOURLY[DEFAULT_CURRENCY].initial, automationPct: 40, workingWeeks: ROI_ASSUMPTIONS.workingWeeksPerYear });
  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    setInput((p) => ({ ...p, hourlyCost: HOURLY[c].initial }));
  };
  const range = HOURLY[currency];
  const r = useMemo(() => estimateRoi(input), [input]);
  const scenarios = useMemo(() => estimateScenarios(input), [input]);
  const recs = useMemo(() => recommendedServices(input), [input]);
  const set = (k: keyof RoiInput) => (v: number) => setInput((p) => ({ ...p, [k]: v }));

  const money = useMemo(() => {
    const f = new Intl.NumberFormat(localeFor(currency), { style: "currency", currency, maximumFractionDigits: 0 });
    return (n: number) => f.format(Math.round(n));
  }, [currency]);
  const num = useMemo(() => {
    const f = new Intl.NumberFormat(localeFor(currency), { maximumFractionDigits: 0 });
    return (n: number) => f.format(Math.round(n));
  }, [currency]);
  const symbol = useMemo(
    () => new Intl.NumberFormat(localeFor(currency), { style: "currency", currency }).formatToParts(0).find((p) => p.type === "currency")?.value ?? currency,
    [currency],
  );
  const one = useMemo(() => (n: number) => n.toFixed(1), []);

  const currentWeekly = (input.employees || 0) * (input.hoursPerWeek || 0);
  const afterWeekly = Math.max(0, currentWeekly - r.weeklyHoursSaved);
  const maxBar = Math.max(1, currentWeekly);
  const maxScenario = Math.max(1, ...scenarios.map((s) => s.result.annualHoursSaved));

  return (
    <div className="grid overflow-hidden rounded-[2rem] shadow-[0_40px_100px_-40px_rgb(8_20_39/0.6)] lg:grid-cols-12">
      {/* Inputs */}
      <div className="theme-light section-theme space-y-7 p-6 sm:p-9 lg:col-span-5">
        <div>
          <p className="eyebrow">Your scenario</p>
          <p className="mt-2 text-sm text-body">Adjust the inputs — the dashboard updates instantly.</p>
        </div>
        <Slider label="Number of employees involved" value={input.employees} onChange={set("employees")} min={1} max={500} />
        <Slider label="Hours on repetitive tasks (per person / week)" value={input.hoursPerWeek} onChange={set("hoursPerWeek")} min={0} max={40} step={0.5} suffix="hrs" />
        <div>
          <Slider label="Average hourly labour cost" value={input.hourlyCost} onChange={set("hourlyCost")} min={range.min} max={range.max} step={range.step} suffix={`${symbol}/hr`} />
          <div className="mt-2 flex items-center gap-2 text-xs text-muted">
            <label htmlFor="sim-currency">Currency</label>
            <select id="sim-currency" value={currency} onChange={(e) => setCurrency(e.target.value as Currency)} className="rounded-md border border-line-strong bg-card px-2 py-1 text-fg">
              {currencies.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <Slider label="Estimated automation suitability" value={input.automationPct} onChange={set("automationPct")} min={0} max={100} suffix="%" hint="Share of those repetitive tasks that could realistically be automated." />
        <Slider label="Working weeks per year" value={input.workingWeeks ?? 46} onChange={set("workingWeeks")} min={20} max={52} suffix="wks" />
      </div>

      {/* Dashboard */}
      <div className="theme-dark section-theme relative p-6 sm:p-9 lg:col-span-7" aria-live="polite">
        <div aria-hidden className="absolute -right-24 -top-24 size-72 rounded-full bg-electric/30 blur-[90px]" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <p className="eyebrow">Illustrative impact</p>
            <span className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] text-white/70">Expected scenario</span>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/[0.05] p-4">
              <dt className="text-xs text-white/65">Time-saving potential</dt>
              <dd className="mt-1 font-display text-3xl font-semibold text-white sm:text-4xl">
                <AnimatedNumber value={r.weeklyHoursSaved} format={num} />
                <span className="ml-1 text-base font-normal text-white/60">hrs/wk</span>
              </dd>
            </div>
            <div className="rounded-2xl bg-white/[0.05] p-4">
              <dt className="text-xs text-white/65">Annual labour-time equivalent</dt>
              <dd className="mt-1 font-display text-3xl font-semibold text-white sm:text-4xl">
                <AnimatedNumber value={r.annualHoursSaved} format={num} />
                <span className="ml-1 text-base font-normal text-white/60">hrs</span>
              </dd>
            </div>
            <div className="col-span-2 rounded-2xl bg-gradient-to-r from-electric/30 to-aqua/15 p-4 ring-1 ring-white/10">
              <dt className="text-xs text-white/70">Annual cost-equivalent of time recovered</dt>
              <dd className="mt-1 flex flex-wrap items-baseline gap-x-3 font-display text-4xl font-semibold text-white sm:text-5xl">
                <AnimatedNumber value={r.annualCostEquivalent} format={money} />
                <span className="text-sm font-normal text-white/70">
                  ≈ <AnimatedNumber value={r.fteEquivalent} format={one} /> full-time equivalents
                </span>
              </dd>
            </div>
          </dl>

          <div className="mt-6 grid gap-6 sm:grid-cols-[auto_1fr]">
            <div className="flex justify-center gap-4 sm:flex-col">
              <Ring value={r.repetitiveShare} label="of each person’s week is repetitive work" color="#FFAD55" />
              <Ring value={r.recoveredShare} label="of that time could be recovered" color="#12D6B0" />
            </div>
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-white/60">Repetitive hours per week</p>
                {[
                  { label: "Today", value: currentWeekly, color: "bg-sunrise" },
                  { label: "With automation", value: afterWeekly, color: "bg-fresh" },
                ].map((b) => (
                  <div key={b.label} className="mt-3">
                    <div className="flex justify-between text-xs text-white/75">
                      <span>{b.label}</span>
                      <span className="font-semibold text-white">{num(b.value)} hrs</span>
                    </div>
                    <div className="mt-1.5 h-3 rounded-full bg-white/10">
                      <motion.div className={cn("h-full rounded-full", b.color)} initial={false} animate={{ width: `${(b.value / maxBar) * 100}%` }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} />
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-white/60">Scenario comparison (hours / year)</p>
                <div className="mt-3 flex h-28 items-end gap-3">
                  {scenarios.map((s) => (
                    <div key={s.key} className="flex flex-1 flex-col items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-white">{num(s.result.annualHoursSaved)}</span>
                      <motion.div
                        className={cn("w-full rounded-t-lg", s.key === "expected" ? "bg-gradient-to-t from-electric to-aqua" : "bg-white/25")}
                        initial={false}
                        animate={{ height: `${Math.max(4, (s.result.annualHoursSaved / maxScenario) * 80)}px` }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      />
                      <span className="text-[11px] text-white/65">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-7 border-t border-white/10 pt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/60">Recommended starting points</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {recs.map((slug) => {
                const s = getService(slug);
                return s ? (
                  <li key={slug}>
                    <Link href={servicePath(slug)} className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20">
                      {s.shortName} <ArrowUpRight aria-hidden className="size-3" />
                    </Link>
                  </li>
                ) : null;
              })}
            </ul>
          </div>

          <p className="mt-6 flex gap-2 text-xs leading-relaxed text-white/60">
            <Info aria-hidden className="mt-0.5 size-3.5 shrink-0" />
            <span>
              Illustrative scenarios only — not guaranteed savings. Expected scenario assumes {Math.round(ROI_ASSUMPTIONS.realisationFactor * 100)}% of automatable time is
              recovered after reviews and exceptions ({SCENARIOS.map((s) => `${s.label.toLowerCase()} ${Math.round(s.factor * 100)}%`).join(", ")}). Cost-equivalent
              represents time value that can be redirected to higher-value work, not necessarily cash savings. FTE based on a {ROI_ASSUMPTIONS.hoursPerFte}-hour week.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
