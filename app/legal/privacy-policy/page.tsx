import type { Metadata } from "next";
import { PageJsonLd } from "@/components/JsonLd";
import { SimplePage } from "@/components/SimplePage";
import { site } from "@/data/site";
import { createMetadata } from "@/seo/metadata";
import { pageTdk } from "@/seo/tdk";

const path = "/legal/privacy-policy";

export const metadata: Metadata = createMetadata(pageTdk.privacy, path);

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageJsonLd seo={pageTdk.privacy} path={path} />
      <SimplePage
        eyebrow="Legal / privacy"
        title="Scrap Mechanic Privacy Policy"
        intro="This policy explains what information may be processed when you browse the Scrap Mechanic Field Guide or use its browser-based tools."
      >
        <h2>Information you provide</h2>
        <p>
          The site does not offer user accounts, public comments, or save-file uploads.
          If you email us, we receive the address, message, and any information you
          choose to include. Do not send passwords, payment information, private save
          files, or other sensitive personal data.
        </p>
        <h2>Technical and usage data</h2>
        <p>
          Hosting providers may process routine request information such as IP address,
          browser type, device type, requested URL, timestamp, and error diagnostics to
          deliver the site, maintain security, and investigate service problems.
        </p>
        <h2>Cookies and local browser storage</h2>
        <p>
          Interactive checklists and calculators may retain temporary choices in your
          browser so a page can function as expected. The site does not use this local
          state to create a player account or read game files from your computer.
        </p>
        <h2>External services and links</h2>
        <p>
          Links to Steam, the Scrap Mechanic website, and other third-party services are
          governed by those services&apos; own privacy practices. Opening an external
          page may allow that provider to collect data independently of this site.
        </p>
        <h2>Retention, security, and requests</h2>
        <p>
          Routine technical logs are retained only as long as reasonably needed for
          operation, security, and legal obligations. No internet service can guarantee
          absolute security. To ask a privacy question or request action concerning an
          email you sent, contact{" "}
          <a className="text-link" href={`mailto:${site.email}`}>
            {site.email}
          </a>.
        </p>
        <h2>Policy changes</h2>
        <p>
          This policy may be revised when site features, hosting arrangements, or legal
          requirements change. Material changes will be reflected on this page before
          the affected feature is relied upon.
        </p>
      </SimplePage>
    </>
  );
}
