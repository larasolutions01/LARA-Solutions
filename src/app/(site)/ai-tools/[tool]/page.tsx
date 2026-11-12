import { notFound } from "next/navigation";
import { aiTools, getTool, toolPath } from "@/lib/ai-tools/registry";
import { AiToolRunner } from "@/components/ai-tools/AiToolRunner";
import { ToolCard, ToolIcon } from "@/components/ai-tools/ToolCard";
import { PageHero } from "@/components/ui/PageHero";
import { JsonLd, Section, SectionHeader } from "@/components/ui/Section";
import { CtaBand } from "@/components/content/CtaBand";
import { absoluteUrl, orgRef, pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return aiTools.map((t) => ({ tool: t.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ tool: string }> }) {
  const { tool: slug } = await params;
  const t = getTool(slug);
  if (!t) return {};
  return pageMetadata({ title: t.seo.title, description: t.seo.description, path: toolPath(t.slug) });
}

export default async function AiToolPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool: slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();
  const others = aiTools.filter((t) => t.slug !== tool.slug);

  return (
    <>
      <PageHero
        eyebrow="LARA AI Tools · Free"
        title={tool.name}
        intro={tool.description}
        crumbs={[
          { name: "Home", path: "/" },
          { name: "AI Tools", path: "/ai-tools" },
          { name: tool.name, path: toolPath(tool.slug) },
        ]}
        aside={
          <div className="hidden justify-end lg:flex">
            <ToolIcon name={tool.icon} className="size-28 rounded-[2rem] [&>svg]:size-12" />
          </div>
        }
      />

      <Section labelledBy={`${tool.slug}-runner`} className="pt-12 sm:pt-16">
        <h2 id={`${tool.slug}-runner`} className="sr-only">
          {tool.name}
        </h2>
        <AiToolRunner tool={tool} />
      </Section>

      <Section theme="sky" labelledBy="more-tools-title">
        <SectionHeader id="more-tools-title" eyebrow="More free tools" title="Try another LARA AI tool" className="mb-10" />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((t) => (
            <li key={t.slug}>
              <ToolCard tool={t} compact />
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand
        title="Need something built for your business?"
        body="We create custom AI tools, assistants and automations around your workflows — with your data, brand voice and approvals built in."
        primaryLabel="Talk to us"
        primaryHref="/contact?service=AI%20%26%20Automation"
        photo="city-dusk"
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: tool.name,
          description: tool.description,
          url: absoluteUrl(toolPath(tool.slug)),
          applicationCategory: "BusinessApplication",
          operatingSystem: "Any (web browser)",
          isAccessibleForFree: true,
          offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
          provider: orgRef(),
        }}
      />
    </>
  );
}
