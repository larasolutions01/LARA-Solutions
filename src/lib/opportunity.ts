/**
 * AI Opportunity Finder — transparent, rule-based recommendation engine.
 *
 * Every recommendation is produced from explicit scoring rules below, so the
 * output can be explained to the visitor ("why this?"). It is a preliminary
 * indication only — never a guarantee of results or savings.
 *
 * Score = 3 (matches challenge) + 2 (matches goal) + 1 (matches industry)
 *       + 1.5 per matching area of repetitive work + 1 (fits technology maturity)
 *       + 0.5 (suited to company size)
 */
import { industryOptions } from "@/content/site";

export const challengeOptions = [
  "Generating more leads",
  "Reducing operational costs",
  "Automating repetitive processes",
  "Improving marketing performance",
  "Managing inventory and logistics",
  "Making better decisions with data",
  "Scaling business operations",
] as const;

export const sizeOptions = ["Solo or Micro Business", "2–20 Employees", "21–100 Employees", "101–500 Employees", "500+ Employees"] as const;

export const goalOptions = ["Increase Revenue", "Improve Efficiency", "Reduce Costs", "Improve Customer Experience", "Scale Faster"] as const;

export const techOptions = [
  "Mostly manual (spreadsheets, email)",
  "Some digital tools, not connected",
  "Connected systems, little automation",
  "Already using some AI or automation",
] as const;

/** Areas of repetitive work (multi-select). Keys map to scoring boosts. */
export const areaOptions = [
  { key: "support", label: "Customer enquiries & support" },
  { key: "documents", label: "Data entry & documents" },
  { key: "reporting", label: "Reporting & spreadsheets" },
  { key: "sales", label: "Sales follow-up & CRM updates" },
  { key: "scheduling", label: "Scheduling & coordination" },
  { key: "inventory", label: "Inventory & order processing" },
  { key: "marketing", label: "Marketing content & campaigns" },
] as const;

export type Industry = (typeof industryOptions)[number];
export type Challenge = (typeof challengeOptions)[number];
export type Size = (typeof sizeOptions)[number];
export type Goal = (typeof goalOptions)[number];
export type Tech = (typeof techOptions)[number];
export type AreaKey = (typeof areaOptions)[number]["key"];
export type OpportunityCategory = "Automation" | "Marketing" | "Analytics" | "Operations" | "Technology";

export interface FinderAnswers {
  industry: Industry;
  size: Size;
  challenge: Challenge;
  goal: Goal;
  tech?: Tech;
  areas?: AreaKey[];
}

interface OpportunityRule {
  id: string;
  title: string;
  description: string;
  service: string; // service slug
  category: OpportunityCategory;
  challenges: Challenge[];
  goals: Goal[];
  industries: Industry[];
  sizes?: Size[];
}

const SMALL: Size[] = ["Solo or Micro Business", "2–20 Employees"];
const MID: Size[] = ["21–100 Employees", "101–500 Employees"];
const LARGE: Size[] = ["101–500 Employees", "500+ Employees"];

export const opportunityRules: OpportunityRule[] = [
  {
    id: "lead-capture-automation",
    title: "Automated lead capture & qualification",
    description: "Connect your forms, ads and inbox to a CRM that scores and routes new leads instantly, so promising prospects get a fast, relevant response.",
    service: "digital-marketing",
    category: "Marketing",
    challenges: ["Generating more leads", "Improving marketing performance"],
    goals: ["Increase Revenue", "Scale Faster"],
    industries: ["Real Estate", "Finance & Professional Services", "Technology & SaaS", "Startups & SMEs"],
  },
  {
    id: "growth-strategy",
    title: "Data-led growth strategy & channel focus",
    description: "Review where your best customers come from and concentrate budget and content on the channels and messages that convert.",
    service: "digital-marketing",
    category: "Marketing",
    challenges: ["Generating more leads", "Improving marketing performance"],
    goals: ["Increase Revenue", "Reduce Costs"],
    industries: ["Retail & E-commerce", "Technology & SaaS", "Startups & SMEs", "Finance & Professional Services"],
    sizes: [...SMALL, "21–100 Employees"],
  },
  {
    id: "customer-segmentation",
    title: "Customer segmentation & personalised campaigns",
    description: "Group customers by behaviour and value to tailor offers and messaging — improving engagement and repeat business.",
    service: "digital-marketing",
    category: "Marketing",
    challenges: ["Improving marketing performance", "Generating more leads"],
    goals: ["Increase Revenue", "Improve Customer Experience"],
    industries: ["Retail & E-commerce", "Finance & Professional Services", "Technology & SaaS"],
    sizes: [...MID, "500+ Employees"],
  },
  {
    id: "ai-support-assistant",
    title: "AI customer support assistant",
    description: "Answer routine customer questions instantly from your own knowledge base, and hand complex cases to your team with full context.",
    service: "ai-automation",
    category: "Automation",
    challenges: ["Scaling business operations", "Reducing operational costs", "Automating repetitive processes"],
    goals: ["Improve Customer Experience", "Scale Faster", "Reduce Costs"],
    industries: ["Retail & E-commerce", "Technology & SaaS", "Healthcare Businesses", "Real Estate"],
  },
  {
    id: "document-intelligence",
    title: "Document processing automation",
    description: "Extract and validate data from invoices, forms and contracts automatically, removing manual data entry and re-keying errors.",
    service: "ai-automation",
    category: "Automation",
    challenges: ["Automating repetitive processes", "Reducing operational costs"],
    goals: ["Improve Efficiency", "Reduce Costs"],
    industries: ["Finance & Professional Services", "Logistics", "Manufacturing", "Real Estate"],
  },
  {
    id: "workflow-automation",
    title: "End-to-end workflow automation",
    description: "Automate hand-offs between email, spreadsheets and business tools — approvals, notifications, updates and reminders that currently happen by hand.",
    service: "ai-automation",
    category: "Automation",
    challenges: ["Automating repetitive processes", "Scaling business operations", "Reducing operational costs"],
    goals: ["Improve Efficiency", "Scale Faster", "Reduce Costs"],
    industries: ["Finance & Professional Services", "Healthcare Businesses", "Manufacturing", "Startups & SMEs"],
  },
  {
    id: "process-diagnostic",
    title: "Operations diagnostic & bottleneck removal",
    description: "Map your core workflows to find where time and money are lost, then redesign them before automating — so improvements last.",
    service: "process-optimization",
    category: "Operations",
    challenges: ["Reducing operational costs", "Scaling business operations", "Automating repetitive processes"],
    goals: ["Improve Efficiency", "Reduce Costs", "Scale Faster"],
    industries: ["Manufacturing", "Healthcare Businesses", "Logistics"],
    sizes: [...MID, "500+ Employees"],
  },
  {
    id: "demand-forecasting",
    title: "Demand forecasting",
    description: "Use sales history and seasonality to forecast demand, so purchasing and planning decisions are made with more confidence.",
    service: "supply-chain-intelligence",
    category: "Operations",
    challenges: ["Managing inventory and logistics", "Making better decisions with data"],
    goals: ["Reduce Costs", "Improve Efficiency", "Increase Revenue"],
    industries: ["Retail & E-commerce", "Manufacturing", "Logistics"],
  },
  {
    id: "inventory-intelligence",
    title: "Inventory health monitoring",
    description: "Get early warnings on stock-out risk, slow-moving and excess stock, with suggested actions — balancing availability and working capital.",
    service: "supply-chain-intelligence",
    category: "Operations",
    challenges: ["Managing inventory and logistics", "Reducing operational costs"],
    goals: ["Reduce Costs", "Improve Customer Experience"],
    industries: ["Retail & E-commerce", "Manufacturing", "Logistics"],
  },
  {
    id: "shipment-visibility",
    title: "Shipment visibility & exception alerts",
    description: "One view of orders in transit with automatic alerts when deliveries are at risk, so your team can act before customers are affected.",
    service: "supply-chain-intelligence",
    category: "Operations",
    challenges: ["Managing inventory and logistics", "Scaling business operations"],
    goals: ["Improve Customer Experience", "Improve Efficiency"],
    industries: ["Logistics", "Retail & E-commerce", "Manufacturing"],
  },
  {
    id: "kpi-dashboard",
    title: "Leadership KPI dashboard",
    description: "Bring sales, operations and finance data into one trusted, automatically updated view so decisions are based on current information.",
    service: "data-analytics",
    category: "Analytics",
    challenges: ["Making better decisions with data", "Scaling business operations"],
    goals: ["Improve Efficiency", "Scale Faster", "Increase Revenue"],
    industries: ["Technology & SaaS", "Finance & Professional Services", "Manufacturing", "Startups & SMEs"],
  },
  {
    id: "automated-reporting",
    title: "Automated reporting",
    description: "Replace manually assembled weekly and monthly reports with scheduled, consistent reports delivered to the people who need them.",
    service: "data-analytics",
    category: "Analytics",
    challenges: ["Making better decisions with data", "Automating repetitive processes", "Reducing operational costs"],
    goals: ["Improve Efficiency", "Reduce Costs"],
    industries: ["Finance & Professional Services", "Healthcare Businesses", "Logistics"],
  },
  {
    id: "predictive-insights",
    title: "Predictive customer & revenue insights",
    description: "Forecast revenue, churn risk or customer lifetime value to focus effort where it will have the greatest effect.",
    service: "data-analytics",
    category: "Analytics",
    challenges: ["Making better decisions with data", "Generating more leads"],
    goals: ["Increase Revenue", "Improve Customer Experience"],
    industries: ["Technology & SaaS", "Retail & E-commerce", "Finance & Professional Services"],
    sizes: [...MID, "500+ Employees"],
  },
  {
    id: "systems-integration",
    title: "Systems integration & internal platform",
    description: "Connect your CRM, ERP and operational tools — or replace spreadsheet workarounds with a purpose-built platform that grows with you.",
    service: "digital-transformation",
    category: "Technology",
    challenges: ["Scaling business operations", "Automating repetitive processes"],
    goals: ["Scale Faster", "Improve Efficiency"],
    industries: ["Logistics", "Manufacturing", "Real Estate", "Healthcare Businesses"],
    sizes: [...MID, ...LARGE],
  },
  {
    id: "conversion-website",
    title: "High-converting website & funnel",
    description: "A fast, search-optimised website with clear journeys and lead capture, so more visitors turn into conversations.",
    service: "digital-transformation",
    category: "Technology",
    challenges: ["Generating more leads", "Improving marketing performance"],
    goals: ["Increase Revenue", "Improve Customer Experience"],
    industries: ["Real Estate", "Finance & Professional Services", "Healthcare Businesses", "Startups & SMEs", "Other"],
    sizes: SMALL,
  },
];

export interface ScoredOpportunity {
  id: string;
  title: string;
  description: string;
  service: string;
  category: OpportunityCategory;
  score: number;
  reasons: string[];
}

export interface FinderResult {
  opportunities: ScoredOpportunity[];
  services: string[];
  firstSteps: string[];
  categories: OpportunityCategory[];
}

/** Which rules each repetitive-work area strengthens. */
export const areaBoosts: Record<AreaKey, string[]> = {
  support: ["ai-support-assistant"],
  documents: ["document-intelligence"],
  reporting: ["automated-reporting", "kpi-dashboard"],
  sales: ["lead-capture-automation"],
  scheduling: ["workflow-automation"],
  inventory: ["inventory-intelligence", "demand-forecasting"],
  marketing: ["customer-segmentation", "growth-strategy"],
};

/** Which rules suit each level of technology maturity. */
export const techBoosts: Record<Tech, string[]> = {
  "Mostly manual (spreadsheets, email)": ["process-diagnostic", "conversion-website", "workflow-automation"],
  "Some digital tools, not connected": ["systems-integration", "automated-reporting"],
  "Connected systems, little automation": ["workflow-automation", "ai-support-assistant", "document-intelligence"],
  "Already using some AI or automation": ["predictive-insights", "kpi-dashboard", "customer-segmentation"],
};

export function scoreOpportunity(rule: OpportunityRule, a: FinderAnswers): ScoredOpportunity {
  let score = 0;
  const reasons: string[] = [];
  if (rule.challenges.includes(a.challenge)) {
    score += 3;
    reasons.push(`Addresses your challenge: ${a.challenge.toLowerCase()}`);
  }
  if (rule.goals.includes(a.goal)) {
    score += 2;
    reasons.push(`Supports your goal to ${a.goal.toLowerCase()}`);
  }
  if (rule.industries.includes(a.industry)) {
    score += 1;
    reasons.push(`Commonly relevant in ${a.industry}`);
  }
  for (const area of a.areas ?? []) {
    if (areaBoosts[area]?.includes(rule.id)) {
      score += 1.5;
      const label = areaOptions.find((o) => o.key === area)?.label ?? area;
      reasons.push(`Targets repetitive work in ${label.toLowerCase()}`);
    }
  }
  if (a.tech && techBoosts[a.tech].includes(rule.id)) {
    score += 1;
    reasons.push("A sensible next step for your current technology setup");
  }
  if (!rule.sizes || rule.sizes.includes(a.size)) {
    score += 0.5;
  }
  return { id: rule.id, title: rule.title, description: rule.description, service: rule.service, category: rule.category, score, reasons };
}

export function firstStepsFor(a: FinderAnswers): string[] {
  const small = SMALL.includes(a.size);
  const large = a.size === "500+ Employees";
  const steps: string[] = [];

  steps.push(
    small
      ? "List the three tasks that take the most of your (or your team’s) time each week — these are often the fastest wins."
      : "Pick one high-volume process or metric to focus on first, and name an owner who can make decisions about it.",
  );

  const dataStep: Record<Challenge, string> = {
    "Generating more leads": "Gather where your current leads come from and how quickly each one gets a response.",
    "Reducing operational costs": "Estimate where time and money go in your core operations — even rough figures help prioritise.",
    "Automating repetitive processes": "Write down the steps of one repetitive process, including the tools and hand-offs involved.",
    "Improving marketing performance": "Collect your recent campaign results by channel, including cost and the leads or sales they produced.",
    "Managing inventory and logistics": "Export recent sales, stock and delivery data so patterns and pain points can be assessed.",
    "Making better decisions with data": "List the decisions you make regularly and the data you wish you had for each one.",
    "Scaling business operations": "Identify which processes would break first if your volume doubled next year.",
  };
  steps.push(dataStep[a.challenge]);

  if (a.tech) {
    const techStep: Record<Tech, string> = {
      "Mostly manual (spreadsheets, email)": "Standardise one core process and move it into a shared digital tool — this makes later automation far easier.",
      "Some digital tools, not connected": "Map which systems hold your key data (customers, orders, finance) and where information is re-typed between them.",
      "Connected systems, little automation": "Choose one well-defined, high-volume workflow as an automation pilot, with a human review step.",
      "Already using some AI or automation": "Review what your current automations deliver and where data quality limits more advanced analytics or AI.",
    };
    steps.push(techStep[a.tech]);
  }

  steps.push(
    large
      ? "Align stakeholders on success criteria and governance before a pilot, so a proven approach can be rolled out across teams."
      : "Agree what success looks like for a small pilot — a measurable improvement you could see within one quarter.",
  );
  steps.push("Book a discovery call with LARA Solutions to validate these opportunities and shape a practical roadmap.");
  return steps;
}

export function recommend(a: FinderAnswers): FinderResult {
  const scored = opportunityRules
    .map((rule, index) => ({ ...scoreOpportunity(rule, a), index }))
    .sort((x, y) => y.score - x.score || x.index - y.index);

  // Prefer variety: no more than two opportunities from the same service.
  const picked: ScoredOpportunity[] = [];
  const perService = new Map<string, number>();
  for (const s of scored) {
    if (picked.length === 3) break;
    const count = perService.get(s.service) ?? 0;
    if (count >= 2) continue;
    perService.set(s.service, count + 1);
    const { index: _index, ...rest } = s;
    picked.push(rest);
  }

  const services = Array.from(new Set(picked.map((p) => p.service)));
  const categories = Array.from(new Set(picked.map((p) => p.category)));
  return { opportunities: picked, services, firstSteps: firstStepsFor(a), categories };
}
