"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger and
 * Lenis stay perfectly in sync. Skipped entirely for reduced-motion users
 * (they get native scrolling). Touch devices keep native scrolling too.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      anchors: { offset: -96 },
      autoRaf: false,
    });
    window.__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  // Pinned sections measure positions once; re-measure whenever something
  // above them changes height (images, fonts, client-side content), and when
  // the page-in animation finishes.
  useEffect(() => {
    let timer: number | undefined;
    let lastHeight = document.body.scrollHeight;
    const refresh = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    };
    const ro = new ResizeObserver(() => {
      const h = document.body.scrollHeight;
      if (Math.abs(h - lastHeight) > 2) {
        lastHeight = h;
        refresh();
      }
    });
    ro.observe(document.body);
    const onAnimEnd = (e: AnimationEvent) => {
      if (e.animationName === "page-in") refresh();
    };
    document.addEventListener("animationend", onAnimEnd);
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh).catch(() => {});
    return () => {
      ro.disconnect();
      window.clearTimeout(timer);
      document.removeEventListener("animationend", onAnimEnd);
      window.removeEventListener("load", refresh);
    };
  }, []);

  // Recalculate scroll-linked layouts after client-side navigation.
  useEffect(() => {
    const id = window.setTimeout(() => {
      window.__lenis?.resize();
      ScrollTrigger.refresh();
    }, 120);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
