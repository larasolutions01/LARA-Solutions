/**
 * About page content. Team details come from the people themselves (the
 * founder profile was supplied and confirmed by the founder). Company history
 * and milestones stay empty until verified — never invent biography.
 */

export const story = {
  // EDITABLE: replace with LARA Solutions' real founding story.
  paragraphs: [
    "LARA Solutions was founded on a simple observation: many businesses know AI and digital technology could help them, but struggle to turn that potential into practical, measurable improvements.",
    "We set out to close that gap — combining strategic business thinking, operational know-how and hands-on technical delivery in one partner. Rather than starting with a tool, we start with your business: where growth will come from, where time and money are lost, and which decisions deserve better information.",
  ],
  placeholderNote: "Founding year, location and milestones can be added here once confirmed.",
};

export const mission =
  "To help ambitious businesses grow, operate more efficiently and make smarter decisions by applying AI, digital technology and strategic expertise in practical, measurable ways.";

export const vision =
  "A future where every growing business — not only the largest — can use intelligent technology confidently to compete, scale and serve its customers better.";

export const differentiators = [
  { title: "Business-first, not tool-first", body: "We start from your commercial goals and operational reality, then choose the technology that fits." },
  { title: "Strategy and delivery under one roof", body: "The people who design the solution are close to the people who build it — so nothing gets lost in hand-offs." },
  { title: "Cross-functional perspective", body: "Marketing, supply chain, analytics, operations and technology seen as one connected system." },
  { title: "Measured outcomes", body: "We agree success measures up front and track them after launch." },
  { title: "Honest advice", body: "If something isn’t ready for AI, or isn’t worth automating, we’ll say so." },
  { title: "Built to be owned", body: "Documented, maintainable solutions your team understands and controls." },
];

export const values = [
  { title: "Innovation with Purpose", body: "We adopt new technology when it solves a real problem — never for novelty alone." },
  { title: "Business-First Thinking", body: "Every recommendation is tied to growth, efficiency or better decisions." },
  { title: "Transparency & Trust", body: "Clear scopes, honest progress reporting and no inflated promises." },
  { title: "Continuous Improvement", body: "We measure, learn and refine — for our clients and ourselves." },
  { title: "Measurable Impact", body: "If it can’t be measured, it’s hard to improve. We define success before we start." },
];

export const aiPrinciples = [
  { title: "Human oversight where it matters", body: "AI supports people’s judgement; sensitive decisions keep a human in the loop." },
  { title: "Grounded in your data", body: "Systems answer from approved, relevant information — and decline rather than guess." },
  { title: "Security and privacy by design", body: "Least-privilege access, protected secrets and data handling agreed up front." },
  { title: "Explainable and measurable", body: "We prefer approaches whose behaviour can be understood, tested and monitored." },
];

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image?: string; // /team/<file>
  /** Describe the photo for screen readers and search engines. */
  imageAlt?: string;
  linkedin?: string;
  /** Areas of strength shown as a list — only what the person confirms. */
  strengths?: { title: string; body: string }[];
  /** Shown as a wide profile and published as the company founder in structured data. */
  founder?: boolean;
}

/** EDITABLE: add real team members here. Leave empty to show the placeholder. */
export const team: TeamMember[] = [
  {
    name: "Agastya L Shetty",
    role: "Founder & CEO",
    founder: true,
    image: "/team/agastya-l-shetty.webp",
    imageAlt: "Agastya L Shetty, Founder & CEO of LARA Solutions, standing with arms folded in a modern office",
    bio: "Agastya L Shetty founded LARA Solutions to help businesses turn the promise of AI and digital technology into practical, measurable results. As Founder & CEO, Agastya brings strategy, technology, marketing and operations together — starting every engagement from the business problem, then shaping the right mix of people, process and AI to solve it.",
    strengths: [
      { title: "Strategy & growth", body: "Connecting business goals to clear, prioritised roadmaps that teams can act on." },
      { title: "AI & automation", body: "Finding where AI and automation genuinely save time and improve decisions — and where they don’t." },
      { title: "Marketing & brand", body: "Building brands and lead generation that tie marketing activity to real business growth." },
      { title: "Operations & supply chain", body: "Streamlining the processes, operations and supply chains that growth depends on." },
    ],
    // linkedin: "https://www.linkedin.com/in/…", // add to show a LinkedIn link and strengthen search signals
  },
];

export const founder = team.find((m) => m.founder);

/**
 * "LARA Solutions at a glance" facts block on the About page. Hidden because
 * every fact in it already appears elsewhere (footer, home page, founder
 * profile, contact page, structured data). Set to true to show it again —
 * worth doing once there are facts shown nowhere else (founding year,
 * registered company name, regions served).
 */
export const showCompanyFacts = false;

/**
 * EDITABLE: verified company milestones. The timeline only renders when this
 * list has entries — add real dates and events, never placeholders.
 * Example: { year: "2026", title: "LARA Solutions founded", body: "…" }
 */
export const milestones: { year: string; title: string; body: string }[] = [];

export const approach = [
  { title: "Understand deeply", body: "We start with people, processes and goals — not tools." },
  { title: "Design practically", body: "Solutions sized to your budget, team and timeline, with clear success measures." },
  { title: "Deliver together", body: "We build alongside your team so capability stays in your business." },
  { title: "Improve continuously", body: "We measure, learn and refine long after launch." },
];
