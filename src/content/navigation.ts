import { services, servicePath } from "./services";
import type { PhotoKey } from "./media";

export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string; description: string }[];
}

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Solutions",
    href: "/solutions",
    children: services.map((s) => ({ label: s.shortName, href: servicePath(s.slug), description: s.headline })),
  },
  { label: "Industries", href: "/industries" },
  { label: "About Us", href: "/about" },
  { label: "Our Work", href: "/work" },
  { label: "Insights", href: "/insights" },
  { label: "AI Tools", href: "/ai-tools" },
  { label: "Contact", href: "/contact" },
];

export const approachSteps = [
  {
    n: "01",
    title: "Discover",
    photo: "people-team",
    body: "We understand your business, goals, customers and current processes — talking to the people who do the work, not just the people who manage it.",
  },
  {
    n: "02",
    title: "Analyze",
    photo: "svc-analytics",
    body: "We examine data, workflows and systems to pinpoint bottlenecks, risks and the opportunities with the greatest potential impact.",
  },
  {
    n: "03",
    title: "Strategize",
    photo: "process-chalkboard",
    body: "We design a practical, measurable plan with clear priorities, success criteria and the right mix of strategy, technology and AI.",
  },
  {
    n: "04",
    title: "Implement",
    photo: "svc-transformation",
    body: "We build and integrate the solution — automation, analytics, platforms or campaigns — and introduce it to your team with care.",
  },
  {
    n: "05",
    title: "Optimize",
    photo: "svc-process",
    body: "We monitor performance against the agreed measures, refine workflows and improve outcomes based on real usage.",
  },
  {
    n: "06",
    title: "Scale",
    photo: "people-celebrate",
    body: "We extend what works across teams and markets, building long-term advantage — and the cycle of improvement continues.",
  },
] as const satisfies readonly { n: string; title: string; photo: PhotoKey; body: string }[];

export const outcomes = [
  { key: "growth", title: "Accelerate Growth", body: "Identify new opportunities and improve acquisition and conversion processes." },
  { key: "efficiency", title: "Improve Efficiency", body: "Streamline workflows and reduce unnecessary manual work." },
  { key: "decisions", title: "Make Smarter Decisions", body: "Translate data into useful, timely business intelligence." },
  { key: "scale", title: "Build for Scale", body: "Develop systems and processes designed to support future growth." },
] as const;
