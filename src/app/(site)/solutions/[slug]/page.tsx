import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, ArrowUpRight, AlertTriangle, Users } from "lucide-react";
import { getService, services, servicePath } from "@/content/services";
import { serviceAeo } from "@/content/service-aeo";
import { industries } from "@/content/industries";
import { approachSteps } from "@/content/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Section, SectionHeader, JsonLd } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { ServiceVisual } from "@/components/visuals/ServiceVisuals";
import { RevealImage } from "@/components/ui/RevealImage";
import { CtaBand } from "@/components/content/CtaBand";
import { InsightCard } from "@/components/content/Cards";
import { getInsights } from "@/lib/content";
import { absoluteUrl, faqJsonLd, orgRef, pageMetadata, WEBSITE_ID } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { site } from "@/content/site";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return pageMetadata({ title: s.seo.title, description: s.seo.description, path: servicePath(s.slug) });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  const aeo = serviceAeo[slug];
  if (!service || !aeo) notFound();

  const idx = services.findIndex((s) => s.slug === slug);
  const next = services[(idx + 1) % services.length]!;
  const relevantIndustries = industries.filter((i) => i.services.includes(slug));
  const allInsights = await getInsights();
  const guides = aeo.relatedInsights
    .map((s) => allInsights.find((a) => a.slug === s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a))
    .slice(0, 3)
    .map(({ html: _html, ...meta }) => meta);

  const path = servicePath(service.slug);
  const pageUrl = absoluteUrl(path);
  const contactHref = `/contact?service=${encodeURIComponent(service.name)}`;
  const name = aeo.topic;

  return (
    <>
      <PageHero
        eyebrow={service.name}
        title={service.headline}
        intro={service.impact}
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Solutions", path: "/solutions" },
          { name: service.shortName, path },
        ]}
        photo={service.photo}
        aside={service.tier === "core" ? <ServiceVisual kind={service.icon} /> : undefined}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={contactHref} arrow>
            Discuss this solution
          </ButtonLink>
          <ButtonLink href="#faq" variant="glass">
            Read the FAQs
          </ButtonLink>
        </div>
      </PageHero>

      {/* 1 — What is it? A direct, quotable answer first. */}
      <Section labelledBy="overview-title">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <div className="flex size-20 items-center justify-center rounded-3xl border border-line-strong bg-section-tint">
              <ServiceIcon name={service.icon} className="size-12" />
            </div>
            <p className="eyebrow mt-8">Overview</p>
            <h2 id="overview-title" className="mt-4 text-3xl font-semibold text-fg">
              {aeo.question}
            </h2>
            <p className="mt-6 text-xl leading-relaxed text-fg">{aeo.answer}</p>
            <p className="mt-5 text-lg leading-relaxed text-body">{service.intro}</p>
          </Reveal>
          <div className="lg:col-span-6">
            <RevealImage photo={service.photo} className="aspect-[4/3]" sizes="(min-width: 1024px) 45vw, 100vw" />
          </div>
        </div>
      </Section>

      {/* 2 — How does it work? */}
      <Section id="how-it-works" theme="sky" labelledBy="how-it-works-title">
        <SectionHeader id="how-it-works-title" eyebrow="How it works" title={`How does ${name} work?`} description="The typical steps in an engagement. Scope and order are adapted to your starting point." className="mb-12" />
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {aeo.howItWorks.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.06} className="card-surface rounded-2xl p-6">
              <span className="font-display text-sm font-semibold text-electric">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-2 text-lg font-semibold text-fg">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-body">{s.body}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* What is included */}
      <Section id="capabilities" labelledBy="capabilities-title">
        <SectionHeader id="capabilities-title" eyebrow="Capabilities" title="What does it include?" className="mb-12" />
        <ul className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {service.capabilities.map((c, i) => (
            <Reveal as="li" key={c} delay={(i % 3) * 0.05} className="flex items-start gap-4 bg-card p-6 transition-colors hover:bg-card-hover">
              <span className="font-display text-xs font-semibold text-electric">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-fg">{c}</span>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* 3 — What problems can it solve? */}
      <Section theme="sky" labelledBy="usecases-title">
        <SectionHeader
          id="usecases-title"
          eyebrow="Example use cases"
          title={
            <>
              What business problems <span className="text-gradient">can it solve?</span>
            </>
          }
          description="Representative examples of how this capability is applied. Every engagement is tailored to your context."
          className="mb-12"
        />
        <ul className="grid gap-5 md:grid-cols-2">
          {service.useCases.map((u, i) => (
            <Reveal as="li" key={u.title} delay={(i % 2) * 0.08} className="card-surface rounded-3xl p-7 sm:p-8">
              <span className="font-display text-sm font-semibold text-electric">0{i + 1}</span>
              <h3 className="mt-3 text-xl font-semibold text-fg">{u.title}</h3>
              <p className="mt-3 leading-relaxed text-body">{u.body}</p>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* 4 & 7 — Who is it for? What should you consider? */}
      <Section labelledBy="fit-title">
        <h2 id="fit-title" className="sr-only">
          Suitability and considerations
        </h2>
        <div className="grid gap-5 lg:grid-cols-2">
          <Reveal className="card-surface rounded-3xl p-7 sm:p-9">
            <Users aria-hidden className="size-6 text-electric" />
            <h3 className="mt-5 text-2xl font-semibold text-fg">Who is it most suitable for?</h3>
            <ul className="mt-6 space-y-3">
              {aeo.suitableFor.map((s) => (
                <li key={s} className="flex gap-3 leading-relaxed text-body">
                  <Check aria-hidden className="mt-1 size-4 shrink-0 text-fresh" />
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.08} className="card-surface rounded-3xl p-7 sm:p-9">
            <AlertTriangle aria-hidden className="size-6 text-sunrise" />
            <h3 className="mt-5 text-2xl font-semibold text-fg">What limitations and dependencies should you consider?</h3>
            <ul className="mt-6 space-y-3">
              {aeo.limitations.map((l) => (
                <li key={l} className="flex gap-3 leading-relaxed text-body">
                  <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-sunrise" />
                  {l}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* 6 — Potential benefits */}
      <Section labelledBy="benefits-title" theme="dark" className="overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgb(40_100_255/0.3),transparent_60%)]" />
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeader id="benefits-title" eyebrow="Expected benefits" title="What are the potential benefits?" description="Benefits depend on your starting point — we agree measurable goals and a baseline before we begin." />
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
            {service.benefits.map((b, i) => (
              <Reveal as="li" key={b.title} delay={i * 0.06} className="rounded-2xl border border-line bg-card p-6">
                <Check aria-hidden className="size-5 text-fresh" />
                <h3 className="mt-4 text-lg font-semibold text-fg">{b.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{b.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      {/* 5, 8 & 9 — How LARA helps and how to get started */}
      <Section labelledBy="how-title" theme="sky">
        <SectionHeader
          id="how-title"
          eyebrow="How we work"
          title="How can LARA Solutions help?"
          description="Every engagement follows the same accountable path — from understanding your business to scaling what works."
          className="mb-12"
        />
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {approachSteps.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 0.06} className="card-surface rounded-2xl p-5">
              <span className="font-display text-sm font-semibold text-electric">{s.n}</span>
              <h3 className="mt-2 font-semibold text-fg">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
            </Reveal>
          ))}
        </ol>
        <div className="mt-12 grid gap-6 rounded-3xl border border-line bg-white p-7 sm:p-9 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-8">
            <h3 className="text-2xl font-semibold text-fg">How do you get started?</h3>
            <p className="mt-3 leading-relaxed text-body">
              Tell us about your goals, your current tools and the process you want to improve. We’ll respond with practical first steps and, if it’s a
              fit, a clearly scoped first phase. Prefer to explore first? The free{" "}
              <Link href="/opportunity-finder" className="font-medium text-accent hover:underline">
                AI Opportunity Finder
              </Link>{" "}
              gives a preliminary view in a few minutes.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
            <ButtonLink href={contactHref} arrow>
              Request a consultation
            </ButtonLink>
          </div>
        </div>
        {relevantIndustries.length > 0 && (
          <div className="mt-14">
            <p className="text-sm text-muted">Frequently relevant for</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {relevantIndustries.map((ind) => (
                <li key={ind.slug}>
                  <Link href={`/industries/${ind.slug}`} className="inline-block rounded-full border border-line-strong bg-white px-3.5 py-1.5 text-sm text-body hover:border-accent hover:text-fg">
                    {ind.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Section>

      {/* FAQs — visible on the page and mirrored in FAQPage structured data */}
      <Section id="faq" labelledBy="faq-title">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeader id="faq-title" eyebrow="FAQs" title={`${service.shortName}: common questions`} />
            <p className="mt-6 text-sm text-muted">
              Written by the {site.name} team · Updated <time dateTime={site.contentUpdated}>{formatDate(site.contentUpdated)}</time>
            </p>
            <p className="mt-3 text-sm text-muted">
              More answers on the{" "}
              <Link href="/faq" className="text-accent hover:underline">
                FAQ page
              </Link>
              .
            </p>
          </div>
          <div className="space-y-4 lg:col-span-8">
            {aeo.faqs.map((f) => (
              <article key={f.question} className="card-surface rounded-2xl p-6 sm:p-7">
                <h3 className="text-lg font-semibold text-fg">{f.question}</h3>
                <p className="mt-3 leading-relaxed text-body">{f.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </Section>

      {/* Related guides — challenge → education → service → consultation */}
      {guides.length > 0 && (
        <Section theme="sky" labelledBy="guides-title">
          <SectionHeader id="guides-title" eyebrow="Related guides" title="Learn more before you decide" className="mb-12" />
          <ul className="grid gap-5 md:grid-cols-3">
            {guides.map((g, i) => (
              <Reveal as="li" key={g.slug} delay={i * 0.08}>
                <InsightCard article={g} />
              </Reveal>
            ))}
          </ul>
        </Section>
      )}

      <section aria-label="Next solution" className="border-t border-line">
        <Link href={servicePath(next.slug)} className="group container-x flex items-center justify-between gap-6 py-12">
          <div>
            <p className="text-sm text-muted">Next solution</p>
            <p className="mt-2 font-display text-2xl font-semibold text-fg transition-colors group-hover:text-accent sm:text-3xl">{next.name}</p>
          </div>
          <ArrowUpRight aria-hidden className="size-8 shrink-0 text-muted transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-fg" />
        </Link>
      </section>

      <CtaBand
        title={`Ready to explore ${name}?`}
        body="Tell us about your goals and current setup. We’ll suggest practical first steps — no obligation."
        primaryLabel="Discuss this solution"
        primaryHref={contactHref}
        photo={service.tier === "core" ? "city-dusk" : service.photo}
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Service",
              "@id": `${pageUrl}#service`,
              name: service.name,
              description: aeo.answer,
              serviceType: service.shortName,
              url: pageUrl,
              provider: orgRef(),
              ...(site.areaServed.length ? { areaServed: site.areaServed.map((n) => ({ "@type": "Place", name: n })) } : {}),
              audience: { "@type": "BusinessAudience", audienceType: aeo.suitableFor.join("; ") },
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: service.name,
                itemListElement: service.capabilities.map((c) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: c } })),
              },
            },
            {
              "@type": "WebPage",
              "@id": `${pageUrl}#webpage`,
              url: pageUrl,
              name: `${service.seo.title} | ${site.name}`,
              description: service.seo.description,
              inLanguage: "en",
              isPartOf: { "@id": WEBSITE_ID },
              about: { "@id": `${pageUrl}#service` },
              dateModified: site.contentUpdated,
            },
            (({ "@context": _c, ...faq }) => faq)(faqJsonLd(aeo.faqs, path)),
          ],
        }}
      />
    </>
  );
}
