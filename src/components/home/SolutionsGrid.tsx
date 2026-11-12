import { services } from "@/content/services";
import { Section, SectionHeader } from "@/components/ui/Section";
import { ServiceCard } from "@/components/services/ServiceCard";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";

export function SolutionsGrid({ showHeader = true }: { showHeader?: boolean }) {
  return (
    <Section id="solutions" labelledBy={showHeader ? "solutions-title" : "solutions-list-title"}>
      {!showHeader && (
        <h2 id="solutions-list-title" className="sr-only">
          All solutions
        </h2>
      )}
      {showHeader && (
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeader
            id="solutions-title"
            index="01"
            eyebrow="Our Solutions"
            title={
              <>
                Six capabilities. <span className="text-gradient">One connected strategy.</span>
              </>
            }
            description="Each service stands on its own — and works better together. We combine them around your goals, not our catalogue."
          />
          <Reveal delay={0.2} className="shrink-0">
            <ButtonLink href="/solutions" variant="secondary" arrow>
              All solutions
            </ButtonLink>
          </Reveal>
        </div>
      )}
      <ul className={showHeader ? "mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" : "grid gap-5 sm:grid-cols-2 lg:grid-cols-3"}>
        {services.map((s, i) => (
          <Reveal as="li" key={s.slug} delay={(i % 3) * 0.08}>
            <ServiceCard service={s} index={i} />
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
