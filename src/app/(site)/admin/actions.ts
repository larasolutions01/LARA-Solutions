"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ADMIN_COOKIE, SESSION_TTL_MS, adminConfigured, checkPassword, createSessionToken, verifySessionToken } from "@/lib/server/admin-auth";
import { createRateLimiter, clientIp } from "@/lib/rate-limit";
import { LEAD_STATUSES, updateLeadStatus, type LeadStatus } from "@/lib/server/leads-store";

const loginLimiter = createRateLimiter({ limit: 5, windowMs: 15 * 60 * 1000 });

export interface LoginState {
  error?: string;
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!adminConfigured()) return { error: "The admin area is not configured on this server." };
  const ip = clientIp(await headers());
  if (!loginLimiter.check(ip).allowed) return { error: "Too many attempts. Please wait 15 minutes and try again." };

  const password = String(formData.get("password") ?? "");
  if (!(await checkPassword(password))) return { error: "Incorrect password." };

  const jar = await cookies();
  jar.set(ADMIN_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
  redirect("/admin");
}

export async function logout() {
  const jar = await cookies();
  jar.delete({ name: ADMIN_COOKIE, path: "/admin" });
  redirect("/admin/login");
}

export async function requireAdmin() {
  const jar = await cookies();
  if (!(await verifySessionToken(jar.get(ADMIN_COOKIE)?.value))) redirect("/admin/login");
}

export async function setLeadStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as LeadStatus;
  if (!LEAD_STATUSES.includes(status)) return;
  await updateLeadStatus(id, status);
  revalidatePath("/admin");
}
