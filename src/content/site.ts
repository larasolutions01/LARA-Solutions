/**
 * Central, editable site configuration.
 *
 * Contact details, booking links and social profiles are read from public
 * environment variables so they are never hard-coded. Anything left empty is
 * simply hidden from the UI — nothing is invented.
 */

const env = (value: string | undefined) => (value && value.trim().length > 0 ? value.trim() : undefined);

/** The official domain. Canonical URLs, sitemap and structured data use it in production. */
export const PRODUCTION_URL = "https://larasolutions.co.in";

/** Canonical site origin: NEXT_PUBLIC_SITE_URL if set, the official domain in production builds, localhost in development. */
function resolveSiteUrl() {
  const explicit = env(process.env.NEXT_PUBLIC_SITE_URL);
  if (explicit) return explicit.replace(/\/$/, "");
  return process.env.NODE_ENV === "production" ? PRODUCTION_URL : "http://localhost:3000";
}

export const site = {
  /** Official business name — use exactly this everywhere. */
  name: "LARA Solutions",
  legalName: env(process.env.NEXT_PUBLIC_LEGAL_NAME) ?? "LARA Solutions",
  tagline: "Intelligence That Drives Growth.",
  /**
   * Canonical company definition. Reuse verbatim (or close to it) on the
   * homepage, About, Contact, structured data, social profiles and directories.
   */
  description:
    "LARA Solutions is an AI-driven digital services and business transformation agency helping organizations improve efficiency, accelerate growth, and modernize operations through artificial intelligence, digital marketing, supply chain optimization, business analytics, and intelligent automation.",
  /** ≤160-character version for meta descriptions. */
  metaDescription:
    "AI-driven digital services and business transformation agency: AI automation, digital marketing, supply chain intelligence, analytics and transformation.",
  url: resolveSiteUrl(),
  locale: "en",
  /** Date site-wide content was last meaningfully reviewed (used for static pages in the sitemap). */
  contentUpdated: "2026-11-08",
  /**
   * Geographic areas served — leave empty until confirmed. When set (comma-separated,
   * e.g. "United Kingdom, India"), it appears on the About page and in structured data.
   */
  areaServed: (env(process.env.NEXT_PUBLIC_AREA_SERVED) ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  contact: {
    email: env(process.env.NEXT_PUBLIC_CONTACT_EMAIL) ?? "larasolutions01@gmail.com",
    phone: env(process.env.NEXT_PUBLIC_CONTACT_PHONE),
    whatsapp: env(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER), // digits only, international format
    bookingUrl: env(process.env.NEXT_PUBLIC_BOOKING_URL), // e.g. a Calendly scheduling link
    address: env(process.env.NEXT_PUBLIC_BUSINESS_ADDRESS),
  },
  social: {
    linkedin: env(process.env.NEXT_PUBLIC_LINKEDIN_URL),
    instagram: env(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
  },
  messaging: [
    "Transforming Businesses Through Intelligent Innovation.",
    "Smarter Operations. Stronger Growth.",
    "Your Business Challenges. Our Intelligent Solutions.",
    "From Business Complexity to Intelligent Simplicity.",
  ],
} as const;

export function whatsappLink(number: string, text = "Hello LARA Solutions, I'd like to discuss a project.") {
  return `https://wa.me/${number.replace(/[^\d]/g, "")}?text=${encodeURIComponent(text)}`;
}

/** Shared option lists used by forms, the Opportunity Finder and the CMS. */
export const industryOptions = [
  "Retail & E-commerce",
  "Logistics",
  "Manufacturing",
  "Healthcare Businesses",
  "Finance & Professional Services",
  "Real Estate",
  "Technology & SaaS",
  "Startups & SMEs",
  "Other",
] as const;

/** Budget ranges in Indian rupees (LARA Solutions operates mainly in India). */
export const budgetOptions = [
  "Not sure yet",
  "Under ₹2 lakh",
  "₹2 – 5 lakh",
  "₹5 – 15 lakh",
  "₹15 – 50 lakh",
  "₹50 lakh+",
] as const;
