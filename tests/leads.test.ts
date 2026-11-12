import { afterEach, describe, expect, it, vi } from "vitest";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { configuredChannels, deliverLead, type Lead } from "@/lib/server/leads";
import { handleSubmission } from "@/lib/server/submission";
import { contactSchema } from "@/lib/validation";
import { createRateLimiter } from "@/lib/rate-limit";

const lead: Lead = { type: "contact", name: "Alex", email: "alex@example.com", consent: true, meta: { ip: "1.2.3.4" } };

afterEach(() => vi.unstubAllGlobals());

describe("lead delivery", () => {
  it("detects configured channels from env", () => {
    expect(configuredChannels({ NODE_ENV: "production" })).toEqual([]);
    expect(configuredChannels({ NODE_ENV: "development" })).toEqual(["file"]);
    expect(
      configuredChannels({ NODE_ENV: "production", SUPABASE_URL: "https://x.supabase.co", SUPABASE_SERVICE_ROLE_KEY: "k", RESEND_API_KEY: "r", LEAD_NOTIFICATION_EMAIL: "a@b.c", CRM_WEBHOOK_URL: "https://crm" }),
    ).toEqual(["supabase", "email", "crm"]);
  });

  it("fails (rather than silently dropping) when nothing is configured in production", async () => {
    const r = await deliverLead(lead, { NODE_ENV: "production" });
    expect(r.ok).toBe(false);
    expect(r.configured).toEqual([]);
  });

  it("writes to the local file store in development", async () => {
    const dir = mkdtempSync(path.join(tmpdir(), "lara-leads-"));
    try {
      const r = await deliverLead(lead, { NODE_ENV: "development", LEADS_FILE_DIR: dir });
      expect(r.ok).toBe(true);
      const line = JSON.parse(readFileSync(path.join(dir, "leads.ndjson"), "utf8").trim());
      expect(line.email).toBe("alex@example.com");
      expect(line.id).toBe(r.id);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("succeeds if at least one channel succeeds and reports failures", async () => {
    const fetchMock = vi.fn(async (url: string) => (String(url).includes("resend") ? new Response("{}", { status: 200 }) : new Response("err", { status: 500 })));
    vi.stubGlobal("fetch", fetchMock);
    const r = await deliverLead(lead, {
      NODE_ENV: "production",
      SUPABASE_URL: "https://x.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: "k",
      RESEND_API_KEY: "r",
      LEAD_NOTIFICATION_EMAIL: "team@example.com",
    });
    expect(r.ok).toBe(true);
    expect(r.delivered).toEqual(["email"]);
    expect(r.failed.map((f) => f.channel)).toEqual(["supabase"]);
  });
});

function req(body: unknown, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": "9.9.9.9", ...headers },
    body: JSON.stringify(body),
  });
}

const goodBody = {
  fullName: "Alex Example",
  businessName: "Example Co",
  email: "alex@example.com",
  industry: "Manufacturing",
  service: "Not sure yet — I need advice",
  message: "We would like help automating our order processing workflow.",
  consent: true,
  website: "",
  startedAt: 1,
};

describe("submission pipeline", () => {
  const base = () => ({
    schema: contactSchema,
    successMessage: "ok",
    toLead: (d: { email: string }, meta: Lead["meta"]) => ({ type: "contact" as const, email: d.email, consent: true, meta }),
    limiter: createRateLimiter({ limit: 100, windowMs: 60000 }),
    now: () => 100_000,
  });

  it("delivers a valid submission", async () => {
    const deliver = vi.fn(async () => ({ ok: true, id: "abc", delivered: ["file" as const], failed: [], configured: ["file" as const] }));
    const res = await handleSubmission(req(goodBody), { ...base(), deliver });
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ ok: true, id: "abc" });
    expect(deliver).toHaveBeenCalledOnce();
  });

  it("returns field errors for invalid input", async () => {
    const deliver = vi.fn();
    const res = await handleSubmission(req({ ...goodBody, email: "bad" }), { ...base(), deliver });
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.fieldErrors.email).toBeDefined();
    expect(deliver).not.toHaveBeenCalled();
  });

  it("silently discards honeypot and too-fast submissions", async () => {
    const deliver = vi.fn();
    const r1 = await handleSubmission(req({ ...goodBody, website: "http://spam" }), { ...base(), deliver });
    const r2 = await handleSubmission(req({ ...goodBody, startedAt: 99_000 }), { ...base(), deliver });
    expect(r1.status).toBe(200);
    expect(r2.status).toBe(200);
    expect(deliver).not.toHaveBeenCalled();
  });

  it("rate limits repeated submissions", async () => {
    const deliver = vi.fn(async () => ({ ok: true, id: "x", delivered: ["file" as const], failed: [], configured: ["file" as const] }));
    const limiter = createRateLimiter({ limit: 1, windowMs: 60000 });
    await handleSubmission(req(goodBody), { ...base(), limiter, deliver });
    const res = await handleSubmission(req(goodBody), { ...base(), limiter, deliver });
    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBeTruthy();
  });

  it("returns 503 when delivery is not configured", async () => {
    const deliver = vi.fn(async () => ({ ok: false, id: "x", delivered: [], failed: [], configured: [] }));
    const res = await handleSubmission(req(goodBody), { ...base(), deliver });
    expect(res.status).toBe(503);
  });

  it("rejects non-JSON requests", async () => {
    const res = await handleSubmission(new Request("http://localhost/api/contact", { method: "POST", body: "a=b", headers: { "content-type": "application/x-www-form-urlencoded" } }), base());
    expect(res.status).toBe(415);
  });
});
