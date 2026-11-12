import { z } from "zod";
import { matchFaq } from "@/lib/faq-match";
import { clientIp, createRateLimiter } from "@/lib/rate-limit";
import { aiAssistantEnabled, askAssistant } from "@/lib/server/assistant-ai";
import { AiToolError } from "@/lib/server/gemini";
import { usageGuard } from "@/lib/ai-tools/server/limits";
import { services, servicePath } from "@/content/services";
import { assistantEnabled } from "@/lib/features";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const limiter = createRateLimiter({ limit: 20, windowMs: 10 * 60 * 1000 });

const bodySchema = z.object({
  message: z.string().trim().min(1).max(500),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(2000) }))
    .max(12)
    .default([]),
});

export interface AssistantReply {
  mode: "ai" | "faq";
  answer: string;
  links: { label: string; href: string }[];
  offerLead: boolean;
}

const NO_ANSWER = "I don’t have an approved answer for that yet. Our team can help — would you like to leave your details so someone can reply personally?";

function faqReply(message: string): AssistantReply {
  const hit = matchFaq(message);
  return hit
    ? { mode: "faq", answer: hit.entry.answer, links: hit.entry.links ?? [], offerLead: true }
    : { mode: "faq", answer: NO_ANSWER, links: [], offerLead: true };
}

/** Deterministic, approved links to show beside an AI answer. */
function linksFor(message: string, answer: string) {
  const links = new Map<string, string>();
  for (const l of matchFaq(message)?.entry.links ?? []) links.set(l.href, l.label);
  for (const s of services) {
    const path = servicePath(s.slug);
    if (answer.includes(path) || answer.toLowerCase().includes(s.shortName.toLowerCase())) links.set(path, s.shortName);
  }
  if (answer.includes("/opportunity-finder")) links.set("/opportunity-finder", "AI Opportunity Finder");
  if (answer.includes("/contact")) links.set("/contact", "Contact us");
  return [...links].slice(0, 3).map(([href, label]) => ({ href, label }));
}

export async function POST(request: Request) {
  if (!assistantEnabled()) return Response.json({ error: "Not found" }, { status: 404 });
  const rl = limiter.check(clientIp(request.headers));
  if (!rl.allowed) {
    return Response.json({ error: "Too many questions — please try again shortly." }, { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } });
  }

  let parsed;
  try {
    parsed = bodySchema.safeParse(await request.json());
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!parsed.success) return Response.json({ error: "Invalid request." }, { status: 422 });
  const { message, history } = parsed.data;

  const noStore = { headers: { "Cache-Control": "no-store" } };
  if (!aiAssistantEnabled()) return Response.json(faqReply(message), noStore);

  // Shares the site-wide daily Gemini cap with the AI tools; past it, the FAQ answers.
  const guard = usageGuard();
  if (!guard.reserveSite()) return Response.json(faqReply(message), noStore);

  try {
    const result = await askAssistant(message, history);
    if (!result) return Response.json(faqReply(message), noStore);
    guard.record(result.usage);
    const reply: AssistantReply = { mode: "ai", answer: result.answer, links: linksFor(message, result.answer), offerLead: true };
    return Response.json(reply, noStore);
  } catch (error) {
    if (error instanceof AiToolError) {
      if (error.code === "quota") guard.exhaust();
      console.warn(`[assistant] Gemini ${error.code}; using FAQ fallback`);
    } else console.error("[assistant] unexpected error; using FAQ fallback", error);
    return Response.json(faqReply(message), noStore);
  }
}
