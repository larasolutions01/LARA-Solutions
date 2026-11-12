import Link from "next/link";
import { assistantEnabled } from "@/lib/features";
import { LegalPage } from "@/components/content/LegalPage";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/content/site";

export const metadata = pageMetadata({
  title: "Terms of Use",
  description: "Terms governing the use of the LARA Solutions website, its content and interactive tools.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" path="/terms" updated="7 November 2026">
      <p>
        These Terms of Use govern your use of this website operated by {site.legalName}. By using the website you agree to these terms. If you do not
        agree, please do not use the website.
      </p>

      <h2>Website content</h2>
      <p>
        Content on this website is provided for general information. It does not constitute professional, legal, financial or technical advice for your
        specific situation. We aim to keep information accurate but make no warranty that it is complete or current.
      </p>

      <h2>Interactive tools</h2>
      <p>
        The AI Opportunity Finder, Efficiency Estimator{assistantEnabled() ? " and website assistant" : ""} provide <strong>preliminary, illustrative information only</strong>. Results are
        generated from the inputs you provide using simple, transparent rules and stated assumptions. They are not guarantees of results, savings or
        outcomes, and should not be relied on as the basis for business decisions without a proper assessment.
      </p>
      <p>
        The free <strong>LARA AI Tools</strong> (caption, email, bio and SEO generators and GrowthMind Lite) produce AI-generated text that may be inaccurate or
        unsuitable. Review and edit every result before you use it, and make sure it is accurate and that you have the right to publish it. The tools are
        provided free, as is, with fair-use limits, and may change or be withdrawn at any time. Do not use them to create unlawful, misleading or harmful content.
      </p>

      <h2>Case studies and scenarios</h2>
      <p>
        Content labelled as an “illustrative scenario” describes how a challenge could be approached and is not a description of a completed client
        project. Client case studies are published only with the client’s approval.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The LARA Solutions name, logo, website design and content are owned by or licensed to {site.legalName}. You may not copy, reproduce or distribute
        them without permission, except for personal, non-commercial reference or sharing links to our pages.
      </p>

      <h2>Acceptable use</h2>
      <p>You must not misuse the website, including attempting to gain unauthorised access, submitting spam or malicious content, or disrupting its operation.</p>

      <h2>Third-party links</h2>
      <p>The website may link to third-party sites and services. We are not responsible for their content or practices.</p>

      <h2>Limitation of liability</h2>
      <p>[Limitation of liability clause to be completed by a legal adviser for the applicable jurisdiction.]</p>

      <h2>Governing law</h2>
      <p>[Governing law and jurisdiction to be confirmed.]</p>

      <h2>Changes</h2>
      <p>We may update these terms from time to time. The “last updated” date shows when they were last revised.</p>

      <h2>Contact</h2>
      <p>
        Questions about these terms can be sent through our <Link href="/contact">contact page</Link>. See also our <Link href="/privacy">Privacy Policy</Link>.
      </p>
    </LegalPage>
  );
}
