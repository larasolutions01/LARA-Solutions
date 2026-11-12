/**
 * Consent-aware analytics events (GA4 / GTM).
 *
 * Events are only sent when an analytics tag is present — which only happens
 * after the visitor accepts analytics in the consent banner. Without consent
 * these calls are no-ops.
 */

type Params = Record<string, string | number | boolean | undefined>;

export function track(event: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  const w = window as Window & { gtag?: (...args: unknown[]) => void; dataLayer?: unknown[] };
  if (typeof w.gtag === "function") w.gtag("event", event, params);
  else if (Array.isArray(w.dataLayer)) w.dataLayer.push({ event, ...params });
}

/** Known AI assistant / AI search referrer hosts → readable source name. */
export const AI_REFERRERS: { pattern: RegExp; source: string }[] = [
  { pattern: /(^|\.)chatgpt\.com$|(^|\.)chat\.openai\.com$/, source: "ChatGPT" },
  { pattern: /(^|\.)perplexity\.ai$/, source: "Perplexity" },
  { pattern: /(^|\.)copilot\.microsoft\.com$/, source: "Microsoft Copilot" },
  { pattern: /(^|\.)gemini\.google\.com$/, source: "Gemini" },
  { pattern: /(^|\.)claude\.ai$/, source: "Claude" },
  { pattern: /(^|\.)you\.com$/, source: "You.com" },
  { pattern: /(^|\.)phind\.com$/, source: "Phind" },
];

export function classifyAiReferrer(referrer: string): string | undefined {
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    return AI_REFERRERS.find((r) => r.pattern.test(host))?.source;
  } catch {
    return undefined;
  }
}

export interface Attribution {
  landingPage?: string;
  referrer?: string;
  aiSource?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

const KEY = "lara-attribution";

/** First-touch attribution for this browser session (sessionStorage only). */
export function readAttribution(): Attribution | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Attribution) : undefined;
  } catch {
    return undefined;
  }
}

export function captureAttribution(): Attribution | undefined {
  if (typeof window === "undefined") return undefined;
  const existing = readAttribution();
  if (existing) return existing;
  const params = new URLSearchParams(window.location.search);
  const referrer = document.referrer && !document.referrer.startsWith(window.location.origin) ? document.referrer : undefined;
  const utmSource = params.get("utm_source") ?? undefined;
  const aiSource = (referrer && classifyAiReferrer(referrer)) || (utmSource && /chatgpt|openai|perplexity|copilot|gemini|claude/i.test(utmSource) ? utmSource : undefined);
  const a: Attribution = {
    landingPage: window.location.pathname,
    referrer: referrer?.slice(0, 300),
    aiSource,
    utmSource: utmSource?.slice(0, 100),
    utmMedium: params.get("utm_medium")?.slice(0, 100) ?? undefined,
    utmCampaign: params.get("utm_campaign")?.slice(0, 100) ?? undefined,
  };
  try {
    sessionStorage.setItem(KEY, JSON.stringify(a));
  } catch {
    /* storage unavailable */
  }
  return a;
}
