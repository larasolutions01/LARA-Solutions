import type { MetadataRoute } from "next";
import { services, servicePath } from "@/content/services";
import { industries } from "@/content/industries";
import { getCaseStudies, getInsights } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";
import { site } from "@/content/site";
import { aiTools, toolPath } from "@/lib/ai-tools/registry";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [insights, studies] = await Promise.all([getInsights(), getCaseStudies()]);
  // Static and service pages use the date their content last meaningfully
  // changed (site.contentUpdated) — not the build time — so lastmod stays honest.
  const now = new Date(site.contentUpdated);
  const latestInsight = insights.reduce<string>((d, a) => ((a.updated ?? a.date) > d ? (a.updated ?? a.date) : d), site.contentUpdated);
  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1, lastModified: now },
    { url: absoluteUrl("/solutions"), changeFrequency: "monthly", priority: 0.9, lastModified: now },
    { url: absoluteUrl("/industries"), changeFrequency: "monthly", priority: 0.8, lastModified: now },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.7, lastModified: now },
    { url: absoluteUrl("/work"), changeFrequency: "monthly", priority: 0.7, lastModified: now },
    { url: absoluteUrl("/insights"), changeFrequency: "weekly", priority: 0.8, lastModified: new Date(latestInsight) },
    { url: absoluteUrl("/contact"), changeFrequency: "yearly", priority: 0.8, lastModified: now },
    { url: absoluteUrl("/opportunity-finder"), changeFrequency: "monthly", priority: 0.8, lastModified: now },
    { url: absoluteUrl("/faq"), changeFrequency: "monthly", priority: 0.7, lastModified: now },
    { url: absoluteUrl("/ai-tools"), changeFrequency: "monthly", priority: 0.8, lastModified: now },
    ...aiTools.map((t) => ({ url: absoluteUrl(toolPath(t.slug)), changeFrequency: "monthly" as const, priority: 0.7, lastModified: now })),
    { url: absoluteUrl("/privacy"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/terms"), changeFrequency: "yearly", priority: 0.2 },
  ];
  return [
    ...staticPages,
    ...services.map((s) => ({ url: absoluteUrl(servicePath(s.slug)), changeFrequency: "monthly" as const, priority: s.tier === "core" ? 0.9 : 0.7, lastModified: now })),
    ...industries.map((i) => ({ url: absoluteUrl(`/industries/${i.slug}`), changeFrequency: "monthly" as const, priority: 0.7, lastModified: now })),
    ...insights.map((a) => ({ url: absoluteUrl(`/insights/${a.slug}`), lastModified: new Date(a.updated ?? a.date), changeFrequency: "yearly" as const, priority: 0.6 })),
    ...studies.map((c) => ({ url: absoluteUrl(`/work/${c.slug}`), lastModified: new Date(c.date), changeFrequency: "yearly" as const, priority: 0.5 })),
  ];
}
