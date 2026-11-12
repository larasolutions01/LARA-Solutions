"use client";

import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { useCallback, type ReactNode, type PointerEvent } from "react";
import { cn } from "@/lib/utils";

/** Subtle magnetic pull toward the cursor (desktop pointer only). */
export function Magnetic({ children, strength = 0.25, className }: { children: ReactNode; strength?: number; className?: string }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (reduce || e.pointerType !== "mouse") return;
      const r = e.currentTarget.getBoundingClientRect();
      x.set((e.clientX - (r.left + r.width / 2)) * strength);
      y.set((e.clientY - (r.top + r.height / 2)) * strength);
    },
    [reduce, strength, x, y],
  );

  return (
    <motion.div
      className={cn("inline-block", className)}
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/** Card wrapper that feeds cursor position to the `.spotlight` CSS effect. */
export function Spotlight({ children, className, ...rest }: { children: ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("spotlight", className)}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
