"use client";

import dynamic from "next/dynamic";
import { AnimatePresence } from "motion/react";
import { MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const AssistantPanel = dynamic(() => import("./AssistantPanel"), { ssr: false });

export function AssistantLauncher() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (open) setLoaded(true);
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <AnimatePresence>{open && loaded && <AssistantPanel onClose={() => setOpen(false)} />}</AnimatePresence>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="lara-assistant"
        aria-label={open ? "Close website assistant" : "Open website assistant"}
        className={cn(
          "fixed bottom-5 right-5 z-[60] flex size-14 items-center justify-center rounded-full text-white shadow-[0_10px_40px_-8px_rgb(0_0_0/0.45)] transition-transform duration-300 hover:scale-105 sm:bottom-7 sm:right-7",
          "bg-electric",
        )}
      >
        <span aria-hidden className="absolute inset-0 rounded-full ring-1 ring-white/20" />
        {open ? <X aria-hidden className="size-6" /> : <MessageCircle aria-hidden className="size-6" />}
      </button>
    </>
  );
}
