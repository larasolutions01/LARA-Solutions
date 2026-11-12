import type { Metadata } from "next";
import { adminConfigured } from "@/lib/server/admin-auth";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  const configured = adminConfigured();
  return (
    <section className="theme-dark section-theme flex min-h-[80vh] items-center pb-20 pt-36">
      <div className="container-x max-w-md">
        <h1 className="text-3xl font-semibold text-white">Admin sign in</h1>
        <p className="mt-2 text-sm text-white/70">Lead inbox and content tools for the LARA Solutions team.</p>
        {configured ? (
          <LoginForm />
        ) : (
          <div className="mt-8 rounded-2xl border border-white/15 bg-white/5 p-5 text-sm text-white/80">
            The admin area is disabled because <code>ADMIN_PASSWORD</code> (12+ characters) and <code>ADMIN_SESSION_SECRET</code> (32+ characters) are not set.
            See the README for setup.
          </div>
        )}
      </div>
    </section>
  );
}
