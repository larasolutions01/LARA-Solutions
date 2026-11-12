import { Compass, Layers, Target } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { IndustryCards } from "@/components/industries/IndustryCards";
import { CtaBand } from "@/components/content/CtaBand";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Industries We Empower",
  description:
    "AI, automation, marketing, supply chain and analytics solutions tailored to retail, logistics, manufacturing, healthcare, finance, real estate, SaaS and SMEs.",
  path: "/industries",
});

const tailoring = [
  { icon: Compass, title: "Context first", body: "We learn your market, customers, regulations and systems before recommending anything." },
  { icon: Layers, title: "Proven patterns, adapted", body: "Cross-industry experience gives us patterns that work — we adapt them to your reality." },
  { icon: Target, title: "Your success measures", body: "Every engagement is anchored to the outcomes that matter in your sector." },
];

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries We Empower"
        title="Different Industries. Unique Challenges."
        gradientTitle="Intelligent Solutions."
        intro="Every sector has its own pressures, systems and opportunities. We bring cross-industry experience and tailor every solution to your context — never one-size-fits-all."
        photo="ind-logistics"
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Industries", path: "/industries" },
        ]}
      >
        <ButtonLink href="/contact" arrow>
          Discuss your industry
        </ButtonLink>
      </PageHero>

      <Section labelledBy="explore-title">
        <SectionHeader
          id="explore-title"
          eyebrow="Explore by sector"
          title={
            <>
              Find your industry. <span className="text-gradient">See what’s possible.</span>
            </>
          }
          description="Hover or focus a card to see common challenges, then open it for tailored solutions, approaches and consultation options."
          className="mb-12"
        />
        <IndustryCards />
      </Section>

      <Section theme="sky" labelledBy="tailor-title">
        <SectionHeader id="tailor-title" eyebrow="How we tailor" title="Tailored, not templated" align="center" className="mb-12" />
        <ul className="grid gap-5 md:grid-cols-3">
          {tailoring.map((t, i) => (
            <Reveal as="li" key={t.title} delay={i * 0.08} className="card-surface rounded-3xl p-7">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-electric/10 text-electric">
                <t.icon aria-hidden className="size-5" />
              </span>
              <h3 className="mt-5 text-xl font-semibold text-fg">{t.title}</h3>
              <p className="mt-2 leading-relaxed text-body">{t.body}</p>
            </Reveal>
          ))}
        </ul>
      </Section>

      <CtaBand title="Don’t see your industry?" body="Our approach works wherever there are processes to improve, customers to win and decisions to make. Tell us about your business." photo="city-towers" />
    </>
  );
}
