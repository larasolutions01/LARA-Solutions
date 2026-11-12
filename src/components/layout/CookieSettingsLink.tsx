"use client";

import { OPEN_CONSENT_EVENT } from "./ConsentManager";

/** Footer link to reopen analytics preferences (only when analytics is configured). */
export function CookieSettingsLink() {
  if (!process.env.NEXT_PUBLIC_GTM_ID && !process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) return null;
  return (
    <li>
      <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))} className="hover:text-fg">
        Cookie settings
      </button>
    </li>
  );
}
