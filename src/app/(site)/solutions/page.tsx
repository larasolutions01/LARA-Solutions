import { services, servicePath } from "@/content/services";
import { PageHero } from "@/components/ui/PageHero";
import { SolutionsGrid } from "@/components/home/SolutionsGrid";
import { CtaBand } from "@/components/content/CtaBand";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = pageMetadata({
  title: "AI & Digital Transformation Services",
  description:
    "LARA Solutions’ services: AI automation, digital marketing, supply chain intelligence, analytics, process optimisation and digital transformation.",
  path: "/solutions",
});

const combos = [
  { title: "Grow revenue", services: ["digital-marketing", "data-analytics", "ai-automation"], body: "Sharper targeting, faster lead response and clear attribution." },
  { title: "Run leaner operations", services: ["process-optimization", "ai-automation", "digital-transformation"], body: "Fewer hand-offs, less manual work, connected systems." },
  { title: "Plan with confidence", services: ["supply-chain-intelligence", "data-analytics"], body: "Forecasts, visibility and early warnings that guide decisions." },
];

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Solutions"
        title="Your Business Challenges."
        gradientTitle="Our Intelligent Solutions."
        intro="Six connected capabilities — combined around your goals. We identify the bottleneck, design a practical strategy, implement the right systems and keep optimising performance."
        photo="team-review"
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Solutions", path: "/solutions" },
        ]}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/contact" arrow>
            Request a Consultation
          </ButtonLink>
          <ButtonLink href="/opportunity-finder" variant="glass">
            Find your best starting point
          </ButtonLink>
        </div>
      </PageHero>

      <SolutionsGrid showHeader={false} />

      <Section labelledBy="combos-title" theme="sky">
        <SectionHeader
          id="combos-title"
          eyebrow="Better together"
          title={
            <>
              Solutions designed around <span className="text-gradient">outcomes</span>
            </>
          }
          description="Most meaningful improvements span more than one discipline. These are common ways our services combine."
          className="mb-12"
        />
        <ul className="grid gap-5 md:grid-cols-3">
          {combos.map((c, i) => (
            <Reveal as="li" key={c.title} delay={i * 0.08} className="card-surface rounded-3xl p-7">
              <h3 className="text-xl font-semibold text-fg">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{c.body}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {c.services.map((slug) => {
                  const s = services.find((x) => x.slug === slug);
                  return s ? (
                    <li key={slug}>
                      <Link href={servicePath(slug)} className="inline-block rounded-full border border-line-strong bg-white px-3 py-1 text-xs text-body hover:border-accent hover:text-fg">
                        {s.shortName}
                      </Link>
                    </li>
                  ) : null;
                })}
              </ul>
            </Reveal>
          ))}
        </ul>
      </Section>

      <CtaBand />
    </>
  );
}
