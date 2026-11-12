import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SkipLink } from "@/components/layout/SkipLink";
import { ButtonLink } from "@/components/ui/Button";
import { services, servicePath } from "@/content/services";

export const metadata = { title: "Page not found", robots: { index: false } };

/** Global 404 (outside the route groups), so it brings its own website chrome. */
export default function NotFound() {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
    <section className="theme-dark section-theme relative isolate flex min-h-[85vh] items-center overflow-hidden pt-28">
      <div aria-hidden className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      <div aria-hidden className="absolute left-1/2 top-1/2 -z-10 size-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-[120px]" />
      <div className="container-x text-center">
        <svg viewBox="0 0 220 90" className="mx-auto w-64" aria-hidden>
          <defs>
            <linearGradient id="nf" x1="0" x2="1">
              <stop stopColor="#2864FF" />
              <stop offset="1" stopColor="#12D6B0" />
            </linearGradient>
          </defs>
          <path d="M20 70 L70 25 L110 55" fill="none" stroke="url(#nf)" strokeWidth="2" />
          <path d="M110 55 L150 30" fill="none" stroke="url(#nf)" strokeWidth="2" strokeDasharray="4 6" opacity="0.5" />
          <circle cx="20" cy="70" r="6" fill="#2864FF" />
          <circle cx="70" cy="25" r="6" fill="#00C9E8" />
          <circle cx="110" cy="55" r="6" fill="#00C9E8" />
          <circle cx="150" cy="30" r="7" fill="none" stroke="#12D6B0" strokeDasharray="3 3" />
          <text x="185" y="40" fill="#2864FF" fontSize="22" fontFamily="var(--font-space-grotesk)">?</text>
        </svg>
        <p className="eyebrow mt-8">Error 404</p>
        <h1 className="mt-4 text-5xl font-semibold text-fg sm:text-6xl">This connection doesn’t exist.</h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted">The page you’re looking for may have moved or never existed. Let’s get you back on a productive path.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/" arrow>
            Back to home
          </ButtonLink>
          <ButtonLink href="/contact" variant="secondary">
            Contact us
          </ButtonLink>
        </div>
        <nav aria-label="Popular pages" className="mt-14">
          <p className="text-sm text-muted">Popular solutions</p>
          <ul className="mt-4 flex flex-wrap justify-center gap-2">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={servicePath(s.slug)} className="inline-block rounded-full border border-line-strong px-3.5 py-1.5 text-sm text-body hover:border-accent hover:text-fg">
                  {s.shortName}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
      </main>
      <Footer />
    </>
  );
}
