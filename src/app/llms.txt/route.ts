import { site } from "@/content/site";
import { services, servicePath } from "@/content/services";
import { serviceAeo } from "@/content/service-aeo";
import { industries } from "@/content/industries";
import { getInsights } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";
import { founder } from "@/content/about";
import { aiTools, toolPath } from "@/lib/ai-tools/registry";

/**
 * /llms.txt — an EXPERIMENTAL, community-proposed format (llmstxt.org) that
 * gives language-model tools a concise Markdown map of the site. Support
 * varies by service and it is not a ranking factor for search engines; the
 * HTML pages, sitemap and structured data remain the primary signals.
 * Generated from the same content as the site, so it never drifts.
 */
export const dynamic = "force-static";

export async function GET() {
  const insights = await getInsights();
  const line = (title: string, path: string, note?: string) => `- [${title}](${absoluteUrl(path)})${note ? `: ${note}` : ""}`;

  const body = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    `${site.name} works with startups, small and medium-sized businesses and larger organisations, starting from the business problem and then designing, building and improving the right mix of strategy, technology and AI. Contact: ${absoluteUrl("/contact")}${site.contact.email ? ` or ${site.contact.email}` : ""}.`,
    "",
    "## Company",
    ...(founder ? [line(`${founder.name}, ${founder.role}`, "/about#team", "founder profile")] : []),
    line("About LARA Solutions", "/about", "mission, values, approach, AI principles and the founder"),
    line("Frequently asked questions", "/faq", "pricing approach, timelines, data security, who we work with"),
    line("Contact", "/contact", "request a consultation"),
    line("AI Opportunity Finder", "/opportunity-finder", "free six-question assessment with transparent, preliminary recommendations"),
    "",
    "## Services",
    ...services.map((s) => line(s.name, servicePath(s.slug), serviceAeo[s.slug]?.answer ?? s.seo.description)),
    "",
    "## Free AI tools (no sign-up)",
    line("LARA AI Tools", "/ai-tools", "free AI writing and growth tools"),
    ...aiTools.map((t) => line(t.name, toolPath(t.slug), t.description)),
    "",
    "## Industries",
    ...industries.map((i) => line(i.name, `/industries/${i.slug}`)),
    "",
    "## Guides",
    ...insights.map((a) => line(a.title, `/insights/${a.slug}`, a.description)),
    "",
    "## Optional",
    line("Illustrative scenarios", "/work", "example applications, clearly labelled as illustrative, not client results"),
    line("Privacy policy", "/privacy"),
    "",
  ].join("\n");

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
