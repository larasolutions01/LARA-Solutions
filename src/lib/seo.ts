import type { Metadata } from "next";
import { site } from "@/content/site";
import { founder } from "@/content/about";

/**
 * SEO helpers: per-page metadata and schema.org JSON-LD.
 *
 * Entities use stable @id values so pages can reference the same Organization
 * and WebSite without repeating them everywhere. Only verified information is
 * emitted — optional fields (social profiles, area served, phone) appear only
 * when configured.
 */

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//.test(path)) return path;
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export const ORG_ID = `${site.url}/#organization`;
export const WEBSITE_ID = `${site.url}/#website`;
export const FOUNDER_ID = `${site.url}/about#founder`;
const LOGO_URL = absoluteUrl("/brand/lara-icon-512.png");

/** Lightweight reference to the Organization (for provider/publisher fields). */
export const orgRef = () => ({ "@id": ORG_ID, "@type": "Organization", name: site.name, url: site.url });

export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  publishedTime,
  modifiedTime,
  noIndex,
  image,
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
  /** Absolute or root-relative image for social previews (defaults to the branded OG image). */
  image?: { url: string; width?: number; height?: number; alt?: string };
}): Metadata {
  const img = image ?? { url: "/opengraph-image", width: 1200, height: 630, alt: `${site.name} — ${site.tagline}` };
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url: path,
      siteName: site.name,
      type,
      locale: "en_GB",
      images: [img],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: { card: "summary_large_image", title: `${title} | ${site.name}`, description, images: [img.url] },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}

export function organizationJsonLd() {
  const sameAs = [site.social.linkedin, site.social.instagram].filter(Boolean);
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: site.name,
    ...(site.legalName !== site.name ? { legalName: site.legalName } : {}),
    url: site.url,
    logo: { "@type": "ImageObject", url: LOGO_URL, width: 512, height: 512 },
    image: LOGO_URL,
    description: site.description,
    slogan: site.tagline,
    ...(founder ? { founder: { "@id": FOUNDER_ID } } : {}),
    ...(site.contact.email ? { email: site.contact.email } : {}),
    ...(site.contact.phone ? { telephone: site.contact.phone } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    ...(site.areaServed.length ? { areaServed: site.areaServed.map((name) => ({ "@type": "Place", name })) } : {}),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        ...(site.contact.email ? { email: site.contact.email } : {}),
        ...(site.contact.phone ? { telephone: site.contact.phone } : {}),
        url: absoluteUrl("/contact"),
        availableLanguage: ["English"],
      },
    ],
    knowsAbout: [
      "Artificial intelligence",
      "AI agents",
      "Business process automation",
      "Digital marketing",
      "Search engine optimization",
      "Supply chain analytics",
      "Demand forecasting",
      "Business intelligence",
      "Digital transformation",
      "Custom software development",
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: site.url,
    name: site.name,
    description: site.description,
    inLanguage: "en",
    publisher: { "@id": ORG_ID },
  };
}

/** The founder as a Person — only published because the profile is real and shown on /about. */
export function founderJsonLd() {
  if (!founder) return undefined;
  return {
    "@type": "Person",
    "@id": FOUNDER_ID,
    name: founder.name,
    jobTitle: founder.role,
    description: founder.bio,
    url: absoluteUrl("/about#team"),
    ...(founder.image ? { image: absoluteUrl(founder.image) } : {}),
    worksFor: { "@id": ORG_ID },
    ...(founder.strengths?.length ? { knowsAbout: founder.strengths.map((s) => s.title) } : {}),
    ...(founder.linkedin ? { sameAs: [founder.linkedin] } : {}),
  };
}

/** Organization + WebSite (+ founder) as one graph — rendered on the homepage and About page. */
export function entityGraphJsonLd(extra: object[] = []) {
  const person = founderJsonLd();
  return { "@context": "https://schema.org", "@graph": [organizationJsonLd(), websiteJsonLd(), ...(person ? [person] : []), ...extra] };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
  };
}

/** FAQPage — only for questions and answers that are visibly displayed on the same page. */
export function faqJsonLd(items: { question: string; answer: string }[], path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${absoluteUrl(path)}#faq`,
    mainEntity: items.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  };
}

/** Typed WebPage (AboutPage, ContactPage, CollectionPage…) linked to the WebSite. */
export function webPageJsonLd({ type = "WebPage", path, name, description }: { type?: string; path: string; name: string; description: string }) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name,
    description,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
  };
}
