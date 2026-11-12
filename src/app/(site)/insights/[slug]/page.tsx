import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Clock, ExternalLink } from "lucide-react";
import { categoryServices, getInsight, getInsights, relatedInsights } from "@/lib/content";
import { getService, servicePath } from "@/content/services";
import { resolvePhoto } from "@/content/media";
import { InsightCard } from "@/components/content/Cards";
import { ShareButtons } from "@/components/content/ShareButtons";
import { NewsletterBlock } from "@/components/content/NewsletterBlock";
import { ReadingProgress } from "@/components/content/ReadingProgress";
import { JsonLd } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { absoluteUrl, breadcrumbJsonLd, ORG_ID, orgRef, pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { site } from "@/content/site";

export async function generateStaticParams() {
  return (await getInsights()).map((a) => ({ slug: a.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = await getInsight(slug);
  if (!a) return {};
  const img = resolvePhoto(a.image);
  return {
    ...pageMetadata({
      title: a.seoTitle ?? a.title,
      description: a.description,
      path: `/insights/${a.slug}`,
      type: "article",
      publishedTime: a.date,
      modifiedTime: a.updated ?? a.date,
      image: { url: img.src, width: img.width, height: img.height, alt: img.alt },
    }),
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getInsight(slug);
  if (!article) notFound();
  const all = await getInsights();
  const related = relatedInsights(all, article);
  const url = absoluteUrl(`/insights/${article.slug}`);
  const cover = resolvePhoto(article.image);
  const relatedServices = (article.services.length ? article.services : categoryServices[article.category])
    .map((s) => getService(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const updated = article.updated && article.updated !== article.date ? article.updated : undefined;

  return (
    <>
      <ReadingProgress />
      <article>
        <header className="theme-dark section-theme relative isolate overflow-hidden pb-16 pt-36 sm:pb-24 sm:pt-44">
          <div aria-hidden className="absolute inset-0 -z-10">
            <Image src={cover.src} alt="" fill priority sizes="100vw" quality={70} placeholder={cover.blurDataURL ? "blur" : "empty"} blurDataURL={cover.blurDataURL} className="object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(8_20_39/0.75),rgb(8_20_39/0.92))]" />
          </div>
          <div className="container-x max-w-4xl">
            <nav aria-label="Breadcrumb" className="text-xs text-white/70">
              <Link href="/insights" className="inline-flex items-center gap-1.5 hover:text-white">
                <ArrowLeft aria-hidden className="size-3.5" /> All insights
              </Link>
            </nav>
            <p className="eyebrow mt-8">{article.category}</p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.06] text-white sm:text-5xl lg:text-[3.5rem]">{article.title}</h1>
            <p className="mt-6 text-xl leading-relaxed text-white/85">{article.description}</p>
            <div className="mt-8 flex flex-col gap-5 border-t border-white/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm">
                <p className="font-medium text-white">{article.author}</p>
                <p className="mt-0.5 flex items-center gap-2 text-white/70">
                  <span>
                    Published <time dateTime={article.date}>{formatDate(article.date)}</time>
                  </span>
                  {updated && (
                    <>
                      <span aria-hidden>·</span>
                      <span>
                        Updated <time dateTime={updated}>{formatDate(updated)}</time>
                      </span>
                    </>
                  )}
                  <span aria-hidden>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock aria-hidden className="size-3.5" /> {article.readingTime} min read
                  </span>
                </p>
              </div>
              <ShareButtons url={url} title={article.title} />
            </div>
          </div>
        </header>

        <div className="theme-light section-theme py-14 sm:py-20">
          <div className="container-x max-w-3xl">
            {article.keyTakeaways.length > 0 && (
              <aside aria-labelledby="takeaways-title" className="mb-12 rounded-3xl border border-line bg-section-tint p-7">
                <h2 id="takeaways-title" className="font-display text-lg font-semibold text-fg">
                  Key takeaways
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {article.keyTakeaways.map((t) => (
                    <li key={t} className="flex gap-3 leading-relaxed text-body">
                      <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-electric" />
                      {t}
                    </li>
                  ))}
                </ul>
              </aside>
            )}

            <div className="prose-lara" dangerouslySetInnerHTML={{ __html: article.html }} />

            {article.sources.length > 0 && (
              <section aria-labelledby="sources-title" className="mt-12 border-t border-line pt-8">
                <h2 id="sources-title" className="font-display text-lg font-semibold text-fg">
                  Sources and further reading
                </h2>
                <ul className="mt-4 space-y-2 text-sm">
                  {article.sources.map((src) => (
                    <li key={src.url}>
                      <a href={src.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-accent hover:underline">
                        {src.title}
                        <ExternalLink aria-hidden className="size-3.5" />
                      </a>
                      {src.publisher && <span className="text-muted"> — {src.publisher}</span>}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <p className="mt-10 text-sm text-muted">
              Written by the {article.author}{article.authorRole ? `, ${article.authorRole}` : ""} at {site.name}. Our articles are original, avoid unsupported statistics
              and cite the sources we rely on. <Link href="/about" className="text-accent hover:underline">About LARA Solutions</Link>.
            </p>

            {article.tags.length > 0 && (
              <ul className="mt-12 flex flex-wrap gap-2" aria-label="Tags">
                {article.tags.map((t) => (
                  <li key={t} className="rounded-full bg-section-tint px-3 py-1 text-xs text-body">
                    #{t}
                  </li>
                ))}
              </ul>
            )}

            <aside className="card-surface mt-12 rounded-3xl p-7">
              <p className="font-display text-lg font-semibold text-fg">Want to apply this in your business?</p>
              <p className="mt-2 text-sm text-body">Talk to us about your goals — we’ll help you identify practical, measurable next steps.</p>
              {relatedServices.length > 0 && (
                <ul className="mt-5 space-y-2 text-sm" aria-label="Related services">
                  {relatedServices.map((svc) => (
                    <li key={svc.slug}>
                      <Link href={servicePath(svc.slug)} className="inline-flex items-center gap-1.5 font-medium text-accent hover:underline">
                        {svc.name} <ArrowUpRight aria-hidden className="size-3.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-5 flex flex-wrap gap-3">
                <ButtonLink href="/contact" size="sm" arrow>
                  Request a Consultation
                </ButtonLink>
                <ButtonLink href="/opportunity-finder" size="sm" variant="secondary">
                  Try the Opportunity Finder
                </ButtonLink>
              </div>
            </aside>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="theme-sky section-theme py-20">
          <div className="container-x">
            <h2 id="related-title" className="text-2xl font-semibold text-fg">
              Related insights
            </h2>
            <ul className="mt-8 grid gap-5 md:grid-cols-3">
              {related.map((a) => (
                <li key={a.slug}>
                  <InsightCard article={a} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <NewsletterBlock />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.description,
          image: absoluteUrl(cover.src),
          datePublished: article.date,
          dateModified: article.updated ?? article.date,
          author:
            article.author === site.name || article.author.startsWith(site.name)
              ? { "@type": "Organization", name: article.author, url: absoluteUrl("/about"), parentOrganization: { "@id": ORG_ID } }
              : { "@type": "Person", name: article.author, ...(article.authorRole ? { jobTitle: article.authorRole } : {}), worksFor: { "@id": ORG_ID } },
          publisher: { ...orgRef(), logo: { "@type": "ImageObject", url: absoluteUrl("/brand/lara-icon-512.png") } },
          mainEntityOfPage: url,
          inLanguage: "en",
          ...(article.sources.length ? { citation: article.sources.map((s) => ({ "@type": "CreativeWork", name: s.title, url: s.url })) } : {}),
          about: relatedServices.map((s) => ({ "@type": "Thing", name: s.name })),
          articleSection: article.category,
          keywords: article.tags.join(", "),
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Insights", path: "/insights" },
          { name: article.title, path: `/insights/${article.slug}` },
        ])}
      />
    </>
  );
}
