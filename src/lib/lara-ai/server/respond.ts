/** Shared JSON responses for the LARA AI API routes. */
export const reply = (status: number, body: Record<string, unknown>, headers: Record<string, string> = {}) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

export const AUTH_MESSAGES = {
  unavailable: "LARA AI is being set up. Please check back soon.",
  auth_required: "Please sign in to LARA AI to continue.",
  auth_unavailable: "We couldn't check your sign-in just now. Please try again in a moment.",
} as const;
