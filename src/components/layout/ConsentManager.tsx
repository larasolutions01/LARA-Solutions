"use client";

import Link from "next/link";
import Script from "next/script";
import { AnimatePresence, motion } from "motion/react";
import { Cookie } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

const GTM = process.env.NEXT_PUBLIC_GTM_ID;
const GA = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const KEY = "lara-analytics-consent";
type Choice = "granted" | "denied" | null;

/** Reopen the banner from anywhere (e.g. a footer "Cookie settings" link). */
export const OPEN_CONSENT_EVENT = "lara:open-consent";

/**
 * Consent-aware analytics. Nothing is loaded until the visitor opts in.
 * Renders nothing at all when no analytics IDs are configured.
 */
export function ConsentManager() {
  const [choice, setChoice] = useState<Choice>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!GTM && !GA) return;
    let stored: Choice = null;
    try {
      stored = (localStorage.getItem(KEY) as Choice) ?? null;
    } catch {
      /* storage unavailable */
    }
    setChoice(stored);
    setOpen(stored === null);
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  if (!GTM && !GA) return null;

  const decide = (c: Exclude<Choice, null>) => {
    setChoice(c);
    setOpen(false);
    try {
      localStorage.setItem(KEY, c);
    } catch {
      /* ignore */
    }
    const w = window as Window & { gtag?: (...args: unknown[]) => void };
    w.gtag?.("consent", "update", { analytics_storage: c, ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  };

  return (
    <>
      {choice === "granted" && GTM && (
        <Script id="gtm" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM}');`}
        </Script>
      )}
      {choice === "granted" && !GTM && GA && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA}',{anonymize_ip:true});`}
          </Script>
        </>
      )}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Analytics cookie preferences"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className="theme-light fixed bottom-4 left-4 right-24 z-[70] max-w-md rounded-2xl border border-line bg-white p-5 shadow-2xl sm:left-6 sm:right-auto"
          >
            <p className="flex items-center gap-2 font-display font-semibold text-fg">
              <Cookie aria-hidden className="size-4 text-electric" /> Your privacy, your choice
            </p>
            <p className="mt-2 text-sm leading-relaxed text-body">
              We’d like to use analytics cookies to understand how this site is used and improve it. Nothing is tracked unless you agree. See our{" "}
              <Link href="/privacy" className="text-accent underline">
                Privacy Policy
              </Link>
              .
            </p>
            <div className="mt-4 flex gap-2">
              <Button size="sm" onClick={() => decide("granted")}>
                Accept analytics
              </Button>
              <Button size="sm" variant="secondary" onClick={() => decide("denied")}>
                Decline
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
