/**
 * Service catalogue. Each entry powers a card, a dedicated page, navigation,
 * the sitemap, the Opportunity Finder and the website assistant.
 *
 * To add or retire a service, add an entry or set `enabled: false`.
 */

import type { PhotoKey } from "./media";

export type ServiceIcon = "automation" | "growth" | "supply" | "analytics" | "process" | "platform" | "code" | "integration" | "strategy";

export interface Service {
  slug: string;
  enabled: boolean;
  shortName: string;
  name: string;
  headline: string;
  impact: string;
  intro: string;
  icon: ServiceIcon;
  /** core = one of the six flagship categories shown on the homepage. */
  tier: "core" | "additional";
  photo: PhotoKey;
  capabilities: string[];
  useCases: { title: string; body: string }[];
  benefits: { title: string; body: string }[];
  seo: { title: string; description: string };
}

const allServices: Service[] = [
  {
    slug: "ai-automation",
    enabled: true,
    shortName: "AI & Automation",
    name: "AI Solutions & Intelligent Automation",
    headline: "Turn Repetitive Work into Intelligent Workflows.",
    impact: "Free your team from manual, repetitive tasks with AI assistants, agents and automations that plug into the tools you already use.",
    intro:
      "Most businesses don’t need more software — they need the work between their software to happen on its own. We design AI-powered workflows that read, decide, route and respond, so your people can focus on judgement, relationships and growth. Every system we build is scoped around a measurable business process, integrated with your existing tools, and designed with human review where it matters.",
    icon: "automation",
    tier: "core",
    photo: "svc-ai",
    capabilities: [
      "AI-powered business process automation",
      "Custom AI assistants and chatbots",
      "AI agents and multi-agent workflows",
      "Document intelligence and processing",
      "AI integration with existing business tools",
      "Generative AI applications",
      "Customer service automation",
      "Sales and marketing automation",
      "Predictive AI solutions",
      "Intelligent decision-support systems",
    ],
    useCases: [
      { title: "Inbox to action", body: "Classify incoming emails, enquiries and tickets, extract the key details and route them to the right person or system — with a summary attached." },
      { title: "Document processing", body: "Pull structured data from invoices, purchase orders, contracts and forms, validate it against business rules and push it into your ERP or CRM." },
      { title: "Customer support assistant", body: "A knowledge-grounded assistant that answers routine questions around the clock and hands complex cases to your team with full context." },
      { title: "Sales follow-up agent", body: "Draft personalised follow-ups, update the CRM after calls and flag deals that are going quiet before they slip away." },
    ],
    benefits: [
      { title: "Time back", body: "Reduce hours spent on copy-paste, data entry and status chasing." },
      { title: "Consistency", body: "Processes run the same way every time, with an audit trail." },
      { title: "Responsiveness", body: "Customers and colleagues get answers faster, at any hour." },
      { title: "Scalability", body: "Handle more volume without adding headcount at the same rate." },
    ],
    seo: {
      title: "AI Automation & AI Agents for Business",
      description: "Custom AI assistants, AI agents, document intelligence and business process automation that integrate with your existing tools.",
    },
  },
  {
    slug: "digital-marketing",
    enabled: true,
    shortName: "Marketing & Growth",
    name: "Digital Marketing & Growth",
    headline: "Growth Backed by Creativity, Powered by Intelligence.",
    impact: "Strategy, creative and performance marketing — sharpened by data and AI to improve acquisition, engagement and conversion.",
    intro:
      "Great marketing still starts with a sharp understanding of your customer and a message worth hearing. We pair that strategic and creative foundation with AI-driven analytics, segmentation and automation — so every campaign learns, every channel is accountable, and your budget moves toward what actually converts.",
    icon: "growth",
    tier: "core",
    photo: "svc-marketing",
    capabilities: [
      "Digital marketing strategy",
      "Performance marketing",
      "SEO and search visibility",
      "AI-driven marketing analytics",
      "Social media marketing",
      "Content strategy",
      "Lead generation",
      "Campaign automation",
      "Conversion rate optimisation",
      "Customer segmentation",
      "CRM and marketing automation",
      "AI-powered customer insights",
    ],
    useCases: [
      { title: "Full-funnel growth plan", body: "Audit your channels, positioning and funnel, then build a prioritised roadmap tied to pipeline and revenue — not vanity metrics." },
      { title: "Intelligent segmentation", body: "Group customers by behaviour and value so messaging, offers and budgets match what each segment actually responds to." },
      { title: "Lead capture to nurture", body: "Connect forms, ads and CRM into automated nurture journeys that qualify leads and alert sales at the right moment." },
      { title: "Search visibility programme", body: "Technical SEO, content strategy and structured data that help the right buyers find you." },
    ],
    benefits: [
      { title: "Sharper targeting", body: "Spend where intent and fit are highest." },
      { title: "Better conversion", body: "Improve each step of the journey with structured experimentation." },
      { title: "Clear attribution", body: "Understand which activities create pipeline and revenue." },
      { title: "Compounding growth", body: "Systems and content that keep working after the campaign ends." },
    ],
    seo: {
      title: "AI-Powered Digital Marketing & Lead Generation",
      description: "Data-driven digital marketing strategy, performance marketing, SEO, lead generation and marketing automation powered by AI insights.",
    },
  },
  {
    slug: "supply-chain-intelligence",
    enabled: true,
    shortName: "Supply Chain",
    name: "Supply Chain & Logistics Intelligence",
    headline: "Make Your Supply Chain Smarter, Faster, and More Resilient.",
    impact: "Forecasting, inventory intelligence and operational visibility that help you plan better and react faster.",
    intro:
      "Supply chains generate enormous amounts of data, yet critical decisions are still made in spreadsheets and inboxes. We bring that data together, apply forecasting and analytics where they add real value, and automate the workflows around procurement, warehousing and shipment tracking — giving your team earlier warnings and better options.",
    icon: "supply",
    tier: "core",
    photo: "svc-supply",
    capabilities: [
      "Supply chain process optimisation",
      "Demand forecasting",
      "Inventory intelligence",
      "Logistics performance analytics",
      "Intelligent routing and planning",
      "Warehouse process automation",
      "Procurement analytics",
      "Supplier performance monitoring",
      "Shipment visibility solutions",
      "AI-powered operational decision support",
      "Workflow integration and automation",
    ],
    useCases: [
      { title: "Demand forecasting", body: "Combine sales history, seasonality and known events into forecasts your planners can review, adjust and trust." },
      { title: "Inventory health monitor", body: "Flag stock-out risk, slow movers and excess inventory early, with suggested actions for each SKU or location." },
      { title: "Shipment visibility hub", body: "One view of orders in transit across carriers, with automated exception alerts when something is running late." },
      { title: "Supplier scorecards", body: "Track on-time delivery, quality and lead-time variability to support better sourcing conversations." },
    ],
    benefits: [
      { title: "Better planning", body: "Decisions informed by forecasts rather than gut feel alone." },
      { title: "Healthier inventory", body: "Balance availability against working capital." },
      { title: "Earlier warnings", body: "Spot disruptions before they reach the customer." },
      { title: "Resource utilisation", body: "Use people, space and vehicles more effectively." },
    ],
    seo: {
      title: "AI Supply Chain & Demand Forecasting",
      description: "Demand forecasting, inventory intelligence, logistics analytics, shipment visibility and supply chain automation for resilient operations.",
    },
  },
  {
    slug: "data-analytics",
    enabled: true,
    shortName: "Data & Analytics",
    name: "Data Analytics & Business Intelligence",
    headline: "Transform Your Data into Your Next Competitive Advantage.",
    impact: "Dashboards, forecasting and decision intelligence that turn scattered data into timely, confident decisions.",
    intro:
      "Data only creates value when it changes a decision. We connect your sources, define the KPIs that matter, and build reporting and predictive models that reach the right people at the right time — in a form they will actually use. No more waiting for month-end spreadsheets to find out what happened.",
    icon: "analytics",
    tier: "core",
    photo: "svc-analytics",
    capabilities: [
      "Business intelligence dashboards",
      "KPI monitoring",
      "Predictive analytics",
      "Data visualisation",
      "Customer and market insights",
      "Automated reporting",
      "Data integration",
      "Business performance analysis",
      "Forecasting systems",
      "Decision intelligence",
    ],
    useCases: [
      { title: "Leadership cockpit", body: "A single, trusted view of revenue, margin, pipeline and operations — updated automatically and accessible on any device." },
      { title: "Automated reporting", body: "Replace manual weekly reports with scheduled, narrated summaries delivered to inboxes or chat." },
      { title: "Customer insights", body: "Understand retention, lifetime value and purchase patterns to guide product, pricing and marketing decisions." },
      { title: "Forecasting models", body: "Forward-looking views of sales, cash flow or capacity with clear confidence ranges." },
    ],
    benefits: [
      { title: "One version of truth", body: "Consistent definitions across teams." },
      { title: "Faster decisions", body: "Insight when it is still actionable." },
      { title: "Less manual reporting", body: "Analysts focus on analysis, not assembly." },
      { title: "Forward visibility", body: "Plan with forecasts, not just history." },
    ],
    seo: {
      title: "Business Intelligence & AI-Powered Analytics",
      description: "BI dashboards, KPI monitoring, predictive analytics, automated reporting and decision intelligence that turn data into action.",
    },
  },
  {
    slug: "process-optimization",
    enabled: true,
    shortName: "Process Optimisation",
    name: "Business Process Optimisation",
    headline: "Less Friction. Greater Performance.",
    impact: "Map how work really flows, remove bottlenecks and redesign operations before — and alongside — any technology.",
    intro:
      "Automating a broken process only makes the problems happen faster. We start by mapping how work actually moves through your business, finding the bottlenecks, hand-offs and duplicated effort that slow you down. Then we redesign the workflow and apply technology only where it creates a practical, measurable improvement.",
    icon: "process",
    tier: "core",
    photo: "svc-process",
    capabilities: [
      "Process mapping",
      "Workflow redesign",
      "Bottleneck identification",
      "Repetitive task elimination",
      "Internal operations optimisation",
      "Resource planning",
      "AI implementation strategy",
      "Process monitoring",
      "Productivity improvements",
      "Operational automation",
    ],
    useCases: [
      { title: "Operations diagnostic", body: "A structured review of core workflows that pinpoints where time, money and quality are being lost." },
      { title: "Order-to-cash redesign", body: "Simplify the journey from order to invoice to payment, reducing delays and errors at each hand-off." },
      { title: "AI readiness roadmap", body: "Identify which processes are ready for AI, which need cleaning up first, and the right sequence to implement them." },
      { title: "Process performance monitoring", body: "Live metrics on cycle times, backlogs and throughput so improvements stick." },
    ],
    benefits: [
      { title: "Reduced friction", body: "Fewer hand-offs, approvals and waiting." },
      { title: "Lower cost to serve", body: "Less rework and duplicated effort." },
      { title: "Clear ownership", body: "Everyone knows who does what, and when." },
      { title: "Technology that fits", body: "Tools chosen to serve the process, not the other way round." },
    ],
    seo: {
      title: "Business Process Optimisation & Automation",
      description: "Process mapping, workflow redesign, bottleneck identification and AI implementation strategy for leaner, faster operations.",
    },
  },
  {
    slug: "digital-transformation",
    enabled: true,
    shortName: "Digital Transformation",
    name: "Digital Transformation & Technology Development",
    headline: "Build the Digital Foundation for Tomorrow.",
    impact: "Custom applications, integrations and modern platforms that connect your business and support the next stage of growth.",
    intro:
      "Growth exposes the limits of disconnected systems and manual workarounds. We design and build the digital foundation your business needs — from customer-facing websites to internal platforms, integrations and modernised legacy systems — engineered to be secure, maintainable and ready for AI.",
    icon: "platform",
    tier: "core",
    photo: "svc-transformation",
    capabilities: [
      "Custom business applications",
      "Website development",
      "Internal operations platforms",
      "CRM integration",
      "ERP integration",
      "Workflow software",
      "API development",
      "System modernisation",
      "Cloud-enabled digital solutions",
      "Technology consulting",
    ],
    useCases: [
      { title: "Internal operations portal", body: "Replace scattered spreadsheets with a purpose-built platform for requests, approvals, tracking and reporting." },
      { title: "Systems integration", body: "Connect CRM, ERP, e-commerce and finance tools so data flows once, accurately, without re-keying." },
      { title: "High-performance website", body: "A fast, accessible, search-optimised website designed to convert visitors into conversations." },
      { title: "Legacy modernisation", body: "Move critical workflows off ageing systems in safe, incremental stages with minimal disruption." },
    ],
    benefits: [
      { title: "Connected systems", body: "Data moves between tools automatically and reliably." },
      { title: "Room to grow", body: "Architecture designed to scale with demand." },
      { title: "AI-ready foundation", body: "Clean data and APIs that make future AI adoption easier." },
      { title: "Ownership & control", body: "Documented, maintainable solutions you understand." },
    ],
    seo: {
      title: "Digital Transformation, CRM & ERP Integration",
      description: "Custom business applications, website development, CRM and ERP integration, API development and system modernisation.",
    },
  },
  {
    slug: "web-app-development",
    enabled: true,
    shortName: "Web & App Development",
    name: "Web & Application Development",
    headline: "Digital Products People Love to Use.",
    impact: "Fast, accessible websites and business applications engineered for conversion, usability and growth.",
    intro:
      "Your website and applications are often the first — and most frequent — experience people have of your business. We design and build fast, accessible, search-friendly websites, customer portals and business applications that are a pleasure to use and straightforward to maintain.",
    icon: "code",
    tier: "additional",
    photo: "team-laptop",
    capabilities: ["Marketing websites", "Customer portals", "Business web applications", "Progressive web apps", "Headless CMS builds", "UX and interface design", "Performance optimisation", "Accessibility (WCAG) improvements"],
    useCases: [
      { title: "Conversion-focused website", body: "Clear journeys, strong storytelling and lead capture built on a fast, modern stack." },
      { title: "Customer self-service portal", body: "Let customers track orders, download documents and raise requests without emailing your team." },
      { title: "Internal tools", body: "Purpose-built applications that replace spreadsheet workarounds for a specific team." },
    ],
    benefits: [
      { title: "Better first impressions", body: "A digital presence that matches the quality of your work." },
      { title: "More conversions", body: "Journeys designed around what visitors need to decide." },
      { title: "Lower maintenance", body: "Clean, documented code and an editable CMS." },
      { title: "Accessible to all", body: "Built to modern accessibility standards." },
    ],
    seo: { title: "Web & Application Development", description: "Fast, accessible websites, customer portals and business web applications designed for conversion and growth." },
  },
  {
    slug: "technology-integration",
    enabled: true,
    shortName: "Technology Integration",
    name: "Technology Integration",
    headline: "Make Your Systems Work as One.",
    impact: "Connect CRM, ERP, e-commerce, finance and AI services so data flows once — accurately and automatically.",
    intro:
      "Most businesses already own capable software. The friction lives between the systems: re-keyed data, out-of-date records and reports stitched together by hand. We connect your tools with robust, documented integrations so information moves reliably and every team works from the same truth.",
    icon: "integration",
    tier: "additional",
    photo: "team-review",
    capabilities: ["CRM and ERP integration", "E-commerce and marketplace connectors", "API design and development", "Data synchronisation", "Workflow and iPaaS automation", "AI service integration", "Single sign-on and identity", "Integration monitoring"],
    useCases: [
      { title: "Order-to-invoice sync", body: "Orders flow from e-commerce to ERP to accounting without re-keying." },
      { title: "One customer record", body: "CRM, support and billing share the same customer data automatically." },
      { title: "AI in existing tools", body: "Bring AI capabilities into the systems your team already uses." },
    ],
    benefits: [
      { title: "No re-keying", body: "Enter data once and trust it everywhere." },
      { title: "Fewer errors", body: "Validation at every hand-off." },
      { title: "Real-time visibility", body: "Reports reflect what is happening now." },
      { title: "Future-ready", body: "Clean APIs make new tools easy to add." },
    ],
    seo: { title: "Technology Integration", description: "CRM, ERP, e-commerce and AI integrations that connect your systems so data flows accurately and automatically." },
  },
  {
    slug: "strategy-consulting",
    enabled: true,
    shortName: "Strategy & Consulting",
    name: "Business Strategy & Consulting",
    headline: "Clarity on Where to Grow — and How.",
    impact: "Practical strategy that links your growth goals to the operational, digital and AI investments that will deliver them.",
    intro:
      "Technology decisions are business decisions. We help leadership teams clarify priorities, assess readiness and build a realistic roadmap — balancing ambition with the capabilities, budget and timing your business actually has.",
    icon: "strategy",
    tier: "additional",
    photo: "process-chalkboard",
    capabilities: ["Growth strategy", "AI and digital readiness assessment", "Technology roadmaps", "Business case development", "Operating model design", "Vendor and tool selection", "Change and adoption planning", "Executive workshops"],
    useCases: [
      { title: "AI readiness roadmap", body: "Where AI can help, what needs fixing first and the right order to invest." },
      { title: "Growth plan", body: "Prioritised initiatives tied to revenue, margin and capacity goals." },
      { title: "Tool selection", body: "Independent evaluation of platforms against your real requirements." },
    ],
    benefits: [
      { title: "Clear priorities", body: "Agreement on what to do first — and what not to do." },
      { title: "Lower risk", body: "Investments sequenced and validated before scaling." },
      { title: "Aligned leadership", body: "A shared roadmap everyone understands." },
      { title: "Measurable plan", body: "Success measures defined up front." },
    ],
    seo: { title: "Business Strategy & Consulting", description: "Growth strategy, AI readiness assessments and technology roadmaps that connect business goals to practical investments." },
  },
];

export const services = allServices.filter((s) => s.enabled);
export const coreServices = services.filter((s) => s.tier === "core");

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}

export function servicePath(slug: string) {
  return `/solutions/${slug}`;
}
