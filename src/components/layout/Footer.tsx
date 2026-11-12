import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { site, whatsappLink } from "@/content/site";
import { services, servicePath } from "@/content/services";
import { Logo } from "@/components/ui/Logo";
import { InstagramIcon, LinkedInIcon, WhatsAppIcon } from "@/components/ui/SocialIcons";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { CookieSettingsLink } from "./CookieSettingsLink";

const company = [
  { label: "About Us", href: "/about" },
  { label: "Industries", href: "/industries" },
  { label: "Our Work", href: "/work" },
  { label: "Insights", href: "/insights" },
  { label: "Free AI Tools", href: "/ai-tools" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  const year = new Date().getFullYear();
  const { email, phone, whatsapp } = site.contact;
  const { linkedin, instagram } = site.social;

  return (
    <footer className="theme-dark section-theme relative overflow-hidden border-t border-line">
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />
      <div className="container-x relative grid gap-14 py-20 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo variant="color" className="h-28" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">
            {site.description}
          </p>
          <p className="mt-6 font-display text-sm text-fg">{site.tagline}</p>
          <div className="mt-8 max-w-sm">
            <p id="footer-newsletter-label" className="text-sm font-medium text-fg">
              Insights in your inbox
            </p>
            <p className="mt-1 text-xs text-muted">Occasional, practical ideas on AI and business growth.</p>
            <NewsletterForm className="mt-4" labelledBy="footer-newsletter-label" />
          </div>
        </div>

        <nav aria-label="Solutions" className="lg:col-span-3 lg:col-start-6">
          <h2 className="font-display text-sm font-medium text-fg">Solutions</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={servicePath(s.slug)} className="text-muted transition-colors hover:text-fg">
                  {s.shortName}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Company" className="lg:col-span-2">
          <h2 className="font-display text-sm font-medium text-fg">Company</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {company.map((c) => (
              <li key={c.href}>
                <Link href={c.href} className="text-muted transition-colors hover:text-fg">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-2">
          <h2 className="font-display text-sm font-medium text-fg">Contact</h2>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <Link href="/contact" className="text-muted transition-colors hover:text-fg">
                Request a consultation
              </Link>
            </li>
            {email && (
              <li>
                <a href={`mailto:${email}`} className="inline-flex items-center gap-2 text-muted hover:text-fg">
                  <Mail aria-hidden className="size-4" /> {email}
                </a>
              </li>
            )}
            {phone && (
              <li>
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 text-muted hover:text-fg">
                  <Phone aria-hidden className="size-4" /> {phone}
                </a>
              </li>
            )}
            {whatsapp && (
              <li>
                <a href={whatsappLink(whatsapp)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-muted hover:text-fg">
                  <WhatsAppIcon className="size-4" /> WhatsApp
                </a>
              </li>
            )}
          </ul>
          {(linkedin || instagram) && (
            <div className="mt-6 flex gap-3">
              {linkedin && (
                <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="LARA Solutions on LinkedIn" className="rounded-full border border-line-strong p-2.5 text-muted hover:border-accent hover:text-fg">
                  <LinkedInIcon className="size-4" />
                </a>
              )}
              {instagram && (
                <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="LARA Solutions on Instagram" className="rounded-full border border-line-strong p-2.5 text-muted hover:border-accent hover:text-fg">
                  <InstagramIcon className="size-4" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-4 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.legalName}. All rights reserved. Photography &amp; video: licensed stock, used for illustration.
          </p>
          <ul className="flex gap-6">
            <li>
              <Link href="/privacy" className="hover:text-fg">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-fg">
                Terms of Use
              </Link>
            </li>
            <CookieSettingsLink />
          </ul>
        </div>
      </div>
    </footer>
  );
}
