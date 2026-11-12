import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getService, services, servicePath } from "@/content/services";
import { getClip } from "@/content/media";
import { SectionHeader } from "@/components/ui/Section";
import { RevealImage } from "@/components/ui/RevealImage";
import { BackgroundVideo } from "@/components/ui/BackgroundVideo";
import { Reveal } from "@/components/ui/Reveal";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { ServiceCopy } from "./ServiceCopy";
import { AppAssembly, AutomationFlow, DataToDashboard, MarketingFunnel, ProcessSimplify, RouteNetwork } from "./ServiceAnimations";

/**
 * Six flagship categories, each with a distinct layout and motion idea —
 * deliberately not a grid of identical cards.
 */
export function ServicesShowcase() {
  const ai = getService("ai-automation")!;
  const mk = getService("digital-marketing")!;
  const sc = getService("supply-chain-intelligence")!;
  const an = getService("data-analytics")!;
  const po = getService("process-optimization")!;
  const dt = getService("digital-transformation")!;
  const additional = services.filter((s) => s.tier === "additional");

  return (
    <div id="solutions">
      {/* Intro */}
      <section aria-labelledby="services-title" className="theme-light section-theme pb-10 pt-24 sm:pt-32">
        <div className="container-x flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeader
            id="services-title"
            index="02"
            eyebrow="Our Solutions"
            title={
              <>
                Whatever Your Challenge, <span className="text-gradient">Intelligence Is the Advantage.</span>
              </>
            }
            description="Six connected capabilities — each powerful alone, transformative together. Explore how we turn everyday business challenges into measurable progress."
          />
        </div>
      </section>

      {/* A — AI & Automation: editorial split with workflow overlay */}
      <section aria-label={ai.name} className="theme-light section-theme py-16 sm:py-24">
        <div className="container-x grid items-center gap-12 lg:grid-cols-12">
          <RevealImage photo={ai.photo} className="aspect-[4/5] sm:aspect-[5/4] lg:col-span-7 lg:aspect-[6/5]">
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
            <AutomationFlow />
          </RevealImage>
          <div className="lg:col-span-5">
            <ServiceCopy service={ai} index={1} lead="Manual tasks become connected, intelligent workflows. AI agents read, decide, route and respond — with people reviewing what matters." />
          </div>
        </div>
      </section>

      {/* B — Marketing: copy left, collage + live-style funnel right on sky */}
      <section aria-label={mk.name} className="theme-sky section-theme relative overflow-hidden py-20 sm:py-28">
        <div aria-hidden className="absolute -right-40 top-10 size-[32rem] rounded-full bg-sunrise/25 blur-[120px]" />
        <div className="container-x relative grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <ServiceCopy service={mk} index={2} lead="Creative campaigns flow into an accountable funnel. Strategy and storytelling, sharpened by AI-driven analytics, segmentation and automation." />
          </div>
          <div className="relative lg:col-span-7">
            <div className="grid grid-cols-5 gap-4">
              <RevealImage photo={mk.photo} className="col-span-3 aspect-[4/5]" sizes="(min-width: 1024px) 35vw, 60vw" />
              <div className="col-span-2 flex flex-col gap-4 pt-12">
                <RevealImage photo="people-creative" className="aspect-square" sizes="(min-width: 1024px) 22vw, 40vw" parallax={30} />
                <RevealImage photo="team-present" className="aspect-[4/5]" sizes="(min-width: 1024px) 22vw, 40vw" parallax={40} />
              </div>
            </div>
            <Reveal delay={0.2} className="relative -mt-24 px-4 sm:-mt-28 sm:px-10">
              <MarketingFunnel />
            </Reveal>
          </div>
        </div>
      </section>

      {/* C — Supply chain: immersive full-width video with route network */}
      <section aria-label={sc.name} className="theme-dark section-theme relative isolate overflow-hidden py-24 sm:py-36">
        <BackgroundVideo clip={getClip("hero-port")} className="-z-20" overlayClassName="bg-[linear-gradient(90deg,rgb(8_20_39/0.94)_0%,rgb(8_20_39/0.7)_45%,rgb(8_20_39/0.35)_100%)]" />
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-80">
          <RouteNetwork />
        </div>
        <div className="container-x grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <ServiceCopy service={sc} index={3} tone="onMedia" lead="Shipments, inventory and plans moving in sync. Forecasting, visibility and automation that give your team earlier warnings and better options." />
          </div>
          <Reveal delay={0.2} className="lg:col-span-5 lg:col-start-8">
            <div className="glass grid grid-cols-2 gap-px overflow-hidden rounded-3xl">
              {[
                ["Demand forecasting", "Plan purchasing with confidence"],
                ["Inventory optimisation", "Balance availability and cash"],
                ["Logistics intelligence", "See every movement, act on exceptions"],
                ["Warehouse optimisation", "Smoother flows, fewer touches"],
              ].map(([t, d]) => (
                <div key={t} className="bg-ink/40 p-5">
                  <p className="font-display font-semibold text-white">{t}</p>
                  <p className="mt-1 text-sm text-white/70">{d}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* D — Analytics: data transforms into a dashboard */}
      <section aria-label={an.name} className="theme-light section-theme py-20 sm:py-28">
        <div className="container-x grid items-center gap-12 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <DataToDashboard />
          </div>
          <div className="lg:col-span-5">
            <ServiceCopy service={an} index={4} lead="Raw information becomes beautiful dashboards and strategic insight — delivered to the right people while it can still change the decision." />
            <Reveal delay={0.2} className="mt-10">
              <RevealImage photo={an.photo} className="aspect-[16/9]" rounded="rounded-3xl" sizes="(min-width: 1024px) 35vw, 100vw" parallax={30} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* E — Process optimisation: full-bleed photo band with simplifying diagram */}
      <section aria-label={po.name} className="theme-dark section-theme relative isolate overflow-hidden">
        <RevealImage photo={po.photo} className="absolute inset-0 -z-10" rounded="rounded-none" sizes="100vw" parallax={80}>
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
        </RevealImage>
        <div className="container-x grid items-center gap-12 py-24 sm:py-32 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <ServiceCopy service={po} index={5} tone="onMedia" lead="Complex processes become efficient, connected workflows. We remove friction first — then apply technology where it makes a measurable difference." />
          </div>
          <Reveal delay={0.15} className="glass rounded-3xl p-6 sm:p-8 lg:col-span-6 lg:col-start-7">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/60">From complexity to clarity</p>
            <ProcessSimplify />
            <p className="mt-2 text-sm text-white/70">Scroll to watch hand-offs, rework and waiting collapse into a clear flow.</p>
          </Reveal>
        </div>
      </section>

      {/* F — Digital transformation: components assemble into an application */}
      <section aria-label={dt.name} className="theme-dark section-theme relative isolate overflow-hidden py-24 sm:py-32">
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_80%_20%,rgb(40_100_255/0.35),transparent_55%),radial-gradient(ellipse_at_10%_90%,rgb(18_214_176/0.18),transparent_50%)]" />
        <div aria-hidden className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="container-x grid items-center gap-14 lg:grid-cols-12">
          <div className="relative lg:order-2 lg:col-span-7">
            <RevealImage photo={dt.photo} className="absolute -right-6 -top-10 hidden aspect-[4/3] w-2/3 opacity-60 lg:block" rounded="rounded-3xl" sizes="30vw" parallax={40} />
            <div className="relative lg:pl-10 lg:pt-24">
              <AppAssembly />
            </div>
          </div>
          <div className="lg:order-1 lg:col-span-5">
            <ServiceCopy service={dt} index={6} tone="onMedia" lead="Scattered tools and spreadsheets assemble into connected platforms — websites, applications and integrations engineered to scale with you." />
          </div>
        </div>
      </section>

      {/* Additional capabilities — the platform is designed to grow */}
      {additional.length > 0 && (
        <section aria-labelledby="more-services" className="theme-light section-theme py-16 sm:py-20">
          <div className="container-x">
            <h3 id="more-services" className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-muted">
              Also from LARA Solutions
            </h3>
            <ul className="mt-6 grid gap-4 md:grid-cols-3">
              {additional.map((s) => (
                <li key={s.slug}>
                  <Link href={servicePath(s.slug)} className="card-surface group flex h-full items-start gap-4 rounded-2xl p-5 transition hover:-translate-y-0.5">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-section-tint">
                      <ServiceIcon name={s.icon} className="size-8" />
                    </span>
                    <span>
                      <span className="flex items-center gap-1 font-display font-semibold text-fg">
                        {s.shortName} <ArrowUpRight aria-hidden className="size-4 text-accent transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
                      <span className="mt-1 block text-sm text-muted">{s.headline}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
