"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

/** Scroll-triggered entrance. Honours reduced motion via the root MotionConfig. */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = "div",
  ...rest
}: { children: ReactNode; delay?: number; y?: number; className?: string; as?: "div" | "li" | "section" | "article" } & Omit<HTMLMotionProps<"div">, "children">) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/** Word-by-word staggered heading reveal. */
export function RevealText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom" aria-hidden>
          <motion.span
            className="inline-block"
            initial={{ y: "105%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: delay + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
