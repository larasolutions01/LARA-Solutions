import { roadmapSchema } from "@/lib/validation";
import { handleSubmission } from "@/lib/server/submission";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handleSubmission(request, {
    schema: roadmapSchema,
    successMessage: "Request received. We’ll review your answers and contact you to arrange your growth roadmap conversation.",
    toLead: (d, meta) => ({
      type: "roadmap",
      name: d.fullName,
      email: d.email,
      company: d.businessName,
      industry: d.answers.industry,
      message: `Opportunity Finder — challenge: ${d.answers.challenge}; size: ${d.answers.size}; goal: ${d.answers.goal}; technology: ${d.answers.tech ?? "n/a"}; repetitive work: ${(d.answers.areas ?? []).join(", ") || "n/a"}`,
      details: { answers: d.answers, suggestedOpportunities: d.opportunities },
      consent: d.consent,
      meta,
    }),
  });
}
