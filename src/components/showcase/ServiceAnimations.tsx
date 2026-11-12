"use client";

import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { BarChart3, Bell, CheckCircle2, FileText, LayoutDashboard, Mail, MessageSquare, MousePointerClick, Search, Settings, ShoppingCart, Sparkles, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

/* ── A. Manual tasks → connected automated workflow ───────────── */
export function AutomationFlow() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  const done = inView || reduce;
  const tasks = [
    { icon: Mail, label: "Customer email", from: { x: -30, y: -40, r: -8 } },
    { icon: FileText, label: "Supplier invoice", from: { x: 20, y: 30, r: 6 } },
    { icon: MessageSquare, label: "Support ticket", from: { x: -10, y: 60, r: -4 } },
  ];
  return (
    <div ref={ref} className="absolute inset-0 flex items-center p-5 sm:p-8">
      <div className="relative grid w-full grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
        <div className="space-y-3">
          {tasks.map((t, i) => (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, x: t.from.x, y: t.from.y, rotate: t.from.r }}
              animate={done ? { opacity: 1, x: 0, y: 0, rotate: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.2 + i * 0.15, ease }}
              className="glass-light flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-ink shadow-lg sm:text-sm"
            >
              <t.icon aria-hidden className="size-4 shrink-0 text-electric" /> {t.label}
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={done ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.85, ease }}
          className="relative flex size-20 flex-col items-center justify-center rounded-2xl bg-electric text-white shadow-[0_0_50px_rgb(40_100_255/0.7)] sm:size-24"
        >
          <Sparkles aria-hidden className="size-6" />
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider">AI agent</span>
          <span className="absolute inset-0 animate-ping rounded-2xl border border-electric/60 motion-reduce:hidden" style={{ animationDuration: "2.4s" }} />
        </motion.div>
        <div className="space-y-3">
          {[
            { icon: CheckCircle2, label: "CRM updated" },
            { icon: FileText, label: "Data extracted" },
            { icon: Bell, label: "Team notified" },
          ].map((o, i) => (
            <motion.div
              key={o.label}
              initial={{ opacity: 0, x: 24 }}
              animate={done ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 1.2 + i * 0.15, ease }}
              className="flex items-center gap-2 rounded-xl bg-ink/80 px-3 py-2 text-xs font-medium text-white shadow-lg backdrop-blur sm:text-sm"
            >
              <o.icon aria-hidden className="size-4 shrink-0 text-fresh" /> {o.label}
            </motion.div>
          ))}
        </div>
        <svg aria-hidden className="pointer-events-none absolute inset-0 -z-10 size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {[20, 50, 80].map((y, i) => (
            <motion.path
              key={`l${y}`}
              d={`M33 ${y} C 42 ${y}, 42 50, 47 50`}
              fill="none"
              stroke="#2864FF"
              strokeWidth="0.6"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              animate={done ? { pathLength: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.7 + i * 0.1 }}
            />
          ))}
          {[20, 50, 80].map((y, i) => (
            <motion.path
              key={`r${y}`}
              d={`M53 50 C 58 50, 58 ${y}, 67 ${y}`}
              fill="none"
              stroke="#12D6B0"
              strokeWidth="0.6"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              animate={done ? { pathLength: 1 } : {}}
              transition={{ duration: 0.6, delay: 1.1 + i * 0.1 }}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}

/* ── B. Campaign assets → funnel + live-style chart ───────────── */
export function MarketingFunnel() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!inView || reduce) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 1800);
    return () => window.clearInterval(id);
  }, [inView, reduce]);
  const stages = [
    { label: "Reach", w: 100, color: "bg-electric" },
    { label: "Engage", w: 78, color: "bg-[#4f86ff]" },
    { label: "Convert", w: 54, color: "bg-aqua" },
    { label: "Retain", w: 36, color: "bg-fresh" },
  ];
  const base = [18, 26, 22, 34, 30, 42, 38, 50, 47, 58];
  const pts = base.map((v, i) => `${i * 11},${64 - (v + ((tick + i) % 3) * 2)}`).join(" ");
  return (
    <div ref={ref} className="grid gap-4 sm:grid-cols-2">
      <div className="card-surface rounded-2xl p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Conversion funnel</p>
        <div className="mt-4 space-y-2.5">
          {stages.map((s, i) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className="w-16 text-xs text-body">{s.label}</span>
              <div className="h-6 flex-1 rounded-md bg-section-tint">
                <motion.div
                  className={cn("h-full rounded-md", s.color)}
                  initial={{ width: 0 }}
                  animate={inView || reduce ? { width: `${s.w}%` } : {}}
                  transition={{ duration: 1, delay: 0.2 + i * 0.15, ease }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[11px] text-muted">Illustrative — not client data</p>
      </div>
      <div className="card-surface rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Campaign signal</p>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-success">
            <span className="size-1.5 animate-pulse rounded-full bg-success" /> live-style
          </span>
        </div>
        <svg viewBox="0 0 100 64" className="mt-4 h-28 w-full" aria-hidden>
          <defs>
            <linearGradient id="mk-area" x1="0" x2="0" y1="0" y2="1">
              <stop stopColor="#00C9E8" stopOpacity="0.35" />
              <stop offset="1" stopColor="#00C9E8" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polyline points={`0,64 ${pts} 99,64`} fill="url(#mk-area)" stroke="none" style={{ transition: "all 1.2s ease" }} />
          <polyline points={pts} fill="none" stroke="#2864FF" strokeWidth="2" strokeLinejoin="round" style={{ transition: "all 1.2s ease" }} />
        </svg>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {[
            { icon: Search, t: "SEO" },
            { icon: MousePointerClick, t: "Paid" },
            { icon: Mail, t: "Email" },
            { icon: UserRound, t: "Social" },
          ].map((c) => (
            <span key={c.t} className="inline-flex items-center gap-1 rounded-full bg-section-tint px-2 py-1 text-[11px] text-body">
              <c.icon aria-hidden className="size-3" /> {c.t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── C. Animated logistics route network (over video) ─────────── */
export function RouteNetwork() {
  const routes = [
    "M5 70 C 20 50, 35 60, 50 40 S 80 20, 95 30",
    "M10 30 C 25 40, 40 25, 55 50 S 80 80, 92 70",
    "M0 50 C 20 55, 30 80, 60 75 S 85 55, 100 55",
  ];
  const hubs = [
    [5, 70], [50, 40], [95, 30], [10, 30], [55, 50], [92, 70], [60, 75],
  ] as const;
  return (
    <svg aria-hidden className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      {routes.map((d, i) => (
        <g key={i}>
          <path d={d} fill="none" stroke="#00C9E8" strokeOpacity="0.45" strokeWidth="0.25" vectorEffect="non-scaling-stroke" />
          <path d={d} fill="none" stroke="#ffffff" strokeOpacity="0.9" strokeWidth="1.6" strokeDasharray="3 30" vectorEffect="non-scaling-stroke" className="animate-dash" style={{ animationDelay: `${i * 0.7}s`, animationDuration: `${3 + i}s` }} />
        </g>
      ))}
      {hubs.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="1.6" fill="#12D6B0" fillOpacity="0.25" className="animate-pulse-soft" style={{ transformOrigin: `${x}px ${y}px`, animationDelay: `${i * 0.3}s` }} />
          <circle cx={x} cy={y} r="0.5" fill="#ffffff" />
        </g>
      ))}
    </svg>
  );
}

/* ── D. Raw data → dashboard ─────────────────────────────────── */
export function DataToDashboard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<0 | 1>(reduce ? 1 : 0);
  useEffect(() => {
    if (!inView || reduce) return;
    const t = window.setTimeout(() => setPhase(1), 1400);
    return () => window.clearTimeout(t);
  }, [inView, reduce]);
  const raw = Array.from({ length: 24 }, (_, i) => ((i * 37) % 90) + 10);
  const bars = [42, 58, 51, 67, 72, 64, 80, 86];
  return (
    <div ref={ref} className="card-surface relative overflow-hidden rounded-3xl p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <p className="flex items-center gap-2 text-sm font-semibold text-fg">
          {phase === 0 ? <Settings aria-hidden className="size-4 animate-spin text-muted motion-reduce:animate-none" /> : <LayoutDashboard aria-hidden className="size-4 text-electric" />}
          {phase === 0 ? "Raw data from 5 sources…" : "Decision dashboard"}
        </p>
        <span className="text-[11px] text-muted">Illustrative</span>
      </div>
      <div className="relative h-64">
        {/* Raw grid */}
        <motion.div className="absolute inset-0 grid grid-cols-6 gap-1.5" animate={{ opacity: phase === 0 ? 1 : 0, scale: phase === 0 ? 1 : 0.96 }} transition={{ duration: 0.6 }}>
          {raw.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={inView || reduce ? { opacity: 1 } : {}}
              transition={{ delay: i * 0.03 }}
              className="flex items-center justify-center rounded-md bg-section-tint font-mono text-[11px] text-muted"
            >
              {v}.{(v * 7) % 10}
            </motion.div>
          ))}
        </motion.div>
        {/* Dashboard */}
        <motion.div className="absolute inset-0 grid grid-cols-3 grid-rows-[auto_1fr] gap-3" animate={{ opacity: phase === 1 ? 1 : 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          {[
            { k: "Revenue trend", c: "text-electric" },
            { k: "On-time delivery", c: "text-fresh" },
            { k: "Pipeline health", c: "text-sunrise" },
          ].map((t, i) => (
            <div key={t.k} className="rounded-xl bg-section-tint p-3">
              <p className="text-[11px] text-muted">{t.k}</p>
              <svg viewBox="0 0 60 20" className={cn("mt-1 h-6 w-full", t.c)} aria-hidden>
                <motion.polyline
                  points={["0,16 10,13 20,14 30,9 40,10 50,5 60,3", "0,10 10,11 20,8 30,9 40,6 50,6 60,4", "0,14 10,12 20,13 30,10 40,11 50,8 60,9"][i]}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={phase === 1 ? { pathLength: 1 } : {}}
                  transition={{ duration: 1, delay: 0.3 + i * 0.15 }}
                />
              </svg>
            </div>
          ))}
          <div className="col-span-2 flex items-end gap-2 rounded-xl bg-section-tint p-4">
            {bars.map((b, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-t-md bg-gradient-to-t from-electric to-aqua"
                initial={{ height: 0 }}
                animate={phase === 1 ? { height: `${b}%` } : {}}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.06, ease }}
              />
            ))}
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl bg-section-tint p-3">
            <svg viewBox="0 0 36 36" className="size-20 -rotate-90" aria-hidden>
              <circle cx="18" cy="18" r="15" fill="none" stroke="var(--line)" strokeWidth="4" />
              <motion.circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="#12D6B0"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={phase === 1 ? { pathLength: 0.72 } : {}}
                transition={{ duration: 1.2, delay: 0.4 }}
              />
            </svg>
            <p className="mt-1 text-[11px] text-muted">Target progress</p>
          </div>
        </motion.div>
      </div>
      <p className="mt-4 flex items-center gap-2 text-xs text-body">
        <BarChart3 aria-hidden className="size-4 text-electric" /> Scattered data becomes a single, trusted view.
      </p>
    </div>
  );
}

/* ── E. Complex process → simplified flow (scroll-driven) ─────── */
export function ProcessSimplify() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "center 45%"] });
  const tangled = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const straight = useTransform(scrollYProgress, [0.2, 1], [0, 1]);
  const steps = ["Request", "Validate", "Approve", "Deliver"];
  return (
    <div ref={ref} className="relative">
      <svg viewBox="0 0 400 160" className="w-full" aria-label="A tangled process with many hand-offs simplifies into four connected steps" role="img">
        <motion.g style={{ opacity: reduce ? 0.15 : tangled }}>
          <path d="M20 80 C 60 10, 90 150, 130 70 S 170 10, 200 90 S 260 160, 280 60 S 340 20, 380 80" fill="none" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="1.6" strokeDasharray="5 5" />
          <path d="M20 80 C 70 130, 110 20, 150 110 S 230 20, 250 120 S 330 140, 380 80" fill="none" stroke="#FFAD55" strokeOpacity="0.6" strokeWidth="1.4" strokeDasharray="3 6" />
          {[[70, 40], [130, 70], [170, 120], [230, 40], [280, 60], [320, 120]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="6" fill="#081427" stroke="#FFAD55" strokeOpacity="0.8" />
          ))}
        </motion.g>
        <motion.g style={{ opacity: reduce ? 1 : straight }}>
          <path d="M40 80 H 360" stroke="#12D6B0" strokeWidth="3" strokeLinecap="round" />
          {steps.map((s, i) => {
            const x = 40 + i * 106.6;
            return (
              <g key={s}>
                <circle cx={x} cy="80" r="11" fill="#081427" stroke="#12D6B0" strokeWidth="3" />
                <circle cx={x} cy="80" r="4" fill="#12D6B0" />
                <text x={x} y="118" textAnchor="middle" fill="#ffffff" fontSize="13" fontFamily="var(--font-inter)">
                  {s}
                </text>
              </g>
            );
          })}
        </motion.g>
      </svg>
    </div>
  );
}

/* ── F. Scattered components assemble into an application ────── */
export function AppAssembly() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  const done = inView || reduce;
  const scatter = (x: number, y: number, r: number) => (done ? { x: 0, y: 0, rotate: 0, opacity: 1 } : { x, y, rotate: r, opacity: 0.6 });
  return (
    <div ref={ref} className="relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={done ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="absolute -inset-3 rounded-[1.75rem] border border-white/15 bg-white/[0.03]"
      />
      <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-ink/80 p-4 shadow-2xl backdrop-blur-xl">
        <motion.div animate={scatter(-40, -50, -6)} transition={{ duration: 1, ease }} className="flex items-center gap-2 rounded-xl bg-white/[0.06] px-3 py-2">
          <span className="size-2.5 rounded-full bg-[#ff6b6b]" />
          <span className="size-2.5 rounded-full bg-sunrise" />
          <span className="size-2.5 rounded-full bg-fresh" />
          <span className="ml-3 h-2 w-32 rounded-full bg-white/15" />
        </motion.div>
        <div className="mt-3 grid grid-cols-[110px_1fr] gap-3">
          <motion.div animate={scatter(-70, 40, 8)} transition={{ duration: 1, delay: 0.1, ease }} className="space-y-2 rounded-xl bg-white/[0.06] p-3">
            {[LayoutDashboard, ShoppingCart, UserRound, Settings].map((I, i) => (
              <div key={i} className={cn("flex items-center gap-2 rounded-lg px-2 py-1.5", i === 0 && "bg-electric/40")}>
                <I aria-hidden className="size-3.5 text-white/80" />
                <span className="h-1.5 w-10 rounded-full bg-white/25" />
              </div>
            ))}
          </motion.div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              {[
                ["#2864FF", 60, -40, 10],
                ["#00C9E8", 90, 30, -12],
                ["#12D6B0", 50, 70, 6],
              ].map(([c, x, y, r], i) => (
                <motion.div key={i} animate={scatter(x as number, y as number, r as number)} transition={{ duration: 1, delay: 0.15 + i * 0.08, ease }} className="rounded-xl bg-white/[0.06] p-3">
                  <span className="block h-1.5 w-8 rounded-full bg-white/25" />
                  <span className="mt-2 block h-3 w-12 rounded-full" style={{ background: c as string }} />
                </motion.div>
              ))}
            </div>
            <motion.div animate={scatter(80, 60, -5)} transition={{ duration: 1, delay: 0.35, ease }} className="flex h-28 items-end gap-1.5 rounded-xl bg-white/[0.06] p-3">
              {[40, 65, 50, 80, 60, 90, 75].map((h, i) => (
                <span key={i} className="flex-1 rounded-t bg-gradient-to-t from-electric to-aqua" style={{ height: `${h}%` }} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={done ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1.2 }}
        className="glass absolute -bottom-5 right-6 flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white"
      >
        <CheckCircle2 aria-hidden className="size-4 text-fresh" /> Systems connected
      </motion.div>
    </div>
  );
}
