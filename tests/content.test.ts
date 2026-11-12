import { describe, expect, it } from "vitest";
import { getCaseStudies, getInsights, relatedInsights } from "@/lib/content";
import { services } from "@/content/services";
import { industries } from "@/content/industries";

describe("CMS content", () => {
  it("all insights have valid frontmatter and render", async () => {
    const items = await getInsights();
    expect(items.length).toBeGreaterThan(0);
    for (const a of items) {
      expect(a.html.length).toBeGreaterThan(100);
      expect(a.readingTime).toBeGreaterThan(0);
    }
    expect(relatedInsights(items, items[0]!).length).toBeGreaterThan(0);
  });

  it("case studies are either illustrative or approved client projects", async () => {
    const items = await getCaseStudies();
    expect(items.length).toBeGreaterThan(0);
    for (const c of items) expect(c.type === "illustrative" || c.approved).toBe(true);
  });

  it("industries reference existing services", () => {
    const slugs = new Set(services.map((s) => s.slug));
    for (const i of industries) for (const s of i.services) expect(slugs.has(s)).toBe(true);
  });
});
