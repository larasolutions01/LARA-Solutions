import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export type SectionTheme = "light" | "sky" | "dark" | "bright";

export const themeClass: Record<SectionTheme, string> = {
  light: "theme-light section-theme",
  sky: "theme-sky section-theme",
  dark: "theme-dark section-theme",
  bright: "theme-bright section-theme bg-brand",
};

export function Section({
  id,
  children,
  className,
  labelledBy,
  theme = "light",
  bare = false,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  labelledBy?: string;
  theme?: SectionTheme;
  /** Skip the inner container (for full-bleed layouts). */
  bare?: boolean;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn("relative py-24 sm:py-32", themeClass[theme], className)}>
      {bare ? children : <div className="container-x">{children}</div>}
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  index,
  title,
  description,
  id,
  align = "left",
  className,
}: {
  eyebrow: string;
  index?: string;
  title: ReactNode;
  description?: ReactNode;
  id?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <p className={cn("eyebrow flex items-center gap-3", align === "center" && "justify-center")}>
        {index && <span className="text-muted">{index}</span>}
        {index && <span aria-hidden className="h-px w-8 bg-gradient-to-r from-electric to-aqua" />}
        {eyebrow}
      </p>
      <h2 id={id} className="mt-5 text-4xl font-semibold leading-[1.02] text-fg sm:text-5xl lg:text-[3.6rem]">
        {title}
      </h2>
      {description && <p className="mt-6 text-lg leading-relaxed text-muted sm:text-xl">{description}</p>}
    </Reveal>
  );
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
