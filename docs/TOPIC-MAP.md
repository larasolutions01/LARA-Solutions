# Topic map & internal-link strategy

Goal: every visitor — or answer engine — can move from a **challenge** to
**education** to the relevant **service** and then to a **consultation**, and
every page sits clearly inside one topic cluster.

## Pillars and clusters

| Pillar (service page) | Answers on the page | Supporting guides (published) | Proof / context | Gaps to write (🔭) |
|---|---|---|---|---|
| **AI automation** `/solutions/ai-automation` | What is AI automation? How SMEs use AI; automatable processes; cost; integrations; agents vs chatbots | Where to start with AI · AI agents vs chatbots vs automation · Off-the-shelf vs custom AI · Fix the process before you automate | Scenario: AI customer support automation | Human-in-the-loop design; document processing accuracy; one-page AI policy |
| **Digital marketing** `/solutions/digital-marketing` | AI in marketing; AI lead generation; conversion rates; CRM automation | Marketing data to decisions · KPIs that drive decisions · Choosing an AI partner | Scenarios: lead qualification, campaign intelligence | Campaign tagging conventions; transparent lead scoring |
| **Supply chain intelligence** `/solutions/supply-chain-intelligence` | AI in supply chains; demand forecasting; excess inventory; predictive logistics | Resilient supply chain visibility · KPIs · Off-the-shelf vs custom | Scenario: multi-location demand forecasting | Forecasting with limited history; exception-based management |
| **Business intelligence** `/solutions/data-analytics` | AI decision-making; descriptive vs predictive; KPIs for growing businesses | KPIs that drive decisions · Marketing data to decisions | Scenario: automated business reporting | Running a weekly metrics review; KPI definitions |
| **Process optimisation** `/solutions/process-optimization` | Which process first; optimise before automating; what a review delivers | Fix the process before you automate · Where to start with AI | — | Mapping a process in an afternoon |
| **Digital transformation** `/solutions/digital-transformation` | Replace vs integrate; CRM/ERP integration; transformation roadmaps | Digital foundation for growth · Off-the-shelf vs custom · Choosing a partner | — | Systems of record; legacy modernisation without a big bang |
| Supporting: web & app, integration, strategy | Short question-led sections + FAQs | As mapped in `service-aeo.ts` | — | AI readiness checklist |

The mapping lives in code, so links can’t drift:

- Service → guides: `relatedInsights` in `src/content/service-aeo.ts` (missing slugs are skipped; a test fails if any slug doesn’t exist).
- Guide → services: `services:` frontmatter (falls back to `categoryServices` in `src/lib/content.ts`).
- Case study → services & industry: `services:` frontmatter + industry name.
- Industry → services: `services` in `src/content/industries.ts`.
- `/faq` → every service question, linking to the answer on its service page.

## The journey on each page type

| Page | Challenge → | Education → | Service → | Consultation |
|---|---|---|---|---|
| Home | Ecosystem / industries | “What is LARA Solutions?”, Insights | Services showcase | CTA band, Opportunity Finder |
| Service | Use cases, “who it’s for” | FAQs, related guides | Capabilities, how it works | “How do you get started?”, CTA |
| Article | Opening problem | Body, key takeaways, sources | Related services box | Consultation + Finder buttons |
| Case study | Situation | Approach, “what makes it work” | Related services | CTA band |
| Industry | Sector challenges | Approaches | Linked services | CTA |
| FAQ | Questions | Answers | Topic links to services | CTA |

## Conversational intents covered

Phrased the way people ask assistants and search engines:

- “What is AI automation / supply chain intelligence / business intelligence…?” → service definitions.
- “How can a small business use AI?” · “Where do I start with AI?” → AI automation FAQ, Where-to-start guide.
- “AI agent vs chatbot — which do I need?” → FAQ + comparison guide.
- “Should I buy an AI tool or build custom automation?” → Off-the-shelf vs custom guide.
- “How do I choose an AI agency / automation partner?” → Choosing a partner guide.
- “How much does AI implementation cost?” → honest cost-drivers answer (no invented prices).
- “How can AI reduce excess inventory / improve forecasting?” → supply chain FAQs.
- “Descriptive vs predictive analytics?” · “Which KPIs should we track?” → BI FAQs, KPI guide.
- “Who is LARA Solutions / what do they do?” → Home entity section, About facts, `/faq`.

## Rules for new content

1. Pick the pillar first; link the new page to its service page and at least one sibling guide.
2. Add the new slug to the relevant service’s `relatedInsights` if it answers a question buyers ask.
3. Lead each section with a direct answer, then explain.
4. Use question-style headings where they read naturally — don’t force them.
5. No statistics without a cited, current primary source; list sources in frontmatter.
6. Update `updated:` only when the content meaningfully changes.
