"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import type { PhotoKey } from "@/content/media";
import { RevealImage } from "@/components/ui/RevealImage";
import { Reveal, RevealText } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const columns: { photo: PhotoKey; caption: string; aspect: string }[][] = [
  [
    { photo: "people-entrepreneur", caption: "Entrepreneurs building their vision", aspect: "aspect-[4/5]" },
    { photo: "people-warehouse", caption: "Teams coordinating logistics", aspect: "aspect-[4/3]" },
  ],
  [
    { photo: "people-team", caption: "Solving problems together", aspect: "aspect-[4/3]" },
    { photo: "people-creative", caption: "Creative minds collaborating", aspect: "aspect-[4/5]" },
    { photo: "people-tech", caption: "Technology that helps people work better", aspect: "aspect-[4/3]" },
  ],
  [
    { photo: "people-planning", caption: "Leaders planning what’s next", aspect: "aspect-[4/5]" },
    { photo: "people-celebrate", caption: "Celebrating progress", aspect: "aspect-[4/3]" },
  ],
];

function Column({ items, y, className, layout = "flex flex-col" }: { items: (typeof columns)[number]; y: MotionValue<number> | undefined; className?: string; layout?: string }) {
  return (
    <motion.div className={cn(layout, "gap-4 sm:gap-5", className)} style={y ? { y } : undefined}>
      {items.map((it) => (
        <figure key={it.photo} className="group relative">
          <RevealImage photo={it.photo} className={cn(it.aspect, "w-full")} rounded="rounded-3xl" sizes="(min-width: 1024px) 28vw, 45vw" parallax={25}>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
          </RevealImage>
          <figcaption className="absolute inset-x-4 bottom-4 text-sm font-medium text-white drop-shadow">{it.caption}</figcaption>
        </figure>
      ))}
    </motion.div>
  );
}

export function PeopleMontage() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-40, 80]);
  const y3 = useTransform(scrollYProgress, [0, 1], [100, -40]);

  return (
    <section ref={ref} aria-labelledby="people-title" className="theme-light section-theme relative overflow-hidden py-24 sm:py-32">
      <div aria-hidden className="absolute -left-40 top-20 size-[28rem] rounded-full bg-aqua/15 blur-[120px]" />
      <div aria-hidden className="absolute -right-32 bottom-10 size-[26rem] rounded-full bg-sunrise/20 blur-[120px]" />
      <div className="container-x relative">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="eyebrow">Human at heart</p>
          </Reveal>
          <h2 id="people-title" className="mt-5 text-4xl font-semibold leading-[1.02] text-fg sm:text-5xl lg:text-6xl">
            <RevealText text="Technology Is Powerful." />{" "}
            <span className="text-gradient">
              <RevealText text="People Make It Meaningful." delay={0.15} />
            </span>
          </h2>
          <Reveal delay={0.25}>
            <p className="mt-6 text-lg leading-relaxed text-body sm:text-xl">
              We believe technology should empower people, remove complexity, and create space for meaningful progress. That’s why every solution we design
              begins with understanding the people and businesses behind the challenge.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
          <Column items={columns[0]!} y={reduce ? undefined : y1} />
          <Column items={columns[1]!} y={reduce ? undefined : y2} className="lg:-mt-10" />
          <Column items={columns[2]!} y={reduce ? undefined : y3} layout="grid grid-cols-2 lg:flex lg:flex-col" className="col-span-2 lg:col-span-1 lg:mt-16" />
        </div>
        <p className="mt-10 text-center text-xs text-muted">Photography is licensed stock used for illustration — not LARA Solutions staff or clients.</p>
      </div>
    </section>
  );
}
