import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { z } from "zod";

/**
 * File-based CMS. Articles and case studies live as Markdown files in
 * /content and can be edited via the Decap CMS admin at /admin (see README)
 * or directly in Git. Frontmatter is validated so a bad edit fails the build
 * loudly instead of breaking pages silently.
 */

const CONTENT_DIR = path.join(process.cwd(), "content");

export const insightCategories = [
  "AI & Automation",
  "Business Growth",
  "Marketing Intelligence",
  "Supply Chain Innovation",
  "Digital Transformation",
  "Data & Analytics",
  "AI for SMEs",
] as const;

const dateString = z.union([z.string(), z.date()]).transform((v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v));

const insightSchema = z.object({
  title: z.string().min(5),
  /** Optional shorter title for search results (aim for ≤ 60 characters). */
  seoTitle: z.string().max(70).optional(),
  description: z.string().min(20).max(320),
  category: z.enum(insightCategories),
  author: z.string().default("LARA Solutions Editorial Team"),
  authorRole: z.string().optional(),
  date: dateString,
  updated: dateString.optional(),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  /** Key from src/content/media.ts (photos) or a /public path. */
  image: z.string().optional(),
  /** Service slugs this article supports (falls back to a category mapping). */
  services: z.array(z.string()).default([]),
  /** Short, visible summary bullets shown at the top of the article. */
  keyTakeaways: z.array(z.string()).default([]),
  /** Sources actually consulted — shown visibly. Never invent a source. */
  sources: z.array(z.object({ title: z.string().min(3), url: z.string().url(), publisher: z.string().optional() })).default([]),
});

/** Default service links per category, used when an article sets no `services`. */
export const categoryServices: Record<(typeof insightCategories)[number], string[]> = {
  "AI & Automation": ["ai-automation"],
  "AI for SMEs": ["ai-automation", "strategy-consulting"],
  "Business Growth": ["digital-marketing", "strategy-consulting"],
  "Marketing Intelligence": ["digital-marketing"],
  "Supply Chain Innovation": ["supply-chain-intelligence"],
  "Digital Transformation": ["digital-transformation"],
  "Data & Analytics": ["data-analytics"],
};

export type InsightMeta = z.output<typeof insightSchema> & { slug: string; readingTime: number };
export type Insight = InsightMeta & { html: string };

const caseStudySchema = z.object({
  title: z.string().min(5),
  summary: z.string().min(20),
  /** "client" entries must also set approved: true to be published. */
  type: z.enum(["illustrative", "client"]),
  approved: z.boolean().default(false),
  client: z.string().optional(),
  industry: z.string(),
  category: z.string(),
  challenge: z.string(),
  solution: z.string(),
  technology: z.array(z.string()).default([]),
  approach: z.array(z.string()).default([]),
  results: z.string(),
  insights: z.array(z.string()).default([]),
  date: dateString,
  order: z.number().default(100),
  /** Key from src/content/media.ts (photos) or a /public path. */
  cover: z.string().optional(),
  /** Service slugs this scenario illustrates — linked from the page. */
  services: z.array(z.string()).default([]),
});

export type CaseStudyMeta = z.output<typeof caseStudySchema> & { slug: string };
export type CaseStudy = CaseStudyMeta & { html: string };

function readingTime(text: string) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

async function readCollection(dir: string) {
  const full = path.join(CONTENT_DIR, dir);
  let files: string[] = [];
  try {
    files = (await fs.readdir(full)).filter((f) => f.endsWith(".md"));
  } catch {
    return [];
  }
  return Promise.all(
    files.map(async (file) => {
      const raw = await fs.readFile(path.join(full, file), "utf8");
      const { data, content } = matter(raw);
      return { slug: file.replace(/\.md$/, ""), data, content, file };
    }),
  );
}

function parseOrThrow<T extends z.ZodTypeAny>(schema: T, data: unknown, file: string): z.output<T> {
  const r = schema.safeParse(data);
  if (!r.success) throw new Error(`Invalid frontmatter in content/${file}: ${r.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`);
  return r.data;
}

const render = (md: string) => marked.parse(md, { async: false, gfm: true }) as string;

export async function getInsights(): Promise<Insight[]> {
  const items = await readCollection("insights");
  return items
    .map(({ slug, data, content, file }) => {
      const meta = parseOrThrow(insightSchema, data, `insights/${file}`);
      return { ...meta, slug, readingTime: readingTime(content), html: render(content) };
    })
    .filter((a) => !a.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getInsight(slug: string) {
  return (await getInsights()).find((a) => a.slug === slug);
}

export function relatedInsights(all: InsightMeta[], current: InsightMeta, n = 3) {
  return all
    .filter((a) => a.slug !== current.slug)
    .map((a) => ({ a, score: (a.category === current.category ? 2 : 0) + a.tags.filter((t) => current.tags.includes(t)).length }))
    .sort((x, y) => y.score - x.score)
    .slice(0, n)
    .map((x) => x.a);
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  const items = await readCollection("case-studies");
  return items
    .map(({ slug, data, content, file }) => ({ ...parseOrThrow(caseStudySchema, data, `case-studies/${file}`), slug, html: render(content) }))
    // Real client projects are only published once validated and approved.
    .filter((c) => c.type === "illustrative" || c.approved)
    .sort((a, b) => a.order - b.order);
}

export async function getCaseStudy(slug: string) {
  return (await getCaseStudies()).find((c) => c.slug === slug);
}
