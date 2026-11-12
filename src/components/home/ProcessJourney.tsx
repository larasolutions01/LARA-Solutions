"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/lib/use-media-query";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { approachSteps } from "@/content/navigation";
import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const PIN_QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

/**
 * "From Business Challenge to Breakthrough" — pinned, scroll-choreographed
 * journey on desktop (GSAP ScrollTrigger); simple stacked steps elsewhere.
 */
export function ProcessJourney() {
  const root = useRef<HTMLDivElement>(null);
  const pinEl = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  // Decide the layout first; the ScrollTrigger is created only after React has
  // rendered the pinned (h-screen) layout, so it measures the real height.
  const pinned = useMediaQuery(PIN_QUERY);

  useEffect(() => {
    if (!pinned || !pinEl.current) return;
    const steps = approachSteps.length;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinEl.current,
          start: "top top",
          end: () => `+=${window.innerHeight * steps * 0.65}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 1, // above the work showcase on the page → refresh first
          onUpdate: (self) => {
            const idx = Math.min(steps - 1, Math.floor(self.progress * steps));
            setActive((prev) => (prev === idx ? prev : idx));
          },
        },
      });
      tl.fromTo(line.current, { scaleY: 0 }, { scaleY: 1, ease: "none" });
    }, root);
    // Re-measure every trigger now that this section's pin spacer exists.
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
      setActive(0);
    };
  }, [pinned]);

  return (
    <section ref={root} aria-labelledby="journey-title" className="theme-dark section-theme relative">
      <div ref={pinEl} className={cn("relative overflow-hidden", pinned ? "h-screen" : "py-24 sm:py-32")}>
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgb(40_100_255/0.28),transparent_60%)]" />
        <div className={cn("container-x relative", pinned && "flex h-full flex-col justify-center pt-20")}>
          <div className="max-w-3xl">
            <Reveal>
              <p className="eyebrow flex items-center gap-3">
                <span className="text-muted">05</span>
                <span aria-hidden className="h-px w-8 bg-gradient-to-r from-electric to-aqua" />
                Our Process
              </p>
              <h2 id="journey-title" className="mt-5 text-4xl font-semibold leading-[1.02] text-fg sm:text-5xl lg:text-[3.4rem]">
                From Business Challenge to <span className="text-gradient">Breakthrough.</span>
              </h2>
            </Reveal>
          </div>

          {pinned ? (
            <div className="mt-12 grid flex-1 grid-cols-12 gap-10 pb-16" style={{ maxHeight: "62vh" }}>
              {/* Stage list with advancing pathway */}
              <ol className="relative col-span-5 flex flex-col justify-between py-2">
                <span aria-hidden className="absolute bottom-3 left-[19px] top-3 w-px bg-white/15" />
                <div ref={line} aria-hidden className="absolute bottom-3 left-[19px] top-3 w-px origin-top bg-gradient-to-b from-electric via-aqua to-fresh" />
                {approachSteps.map((s, i) => {
                  const on = i === active;
                  const past = i < active;
                  return (
                    <li key={s.n} className="relative flex items-start gap-5" aria-current={on ? "step" : undefined}>
                      <span
                        className={cn(
                          "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border font-display text-xs font-semibold transition-all duration-500",
                          on && "scale-110 border-transparent bg-electric text-white shadow-[0_0_0_6px_rgb(40_100_255/0.2),0_0_30px_rgb(40_100_255/0.7)]",
                          past && "border-transparent bg-white/15 text-white",
                          !on && !past && "border-white/20 bg-ink text-white/50",
                        )}
                      >
                        {s.n}
                      </span>
                      <div className="pt-1.5">
                        <h3 className={cn("font-display text-xl font-semibold transition-colors duration-500", on ? "text-white" : "text-white/45")}>{s.title}</h3>
                        <p className={cn("mt-1 max-w-sm overflow-hidden text-sm leading-relaxed text-white/75 transition-all duration-500", on ? "max-h-28 opacity-100" : "max-h-0 opacity-0")}>
                          {s.body}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
              {/* Stage visuals */}
              <div className="relative col-span-7 overflow-hidden rounded-[2rem]">
                {approachSteps.map((s, i) => (
                  <div
                    key={s.n}
                    className={cn("absolute inset-0 transition-[opacity,transform] duration-700 ease-[var(--ease-out-expo)]", i === active ? "scale-100 opacity-100" : "scale-105 opacity-0")}
                    aria-hidden={i !== active}
                  >
                    <Media photo={s.photo} sizes="55vw" className="absolute inset-0" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                  </div>
                ))}
                <div className="absolute inset-x-6 bottom-6 flex items-end justify-between">
                  <p className="font-display text-6xl font-semibold text-white/90">{approachSteps[active]!.n}</p>
                  <p className="max-w-xs text-right text-sm text-white/80">{approachSteps[active]!.title} — a business evolving from complexity to clarity.</p>
                </div>
              </div>
            </div>
          ) : (
            <ol className="mt-12 grid gap-6 md:grid-cols-2">
              {approachSteps.map((s, i) => (
                <Reveal as="li" key={s.n} delay={(i % 2) * 0.08} className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
                  <div className="relative aspect-[16/9]">
                    <Media photo={s.photo} sizes="(min-width: 768px) 45vw, 100vw" className="absolute inset-0" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
                    <span className="absolute bottom-4 left-5 font-display text-4xl font-semibold text-white">{s.n}</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/75">{s.body}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  );
}
