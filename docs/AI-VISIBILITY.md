# AI visibility: measurement & content maintenance

This is a framework for measuring how LARA Solutions appears in search and AI
assistants. **No AI platform has been tested as part of the website work**,
and no visibility scores or rankings exist yet — the first monthly check
below establishes the baseline.

## 1. What is tracked automatically (✅ implemented)

Analytics events fire only after the visitor accepts analytics cookies
(GA4/GTM must be configured — ⚙️).

| Event | When | Useful parameters |
|---|---|---|
| `generate_lead` | Any form submits successfully | `form` (contact, newsletter, roadmap; assistant-lead when the assistant is on), `ai_source` |
| `ai_referral` | A session arrives from a known AI assistant | `ai_source` (ChatGPT, Perplexity, Microsoft Copilot, Gemini, Claude, You.com, Phind) |
| `opportunity_finder_complete` | Finder results shown | `industry`, `challenge`, `top_service` |
| `assistant_question` | Visitor asks the website assistant (only while the assistant is switched on) | `mode` (faq / ai) |

Each lead also stores first-touch **attribution** (landing page, referrer,
AI source, UTM parameters) in `details.attribution`, visible in the admin
inbox and forwarded to Supabase / CRM. This works without analytics cookies
because it travels with the form the visitor chose to submit and is limited
to the current browser session.

## 2. Setup steps (⚙️ owner)

1. **Google Search Console** — verify the domain, submit `/sitemap.xml`. AI Overviews/AI Mode traffic is reported inside the normal web search performance data (not separately, at the time of writing).
2. **Bing Webmaster Tools** — verify (`NEXT_PUBLIC_BING_SITE_VERIFICATION`), submit the sitemap, enable IndexNow (`INDEXNOW_KEY`). Bing data matters because several assistants draw on Bing’s index.
3. **GA4** — create a custom channel group with an “AI assistants” channel placed above “Referral”, matching source by regex:
   ```
   (chatgpt\.com|chat\.openai\.com|perplexity\.ai|copilot\.microsoft\.com|gemini\.google\.com|bard\.google\.com|claude\.ai|you\.com|phind\.com)
   ```
   Mark `generate_lead` as a key event. Build an exploration: AI channel → landing page → `generate_lead`.
4. **CRM** — map `details.attribution.aiSource` and `utmSource` to lead-source fields.
5. **Ask enquirers** “How did you hear about us?” in discovery calls — many AI-influenced visits arrive later as direct or branded search and can’t be attributed automatically.

## 3. Monthly AI-answer check (manual, ~45 minutes)

Run the same prompts each month in ChatGPT (with search), Perplexity,
Microsoft Copilot, Google (AI Overviews / AI Mode where shown), Gemini and
Claude. Use a logged-out or fresh session where possible; results vary by
location, account and time, so treat them as directional.

**Brand prompts**

1. What is LARA Solutions?
2. What services does LARA Solutions offer?
3. Is LARA Solutions an AI automation agency?

**Category prompts** (the ones that bring new clients)

4. How can a small business start using AI?
5. Should we use an AI agent or a chatbot for customer support?
6. Off-the-shelf AI tools vs custom AI automation for an SME?
7. How do I choose an AI automation partner?
8. How can AI help reduce excess inventory?
9. What is the difference between descriptive and predictive analytics?
10. Which KPIs should a growing business track?
11. Agencies that help businesses with AI automation and digital marketing.

**Log template** (one row per prompt × platform)

| Date | Platform | Prompt # | LARA mentioned? (Y/N) | Description accurate? (Y/N/partly) | Linked/cited URL | Competitors named | Notes / errors to fix |
|---|---|---|---|---|---|---|---|

What to do with the results:

- **Inaccurate description** → check the canonical description is consistent on the site, LinkedIn and directories; correct the source page.
- **Not mentioned for a category prompt** → strengthen or create the matching guide/FAQ (see TOPIC-MAP.md gaps); earn mentions on credible third-party sites.
- **Cited page is outdated** → update the content and its `updated:` date, then run `npm run indexnow`.

## 4. Quarterly review

- Search Console: queries and pages gaining/losing impressions; question-style queries → new FAQ candidates.
- GA4: AI-assistant sessions, their landing pages and lead conversion.
- Leads: count by `aiSource` / UTM / self-reported source.
- Re-check crawler user-agent tokens in `src/lib/crawlers.ts` against vendor docs.
- Validate structured data on key templates after any template change.

## 5. Content maintenance workflow

| Cadence | Task |
|---|---|
| On every content change | Update `updated:` only for meaningful changes; never bump dates cosmetically. Run `npm test` (content-integrity checks) and, after deploy, `npm run indexnow -- <changed paths>`. |
| Monthly | AI-answer check (above); review enquiry questions (and assistant questions when it is on) for unanswered topics; add FAQs. |
| Quarterly | Review each service page’s FAQs and limitations for accuracy; refresh `site.contentUpdated` if pages changed; check sources still resolve. |
| Twice a year | Re-read the canonical description and About facts; prune or merge thin articles; replace stock imagery with original photography where possible. |

Ownership: name one person responsible for the monthly check and one for
content accuracy. Record changes in the log so trends are visible.
