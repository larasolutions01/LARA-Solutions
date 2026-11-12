import { z } from "zod";

/**
 * The details a LARA AI member gives at sign-up (browser + server share these
 * rules). Email comes from the verified account, never from this form.
 */
export const PROFILE_LIMITS = { fullName: 100, businessName: 120, phone: 24 } as const;

const phone = z
  .string()
  .trim()
  .max(PROFILE_LIMITS.phone, "Please enter a valid phone number.")
  .refine((v) => v === "" || (/^\+?[\d\s()-]+$/.test(v) && (v.match(/\d/g)?.length ?? 0) >= 7 && (v.match(/\d/g)?.length ?? 0) <= 15), "Please enter a valid phone number, e.g. +91 98765 43210.");

export const profileSchema = z
  .object({
    fullName: z.string().trim().min(2, "Please enter your full name.").max(PROFILE_LIMITS.fullName, "Please keep this under 100 characters."),
    businessName: z.string().trim().max(PROFILE_LIMITS.businessName, "Please keep this under 120 characters.").default(""),
    phone: phone.default(""),
    newsletter: z.boolean().default(false),
    acceptTerms: z.literal(true, "Please accept the Terms and Privacy Policy to continue."),
  })
  .strict();

export type ProfileInput = z.input<typeof profileSchema>;
export type ProfileValues = z.output<typeof profileSchema>;

/** A member profile as the app sees it. */
export interface LaraAiProfile {
  email: string;
  fullName: string;
  businessName: string;
  phone: string;
  newsletter: boolean;
  signupMethod: "email" | "google";
  createdAt: string;
}

/** First field error per key, for showing under form inputs. */
export function fieldErrorsOf(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const k = String(issue.path[0] ?? "");
    if (k && !out[k]) out[k] = issue.message;
  }
  return out;
}

/** Sign-up form data kept in Supabase user metadata until the profile row is created. */
export interface SignupMetadata {
  full_name?: string;
  business_name?: string;
  phone?: string;
  newsletter?: boolean;
  accept_terms?: boolean;
  /** Set by the LARA AI sign-up form, so the profile can be created without asking again. */
  lara_signup_form?: boolean;
  // Google provides these.
  name?: string;
}

/** Profile input recovered from sign-up metadata, or null if the form wasn't used. */
export function profileFromMetadata(meta: SignupMetadata | null | undefined): ProfileInput | null {
  if (!meta?.lara_signup_form || meta.accept_terms !== true) return null;
  return {
    fullName: meta.full_name ?? "",
    businessName: meta.business_name ?? "",
    phone: meta.phone ?? "",
    newsletter: meta.newsletter === true,
    acceptTerms: true,
  };
}
