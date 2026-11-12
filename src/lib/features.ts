/**
 * Feature switches. Read on the server at request/build time.
 *
 * Website assistant (chat bubble + /api/assistant + /api/assistant-lead):
 * OFF unless NEXT_PUBLIC_ENABLE_ASSISTANT=true. Turned off for now at the
 * owner's request; all code is kept so it can be switched back on.
 */
export function assistantEnabled(env: Record<string, string | undefined> = process.env) {
  return env.NEXT_PUBLIC_ENABLE_ASSISTANT?.trim().toLowerCase() === "true";
}
