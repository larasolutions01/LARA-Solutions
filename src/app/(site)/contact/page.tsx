import { CalendarDays, Mail, MessageSquareText, Phone, MapPin } from "lucide-react";
import { site, whatsappLink } from "@/content/site";
import { PageHero } from "@/components/ui/PageHero";
import { JsonLd, Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/forms/ContactForm";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { buttonClasses } from "@/components/ui/Button";
import { pageMetadata, webPageJsonLd } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact — Let’s Talk Growth",
  description:
    "Book a discovery call or request a consultation with LARA Solutions on AI, automation, digital marketing, supply chain and analytics.",
  path: "/contact",
});

const steps = [
  { title: "We review your enquiry", body: "A member of our team reads every submission personally." },
  { title: "Discovery conversation", body: "We learn about your goals, challenges and current setup." },
  { title: "Practical recommendations", body: "You receive suggested next steps and, if useful, a scoped proposal." },
];

export default async function ContactPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const service = typeof sp.service === "string" ? sp.service : "";
  const industry = typeof sp.industry === "string" ? sp.industry : "";
  const { email, phone, whatsapp, bookingUrl, address } = site.contact;

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let’s Build a Smarter Future for"
        gradientTitle="Your Business."
        intro="Tell us where your business wants to go. We’ll help identify how AI, digital strategy, and intelligent systems can get you there."
        photo="people-team"
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]}
      >
        <div className="flex flex-wrap gap-3">
          {bookingUrl ? (
            <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className={buttonClasses({ size: "lg" })}>
              <CalendarDays aria-hidden className="size-4" /> Book a Discovery Call
            </a>
          ) : (
            <a href="#enquiry" className={buttonClasses({ size: "lg" })}>
              <CalendarDays aria-hidden className="size-4" /> Book a Discovery Call
            </a>
          )}
          <a href="#enquiry" className={buttonClasses({ size: "lg", variant: "secondary" })}>
            Request a Consultation
          </a>
        </div>
      </PageHero>

      <Section id="enquiry" theme="sky" labelledBy="enquiry-title" className="py-16 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-12">
          <Reveal className="ring-gradient rounded-[2rem] bg-gradient-to-br from-section-tint to-section p-6 sm:p-10 lg:col-span-8">
            <h2 id="enquiry-title" className="text-2xl font-semibold text-fg sm:text-3xl">
              Start Your Transformation
            </h2>
            <p className="mt-2 text-muted">Share a few details and we’ll be in touch to arrange a conversation.</p>
            <div className="mt-8">
              <ContactForm defaultService={service} defaultIndustry={industry} />
            </div>
          </Reveal>

          <aside className="space-y-5 lg:col-span-4" aria-label="Other ways to reach us">
            <Reveal delay={0.1} className="rounded-3xl border border-line bg-card p-7">
              <h2 className="font-display text-lg font-semibold text-fg">What happens next</h2>
              <ol className="mt-5 space-y-5">
                {steps.map((s, i) => (
                  <li key={s.title} className="flex gap-4">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-line-strong font-display text-xs text-muted">{i + 1}</span>
                    <div>
                      <p className="font-medium text-fg">{s.title}</p>
                      <p className="mt-0.5 text-sm text-muted">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>

            {(email || phone || whatsapp || bookingUrl || address) && (
              <Reveal delay={0.15} className="rounded-3xl border border-line bg-card p-7">
                <h2 className="font-display text-lg font-semibold text-fg">Reach us directly</h2>
                <ul className="mt-5 space-y-4 text-sm">
                  {bookingUrl && (
                    <li>
                      <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-body hover:text-fg">
                        <CalendarDays aria-hidden className="size-4 text-muted" /> Schedule a meeting
                      </a>
                    </li>
                  )}
                  {email && (
                    <li>
                      <a href={`mailto:${email}`} className="flex items-center gap-3 text-body hover:text-fg">
                        <Mail aria-hidden className="size-4 text-muted" /> {email}
                      </a>
                    </li>
                  )}
                  {phone && (
                    <li>
                      <a href={`tel:${phone.replace(/\s/g, "")}`} className="flex items-center gap-3 text-body hover:text-fg">
                        <Phone aria-hidden className="size-4 text-muted" /> {phone}
                      </a>
                    </li>
                  )}
                  {whatsapp && (
                    <li>
                      <a href={whatsappLink(whatsapp)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-body hover:text-fg">
                        <WhatsAppIcon className="size-4 text-muted" /> Chat on WhatsApp
                      </a>
                    </li>
                  )}
                  {address && (
                    <li className="flex items-start gap-3 text-body">
                      <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-muted" /> {address}
                    </li>
                  )}
                </ul>
              </Reveal>
            )}

            <Reveal delay={0.2} className="rounded-3xl border border-line bg-card p-7">
              <MessageSquareText aria-hidden className="size-5 text-muted" />
              <p className="mt-4 font-medium text-fg">Wherever you’re based</p>
              <p className="mt-1 text-sm text-muted">Include your country or region so we can confirm how we can support you and suggest suitable meeting times.</p>
            </Reveal>
          </aside>
        </div>
      </Section>
      <JsonLd data={webPageJsonLd({ type: "ContactPage", path: "/contact", name: "Contact LARA Solutions", description: "Request a consultation with LARA Solutions about AI, automation, digital marketing, supply chain intelligence and analytics." })} />
    </>
  );
}
