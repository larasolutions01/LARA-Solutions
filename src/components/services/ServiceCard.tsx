import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/content/services";
import { servicePath } from "@/content/services";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { Media } from "@/components/ui/Media";
import { cn } from "@/lib/utils";

export function ServiceCard({ service, index, className }: { service: Service; index: number; className?: string }) {
  return (
    <Link
      href={servicePath(service.slug)}
      data-cursor="Explore"
      className={cn("card-surface group relative flex h-full flex-col overflow-hidden rounded-3xl transition-transform duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1", className)}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Media photo={service.photo} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="absolute inset-0" imgClassName="transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
        <span className="absolute left-5 top-5 flex size-12 items-center justify-center rounded-2xl bg-white/95 shadow-lg">
          <ServiceIcon name={service.icon} className="size-8" />
        </span>
        <span className="absolute bottom-4 right-5 font-display text-sm font-semibold text-white/90">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <p className="eyebrow">{service.shortName}</p>
        <h3 className="mt-3 text-[1.4rem] font-semibold leading-tight text-fg">{service.headline}</h3>
        <p className="mt-3 line-clamp-3 leading-relaxed text-body">{service.impact}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-7 font-display text-sm font-semibold text-fg">
          Explore Solution
          <ArrowUpRight aria-hidden className="size-4 text-accent transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
