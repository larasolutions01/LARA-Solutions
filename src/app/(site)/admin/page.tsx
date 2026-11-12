import type { Metadata } from "next";
import Link from "next/link";
import { Download, FileEdit, Inbox, LogOut } from "lucide-react";
import { logout, requireAdmin, setLeadStatus } from "./actions";
import { LEAD_STATUSES, leadSource, listLeads } from "@/lib/server/leads-store";
import { formatDate, cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Lead inbox", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const TYPES = ["contact", "roadmap", "assistant", "newsletter"] as const;

export default async function AdminPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  await requireAdmin();
  const sp = await searchParams;
  const type = TYPES.includes(sp.type as (typeof TYPES)[number]) ? sp.type : undefined;
  const source = leadSource();
  let leads: Awaited<ReturnType<typeof listLeads>> = [];
  let error: string | undefined;
  try {
    leads = await listLeads({ type });
  } catch (e) {
    error = e instanceof Error ? e.message : "Could not load leads.";
  }

  return (
    <>
      <section className="theme-dark section-theme pb-10 pt-32">
        <div className="container-x flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Admin</p>
            <h1 className="mt-2 flex items-center gap-3 text-3xl font-semibold text-white">
              <Inbox aria-hidden className="size-7 text-aqua" /> Lead inbox
            </h1>
            <p className="mt-2 text-sm text-white/70">
              Source: {source === "supabase" ? "Supabase" : source === "file" ? "local development file (.data/leads.ndjson)" : "not configured"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="/cms/" className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-white">
              <FileEdit aria-hidden className="size-4" /> Content manager
            </a>
            <a href={`/admin/leads.csv${type ? `?type=${type}` : ""}`} className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-white">
              <Download aria-hidden className="size-4" /> Export CSV
            </a>
            <form action={logout}>
              <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink">
                <LogOut aria-hidden className="size-4" /> Sign out
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="theme-light section-theme py-10">
        <div className="container-x">
          <nav aria-label="Filter by type" className="flex flex-wrap gap-2">
            {[undefined, ...TYPES].map((t) => (
              <Link
                key={t ?? "all"}
                href={t ? `/admin?type=${t}` : "/admin"}
                aria-current={type === t ? "page" : undefined}
                className={cn("rounded-full border px-3.5 py-1.5 text-sm capitalize", type === t ? "border-electric bg-electric text-white" : "border-line-strong bg-white text-body hover:border-electric")}
              >
                {t ?? "All"}
              </Link>
            ))}
          </nav>

          {error && <p className="mt-6 rounded-xl bg-danger/10 p-4 text-sm text-danger">{error}</p>}

          {leads.length === 0 && !error ? (
            <p className="mt-10 rounded-2xl border border-dashed border-line-strong bg-white p-10 text-center text-body">No leads yet.</p>
          ) : (
            <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-white">
              <table className="w-full min-w-[960px] text-left text-sm">
                <thead className="bg-section-tint text-xs uppercase tracking-wider text-muted">
                  <tr>
                    <th className="px-4 py-3">Received</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">Business</th>
                    <th className="px-4 py-3">Interest</th>
                    <th className="px-4 py-3">Message</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {leads.map((l) => (
                    <tr key={l.id} className="align-top">
                      <td className="whitespace-nowrap px-4 py-3 text-muted">{formatDate(l.createdAt)}</td>
                      <td className="px-4 py-3 capitalize text-fg">{l.type}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-fg">{l.name ?? "—"}</p>
                        <a href={`mailto:${l.email}`} className="text-accent hover:underline">
                          {l.email}
                        </a>
                        {l.phone && <p className="text-muted">{l.phone}</p>}
                      </td>
                      <td className="px-4 py-3 text-body">
                        {l.company ?? "—"}
                        {l.industry && <p className="text-xs text-muted">{l.industry}</p>}
                        {l.country && <p className="text-xs text-muted">{l.country}</p>}
                      </td>
                      <td className="px-4 py-3 text-body">
                        {l.service ?? "—"}
                        {l.budget && <p className="text-xs text-muted">{l.budget}</p>}
                      </td>
                      <td className="max-w-sm px-4 py-3 text-body">
                        <p className="line-clamp-3 whitespace-pre-wrap">{l.message ?? "—"}</p>
                      </td>
                      <td className="px-4 py-3">
                        {source === "supabase" ? (
                          <form action={setLeadStatus} className="flex items-center gap-2">
                            <input type="hidden" name="id" value={l.id} />
                            <label htmlFor={`st-${l.id}`} className="sr-only">
                              Status
                            </label>
                            <select id={`st-${l.id}`} name="status" defaultValue={l.status} className="rounded-lg border border-line-strong bg-white px-2 py-1 text-sm">
                              {LEAD_STATUSES.map((s) => (
                                <option key={s}>{s}</option>
                              ))}
                            </select>
                            <button type="submit" className="rounded-lg bg-ink px-2.5 py-1 text-xs font-semibold text-white">
                              Save
                            </button>
                          </form>
                        ) : (
                          <span className="rounded-full bg-section-tint px-2.5 py-1 text-xs text-muted">{l.status}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="mt-6 text-xs text-muted">Showing the most recent {leads.length} leads. Personal data — handle in line with the privacy policy.</p>
        </div>
      </section>
    </>
  );
}
