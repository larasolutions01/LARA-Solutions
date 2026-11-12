"use client";

import { Check, Link2, Mail } from "lucide-react";
import { useState } from "react";
import { LinkedInIcon } from "@/components/ui/SocialIcons";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const cls = "inline-flex size-10 items-center justify-center rounded-full border border-line-strong text-muted transition-colors hover:border-accent hover:text-fg";

  return (
    <div className="flex items-center gap-2" role="group" aria-label="Share this article">
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${u}`} target="_blank" rel="noopener noreferrer" className={cls} aria-label="Share on LinkedIn">
        <LinkedInIcon className="size-4" />
      </a>
      <a href={`https://x.com/intent/post?url=${u}&text=${t}`} target="_blank" rel="noopener noreferrer" className={cls} aria-label="Share on X">
        <svg viewBox="0 0 24 24" aria-hidden className="size-4" fill="currentColor">
          <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23zm-1.16 17.52h1.83L7.08 4.13H5.12z" />
        </svg>
      </a>
      <a href={`mailto:?subject=${t}&body=${u}`} className={cls} aria-label="Share by email">
        <Mail aria-hidden className="size-4" />
      </a>
      <button
        type="button"
        className={cls}
        aria-label={copied ? "Link copied" : "Copy link"}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch {
            /* clipboard unavailable */
          }
        }}
      >
        {copied ? <Check aria-hidden className="size-4 text-success" /> : <Link2 aria-hidden className="size-4" />}
      </button>
    </div>
  );
}
