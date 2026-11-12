"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Check } from "lucide-react";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { heroNodes } from "./nodes";
import { Media } from "@/components/ui/Media";
import { cn } from "@/lib/utils";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

function fallbackPos(angle: number) {
  const a = (angle * Math.PI) / 180;
  return { left: 50 + Math.cos(a) * 37, top: 50 - Math.sin(a) * 31 };
}

/**
 * "One Intelligent Ecosystem" — the LARA intelligence core with six orbiting
 * business functions. Hover/focus previews a function; click opens it.
 * On touch, the first tap previews and the second opens.
 */
export function EcosystemVisual() {
  const router = useRouter();
  const wrap = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLElement | null)[]>([]);
  const pointerType = useRef<string>("mouse");
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string>(heroNodes[0]!.id);
  const [running, setRunning] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [lowPower, setLowPower] = useState(false);
  const [canRender3D, setCanRender3D] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    setLowPower(window.innerWidth < 768 || (navigator.hardwareConcurrency ?? 8) <= 4);
    setCanRender3D(hasWebGL());
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!wrap.current) return;
    const io = new IntersectionObserver(([entry]) => setRunning(Boolean(entry?.isIntersecting)), { rootMargin: "150px" });
    io.observe(wrap.current);
    return () => io.disconnect();
  }, []);

  const previewId = hoverId ?? selectedId;
  const preview = heroNodes.find((n) => n.id === previewId) ?? heroNodes[0]!;

  const activate = (id: string, href: string) => {
    if (pointerType.current === "mouse" || selectedId === id) router.push(href);
    else setSelectedId(id);
  };

  return (
    <div className="grid items-center gap-10 lg:grid-cols-12">
      {/* 3D universe */}
      <div className="lg:order-2 lg:col-span-7">
        <div ref={wrap} className="relative aspect-[1/0.92] w-full sm:aspect-[1.3/1] lg:aspect-[1.12/1]">
          <div aria-hidden className={cn("absolute inset-0 transition-opacity duration-700", ready ? "opacity-0" : "opacity-100")}>
            <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {heroNodes.map((n) => {
                const p = fallbackPos(n.angle);
                return <line key={n.id} x1="50" y1="50" x2={p.left} y2={p.top} stroke={n.color} strokeOpacity="0.45" strokeWidth="0.3" vectorEffect="non-scaling-stroke" />;
              })}
            </svg>
            <div className="absolute left-1/2 top-1/2 size-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/40 blur-3xl" />
            <div className="absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-white to-aqua shadow-[0_0_80px_rgb(40_100_255/0.9)]" />
          </div>

          {canRender3D && (
            <SceneBoundary onError={() => setCanRender3D(false)}>
              <HeroScene
                activeId={previewId}
                hoverId={hoverId}
                labelRefs={labelRefs}
                reducedMotion={reduced}
                lowPower={lowPower}
                running={running}
                onReady={() => setReady(true)}
              />
            </SceneBoundary>
          )}

          <ul aria-label="Business functions in the LARA ecosystem" className="absolute inset-0">
            {heroNodes.map((n, i) => {
              const p = fallbackPos(n.angle);
              const on = previewId === n.id;
              return (
                <li
                  key={n.id}
                  ref={(el) => {
                    labelRefs.current[i] = el;
                  }}
                  className="absolute size-0"
                  style={{ left: `${p.left}%`, top: `${p.top}%` }}
                >
                  <button
                    type="button"
                    aria-describedby="ecosystem-detail"
                    onPointerDown={(e) => (pointerType.current = e.pointerType)}
                    onClick={() => activate(n.id, n.href)}
                    onMouseEnter={() => setHoverId(n.id)}
                    onMouseLeave={() => setHoverId(null)}
                    onFocus={() => setHoverId(n.id)}
                    onBlur={() => setHoverId(null)}
                    className={cn(
                      "absolute left-1/2 top-3.5 -translate-x-1/2 whitespace-nowrap rounded-full border px-3 py-1 font-display text-[11px] font-semibold tracking-tight backdrop-blur-md transition-all duration-300 sm:px-3.5 sm:py-1.5 sm:text-xs",
                      on ? "scale-110 border-white/70 bg-white text-ink shadow-[0_0_30px_rgb(40_100_255/0.6)]" : "border-white/20 bg-ink/60 text-white/85 hover:border-white/50",
                    )}
                  >
                    <span className="mr-1.5 inline-block size-1.5 rounded-full align-middle" style={{ background: n.color }} />
                    {n.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Detail / preview panel */}
      <div className="lg:order-1 lg:col-span-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={preview.id}
            id="ecosystem-detail"
            aria-live="polite"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden rounded-3xl border border-white/12 bg-white/[0.04] backdrop-blur"
          >
            <div className="relative aspect-[16/9]">
              <Media photo={preview.photo} sizes="(min-width: 1024px) 40vw, 100vw" className="absolute inset-0" imgClassName="scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
              <span className="absolute left-5 top-5 rounded-full px-3 py-1 text-[11px] font-semibold text-ink" style={{ background: preview.color }}>
                {preview.label}
              </span>
            </div>
            <div className="p-6 sm:p-7">
              <p className="text-lg leading-relaxed text-white/90">{preview.description}</p>
              <ul className="mt-5 space-y-2">
                {preview.points.map((pt) => (
                  <li key={pt} className="flex items-center gap-2.5 text-sm text-white/80">
                    <Check aria-hidden className="size-4 text-fresh" /> {pt}
                  </li>
                ))}
              </ul>
              <Link href={preview.href} className="mt-6 inline-flex items-center gap-1.5 font-display text-sm font-semibold text-aqua hover:text-white">
                Explore {preview.label} <ArrowUpRight aria-hidden className="size-4" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
        <p className="mt-4 text-xs text-white/50">Hover or focus a function to preview it · select to open · on touch, tap twice</p>
      </div>
    </div>
  );
}
