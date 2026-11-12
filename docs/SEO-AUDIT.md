# SEO, AEO & GEO — audit, changes and owner tasks

_Last updated: 8 November 2026. Scope: enhancement of the existing site — no
visual, animation or functional changes beyond added content sections._

Related documents: [TOPIC-MAP.md](TOPIC-MAP.md) (topic architecture and
internal linking) · [AI-VISIBILITY.md](AI-VISIBILITY.md) (measurement and
maintenance) · [EDITORIAL.md](EDITORIAL.md) (article ideas).

**Status labels used throughout**

| Label | Meaning |
|---|---|
| ✅ Implemented | Built and checked locally (typecheck, tests, production build, browser checks). |
| ⚙️ Requires external configuration | Code is ready; needs an account, key, DNS or dashboard step by the owner. |
| 🏢 Requires verified business information | Needs facts only the business can confirm. Nothing has been invented in the meantime. |
| 🔭 Future recommendation | Worth doing; not done in this pass. |

No ranking, traffic or AI-citation outcome is guaranteed by any of these
changes. Search engines and AI systems decide independently what to index,
rank, summarise or cite.

---

## 1. Audit — what we found

Checked by fetching every key page from the running app and parsing the
server-rendered HTML (titles, descriptions, canonicals, Open Graph, headings,
JSON-LD), plus a code review of routing, metadata, robots and sitemap.

| # | Finding | Impact | Status |
|---|---|---|---|
| A1 | Inner pages had **no `og:image`** — page-level Open Graph overrode the inherited image. | Poor link previews on LinkedIn/WhatsApp/X. | ✅ Default branded 1200×630 image on every page; articles use their own photo. |
| A2 | **Organization JSON-LD repeated on every page**, no `WebSite` entity, no stable `@id`s. | Weak, duplicated entity signals. | ✅ One `Organization` + `WebSite` graph with stable `@id`s on Home and About; other pages reference it. |
| A3 | Service schema declared **`areaServed: "Worldwide"`** — unverified. | Inaccurate structured data. | ✅ Removed. `areaServed` is emitted only from `NEXT_PUBLIC_AREA_SERVED` (🏢 owner to confirm). |
| A4 | FAQ and contact copy implied offices/coverage in specific countries. | Unverifiable location claims. | ✅ Replaced with neutral wording ("tell us where you’re based…"). |
| A5 | **~110 elements rendered with inline `opacity:0`** (scroll-reveal) in server HTML. | Content invisible without JavaScript. | ✅ `<noscript>` stylesheet reveals all animated content. Text was always present in the HTML (crawlable). |
| A6 | Canonical/sitemap URLs could fall back to `http://localhost:3000` if `NEXT_PUBLIC_SITE_URL` was missing. | Broken canonicals in production. | ✅ Production builds use the official domain **https://larasolutions.co.in** (`PRODUCTION_URL`); `NEXT_PUBLIC_SITE_URL` can override it. |
| A7 | `/solutions` jumped from `h1` to `h3`. | Heading hierarchy. | ✅ Hidden `h2` added. |
| A8 | Several meta descriptions too long (home 222, industries 232, finder 217 chars); some titles over ~60 chars. | Truncated snippets. | ✅ Shortened (all key pages now ≲160 chars); optional `seoTitle` for long article titles. |
| A9 | Service pages were capability lists, **not question-led**; no visible FAQs. | Low answer-engine usefulness. | ✅ Restructured around nine questions with visible FAQs + `FAQPage` markup. |
| A10 | No canonical company description used consistently. | Inconsistent entity description. | ✅ One canonical description in `src/content/site.ts`, used in footer, Home, About, schema, `llms.txt`, assistant FAQ. |
| A11 | No `/faq` page; homepage linked to none. | Missing hub for common questions. | ✅ `/faq` created, linked from Home, footer, service pages; in sitemap. |
| A12 | Articles had no visible sources, updated date, or links to services; case studies didn’t link to services. | Weak credibility and topic clustering. | ✅ Sources, key takeaways, “Published/Updated”, related services added; case studies link to services and industries. |
| A13 | robots.txt treated all bots alike; no AI crawler policy. | No owner control over AI search vs training. | ✅ Three-tier policy, env-configurable. Owner decision (8 Nov 2026): allow AI search and AI training crawlers. |
| A14 | Sitemap `lastmod` = build time for static pages. | Misleading freshness signal. | ✅ Uses `site.contentUpdated` / article dates. |
| A15 | No Bing verification, IndexNow or AI-referral measurement. | Blind spots. | ✅ Code added; ⚙️ accounts/keys needed. |
| A16 | Analytics didn’t record lead source or AI referrals. | Can’t measure AI-driven enquiries. | ✅ Consent-respecting events + first-touch attribution stored with each lead. |

Things that were already sound: HTTPS-ready headers, server-rendered content
for every page, unique titles, canonical tags, XML sitemap, breadcrumb schema
on inner pages, `noindex` on non-production deployments, admin/API excluded
from crawling, alt text on all registry photos, labelled illustrative case
studies, no fake reviews/ratings.

## 2. Prioritised plan (and what was done)

| Priority | Work | Status |
|---|---|---|
| P1 | Fix entity accuracy (remove “Worldwide”, location claims), canonical description, Organization/WebSite graph | ✅ |
| P1 | OG images on all pages; production canonical domain (larasolutions.co.in) | ✅ |
| P1 | Question-led service pages with visible FAQs | ✅ |
| P2 | `/faq` hub; topic clusters & internal links (article ↔ service ↔ case study ↔ industry) | ✅ |
| P2 | Decision-guide articles (agents vs chatbots; off-the-shelf vs custom; choosing a partner) | ✅ |
| P2 | Crawler policy, honest sitemap dates, IndexNow, `llms.txt` | ✅ / ⚙️ |
| P2 | Measurement: AI referral tracking, lead attribution, GA4 events | ✅ / ⚙️ GA4 setup |
| P3 | Search Console + Bing Webmaster verification, sitemap submission | ⚙️ |
| P3 | Real team/author profiles, social profiles, area served | 🏢 |
| P3 | Further cluster content (see TOPIC-MAP.md gaps) | 🔭 |

## 3. Code changes (by file)

| Area | Files |
|---|---|
| Entity facts | `src/content/site.ts` (canonical `description`, short `metaDescription`, `areaServed`, `contentUpdated`, safe `url`) |
| Schema helpers | `src/lib/seo.ts` (`ORG_ID`, `WEBSITE_ID`, `orgRef`, `entityGraphJsonLd`, `faqJsonLd`, `webPageJsonLd`, default OG image) |
| Layout | `src/app/layout.tsx` (no global Organization, Bing verification, `<noscript>` reveal, attribution tracker) |
| Home / About / Contact | “What is LARA Solutions?” section + entity graph; founder profile + `AboutPage` (the “at a glance” facts block exists but is hidden via `showCompanyFacts` because its facts appear elsewhere); `ContactPage` |
| Service pages | `src/content/service-aeo.ts` (answers, steps, suitability, limitations, FAQs, related guides); `src/app/solutions/[slug]/page.tsx` (question-led sections; `Service` + `WebPage` + `FAQPage` graph) |
| FAQ hub | `src/app/faq/page.tsx` |
| Articles | `src/lib/content.ts` (`seoTitle`, `services`, `keyTakeaways`, `sources`); `src/app/insights/[slug]/page.tsx`; three new guides in `content/insights/`; CMS fields in `public/cms/config.yml` |
| Case studies | `services` frontmatter; links to services and industry in `src/app/work/[slug]/page.tsx` |
| Crawling | `src/lib/crawlers.ts`, `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/llms.txt/route.ts`, `src/app/indexnow-key.txt/route.ts`, `scripts/indexnow.mjs` (`npm run indexnow`) |
| Measurement | `src/lib/analytics.ts`, `src/components/layout/AttributionTracker.tsx`, `useFormSubmit.ts`, `submission.ts` (attribution stored with leads), finder/assistant events |
| Tests | `tests/seo.test.ts`, `tests/crawlers.test.ts`, `tests/analytics.test.ts`, `tests/content-integrity.test.ts` |

## 4. Revised service copy (AEO)

Every service page now answers, in this order:

1. **What is it?** — a direct 1–3 sentence definition (`answer`), quotable on its own.
2. **How does it work?** — four concrete steps.
3. **What does it include?** — capabilities.
4. **What business problems can it solve?** — use cases.
5. **Who is it most suitable for?**
6. **What limitations and dependencies should you consider?** — honest constraints (data quality, human review, integration effort, running costs).
7. **What are the potential benefits?** — framed as dependent on baseline; no numbers.
8. **How can LARA Solutions help?** — the six-step engagement model.
9. **How do you get started?** — consultation or the free Opportunity Finder.
10. **FAQs** — 2–5 per service, covering the brief’s topics: small-business AI, automatable processes, cost (answered honestly without prices), integrations, agents vs chatbots, AI in marketing, lead generation, conversion, CRM automation, supply-chain AI, demand forecasting, excess inventory, predictive logistics, AI decision-making, descriptive vs predictive analytics, KPIs, process and transformation questions.

Copy lives in `src/content/service-aeo.ts` so it can be edited without
touching layout code. It contains no statistics, client claims or guarantees.

## 5. Structured data

| Page | Types |
|---|---|
| Home | `Organization` + `WebSite` + founder `Person` (one `@graph`) |
| About | `Organization` (with `founder`) + `WebSite` + founder `Person` + `AboutPage` |
| Contact | `ContactPage` |
| Every inner page | `BreadcrumbList` |
| Service pages | `Service` (provider → Organization `@id`; `areaServed` only if configured) + `WebPage` + `FAQPage` |
| `/faq` | `FAQPage` (company questions only — topic questions are marked up once, on their service page) |
| Articles | `Article` (publisher → Organization `@id`, `datePublished`, `dateModified`, `citation` from visible sources, author) |
| Industries | `WebPage` (unchanged) |

**Deliberately not used:** `LocalBusiness` (no verified public premises —
🏢), `Person` for anyone other than the founder (other profiles not yet published — 🏢), `Review` /
`AggregateRating` / awards (no verified evidence), `HowTo` (Google retired
these rich results). Note: Google currently shows FAQ rich results only for a
limited set of authoritative sites, so `FAQPage` markup here describes the
visible content rather than expecting a rich result.

Validate after deploy (⚙️): Google Rich Results Test and the Schema.org
Validator for `/`, `/about`, `/faq`, one service page and one article.

## 6. Technical configuration

| Item | Where | Status |
|---|---|---|
| Canonical origin | `PRODUCTION_URL` = `https://larasolutions.co.in` (override with `NEXT_PUBLIC_SITE_URL`) | ✅ · ⚙️ in Vercel make the apex domain primary and redirect `www` to it |
| Staging protection | Non-production deploys and `NEXT_PUBLIC_NOINDEX=true` → `Disallow: /` | ✅ |
| Crawler policy | `AI_SEARCH_CRAWLERS`, `AI_TRAINING_CRAWLERS` (`allow`/`block`, default `allow`) | ✅ Owner decided 8 Nov 2026: **allow both** (the default — no env change needed) |
| Sitemap | `/sitemap.xml`, honest `lastmod` | ✅ · ⚙️ submit in GSC and Bing |
| IndexNow | `INDEXNOW_KEY`, `/indexnow-key.txt`, `npm run indexnow` after deploys | ✅ code · ⚙️ key + first run (Bing, Yandex and others participate; Google does not at the time of writing) |
| Bing verification | `NEXT_PUBLIC_BING_SITE_VERIFICATION` | ⚙️ |
| Google verification | `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` (or DNS) | ⚙️ |
| `llms.txt` | `/llms.txt`, generated from site content | ✅ **experimental** — a community proposal; no major search engine has said it uses it for ranking or citation. Harmless, cheap to keep. |
| Bot protection | Rate limiting, honeypot, time-trap, optional Turnstile | ✅ unchanged. If a CDN “block AI bots” setting is enabled it overrides robots.txt — align it with the chosen policy. |

**Crawler groups** (`src/lib/crawlers.ts` — re-check vendor docs periodically):

- Search engines (Googlebot, Bingbot, …): always allowed.
- AI search / user-initiated retrieval: `OAI-SearchBot`, `ChatGPT-User`, `Claude-SearchBot`, `Claude-User`, `PerplexityBot`, `Perplexity-User`.
- AI training: `GPTBot`, `ClaudeBot`, `Google-Extended`, `Applebot-Extended`, `CCBot`, `Meta-ExternalAgent`. Blocking `Google-Extended` does **not** remove the site from Google Search or AI Overviews.

## 7. Multimodal & accessibility

✅ Descriptive alt text for every photo in `src/content/media.ts`; decorative
images use empty alt. ✅ Video hero has a poster and text equivalents. ✅ Every
diagram (ecosystem, service visuals, process journey) has its meaning stated in
adjacent text. ✅ OG images on every page. 🔭 Replace stock photography with
original team/work photography over time (original images are stronger
signals than stock).

## 8. Location accuracy

No offices, addresses or registration details are published. `LocalBusiness`
is not used. 🏢 If LARA Solutions has a public business address, set
`NEXT_PUBLIC_BUSINESS_ADDRESS`, confirm regions in `NEXT_PUBLIC_AREA_SERVED`,
and only then consider a Google Business Profile and `LocalBusiness` markup.

## 9. Remaining owner tasks

| Task | Type |
|---|---|
| Connect larasolutions.co.in in Vercel (apex primary, `www` redirecting to it) and point the domain’s DNS at Vercel | ⚙️ |
| Verify the domain in Google Search Console and Bing Webmaster Tools; submit `/sitemap.xml` in both | ⚙️ |
| Create an IndexNow key, set `INDEXNOW_KEY`, deploy, run `npm run indexnow` | ⚙️ |
| If a CDN (e.g. Cloudflare) is used, make sure its “block AI bots” setting is off so it doesn’t override the decision to allow AI crawlers | ⚙️ |
| Configure GA4/GTM and the AI-referral channel group (see AI-VISIBILITY.md) | ⚙️ |
| Validate structured data with Rich Results Test / Schema.org Validator after deploy | ⚙️ |
| Add LinkedIn / Instagram URLs (`NEXT_PUBLIC_LINKEDIN_URL`, `NEXT_PUBLIC_INSTAGRAM_URL`) — they feed `sameAs` | 🏢 |
| Confirm regions served (`NEXT_PUBLIC_AREA_SERVED`) | 🏢 |
| Add the founder’s LinkedIn URL (`linkedin` in `src/content/about.ts`) — it feeds the founder’s `sameAs`; add further team profiles and named article authors when ready | 🏢 |
| Confirm the legal entity name (`NEXT_PUBLIC_LEGAL_NAME`) | 🏢 |
| Replace illustrative scenarios with approved client case studies when available | 🏢 |
| Keep the same name, description, logo and links on LinkedIn, directories and profiles | 🏢 |

## 10. Validation results (local, 8 November 2026)

| Check | Result |
|---|---|
| `npx tsc --noEmit` | ✅ No errors |
| `npm test` | ✅ 72 passing (42 existing + 30 new: entity/schema helpers, crawler policy, AI-referrer classification, AEO content integrity, internal-link integrity, `llms.txt`) |
| `npm run build` | ✅ Production build succeeds; 49 routes; all service, article, case-study and industry pages prerendered; `/faq`, `/llms.txt`, `/robots.txt`, `/sitemap.xml` static |
| Built `robots.txt` (production mode) | ✅ `*` allowed except `/api/`, `/admin`, `/cms`; AI search and AI training groups listed separately |
| Built `sitemap.xml` | ✅ 42 URLs incl. `/faq` and new guides; `lastmod` from content dates, not build time |
| Server-rendered HTML of 30 key pages (all static pages, 9 services, 9 articles, 2 industries, 1 case study) | ✅ HTTP 200 · exactly one `h1` · canonical present · `og:image` present · JSON-LD parses · no heading-level skips · every `FAQPage` question appears in visible text · no `"Worldwide"` |
| Titles / descriptions | ✅ Descriptions 104–162 chars; long article titles use `seoTitle` |
| No-JavaScript fallback | ✅ `<noscript>` reveal stylesheet present in `<head>` |
| Visual check | ✅ New service-page sections (suitability/limitations, FAQs) render in the existing design |

**Not validated here (⚙️ after deploy):** Google Rich Results Test /
Schema.org Validator on the live URLs, Search Console and Bing indexing,
IndexNow submission, GA4 events in a consented session, and the production
canonical domain on the live site (development uses `http://localhost:3000`; production builds use https://larasolutions.co.in). No AI platform was queried; the first
monthly check in AI-VISIBILITY.md establishes the baseline.
