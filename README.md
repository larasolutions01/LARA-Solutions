# LARA Solutions — Website

Immersive, production-ready website for **LARA Solutions**, an AI-powered business growth and transformation agency.
*Intelligence That Drives Growth.*

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Motion · GSAP ScrollTrigger · Lenis · React Three Fiber.

---

## Quick start

```bash
npm install
cp .env.example .env.local   # optional for local dev
npm run dev                  # http://localhost:3000
```

| Command             | What it does                          |
| ------------------- | ------------------------------------- |
| `npm run dev`       | Development server (Turbopack)        |
| `npm run build`     | Production build                      |
| `npm start`         | Serve the production build            |
| `npm test`          | Unit & integration tests (Vitest)     |
| `npm run typecheck` | Strict TypeScript check               |

Requires Node.js 20.9+ (22 LTS recommended).

---

## The experience

**Homepage (in order)**

1. **Cinematic hero** — a crossfading montage of eight licensed real-world clips (team, engineering, marketing, warehouse, port, analytics, celebration, city) with gentle zoom, a subtle technology overlay, mouse-depth floating chips, staggered headline reveal, animated supporting line and scroll transform. Pause control and scene selector (WCAG 2.2.2). Mobile, reduced-motion and data-saver visitors get a lightweight poster slideshow instead of video.
2. **One Intelligent Ecosystem** — the 3D LARA intelligence core (React Three Fiber) with six orbiting business functions. Hover/focus previews a function with photography and details; click opens the service (touch: tap twice). Paused off-screen; SVG fallback without WebGL.
3. **Services showcase** — six categories, each with its own layout and motion: AI workflow overlay, marketing collage + live-style funnel, full-width port video with animated route network, raw-data-to-dashboard transformation, scroll-driven process simplification, and components assembling into an application. Expandable capabilities on each.
4. **People montage** — multi-speed parallax photo columns with mask reveals.
5. **AI Opportunity Finder** — six questions (industry, size, challenge, priority, technology maturity, areas of repetitive work), per-question imagery and guidance, transparent rule-based results with "Why this?", categories, best-fit services, first steps and a roadmap/consultation request.
6. **Business Impact Simulator** — employees, repetitive hours, cost, automation suitability and working weeks drive instant figures, progress rings, before/after bars, conservative/expected/ambitious scenarios and recommended services, with all assumptions shown.
7. **Process journey** — six stages pinned and choreographed with GSAP ScrollTrigger on desktop; stacked cards on mobile.
8. **Industries** — cinematic photo cards (zoom, overlay shift, challenge reveal) linking to detail pages.
9. **Work** — horizontal case-study showcase driven by vertical scroll (desktop), swipeable on touch.
10. **Insights** and a cinematic closing CTA.

**Pages:** Home · Solutions overview · 9 service pages (6 flagship + Web & App Development, Technology Integration, Strategy & Consulting) · Industries + 8 industry detail pages · Our Work + case details · About · Insights + articles (reading progress) · AI Opportunity Finder · Contact · Privacy · Terms · custom 404 · secure Admin.

**Microinteractions:** magnetic CTAs, button sheen and press feedback, card lift/zoom/spotlight, animated focus states, a desktop-only "View/Explore" cursor label on media cards, CSS page transitions, smooth scrolling.

---

## Design system

Tokens in `src/app/globals.css`.

| Role | Colour |
| --- | --- |
| Midnight Navy | `#081427` |
| Electric Blue | `#2864FF` |
| Brilliant Cyan | `#00C9E8` |
| Fresh Teal | `#12D6B0` |
| Warm Sunrise Orange | `#FFAD55` |
| Soft Lavender | `#9674FF` |
| Light Sky Blue | `#EBF6FF` |
| Warm Off-White | `#FAFBFC` |

**Section themes.** Every section declares `theme-light`, `theme-sky`, `theme-dark` or `theme-bright` (via `<Section theme="…">`). Components use semantic tokens — `text-fg`, `text-body`, `text-muted`, `border-line`, `bg-card`, `text-accent`, `bg-section` — that re-resolve inside each theme, so the same component works on light, dark and bright backgrounds. Pages alternate light, cinematic dark and bright sections.

Typography: Space Grotesk (display) and Inter (body). Primary buttons are Electric Blue with white text (AA contrast); Sunrise Orange is used sparingly for highlights.

**Logo:** the official Neon Orbit logo (`public/brand/lara-logo-color.png`), extracted from the supplied artwork without redrawing. It sits on dark surfaces (hero, header, footer); the header is transparent over heroes and becomes navy glass on scroll, growing/shrinking so the stacked wordmark stays legible.

---

## Media

All photography (40 images, Unsplash) and video (8 clips at 720p, Pexels) is **licensed stock used for illustration** — not LARA staff, offices or clients. Sources and licences: [`MEDIA_CREDITS.md`](MEDIA_CREDITS.md). Registry with alt text: `src/content/media.ts` (dimensions and blur placeholders in `src/content/generated/media-meta.json`).

To use your own photography, replace a file in `public/media/` and keep its key — or add a new entry to the registry. Next.js serves responsive AVIF/WebP sizes automatically.

---

## Backend & integrations

All configuration is via environment variables — see [`.env.example`](.env.example). Contact details, booking links, WhatsApp and socials are never hard-coded; empty values are simply hidden.

### Lead capture
`POST /api/contact`, `/api/roadmap`, `/api/assistant-lead`, `/api/newsletter` share one pipeline (`src/lib/server/submission.ts`): JSON-only, size limit, per-IP rate limit, honeypot, time-trap, optional Cloudflare Turnstile, zod validation (same schemas as the browser). Delivery (`src/lib/server/leads.ts`) to any combination of **Supabase**, **Resend** email notifications and a **CRM webhook**; dev also writes `.data/leads.ndjson`. With nothing configured in production the API returns `503` rather than silently dropping enquiries.

**Supabase:** run [`supabase/migrations/0001_leads.sql`](supabase/migrations/0001_leads.sql) (RLS on, no public policies), then set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (server-only).

### Secure admin area — `/admin`
Lead inbox with type filters, status updates (Supabase), and CSV export (formula-injection-safe).
- Set `ADMIN_PASSWORD` (12+ characters) and `ADMIN_SESSION_SECRET` (32+ random characters). Unset = admin disabled.
- Sessions are HMAC-signed, httpOnly, Secure, SameSite=Strict cookies (8 hours). Every admin page, route and server action verifies the session server-side (no middleware, so it runs the same on Vercel, Netlify and Docker); admin responses are sent with `Cache-Control: no-store` and `X-Robots-Tag: noindex`. Login attempts are rate-limited.

### Content management — `/cms`
Articles and case studies are Markdown in `content/`, validated at build time. Decap CMS at `/cms` edits them via Git: set `backend.repo` in [`public/cms/config.yml`](public/cms/config.yml) and configure GitHub OAuth (or run `npx decap-server` locally). Featured images/covers take a media key (e.g. `ins-kpi`) or an uploaded `/uploads/...` path. Case studies of `type: client` only publish with `approved: true`.

### Website assistant
**Currently switched off.** Set `NEXT_PUBLIC_ENABLE_ASSISTANT=true` to show the chat bubble and open `/api/assistant` and `/api/assistant-lead` (both return 404 while off). When on: deterministic FAQ assistant by default (`src/content/faq.ts`). With `GEMINI_API_KEY` set (the same key as the AI tools), it runs in **AI-assisted mode** (`/api/assistant`, `src/lib/server/assistant-ai.ts`): Google Gemini through the site's shared client (`src/lib/server/gemini.ts`), answering only from the approved FAQ/service/industry content in short plain-text replies, and counting towards the same site-wide daily cap as the tools. If the key is missing, the answer is blocked, the daily cap is reached, or the API errors, it falls back to the rule-based matcher — and the UI always labels which mode answered.

### Analytics & consent
`NEXT_PUBLIC_GTM_ID` (preferred) or `NEXT_PUBLIC_GA_MEASUREMENT_ID`. Nothing loads until the visitor opts in via the consent banner (Consent Mode v2 defaults for GTM); "Cookie settings" in the footer reopens it. `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` for Search Console.

### Scheduling & messaging
`NEXT_PUBLIC_BOOKING_URL` (Calendly etc.) enables "Book a Discovery Call"; `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_CONTACT_PHONE`, `NEXT_PUBLIC_BUSINESS_ADDRESS`, `NEXT_PUBLIC_LINKEDIN_URL`, `NEXT_PUBLIC_INSTAGRAM_URL`.

---

## Editable content

| What | Where |
| --- | --- |
| Services (add/retire, core vs additional) | `src/content/services.ts` |
| Industries & detail pages | `src/content/industries.ts` |
| Process steps, navigation | `src/content/navigation.ts` |
| About: story, values, approach, **team**, **milestones** | `src/content/about.ts` |
| Client/partner logos | `src/content/partners.ts` |
| FAQs (/faq page and assistant) | `src/content/faq.ts` |
| Opportunity Finder rules | `src/lib/opportunity.ts` |
| Simulator assumptions | `src/lib/roi.ts` |

Team, founder, history and milestones are placeholders — the timeline renders only when verified milestones are added. Nothing on the site fabricates clients, testimonials, statistics or achievements.

---

## LARA AI Tools — `/ai-tools`

Five free, no-sign-up AI tools (caption generator, email writer, GrowthMind Lite, bio generator, SEO generator) powered by Google Gemini's free tier through one shared server-side client (`src/lib/server/gemini.ts`, also used by the website assistant), with a short system prompt per tool, JSON-schema output, rate limits and a daily request/spending cap. Set `GEMINI_API_KEY` to enable. Setup, Cloudflare AI Gateway, deployment and test checklist: [docs/AI-TOOLS.md](docs/AI-TOOLS.md).

## Search, answer-engine & AI visibility

- **Entity:** one canonical description in `src/content/site.ts`; `Organization` + `WebSite` JSON-LD with stable `@id`s on Home and About; other pages reference it.
- **Answer-first pages:** service pages answer what / how / who / limitations / FAQs (`src/content/service-aeo.ts`) with matching `Service` and `FAQPage` markup; `/faq` hub.
- **Crawling:** `/robots.txt` separates search engines, AI search agents and AI training crawlers (`AI_SEARCH_CRAWLERS`, `AI_TRAINING_CRAWLERS`); `/sitemap.xml` with honest `lastmod`; `/llms.txt` (experimental); IndexNow via `INDEXNOW_KEY` + `npm run indexnow`.
- **Measurement:** consent-respecting GA4 events (`generate_lead`, `ai_referral`, …) and first-touch attribution stored with each lead.

Full audit, status of every item and owner tasks: [docs/SEO-AUDIT.md](docs/SEO-AUDIT.md) · topic clusters: [docs/TOPIC-MAP.md](docs/TOPIC-MAP.md) · monitoring: [docs/AI-VISIBILITY.md](docs/AI-VISIBILITY.md).

## Accessibility & performance

Targets WCAG 2.2 AA: semantic landmarks, skip link, visible focus, keyboard-operable menus/tabs/tools, labelled forms with live error/success messages, pause control for moving video, `prefers-reduced-motion` honoured everywhere (no Lenis, no pinning, static posters, no 3D animation). Video only plays on larger screens without data-saver, only while visible, muted, with posters; heavy visuals are lazy-loaded and paused off-screen; images are responsive with blur placeholders.

## Deployment & domain

**Vercel (recommended):** import the repo, add environment variables, deploy. The production domain is **larasolutions.co.in** (`PRODUCTION_URL` in `src/content/site.ts`); `NEXT_PUBLIC_SITE_URL` overrides it if ever needed.

**Connecting larasolutions.co.in (Vercel):** in Vercel → Project → Settings → Domains, add `larasolutions.co.in` (primary) and `www.larasolutions.co.in` (set to redirect to the primary, so there is only one canonical address). Then at your domain registrar’s DNS settings: set an `A` record for `@` to the IP Vercel shows (currently `76.76.21.21`) and a `CNAME` for `www` to `cname.vercel-dns.com` — or switch the domain's nameservers to Vercel's. Vercel issues HTTPS automatically once DNS propagates. Always copy the exact values Vercel displays for your project.

**Netlify:** `netlify.toml` is included (build `npm run build`, publish `.next`, Node 22, and the `@netlify/plugin-nextjs` adapter declared explicitly). A healthy deploy log shows “Using Next.js Runtime” and uploads functions; “0 new function(s) to upload” means the adapter didn’t run and every page will 404. This is a server-rendered app, so Netlify must **build** it. Three ways:
1. **Drag and drop (current workflow):** run `npm run netlify:upload` — it creates a clean `netlify-upload` folder (≈200 files, ≈35 MB: source, content, public assets, config, lockfile). Drag **that folder**, not the whole project, onto Netlify → your site → *Deploys*. The whole project folder works too but uploads `node_modules` (Windows-only binaries, hundreds of MB), `.next`, local lead data (`.data`) and other files Netlify doesn’t need. Re-run the command before each upload so it contains your latest changes.
2. **Git (best long-term):** push the project to GitHub/GitLab/Bitbucket → Netlify → *Add new site → Import an existing project* → pick the repo (settings are read from `netlify.toml`) → add environment variables → Deploy. Every push redeploys.
3. **CLI from this folder:** `npx netlify-cli login`, then `npx netlify-cli deploy --build --prod` (first run asks to create/link a site). Stop `npm run dev` first on Windows so `.next` isn’t locked.

Then add the domain under *Domain management* (`larasolutions.co.in` primary, `www` redirecting) and use the DNS values Netlify shows. Set the lead-delivery variables (Resend/Supabase/CRM) — without one, production forms return 503 instead of silently losing enquiries. The **coming-soon page** alone can be deployed by dragging the `coming-soon` folder (it contains `index.html`) onto https://app.netlify.com/drop.

**Docker / any Node host:** `docker build -t lara-website . && docker run -p 3000:3000 --env-file .env.production lara-website` (Next.js `standalone` output).

## Testing

`npm test` — automated tests covering validation, every Opportunity Finder answer combination (incl. technology maturity), area boosts, simulator scenarios, FAQ matching, rate limiting, lead delivery, the submission pipeline (spam traps, errors), admin session signing/expiry/tampering, CSV escaping, the assistant API fallback, and CMS content integrity.
