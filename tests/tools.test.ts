import { describe, expect, it } from "vitest";
import { areaOptions, challengeOptions, goalOptions, recommend, sizeOptions, techOptions, type FinderAnswers } from "@/lib/opportunity";
import { industryOptions } from "@/content/site";
import { services } from "@/content/services";
import { estimateRoi, estimateScenarios, recommendedServices, ROI_ASSUMPTIONS } from "@/lib/roi";
import { industries } from "@/content/industries";
import { matchFaq } from "@/lib/faq-match";
import { createRateLimiter } from "@/lib/rate-limit";

describe("Opportunity Finder", () => {
  it("returns three distinct, valid opportunities for every possible answer combination", () => {
    const slugs = new Set(services.map((s) => s.slug));
    for (const industry of industryOptions)
      for (const challenge of challengeOptions)
        for (const size of sizeOptions)
          for (const goal of goalOptions)
            for (const tech of [undefined, ...techOptions]) {
            const r = recommend({ industry, challenge, size, goal, tech });
            expect(r.opportunities).toHaveLength(3);
            expect(new Set(r.opportunities.map((o) => o.id)).size).toBe(3);
            r.services.forEach((s) => expect(slugs.has(s)).toBe(true));
            expect(r.firstSteps.length).toBeGreaterThanOrEqual(3);
          }
  });

  it("prioritises opportunities that match the stated challenge", () => {
    const a: FinderAnswers = { industry: "Retail & E-commerce", challenge: "Managing inventory and logistics", size: "21–100 Employees", goal: "Reduce Costs" };
    const r = recommend(a);
    expect(r.opportunities[0]!.service).toBe("supply-chain-intelligence");
    expect(r.opportunities[0]!.reasons.join(" ")).toMatch(/inventory/i);
  });

  it("boosts opportunities for selected areas of repetitive work and explains why", () => {
    const base: FinderAnswers = { industry: "Other", challenge: "Reducing operational costs", size: "21–100 Employees", goal: "Improve Efficiency" };
    const withDocs = recommend({ ...base, areas: ["documents", "reporting"] });
    const ids = withDocs.opportunities.map((o) => o.id);
    expect(ids).toContain("document-intelligence");
    expect(withDocs.opportunities.flatMap((o) => o.reasons).join(" ")).toMatch(/repetitive work/i);
    expect(withDocs.categories.length).toBeGreaterThan(0);
  });

  it("adds a technology-specific first step", () => {
    const r = recommend({ industry: "Logistics", challenge: "Scaling business operations", size: "101–500 Employees", goal: "Scale Faster", tech: "Some digital tools, not connected" });
    expect(r.firstSteps.join(" ")).toMatch(/systems hold your key data/i);
  });

  it("every area option maps to existing rules", () => {
    for (const a of areaOptions) {
      const r = recommend({ industry: "Other", challenge: "Automating repetitive processes", size: "2–20 Employees", goal: "Improve Efficiency", areas: [a.key] });
      expect(r.opportunities).toHaveLength(3);
    }
  });

  it("industry option labels match the industries content", () => {
    for (const ind of industries) expect(industryOptions).toContain(ind.optionLabel);
  });

  it("is deterministic", () => {
    const a: FinderAnswers = { industry: "Real Estate", challenge: "Generating more leads", size: "2–20 Employees", goal: "Increase Revenue" };
    expect(recommend(a)).toEqual(recommend(a));
  });
});

describe("ROI estimator", () => {
  it("applies the documented assumptions", () => {
    const r = estimateRoi({ employees: 10, hoursPerWeek: 5, hourlyCost: 40, automationPct: 50 });
    const weekly = 10 * 5 * 0.5 * ROI_ASSUMPTIONS.realisationFactor;
    expect(r.weeklyHoursSaved).toBeCloseTo(weekly);
    expect(r.annualHoursSaved).toBeCloseTo(weekly * ROI_ASSUMPTIONS.workingWeeksPerYear);
    expect(r.annualCostEquivalent).toBeCloseTo(weekly * ROI_ASSUMPTIONS.workingWeeksPerYear * 40);
  });

  it("respects the working weeks input and orders scenarios", () => {
    const r = estimateRoi({ employees: 10, hoursPerWeek: 5, hourlyCost: 40, automationPct: 50, workingWeeks: 40 });
    expect(r.annualHoursSaved).toBeCloseTo(r.weeklyHoursSaved * 40);
    const sc = estimateScenarios({ employees: 10, hoursPerWeek: 5, hourlyCost: 40, automationPct: 50 });
    expect(sc.map((s) => s.key)).toEqual(["conservative", "expected", "ambitious"]);
    expect(sc[0]!.result.annualHoursSaved).toBeLessThan(sc[2]!.result.annualHoursSaved);
    const slugs = new Set(services.map((s) => s.slug));
    recommendedServices({ employees: 80, hoursPerWeek: 15, hourlyCost: 40, automationPct: 20 }).forEach((s) => expect(slugs.has(s)).toBe(true));
  });

  it("clamps invalid input instead of producing NaN or negatives", () => {
    const r = estimateRoi({ employees: -5, hoursPerWeek: Number.NaN, hourlyCost: 20, automationPct: 400 });
    expect(r.weeklyHoursSaved).toBe(0);
    expect(Number.isFinite(r.annualCostEquivalent)).toBe(true);
  });
});

describe("FAQ assistant matching", () => {
  it("matches pricing questions", () => {
    expect(matchFaq("How much does this cost?")?.entry.id).toBe("pricing");
  });
  it("matches supply chain questions", () => {
    expect(matchFaq("Can you help with inventory forecasting?")?.entry.id).toBe("supply-chain");
  });
  it("returns null for unrelated queries", () => {
    expect(matchFaq("zxqv blorp")).toBeNull();
  });
});

describe("rate limiter", () => {
  it("blocks after the limit and recovers after the window", () => {
    let t = 0;
    const rl = createRateLimiter({ limit: 2, windowMs: 1000, now: () => t });
    expect(rl.check("ip").allowed).toBe(true);
    expect(rl.check("ip").allowed).toBe(true);
    const blocked = rl.check("ip");
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
    expect(rl.check("other").allowed).toBe(true);
    t = 1500;
    expect(rl.check("ip").allowed).toBe(true);
  });
});
