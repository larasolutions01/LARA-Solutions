import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { Providers } from "@/components/layout/Providers";
import { ConsentManager } from "@/components/layout/ConsentManager";
import { AttributionTracker } from "@/components/layout/AttributionTracker";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap" });
const sans = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
const bingVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Intelligence That Drives Growth`,
    template: `%s | ${site.name}`,
  },
  description: site.metaDescription,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_GB",
    url: "/",
    title: `${site.name} — Intelligence That Drives Growth`,
    description: site.metaDescription,
  },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: [{ url: "/brand/lara-favicon-64.png", sizes: "64x64", type: "image/png" }, { url: "/brand/lara-icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/brand/lara-apple-icon.png", sizes: "180x180" }],
  },
  verification:
    googleVerification || bingVerification
      ? {
          ...(googleVerification ? { google: googleVerification } : {}),
          ...(bingVerification ? { other: { "msvalidate.01": bingVerification } } : {}),
        }
      : undefined,
};

export const viewport: Viewport = {
  themeColor: "#081427",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

/**
 * Without JavaScript (and for non-rendering crawlers), entrance animations
 * never run — reveal their content immediately so nothing stays hidden.
 */
const noScriptReveal = `[style*="opacity:0"]{opacity:1!important}[style*="translateY("]{transform:none!important}[style*="clip-path:inset("]{clip-path:none!important}[style*="filter:blur("]{filter:none!important}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} theme-light`}>
      <head>
        <noscript>
          <style dangerouslySetInnerHTML={{ __html: noScriptReveal }} />
        </noscript>
      </head>
      <body className="min-h-dvh overflow-x-hidden">
        {/* Website chrome lives in app/(site)/layout.tsx; the LARA AI app has its own in app/lara-ai/layout.tsx. */}
        <Providers>
          {children}
          <ConsentManager />
          <AttributionTracker />
        </Providers>
      </body>
    </html>
  );
}
