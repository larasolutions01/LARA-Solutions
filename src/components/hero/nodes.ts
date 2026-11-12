import type { PhotoKey } from "@/content/media";

export interface HeroNode {
  id: string;
  label: string;
  description: string;
  href: string;
  color: string;
  photo: PhotoKey;
  points: string[];
  angle: number; // degrees around the core
}

export const heroNodes: HeroNode[] = [
  {
    id: "ai",
    label: "AI & Automation",
    description: "Assistants, agents and automated workflows that take repetitive work off your team’s plate.",
    href: "/solutions/ai-automation",
    color: "#2864FF",
    photo: "svc-ai",
    points: ["AI agents", "Document intelligence", "Workflow automation"],
    angle: 150,
  },
  {
    id: "marketing",
    label: "Digital Marketing",
    description: "Strategy, performance marketing and AI-driven insights that turn attention into revenue.",
    href: "/solutions/digital-marketing",
    color: "#FFAD55",
    photo: "svc-marketing",
    points: ["Performance marketing", "SEO", "Customer intelligence"],
    angle: 90,
  },
  {
    id: "supply",
    label: "Supply Chain",
    description: "Forecasting, inventory intelligence and visibility that keep operations resilient.",
    href: "/solutions/supply-chain-intelligence",
    color: "#00C9E8",
    photo: "svc-supply",
    points: ["Demand forecasting", "Inventory optimisation", "Logistics intelligence"],
    angle: 30,
  },
  {
    id: "analytics",
    label: "Data Analytics",
    description: "Dashboards, forecasts and decision intelligence built on data you can trust.",
    href: "/solutions/data-analytics",
    color: "#12D6B0",
    photo: "svc-analytics",
    points: ["KPI dashboards", "Predictive analytics", "Automated reporting"],
    angle: 330,
  },
  {
    id: "operations",
    label: "Business Operations",
    description: "Process mapping and redesign that remove friction before — and alongside — automation.",
    href: "/solutions/process-optimization",
    color: "#9674FF",
    photo: "svc-process",
    points: ["Process redesign", "Bottleneck removal", "Resource optimisation"],
    angle: 270,
  },
  {
    id: "transformation",
    label: "Digital Transformation",
    description: "Integrated platforms, applications and modern systems that form your digital foundation.",
    href: "/solutions/digital-transformation",
    color: "#5B8CFF",
    photo: "svc-transformation",
    points: ["Custom software", "CRM / ERP integration", "AI-enabled platforms"],
    angle: 210,
  },
];

/** Ellipse radii in world units (used by the 3D scene and the 2D fallback). */
export const RX = 3.05;
export const RY = 1.9;

export function nodePosition(angleDeg: number, layoutScale = 1) {
  const a = (angleDeg * Math.PI) / 180;
  return {
    x: Math.cos(a) * RX * layoutScale,
    y: Math.sin(a) * RY,
    z: Math.sin(a * 2) * 0.7,
  };
}
