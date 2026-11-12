"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { VideoClip } from "@/content/media";
import { cn } from "@/lib/utils";

/**
 * Muted, looping background video that only plays on larger screens, when
 * visible, and when the user hasn't asked for reduced motion or data saving.
 * Otherwise the poster image is shown.
 */
export function BackgroundVideo({ clip, className, overlayClassName }: { clip: VideoClip; className?: string; overlayClassName?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 767px)").matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    setEnabled(!reduce && !small && !conn?.saveData);
  }, []);

  useEffect(() => {
    if (!enabled || !box.current) return;
    const io = new IntersectionObserver(
      ([e]) => {
        const v = ref.current;
        if (!v) return;
        if (e?.isIntersecting) {
          if (!v.src) {
            v.src = clip.src;
            v.load();
          }
          v.play().catch(() => undefined);
        } else v.pause();
      },
      { rootMargin: "200px" },
    );
    io.observe(box.current);
    return () => io.disconnect();
  }, [enabled, clip.src]);

  return (
    <div ref={box} aria-hidden className={cn("absolute inset-0 overflow-hidden", className)}>
      <Image src={clip.poster} alt="" fill sizes="100vw" quality={65} className="object-cover" />
      {enabled && <video ref={ref} muted loop playsInline preload="none" poster={clip.poster} className="absolute inset-0 size-full object-cover" />}
      {overlayClassName && <div className={cn("absolute inset-0", overlayClassName)} />}
    </div>
  );
}
