"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import type { PhotoKey } from "@/content/media";
import { Media } from "./Media";
import { cn } from "@/lib/utils";

/**
 * Photo revealed through an expanding mask as it scrolls into view, with
 * gentle parallax inside the frame. Static for reduced-motion users.
 */
export function RevealImage({
  photo,
  className,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  parallax = 60,
  children,
  priority,
  rounded = "rounded-[2rem]",
}: {
  photo: PhotoKey;
  className?: string;
  sizes?: string;
  parallax?: number;
  children?: ReactNode;
  priority?: boolean;
  rounded?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-parallax, parallax]);

  return (
    <motion.div
      ref={ref}
      className={cn("overflow-hidden", !/\babsolute\b/.test(className ?? "") && "relative", rounded, className)}
      initial={reduce ? false : { clipPath: "inset(14% 10% 14% 10% round 40px)", opacity: 0.4 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0% round 0px)", opacity: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div className="absolute -inset-y-[12%] inset-x-0" style={reduce ? undefined : { y }}>
        <Media photo={photo} sizes={sizes} priority={priority} className="absolute inset-0" />
      </motion.div>
      {children}
    </motion.div>
  );
}
