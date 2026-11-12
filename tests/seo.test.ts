import { describe, expect, it } from "vitest";
import { entityGraphJsonLd, faqJsonLd, ORG_ID, organizationJsonLd, pageMetadata, WEBSITE_ID, webPageJsonLd } from "@/lib/seo";
import { site } from "@/content/site";

const CANONICAL =
  "LARA Solutions is an AI-driven digital services and business transformation agency helping organizations improve efficiency, accelerate growth, and modernize operations through artificial intelligence, digital marketing, supply chain optimization, business analytics, and intelligent automation.";

describe("entity & structured data", () => {
  it("uses the canonical company description", () => {
    expect(site.description).toBe(CANONICAL);
    expect(organizationJsonLd().description).toBe(CANONICAL);
  });

  it("keeps the meta description within snippet length", () => {
    expect(site.metaDescription.length).toBeLessThanOrEqual(160);
  });

  it("emits one Organization + WebSite graph with stable ids", () => {
    const g = entityGraphJsonLd() as { "@context": string; "@graph": Record<string, unknown>[] };
    expect(g["@context"]).toBe("https://schema.org");
    const types = g["@graph"].map((n) => n["@type"]);
    expect(types.slice(0, 2)).toEqual(["Organization", "WebSite"]);
    expect(g["@graph"][0]!["@id"]).toBe(ORG_ID);
    expect(g["@graph"][1]!["@id"]).toBe(WEBSITE_ID);
    expect((g["@graph"][1]!.publisher as { "@id": string })["@id"]).toBe(ORG_ID);
  });

  it("never publishes unverified facts (no Worldwide, no empty optional fields)", () => {
    const org = JSON.stringify(organizationJsonLd());
    expect(org).not.toMatch(/Worldwide/i);
    expect(org).not.toMatch(/aggregateRating|review|award|foundingDate|address/i);
    const o = organizationJsonLd() as Record<string, unknown>;
    if (!site.areaServed.length) expect(o.areaServed).toBeUndefined();
    if (!site.social.linkedin && !site.social.instagram) expect(o.sameAs).toBeUndefined();
    if (!site.contact.phone) expect(o.telephone).toBeUndefined();
  });

  it("builds FAQPage markup from visible Q&A", () => {
    const f = faqJsonLd([{ question: "Q?", answer: "A." }], "/faq") as { mainEntity: { name: string; acceptedAnswer: { text: string } }[] };
    expect(f.mainEntity[0]!.name).toBe("Q?");
    expect(f.mainEntity[0]!.acceptedAnswer.text).toBe("A.");
  });

  it("links typed web pages to the website and organization", () => {
    const p = webPageJsonLd({ type: "ContactPage", path: "/contact", name: "Contact", description: "d" });
    expect(p.isPartOf["@id"]).toBe(WEBSITE_ID);
    expect(p.about["@id"]).toBe(ORG_ID);
  });

  it("gives every page an Open Graph image and canonical", () => {
    const m = pageMetadata({ title: "T", description: "D", path: "/x" });
    expect(m.alternates?.canonical).toBe("/x");
    const images = m.openGraph?.images as { url: string }[];
    expect(images[0]!.url).toBe("/opengraph-image");
  });

  it("publishes the founder as a Person linked to the organization", () => {
    const g = entityGraphJsonLd() as { "@graph": Record<string, unknown>[] };
    const person = g["@graph"].find((n) => n["@type"] === "Person")!;
    expect(person.name).toBe("Agastya L Shetty");
    expect(person.jobTitle).toBe("Founder & CEO");
    expect((person.worksFor as { "@id": string })["@id"]).toBe(ORG_ID);
    expect((organizationJsonLd() as { founder: { "@id": string } }).founder["@id"]).toBe(person["@id"]);
  });
});
