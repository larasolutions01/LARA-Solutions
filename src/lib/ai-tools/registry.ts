/**
 * LARA AI Tools — the public, browser-safe definition of every mini tool.
 *
 * To add a new tool:
 *   1. Add an entry here (slug, copy, icon, fields).
 *   2. Add its prompt + output schema in `server/specs.ts` (same slug).
 * The page, form, API route, validation, sitemap and navigation pick it up
 * automatically. A test fails if a tool is missing either half.
 */

export type ToolFieldType = "text" | "textarea" | "select";

export interface ToolField {
  name: string;
  label: string;
  type: ToolFieldType;
  placeholder?: string;
  hint?: string;
  required?: boolean;
  /** Hard limit, enforced in the browser and again on the server. */
  maxLength: number;
  /** Required for `select` fields. */
  options?: readonly string[];
}

export type ToolIcon = "caption" | "email" | "growth" | "bio" | "seo";

export interface AiTool {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  icon: ToolIcon;
  /** Short label for what the tool returns, shown on cards. */
  returns: string;
  fields: ToolField[];
  seo: { title: string; description: string };
}

/** A tool's result, normalised so one UI can render every tool. */
export interface ToolOutputSection {
  title: string;
  items: string[];
  /** "cards" = one copyable card per item; "chips" = compact tags. */
  style?: "cards" | "chips";
}
export interface ToolOutput {
  sections: ToolOutputSection[];
}

const PLATFORMS_SOCIAL = ["Instagram", "LinkedIn", "Facebook", "X (Twitter)", "YouTube", "Threads"] as const;

export const aiTools: AiTool[] = [
  {
    slug: "caption-generator",
    name: "AI Caption Generator",
    tagline: "Scroll-stopping captions with hashtags, in seconds.",
    description: "Describe your post, pick a platform and tone, and get three ready-to-post captions with relevant hashtags.",
    icon: "caption",
    returns: "3 captions + hashtags",
    fields: [
      { name: "topic", label: "What is the post about?", type: "textarea", required: true, maxLength: 300, placeholder: "e.g. Launching our new same-day delivery service across Pune" },
      { name: "platform", label: "Platform", type: "select", required: true, maxLength: 40, options: PLATFORMS_SOCIAL },
      { name: "tone", label: "Tone", type: "select", required: true, maxLength: 40, options: ["Professional", "Friendly", "Witty", "Inspirational", "Bold", "Casual"] },
    ],
    seo: { title: "Free AI Caption Generator with Hashtags", description: "Free AI caption generator for Instagram, LinkedIn, Facebook and more. Get three captions with relevant hashtags in seconds — no sign-up." },
  },
  {
    slug: "email-writer",
    name: "AI Email Writer",
    tagline: "Clear, ready-to-send emails with a subject line.",
    description: "Tell it the purpose, the key details and the tone. Get a subject line and a polished email you can send right away.",
    icon: "email",
    returns: "Subject line + email",
    fields: [
      { name: "purpose", label: "Purpose of the email", type: "text", required: true, maxLength: 160, placeholder: "e.g. Follow up after a sales call" },
      {
        name: "details",
        label: "Key details to include",
        type: "textarea",
        required: true,
        maxLength: 800,
        placeholder: "e.g. Spoke with Priya on Monday about our inventory dashboard. Offer a 2-week free trial. Ask for a 20-minute demo next week.",
        hint: "Names, dates, offers, next steps. Missing details become [placeholders].",
      },
      { name: "tone", label: "Tone", type: "select", required: true, maxLength: 40, options: ["Professional", "Friendly", "Persuasive", "Formal", "Apologetic", "Concise"] },
    ],
    seo: { title: "Free AI Email Writer", description: "Write professional emails in seconds. Free AI email writer that gives you a subject line and a ready-to-send email in the tone you choose." },
  },
  {
    slug: "growthmind-lite",
    name: "GrowthMind Lite",
    tagline: "Five practical growth ideas for your business.",
    description: "Share your business type, your goal and your favourite marketing channel. Get five short, actionable ideas you can start this week.",
    icon: "growth",
    returns: "5 growth ideas",
    fields: [
      { name: "businessType", label: "Type of business", type: "text", required: true, maxLength: 120, placeholder: "e.g. Organic bakery in Bengaluru" },
      { name: "goal", label: "Main business goal", type: "text", required: true, maxLength: 160, placeholder: "e.g. Get 50 more weekly orders" },
      {
        name: "channel",
        label: "Preferred marketing channel",
        type: "select",
        required: true,
        maxLength: 40,
        options: ["Instagram", "WhatsApp", "Google Search & Maps", "Email", "LinkedIn", "Facebook", "YouTube", "Website & SEO", "Offline & partnerships"],
      },
    ],
    seo: { title: "GrowthMind Lite — Free AI Business Growth Ideas", description: "Free AI growth ideas tool: enter your business type, goal and marketing channel to get five short, actionable growth ideas." },
  },
  {
    slug: "bio-generator",
    name: "AI Bio Generator",
    tagline: "Three creative bios that sound like you.",
    description: "Enter your profession or business, a few keywords and the platform. Get three bio options in different styles, sized for that platform.",
    icon: "bio",
    returns: "3 bio options",
    fields: [
      { name: "profession", label: "Profession or business", type: "text", required: true, maxLength: 120, placeholder: "e.g. Interior designer for small apartments" },
      { name: "keywords", label: "Keywords", type: "text", required: false, maxLength: 200, placeholder: "e.g. sustainable, budget-friendly, Mumbai", hint: "Optional. Separate with commas." },
      { name: "platform", label: "Platform", type: "select", required: true, maxLength: 40, options: ["Instagram", "LinkedIn", "X (Twitter)", "Facebook", "YouTube", "Threads", "Website / About page"] },
    ],
    seo: { title: "Free AI Bio Generator", description: "Free AI bio generator for Instagram, LinkedIn, X and your website. Get three creative bio options sized for your platform." },
  },
  {
    slug: "seo-generator",
    name: "SEO Generator",
    tagline: "SEO titles, meta descriptions and keyword ideas.",
    description: "Describe your website, page or product and your target keyword. Get three SEO titles, three meta descriptions and related keyword ideas.",
    icon: "seo",
    returns: "Titles, metas + keywords",
    fields: [
      {
        name: "description",
        label: "Website, page or product description",
        type: "textarea",
        required: true,
        maxLength: 600,
        placeholder: "e.g. Cloud accounting software for Indian small businesses with GST invoicing and bank reconciliation",
      },
      { name: "keyword", label: "Target keyword", type: "text", required: true, maxLength: 80, placeholder: "e.g. GST accounting software" },
    ],
    seo: { title: "Free AI SEO Title & Meta Description Generator", description: "Free AI SEO generator: get three SEO titles, three meta descriptions and related keyword ideas for any page or product." },
  },
];

export const getTool = (slug: string) => aiTools.find((t) => t.slug === slug);
export const toolPath = (slug: string) => `/ai-tools/${slug}`;
