import { describe, expect, it } from "vitest";
import { adminConfigured, checkPassword, createSessionToken, SESSION_TTL_MS, verifySessionToken } from "@/lib/server/admin-auth";
import { leadsToCsv, type AdminLead } from "@/lib/server/leads-store";

const env = { ADMIN_PASSWORD: "correct horse battery staple", ADMIN_SESSION_SECRET: "x".repeat(40) };

describe("admin authentication", () => {
  it("requires a strong password and secret to be enabled", () => {
    expect(adminConfigured({})).toBe(false);
    expect(adminConfigured({ ADMIN_PASSWORD: "short", ADMIN_SESSION_SECRET: "x".repeat(40) })).toBe(false);
    expect(adminConfigured(env)).toBe(true);
  });

  it("checks passwords", async () => {
    expect(await checkPassword("correct horse battery staple", env)).toBe(true);
    expect(await checkPassword("wrong", env)).toBe(false);
    expect(await checkPassword("anything", {})).toBe(false);
  });

  it("issues sessions that verify, expire and resist tampering", async () => {
    const now = 1_700_000_000_000;
    const token = await createSessionToken(env, now);
    expect(await verifySessionToken(token, env, now + 1000)).toBe(true);
    expect(await verifySessionToken(token, env, now + SESSION_TTL_MS + 1)).toBe(false);
    const [v, exp, sig] = token.split(".");
    expect(await verifySessionToken(`${v}.${Number(exp) + 999999}.${sig}`, env, now)).toBe(false);
    expect(await verifySessionToken(token, { ...env, ADMIN_SESSION_SECRET: "y".repeat(40) }, now)).toBe(false);
    expect(await verifySessionToken(undefined, env, now)).toBe(false);
  });
});

describe("lead CSV export", () => {
  it("escapes quotes and neutralises formula injection", () => {
    const lead: AdminLead = {
      id: "1",
      createdAt: "2026-11-07T00:00:00Z",
      type: "contact",
      name: '=HYPERLINK("http://evil")',
      email: "a@b.co",
      company: 'Acme "Ltd"',
      phone: null,
      country: null,
      industry: null,
      service: null,
      budget: null,
      message: "Hello",
      status: "new",
    };
    const csv = leadsToCsv([lead]);
    expect(csv).toContain(`"'=HYPERLINK(""http://evil"")"`);
    expect(csv).toContain(`"Acme ""Ltd"""`);
  });
});
