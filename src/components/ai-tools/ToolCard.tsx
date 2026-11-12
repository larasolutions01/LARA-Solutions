import Link from "next/link";
import { ArrowUpRight, Hash, Mail, Search, TrendingUp, UserRound, type LucideIcon } from "lucide-react";
import type { AiTool, ToolIcon as ToolIconName } from "@/lib/ai-tools/registry";
import { toolPath } from "@/lib/ai-tools/registry";
import { cn } from "@/lib/utils";

const icons: Record<ToolIconName, LucideIcon> = { caption: Hash, email: Mail, growth: TrendingUp, bio: UserRound, seo: Search };

export function ToolIcon({ name, className }: { name: ToolIconName; className?: string }) {
  const Icon = icons[name];
  return (
    <span className={cn("flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-electric via-[#3b7bff] to-aqua text-white shadow-[0_10px_30px_-12px_rgb(40_100_255/0.8)]", className)}>
      <Icon aria-hidden className="size-6" />
    </span>
  );
}

export function ToolCard({ tool, compact = false }: { tool: AiTool; compact?: boolean }) {
  return (
    <Link
      href={toolPath(tool.slug)}
      className={cn(
        "card-surface group relative flex h-full flex-col rounded-3xl transition-[transform,box-shadow] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgb(40_100_255/0.45)]",
        compact ? "p-5" : "p-7",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <ToolIcon name={tool.icon} className={compact ? "size-10 rounded-xl" : undefined} />
        <ArrowUpRight aria-hidden className="size-5 text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
      </div>
      <h3 className={cn("font-semibold text-fg", compact ? "mt-4 text-base" : "mt-6 text-xl")}>{tool.name}</h3>
      <p className={cn("mt-2 leading-relaxed text-body", compact ? "text-sm" : "")}>{tool.tagline}</p>
      {!compact && (
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-6 text-xs">
          <span className="rounded-full bg-section-tint px-2.5 py-1 font-medium text-fg">{tool.returns}</span>
          <span className="rounded-full bg-fresh/15 px-2.5 py-1 font-semibold text-[#0b8a73]">Free · No sign-up</span>
        </div>
      )}
    </Link>
  );
}
