import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { crawlerRules } from "@/lib/crawlers";

export default function robots(): MetadataRoute.Robots {
  const isProd = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : process.env.NODE_ENV === "production";
  if (!isProd || process.env.NEXT_PUBLIC_NOINDEX === "true") {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: crawlerRules(),
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
