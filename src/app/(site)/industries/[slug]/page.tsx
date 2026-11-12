import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowUpRight, CheckCircle2, Sparkles } from "lucide-react";
import { getIndustry, industries } from "@/content/industries";
import { getService, servicePath } from "@/content/services";
import { PageHero } from "@/components/ui/PageHero";
import { Section, SectionHeader, JsonLd } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { RevealImage } from "@/components/ui/RevealImage";
import { Media } from "@/components/ui/Media";
import { ButtonLink, ExternalButtonLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/content/CtaBand";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { site } from "@/content/site";

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ind = getIndustry(slug);
  if (!ind) return {};
  return pageMetadata({ title: `${ind.name} — AI & Digital Solutions`, description: ind.summary, path: `/industries/${ind.slug}` });
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ind = getIndustry(slug);
  if (!ind) notFound();
  const others = industries.filter((i) => i.slug !== slug).slice(0, 4);
  const contactHref = `/contact?industry=${encodeURIComponent(ind.optionLabel)}`;

  return (
    <>
      <PageHero
        eyebrow={`Industry · ${ind.name}`}
        title={ind.tagline}
        intro={ind.summary}
        photo={ind.photo}
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Industries", path: "/industries" },
          { name: ind.name, path: `/industries/${ind.slug}` },
        ]}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={contactHref} arrow>
            Discuss your requirements
          </ButtonLink>
          {site.contact.bookingUrl ? (
            <ExternalButtonLink href={site.contact.bookingUrl} variant="glass">
              Book a discovery call
            </ExternalButtonLink>
          ) : (
            <ButtonLink href="/opportunity-finder" variant="glass">
              Try the AI Opportunity Finder
            </ButtonLink>
          )}
        </div>
      </PageHero>

      {/* Challenges */}
      <Section labelledBy="challenges-title">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeader id="challenges-title" eyebrow="Business problems" title="What we commonly see" description={`Challenges ${ind.name.toLowerCase()} businesses frequently face — and where intelligence can help.`} />
            <Reveal delay={0.2} className="mt-10 hidden lg:block">
              <RevealImage photo={ind.photo} className="aspect-[4/3]" rounded="rounded-3xl" sizes="40vw" />
            </Reveal>
          </div>
          <ul className="grid content-start gap-4 sm:grid-cols-2 lg:col-span-7">
            {ind.challenges.map((c, i) => (
              <Reveal as="li" key={c} delay={(i % 2) * 0.08} className="card-surface rounded-2xl p-6">
                <AlertTriangle aria-hidden className="size-5 text-sunrise" />
                <p className="mt-4 text-lg font-medium leading-snug text-fg">{c}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      {/* Solutions */}
      <Section theme="sky" labelledBy="solutions-title">
        <SectionHeader id="solutions-title" eyebrow="Solution approaches" title="How intelligence helps" className="mb-12" />
        <ul className="grid gap-4 md:grid-cols-2">
          {ind.solutions.map((s, i) => (
            <Reveal as="li" key={s} delay={(i % 2) * 0.08} className="card-surface flex items-start gap-4 rounded-2xl p-6">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-electric text-white">
                <Sparkles aria-hidden className="size-5" />
              </span>
              <p className="pt-1.5 text-lg leading-snug text-fg">{s}</p>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Approach */}
      <Section theme="dark" labelledBy="approach-title" className="overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgb(40_100_255/0.3),transparent_60%)]" />
        <div className="relative">
          <SectionHeader id="approach-title" eyebrow="Our approach" title={`A practical path for ${ind.name}`} className="mb-12" />
          <ol className="grid gap-5 md:grid-cols-3">
            {ind.approach.map((a, i) => (
              <Reveal as="li" key={a.title} delay={i * 0.1} className="rounded-3xl border border-white/10 bg-white/[0.04] p-7">
                <span className="font-display text-4xl font-semibold text-gradient">0{i + 1}</span>
                <h3 className="mt-4 text-xl font-semibold text-white">{a.title}</h3>
                <p className="mt-2 leading-relaxed text-white/75">{a.body}</p>
              </Reveal>
            ))}
          </ol>
          <Reveal delay={0.2} className="mt-12 flex flex-wrap gap-3">
            {ind.benefits.map((b) => (
              <span key={b} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm text-white">
                <CheckCircle2 aria-hidden className="size-4 text-fresh" /> {b}
              </span>
            ))}
          </Reveal>
        </div>
      </Section>

      {/* Suitable services */}
      <Section labelledBy="services-title">
        <SectionHeader id="services-title" eyebrow="Suitable services" title="Where to start" className="mb-12" />
        <ul className="grid gap-5 md:grid-cols-3">
          {ind.services.map((slugS, i) => {
            const s = getService(slugS);
            if (!s) return null;
            return (
              <Reveal as="li" key={slugS} delay={i * 0.08}>
                <Link href={servicePath(s.slug)} data-cursor="Explore" className="card-surface group flex h-full flex-col overflow-hidden rounded-3xl">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Media photo={s.photo} sizes="(min-width: 768px) 33vw, 100vw" className="absolute inset-0" imgClassName="transition-transform duration-[1.2s] group-hover:scale-105" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-accent">{s.shortName}</p>
                    <h3 className="mt-2 text-xl font-semibold leading-snug text-fg">{s.headline}</h3>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-fg">
                      Explore <ArrowUpRight aria-hidden className="size-4 text-accent" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </Section>

      {/* Other industries */}
      <Section theme="sky" labelledBy="others-title" className="py-16 sm:py-20">
        <h2 id="others-title" className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-muted">
          Explore other industries
        </h2>
        <ul className="mt-6 flex flex-wrap gap-2">
          {others.map((o) => (
            <li key={o.slug}>
              <Link href={`/industries/${o.slug}`} className="inline-block rounded-full border border-line-strong bg-white px-4 py-2 text-sm font-medium text-fg hover:border-electric">
                {o.name}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/industries" className="inline-block rounded-full px-4 py-2 text-sm font-semibold text-accent">
              All industries →
            </Link>
          </li>
        </ul>
      </Section>

      <CtaBand title={`Let’s talk about your ${ind.name.toLowerCase()} business.`} primaryLabel="Discuss your requirements" primaryHref={contactHref} photo={ind.photo} />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: `${ind.name} — ${site.name}`,
          description: ind.summary,
          url: absoluteUrl(`/industries/${ind.slug}`),
          about: ind.name,
        }}
      />
    </>
  );
}
