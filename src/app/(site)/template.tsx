/**
 * Smooth page transition on every route change (pure CSS, works without JS).
 * The animation must not leave a transform behind (see --animate-page-in):
 * pinned scroll sections inside rely on position: fixed.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-page-in">{children}</div>;
}
