import type { ReactNode } from "react";
import { PageHero } from "@/components/ui/PageHero";

export function LegalPage({ title, path, updated, children }: { title: string; path: string; updated: string; children: ReactNode }) {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title={title}
        intro={<span className="text-base">Last updated: {updated}</span>}
        crumbs={[
          { name: "Home", path: "/" },
          { name: title, path },
        ]}
        className="pb-8 sm:pb-10"
      />
      <div className="container-x max-w-3xl pb-24">
        <div className="mb-10 rounded-2xl border border-line-strong bg-card p-4 text-sm text-body">
          <strong className="text-fg">Template notice:</strong> this document is a starting template provided with the website. It should be reviewed and
          completed by a qualified legal adviser for your jurisdiction before launch. Items in [square brackets] must be completed.
        </div>
        <div className="prose-lara">{children}</div>
      </div>
    </>
  );
}
