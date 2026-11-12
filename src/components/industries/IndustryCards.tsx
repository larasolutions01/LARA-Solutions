import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { industries } from "@/content/industries";
import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/** Cinematic industry cards: zoom, overlay shift and challenge reveal on hover/focus. */
export function IndustryCards({ className }: { className?: string }) {
  return (
    <ul className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {industries.map((ind, i) => (
        <Reveal as="li" key={ind.slug} delay={(i % 4) * 0.06} className={cn(i < 2 && "lg:col-span-2")}>
          <Link
            href={`/industries/${ind.slug}`}
            data-cursor="Explore"
            className="group relative flex h-[22rem] flex-col justify-end overflow-hidden rounded-3xl text-white sm:h-[26rem]"
          >
            <Media
              photo={ind.photo}
              sizes={i < 2 ? "(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw" : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"}
              className="absolute inset-0"
              imgClassName="transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-110 group-focus-visible:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/5 transition-opacity duration-700 group-hover:opacity-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06215f] via-electric/55 to-electric/10 opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-focus-visible:opacity-100" />
            <div className="relative p-6 sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">{String(i + 1).padStart(2, "0")} · Industry</p>
              <h3 className="mt-2 flex items-center gap-2 text-2xl font-semibold">
                {ind.name}
                <ArrowUpRight aria-hidden className="size-5 opacity-0 transition-all duration-500 group-hover:translate-x-0.5 group-hover:opacity-100" />
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/80 transition-colors">{ind.tagline}</p>
              <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-700 ease-[var(--ease-out-expo)] group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]">
                <ul className="overflow-hidden">
                  <li className="pt-4 text-[11px] font-semibold uppercase tracking-wider text-white/60">Common challenges</li>
                  {ind.challenges.slice(0, 3).map((c) => (
                    <li key={c} className="mt-1.5 flex gap-2 text-sm text-white/90">
                      <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-sunrise" /> {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Link>
        </Reveal>
      ))}
    </ul>
  );
}
