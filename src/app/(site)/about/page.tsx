import Image from "next/image";
import { Eye, Target, UserRound } from "lucide-react";
import { aiPrinciples, approach, differentiators, founder, milestones, mission, showCompanyFacts, story, team, values, vision } from "@/content/about";
import { PageHero } from "@/components/ui/PageHero";
import { JsonLd, Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { RevealImage } from "@/components/ui/RevealImage";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/content/CtaBand";
import { LinkedInIcon } from "@/components/ui/SocialIcons";
import { entityGraphJsonLd, pageMetadata, webPageJsonLd } from "@/lib/seo";
import { site } from "@/content/site";
import { services } from "@/content/services";

export const metadata = pageMetadata({
  title: "About LARA Solutions",
  description:
    "LARA Solutions combines AI, business strategy and digital expertise to help organisations grow, run efficiently and modernise operations.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About LARA Solutions"
        title="Driven by Curiosity."
        gradientTitle="Powered by Intelligence."
        intro="We believe intelligent technology should make business simpler, faster and more impactful. We combine artificial intelligence with digital expertise and practical business thinking to help organisations overcome challenges, uncover opportunities and build for the future."
        photo="team-present"
        crumbs={[
          { name: "Home", path: "/" },
          { name: "About Us", path: "/about" },
        ]}
      >
        <ButtonLink href="/contact" arrow>
          Let&apos;s Talk Growth
        </ButtonLink>
      </PageHero>

      {/* Story */}
      <Section labelledBy="story-title">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeader id="story-title" eyebrow="Our Story" title="From complexity to intelligent simplicity" />
            <Reveal delay={0.1} className="mt-8 space-y-5 text-lg leading-relaxed text-body">
              {story.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </Reveal>
          </div>
          <div className="grid grid-cols-5 gap-4 lg:col-span-6">
            <RevealImage photo="people-team" className="col-span-3 aspect-[4/5]" sizes="(min-width: 1024px) 30vw, 60vw" />
            <div className="col-span-2 flex flex-col gap-4 pt-10">
              <RevealImage photo="people-planning" className="aspect-square" sizes="20vw" parallax={30} />
              <RevealImage photo="people-entrepreneur" className="aspect-[4/5]" sizes="20vw" parallax={40} />
            </div>
          </div>
        </div>
      </Section>

      {/* Mission & vision */}
      <Section theme="bright" labelledBy="mv-title" className="overflow-hidden">
        <div aria-hidden className="bg-grid absolute inset-0 opacity-50" />
        <h2 id="mv-title" className="sr-only">
          Mission and vision
        </h2>
        <div className="relative grid gap-5 md:grid-cols-2">
          <Reveal className="rounded-3xl border border-white/25 bg-white/10 p-8 backdrop-blur sm:p-10">
            <Target aria-hidden className="size-7 text-white" />
            <p className="eyebrow mt-6">Our Mission</p>
            <p className="mt-4 font-display text-2xl leading-snug text-white sm:text-[1.75rem]">{mission}</p>
          </Reveal>
          <Reveal delay={0.1} className="rounded-3xl border border-white/25 bg-white/10 p-8 backdrop-blur sm:p-10">
            <Eye aria-hidden className="size-7 text-white" />
            <p className="eyebrow mt-6">Our Vision</p>
            <p className="mt-4 font-display text-2xl leading-snug text-white sm:text-[1.75rem]">{vision}</p>
          </Reveal>
        </div>
      </Section>

      {/* Values */}
      <Section labelledBy="values-title">
        <SectionHeader id="values-title" eyebrow="Our Values" title="What guides every engagement" className="mb-12" />
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {values.map((v, i) => (
            <Reveal as="li" key={v.title} delay={i * 0.06} className="card-surface rounded-2xl p-6">
              <span aria-hidden className="block h-1 w-10 rounded-full bg-gradient-to-r from-electric via-aqua to-fresh" />
              <h3 className="mt-5 font-semibold text-fg">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-body">{v.body}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* Approach */}
      <Section theme="dark" labelledBy="approach-title" className="overflow-hidden">
        <RevealImage photo="process-chalkboard" className="absolute inset-0 opacity-30" rounded="rounded-none" sizes="100vw" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/60" />
        <div className="relative grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeader id="approach-title" eyebrow="Our Approach" title="Business-first. People-centred. Measurable." description="Plenty of firms can build technology. We connect strategy, operations and AI implementation into one practical plan." />
          </div>
          <ol className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {approach.map((a, i) => (
              <Reveal as="li" key={a.title} delay={i * 0.08} className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur">
                <span className="font-display text-3xl font-semibold text-gradient">0{i + 1}</span>
                <h3 className="mt-3 text-lg font-semibold text-white">{a.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/75">{a.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      {/* Differentiators & AI principles */}
      <Section theme="sky" labelledBy="diff-title">
        <SectionHeader
          id="diff-title"
          eyebrow="What makes us different"
          title={
            <>
              A strategic partner, <span className="text-gradient">not just a provider</span>
            </>
          }
          className="mb-12"
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {differentiators.map((d, i) => (
            <Reveal as="li" key={d.title} delay={(i % 3) * 0.06} className="card-surface rounded-2xl p-6">
              <span className="font-display text-xs font-semibold text-electric">0{i + 1}</span>
              <h3 className="mt-3 text-lg font-semibold text-fg">{d.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-body">{d.body}</p>
            </Reveal>
          ))}
        </ul>
        <div className="mt-16 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h3 className="text-2xl font-semibold text-fg">Our approach to AI</h3>
            <p className="mt-3 text-body">Responsible, practical and accountable — principles behind every system we design.</p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
            {aiPrinciples.map((p) => (
              <li key={p.title} className="rounded-2xl border border-line bg-white/70 p-5">
                <p className="font-semibold text-fg">{p.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-body">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Timeline — only with verified milestones */}
      {milestones.length > 0 && (
        <Section labelledBy="timeline-title">
          <SectionHeader id="timeline-title" eyebrow="Our journey" title="Milestones" className="mb-12" />
          <ol className="relative space-y-8 border-l border-line-strong pl-8">
            {milestones.map((m) => (
              <Reveal as="li" key={m.year + m.title} className="relative">
                <span aria-hidden className="absolute -left-[41px] top-1 size-4 rounded-full border-4 border-white bg-electric shadow" />
                <p className="font-display text-sm font-semibold text-electric">{m.year}</p>
                <h3 className="mt-1 text-xl font-semibold text-fg">{m.title}</h3>
                <p className="mt-1 text-body">{m.body}</p>
              </Reveal>
            ))}
          </ol>
        </Section>
      )}

      {/* Company information — hidden by default (see showCompanyFacts in src/content/about.ts) */}
      {showCompanyFacts && (
        <Section theme="sky" labelledBy="company-information-title" id="company-information">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHeader id="company-information-title" eyebrow="Company information" title="LARA Solutions at a glance" />
            </div>
            <dl className="card-surface grid gap-px overflow-hidden rounded-3xl lg:col-span-8">
              {[
                ["Official name", site.name],
                ...(founder ? [["Founder", `${founder.name}, ${founder.role}`]] : []),
                ["What we do", site.description],
                ["Website", site.url.replace(/^https?:\/\//, "")],
                ...(site.contact.email ? [["Email", site.contact.email]] : []),
                ...(site.contact.phone ? [["Phone", site.contact.phone]] : []),
                ["Services", services.map((s) => s.name).join(" · ")],
                ...(site.areaServed.length ? [["Areas served", site.areaServed.join(", ")]] : []),
                ...([site.social.linkedin, site.social.instagram].some(Boolean)
                  ? [["Social profiles", [site.social.linkedin, site.social.instagram].filter(Boolean).join(" · ")]]
                  : []),
                ["Tagline", site.tagline],
              ].map(([k, v]) => (
                <div key={k} className="grid gap-1 bg-white px-6 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
                  <dt className="text-sm font-semibold text-fg">{k}</dt>
                  <dd className="text-sm leading-relaxed text-body">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Section>
      )}

      {/* People */}
      <Section labelledBy="team-title" id="team">
        <SectionHeader id="team-title" eyebrow="Our People" title="The people behind LARA Solutions" className="mb-12" />
        {team.length > 0 ? (
          <div className="space-y-5">
            {team
              .filter((m) => m.founder)
              .map((m) => (
                <Reveal as="article" key={m.name} className="card-surface grid overflow-hidden rounded-3xl lg:grid-cols-12" aria-labelledby={`member-${m.name.replace(/\W+/g, "-").toLowerCase()}`}>
                  <div className="relative aspect-square lg:col-span-5 lg:aspect-auto lg:min-h-[32rem]">
                    {m.image ? (
                      <Image src={m.image} alt={m.imageAlt ?? m.name} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover object-top" />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-section-tint">
                        <UserRound aria-hidden className="size-16 text-muted" />
                      </div>
                    )}
                  </div>
                  <div className="p-7 sm:p-10 lg:col-span-7 lg:p-12">
                    <p className="eyebrow">Founder</p>
                    <h3 id={`member-${m.name.replace(/\W+/g, "-").toLowerCase()}`} className="mt-4 text-3xl font-semibold text-fg sm:text-4xl">
                      {m.name}
                    </h3>
                    <p className="mt-2 font-medium text-accent">{m.role}</p>
                    <p className="mt-6 text-lg leading-relaxed text-body">{m.bio}</p>
                    {m.strengths && m.strengths.length > 0 && (
                      <>
                        <h4 className="mt-8 text-sm font-semibold text-fg">Areas of strength</h4>
                        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                          {m.strengths.map((st) => (
                            <li key={st.title} className="rounded-2xl border border-line bg-section-tint/60 p-4">
                              <p className="flex items-center gap-2 font-semibold text-fg">
                                <span aria-hidden className="h-1 w-5 rounded-full bg-gradient-to-r from-electric to-aqua" />
                                {st.title}
                              </p>
                              <p className="mt-1.5 text-sm leading-relaxed text-body">{st.body}</p>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    {m.linkedin && (
                      <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 text-sm text-muted hover:text-fg" aria-label={`${m.name} on LinkedIn`}>
                        <LinkedInIcon className="size-4" /> LinkedIn
                      </a>
                    )}
                  </div>
                </Reveal>
              ))}
            {team.some((m) => !m.founder) && (
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {team
                  .filter((m) => !m.founder)
                  .map((m) => (
                    <Reveal as="li" key={m.name} className="card-surface overflow-hidden rounded-3xl">
                      {m.image ? (
                        <Image src={m.image} alt={m.imageAlt ?? m.name} width={480} height={480} className="aspect-square w-full object-cover" />
                      ) : (
                        <div className="flex aspect-square w-full items-center justify-center bg-section-tint">
                          <UserRound aria-hidden className="size-16 text-muted" />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-fg">{m.name}</h3>
                        <p className="text-sm text-accent">{m.role}</p>
                        <p className="mt-3 text-sm leading-relaxed text-body">{m.bio}</p>
                        {m.linkedin && (
                          <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm text-muted hover:text-fg" aria-label={`${m.name} on LinkedIn`}>
                            <LinkedInIcon className="size-4" /> LinkedIn
                          </a>
                        )}
                      </div>
                    </Reveal>
                  ))}
              </ul>
            )}
          </div>
        ) : (
          <Reveal className="rounded-3xl border border-dashed border-line-strong bg-white p-10 text-center">
            <UserRound aria-hidden className="mx-auto size-10 text-muted" />
            <p className="mt-4 font-display text-lg text-fg">Team profiles coming soon</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-body">
              We’re a growing team of strategists, marketers, data specialists and engineers. Individual profiles will be published here.
            </p>
          </Reveal>
        )}
      </Section>

      <CtaBand title="Let’s build what’s next, together." photo="people-celebrate" />
      <JsonLd data={entityGraphJsonLd([webPageJsonLd({ type: "AboutPage", path: "/about", name: "About LARA Solutions", description: site.description })])} />
    </>
  );
}
