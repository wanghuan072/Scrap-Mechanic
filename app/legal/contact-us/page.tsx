import type { Metadata } from "next";
import { PageJsonLd } from "@/components/JsonLd";
import { SimplePage } from "@/components/SimplePage";
import { site } from "@/data/site";
import { createMetadata } from "@/seo/metadata";
import { pageTdk } from "@/seo/tdk";

const path = "/legal/contact-us";

export const metadata: Metadata = createMetadata(pageTdk.contact, path);

export default function ContactUsPage() {
  return (
    <>
      <PageJsonLd seo={pageTdk.contact} path={path} type="ContactPage" />
      <SimplePage
        eyebrow="Contact / corrections"
        title="Scrap Mechanic Field Guide - Contact Us"
        intro="Use email for factual corrections, broken links, accessibility concerns, rights questions, or focused feedback about the Scrap Mechanic Field Guide."
      >
        <h2>Email address</h2>
        <p>
          Contact us at{" "}
          <a className="text-link" href={`mailto:${site.email}`}>
            {site.email}
          </a>.
        </p>
        <h2>Factual corrections</h2>
        <p>
          Include the exact page URL, the statement or value that needs attention, your
          Scrap Mechanic version and Steam branch, whether mods were active, and steps
          another player can repeat without receiving your save file.
        </p>
        <h2>Broken links and accessibility</h2>
        <p>
          For a broken link, identify both the page and the link text. For an
          accessibility concern, describe the device, browser, input method, page, and
          task that could not be completed so the problem can be reproduced.
        </p>
        <h2>Rights and privacy questions</h2>
        <p>
          Rights requests should identify the disputed material and the basis for the
          request. Privacy questions should describe the interaction at issue without
          sending passwords, payment information, private save files, or unrelated
          personal data.
        </p>
        <h2>What to expect</h2>
        <p>
          Messages are reviewed for relevance and clarity. A response is not guaranteed,
          and the address does not provide official game support, account recovery,
          multiplayer moderation, or technical support on behalf of Axolot Games.
        </p>
      </SimplePage>
    </>
  );
}
