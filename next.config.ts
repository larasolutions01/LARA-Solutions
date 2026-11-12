import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  // Standalone output is for the Docker image; Netlify's Next.js adapter
  // manages its own build output, so leave it unset there.
  output: process.env.NETLIFY ? undefined : "standalone",
  poweredByHeader: false,
  // Markdown CMS content is read from disk at build/runtime
  outputFileTracingIncludes: { "/**": ["./content/**/*"] },
  reactStrictMode: true,
  images: { formats: ["image/avif", "image/webp"] },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Admin inbox: never cached, never indexed. (Every admin page, route and
      // action verifies the signed session itself — no middleware needed.)
      {
        source: "/admin/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      { source: "/admin", headers: [{ key: "Cache-Control", value: "no-store" }, { key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
  async redirects() {
    // Decap CMS editor UI lives in /public/cms (the /admin route is the secure
    // lead inbox). A redirect, not a rewrite: Netlify can't rewrite to files
    // in /public.
    return [{ source: "/cms", destination: "/cms/index.html", permanent: false }];
  },
};

export default nextConfig;
