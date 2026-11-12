"use client";

import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { InsightMeta } from "@/lib/content";
import { InsightCard } from "./Cards";
import { cn } from "@/lib/utils";

export function InsightsExplorer({ articles, categories }: { articles: InsightMeta[]; categories: readonly string[] }) {
  const [category, setCategory] = useState<string>("All");
  const [query, setQuery] = useState("");


  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      if (category !== "All" && a.category !== category) return false;
      if (!q) return true;
      return [a.title, a.description, a.category, ...a.tags].join(" ").toLowerCase().includes(q);
    });
  }, [articles, category, query]);

  const featured = category === "All" && !query ? filtered.find((a) => a.featured) : undefined;
  const rest = featured ? filtered.filter((a) => a.slug !== featured.slug) : filtered;

  return (
    <div>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter by category" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
          {["All", ...categories].map((c) => {
            return (
              <button
                key={c}
                type="button"
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
                className={cn(
                  "shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                  category === c ? "border-accent/60 bg-accent/15 text-fg" : "border-line-strong text-body hover:text-fg",
                )}
              >
                {c}
              </button>
            );
          })}
        </div>
        <div className="relative w-full lg:max-w-xs">
          <label htmlFor="insight-search" className="sr-only">
            Search insights
          </label>
          <Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input
            id="insight-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles…"
            className="w-full rounded-full border border-line-strong bg-card py-2.5 pl-11 pr-10 text-sm text-fg placeholder:text-muted/70 focus:border-accent focus:outline-none"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted hover:text-fg">
              <X aria-hidden className="size-4" />
            </button>
          )}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {filtered.length} article{filtered.length === 1 ? "" : "s"} found
      </p>

      {featured && (
        <div className="mt-10">
          <InsightCard article={featured} featured />
        </div>
      )}

      {rest.length > 0 ? (
        <ul className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((a) => (
            <li key={a.slug}>
              <InsightCard article={a} />
            </li>
          ))}
        </ul>
      ) : (
        !featured && (
          <div className="mt-10 rounded-3xl border border-dashed border-line-strong p-12 text-center">
            <p className="font-display text-lg text-fg">{query ? "No articles match your search." : "New articles in this category are coming soon."}</p>
            <p className="mt-2 text-sm text-muted">{query ? "Try a different keyword or category." : "Subscribe below to be notified when they’re published."}</p>
          </div>
        )
      )}
    </div>
  );
}
