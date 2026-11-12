# LARA AI Tools — setup, deployment and maintenance

Five free, no-sign-up tools at **`/ai-tools`**, built into the existing Next.js
site and powered by **Google Gemini** (free tier).

| Tool | Page | Inputs | Output |
|---|---|---|---|
| AI Caption Generator | `/ai-tools/caption-generator` | Topic, platform, tone | 3 captions with hashtags |
| AI Email Writer | `/ai-tools/email-writer` | Purpose, key details, tone | Subject line + email |
| GrowthMind Lite | `/ai-tools/growthmind-lite` | Business type, goal, channel | 5 growth ideas |
| AI Bio Generator | `/ai-tools/bio-generator` | Profession/business, keywords, platform | 3 bio options |
| SEO Generator | `/ai-tools/seo-generator` | Description, target keyword | 3 titles, 3 meta descriptions, keyword ideas |

Every result is a real AI response generated on demand. Nothing is pre-written,
and nothing is stored: there's no database, no accounts and no file uploads.

**Gemini is the site's only AI provider.** The same client and key also power
the website assistant (chat bubble, currently switched off). It answers from
approved FAQ/service content and shares the site-wide daily cap. To try
another provider later, `src/lib/server/gemini.ts` is the only file that talks
to the AI API.

---

## 1. How it works

```
Browser form ──POST /api/ai-tools/<tool>──▶ Next.js route (server)
                                              │ validate input (zod, per-field limits)
                                              │ same-origin check + honeypot
                                              │ per-visitor + site-wide limits
                                              ▼
                                   shared Gemini client ──▶ Gemini generateContent
                                   (tool's own system prompt,  (JSON schema output,
                                    output token cap)           key in a server header)
                                              ▼
                                   normalise to sections ──▶ cards with Copy buttons
```

| File | Role |
|---|---|
| `src/lib/ai-tools/registry.ts` | Browser-safe tool list: names, copy, fields, SEO text |
| `src/lib/ai-tools/server/specs.ts` | Server-only: each tool's **short system prompt**, JSON output schema, token cap, output formatter |
| `src/lib/server/gemini.ts` | The **one shared AI integration** for the whole site (Gemini REST, no extra dependency): JSON for the tools, plain text for the assistant |
| `src/lib/ai-tools/server/limits.ts` | Rate limits + daily request and spending caps (the site-wide caps also cover the assistant) |
| `src/lib/ai-tools/validate.ts` | Builds input validation from the field definitions |
| `src/app/api/ai-tools/[tool]/route.ts` | One API endpoint for all tools |
| `src/app/ai-tools/page.tsx`, `src/app/ai-tools/[tool]/page.tsx` | The listing page and one page per tool |
| `src/components/ai-tools/*` | Tool cards and the form/results UI |
| `tests/ai-tools.test.ts` | 30 tests covering validation, the Gemini client, prompts, limits and the route |

### Adding a new tool

1. Add an entry to `aiTools` in `registry.ts` (slug, name, tagline, description, icon, fields).
2. Add the same slug to `toolSpecs` and `briefLabels` in `server/specs.ts`: a short system prompt, a JSON schema, `maxOutputTokens` and a `toOutput` function.
3. Run `npm test`. A test fails if either half is missing or a field has no label.

The page, form, validation, API, sitemap, `llms.txt` and links to other tools all pick it up automatically.

---

## 2. Environment variables

All of these are **server-only**. None use the `NEXT_PUBLIC_` prefix, so none can reach the browser.

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `GEMINI_API_KEY` | **Yes** | — | Gemini API key for all AI on the site. Without it, the tools show "being set up" and the assistant uses its FAQ matcher. |
| `GEMINI_MODEL` | No | `gemini-3.5-flash-lite` | Any Gemini text model ID |
| `GEMINI_THINKING_LEVEL` | No | model default | `MINIMAL` / `LOW` / `MEDIUM` / `HIGH` (allowed values vary by model) |
| `GEMINI_BASE_URL` | No | Google endpoint | Cloudflare AI Gateway URL (see §5) |
| `CF_AIG_TOKEN` | No | — | Only for an *authenticated* Cloudflare AI Gateway |
| `AI_TOOLS_DAILY_LIMIT` | No | `300` | Site-wide Gemini calls per day (tools + assistant) |
| `AI_TOOLS_DAILY_BUDGET_USD` | No | `1` | Site-wide estimated Gemini spend per day (USD, tools + assistant) |
| `AI_TOOLS_IP_DAILY_LIMIT` | No | `30` | Generations per visitor (IP address) per day |

### Get a free Gemini API key

1. Go to <https://aistudio.google.com/apikey> and sign in with a Google account (larasolutions01@gmail.com works).
2. Click **Create API key** and copy it. Don't paste it into chat, email or code.
3. **Don't enable billing** if you want a hard guarantee of zero cost. The free tier then simply stops when its quota runs out, and visitors see the friendly "free limit reached" message.

**Data use on the free tier.** Google's pricing page states that free-tier
content is "used to improve our products". The tool pages and the privacy
policy tell visitors this and ask them not to enter personal or confidential
information. If you enable billing (paid tier), Google states that content is
not used this way. Update the notices if you switch.

---

## 3. Limits and cost control

| Guard | Default | What the visitor sees |
|---|---|---|
| Burst limit per visitor | 5 per minute | "You're generating very quickly — please wait a minute…" |
| Daily limit per visitor | 30 per day | "You've reached today's free limit…" |
| Site-wide daily requests (tools + assistant) | 300 per day (resets at midnight IST) | "Today's free usage limit has been reached…" (the assistant switches to its FAQ answers) |
| Site-wide daily spend | $1.00 estimated | Same as above |
| Google free-tier quota used up (HTTP 429) | — | Same as above; the server also stops calling Google for the rest of the day |
| Google briefly overloaded (HTTP 503 "high demand") | Retried once automatically after 0.6 s, within the same 9 s time limit | If still busy: "The AI service is temporarily unavailable. Please try again in a moment." (the assistant uses its FAQ answers) |
| Output size | 700–900 tokens per tool | — |

**Cost.** On the free tier the cost is ₹0. If you ever enable billing, the
default model costs $0.30 per million input tokens and $2.50 per million output
tokens. A typical generation uses about 400 input and 400–600 output tokens,
which is roughly $0.0015 (about ₹0.13). At the default caps, the worst case is
about $0.50–$1 per day.

**Be aware:** the limits are kept in server memory. On Netlify, each running
server instance keeps its own count, and a cold start resets it, so the caps
are a soft guard against abuse. **The hard ceiling is Google's own quota**: with
no billing on the key, no charges are possible. If you enable billing, also
set a budget alert in Google Cloud Billing, and consider Cloudflare AI Gateway
rate limiting (§5) for a shared, edge-level limit.

---

## 4. Deploy (Netlify, current hosting)

1. **Add the key:** Netlify → your site → **Site configuration → Environment variables → Add a variable**. Set the key to `GEMINI_API_KEY`, paste the value, and keep scopes on *All* (builds and functions). Optionally add the other variables from §2.
2. **Rebuild the upload folder** with your latest changes:
   ```bash
   npm run netlify:upload
   ```
3. **Deploy:** drag the `netlify-upload` folder onto Netlify → **Deploys**.
4. **Check the deploy log** for "Using Next.js Runtime" and at least one function uploaded.
5. Run the test checklist (§6) on `https://larasolutions.co.in/ai-tools`.

Environment variable changes only apply after a new deploy.

---

## 5. Cloudflare

**Domain/DNS (no change needed).** larasolutions.co.in can stay on Cloudflare
DNS, pointing at Netlify. The tools are part of the site, so they deploy
together, and the API is same-origin (`/api/ai-tools/...`). Nothing extra is
needed for CORS or DNS. If Cloudflare's *Bot Fight Mode* or WAF challenges
`POST /api/ai-tools/*` for real visitors, add a skip rule for that path.

**Optional: Cloudflare AI Gateway.** Every Gemini call passes through your
Cloudflare account, which gives you request logs and analytics, optional
caching, and a shared rate limit at Cloudflare's edge. Check Cloudflare's
current plan limits for AI Gateway.

1. Cloudflare dashboard → **AI → AI Gateway → Create gateway** (e.g. name it `lara-ai-tools`).
2. Note your **Account ID** and the gateway name.
3. Set this environment variable in Netlify:
   ```
   GEMINI_BASE_URL=https://gateway.ai.cloudflare.com/v1/<ACCOUNT_ID>/lara-ai-tools/google-ai-studio/v1beta/models
   ```
4. Optional: in the gateway **Settings**, turn on **Rate-limiting** (for example 60 requests per minute, sliding window). Requests over the limit get HTTP 429, which the tools already show as a friendly message.
5. Only if you turn on **Authenticated Gateway**: also set `CF_AIG_TOKEN` to the gateway token.
6. Redeploy, generate once, and confirm the request appears under the gateway's **Logs**.

**Moving the whole site to Cloudflare hosting** (instead of Netlify) is a
separate project using the Next.js Cloudflare adapter. The tools would work
there unchanged, since they're plain Next.js routes with no Netlify-specific
code.

---

## 6. Test checklist (after each deploy)

**Pages**
- [ ] `/ai-tools` shows five tool cards. "AI Tools" appears in the header menu, and "Free AI Tools" in the footer.
- [ ] Each card opens its own page, and the breadcrumb reads Home › AI Tools › tool name.
- [ ] The pages look right on a phone (no sideways scrolling) and on desktop.

**Each of the five tools**
- [ ] Press **Generate** with an empty form. The required fields show "This field is required." and nothing is sent.
- [ ] **Try an example**, then **Generate**. The button shows "Generating…" and a loading skeleton appears.
- [ ] Real, relevant results appear within a few seconds:
  - Captions: 3 captions with hashtags
  - Email: a subject line and an email body
  - GrowthMind: 5 ideas
  - Bios: 3 options
  - SEO: 3 titles, 3 meta descriptions and keyword chips
- [ ] **Copy** on one card shows "Copied", and the text pastes correctly. **Copy all** copies every section.
- [ ] **Try again** produces a fresh set of results.
- [ ] Change the inputs (for example a different tone or platform). The results change to match.
- [ ] On a phone, after pressing Generate, the page scrolls to the results.

**Limits and errors**
- [ ] Generate 6 times within a minute. The 6th shows the "generating very quickly" message.
- [ ] Temporarily remove `GEMINI_API_KEY` and redeploy. The tools show "being set up". Restore the key afterwards.
- [ ] Typing beyond a field's length limit isn't possible (the character counter stops).

**Privacy and security**
- [ ] The page source and the browser's Network tab never show the API key. Requests go to `/api/ai-tools/...` only.
- [ ] `/privacy#ai-tools` explains Gemini free-tier data use.

**Automated**
- [ ] `npm test` passes (includes 30 AI tools tests).
- [ ] `npm run build` succeeds.

---

## 7. Maintenance

- **Model updates.** Google retires models over time, so check the [models page](https://aistudio.google.com/docs/models) every few months. To switch, set `GEMINI_MODEL` (no code change needed), then update `PRICE_PER_M` in `limits.ts` so the spending estimate stays accurate.
- **Prompts.** Edit the system prompts in `server/specs.ts`. Keep them short, since they're sent with every request.
- **Watch usage.** Use Google AI Studio's usage page, plus the Cloudflare AI Gateway logs if enabled. Failed generations are logged on the server as `[ai-tools] <tool> failed` with an error code.
