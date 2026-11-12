import { Eye, ListChecks, ShieldCheck, Timer } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { OpportunityFinder } from "@/components/tools/OpportunityFinder";
import { ImpactSimulator } from "@/components/tools/ImpactSimulator";
import { CtaBand } from "@/components/content/CtaBand";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "AI Opportunity Finder — Discover Your AI Advantage",
  description:
    "Free AI readiness assessment: answer six questions to see preliminary AI, automation, marketing and analytics opportunities for your business, with first steps.",
  path: "/opportunity-finder",
});

const points = [
  { icon: Timer, title: "About two minutes", body: "Six focused questions — no contact details needed to see your results." },
  { icon: Eye, title: "Transparent logic", body: "Every recommendation shows why it was suggested. No black box." },
  { icon: ListChecks, title: "Practical next steps", body: "Best-fit services and first implementation steps you can act on." },
  { icon: ShieldCheck, title: "Honest by design", body: "Preliminary guidance only — never guaranteed savings or invented results." },
];

export default function OpportunityFinderPage() {
  return (
    <>
      <PageHero
        eyebrow="AI Opportunity Finder"
        title="Discover Your"
        gradientTitle="AI Advantage."
        intro="Find out where AI, automation, digital marketing and analytics could make the biggest difference to your business — in about two minutes."
        photo="team-review"
        crumbs={[
          { name: "Home", path: "/" },
          { name: "AI Opportunity Finder", path: "/opportunity-finder" },
        ]}
      />

      <Section theme="sky" labelledBy="finder-tool" className="pt-16 sm:pt-20">
        <h2 id="finder-tool" className="sr-only">
          Assessment
        </h2>
        <ul className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 0.06} className="flex gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-electric shadow-sm">
                <p.icon aria-hidden className="size-5" />
              </span>
              <span>
                <span className="block font-display font-semibold text-fg">{p.title}</span>
                <span className="mt-0.5 block text-sm text-body">{p.body}</span>
              </span>
            </Reveal>
          ))}
        </ul>
        <OpportunityFinder />
      </Section>

      <Section theme="bright" labelledBy="sim-title" className="overflow-hidden">
        <div aria-hidden className="bg-grid absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="relative">
          <SectionHeader id="sim-title" eyebrow="Business Impact Simulator" title="See What Smarter Operations Could Unlock." className="mb-12" />
          <ImpactSimulator />
        </div>
      </Section>

      <CtaBand title="Ready to turn opportunities into results?" photo="people-celebrate" />
    </>
  );
}
