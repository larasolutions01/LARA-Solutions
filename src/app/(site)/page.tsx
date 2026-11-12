import type { Metadata } from "next";
import { CinematicHero } from "@/components/home/CinematicHero";
import { PeopleMontage } from "@/components/home/PeopleMontage";
import { ProcessJourney } from "@/components/home/ProcessJourney";
import { WorkShowcase } from "@/components/home/WorkShowcase";
import { EcosystemVisual } from "@/components/hero/EcosystemVisual";
import { ServicesShowcase } from "@/components/showcase/ServicesShowcase";
import { IndustryCards } from "@/components/industries/IndustryCards";
import { OpportunityFinder } from "@/components/tools/OpportunityFinder";
import { ImpactSimulator } from "@/components/tools/ImpactSimulator";
import { InsightCard } from "@/components/content/Cards";
import { CtaBand } from "@/components/content/CtaBand";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal, RevealText } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { getCaseStudies, getInsights } from "@/lib/content";
import { site } from "@/content/site";
import { coreServices, servicePath } from "@/content/services";
import { JsonLd } from "@/components/ui/Section";
import { entityGraphJsonLd } from "@/lib/seo";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: `${site.name} — AI Solutions, Automation & Business Growth Partner` },
  description: site.metaDescription,
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [studies, insights] = await Promise.all([getCaseStudies(), getInsights()]);
  const workItems = studies.map(({ html: _h, ...s }) => ({
    slug: s.slug,
    title: s.title,
    summary: s.summary,
    industry: s.industry,
    category: s.category,
    type: s.type,
    technology: s.technology,
    cover: s.cover,
  }));

  return (
    <>
      <CinematicHero />

      {/* 01 — The intelligent business universe */}
      <section id="ecosystem" aria-labelledby="ecosystem-title" className="theme-dark section-theme relative overflow-hidden pb-24 pt-10 sm:pb-32">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_65%_45%,rgb(40_100_255/0.28),transparent_60%)]" />
        <div aria-hidden className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_60%_50%,black,transparent_70%)]" />
        <div className="container-x relative">
          <div className="max-w-3xl">
            <Reveal>
              <p className="eyebrow flex items-center gap-3">
                <span className="text-muted">01</span>
                <span aria-hidden className="h-px w-8 bg-gradient-to-r from-electric to-aqua" />
                The LARA Ecosystem
              </p>
            </Reveal>
            <h2 id="ecosystem-title" className="mt-5 text-4xl font-semibold leading-[1.02] text-fg sm:text-5xl lg:text-[3.6rem]">
              <RevealText text="One Intelligent Ecosystem." />{" "}
              <span className="text-gradient">
                <RevealText text="Endless Possibilities." delay={0.15} />
              </span>
            </h2>
            <Reveal delay={0.2}>
              <p className="mt-6 text-lg leading-relaxed text-body sm:text-xl">
                At the centre is intelligence — connecting automation, marketing, supply chain, analytics, operations and technology so every part of your
                business learns from the others.
              </p>
            </Reveal>
          </div>
          <div className="mt-14">
            <EcosystemVisual />
          </div>
        </div>
      </section>

      {/* 02 — Services showcase (six distinct identities) */}
      <ServicesShowcase />

      {/* Human connection */}
      <PeopleMontage />

      {/* 03 — AI Opportunity Finder */}
      <Section id="opportunity-finder" theme="sky" labelledBy="finder-title" className="overflow-hidden">
        <div aria-hidden className="absolute -right-40 -top-20 size-[30rem] rounded-full bg-electric/15 blur-[120px]" />
        <div className="relative mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeader
            id="finder-title"
            index="03"
            eyebrow="Interactive assessment"
            title={
              <>
                Discover Your <span className="text-gradient">AI Advantage.</span>
              </>
            }
            description="Six quick questions. Transparent, explainable recommendations covering automation, marketing, analytics and operations — plus practical first steps."
          />
          <Reveal delay={0.2} className="shrink-0">
            <ButtonLink href="/opportunity-finder" variant="secondary" arrow>
              Open full-page finder
            </ButtonLink>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="relative">
          <OpportunityFinder />
        </Reveal>
      </Section>

      {/* 04 — Business Impact Simulator */}
      <Section id="impact" theme="bright" labelledBy="impact-title" className="overflow-hidden">
        <div aria-hidden className="bg-grid absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div aria-hidden className="absolute -left-24 bottom-0 size-[28rem] rounded-full bg-sunrise/30 blur-[120px]" />
        <div className="relative mb-12 max-w-3xl">
          <SectionHeader
            id="impact-title"
            index="04"
            eyebrow="Business Impact Simulator"
            title="See What Smarter Operations Could Unlock."
            description="Model the time your team spends on repetitive work and explore conservative, expected and ambitious automation scenarios — instantly."
          />
        </div>
        <Reveal delay={0.1} className="relative">
          <ImpactSimulator />
        </Reveal>
      </Section>

      {/* 05 — Process journey (pinned) */}
      <ProcessJourney />

      {/* 06 — Industries */}
      <Section id="industries" labelledBy="industries-title">
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeader
            id="industries-title"
            index="06"
            eyebrow="Industries"
            title={
              <>
                Different Industries. Unique Challenges. <span className="text-gradient">Intelligent Solutions.</span>
              </>
            }
            description="Every sector has its own pressures and possibilities. Hover to see common challenges — select an industry to explore tailored solutions."
          />
          <Reveal delay={0.2} className="shrink-0">
            <ButtonLink href="/industries" variant="secondary" arrow>
              All industries
            </ButtonLink>
          </Reveal>
        </div>
        <IndustryCards />
      </Section>

      {/* 07 — Work showcase (horizontal) */}
      {workItems.length > 0 && <WorkShowcase items={workItems} />}

      {/* 08 — Insights */}
      {insights.length > 0 && (
        <Section id="insights" labelledBy="insights-title">
          <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeader
              id="insights-title"
              index="08"
              eyebrow="Insights"
              title={
                <>
                  Ideas for <span className="text-gradient">intelligent growth</span>
                </>
              }
              description="Practical thinking on AI, automation, marketing and operations — written for business leaders, not engineers."
            />
            <Reveal delay={0.2} className="shrink-0">
              <ButtonLink href="/insights" variant="secondary" arrow>
                All insights
              </ButtonLink>
            </Reveal>
          </div>
          <ul className="grid gap-5 md:grid-cols-3">
            {insights.slice(0, 3).map((a, i) => {
              const { html: _html, ...meta } = a;
              return (
                <Reveal as="li" key={a.slug} delay={i * 0.08}>
                  <InsightCard article={meta} />
                </Reveal>
              );
            })}
          </ul>
        </Section>
      )}

      {/* Entity summary — a plain, quotable answer to "What is LARA Solutions?" */}
      <section aria-labelledby="what-is-lara" className="theme-light section-theme border-t border-line py-16 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">About the company</p>
            <h2 id="what-is-lara" className="mt-4 text-3xl font-semibold text-fg sm:text-4xl">
              What is LARA Solutions?
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-lg leading-relaxed text-body">{site.description}</p>
            <p className="mt-4 leading-relaxed text-body">
              We work with startups, small and medium-sized businesses and larger organisations — starting from the business problem, then designing,
              building and improving the right mix of strategy, technology and AI. Our core services are{" "}
              {coreServices.map((s, i) => (
                <span key={s.slug}>
                  <Link href={servicePath(s.slug)} className="font-medium text-accent hover:underline">
                    {s.shortName.toLowerCase()}
                  </Link>
                  {i < coreServices.length - 2 ? ", " : i === coreServices.length - 2 ? " and " : "."}
                </span>
              ))}
            </p>
            <p className="mt-4 text-sm text-muted">
              More detail: <Link href="/about" className="text-accent hover:underline">about LARA Solutions</Link> ·{" "}
              <Link href="/faq" className="text-accent hover:underline">frequently asked questions</Link> ·{" "}
              <Link href="/contact" className="text-accent hover:underline">contact</Link>
            </p>
          </div>
        </div>
      </section>

      <CtaBand />
      <JsonLd data={entityGraphJsonLd()} />
    </>
  );
}
