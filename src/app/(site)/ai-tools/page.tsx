import { MousePointerClick, PenLine, ShieldCheck, Copy } from "lucide-react";
import { aiTools, toolPath } from "@/lib/ai-tools/registry";
import { ToolCard } from "@/components/ai-tools/ToolCard";
import { PageHero } from "@/components/ui/PageHero";
import { JsonLd, Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/content/CtaBand";
import { absoluteUrl, orgRef, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "LARA AI Tools — Free AI Writing & Growth Tools",
  description: "Free AI tools from LARA Solutions: caption generator, email writer, bio generator, SEO generator and GrowthMind Lite growth ideas. No sign-up.",
  path: "/ai-tools",
});

const steps = [
  { icon: MousePointerClick, title: "Pick a tool", body: "Choose what you need — captions, an email, a bio, SEO copy or growth ideas." },
  { icon: PenLine, title: "Write a short brief", body: "A topic, a few details and a tone. The more specific you are, the better the result." },
  { icon: Copy, title: "Copy and use", body: "Get several options in seconds, copy the one you like, and edit it to sound like you." },
];

export default function AiToolsPage() {
  return (
    <>
      <PageHero
        eyebrow="LARA AI Tools"
        title="Free AI Tools for"
        gradientTitle="Growing Businesses."
        intro="Five simple, free tools to write captions, emails, bios and SEO copy — and spark fresh growth ideas. No sign-up, results in seconds."
        photo="team-laptop"
        crumbs={[
          { name: "Home", path: "/" },
          { name: "AI Tools", path: "/ai-tools" },
        ]}
      >
        <ButtonLink href="#tools" arrow>
          Explore the tools
        </ButtonLink>
      </PageHero>

      <Section id="tools" labelledBy="tools-title">
        <SectionHeader
          id="tools-title"
          eyebrow="Free tools"
          title={
            <>
              Five tools. <span className="text-gradient">Zero sign-ups.</span>
            </>
          }
          description="Each tool asks for a short brief and returns ready-to-use options you can copy straight away."
          className="mb-12"
        />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {aiTools.map((t, i) => (
            <Reveal as="li" key={t.slug} delay={(i % 3) * 0.06}>
              <ToolCard tool={t} />
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section theme="sky" labelledBy="how-tools-title">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeader id="how-tools-title" eyebrow="How it works" title="From brief to copy in three steps" />
            <div className="mt-8 flex items-start gap-3 rounded-2xl border border-line bg-white p-5 text-sm text-body">
              <ShieldCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-electric" />
              <p>
                Fair use: each visitor gets a generous number of free generations per day. The tools run on Google Gemini&apos;s free tier, where Google may use inputs
                to improve its products — so don&apos;t enter personal or confidential information. We don&apos;t store what you type.
              </p>
            </div>
          </div>
          <ol className="grid gap-4 sm:grid-cols-3 lg:col-span-7">
            {steps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 0.06} className="card-surface rounded-2xl p-6">
                <s.icon aria-hidden className="size-6 text-electric" />
                <h3 className="mt-4 font-semibold text-fg">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-body">{s.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      <CtaBand
        title="Want AI built around your business?"
        body="These free tools are a small taste. We design custom AI assistants and automations that fit your workflows, data and brand."
        primaryLabel="Talk to us"
        primaryHref="/contact?service=AI%20%26%20Automation"
        photo="people-team"
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "LARA AI Tools",
          itemListElement: aiTools.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, url: absoluteUrl(toolPath(t.slug)) })),
          publisher: orgRef(),
        }}
      />
    </>
  );
}
