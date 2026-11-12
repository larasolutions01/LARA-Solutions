"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/lib/use-media-query";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { resolvePhoto } from "@/content/media";
import { Media } from "@/components/ui/Media";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const PIN_QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

export interface WorkItem {
  slug: string;
  title: string;
  summary: string;
  industry: string;
  category: string;
  type: "illustrative" | "client";
  technology: string[];
  cover?: string;
}

/** Horizontal project showcase controlled by vertical scrolling (desktop). */
export function WorkShowcase({ items }: { items: WorkItem[] }) {
  const section = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  // Layout first, then measure: the ScrollTrigger is created after React has
  // rendered the pinned layout (no overflow wrapper, full-height section).
  const pinned = useMediaQuery(PIN_QUERY);

  useEffect(() => {
    if (!pinned || !track.current || !section.current) return;
    const el = track.current;
    const distance = () => Math.max(0, el.scrollWidth - window.innerWidth + 96);
    const ctx = gsap.context(() => {
      gsap.to(el, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          refreshPriority: 0,
        },
      });
    }, section);
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, [pinned]);

  return (
    <section aria-labelledby="work-title" className="theme-sky section-theme relative overflow-hidden">
      <div ref={section} className={cn("flex flex-col justify-center", pinned ? "h-screen" : "py-24 sm:py-32")}>
        <div className="container-x flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow flex items-center gap-3">
              <span className="text-muted">07</span>
              <span aria-hidden className="h-px w-8 bg-gradient-to-r from-electric to-aqua" />
              Our Work
            </p>
            <h2 id="work-title" className="mt-5 text-4xl font-semibold leading-[1.02] text-fg sm:text-5xl lg:text-[3.4rem]">
              Intelligence, <span className="text-gradient">applied.</span>
            </h2>
            <p className="mt-5 text-lg text-body">
              Illustrative use-case demonstrations, clearly labelled. Verified client projects are published only with approval — we never invent customers or results.
            </p>
          </div>
          <ButtonLink href="/work" variant="secondary" arrow>
            View all work
          </ButtonLink>
        </div>

        <div className={cn("mt-12", !pinned && "overflow-x-auto pb-6 [scrollbar-width:thin] snap-x snap-mandatory")}>
          <div ref={track} className="flex w-max gap-6 px-5 sm:px-8 lg:px-12">
            {items.map((s, i) => {
              const img = resolvePhoto(s.cover);
              return (
                <Link
                  key={s.slug}
                  href={`/work/${s.slug}`}
                  data-cursor="View"
                  className="group card-surface relative flex w-[84vw] shrink-0 snap-start flex-col overflow-hidden rounded-[1.75rem] sm:w-[30rem] lg:w-[34rem]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Media image={img} sizes="(min-width: 1024px) 34rem, 84vw" className="absolute inset-0" imgClassName="transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-ink">
                      {s.type === "illustrative" ? "Illustrative scenario" : "Client project"}
                    </span>
                    <span className="absolute bottom-4 left-5 font-display text-5xl font-semibold text-white/90">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-accent">{s.industry}</p>
                    <h3 className="mt-2 text-xl font-semibold leading-snug text-fg">{s.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-body">{s.summary}</p>
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {s.technology.slice(0, 3).map((t) => (
                        <li key={t} className="rounded-full bg-section-tint px-2.5 py-1 text-[11px] text-body">
                          {t}
                        </li>
                      ))}
                    </ul>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-5 font-display text-sm font-semibold text-fg">
                      Explore the scenario <ArrowUpRight aria-hidden className="size-4 text-accent transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
            <div className="flex w-[70vw] shrink-0 flex-col justify-center rounded-[1.75rem] bg-ink p-8 text-white sm:w-[22rem]">
              <p className="font-display text-2xl font-semibold">Your project could be next.</p>
              <p className="mt-3 text-sm text-white/75">Tell us about your challenge and we’ll show you what’s possible.</p>
              <ButtonLink href="/contact" className="mt-6 self-start" arrow>
                Start a conversation
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
