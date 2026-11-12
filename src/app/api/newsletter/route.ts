import { newsletterSchema } from "@/lib/validation";
import { handleSubmission } from "@/lib/server/submission";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handleSubmission(request, {
    schema: newsletterSchema,
    successMessage: "You’re subscribed. Thoughtful insights, no spam — unsubscribe any time.",
    toLead: (d, meta) => ({ type: "newsletter", email: d.email, consent: d.consent, meta }),
  });
}
