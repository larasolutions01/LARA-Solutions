import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "glass" | "sunrise" | "white";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold font-display tracking-tight transition-[transform,box-shadow,background-color,border-color,color] duration-300 ease-[var(--ease-out-expo)] focus-visible:outline-offset-4 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60 whitespace-nowrap";

/** Sheen that sweeps across filled buttons on hover. */
const sheen =
  "before:absolute before:inset-0 before:-z-10 before:-translate-x-full before:bg-[linear-gradient(110deg,transparent_25%,rgb(255_255_255/0.28)_50%,transparent_75%)] before:transition-transform before:duration-700 hover:before:translate-x-full";

const variants: Record<Variant, string> = {
  primary: `bg-electric text-white shadow-[0_10px_30px_-10px_rgb(40_100_255/0.7)] hover:bg-electric-deep hover:shadow-[0_16px_44px_-12px_rgb(40_100_255/0.85)] hover:-translate-y-0.5 ${sheen}`,
  sunrise: `bg-sunrise text-ink shadow-[0_10px_30px_-12px_rgb(255_173_85/0.8)] hover:bg-[#ffbd73] hover:-translate-y-0.5 ${sheen}`,
  white: `bg-white text-ink shadow-[0_10px_30px_-12px_rgb(8_20_39/0.4)] hover:-translate-y-0.5 ${sheen}`,
  secondary: "border border-line-strong bg-card text-fg hover:border-accent hover:bg-card-hover",
  glass: "glass text-white hover:bg-white/15",
  ghost: "text-fg hover:text-accent",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[0.95rem]",
  lg: "h-13 px-7 text-base",
};

export function buttonClasses({ variant = "primary", size = "md", className }: { variant?: Variant; size?: Size; className?: string }) {
  return cn(base, variants[variant], sizes[size], className);
}

function Arrow() {
  return <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />;
}

export function ButtonLink({
  href,
  children,
  variant,
  size,
  className,
  arrow = false,
  ...rest
}: { href: string; children: ReactNode; variant?: Variant; size?: Size; className?: string; arrow?: boolean } & Omit<ComponentProps<typeof Link>, "href" | "className">) {
  return (
    <Link href={href} className={buttonClasses({ variant, size, className })} {...rest}>
      {children}
      {arrow && <Arrow />}
    </Link>
  );
}

export function ExternalButtonLink({
  href,
  children,
  variant,
  size,
  className,
  arrow,
}: { href: string; children: ReactNode; variant?: Variant; size?: Size; className?: string; arrow?: boolean }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={buttonClasses({ variant, size, className })}>
      {children}
      {arrow && <Arrow />}
    </a>
  );
}

export function Button({
  children,
  variant,
  size,
  className,
  arrow,
  ...rest
}: { variant?: Variant; size?: Size; arrow?: boolean } & ComponentProps<"button">) {
  return (
    <button className={buttonClasses({ variant, size, className })} {...rest}>
      {children}
      {arrow && <Arrow />}
    </button>
  );
}
