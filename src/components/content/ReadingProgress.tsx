"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Thin reading-progress bar pinned under the header on article pages. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-gradient-to-r from-electric via-aqua to-fresh"
      style={{ scaleX }}
    />
  );
}
