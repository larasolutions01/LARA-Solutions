import { assistantLeadSchema } from "@/lib/validation";
import { handleSubmission } from "@/lib/server/submission";
import { assistantEnabled } from "@/lib/features";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!assistantEnabled()) return Response.json({ error: "Not found" }, { status: 404 });
  return handleSubmission(request, {
    schema: assistantLeadSchema,
    successMessage: "Thanks — your request is with our team and we’ll reply by email.",
    toLead: (d, meta) => ({
      type: "assistant",
      name: d.fullName,
      email: d.email,
      message: d.message,
      consent: d.consent,
      meta,
    }),
  });
}
