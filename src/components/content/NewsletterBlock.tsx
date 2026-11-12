import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { Reveal } from "@/components/ui/Reveal";

export function NewsletterBlock() {
  return (
    <section aria-labelledby="newsletter-label" className="theme-light section-theme py-16 sm:py-24">
      <div className="container-x">
        <Reveal className="theme-bright bg-brand relative grid gap-8 overflow-hidden rounded-[2rem] p-8 text-fg sm:p-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow">Newsletter</p>
            <h2 id="newsletter-label" className="mt-4 text-3xl font-semibold text-fg sm:text-4xl">
              Intelligence, delivered occasionally.
            </h2>
            <p className="mt-3 text-muted">Practical ideas on AI, automation and growth. No spam, unsubscribe anytime.</p>
          </div>
          <NewsletterForm />
        </Reveal>
      </div>
    </section>
  );
}
