import { Info } from "lucide-react";
import { getCaseStudies } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { CaseStudyCard } from "@/components/content/Cards";
import { CtaBand } from "@/components/content/CtaBand";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Our Work — Case Studies & Solution Scenarios",
  description:
    "How LARA Solutions approaches AI support, marketing intelligence, demand forecasting, reporting and lead qualification — illustrative scenarios, clearly labelled.",
  path: "/work",
});

export default async function WorkPage() {
  const studies = await getCaseStudies();
  const clientProjects = studies.filter((s) => s.type === "client");
  const scenarios = studies.filter((s) => s.type === "illustrative");

  return (
    <>
      <PageHero
        eyebrow="Our Work"
        title="Intelligent solutions,"
        gradientTitle="applied to real problems."
        intro="Explore how we approach common business challenges — from the problem and the solution to the technology, implementation and lessons learned."
        photo="team-laptop"
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Our Work", path: "/work" },
        ]}
      >
        <p className="glass flex max-w-2xl gap-3 rounded-2xl p-4 text-sm leading-relaxed text-white/85">
          <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-muted" />
          <span>
            <strong className="text-fg">Our transparency commitment:</strong> illustrative solution scenarios are clearly labelled and are not completed
            client projects. Client case studies are published only after validation and the client’s approval — we never invent customers or results.
          </span>
        </p>
      </PageHero>

      {clientProjects.length > 0 && (
        <Section labelledBy="client-title">
          <h2 id="client-title" className="mb-8 text-2xl font-semibold text-fg">
            Client projects
          </h2>
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {clientProjects.map((s, i) => (
              <Reveal as="li" key={s.slug} delay={(i % 3) * 0.06}>
                <CaseStudyCard study={s} />
              </Reveal>
            ))}
          </ul>
        </Section>
      )}

      <Section labelledBy="scenario-title" theme={clientProjects.length ? "sky" : "light"}>
        <div className="mb-8 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <h2 id="scenario-title" className="text-2xl font-semibold text-fg">
            Illustrative solution scenarios
          </h2>
          <p className="text-sm text-muted">Examples of how we would approach these challenges.</p>
        </div>
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {scenarios.map((s, i) => (
            <Reveal as="li" key={s.slug} delay={(i % 3) * 0.06}>
              <CaseStudyCard study={s} />
            </Reveal>
          ))}
        </ul>
      </Section>

      <CtaBand title="Have a similar challenge?" body="Let’s talk about your situation and what a practical first step could look like." />
    </>
  );
}
