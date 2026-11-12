import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/server/admin-auth";
import { leadsToCsv, listLeads } from "@/lib/server/leads-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const jar = await cookies();
  if (!(await verifySessionToken(jar.get(ADMIN_COOKIE)?.value))) {
    return new Response("Unauthorized", { status: 401 });
  }
  const type = new URL(request.url).searchParams.get("type") ?? undefined;
  const csv = leadsToCsv(await listLeads({ type, limit: 5000 }));
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="lara-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
