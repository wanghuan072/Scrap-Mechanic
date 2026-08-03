import type { Metadata } from "next";
import Link from "next/link";
import { PageJsonLd } from "@/components/JsonLd";
import { SimplePage } from "@/components/SimplePage";
import { site } from "@/data/site";
import { createMetadata } from "@/seo/metadata";
import { pageTdk } from "@/seo/tdk";

const path = "/privacy-policy";

export const metadata: Metadata = createMetadata(pageTdk.privacy, path);

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageJsonLd seo={pageTdk.privacy} path={path} />
      <SimplePage
        eyebrow="Legal / privacy"
        title="Scrap Mechanic Privacy Policy"
        intro="This privacy policy explains what information may be processed when you browse the Scrap Mechanic Field Guide, search the site, use its tools, or contact us."
      >
        <h2>Scope of this privacy policy</h2>
        <p>
          This policy applies to pages and browser tools published on{" "}
          <a className="text-link" href={site.url}>
            scrapmechanic.org
          </a>
          . It does not control Steam, Axolot Games, Google, hosting providers, mod
          platforms, or other websites reached through an external link. Those services
          process information under their own policies.
        </p>
        <p>
          The site is an informational fan guide. It does not provide player accounts,
          paid memberships, checkout, public comments, direct messages, or save-file
          uploads. This limits the personal information that visitors can intentionally
          submit through the website.
        </p>
        <h2>Information you send by email</h2>
        <p>
          If you contact us, we receive your email address, message, delivery metadata,
          and any details or attachments you choose to include. This information is used
          to review the request, investigate a reported problem, respond when
          appropriate, maintain necessary correspondence, and address privacy or rights
          obligations.
        </p>
        <p>
          Do not send passwords, payment information, authentication codes, private save
          files, or sensitive personal data. A factual correction normally needs only a
          page URL, the disputed value, your game version and branch, mod status, and
          repeatable steps. The{" "}
          <Link className="text-link" href="/contact">
            contact page
          </Link>{" "}
          explains how to prepare a useful report.
        </p>
        <h2>Search queries and browser-tool inputs</h2>
        <p>
          A search entered in the site header is placed in the page URL as a query
          parameter. That URL may therefore appear in normal hosting logs and analytics
          page-view data. Do not enter personal or sensitive information into the site
          search field.
        </p>
        <p>
          Crafting and raid calculator inputs are processed in the current browser page
          to display a result. The tools do not upload a Scrap Mechanic save, inspect
          local game files, or create a server-side player profile. Inputs reset when the
          page state is discarded unless your browser independently restores a previous
          session.
        </p>
        <h2>Hosting and security logs</h2>
        <p>
          Hosting providers may process routine request information such as IP address,
          browser and device type, requested URL, referring page, timestamp, response
          status, and error diagnostics. This information is used to deliver pages,
          maintain availability, detect abuse, protect the service, and investigate
          technical failures.
        </p>
        <h2>Google Analytics</h2>
        <p>
          Google Analytics is used to measure page views, navigation patterns, and
          general site performance. The site loads the Google tag identified as
          G-NRMF3E7FTM. Google may process cookies or similar device identifiers,
          approximate location derived from an IP address, browser and device
          information, referring pages, visited URLs, and interactions with the site.
        </p>
        <p>
          Analytics information is used to understand which Scrap Mechanic guides, wiki
          entries, and tools are useful, identify navigation problems, and prioritize
          maintenance. The site does not connect Analytics data to a player account
          because the site does not provide accounts. Read the{" "}
          <a
            className="text-link"
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            Google Privacy Policy
          </a>{" "}
          for information about Google&apos;s processing and privacy controls.
        </p>
        <h2>Cookies and similar technologies</h2>
        <p>
          The site does not currently set account, shopping-cart, comment, or saved-tool
          cookies of its own. Google Analytics may use cookies or similar browser
          technologies when its script loads. Browser settings, privacy extensions, and
          network-level controls may allow you to limit or delete these identifiers, but
          blocking them can change how third-party analytics operates.
        </p>
        <h2>External services and links</h2>
        <p>
          Links may lead to Steam, the official Scrap Mechanic website, Google policies,
          mod platforms, or other third-party pages. When you open an external page, its
          operator may receive normal request data and process information independently
          of this site. A link does not mean that this site controls the destination&apos;s
          cookies, security, retention, or account practices.
        </p>
        <h2>Retention and data sharing</h2>
        <p>
          Technical and analytics retention periods depend on operational settings and
          the relevant service provider. Email correspondence is kept only as reasonably
          needed to handle the request, maintain a record of material corrections or
          rights decisions, protect the site, and meet applicable obligations. The site
          does not sell visitor contact details or calculator inputs.
        </p>
        <p>
          Information may be processed by service providers needed to host, secure,
          measure, or deliver the site. It may also be disclosed when reasonably
          necessary to comply with law, protect rights and safety, investigate abuse, or
          respond to a valid legal request.
        </p>
        <h2>Security and privacy requests</h2>
        <p>
          Reasonable steps are used to limit unnecessary collection and protect site
          operations, but no internet transmission or storage system can guarantee
          absolute security. To ask what information may be associated with an email you
          sent, request a correction or deletion where applicable, or raise another
          privacy concern, contact{" "}
          <a className="text-link" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          . We may need enough information to identify the relevant correspondence and
          confirm that the requester is authorized to act.
        </p>
        <h2>Policy changes</h2>
        <p>
          This policy may be revised when site features, analytics, hosting arrangements,
          or legal requirements change. The page and its Sitemap modification date are
          updated when a material change is published. Continued use after an update is
          subject to the version of the policy displayed on this page.
        </p>
      </SimplePage>
    </>
  );
}
