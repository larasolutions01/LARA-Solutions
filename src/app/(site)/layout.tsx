import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { CursorFollower } from "@/components/ui/CursorFollower";
import { AssistantLauncher } from "@/components/tools/AssistantLauncher";
import { assistantEnabled } from "@/lib/features";

/** Marketing website chrome: header, footer, smooth scroll, cursor and the (optional) assistant. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
      {assistantEnabled() && <AssistantLauncher />}
      <CursorFollower />
      <SmoothScroll />
    </>
  );
}
