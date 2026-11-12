import { contactSchema } from "@/lib/validation";
import { handleSubmission } from "@/lib/server/submission";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handleSubmission(request, {
    schema: contactSchema,
    successMessage: "Thank you — your enquiry has been received. We’ll be in touch shortly.",
    toLead: (d, meta) => ({
      type: "contact",
      name: d.fullName,
      email: d.email,
      company: d.businessName,
      phone: d.phone,
      country: d.country,
      industry: d.industry,
      service: d.service,
      budget: d.budget,
      message: d.message,
      consent: d.consent,
      meta,
    }),
  });
}
