import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { faq } from "@/content/faq";
import { serviceAeo } from "@/content/service-aeo";
import { services, servicePath } from "@/content/services";
import { site } from "@/content/site";
import { PageHero } from "@/components/ui/PageHero";
import { JsonLd, Section, SectionHeader } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/content/CtaBand";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Frequently Asked Questions",
  description: "Answers about LARA Solutions — what we do, who we work with, pricing, timelines, data security — plus questions on AI, marketing, supply chain and analytics.",
  path: "/faq",
});

/** Topic groups link to the answers on each service page (marked up there, once). */
const topics = [
  { title: "AI & automation", slugs: ["ai-automation", "strategy-consulting"] },
  { title: "Digital marketing", slugs: ["digital-marketing"] },
  { title: "Supply chain & logistics", slugs: ["supply-chain-intelligence"] },
  { title: "Business intelligence & analytics", slugs: ["data-analytics"] },
  { title: "Processes & transformation", slugs: ["process-optimization", "digital-transformation", "technology-integration", "web-app-development"] },
];

export default function FaqPage() {
  const companyFaqs = faq.map((f) => ({ question: f.question, answer: f.answer, links: f.links ?? [] }));

  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Frequently asked questions"
        intro="Straight answers about how LARA Solutions works — and practical answers to common questions about AI, marketing, supply chain and analytics."
        photo="people-planning"
        crumbs={[
          { name: "Home", path: "/" },
          { name: "FAQ", path: "/faq" },
        ]}
      >
        <ButtonLink href="/contact" arrow>
          Ask us a question
        </ButtonLink>
      </PageHero>

      <Section labelledBy="company-faq-title">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeader id="company-faq-title" eyebrow="About working with us" title="Questions about LARA Solutions" />
            <p className="mt-6 text-sm text-muted">
              Updated <time dateTime={site.contentUpdated}>{formatDate(site.contentUpdated)}</time>
            </p>
          </div>
          <div className="space-y-4 lg:col-span-8">
            {companyFaqs.map((f) => (
              <article key={f.question} className="card-surface rounded-2xl p-6 sm:p-7">
                <h3 className="text-lg font-semibold text-fg">{f.question}</h3>
                <p className="mt-3 leading-relaxed text-body">{f.answer}</p>
                {f.links.length > 0 && (
                  <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                    {f.links.map((l) => (
                      <Link key={l.href} href={l.href} className="inline-flex items-center gap-1 font-medium text-accent hover:underline">
                        {l.label} <ArrowRight aria-hidden className="size-3.5" />
                      </Link>
                    ))}
                  </p>
                )}
              </article>
            ))}
          </div>
        </div>
      </Section>

      <Section theme="sky" labelledBy="topic-faq-title">
        <SectionHeader
          id="topic-faq-title"
          eyebrow="Questions by topic"
          title="Explore answers by topic"
          description="Each question below is answered in full on the relevant solution page, alongside how the service works, who it suits and what to consider."
          className="mb-12"
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {topics.map((t) => (
            <div key={t.title} className="card-surface rounded-3xl p-7">
              <h3 className="text-xl font-semibold text-fg">{t.title}</h3>
              <ul className="mt-5 space-y-3 text-sm">
                {t.slugs.flatMap((slug) => {
                  const svc = services.find((s) => s.slug === slug);
                  const aeo = serviceAeo[slug];
                  if (!svc || !aeo) return [];
                  return [aeo.question, ...aeo.faqs.map((f) => f.question)].map((q, i) => (
                    <li key={q}>
                      <Link href={`${servicePath(slug)}${i === 0 ? "" : "#faq"}`} className="text-body hover:text-accent hover:underline">
                        {q}
                      </Link>
                    </li>
                  ));
                })}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <CtaBand title="Have a question we haven’t answered?" body="Tell us about your business and what you want to improve. We’ll reply with practical next steps." photo="people-celebrate" />
      <JsonLd data={faqJsonLd(companyFaqs, "/faq")} />
    </>
  );
}
