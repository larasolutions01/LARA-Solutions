import { describe, expect, it } from "vitest";
import { contactSchema, newsletterSchema, roadmapSchema, toFieldErrors } from "@/lib/validation";

const valid = {
  fullName: "Alex Example",
  businessName: "Example Co",
  email: "alex@example.com",
  industry: "Manufacturing",
  service: "Data Analytics & Business Intelligence",
  message: "We want to automate our weekly reporting and improve forecasting.",
  consent: true,
};

describe("contactSchema", () => {
  it("accepts a valid submission and trims values", () => {
    const r = contactSchema.safeParse({ ...valid, fullName: "  Alex Example  ", phone: "" });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.fullName).toBe("Alex Example");
      expect(r.data.phone).toBeUndefined();
    }
  });

  it("rejects missing consent", () => {
    const r = contactSchema.safeParse({ ...valid, consent: false });
    expect(r.success).toBe(false);
    if (!r.success) expect(toFieldErrors(r.error).consent).toMatch(/agree/i);
  });

  it("rejects invalid email, short message and unknown industry", () => {
    const r = contactSchema.safeParse({ ...valid, email: "nope", message: "short", industry: "Space mining" });
    expect(r.success).toBe(false);
    if (!r.success) {
      const errs = toFieldErrors(r.error);
      expect(errs.email).toBeDefined();
      expect(errs.message).toBeDefined();
      expect(errs.industry).toBeDefined();
    }
  });

  it("rejects malformed phone numbers", () => {
    expect(contactSchema.safeParse({ ...valid, phone: "call me maybe" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, phone: "+44 20 7946 0000" }).success).toBe(true);
  });
});

describe("other schemas", () => {
  it("newsletter requires email + consent", () => {
    expect(newsletterSchema.safeParse({ email: "a@b.co", consent: true }).success).toBe(true);
    expect(newsletterSchema.safeParse({ email: "a@b.co" }).success).toBe(false);
  });

  it("roadmap carries finder answers", () => {
    const r = roadmapSchema.safeParse({
      fullName: "Sam",
      businessName: "Biz",
      email: "sam@biz.com",
      consent: true,
      answers: { industry: "Real Estate", challenge: "Generating more leads", size: "2–20 Employees", goal: "Increase Revenue" },
    });
    expect(r.success).toBe(true);
  });
});

describe("budget ranges", () => {
  it("are in Indian rupees", async () => {
    const { budgetOptions } = await import("@/content/site");
    expect(budgetOptions.filter((b) => b !== "Not sure yet").every((b) => b.includes("₹"))).toBe(true);
    expect(budgetOptions.some((b) => /USD|\$/.test(b))).toBe(false);
  });

  it("accepts a rupee budget and rejects an old USD one", () => {
    expect(contactSchema.safeParse({ ...valid, budget: "₹5 – 15 lakh" }).success).toBe(true);
    expect(contactSchema.safeParse({ ...valid, budget: "USD 5,000 – 15,000" }).success).toBe(false);
  });
});
