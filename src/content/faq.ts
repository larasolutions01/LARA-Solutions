/**
 * Approved FAQ content — shown on /faq (with FAQPage markup) and used as the
 * website assistant's knowledge base when the assistant is enabled.
 * The assistant answers ONLY from these entries (deterministic matching).
 * Edit freely — keywords drive matching, links guide visitors.
 */

export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
  links?: { label: string; href: string }[];
}

export const faq: FaqEntry[] = [
  {
    id: "what-we-do",
    question: "What does LARA Solutions do?",
    answer:
      "LARA Solutions is an AI-driven digital services and business transformation agency. We help organisations grow and run more efficiently by combining AI and automation, digital marketing, supply chain intelligence, data analytics, process optimisation and custom technology — always starting from the business problem, not the tool.",
    keywords: ["what", "do", "about", "company", "who", "lara", "services", "offer", "overview"],
    links: [{ label: "Explore solutions", href: "/solutions" }, { label: "About us", href: "/about" }],
  },
  {
    id: "ai-automation",
    question: "Can you automate our repetitive work with AI?",
    answer:
      "Yes. We build AI assistants, agents and automated workflows for things like email triage, document processing, customer support, CRM updates and reporting. We integrate them with your existing tools and keep humans in the loop where judgement matters.",
    keywords: ["ai", "automation", "automate", "agent", "agents", "chatbot", "assistant", "repetitive", "workflow", "document", "gpt", "llm"],
    links: [{ label: "AI & Automation", href: "/solutions/ai-automation" }],
  },
  {
    id: "marketing",
    question: "Do you offer digital marketing?",
    answer:
      "Yes — strategy, performance marketing, SEO, content, social, lead generation, CRM and marketing automation. We use analytics and AI to improve targeting, segmentation and conversion so budgets move towards what works.",
    keywords: ["marketing", "seo", "ads", "social", "leads", "lead", "campaign", "conversion", "growth", "content", "crm", "brand"],
    links: [{ label: "Digital Marketing & Growth", href: "/solutions/digital-marketing" }],
  },
  {
    id: "supply-chain",
    question: "How can you help our supply chain or logistics?",
    answer:
      "We help with demand forecasting, inventory intelligence, shipment visibility, procurement and supplier analytics, warehouse workflow automation and decision support — giving your team earlier warnings and better options.",
    keywords: ["supply", "chain", "logistics", "inventory", "warehouse", "forecast", "forecasting", "shipment", "procurement", "supplier", "routing", "stock"],
    links: [{ label: "Supply Chain Intelligence", href: "/solutions/supply-chain-intelligence" }],
  },
  {
    id: "analytics",
    question: "Can you build dashboards and reporting?",
    answer:
      "Yes. We connect your data sources, define KPIs with your team and build dashboards, automated reports and forecasting models that people actually use to make decisions.",
    keywords: ["data", "dashboard", "dashboards", "analytics", "report", "reporting", "bi", "kpi", "insights", "predictive", "power", "visualisation", "visualization"],
    links: [{ label: "Data Analytics & BI", href: "/solutions/data-analytics" }],
  },
  {
    id: "process",
    question: "What if our processes are messy?",
    answer:
      "That’s often the right place to start. Our process optimisation work maps how work really flows, removes bottlenecks and redesigns workflows before we automate anything — so technology improves a good process rather than speeding up a broken one.",
    keywords: ["process", "processes", "messy", "bottleneck", "efficiency", "operations", "workflow", "optimise", "optimize", "friction"],
    links: [{ label: "Process Optimisation", href: "/solutions/process-optimization" }],
  },
  {
    id: "development",
    question: "Do you build websites and custom software?",
    answer:
      "Yes — websites, internal platforms, workflow software, APIs, and CRM/ERP integrations, plus modernisation of legacy systems. Everything is documented and built to be maintainable.",
    keywords: ["website", "web", "app", "application", "software", "develop", "development", "build", "api", "erp", "integration", "integrate", "platform", "legacy"],
    links: [{ label: "Digital Transformation", href: "/solutions/digital-transformation" }],
  },
  {
    id: "pricing",
    question: "How much does it cost?",
    answer:
      "Every engagement is scoped to your goals, so pricing depends on the size and complexity of the work. We usually start with a discovery conversation, then propose a clearly priced first phase with defined deliverables. There’s no cost for the initial conversation.",
    keywords: ["cost", "price", "pricing", "budget", "expensive", "fee", "fees", "quote", "charge", "rates", "how much"],
    links: [{ label: "Request a consultation", href: "/contact" }],
  },
  {
    id: "timeline",
    question: "How long does a project take?",
    answer:
      "It depends on scope. Focused automations or dashboards can often move from discovery to a working first version in a matter of weeks; broader transformation programmes are delivered in phases so you see value early. We’ll give you a realistic timeline after discovery.",
    keywords: ["long", "time", "timeline", "weeks", "months", "duration", "fast", "quickly", "when"],
  },
  {
    id: "founder",
    question: "Who founded LARA Solutions?",
    answer:
      "LARA Solutions was founded by Agastya L Shetty, who leads the company as Founder & CEO. Agastya brings together strategy and growth, AI and automation, marketing and brand, and operations and supply chain experience to help businesses turn AI and digital technology into practical, measurable results.",
    keywords: ["founder", "founded", "ceo", "owner", "who", "runs", "started", "leader", "agastya", "shetty", "team", "people"],
    links: [{ label: "Meet the founder", href: "/about#team" }],
  },
  {
    id: "small-business",
    question: "Do you work with small businesses and startups?",
    answer:
      "Yes. We work with founders and growing teams as well as established organisations. For smaller businesses we focus on high-impact, practical improvements that pay back quickly rather than large programmes.",
    keywords: ["small", "startup", "startups", "sme", "founder", "micro", "solo", "size", "growing"],
    links: [{ label: "Industries we serve", href: "/industries" }],
  },
  {
    id: "industries",
    question: "Which industries do you work with?",
    answer:
      "We work across e-commerce and retail, logistics and supply chain, manufacturing, professional services, startups and SaaS, real estate, healthcare businesses and financial and business services. Solutions are always tailored to your context.",
    keywords: ["industry", "industries", "sector", "retail", "ecommerce", "manufacturing", "healthcare", "real estate", "finance", "saas"],
    links: [{ label: "Industries", href: "/industries" }],
  },
  {
    id: "data-security",
    question: "How do you handle data security and privacy?",
    answer:
      "We design with least-privilege access, keep secrets out of client-side code, use reputable infrastructure providers and agree data handling with you up front. Where AI services are used we select configurations appropriate to your data and requirements.",
    keywords: ["security", "secure", "privacy", "data protection", "gdpr", "confidential", "safe", "compliance"],
    links: [{ label: "Privacy policy", href: "/privacy" }],
  },
  {
    id: "international",
    question: "Where do you work with clients?",
    answer: "Tell us where your business is based when you get in touch. We’ll confirm how we can support you — including how we’d work together and suitable meeting times.",
    keywords: ["international", "global", "country", "remote", "abroad", "location", "where", "based", "time zone"],
  },
  {
    id: "start",
    question: "How do we get started?",
    answer:
      "Tell us about your business and what you want to improve through the contact form or by email. We’ll arrange a discovery conversation to understand your goals and suggest practical next steps. You can also try the AI Opportunity Finder on the homepage for a quick preliminary view.",
    keywords: ["start", "started", "begin", "contact", "talk", "call", "meeting", "consultation", "discovery", "next", "hire", "book"],
    links: [{ label: "Contact us", href: "/contact" }, { label: "AI Opportunity Finder", href: "/#opportunity-finder" }],
  },
];
