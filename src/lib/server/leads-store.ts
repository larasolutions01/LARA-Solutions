import { promises as fs } from "node:fs";
import path from "node:path";
import type { StoredLead } from "./leads";

/**
 * Read/update leads for the admin inbox.
 * Source: Supabase when configured; otherwise the local development file.
 */

export const LEAD_STATUSES = ["new", "contacted", "qualified", "closed", "spam"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export interface AdminLead {
  id: string;
  createdAt: string;
  type: string;
  name: string | null;
  email: string;
  company: string | null;
  phone: string | null;
  country: string | null;
  industry: string | null;
  service: string | null;
  budget: string | null;
  message: string | null;
  status: LeadStatus;
}

type Env = Record<string, string | undefined>;

export function leadSource(env: Env = process.env): "supabase" | "file" | "none" {
  if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) return "supabase";
  if (env.NODE_ENV !== "production" || env.LEADS_FILE_STORE === "true") return "file";
  return "none";
}

function supabaseHeaders(env: Env) {
  return {
    apikey: env.SUPABASE_SERVICE_ROLE_KEY!,
    Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
  };
}

const table = (env: Env) => `${env.SUPABASE_URL!.replace(/\/$/, "")}/rest/v1/${env.SUPABASE_LEADS_TABLE ?? "leads"}`;

export async function listLeads({ type, limit = 200 }: { type?: string; limit?: number } = {}, env: Env = process.env): Promise<AdminLead[]> {
  const source = leadSource(env);
  if (source === "supabase") {
    const q = new URLSearchParams({ select: "*", order: "created_at.desc", limit: String(limit) });
    if (type) q.set("type", `eq.${type}`);
    const res = await fetch(`${table(env)}?${q}`, { headers: supabaseHeaders(env), cache: "no-store", signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`Supabase responded ${res.status}`);
    const rows = (await res.json()) as Record<string, unknown>[];
    return rows.map((r) => ({
      id: String(r.id),
      createdAt: String(r.created_at),
      type: String(r.type),
      name: (r.name as string) ?? null,
      email: String(r.email),
      company: (r.company as string) ?? null,
      phone: (r.phone as string) ?? null,
      country: (r.country as string) ?? null,
      industry: (r.industry as string) ?? null,
      service: (r.service as string) ?? null,
      budget: (r.budget as string) ?? null,
      message: (r.message as string) ?? null,
      status: ((r.status as LeadStatus) ?? "new") as LeadStatus,
    }));
  }
  if (source === "file") {
    const file = env.LEADS_FILE_DIR ? path.resolve(/*turbopackIgnore: true*/ env.LEADS_FILE_DIR, "leads.ndjson") : path.join(process.cwd(), ".data", "leads.ndjson");
    let raw = "";
    try {
      raw = await fs.readFile(file, "utf8");
    } catch {
      return [];
    }
    return raw
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as StoredLead)
      .filter((l) => !type || l.type === type)
      .reverse()
      .slice(0, limit)
      .map((l) => ({
        id: l.id,
        createdAt: l.createdAt,
        type: l.type,
        name: l.name ?? null,
        email: l.email,
        company: l.company ?? null,
        phone: l.phone ?? null,
        country: l.country ?? null,
        industry: l.industry ?? null,
        service: l.service ?? null,
        budget: l.budget ?? null,
        message: l.message ?? null,
        status: "new" as const,
      }));
  }
  return [];
}

export async function updateLeadStatus(id: string, status: LeadStatus, env: Env = process.env) {
  if (leadSource(env) !== "supabase") throw new Error("Status updates require Supabase storage.");
  if (!/^[0-9a-f-]{36}$/i.test(id) || !LEAD_STATUSES.includes(status)) throw new Error("Invalid request.");
  const res = await fetch(`${table(env)}?id=eq.${id}`, {
    method: "PATCH",
    headers: { ...supabaseHeaders(env), Prefer: "return=minimal" },
    body: JSON.stringify({ status }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Supabase responded ${res.status}`);
}

export function leadsToCsv(leads: AdminLead[]) {
  const cols: (keyof AdminLead)[] = ["createdAt", "type", "status", "name", "email", "company", "phone", "country", "industry", "service", "budget", "message"];
  const esc = (v: unknown) => {
    const s = v == null ? "" : String(v);
    // Neutralise spreadsheet formula injection
    const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
    return `"${safe.replace(/"/g, '""')}"`;
  };
  return [cols.join(","), ...leads.map((l) => cols.map((c) => esc(l[c])).join(","))].join("\n");
}
