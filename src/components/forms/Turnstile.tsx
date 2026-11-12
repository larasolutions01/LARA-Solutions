"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      remove: (id: string) => void;
    };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

/** Optional Cloudflare Turnstile widget. Renders nothing unless a site key is configured. */
export function Turnstile({ onToken, theme = "dark" }: { onToken: (token: string | undefined) => void; theme?: "dark" | "light" | "auto" }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!SITE_KEY || !ref.current) return;
    let widgetId: string | undefined;
    let cancelled = false;

    const render = () => {
      if (cancelled || !ref.current || !window.turnstile) return;
      widgetId = window.turnstile.render(ref.current, {
        sitekey: SITE_KEY,
        theme,
        callback: (t: string) => onToken(t),
        "expired-callback": () => onToken(undefined),
        "error-callback": () => onToken(undefined),
      });
    };

    if (window.turnstile) render();
    else {
      let script = document.querySelector<HTMLScriptElement>(`script[src="${SRC}"]`);
      if (!script) {
        script = document.createElement("script");
        script.src = SRC;
        script.async = true;
        document.head.appendChild(script);
      }
      script.addEventListener("load", render);
    }
    return () => {
      cancelled = true;
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [onToken, theme]);

  if (!SITE_KEY) return null;
  return <div ref={ref} className="min-h-[65px]" />;
}
