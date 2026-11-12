"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import type { ServiceIcon } from "@/content/services";
import { cn } from "@/lib/utils";

/** Signature visual per service, shown on each service page hero. */
export function ServiceVisual({ kind, className }: { kind: ServiceIcon; className?: string }) {
  return (
    <div className={cn("ring-gradient relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-section-tint to-section p-5 sm:p-7", className)}>
      <div aria-hidden className="bg-grid absolute inset-0 opacity-50" />
      <div className="relative">
        {kind === "automation" && <WorkflowVisual />}
        {kind === "growth" && <FunnelVisual />}
        {kind === "supply" && <SupplyChainVisual />}
        {kind === "analytics" && <DashboardVisual />}
        {kind === "process" && <ProcessVisual />}
        {kind === "platform" && <IntegrationVisual />}
      </div>
    </div>
  );
}

const G = () => (
  <defs>
    <linearGradient id="sv-g" x1="0" x2="1">
      <stop stopColor="#2864FF" />
      <stop offset="0.55" stopColor="#00C9E8" />
      <stop offset="1" stopColor="#12D6B0" />
    </linearGradient>
  </defs>
);

function Packet({ path, delay = 0, dur = 3 }: { path: string; delay?: number; dur?: number }) {
  return (
    <circle r="3.5" fill="#fff" className="motion-reduce:hidden">
      <animateMotion dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" path={path} />
    </circle>
  );
}

function Box({ x, y, w = 92, h = 34, label, accent = false }: { x: number; y: number; w?: number; h?: number; label: string; accent?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="9" fill={accent ? "rgb(40 100 255 / 0.18)" : "#0C1D38"} stroke={accent ? "url(#sv-g)" : "rgb(40 100 255 / 0.3)"} />
      <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fill="#12D6B0" fontSize="10.5" fontFamily="var(--font-inter)">
        {label}
      </text>
    </g>
  );
}

function WorkflowVisual() {
  const p1 = "M70 60 C 120 60, 130 120, 180 120";
  const p2 = "M70 180 C 120 180, 130 120, 180 120";
  const p3 = "M272 120 C 300 120, 300 60, 330 60";
  const p4 = "M272 120 C 300 120, 300 180, 330 180";
  return (
    <svg viewBox="0 0 430 240" className="w-full" role="img" aria-label="Diagram: incoming emails and documents flow through an AI agent that routes work to the CRM and to a human reviewer">
      <G />
      {[p1, p2, p3, p4].map((d) => (
        <path key={d} d={d} fill="none" stroke="url(#sv-g)" strokeOpacity="0.55" strokeWidth="1.5" />
      ))}
      <Packet path={p1} />
      <Packet path={p2} delay={1.2} />
      <Packet path={p3} delay={0.6} dur={2.4} />
      <Packet path={p4} delay={1.8} dur={2.4} />
      <Box x={0} y={43} w={70} label="Emails" />
      <Box x={0} y={163} w={70} label="Documents" />
      <Box x={180} y={98} w={92} h={44} label="AI Agent" accent />
      <circle cx="226" cy="98" r="5" fill="#12D6B0" className="animate-pulse-soft" style={{ transformOrigin: "226px 98px" }} />
      <Box x={330} y={43} w={92} label="CRM updated" />
      <Box x={330} y={163} w={92} label="Human review" />
      <text x="226" y="170" textAnchor="middle" fill="#2864FF" fontSize="9.5" fontFamily="var(--font-inter)">
        classify · extract · route
      </text>
    </svg>
  );
}

function FunnelVisual() {
  const stages = [
    { label: "Reach", w: 320 },
    { label: "Engage", w: 250 },
    { label: "Convert", w: 180 },
    { label: "Retain", w: 120 },
  ];
  return (
    <svg viewBox="0 0 430 240" className="w-full" role="img" aria-label="Diagram: a marketing funnel from reach to retention, optimised by AI insights at each stage">
      <G />
      {stages.map((s, i) => (
        <motion.g key={s.label} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.6 }}>
          <rect x={(340 - s.w) / 2} y={20 + i * 52} width={s.w} height="40" rx="10" fill="url(#sv-g)" fillOpacity={0.12 + i * 0.1} stroke="url(#sv-g)" strokeOpacity="0.6" />
          <text x="170" y={45 + i * 52} textAnchor="middle" fill="#12D6B0" fontSize="11" fontFamily="var(--font-inter)">
            {s.label}
          </text>
        </motion.g>
      ))}
      <path d="M352 40 C 400 40, 400 200, 352 200" fill="none" stroke="#12D6B0" strokeOpacity="0.5" strokeDasharray="3 5" />
      <Packet path="M352 200 C 400 200, 400 40, 352 40" dur={3.5} />
      <text x="408" y="125" fill="#2864FF" fontSize="9.5" fontFamily="var(--font-inter)" transform="rotate(90 408 125)" textAnchor="middle">
        AI insights loop
      </text>
    </svg>
  );
}

function SupplyChainVisual() {
  const route = "M40 190 C 100 190, 100 60, 170 60 S 250 180, 300 180 S 370 70, 400 60";
  const nodes = [
    { x: 40, y: 190, label: "Supplier" },
    { x: 170, y: 60, label: "Warehouse" },
    { x: 300, y: 180, label: "Distribution" },
    { x: 400, y: 60, label: "Customer" },
  ];
  return (
    <svg viewBox="0 0 430 240" className="w-full" role="img" aria-label="Diagram: an animated flow network from supplier to warehouse to distribution to customer, with forecasting and alerts">
      <G />
      <path d={route} fill="none" stroke="url(#sv-g)" strokeWidth="2" strokeOpacity="0.7" />
      <path d={route} fill="none" stroke="#fff" strokeOpacity="0.8" strokeWidth="1.5" strokeDasharray="4 40" className="animate-dash" />
      <Packet path={route} dur={5} />
      <Packet path={route} dur={5} delay={2.5} />
      {nodes.map((n) => (
        <g key={n.label}>
          <circle cx={n.x} cy={n.y} r="16" fill="#0C1D38" stroke="url(#sv-g)" strokeWidth="1.5" />
          <circle cx={n.x} cy={n.y} r="5" fill="url(#sv-g)" />
          <text x={n.x} y={n.y + (n.y > 120 ? 32 : -24)} textAnchor="middle" fill="#00C9E8" fontSize="10" fontFamily="var(--font-inter)">
            {n.label}
          </text>
        </g>
      ))}
      <g transform="translate(205 120)">
        <rect width="92" height="26" rx="13" fill="rgb(40 100 255 / 0.18)" stroke="rgb(18 214 176 / 0.5)" />
        <text x="46" y="17" textAnchor="middle" fill="#12D6B0" fontSize="9.5" fontFamily="var(--font-inter)">
          Forecast ↑ demand
        </text>
      </g>
      <g transform="translate(316 112)">
        <rect width="78" height="26" rx="13" fill="rgb(251 113 133 / 0.12)" stroke="rgb(251 113 133 / 0.5)" />
        <text x="39" y="17" textAnchor="middle" fill="#12D6B0" fontSize="9.5" fontFamily="var(--font-inter)">
          Delay alert
        </text>
      </g>
    </svg>
  );
}

const SERIES = {
  Revenue: [30, 38, 34, 46, 52, 49, 61, 66, 72],
  Pipeline: [22, 28, 35, 33, 41, 47, 45, 55, 63],
  Efficiency: [40, 42, 47, 51, 50, 57, 60, 64, 69],
} as const;

/** Interactive dashboard-inspired illustration (sample shapes, no real data). */
function DashboardVisual() {
  const reduce = useReducedMotion();
  const [metric, setMetric] = useState<keyof typeof SERIES>("Revenue");
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setTick((t) => t + 1), 2600);
    return () => clearInterval(id);
  }, [reduce]);
  const data = SERIES[metric];
  const pts = data.map((v, i) => `${20 + i * 34},${150 - v * 1.6}`).join(" ");
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <div role="group" aria-label="Choose an illustrative metric" className="flex gap-1 rounded-full border border-line p-1">
          {(Object.keys(SERIES) as (keyof typeof SERIES)[]).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={metric === m}
              onClick={() => setMetric(m)}
              className={cn("rounded-full px-3 py-1 text-xs transition-colors", metric === m ? "bg-white/10 text-fg" : "text-muted hover:text-fg")}
            >
              {m}
            </button>
          ))}
        </div>
        <span className="text-[10px] uppercase tracking-wider text-muted">Illustrative</span>
      </div>
      <svg viewBox="0 0 320 170" className="w-full" role="img" aria-label={`Illustrative ${metric} trend chart with an insight annotation`}>
        <G />
        {[30, 70, 110, 150].map((y) => (
          <line key={y} x1="10" x2="310" y1={y} y2={y} stroke="rgb(40 100 255 / 0.12)" />
        ))}
        {data.map((v, i) => (
          <motion.rect
            key={`${metric}-${i}`}
            x={14 + i * 34}
            width="12"
            rx="3"
            fill="url(#sv-g)"
            fillOpacity="0.22"
            initial={{ height: 0, y: 150 }}
            animate={{ height: v * 1.6, y: 150 - v * 1.6 }}
            transition={{ duration: 0.6, delay: i * 0.04 }}
          />
        ))}
        <motion.polyline key={metric} points={pts} fill="none" stroke="url(#sv-g)" strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1 }} />
        <circle cx={20 + 8 * 34} cy={150 - data[8] * 1.6} r="5" fill="#12D6B0" />
      </svg>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {["Data sources", "Clean & model", "Insight"].map((s, i) => (
          <div key={s} className={cn("rounded-xl border px-3 py-2 text-center text-[11px] transition-colors duration-500", tick % 3 === i ? "border-accent/60 bg-accent/15 text-fg" : "border-line text-muted")}>
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProcessVisual() {
  const before = "M20 70 L60 30 L95 95 L130 40 L165 100 L200 50";
  return (
    <svg viewBox="0 0 430 240" className="w-full" role="img" aria-label="Diagram: a tangled process with many hand-offs simplified into a streamlined workflow">
      <G />
      <text x="20" y="20" fill="#2864FF" fontSize="10" fontFamily="var(--font-inter)">
        Before: hand-offs &amp; rework
      </text>
      <path d={before} fill="none" stroke="rgb(40 100 255 / 0.5)" strokeWidth="1.5" strokeDasharray="4 4" />
      {[
        [20, 70],
        [60, 30],
        [95, 95],
        [130, 40],
        [165, 100],
        [200, 50],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="6" fill="#0C1D38" stroke="rgb(40 100 255 / 0.6)" />
      ))}
      <text x="20" y="150" fill="#00C9E8" fontSize="10" fontFamily="var(--font-inter)">
        After: streamlined flow
      </text>
      <path d="M20 190 H 410" fill="none" stroke="url(#sv-g)" strokeWidth="2.5" />
      <Packet path="M20 190 H 410" dur={2.6} />
      {[20, 150, 280, 410].map((x, i) => (
        <g key={x}>
          <circle cx={x} cy="190" r="9" fill="#0C1D38" stroke="url(#sv-g)" strokeWidth="2" />
          <text x={x} y="220" textAnchor="middle" fill="#00C9E8" fontSize="9.5" fontFamily="var(--font-inter)">
            {["Request", "Validate", "Approve", "Done"][i]}
          </text>
        </g>
      ))}
      <path d="M260 60 h40 m-10 -8 l10 8 -10 8" stroke="url(#sv-g)" strokeWidth="2" fill="none" />
      <text x="320" y="64" fill="#12D6B0" fontSize="10.5" fontFamily="var(--font-inter)">
        less friction
      </text>
    </svg>
  );
}

function IntegrationVisual() {
  const systems = [
    { label: "CRM", a: -150 },
    { label: "ERP", a: -90 },
    { label: "E-commerce", a: -30 },
    { label: "Finance", a: 30 },
    { label: "Website", a: 90 },
    { label: "Analytics", a: 150 },
  ];
  const cx = 215,
    cy = 120;
  return (
    <svg viewBox="0 0 430 240" className="w-full" role="img" aria-label="Diagram: business systems such as CRM, ERP, finance and website connected through a central integration platform">
      <G />
      {systems.map((s) => {
        const r = (s.a * Math.PI) / 180;
        const x = cx + Math.cos(r) * 160;
        const y = cy + Math.sin(r) * 88;
        const d = `M${cx} ${cy} L${x} ${y}`;
        return (
          <g key={s.label}>
            <path d={d} stroke="url(#sv-g)" strokeOpacity="0.5" strokeWidth="1.5" />
            <Packet path={d} dur={2 + Math.abs(s.a) / 120} />
            <rect x={x - 38} y={y - 14} width="76" height="28" rx="8" fill="#0C1D38" stroke="rgb(40 100 255 / 0.3)" />
            <text x={x} y={y + 4} textAnchor="middle" fill="#12D6B0" fontSize="10" fontFamily="var(--font-inter)">
              {s.label}
            </text>
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r="34" fill="rgb(40 100 255 / 0.18)" stroke="url(#sv-g)" strokeWidth="1.5" />
      <text x={cx} y={cy - 2} textAnchor="middle" fill="#12D6B0" fontSize="10.5" fontFamily="var(--font-inter)">
        APIs &amp;
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="#12D6B0" fontSize="10.5" fontFamily="var(--font-inter)">
        platform
      </text>
    </svg>
  );
}
