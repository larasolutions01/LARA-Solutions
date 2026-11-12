"use client";

import { useActionState } from "react";
import { Lock } from "lucide-react";
import { login, type LoginState } from "../actions";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/forms/fields";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="mt-8 space-y-4">
      <div>
        <label htmlFor="admin-password" className="mb-2 block text-sm font-medium text-white">
          Password
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          aria-invalid={Boolean(state.error) || undefined}
          aria-describedby={state.error ? "admin-error" : undefined}
          className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white focus:border-aqua focus:outline-none"
        />
      </div>
      {state.error && (
        <p id="admin-error" role="alert" className="text-sm text-[#ff9b9b]">
          {state.error}
        </p>
      )}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? <Spinner /> : <Lock aria-hidden className="size-4" />} Sign in
      </Button>
    </form>
  );
}
