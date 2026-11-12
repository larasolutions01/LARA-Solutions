"use client";

import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, AnimatePresence } from "motion/react";
import { ChevronDown, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { heroClips } from "@/content/media";
import { ButtonLink } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Interactive";
import { cn } from "@/lib/utils";

const CLIP_SECONDS = 6.5;
const FADE_MS = 1100;

type Mode = "poster" | "video";

/** Decide once on the client whether full-motion video is appropriate. */
function useHeroMode(): Mode {
  const [mode, setMode] = useState<Mode>("poster");
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 767px)").matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const slow = conn?.saveData || /(^|-)2g$/.test(conn?.effectiveType ?? "");
    setMode(reduce || small || slow ? "poster" : "video");
  }, []);
  return mode;
}

export function CinematicHero() {
  const mode = useHeroMode();
  const reduce = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(true);

  // Scroll-linked transform into the next section
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Mouse-responsive depth for the technology overlay
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const overlayX = useTransform(sx, (v) => v * 18);
  const overlayY = useTransform(sy, (v) => v * 12);
  const chipsX = useTransform(sx, (v) => v * -28);
  const chipsY = useTransform(sy, (v) => v * -18);

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my, reduce]);

  useEffect(() => {
    if (!section.current) return;
    const io = new IntersectionObserver(([e]) => setInView(Boolean(e?.isIntersecting)), { threshold: 0.05 });
    io.observe(section.current);
    return () => io.disconnect();
  }, []);

  const advance = useCallback(() => setIndex((i) => (i + 1) % heroClips.length), []);

  // Poster mode: timed slideshow (paused for reduced motion or when hidden)
  useEffect(() => {
    if (mode !== "poster" || reduce || !playing || !inView) return;
    const id = window.setInterval(advance, CLIP_SECONDS * 1000);
    return () => window.clearInterval(id);
  }, [mode, reduce, playing, inView, advance]);

  const active = heroClips[index]!;

  return (
    <section
      ref={section}
      aria-labelledby="hero-title"
      className="theme-dark section-theme relative isolate flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* ── Media layer ─────────────────────────────── */}
      <motion.div aria-hidden className="absolute inset-0 -z-20" style={{ scale: reduce ? 1 : mediaScale }}>
        {/* First poster always rendered for fast LCP and as the no-JS / fallback state */}
        <Image src={heroClips[0]!.poster} alt="" fill priority sizes="100vw" quality={70} className="object-cover" />
        {mode === "video" ? (
          <VideoMontage index={index} playing={playing && inView} onClipEnd={advance} />
        ) : (
          <PosterSlideshow index={index} animate={!reduce} />
        )}
      </motion.div>

      {/* Gradient & atmosphere */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgb(8_20_39/0.92)_0%,rgb(8_20_39/0.72)_38%,rgb(8_20_39/0.25)_70%,rgb(8_20_39/0.45)_100%)]" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-56 bg-gradient-to-t from-ink to-transparent" />
      <div aria-hidden className="absolute -left-40 top-1/3 -z-10 size-[36rem] rounded-full bg-electric/25 blur-[140px]" />

      {/* Technology overlay — subtle, never covering faces */}
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 -z-10 hidden md:block" style={{ x: overlayX, y: overlayY }}>
        <TechOverlay />
      </motion.div>
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block" style={{ x: chipsX, y: chipsY }}>
        <FloatingChips clipIndex={index} />
      </motion.div>

      {/* ── Content ─────────────────────────────────── */}
      <motion.div
        className="container-x relative flex flex-1 flex-col justify-center pb-28 pt-36 sm:pt-40"
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-white"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-aqua opacity-70 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-aqua" />
            </span>
            Intelligence That Drives Growth
          </motion.p>

          <h1 id="hero-title" className="mt-7 text-[2.9rem] font-semibold leading-[0.96] text-white sm:text-7xl lg:text-[5.6rem]">
            <HeroLine text="Your Business." delay={0.2} />
            <span className="block">
              <HeroLine text="Reimagined with" delay={0.42} />{" "}
              <span className="text-gradient">
                <HeroLine text="Intelligence." delay={0.6} />
              </span>
            </span>
          </h1>

          <SupportingLine />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.25 }}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl"
          >
            From intelligent automation and AI-powered marketing to optimised supply chains and smarter business decisions, LARA Solutions helps ambitious
            businesses unlock extraordinary possibilities.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Magnetic>
              <ButtonLink href="/contact" size="lg" arrow className="w-full shadow-[0_0_0_1px_rgb(255_255_255/0.08),0_18px_50px_-12px_rgb(40_100_255/0.9)] sm:w-auto">
                Transform My Business
              </ButtonLink>
            </Magnetic>
            <ButtonLink href="#ecosystem" variant="glass" size="lg">
              Discover Our Solutions
            </ButtonLink>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Clip controls & caption ─────────────────── */}
      <div className="container-x relative z-10 flex items-end justify-between gap-6 pb-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause background video" : "Play background video"}
            className="glass flex size-10 items-center justify-center rounded-full text-white transition hover:bg-white/20"
          >
            {playing ? <Pause aria-hidden className="size-4" /> : <Play aria-hidden className="size-4" />}
          </button>
          <div className="hidden sm:block">
            <AnimatePresence mode="wait">
              <motion.p
                key={active.key}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.4 }}
                className="text-sm text-white/80"
              >
                {active.label}
              </motion.p>
            </AnimatePresence>
            <p className="text-[11px] text-white/50">Illustrative footage · licensed stock</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5" role="group" aria-label="Choose scene">
          {heroClips.map((c, i) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show scene ${i + 1}: ${c.label}`}
              aria-current={i === index}
              className="group relative h-6 w-6 sm:w-8"
            >
              <span className={cn("absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full transition-colors", i === index ? "bg-white" : "bg-white/30 group-hover:bg-white/60")} />
            </button>
          ))}
        </div>
      </div>

      <a
        href="#ecosystem"
        aria-label="Scroll to the intelligent ecosystem"
        className="absolute bottom-24 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-white/60 hover:text-white lg:flex"
      >
        Scroll
        <ChevronDown aria-hidden className="size-4 animate-bounce motion-reduce:animate-none" />
      </a>
    </section>
  );
}

function HeroLine({ text, delay }: { text: string; delay: number }) {
  const words = text.split(" ");
  return (
    <>
      <span className="sr-only">{text}</span>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.1em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "110%", filter: "blur(8px)" }}
            animate={{ y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: delay + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </>
  );
}

const SUPPORT = ["Grow Smarter.", "Move Faster.", "Achieve More."];

function SupportingLine() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % SUPPORT.length), 2200);
    return () => window.clearInterval(id);
  }, [reduce]);
  return (
    <p className="mt-6 flex flex-wrap gap-x-4 gap-y-1 font-display text-xl font-medium text-white sm:text-2xl" aria-label={SUPPORT.join(" ")}>
      {SUPPORT.map((s, i) => (
        <motion.span
          key={s}
          aria-hidden
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.95 + i * 0.12 }}
          className="relative"
        >
          <span className={cn("transition-colors duration-500", active === i ? "text-white" : "text-white/55")}>{s}</span>
          <span
            className={cn(
              "absolute -bottom-1 left-0 h-[3px] rounded-full bg-gradient-to-r from-aqua to-fresh transition-all duration-700 ease-[var(--ease-out-expo)]",
              active === i ? "w-full opacity-100" : "w-0 opacity-0",
            )}
          />
        </motion.span>
      ))}
    </p>
  );
}

/** Two stacked videos crossfade between clips; next clip is preloaded. */
function VideoMontage({ index, playing, onClipEnd }: { index: number; playing: boolean; onClipEnd: () => void }) {
  const refs = [useRef<HTMLVideoElement>(null), useRef<HTMLVideoElement>(null)];
  const [front, setFront] = useState(0);
  const shownIndex = useRef<number>(-1);
  const endTimer = useRef<number | null>(null);

  // Load requested clip into the back buffer, then fade it in
  useEffect(() => {
    if (shownIndex.current === index) return;
    const back = shownIndex.current === -1 ? front : 1 - front;
    const v = refs[back]!.current;
    if (!v) return;
    const clip = heroClips[index]!;
    if (!v.src.endsWith(clip.src)) {
      v.src = clip.src;
      v.load();
    }
    v.currentTime = 0;
    const start = () => {
      v.play().catch(() => undefined);
      setFront(back);
      shownIndex.current = index;
    };
    if (v.readyState >= 3) start();
    else v.addEventListener("canplay", start, { once: true });
    return () => v.removeEventListener("canplay", start);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // Preload the following clip into the idle buffer once the front one is playing
  useEffect(() => {
    const idle = refs[1 - front]!.current;
    if (!idle) return;
    const next = heroClips[(index + 1) % heroClips.length]!;
    const t = window.setTimeout(() => {
      if (!idle.src.endsWith(next.src)) {
        idle.preload = "auto";
        idle.src = next.src;
        idle.load();
      }
    }, FADE_MS + 300);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [front, index]);

  // Play/pause + clip duration timer
  useEffect(() => {
    const v = refs[front]!.current;
    if (!v) return;
    if (endTimer.current) window.clearTimeout(endTimer.current);
    if (playing) {
      v.play().catch(() => undefined);
      const remaining = Math.max(1.5, CLIP_SECONDS - v.currentTime) * 1000;
      endTimer.current = window.setTimeout(onClipEnd, remaining);
    } else {
      v.pause();
    }
    return () => {
      if (endTimer.current) window.clearTimeout(endTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, front, onClipEnd]);

  useEffect(() => {
    const onVis = () => {
      const v = refs[front]!.current;
      if (!v) return;
      if (document.hidden) v.pause();
      else if (playing) v.play().catch(() => undefined);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [front, playing]);

  return (
    <>
      {[0, 1].map((n) => (
        <video
          key={n}
          ref={refs[n]}
          muted
          playsInline
          preload={n === 0 ? "auto" : "none"}
          disablePictureInPicture
          className={cn(
            "absolute inset-0 size-full object-cover transition-[opacity,transform] ease-out",
            front === n ? "scale-100 opacity-100" : "scale-[1.06] opacity-0",
          )}
          style={{ transitionDuration: `${FADE_MS}ms, ${CLIP_SECONDS * 1000}ms` }}
        />
      ))}
    </>
  );
}

function PosterSlideshow({ index, animate }: { index: number; animate: boolean }) {
  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={index}
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.2 }}
      >
        <Image
          src={heroClips[index]!.poster}
          alt=""
          fill
          sizes="100vw"
          quality={70}
          className={cn("object-cover", animate && "animate-ken-burns")}
        />
      </motion.div>
    </AnimatePresence>
  );
}

function TechOverlay() {
  const nodes = [
    [62, 22], [78, 30], [70, 48], [86, 56], [64, 70], [92, 38], [55, 40], [80, 78],
  ] as const;
  const links: [number, number][] = [[0, 1], [1, 2], [2, 3], [2, 4], [1, 5], [0, 6], [6, 2], [4, 7], [3, 7]];
  return (
    <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id="ov-line" x1="0" x2="1">
          <stop stopColor="#00C9E8" stopOpacity="0.15" />
          <stop offset="1" stopColor="#12D6B0" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      {links.map(([a, b], i) => (
        <g key={i}>
          <line x1={nodes[a]![0]} y1={nodes[a]![1]} x2={nodes[b]![0]} y2={nodes[b]![1]} stroke="url(#ov-line)" strokeWidth="0.12" vectorEffect="non-scaling-stroke" />
          <line
            x1={nodes[a]![0]}
            y1={nodes[a]![1]}
            x2={nodes[b]![0]}
            y2={nodes[b]![1]}
            stroke="#ffffff"
            strokeOpacity="0.7"
            strokeWidth="1.2"
            strokeDasharray="2 26"
            vectorEffect="non-scaling-stroke"
            className="animate-dash"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        </g>
      ))}
      {nodes.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="0.9" fill="#00C9E8" fillOpacity="0.25" className="animate-pulse-soft" style={{ transformOrigin: `${x}px ${y}px`, animationDelay: `${i * 0.4}s` }} />
          <circle cx={x} cy={y} r="0.32" fill="#ffffff" />
        </g>
      ))}
    </svg>
  );
}

const CHIPS = [
  { text: "Workflow automated", tone: "fresh", pos: "right-[8%] top-[24%]" },
  { text: "Demand forecast updated", tone: "aqua", pos: "right-[22%] top-[58%]" },
  { text: "New lead routed to sales", tone: "sunrise", pos: "right-[5%] top-[72%]" },
] as const;

function FloatingChips({ clipIndex }: { clipIndex: number }) {
  return (
    <>
      {CHIPS.map((c, i) => (
        <motion.div
          key={c.text}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.8 + i * 0.25 }}
          className={cn("absolute", c.pos)}
        >
          <div className="glass flex items-center gap-2.5 rounded-2xl px-4 py-3 text-sm text-white shadow-2xl shadow-black/30 animate-float" style={{ animationDelay: `${i * 1.2}s` }}>
            <span
              className={cn(
                "flex size-2.5 rounded-full",
                c.tone === "fresh" && "bg-fresh",
                c.tone === "aqua" && "bg-aqua",
                c.tone === "sunrise" && "bg-sunrise",
              )}
            />
            <span key={clipIndex % 2} className="font-medium">
              {c.text}
            </span>
            <svg viewBox="0 0 40 14" className="ml-1 h-3.5 w-10" aria-hidden>
              <polyline points="0,12 8,9 16,10 24,5 32,6 40,1" fill="none" stroke="currentColor" strokeOpacity="0.8" strokeWidth="1.5" />
            </svg>
          </div>
        </motion.div>
      ))}
    </>
  );
}
