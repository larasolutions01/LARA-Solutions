import { z } from "zod";
import { budgetOptions, industryOptions } from "@/content/site";
import { services } from "@/content/services";

/** Shared between the browser (instant feedback) and the server (authoritative). */

const trimmed = (min: number, max: number, label: string) =>
  z
    .string({ error: `${label} is required.` })
    .trim()
    .min(1, `${label} is required.`)
    .min(min, `${label} must be at least ${min} characters.`)
    .max(max, `${label} must be ${max} characters or fewer.`);

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Must be ${max} characters or fewer.`)
    .optional()
    .transform((v) => (v ? v : undefined));

export const serviceInterestOptions = [...services.map((s) => s.name), "Not sure yet — I need advice"] as const;

const email = z
  .string({ error: "Work email is required." })
  .trim()
  .min(1, "Work email is required.")
  .max(254)
  .pipe(z.email("Please enter a valid email address."));

const consent = z.literal(true, { error: "Please confirm you agree to be contacted." });

const phone = z
  .string()
  .trim()
  .max(32)
  .optional()
  .transform((v) => (v ? v : undefined))
  .refine((v) => !v || /^[+()\-.\s\d]{6,32}$/.test(v), "Please enter a valid phone number.");

export const contactSchema = z.object({
  fullName: trimmed(2, 120, "Full name"),
  businessName: trimmed(1, 160, "Business name"),
  email,
  phone,
  country: optionalText(80),
  industry: z.enum(industryOptions, { error: "Please choose your industry." }),
  service: z.enum(serviceInterestOptions, { error: "Please choose a service of interest." }),
  budget: z.enum(budgetOptions).optional(),
  message: trimmed(20, 4000, "Project description"),
  consent,
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;

export const roadmapSchema = z.object({
  fullName: trimmed(2, 120, "Full name"),
  businessName: trimmed(1, 160, "Business name"),
  email,
  consent,
  answers: z.object({
    industry: z.string().trim().max(80),
    challenge: z.string().trim().max(120),
    size: z.string().trim().max(60),
    goal: z.string().trim().max(80),
    tech: z.string().trim().max(80).optional(),
    areas: z.array(z.string().trim().max(60)).max(10).optional(),
  }),
  opportunities: z.array(z.string().max(200)).max(5).default([]),
});

export const assistantLeadSchema = z.object({
  fullName: trimmed(2, 120, "Name"),
  email,
  message: trimmed(5, 2000, "Message"),
  consent,
});

export const newsletterSchema = z.object({
  email,
  consent,
});

/** Anti-spam fields included by every public form. */
export const antiSpamSchema = z.object({
  /** Honeypot — must stay empty. */
  website: z.string().max(0).optional().or(z.literal("")),
  /** Epoch ms when the form was rendered; used as a time trap. */
  startedAt: z.number().int().positive().optional(),
  /** Optional Cloudflare Turnstile token. */
  turnstileToken: z.string().max(4096).optional(),
});

export type FieldErrors = Record<string, string>;

export function toFieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.length ? String(issue.path[0]) : "_form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
