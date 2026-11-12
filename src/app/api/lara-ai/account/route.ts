import { authenticate, deleteAuthUser, supabaseServerConfig } from "@/lib/lara-ai/server/supabase";
import { AUTH_MESSAGES, reply } from "@/lib/lara-ai/server/respond";
import { site } from "@/content/site";

/** DELETE /api/lara-ai/account — permanently delete the signed-in member's account and profile. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(request: Request) {
  const auth = await authenticate(request);
  if (!auth.ok) return reply(auth.status, { error: AUTH_MESSAGES[auth.code], code: auth.code });
  if (!supabaseServerConfig().serviceKey) {
    return reply(501, {
      error: `Online account deletion isn't switched on yet. Email ${site.contact.email} from your account's address and we'll delete it for you.`,
      code: "not_supported",
    });
  }
  try {
    await deleteAuthUser(auth.user.id);
    return reply(200, { deleted: true });
  } catch (e) {
    console.error("[lara-ai] account delete failed", (e as Error).message);
    return reply(503, { error: "We couldn't delete your account just now. Please try again, or email us.", code: "delete_failed" });
  }
}
