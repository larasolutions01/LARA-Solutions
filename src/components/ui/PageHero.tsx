import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { photos, type PhotoKey } from "@/content/media";
import { Reveal, RevealText } from "./Reveal";
import { JsonLd } from "./Section";
import { breadcrumbJsonLd } from "@/lib/seo";
import { cn } from "@/lib/utils";

/**
 * Cinematic page hero: dark, photo-backed, with breadcrumb + staggered title.
 * Pass `photo` for a full-bleed background image (Ken Burns), `aside` for a
 * right-hand visual.
 */
export function PageHero({
  eyebrow,
  title,
  gradientTitle,
  intro,
  crumbs,
  children,
  aside,
  className,
  photo,
}: {
  eyebrow: string;
  title: string;
  gradientTitle?: string;
  intro?: ReactNode;
  crumbs: { name: string; path: string }[];
  children?: ReactNode;
  aside?: ReactNode;
  className?: string;
  photo?: PhotoKey;
}) {
  const p = photo ? photos[photo] : undefined;
  return (
    <section className={cn("theme-dark section-theme relative isolate overflow-hidden pb-20 pt-36 sm:pb-28 sm:pt-44", className)}>
      {p ? (
        <div aria-hidden className="absolute inset-0 -z-20 overflow-hidden">
          <Image
            src={p.src}
            alt=""
            fill
            priority
            sizes="100vw"
            quality={70}
            placeholder={p.blurDataURL ? "blur" : "empty"}
            blurDataURL={p.blurDataURL}
            className="animate-ken-burns object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(100deg,rgb(8_20_39/0.95)_0%,rgb(8_20_39/0.8)_45%,rgb(8_20_39/0.45)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
        </div>
      ) : (
        <>
          <div aria-hidden className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_70%_0%,black_10%,transparent_65%)]" />
          <div aria-hidden className="absolute -right-32 -top-48 -z-10 h-[34rem] w-[34rem] rounded-full bg-electric/30 blur-[130px]" />
          <div aria-hidden className="absolute -left-40 top-20 -z-10 h-[24rem] w-[24rem] rounded-full bg-aqua/15 blur-[120px]" />
        </>
      )}
      <div className="container-x">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-white/60">
            {crumbs.map((c, i) => (
              <li key={c.path} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight aria-hidden className="size-3" />}
                {i < crumbs.length - 1 ? (
                  <Link href={c.path} className="hover:text-white">
                    {c.name}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-white/85">
                    {c.name}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <div className={cn("mt-10 grid gap-12", aside ? "lg:grid-cols-12 lg:items-center" : undefined)}>
          <div className={cn(aside ? "lg:col-span-7" : "max-w-4xl")}>
            <Reveal>
              <p className="eyebrow">{eyebrow}</p>
            </Reveal>
            <h1
              className={cn(
                "mt-5 font-semibold leading-[1.02] text-white",
                aside ? "text-[2.4rem] sm:text-5xl lg:text-[3.6rem]" : "text-[2.7rem] sm:text-6xl lg:text-[4.4rem]",
              )}
            >
              <RevealText text={title} />
              {gradientTitle && (
                <>
                  {" "}
                  <span className="text-gradient">
                    <RevealText text={gradientTitle} delay={0.12} />
                  </span>
                </>
              )}
            </h1>
            {intro && (
              <Reveal delay={0.25}>
                <div className="mt-7 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl">{intro}</div>
              </Reveal>
            )}
            {children && (
              <Reveal delay={0.35} className="mt-10">
                {children}
              </Reveal>
            )}
          </div>
          {aside && (
            <Reveal delay={0.2} className="lg:col-span-5">
              {aside}
            </Reveal>
          )}
        </div>
      </div>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </section>
  );
}
