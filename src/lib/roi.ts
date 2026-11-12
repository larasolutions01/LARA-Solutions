/**
 * Business Impact Simulator — illustrative efficiency estimator.
 * Pure functions; the assumptions are exported so the UI can show them
 * verbatim. Results are scenarios, never guarantees.
 */

export const ROI_ASSUMPTIONS = {
  /** Default working weeks per year (editable by the visitor). */
  workingWeeksPerYear: 46,
  /** Share of automatable time realistically recovered after reviews & exceptions (expected scenario). */
  realisationFactor: 0.7,
  /** Hours in a full-time working week, used for FTE equivalents. */
  hoursPerFte: 40,
} as const;

/** Scenario realisation factors — how much of the automatable time is actually recovered. */
export const SCENARIOS = [
  { key: "conservative", label: "Conservative", factor: 0.5 },
  { key: "expected", label: "Expected", factor: ROI_ASSUMPTIONS.realisationFactor },
  { key: "ambitious", label: "Ambitious", factor: 0.85 },
] as const;

export type ScenarioKey = (typeof SCENARIOS)[number]["key"];

export interface RoiInput {
  employees: number;
  hoursPerWeek: number; // repetitive hours per employee per week
  hourlyCost: number; // fully-loaded cost per hour
  automationPct: number; // 0–100
  workingWeeks?: number; // per year
}

export interface RoiResult {
  weeklyHoursSaved: number;
  annualHoursSaved: number;
  weeklyCostEquivalent: number;
  annualCostEquivalent: number;
  fteEquivalent: number;
  /** Share of total working time currently spent on repetitive tasks (0–1). */
  repetitiveShare: number;
  /** Share of repetitive time that could be recovered (0–1). */
  recoveredShare: number;
}

const clamp = (n: number, min: number, max: number) => (Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : min);

export function sanitizeRoiInput(input: RoiInput): Required<RoiInput> {
  return {
    employees: Math.round(clamp(input.employees, 0, 100000)),
    hoursPerWeek: clamp(input.hoursPerWeek, 0, 60),
    hourlyCost: clamp(input.hourlyCost, 0, 10000),
    automationPct: clamp(input.automationPct, 0, 100),
    workingWeeks: Math.round(clamp(input.workingWeeks ?? ROI_ASSUMPTIONS.workingWeeksPerYear, 1, 52)),
  };
}

export function estimateRoi(raw: RoiInput, realisationFactor: number = ROI_ASSUMPTIONS.realisationFactor): RoiResult {
  const i = sanitizeRoiInput(raw);
  const factor = clamp(realisationFactor, 0, 1);
  const weeklyHoursSaved = i.employees * i.hoursPerWeek * (i.automationPct / 100) * factor;
  const annualHoursSaved = weeklyHoursSaved * i.workingWeeks;
  return {
    weeklyHoursSaved,
    annualHoursSaved,
    weeklyCostEquivalent: weeklyHoursSaved * i.hourlyCost,
    annualCostEquivalent: annualHoursSaved * i.hourlyCost,
    fteEquivalent: annualHoursSaved / (ROI_ASSUMPTIONS.hoursPerFte * i.workingWeeks),
    repetitiveShare: Math.min(1, i.hoursPerWeek / ROI_ASSUMPTIONS.hoursPerFte),
    recoveredShare: (i.automationPct / 100) * factor,
  };
}

export function estimateScenarios(raw: RoiInput) {
  return SCENARIOS.map((s) => ({ ...s, result: estimateRoi(raw, s.factor) }));
}

/** Suggest services based on the shape of the inputs (transparent heuristics). */
export function recommendedServices(raw: RoiInput): string[] {
  const i = sanitizeRoiInput(raw);
  const out: string[] = ["ai-automation"];
  if (i.automationPct < 35 || i.hoursPerWeek > 12) out.push("process-optimization");
  if (i.employees >= 20) out.push("data-analytics");
  if (i.employees >= 50) out.push("technology-integration");
  return out.slice(0, 3);
}
