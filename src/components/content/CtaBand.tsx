import type { PhotoKey } from "@/content/media";
import { ButtonLink, ExternalButtonLink } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Interactive";
import { Reveal } from "@/components/ui/Reveal";
import { RevealImage } from "@/components/ui/RevealImage";
import { site } from "@/content/site";

/** Cinematic closing call-to-action with photographic background. */
export function CtaBand({
  title = "Let’s Build a Smarter Future for Your Business.",
  body = "Tell us where your business wants to go. We’ll help identify how AI, digital strategy and intelligent systems can get you there.",
  primaryLabel = "Request a Consultation",
  primaryHref = "/contact",
  photo = "city-dusk",
}: {
  title?: string;
  body?: string;
  primaryLabel?: string;
  primaryHref?: string;
  photo?: PhotoKey;
}) {
  return (
    <section aria-labelledby="cta-title" className="theme-light section-theme py-16 sm:py-24">
      <div className="container-x">
        <div className="theme-dark relative isolate overflow-hidden rounded-[2.25rem] px-6 py-20 text-center sm:px-16 sm:py-28">
          <RevealImage photo={photo} className="absolute inset-0 -z-20" rounded="rounded-none" sizes="(min-width: 1320px) 1320px, 100vw" parallax={50} />
          <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(8_20_39/0.55),rgb(8_20_39/0.85))]" />
          <div aria-hidden className="absolute left-1/2 top-0 -z-10 h-72 w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/50 blur-[110px]" />
          <Reveal className="relative mx-auto max-w-3xl">
            <h2 id="cta-title" className="text-4xl font-semibold leading-[1.03] text-white sm:text-5xl lg:text-6xl">
              {title}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/85">{body}</p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Magnetic>
                <ButtonLink href={primaryHref} size="lg" arrow>
                  {primaryLabel}
                </ButtonLink>
              </Magnetic>
              {site.contact.bookingUrl ? (
                <ExternalButtonLink href={site.contact.bookingUrl} size="lg" variant="glass">
                  Book a Discovery Call
                </ExternalButtonLink>
              ) : (
                <ButtonLink href="/opportunity-finder" size="lg" variant="glass">
                  Discover Your AI Advantage
                </ButtonLink>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
