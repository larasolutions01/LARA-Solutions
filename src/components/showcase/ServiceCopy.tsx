"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import type { Service } from "@/content/services";
import { servicePath } from "@/content/services";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/** Shared copy block for each showcase category, with expandable capabilities. */
export function ServiceCopy({
  service,
  index,
  lead,
  visible = 4,
  tone = "default",
}: {
  service: Service;
  index: number;
  lead?: string;
  visible?: number;
  tone?: "default" | "onMedia";
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const shown = service.capabilities.slice(0, visible);
  const extra = service.capabilities.slice(visible);
  return (
    <div>
      <Reveal>
        <p className="eyebrow flex items-center gap-3">
          <span className={tone === "onMedia" ? "text-white/60" : "text-muted"}>0{index}</span>
          <span aria-hidden className="h-px w-8 bg-gradient-to-r from-electric to-aqua" />
          {service.shortName}
        </p>
        <h3 className={cn("mt-5 text-3xl font-semibold leading-[1.05] sm:text-4xl lg:text-[2.9rem]", tone === "onMedia" ? "text-white" : "text-fg")}>{service.headline}</h3>
        <p className={cn("mt-5 text-lg leading-relaxed", tone === "onMedia" ? "text-white/85" : "text-body")}>{lead ?? service.impact}</p>
      </Reveal>
      <Reveal delay={0.1}>
        <ul className="mt-7 flex flex-wrap gap-2">
          {shown.map((c) => (
            <li
              key={c}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm",
                tone === "onMedia" ? "border border-white/20 bg-white/10 text-white backdrop-blur" : "border border-line bg-card text-body",
              )}
            >
              <Check aria-hidden className={cn("size-3.5", tone === "onMedia" ? "text-fresh" : "text-electric")} /> {c}
            </li>
          ))}
        </ul>
        {extra.length > 0 && (
          <>
            <AnimatePresence initial={false}>
              {open && (
                <motion.ul
                  id={id}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-wrap gap-2 overflow-hidden pt-2"
                >
                  {extra.map((c) => (
                    <li
                      key={c}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm",
                        tone === "onMedia" ? "border border-white/20 bg-white/10 text-white" : "border border-line bg-card text-body",
                      )}
                    >
                      <Check aria-hidden className={cn("size-3.5", tone === "onMedia" ? "text-fresh" : "text-electric")} /> {c}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
            <button
              type="button"
              aria-expanded={open}
              aria-controls={id}
              onClick={() => setOpen((v) => !v)}
              className={cn("mt-4 inline-flex items-center gap-1.5 text-sm font-semibold", tone === "onMedia" ? "text-white/80 hover:text-white" : "text-accent hover:text-fg")}
            >
              {open ? "Show fewer capabilities" : `Show all ${service.capabilities.length} capabilities`}
              <ChevronDown aria-hidden className={cn("size-4 transition-transform", open && "rotate-180")} />
            </button>
          </>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={servicePath(service.slug)} arrow variant={tone === "onMedia" ? "white" : "primary"}>
            Explore {service.shortName}
          </ButtonLink>
          <ButtonLink href={`/contact?service=${encodeURIComponent(service.name)}`} variant={tone === "onMedia" ? "glass" : "secondary"}>
            Discuss a project
          </ButtonLink>
        </div>
      </Reveal>
    </div>
  );
}
