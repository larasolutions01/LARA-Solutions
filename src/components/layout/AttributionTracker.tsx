"use client";

import { useEffect } from "react";
import { captureAttribution, track } from "@/lib/analytics";

/**
 * Records first-touch attribution for the session (incl. visits referred by
 * AI assistants such as ChatGPT or Perplexity) so enquiries can be attributed,
 * and sends an `ai_referral` analytics event when consent allows.
 */
export function AttributionTracker() {
  useEffect(() => {
    const a = captureAttribution();
    if (a?.aiSource) {
      // Delay slightly so the consented analytics tag (if any) has loaded.
      const t = window.setTimeout(() => track("ai_referral", { ai_source: a.aiSource, landing_page: a.landingPage }), 2500);
      return () => window.clearTimeout(t);
    }
  }, []);
  return null;
}
