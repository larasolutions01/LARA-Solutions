import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Info } from "lucide-react";
import { getCaseStudies, getCaseStudy } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { CaseStudyBadge, CaseStudyCard } from "@/components/content/Cards";
import { CtaBand } from "@/components/content/CtaBand";
import { pageMetadata } from "@/lib/seo";
import { photos, type PhotoKey } from "@/content/media";
import { getService, servicePath } from "@/content/services";
import { industries } from "@/content/industries";

export async function generateStaticParams() {
  return (await getCaseStudies()).map((s) => ({ slug: s.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = await getCaseStudy(slug);
  if (!s) return {};
  return pageMetadata({ title: s.title, description: s.summary, path: `/work/${s.slug}`, type: "article" });
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) notFound();
  const others = (await getCaseStudies()).filter((s) => s.slug !== slug).slice(0, 3);
  const relatedServices = study.services.map((s) => getService(s)).filter((s): s is NonNullable<typeof s> => Boolean(s));
  const industry = industries.find((i) => i.name === study.industry);

  const blocks: { label: string; content: React.ReactNode }[] = [
    { label: "Business challenge", content: <p>{study.challenge}</p> },
    { label: study.type === "illustrative" ? "Proposed solution" : "Implemented solution", content: <p>{study.solution}</p> },
    {
      label: "Implementation approach",
      content: (
        <ol className="space-y-3">
          {study.approach.map((a, i) => (
            <li key={a} className="flex gap-3">
              <span className="font-display text-muted">{String(i + 1).padStart(2, "0")}</span>
              <span>{a}</span>
            </li>
          ))}
        </ol>
      ),
    },
    {
      label: study.type === "illustrative" ? "Results" : "Verified results",
      content: <p>{study.results}</p>,
    },
    {
      label: "Lessons & insights",
      content: (
        <ul className="space-y-2">
          {study.insights.map((x) => (
            <li key={x} className="flex gap-3">
              <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gradient-to-br from-electric to-fresh" />
              {x}
            </li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <>
      <PageHero
        eyebrow={study.category}
        title={study.title}
        intro={study.summary}
        photo={study.cover && study.cover in photos ? (study.cover as PhotoKey) : "team-laptop"}
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Our Work", path: "/work" },
          { name: study.category, path: `/work/${study.slug}` },
        ]}
      >
        <div className="flex flex-wrap items-center gap-3">
          <CaseStudyBadge type={study.type} />
          <span className="text-sm text-muted">{study.industry}</span>
          {study.client && <span className="text-sm text-muted">· {study.client}</span>}
        </div>
      </PageHero>

      <Section labelledBy="cs-details">
        <h2 id="cs-details" className="sr-only">
          Case details
        </h2>
        {study.type === "illustrative" && (
          <p className="mb-10 flex gap-3 rounded-2xl border border-accent/30 bg-accent/10 p-4 text-sm text-body">
            <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-muted" />
            Illustrative solution scenario — an example of how LARA Solutions would approach this challenge. It is not a completed client project and
            makes no claim of verified results.
          </p>
        )}
        <div className="grid gap-12 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="sticky top-28 space-y-6 rounded-3xl border border-line bg-card p-6">
              <div>
                <p className="eyebrow">Industry</p>
                <p className="mt-2 text-fg">
                  {industry ? (
                    <Link href={`/industries/${industry.slug}`} className="hover:text-accent hover:underline">
                      {study.industry}
                    </Link>
                  ) : (
                    study.industry
                  )}
                </p>
              </div>
              {relatedServices.length > 0 && (
                <div>
                  <p className="eyebrow">Related services</p>
                  <ul className="mt-3 space-y-2 text-sm">
                    {relatedServices.map((svc) => (
                      <li key={svc.slug}>
                        <Link href={servicePath(svc.slug)} className="font-medium text-accent hover:underline">
                          {svc.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <p className="eyebrow">Technology used</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {study.technology.map((t) => (
                    <li key={t} className="rounded-full bg-card px-2.5 py-1 text-xs text-body">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
          <div className="space-y-10 lg:col-span-8">
            {blocks.map((b, i) => (
              <Reveal key={b.label} delay={i * 0.04} className="border-b border-line pb-10 last:border-0">
                <h3 className="eyebrow">{b.label}</h3>
                <div className="mt-4 text-lg leading-relaxed text-body">{b.content}</div>
              </Reveal>
            ))}
            <div className="prose-lara" dangerouslySetInnerHTML={{ __html: study.html }} />
            <Link href="/work" className="inline-flex items-center gap-2 text-sm text-muted hover:text-fg">
              <ArrowLeft aria-hidden className="size-4" /> All work
            </Link>
          </div>
        </div>
      </Section>

      {others.length > 0 && (
        <Section className="border-t border-line" labelledBy="more-title">
          <h2 id="more-title" className="mb-8 text-2xl font-semibold text-fg">
            More scenarios
          </h2>
          <ul className="grid gap-5 md:grid-cols-3">
            {others.map((s) => (
              <li key={s.slug}>
                <CaseStudyCard study={s} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <CtaBand title="Want to explore this for your business?" />
    </>
  );
}
