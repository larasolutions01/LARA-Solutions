import type { ServiceIcon as IconName } from "@/content/services";
import { cn } from "@/lib/utils";

/** Custom line icons built from the logo's connected-node language. */
export function ServiceIcon({ name, className }: { name: IconName; className?: string }) {
  const id = `si-${name}`;
  const stroke = `url(#${id})`;
  const common = { fill: "none", stroke, strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={cn("size-12", className)}>
      <defs>
        <linearGradient id={id} x1="4" y1="44" x2="44" y2="4" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2864FF" />
          <stop offset="0.55" stopColor="#00C9E8" />
          <stop offset="1" stopColor="#12D6B0" />
        </linearGradient>
      </defs>
      {name === "automation" && (
        <g {...common}>
          <path d="M34.5 13.5A14 14 0 0 0 11 18" />
          <path d="M13.5 34.5A14 14 0 0 0 37 30" />
          <path d="M11 12v6h6M37 36v-6h-6" />
          <circle cx="24" cy="24" r="4.5" />
          <circle cx="24" cy="24" r="1.2" fill="#00C9E8" stroke="none" />
        </g>
      )}
      {name === "growth" && (
        <g {...common}>
          <path d="M8 38h32" />
          <path d="M12 38V29M20 38V25M28 38V21" opacity="0.55" />
          <path d="M10 26 20 18l7 5 12-12" />
          <path d="M32 11h7v7" />
          <circle cx="20" cy="18" r="2" />
          <circle cx="27" cy="23" r="2" />
        </g>
      )}
      {name === "supply" && (
        <g {...common}>
          <rect x="6" y="8" width="11" height="11" rx="2.5" />
          <rect x="31" y="8" width="11" height="11" rx="2.5" />
          <rect x="18.5" y="29" width="11" height="11" rx="2.5" />
          <path d="M17 13.5h14M11.5 19v6a4 4 0 0 0 4 4h3M36.5 19v6a4 4 0 0 1-4 4h-3" />
          <circle cx="24" cy="13.5" r="1.6" fill="#00C9E8" stroke="none" />
        </g>
      )}
      {name === "analytics" && (
        <g {...common}>
          <rect x="6" y="6" width="36" height="36" rx="6" opacity="0.5" />
          <path d="M12 32l7-8 6 5 11-13" />
          <circle cx="19" cy="24" r="2" />
          <circle cx="25" cy="29" r="2" />
          <circle cx="36" cy="16" r="2.4" />
          <path d="M12 37h6M22 37h4" opacity="0.6" />
        </g>
      )}
      {name === "process" && (
        <g {...common}>
          <circle cx="10" cy="12" r="4" />
          <path d="M24 6.5 30 12l-6 5.5L18 12z" />
          <circle cx="38" cy="12" r="4" />
          <path d="M14 12h4M30 12h4M38 16v8a4 4 0 0 1-4 4H14a4 4 0 0 0-4 4v2" />
          <rect x="6" y="36" width="12" height="6" rx="3" />
          <path d="M22 39h20" opacity="0.55" />
        </g>
      )}
      {name === "platform" && (
        <g {...common}>
          <path d="M24 6 42 15 24 24 6 15z" />
          <path d="M6 24l18 9 18-9" opacity="0.75" />
          <path d="M6 33l18 9 18-9" opacity="0.5" />
          <circle cx="24" cy="15" r="2" fill="#12D6B0" stroke="none" />
        </g>
      )}
      {name === "code" && (
        <g {...common}>
          <rect x="5" y="9" width="38" height="28" rx="5" />
          <path d="M5 16h38" opacity="0.6" />
          <path d="M19 23l-5 4 5 4M29 23l5 4-5 4M26 21l-4 12" />
          <path d="M16 42h16" opacity="0.6" />
        </g>
      )}
      {name === "integration" && (
        <g {...common}>
          <circle cx="12" cy="12" r="5" />
          <circle cx="36" cy="12" r="5" />
          <circle cx="12" cy="36" r="5" />
          <circle cx="36" cy="36" r="5" />
          <rect x="19" y="19" width="10" height="10" rx="3" />
          <path d="M16 16l3 3M32 16l-3 3M16 32l3-3M32 32l-3-3" />
        </g>
      )}
      {name === "strategy" && (
        <g {...common}>
          <circle cx="24" cy="24" r="17" opacity="0.5" />
          <circle cx="24" cy="24" r="10" />
          <circle cx="24" cy="24" r="3" fill="#12D6B0" stroke="none" />
          <path d="M24 3v8M24 37v8M3 24h8M37 24h8" opacity="0.7" />
          <path d="M33 15l7-7" />
        </g>
      )}
    </svg>
  );
}
