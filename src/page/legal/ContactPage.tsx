import type { Metadata } from "next";
import Link from "next/link";
import { SimplePage } from "@/components/common/SimplePage";
import { PageJsonLd } from "@/seo/JsonLd";
import { site } from "@/config/site";
import { createMetadata } from "@/seo/metadata";
import { pageTdk } from "@/seo/tdk";

const path = "/contact";

export const metadata: Metadata = createMetadata(pageTdk.contact, path);

export default function ContactUsPage() {
  return (
    <>
      <PageJsonLd seo={pageTdk.contact} path={path} type="ContactPage" />
      <SimplePage
        eyebrow="Contact / corrections"
        title="Scrap Mechanic Field Guide - Contact Us"
        intro="Contact the Scrap Mechanic Field Guide about factual corrections, version conflicts, broken links, accessibility concerns, privacy, or rights questions."
      >
        <h2>How to contact the site</h2>
        <p>
          Email{" "}
          <a className="text-link" href={`mailto:${site.email}`}>
            {site.email}
          </a>{" "}
          for issues concerning this website. There is no contact form, user account,
          public comment area, or file-upload service, so email is the only channel used
          for site feedback and formal requests.
        </p>
        <h2>Reporting a game-data error</h2>
        <p>
          For a recipe, item, part, trade, quest, location, or mechanic error, include
          the exact page URL and identify the specific value or sentence that needs
          review. Add your Scrap Mechanic version, Steam branch, game mode, multiplayer
          role, and whether mods were active. If possible, describe a short sequence
          another player can repeat without receiving your save file.
        </p>
        <p>
          Screenshots can help when they show a visible game value or state, but do not
          send private save files, account details, crash dumps containing personal
          paths, or unrelated attachments. A concise report with clear version context
          is usually more useful than a large file collection.
        </p>
        <h2>Reporting a guide, build, or calculator issue</h2>
        <p>
          For a <Link className="text-link" href="/guides">guide</Link> or{" "}
          <Link className="text-link" href="/builds">build</Link>, identify the step that
          failed, the parts or materials already used, and the result you expected. For
          a <Link className="text-link" href="/tools">calculator</Link>, include every
          input value, the displayed result, and the expected result so the calculation
          can be reproduced exactly.
        </p>
        <p>
          Reports are checked against the page&apos;s stated version boundary. A result that
          differs only on an older branch, a modded world, or a multiplayer client may
          require a compatibility note instead of changing the current-version value.
        </p>
        <h2>Broken links and accessibility</h2>
        <p>
          For a broken link, provide the page URL, visible link text, and destination you
          expected. For an accessibility concern, describe the device, browser, screen
          size, input method, assistive technology if relevant, and the task that could
          not be completed. This helps separate a content problem from a responsive,
          keyboard, contrast, or browser-specific issue.
        </p>
        <h2>Rights and privacy questions</h2>
        <p>
          A rights request should identify the disputed material, exact URL, rights
          holder, basis of the request, and the sender&apos;s authority to act. Review the{" "}
          <Link className="text-link" href="/copyright">copyright notice</Link> before
          sending a formal notice. Privacy questions should describe the website
          interaction at issue and can refer to the{" "}
          <Link className="text-link" href="/privacy-policy">privacy policy</Link>.
        </p>
        <p>
          Do not email passwords, payment information, authentication codes, private
          save files, or sensitive personal data. The site does not need those details
          to investigate a content, privacy, accessibility, or rights issue.
        </p>
        <h2>How messages are handled</h2>
        <p>
          Messages are reviewed for relevance, clarity, and the information needed to
          reproduce or evaluate the issue. Corrections with a direct effect on player
          decisions are prioritized, but a reply or completion date is not guaranteed.
          Repeated promotional messages, unrelated submissions, and abusive content may
          not receive a response.
        </p>
        <h2>Official support boundary</h2>
        <p>
          This address belongs to an independent fan guide. It cannot provide official
          game support, account recovery, purchase refunds, multiplayer moderation,
          server administration, bug tracking, or developer statements on behalf of
          Axolot Games. For official product or account issues, use the support channel
          provided by the relevant game platform or developer.
        </p>
      </SimplePage>
    </>
  );
}
