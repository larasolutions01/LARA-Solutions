"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

/**
 * Tasteful cursor label for media cards (elements with `data-cursor`).
 * Desktop fine-pointer only; the normal system cursor always remains.
 */
export function CursorFollower() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  const [label, setLabel] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]");
      setLabel(el ? el.dataset.cursor || "View" : null);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);

  if (!enabled) return null;
  return (
    <motion.div aria-hidden className="cursor-follower pointer-events-none fixed left-0 top-0 z-[90]" style={{ x: sx, y: sy }}>
      <AnimatePresence>
        {label && (
          <motion.span
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 font-display text-xs font-semibold text-ink shadow-xl backdrop-blur"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
