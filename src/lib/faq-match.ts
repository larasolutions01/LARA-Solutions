import { faq, type FaqEntry } from "@/content/faq";

/**
 * Deterministic FAQ matcher for the website assistant.
 * Scores entries by keyword overlap (multi-word keywords count double).
 * Returns null when nothing is a reasonable match, so the assistant can
 * honestly say it doesn't know and offer a human follow-up.
 */

const STOP = new Set(["the", "a", "an", "is", "are", "you", "your", "we", "our", "i", "to", "of", "and", "or", "for", "in", "on", "can", "with", "it", "me", "my", "do", "does"]);

export function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP.has(t));
}

export function matchFaq(query: string, entries: FaqEntry[] = faq): { entry: FaqEntry; score: number } | null {
  const q = query.toLowerCase();
  const tokens = new Set(tokenize(query));
  if (tokens.size === 0) return null;

  let best: { entry: FaqEntry; score: number } | null = null;
  for (const entry of entries) {
    let score = 0;
    for (const kw of entry.keywords) {
      const k = kw.toLowerCase();
      if (k.includes(" ")) {
        if (q.includes(k)) score += 2;
      } else if (tokens.has(k) || (k.length > 4 && [...tokens].some((t) => t.startsWith(k) || (t.length > 4 && k.startsWith(t))))) {
        score += 1;
      }
    }
    if (score > 0 && (!best || score > best.score)) best = { entry, score };
  }
  return best;
}
