import Link from "next/link";
import { assistantEnabled } from "@/lib/features";
import { LegalPage } from "@/components/content/LegalPage";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/content/site";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How LARA Solutions collects, uses and protects personal information submitted through this website.",
  path: "/privacy",
});

export default function PrivacyPage() {
  const email = site.contact.email ?? "[privacy contact email]";
  return (
    <LegalPage title="Privacy Policy" path="/privacy" updated="7 November 2026">
      <p>
        This Privacy Policy explains how {site.legalName} (“LARA Solutions”, “we”, “us”) collects, uses and protects personal information when you visit
        this website or contact us. [Registered company details and address.]
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li>
          <strong>Information you provide:</strong> when you submit the contact form, the AI Opportunity Finder roadmap request{assistantEnabled() ? ", the website assistant consultation form" : ""} or the newsletter form, we collect the details you enter — such as your name, business name, email address, phone number,
          country, industry, areas of interest, budget range and message.
        </li>
        <li>
          <strong>Opportunity Finder answers:</strong> your answers are processed in your browser to show results. They are only sent to us if you request a
          personalised roadmap.
        </li>
        {assistantEnabled() && (
        <li>
          <strong>Website assistant:</strong> questions you type into the assistant are processed to generate an answer. If the AI-assisted mode is enabled, your
          question and recent messages in that chat are sent to Google&apos;s Gemini API solely to produce a reply, and are not used to identify you. On
          Gemini&apos;s free tier, Google states it may use submitted content to improve its products, so please don’t share personal, confidential or
          sensitive information in the chat.
        </li>
        )}
        <li id="ai-tools">
          <strong>Free AI tools (LARA AI Tools):</strong> what you type into a tool is sent to Google&apos;s Gemini API solely to generate your result. We do not
          store your inputs or results. The tools use Gemini&apos;s free tier, under which Google states it may use submitted content to improve its products, so
          please don&apos;t enter personal, confidential or sensitive information. Your IP address is held briefly in server memory to apply fair-use limits and is
          not stored.
        </li>
        <li>
          <strong>Technical information:</strong> for security and spam prevention we record your IP address, browser user agent and the referring page
          with each submission.
        </li>
        <li>
          <strong>Analytics:</strong> if enabled, we use analytics tools (such as Google Analytics) to understand how the website is used — only after you opt in through the cookie banner. You can change your choice at any time via “Cookie settings” in the footer.
        </li>
      </ul>

      <h2>How we use your information</h2>
      <ul>
        <li>To respond to your enquiry and arrange consultations you request.</li>
        <li>To send newsletters, only if you have subscribed — you can unsubscribe at any time.</li>
        <li>To protect the website against spam and abuse.</li>
        <li>To improve our website and services.</li>
      </ul>
      <p>We do not sell your personal information. [State legal bases for processing, e.g. consent and legitimate interests, where applicable.]</p>

      <h2>Service providers</h2>
      <p>
        We use trusted providers to operate this website, such as hosting, database storage, email delivery, CRM and analytics services. They process data
        on our behalf under appropriate agreements. [List providers once confirmed.]
      </p>

      <h2>International transfers</h2>
      <p>[Describe where data is stored and safeguards for international transfers, if applicable.]</p>

      <h2>Data retention</h2>
      <p>We keep enquiry data only as long as needed for the purposes above, then delete or anonymise it. [Specify retention periods.]</p>

      <h2>Your rights</h2>
      <p>
        Depending on where you live, you may have rights to access, correct, delete or restrict the use of your personal information, and to object to
        processing or withdraw consent. To exercise these rights, contact us at {email}.
      </p>

      <h2>Security</h2>
      <p>
        We use appropriate technical and organisational measures to protect your information, including encrypted connections, restricted access to stored
        data and keeping secret credentials out of the browser.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy can be sent to {email} or through our <Link href="/contact">contact page</Link>.
      </p>
    </LegalPage>
  );
}
