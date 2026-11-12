import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import type { CaseStudyMeta, InsightMeta } from "@/lib/content";
import { resolvePhoto } from "@/content/media";
import { formatDate, cn } from "@/lib/utils";
import { Media } from "@/components/ui/Media";

export function CaseStudyBadge({ type, className }: { type: CaseStudyMeta["type"]; className?: string }) {
  return type === "illustrative" ? (
    <span className={cn("inline-flex items-center rounded-full bg-lavender/15 px-2.5 py-1 text-[11px] font-semibold text-[#5a3fd1]", className)}>Illustrative scenario</span>
  ) : (
    <span className={cn("inline-flex items-center rounded-full bg-success/15 px-2.5 py-1 text-[11px] font-semibold text-success", className)}>Client project</span>
  );
}

export function CaseStudyCard({ study }: { study: CaseStudyMeta }) {
  return (
    <Link href={`/work/${study.slug}`} data-cursor="View" className="card-surface group flex h-full flex-col overflow-hidden rounded-3xl transition-transform duration-500 hover:-translate-y-1">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Media image={resolvePhoto(study.cover)} sizes="(min-width: 768px) 33vw, 100vw" className="absolute inset-0" imgClassName="transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-105" />
        <CaseStudyBadge type={study.type} className="absolute left-4 top-4 bg-white/95" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">{study.industry}</p>
        <h3 className="mt-2 text-xl font-semibold leading-snug text-fg">{study.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-body">{study.summary}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technology">
          {study.technology.slice(0, 3).map((t) => (
            <li key={t} className="rounded-full bg-section-tint px-2.5 py-1 text-[11px] text-body">
              {t}
            </li>
          ))}
        </ul>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-6 font-display text-sm font-semibold text-fg">
          Read the scenario <ArrowUpRight aria-hidden className="size-4 text-accent transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

export function InsightCard({ article, featured = false }: { article: InsightMeta; featured?: boolean }) {
  return (
    <article className={cn("card-surface group relative flex h-full overflow-hidden rounded-3xl transition-transform duration-500 hover:-translate-y-1", featured ? "flex-col lg:flex-row" : "flex-col")}>
      <div className={cn("relative overflow-hidden", featured ? "aspect-[16/10] lg:aspect-auto lg:w-3/5" : "aspect-[16/10]")}>
        <Media
          image={resolvePhoto(article.image)}
          sizes={featured ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
          className="absolute inset-0"
          imgClassName="transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-ink">{article.category}</span>
      </div>
      <div className={cn("flex flex-1 flex-col p-6 sm:p-7", featured && "lg:justify-center lg:p-10")}>
        <p className="flex items-center gap-1.5 text-xs text-muted">
          <Clock aria-hidden className="size-3" /> {article.readingTime} min read · <time dateTime={article.date}>{formatDate(article.date)}</time>
        </p>
        <h3 className={featured ? "mt-3 text-2xl font-semibold leading-snug text-fg sm:text-3xl" : "mt-3 text-lg font-semibold leading-snug text-fg"}>
          <Link href={`/insights/${article.slug}`} className="after:absolute after:inset-0">
            {article.title}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-body">{article.description}</p>
        <p className="mt-auto pt-6 text-xs font-medium text-muted">{article.author}</p>
      </div>
    </article>
  );
}
