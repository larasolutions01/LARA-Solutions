import type { PhotoKey } from "./media";


export interface Industry {
  slug: string;
  name: string;
  /** Must match an entry in `industryOptions` (forms & Opportunity Finder). */
  optionLabel: string;
  photo: PhotoKey;
  tagline: string;
  summary: string;
  challenges: string[];
  solutions: string[];
  approach: { title: string; body: string }[];
  benefits: string[];
  services: string[]; // service slugs
}

export const industries: Industry[] = [
  {
    slug: "retail-ecommerce",
    name: "Retail & E-commerce",
    optionLabel: "Retail & E-commerce",
    photo: "ind-retail",
    tagline: "Win customers. Keep stock moving. Delight at every touchpoint.",
    summary: "Win and keep customers in crowded markets while keeping inventory, fulfilment and service under control.",
    challenges: ["Rising customer acquisition costs", "Stock-outs and overstock across channels", "High volumes of repetitive customer queries", "Fragmented data across store, marketplace and ads"],
    solutions: ["Customer segmentation and personalised campaigns", "Demand forecasting and inventory alerts", "AI customer support for order and returns queries", "Unified sales and marketing dashboard"],
    approach: [
      { title: "Connect the data", body: "Bring store, marketplace, ad and CRM data into one model so performance is visible end to end." },
      { title: "Focus the spend", body: "Segment customers by value and behaviour, then align campaigns and offers to what each segment responds to." },
      { title: "Automate the routine", body: "Handle order-status and returns questions instantly and alert the team to inventory risks early." },
    ],
    benefits: ["More efficient marketing spend", "Better product availability", "Faster customer responses"],
    services: ["digital-marketing", "supply-chain-intelligence", "ai-automation"],
  },
  {
    slug: "logistics",
    name: "Logistics",
    optionLabel: "Logistics",
    photo: "ind-logistics",
    tagline: "Visibility, predictability and automation for time-critical operations.",
    summary: "Bring visibility, predictability and automation to complex, time-critical logistics and supply chain operations.",
    challenges: ["Limited real-time shipment visibility", "Manual booking, documentation and status updates", "Volatile demand and capacity planning", "Supplier and carrier performance hard to measure"],
    solutions: ["Shipment visibility and exception alerts", "Document intelligence for shipping paperwork", "Capacity and demand forecasting", "Carrier and supplier performance scorecards"],
    approach: [
      { title: "See every movement", body: "Consolidate carrier, warehouse and order data into a single operational view." },
      { title: "Manage by exception", body: "Alert teams to late shipments, capacity pinch points and unusual patterns before customers notice." },
      { title: "Remove the paperwork", body: "Extract and validate shipping documents automatically, with people reviewing only the exceptions." },
    ],
    benefits: ["Earlier detection of delays", "Less manual administration", "Better use of capacity"],
    services: ["supply-chain-intelligence", "ai-automation", "data-analytics"],
  },
  {
    slug: "manufacturing",
    name: "Manufacturing",
    optionLabel: "Manufacturing",
    photo: "ind-manufacturing",
    tagline: "Connected planning and production for leaner, more predictable operations.",
    summary: "Connect production, procurement and planning data to run leaner, more predictable operations.",
    challenges: ["Planning based on outdated spreadsheets", "Procurement delays and supplier variability", "Paper-based or duplicated data entry", "Limited visibility of production KPIs"],
    solutions: ["Production and materials planning analytics", "Procurement and supplier analytics", "Workflow digitisation and automation", "Live operations KPI dashboards"],
    approach: [
      { title: "Map the flow", body: "Trace how orders, materials and information move from planning to the shop floor." },
      { title: "Digitise hand-offs", body: "Replace paper and re-keying with connected workflows and clear ownership." },
      { title: "Measure what matters", body: "Live KPIs for throughput, backlog and supplier performance that teams review every week." },
    ],
    benefits: ["More reliable schedules", "Reduced administrative effort", "Clearer operational performance"],
    services: ["process-optimization", "supply-chain-intelligence", "data-analytics"],
  },
  {
    slug: "healthcare-businesses",
    name: "Healthcare Businesses",
    optionLabel: "Healthcare Businesses",
    photo: "ind-healthcare",
    tagline: "Streamline the business of care so teams can focus on patients.",
    summary: "Streamline the business side of care — scheduling, administration and patient communication — so clinical teams can focus on people.",
    challenges: ["Administrative load on clinical teams", "Appointment no-shows and scheduling friction", "Patient enquiries across many channels", "Operational data in disconnected systems"],
    solutions: ["Administrative workflow automation", "Appointment reminders and scheduling flows", "Patient enquiry assistant for non-clinical questions", "Operational performance dashboards"],
    approach: [
      { title: "Start with the admin burden", body: "Identify the repetitive non-clinical tasks consuming the most staff time." },
      { title: "Design with safeguards", body: "Keep clinical judgement with clinicians; automate only well-defined administrative steps with clear escalation." },
      { title: "Make operations visible", body: "Dashboards for bookings, capacity and service levels across sites." },
    ],
    benefits: ["More time for patient care", "Smoother patient experience", "Clearer operational visibility"],
    services: ["process-optimization", "ai-automation", "data-analytics"],
  },
  {
    slug: "finance-professional-services",
    name: "Finance & Professional Services",
    optionLabel: "Finance & Professional Services",
    photo: "ind-finance",
    tagline: "More time for expertise. Less time on documents and admin.",
    summary: "Automate document-heavy work, support client service and turn data into sharper client and risk decisions.",
    challenges: ["Document-intensive onboarding and processing", "Time lost to proposals, reporting and admin", "Demanding client response expectations", "Need for strong controls and auditability"],
    solutions: ["Document intelligence with human review", "AI-assisted proposals and reporting", "Client service assistants for routine requests", "Performance and pipeline dashboards"],
    approach: [
      { title: "Protect the expertise", body: "Find where skilled people spend time on assembly rather than advice." },
      { title: "Automate with an audit trail", body: "Every automated step logged and reviewable, with people approving what matters." },
      { title: "Steady the pipeline", body: "Connect lead capture, CRM and follow-up so opportunities are never missed." },
    ],
    benefits: ["Faster processing", "Consistent, auditable workflows", "More time for client work"],
    services: ["ai-automation", "data-analytics", "process-optimization"],
  },
  {
    slug: "real-estate",
    name: "Real Estate",
    optionLabel: "Real Estate",
    photo: "ind-realestate",
    tagline: "Respond faster, qualify better, manage portfolios with clarity.",
    summary: "Respond faster to enquiries, qualify better and manage portfolios with clearer data.",
    challenges: ["High enquiry volumes with slow follow-up", "Manual lead qualification", "Paperwork-heavy transactions", "Limited market and portfolio insights"],
    solutions: ["Lead capture and qualification assistant", "Automated follow-up and viewing scheduling", "Document processing for agreements and forms", "Portfolio and market dashboards"],
    approach: [
      { title: "Capture every enquiry", body: "Portals, website, social and phone enquiries land in one place, acknowledged instantly." },
      { title: "Qualify transparently", body: "Agreed criteria route the best-fit prospects to the right agent first." },
      { title: "Simplify the paperwork", body: "Extract key terms and dates from agreements and keep transactions moving." },
    ],
    benefits: ["Faster response to prospects", "Better-qualified pipeline", "Less paperwork"],
    services: ["ai-automation", "digital-marketing", "data-analytics"],
  },
  {
    slug: "technology-saas",
    name: "Technology & SaaS",
    optionLabel: "Technology & SaaS",
    photo: "ind-saas",
    tagline: "Scalable growth engines and operations that keep pace with users.",
    summary: "Build repeatable growth, scale onboarding and support, and make product and revenue metrics truly decision-ready.",
    challenges: ["Finding repeatable acquisition channels", "Onboarding and support load growing with users", "Metrics spread across many tools", "Integrations and internal tooling lagging behind"],
    solutions: ["Growth strategy and performance marketing", "In-product and support AI assistants", "Revenue and product analytics", "Integrations and internal platforms"],
    approach: [
      { title: "Instrument the funnel", body: "From first visit to expansion revenue, with shared definitions across teams." },
      { title: "Scale support intelligently", body: "Assistants that resolve routine questions and route complex ones with context." },
      { title: "Build the platform", body: "APIs, integrations and internal tools that keep operations ahead of growth." },
    ],
    benefits: ["Faster learning cycles", "Operations that scale with users", "Investor-ready metrics"],
    services: ["digital-marketing", "data-analytics", "digital-transformation"],
  },
  {
    slug: "startups-smes",
    name: "Startups & SMEs",
    optionLabel: "Startups & SMEs",
    photo: "ind-smb",
    tagline: "Big-company capability without big-company overheads.",
    summary: "Practical, high-impact improvements for founders and growing teams — designed to pay back quickly and scale with you.",
    challenges: ["Small teams stretched across every function", "Limited time to evaluate technology", "Inconsistent lead flow", "Processes living in inboxes and spreadsheets"],
    solutions: ["Quick-win automations for repetitive admin", "Lead capture, CRM and nurture set-up", "Simple, automated business dashboards", "A high-converting website and digital presence"],
    approach: [
      { title: "Find the quick wins", body: "Identify the tasks costing the most founder and team time each week." },
      { title: "Start small, measure", body: "Pilot one improvement with a clear success measure within a quarter." },
      { title: "Build as you grow", body: "Add capability step by step on a foundation that won’t need replacing." },
    ],
    benefits: ["Time back for the team", "Steadier pipeline", "Clarity on performance"],
    services: ["ai-automation", "digital-marketing", "digital-transformation"],
  },
];

export function getIndustry(slug: string) {
  return industries.find((i) => i.slug === slug);
}
