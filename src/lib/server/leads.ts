import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

/**
 * Lead delivery pipeline (server only).
 *
 * Channels are enabled purely by environment variables:
 *  - Supabase (persistent storage)      SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 *  - Email notification via Resend      RESEND_API_KEY + LEAD_NOTIFICATION_EMAIL (+ EMAIL_FROM)
 *  - CRM / automation webhook           CRM_WEBHOOK_URL (+ CRM_WEBHOOK_SECRET)
 *  - Local NDJSON file (development)    automatic when NODE_ENV !== "production"
 *
 * A submission succeeds when at least one *durable* channel (storage, email,
 * or CRM) accepts it. If nothing is configured in production we fail loudly
 * instead of silently dropping the enquiry.
 */

export type LeadType = "contact" | "roadmap" | "assistant" | "newsletter" | "lara_ai_signup";

export interface Lead {
  type: LeadType;
  name?: string;
  email: string;
  company?: string;
  phone?: string;
  country?: string;
  industry?: string;
  service?: string;
  budget?: string;
  message?: string;
  details?: Record<string, unknown>;
  consent: boolean;
  meta: { ip: string; userAgent?: string; referer?: string };
}

export interface StoredLead extends Lead {
  id: string;
  createdAt: string;
}

export type ChannelName = "supabase" | "email" | "crm" | "file";

export interface DeliveryReport {
  ok: boolean;
  id: string;
  delivered: ChannelName[];
  failed: { channel: ChannelName; error: string }[];
  configured: ChannelName[];
}

type Env = Record<string, string | undefined>;

export function configuredChannels(env: Env = process.env): ChannelName[] {
  const list: ChannelName[] = [];
  if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) list.push("supabase");
  if (env.RESEND_API_KEY && env.LEAD_NOTIFICATION_EMAIL) list.push("email");
  if (env.CRM_WEBHOOK_URL) list.push("crm");
  if (env.NODE_ENV !== "production" || env.LEADS_FILE_STORE === "true") list.push("file");
  return list;
}

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);

async function toSupabase(lead: StoredLead, env: Env) {
  const res = await fetch(`${env.SUPABASE_URL!.replace(/\/$/, "")}/rest/v1/${env.SUPABASE_LEADS_TABLE ?? "leads"}`, {
    method: "POST",
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY!,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      id: lead.id,
      created_at: lead.createdAt,
      type: lead.type,
      name: lead.name ?? null,
      email: lead.email,
      company: lead.company ?? null,
      phone: lead.phone ?? null,
      country: lead.country ?? null,
      industry: lead.industry ?? null,
      service: lead.service ?? null,
      budget: lead.budget ?? null,
      message: lead.message ?? null,
      details: lead.details ?? null,
      consent: lead.consent,
      source_ip: lead.meta.ip,
      user_agent: lead.meta.userAgent ?? null,
      referer: lead.meta.referer ?? null,
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Supabase responded ${res.status}`);
}

function renderEmail(lead: StoredLead) {
  const rows: [string, string | undefined][] = [
    ["Type", lead.type],
    ["Name", lead.name],
    ["Email", lead.email],
    ["Business", lead.company],
    ["Phone", lead.phone],
    ["Country", lead.country],
    ["Industry", lead.industry],
    ["Service of interest", lead.service],
    ["Budget", lead.budget],
    ["Message", lead.message],
    ["Details", lead.details ? JSON.stringify(lead.details, null, 2) : undefined],
    ["Received", lead.createdAt],
    ["Reference", lead.id],
  ];
  const html = `<h2 style="font-family:sans-serif">New ${escapeHtml(lead.type)} enquiry — LARA Solutions website</h2><table cellpadding="6" style="font-family:sans-serif;font-size:14px;border-collapse:collapse">${rows
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="color:#555;vertical-align:top"><strong>${escapeHtml(k)}</strong></td><td style="white-space:pre-wrap">${escapeHtml(String(v))}</td></tr>`)
    .join("")}</table>`;
  const text = rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("\n");
  return { html, text };
}

async function toEmail(lead: StoredLead, env: Env) {
  const { html, text } = renderEmail(lead);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.EMAIL_FROM ?? "LARA Solutions Website <onboarding@resend.dev>",
      to: env.LEAD_NOTIFICATION_EMAIL!.split(",").map((s) => s.trim()),
      reply_to: lead.email,
      subject: `New ${lead.type} enquiry${lead.company ? ` from ${lead.company}` : ""}`,
      html,
      text,
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Email provider responded ${res.status}`);
}

async function toCrm(lead: StoredLead, env: Env) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (env.CRM_WEBHOOK_SECRET) headers["X-Webhook-Secret"] = env.CRM_WEBHOOK_SECRET;
  const res = await fetch(env.CRM_WEBHOOK_URL!, {
    method: "POST",
    headers,
    body: JSON.stringify({ event: "lead.created", lead: { ...lead, meta: undefined } }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`CRM webhook responded ${res.status}`);
}

async function toFile(lead: StoredLead, env: Env) {
  const dir = env.LEADS_FILE_DIR ? path.resolve(/*turbopackIgnore: true*/ env.LEADS_FILE_DIR) : path.join(process.cwd(), ".data");
  await fs.mkdir(dir, { recursive: true });
  await fs.appendFile(path.join(dir, "leads.ndjson"), JSON.stringify(lead) + "\n", "utf8");
}

const handlers: Record<ChannelName, (lead: StoredLead, env: Env) => Promise<void>> = {
  supabase: toSupabase,
  email: toEmail,
  crm: toCrm,
  file: toFile,
};

export async function deliverLead(lead: Lead, env: Env = process.env): Promise<DeliveryReport> {
  const stored: StoredLead = { ...lead, id: randomUUID(), createdAt: new Date().toISOString() };
  const configured = configuredChannels(env);

  const results = await Promise.allSettled(configured.map((c) => handlers[c](stored, env)));
  const delivered: ChannelName[] = [];
  const failed: DeliveryReport["failed"] = [];
  results.forEach((r, i) => {
    const channel = configured[i]!;
    if (r.status === "fulfilled") delivered.push(channel);
    else failed.push({ channel, error: r.reason instanceof Error ? r.reason.message : String(r.reason) });
  });

  if (failed.length) console.error("[leads] channel failures", { id: stored.id, failed });

  return { ok: delivered.length > 0, id: stored.id, delivered, failed, configured };
}
