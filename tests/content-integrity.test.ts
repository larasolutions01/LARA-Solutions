import { describe, expect, it } from "vitest";
import { serviceAeo } from "@/content/service-aeo";
import { services } from "@/content/services";
import { faq } from "@/content/faq";
import { categoryServices, getCaseStudies, getInsights } from "@/lib/content";
import { GET as llmsTxt } from "@/app/llms.txt/route";

// Unsupported quantitative claims we never want in answer copy.
const STAT_PATTERN = /\b\d{1,3}\s?%|\b\d+x\b|guarantee/i;

describe("answer-focused service content", () => {
  it("every service has complete AEO content", () => {
    for (const s of services) {
      const a = serviceAeo[s.slug];
      expect(a, s.slug).toBeDefined();
      expect(a!.question.endsWith("?")).toBe(true);
      expect(a!.answer.length).toBeGreaterThan(80);
      expect(a!.howItWorks.length).toBeGreaterThanOrEqual(3);
      expect(a!.suitableFor.length).toBeGreaterThanOrEqual(3);
      expect(a!.limitations.length).toBeGreaterThanOrEqual(2);
      expect(a!.faqs.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("contains no unsupported statistics or guarantees", () => {
    for (const [slug, a] of Object.entries(serviceAeo)) {
      const text = [a.answer, ...a.howItWorks.map((h) => h.body), ...a.limitations, ...a.faqs.map((f) => f.answer)].join(" ");
      expect(text, slug).not.toMatch(STAT_PATTERN);
    }
  });

  it("FAQ questions are unique across service pages and the FAQ hub (marked up once)", () => {
    const qs = [...Object.values(serviceAeo).flatMap((a) => a.faqs.map((f) => f.question)), ...faq.map((f) => f.question)];
    expect(new Set(qs).size).toBe(qs.length);
  });

  it("related guides exist", async () => {
    const slugs = new Set((await getInsights()).map((a) => a.slug));
    for (const [svc, a] of Object.entries(serviceAeo)) for (const g of a.relatedInsights) expect(slugs.has(g), `${svc} → ${g}`).toBe(true);
  });
});

describe("internal linking", () => {
  const serviceSlugs = new Set(services.map((s) => s.slug));

  it("articles and case studies point to real services", async () => {
    for (const a of await getInsights()) for (const s of a.services) expect(serviceSlugs.has(s), `${a.slug} → ${s}`).toBe(true);
    for (const c of await getCaseStudies()) {
      expect(c.services.length, c.slug).toBeGreaterThan(0);
      for (const s of c.services) expect(serviceSlugs.has(s), `${c.slug} → ${s}`).toBe(true);
    }
    for (const list of Object.values(categoryServices)) for (const s of list) expect(serviceSlugs.has(s)).toBe(true);
  });

  it("article sources are well-formed https links", async () => {
    for (const a of await getInsights()) for (const s of a.sources) expect(s.url, a.slug).toMatch(/^https:\/\//);
  });
});

describe("llms.txt", () => {
  it("lists the company description, every service and every guide", async () => {
    const text = await (await llmsTxt()).text();
    expect(text.startsWith("# LARA Solutions")).toBe(true);
    for (const s of services) expect(text).toContain(`/solutions/${s.slug}`);
    for (const a of await getInsights()) expect(text).toContain(`/insights/${a.slug}`);
  });
});
