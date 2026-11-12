/**
 * Answer-focused content for each service page (AEO).
 *
 * Each page answers, in plain language: what the service is, how it works,
 * who it suits, what to watch out for, and common questions. Answers lead
 * with a direct sentence, then add detail. No statistics or claims that
 * would need a source are made here — if you add any, cite them.
 */

export interface ServiceAeo {
  topic: string; // natural phrase used in headings, e.g. "AI automation"
  question: string; // "What is …?"
  answer: string; // direct, quotable definition (1–3 sentences)
  howItWorks: { title: string; body: string }[];
  suitableFor: string[];
  limitations: string[];
  faqs: { question: string; answer: string }[];
  relatedInsights: string[]; // insight slugs
}

export const serviceAeo: Record<string, ServiceAeo> = {
  "ai-automation": {
    topic: "AI automation",
    question: "What is AI automation for business?",
    answer:
      "AI automation uses artificial intelligence to handle tasks that normally need a person to read, interpret or decide — such as triaging emails, extracting data from documents or answering routine customer questions — and connects those tasks into workflows across your existing tools. Unlike rule-based automation, it can work with unstructured information like free-text messages and PDFs.",
    howItWorks: [
      { title: "Pick a well-defined process", body: "We start with one high-volume task where the inputs, the expected output and the cost of a mistake are clear — for example classifying incoming enquiries." },
      { title: "Ground it in your information", body: "The AI is given only the documents, policies and system data it needs, so answers and decisions are based on your business rather than general knowledge." },
      { title: "Integrate and add review steps", body: "The workflow connects to your email, CRM, helpdesk or ERP, with human approval wherever a decision is sensitive or uncertain." },
      { title: "Measure, then expand", body: "We track agreed measures such as time per task, error rates and response times, refine the workflow, and only then extend it to more volume or new processes." },
    ],
    suitableFor: [
      "Teams spending hours each week on repetitive reading, copying or routing of information",
      "Businesses with growing enquiry, ticket or document volumes",
      "Organisations that already use cloud tools with APIs (CRM, helpdesk, accounting, ERP)",
      "Leaders who want a measured pilot before a wider rollout",
    ],
    limitations: [
      "AI can make mistakes. Processes with high consequences need human review, clear escalation rules and audit logs.",
      "Results depend on the quality and accessibility of your data and documents; messy inputs usually need tidying first.",
      "Some legacy systems lack APIs, which can add integration effort or require an interim workaround.",
      "Ongoing costs include AI model usage and monitoring, so we estimate running costs alongside build costs.",
    ],
    faqs: [
      {
        question: "How can small businesses use AI?",
        answer:
          "Small businesses usually get the most value from AI on repetitive, well-understood tasks: drafting replies to common customer questions, summarising calls into the CRM, extracting details from invoices, and preparing routine reports. Starting with one task, measuring the time saved and keeping a person in the loop is more effective than a large programme. Our guide to where to start with AI walks through the steps.",
      },
      {
        question: "What business processes can be automated with AI?",
        answer:
          "Processes that happen often, follow recognisable patterns and can be checked by a person are good candidates — email and ticket triage, document data extraction, CRM updates after calls, first-line customer support, report preparation and lead qualification. Processes that are rare, highly judgement-based or poorly defined are usually better improved by redesigning the workflow first.",
      },
      {
        question: "How much does AI implementation typically cost?",
        answer:
          "Cost depends mainly on the number of systems involved, how clean the data is, the level of human review required and the expected volume, which drives ongoing model usage. We don’t publish fixed prices because scope varies widely; instead we start with a discovery conversation and propose a clearly priced first phase with defined deliverables and running-cost estimates.",
      },
      {
        question: "Can AI integrate with our existing business software?",
        answer:
          "Usually, yes. Most modern CRMs, helpdesks, accounting and e-commerce platforms offer APIs that AI workflows can read from and write to. Where a system has no API, options include scheduled exports, email-based hand-offs or a lightweight intermediary service — we assess this during discovery.",
      },
      {
        question: "What is the difference between AI agents and chatbots?",
        answer:
          "A chatbot holds a conversation and answers questions. An AI agent can also take actions — looking up records, updating systems and completing multi-step tasks towards a goal, within the permissions it is given. Agents are more capable but need tighter guardrails, logging and review. Our comparison of AI agents, chatbots and traditional automation explains when each fits.",
      },
    ],
    relatedInsights: ["where-to-start-with-ai-small-business", "ai-agents-vs-chatbots-vs-automation", "off-the-shelf-vs-custom-ai", "fix-the-process-before-you-automate"],
  },

  "digital-marketing": {
    topic: "AI-powered digital marketing",
    question: "What is AI-powered digital marketing?",
    answer:
      "AI-powered digital marketing combines marketing strategy and creative work with data analysis and automation — using AI to segment audiences, predict which leads are most promising, test messaging and route enquiries quickly — so budget and effort move towards the activities that create pipeline and revenue.",
    howItWorks: [
      { title: "Agree what success means", body: "Marketing and sales align on definitions — what a qualified lead is, when it becomes an opportunity — so every report measures the same thing." },
      { title: "Connect the funnel", body: "Campaign tagging, website analytics and the CRM are linked so you can follow a prospect from first visit to closed deal." },
      { title: "Apply AI where it adds value", body: "Segmentation, lead scoring, content variations for testing and anomaly alerts — always alongside human strategy and creative judgement." },
      { title: "Review and reallocate", body: "A regular review turns results into decisions about channels, messages and budget." },
    ],
    suitableFor: [
      "Businesses that can report clicks and leads but not which activities create customers",
      "Teams running several channels without a shared view of performance",
      "B2B and service firms that need faster, more consistent lead follow-up",
      "E-commerce and SaaS businesses wanting better segmentation and retention",
    ],
    limitations: [
      "AI tools amplify existing data; without consistent tracking and CRM hygiene, insights are unreliable.",
      "Attribution is never perfect — we aim for consistent, decision-useful measurement rather than false precision.",
      "Privacy and consent rules limit what can be tracked; we design within them.",
      "Strategy, positioning and creative quality still matter most — AI sharpens them but does not replace them.",
    ],
    faqs: [
      {
        question: "How can AI improve marketing performance?",
        answer:
          "AI helps by finding patterns people miss and by doing repetitive work faster: grouping customers by behaviour and value, scoring new leads against your best customers, flagging sudden changes in cost or conversion, and drafting variations for testing. The improvement comes when those insights change decisions — which channels to fund, which audiences to target and how quickly to follow up.",
      },
      {
        question: "What is AI-powered lead generation?",
        answer:
          "AI-powered lead generation uses data and automation to attract, capture and qualify prospects: personalising website and campaign content, qualifying enquiries with a few smart questions, scoring leads and routing the best ones to sales instantly. It works best on top of clear targeting and a well-maintained CRM.",
      },
      {
        question: "How can businesses improve conversion rates?",
        answer:
          "Start by finding where prospects drop out — on landing pages, forms, pricing or follow-up — then test focused changes: clearer value propositions, shorter forms, faster responses and stronger proof. Measure each change against a baseline, and fix response speed and lead handling before redesigning pages.",
      },
      {
        question: "How do marketing automation and CRM integration work?",
        answer:
          "Forms, ads, email and chat feed contacts into the CRM automatically; rules and AI then segment them, trigger nurture sequences, update lead scores and alert sales at the right moment. The CRM becomes the single record of every interaction, which makes reporting on pipeline and revenue possible.",
      },
    ],
    relatedInsights: ["marketing-data-to-decisions", "kpis-that-drive-decisions", "how-to-choose-an-ai-automation-partner"],
  },

  "supply-chain-intelligence": {
    topic: "supply chain intelligence",
    question: "What is supply chain intelligence?",
    answer:
      "Supply chain intelligence brings order, inventory, shipment and supplier data into one reliable view, then applies analytics and AI — such as demand forecasting and exception alerts — so planners can see problems earlier and make better purchasing, stock and delivery decisions.",
    howItWorks: [
      { title: "Establish visibility first", body: "We consolidate ERP, warehouse, carrier and order data and fix the data-quality issues that surface, because every forecast depends on it." },
      { title: "Measure a baseline", body: "Before introducing forecasting models, we record how accurate current planning is so any improvement is measured rather than assumed." },
      { title: "Forecast and flag exceptions", body: "Models forecast demand by product and location; planners review and adjust them, and alerts highlight stock-out risk, excess stock and late shipments." },
      { title: "Automate the routine", body: "Repetitive steps — status updates, document handling, reorder suggestions — are automated, with people approving the decisions that matter." },
    ],
    suitableFor: [
      "Distributors, retailers and manufacturers managing many products or locations",
      "Logistics operations that lack real-time visibility of shipments",
      "Teams planning purchasing in spreadsheets",
      "Businesses balancing product availability against working capital",
    ],
    limitations: [
      "Forecasts are estimates with uncertainty, especially for new products, sparse sales or unusual events — they support planners rather than replace them.",
      "Inventory decisions are trade-offs: higher availability usually means holding more stock, so targets must reflect your priorities.",
      "Data quality across systems (units, product codes, lead times) is often the biggest early piece of work.",
      "Integrating carriers, suppliers and older ERPs can take longer than building the analytics itself.",
    ],
    faqs: [
      {
        question: "How can AI optimise supply chains?",
        answer:
          "AI helps supply chains by forecasting demand more consistently, highlighting items at risk of running out or overstocking, predicting late deliveries from historical patterns, and automating routine documentation and updates. The benefit depends on reliable underlying data and on planners acting on the exceptions it surfaces.",
      },
      {
        question: "What is AI-powered demand forecasting?",
        answer:
          "AI-powered demand forecasting uses historical sales, seasonality, promotions and other known drivers to estimate future demand for each product and location, typically with a range of likely outcomes rather than a single number. Planners review and adjust the forecasts using knowledge the data can’t see, such as new contracts or supplier changes.",
      },
      {
        question: "Can AI help reduce excess inventory?",
        answer:
          "It can help by identifying slow-moving items, improving the forecasts that drive purchasing and suggesting reorder quantities that reflect actual demand patterns. Whether excess stock falls depends on acting on those signals and on agreed service-level targets — reducing stock always has to be balanced against availability.",
      },
      {
        question: "How can logistics companies use predictive analytics?",
        answer:
          "Logistics companies use predictive analytics to anticipate demand and capacity needs, flag shipments likely to arrive late, compare carrier reliability and plan resources ahead of busy periods. Most start with visibility — one view of shipments and exceptions — before adding prediction.",
      },
    ],
    relatedInsights: ["resilient-supply-chain-visibility", "kpis-that-drive-decisions", "off-the-shelf-vs-custom-ai"],
  },

  "data-analytics": {
    topic: "business intelligence",
    question: "What is business intelligence and analytics?",
    answer:
      "Business intelligence turns data from your systems into trusted reports, dashboards and forecasts that people use to make decisions. Analytics goes further — explaining why results changed and predicting what is likely to happen next — so decisions are based on current, consistent information rather than month-end spreadsheets.",
    howItWorks: [
      { title: "Start from decisions", body: "We identify the decisions you make regularly and the questions you need answered, then choose the few KPIs that serve them." },
      { title: "Connect and define the data", body: "Data from sales, finance, operations and marketing is integrated, cleaned and given shared definitions so every team trusts the same numbers." },
      { title: "Build views people use", body: "Dashboards, automated reports and short narrative summaries are delivered where people already work, at the right frequency." },
      { title: "Add forecasting where useful", body: "Once reporting is reliable, predictive models give forward-looking views of revenue, demand or capacity with clear confidence ranges." },
    ],
    suitableFor: [
      "Leadership teams waiting on manually assembled reports",
      "Businesses where different teams report different numbers",
      "Growing companies that need forward-looking visibility for planning",
      "Organisations preparing for AI, which depends on clean, connected data",
    ],
    limitations: [
      "Dashboards only create value when someone owns each KPI and a regular review turns data into action.",
      "Predictions are probabilistic and degrade when conditions change; models need monitoring and periodic retraining.",
      "Inconsistent source data has to be fixed at the source, or reports will keep disagreeing.",
      "More metrics is not better — too many KPIs dilute attention.",
    ],
    faqs: [
      {
        question: "How can AI improve business decision-making?",
        answer:
          "AI improves decisions by surfacing patterns and anomalies early, forecasting likely outcomes and summarising what changed and why, so leaders spend less time assembling data and more time acting on it. It works best as decision support: the model informs, people decide.",
      },
      {
        question: "What is the difference between descriptive and predictive analytics?",
        answer:
          "Descriptive analytics explains what has happened — sales last month, delivery performance this quarter. Predictive analytics estimates what is likely to happen — next month’s demand, which customers may churn — using historical patterns. Most businesses should make descriptive reporting reliable first, because predictions built on inconsistent data mislead.",
      },
      {
        question: "What KPIs should growing businesses track?",
        answer:
          "Choose KPIs from the decisions you need to make. Common examples include revenue and gross margin, cash runway, pipeline created and win rate, customer acquisition cost and retention, and operational measures such as fulfilment time or support resolution time. Each KPI should be actionable, owned by a named person and available in time to act — pair lagging measures with leading ones.",
      },
    ],
    relatedInsights: ["kpis-that-drive-decisions", "marketing-data-to-decisions", "resilient-supply-chain-visibility"],
  },

  "process-optimization": {
    topic: "process optimisation",
    question: "What is business process optimisation?",
    answer:
      "Business process optimisation means mapping how work actually flows through your organisation, finding the bottlenecks, hand-offs and duplicated effort that slow it down, and redesigning the workflow — then applying automation or software only where it creates a clear, measurable improvement.",
    howItWorks: [
      { title: "Map the current process", body: "With the people who do the work, we document each step, tool, hand-off and wait from start to finish." },
      { title: "Find the friction", body: "Steps are classed as adding value, necessary, or waste, and the biggest delays and error sources are prioritised." },
      { title: "Redesign, then automate", body: "We simplify the workflow — removing steps, clarifying ownership, standardising inputs — before choosing what to automate." },
      { title: "Monitor the improvement", body: "Cycle times, backlogs and error rates are tracked so the gains are visible and sustained." },
    ],
    suitableFor: [
      "Operations where work waits in inboxes or depends on a few key people",
      "Businesses planning automation or AI that want to avoid automating a broken process",
      "Teams growing quickly whose processes no longer scale",
      "Organisations with recurring errors, rework or customer complaints about delays",
    ],
    limitations: [
      "Process change is people change — new workflows need clear communication, training and ownership to stick.",
      "Mapping takes the time of people who know the work; we keep sessions focused to minimise disruption.",
      "Some improvements depend on system changes that take longer than the redesign itself.",
      "Not every inefficiency is worth fixing — we prioritise by impact and effort.",
    ],
    faqs: [
      {
        question: "Which process should we improve first?",
        answer:
          "Start with a process that is frequent, causes visible delays or errors, and has a clear owner — such as order-to-invoice, enquiry-to-quote or employee onboarding. A process that affects customers directly and runs many times a week usually shows results fastest.",
      },
      {
        question: "Should we optimise a process before automating it?",
        answer:
          "Yes, in most cases. Automating an inefficient process makes the inefficiency run faster. Simplifying the workflow first often removes steps entirely and makes the remaining automation cheaper and more reliable.",
      },
      {
        question: "What does a process review deliver?",
        answer:
          "Typically a map of the current process, a prioritised list of problems with their causes, a redesigned target process, recommendations on where automation or software would help, and the measures to track improvement.",
      },
    ],
    relatedInsights: ["fix-the-process-before-you-automate", "where-to-start-with-ai-small-business", "kpis-that-drive-decisions"],
  },

  "digital-transformation": {
    topic: "digital transformation",
    question: "What is digital transformation for a growing business?",
    answer:
      "For a growing business, digital transformation means replacing manual workarounds and disconnected tools with connected systems — integrated CRM, ERP and operational platforms, custom applications where needed, and clean data flows — so the business can scale, serve customers better and adopt AI on a solid foundation.",
    howItWorks: [
      { title: "Map systems and data flows", body: "We document which tools hold which information and where data is re-typed or delayed between them." },
      { title: "Decide integrate, extend or replace", body: "For each system we weigh integrating it, extending it or replacing it, based on cost, risk and fit." },
      { title: "Deliver in stages", body: "Work is phased — highest-friction integrations or workflows first — so value arrives early and risk stays low." },
      { title: "Document and hand over", body: "Everything is documented and maintainable, with clear ownership so your team stays in control." },
    ],
    suitableFor: [
      "Businesses whose processes live in spreadsheets and email",
      "Companies with systems that don’t talk to each other",
      "Organisations running critical work on ageing or unsupported software",
      "Teams preparing for AI adoption that need clean data and APIs",
    ],
    limitations: [
      "Large “big bang” replacements carry high risk; staged modernisation is slower on paper but safer in practice.",
      "Integration effort depends on the APIs and data quality of the systems involved.",
      "New systems require adoption — training and change management are part of the work.",
      "Custom software needs ongoing maintenance; we recommend off-the-shelf tools where they fit well.",
    ],
    faqs: [
      {
        question: "Should we replace our existing systems or integrate them?",
        answer:
          "Integrate when a system does its job well but is isolated; replace when it can’t support how the business needs to work, is unsupported, or costs more to work around than to change. Many businesses do both — integrating core systems now and replacing the weakest ones in stages.",
      },
      {
        question: "How do CRM and ERP integrations work?",
        answer:
          "Integrations use the systems’ APIs to keep shared records — customers, products, orders, invoices — in sync automatically, so data is entered once. A clear “system of record” for each type of data prevents conflicts, and monitoring catches failed syncs before they cause problems.",
      },
      {
        question: "How do you plan a digital or AI transformation roadmap?",
        answer:
          "Start with business goals, map current systems and processes, identify the highest-friction problems, then sequence initiatives by value, dependency and risk — usually data and integration foundations before advanced AI. Each phase gets clear success measures and a decision point before the next.",
      },
    ],
    relatedInsights: ["digital-foundation-for-growth", "off-the-shelf-vs-custom-ai", "how-to-choose-an-ai-automation-partner"],
  },

  "web-app-development": {
    topic: "web and app development",
    question: "What does web and application development include?",
    answer:
      "Web and application development covers designing and building websites, customer portals and internal business applications — from user experience and content structure to code, integrations, accessibility, performance and search-friendliness — so the result is easy to use and straightforward to maintain.",
    howItWorks: [
      { title: "Define goals and users", body: "We clarify who the site or app is for, what they need to do and how success will be measured." },
      { title: "Design the journeys", body: "Structure, content and interface are designed around the decisions users need to make." },
      { title: "Build and integrate", body: "We develop on modern, well-supported technology, connecting forms and data to your CRM and other systems." },
      { title: "Launch and improve", body: "After launch we monitor performance, accessibility and conversions, and iterate." },
    ],
    suitableFor: [
      "Businesses whose website no longer reflects the quality of their work",
      "Companies that need a customer portal or self-service tools",
      "Teams replacing spreadsheet workarounds with an internal application",
    ],
    limitations: [
      "A website can only convert as well as the offer and content behind it — strategy and copy matter as much as code.",
      "Content migration and approvals often take longer than development.",
      "Custom applications need ongoing maintenance and hosting.",
    ],
    faqs: [
      {
        question: "Can you redesign our existing website?",
        answer:
          "Yes. We review what works today — content, search visibility, enquiries — so a redesign keeps what performs, fixes what doesn’t and preserves search rankings through careful redirects.",
      },
      {
        question: "Will the website be accessible and search-friendly?",
        answer:
          "We build to modern accessibility guidance (WCAG 2.2 AA as the target), with semantic structure, fast loading and technical SEO foundations such as metadata, sitemaps and structured data.",
      },
    ],
    relatedInsights: ["digital-foundation-for-growth", "marketing-data-to-decisions"],
  },

  "technology-integration": {
    topic: "technology integration",
    question: "What is technology integration?",
    answer:
      "Technology integration connects your business systems — CRM, ERP, e-commerce, finance, helpdesk and AI services — so information flows between them automatically and accurately, removing re-keying and giving every team the same up-to-date data.",
    howItWorks: [
      { title: "Map the data", body: "We identify which system owns each type of record and where data needs to move." },
      { title: "Choose the integration method", body: "Direct APIs, an integration platform or a custom service — chosen for reliability and maintainability." },
      { title: "Build with validation", body: "Every hand-off validates data and handles errors gracefully." },
      { title: "Monitor", body: "Alerts flag failed or delayed syncs so problems are fixed before they affect customers." },
    ],
    suitableFor: [
      "Teams re-typing the same data into several systems",
      "Businesses whose reports require combining exports by hand",
      "Companies adding AI tools that need access to existing systems",
    ],
    limitations: [
      "Systems without APIs need workarounds such as scheduled exports.",
      "Integrations need monitoring and occasional updates when connected products change.",
      "Poor data quality in a source system flows into every connected system until fixed.",
    ],
    faqs: [
      {
        question: "Which systems can you integrate?",
        answer:
          "Most cloud business systems with APIs — CRMs, ERPs, e-commerce platforms, accounting and helpdesk tools, and AI services. We confirm feasibility for your specific systems during discovery.",
      },
      {
        question: "What if one of our systems has no API?",
        answer:
          "Options include scheduled file exports and imports, email-based hand-offs, database-level access where appropriate, or replacing the system if the workaround costs more than the change.",
      },
    ],
    relatedInsights: ["digital-foundation-for-growth", "off-the-shelf-vs-custom-ai"],
  },

  "strategy-consulting": {
    topic: "strategy consulting",
    question: "What does business strategy and technology consulting involve?",
    answer:
      "Business strategy and technology consulting helps leadership teams decide where to invest — clarifying growth priorities, assessing readiness for AI and digital change, and building a realistic, sequenced roadmap with business cases and success measures.",
    howItWorks: [
      { title: "Understand goals and constraints", body: "We start with commercial objectives, budget, capacity and timing." },
      { title: "Assess readiness", body: "Processes, data, systems and skills are reviewed to see what is ready for AI and what needs work first." },
      { title: "Prioritise and sequence", body: "Initiatives are ranked by value, effort and dependency into a phased roadmap." },
      { title: "Plan delivery and adoption", body: "Each phase gets owners, measures and a change plan so the strategy is executed, not shelved." },
    ],
    suitableFor: [
      "Leadership teams unsure where AI will genuinely help",
      "Businesses comparing vendors or tools before committing",
      "Companies needing a business case for technology investment",
    ],
    limitations: [
      "A roadmap is only as good as the information behind it — open access to people and data matters.",
      "Priorities change; roadmaps should be revisited at each phase gate.",
    ],
    faqs: [
      {
        question: "What is an AI readiness assessment?",
        answer:
          "An AI readiness assessment reviews your processes, data, systems, skills and governance to identify where AI can help now, what needs preparing first, and the right order to invest. Our free AI Opportunity Finder gives a quick preliminary view.",
      },
      {
        question: "Do you recommend specific software vendors?",
        answer:
          "We recommend tools based on your requirements, existing systems and budget, and we explain the trade-offs. Where off-the-shelf software fits well, we will say so rather than propose a custom build.",
      },
    ],
    relatedInsights: ["how-to-choose-an-ai-automation-partner", "where-to-start-with-ai-small-business", "off-the-shelf-vs-custom-ai"],
  },
};
