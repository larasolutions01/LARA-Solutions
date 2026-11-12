import { getInsights, insightCategories } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { InsightsExplorer } from "@/components/content/InsightsExplorer";
import { NewsletterBlock } from "@/components/content/NewsletterBlock";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Insights — AI, Automation & Business Growth",
  description:
    "Practical guides on AI, automation, marketing intelligence, supply chain, analytics and digital transformation — written for business leaders.",
  path: "/insights",
});

export default async function InsightsPage() {
  const articles = (await getInsights()).map(({ html: _html, ...meta }) => meta);
  return (
    <>
      <PageHero
        eyebrow="Insights & Knowledge Hub"
        title="Ideas for"
        gradientTitle="intelligent growth."
        intro="Practical thinking on AI, automation, marketing, supply chains and data — written for business leaders who want results, not jargon."
        photo="ins-ai-start"
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Insights", path: "/insights" },
        ]}
      />
      <Section labelledBy="articles-title" className="py-16 sm:py-20">
        <h2 id="articles-title" className="sr-only">
          Articles
        </h2>
        <InsightsExplorer articles={articles} categories={insightCategories} />
      </Section>
      <NewsletterBlock />
    </>
  );
}
