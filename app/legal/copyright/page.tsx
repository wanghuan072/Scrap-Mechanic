import type { Metadata } from "next";
import { PageJsonLd } from "@/components/JsonLd";
import { SimplePage } from "@/components/SimplePage";
import { site } from "@/data/site";
import { createMetadata } from "@/seo/metadata";
import { pageTdk } from "@/seo/tdk";

const path = "/legal/copyright";

export const metadata: Metadata = createMetadata(pageTdk.copyright, path);

export default function CopyrightPage() {
  return (
    <>
      <PageJsonLd seo={pageTdk.copyright} path={path} />
      <SimplePage
        eyebrow="Legal / rights"
        title="Scrap Mechanic Copyright Notice"
        intro="This notice explains the ownership of original site material, game-related names and media, and the process for sending a rights request."
      >
        <h2>Original site material</h2>
        <p>
          Unless stated otherwise, original explanatory writing, page organization,
          interface presentation, and custom planning materials on this site may not be
          republished in bulk, sold, or presented as another publisher&apos;s work
          without written permission.
        </p>
        <h2>Game names, trademarks, and media</h2>
        <p>
          Scrap Mechanic, associated names, characters, locations, interface elements,
          screenshots, and other game assets belong to Axolot Games and their respective
          rights holders. They are used to identify and discuss the game and do not imply
          sponsorship, ownership, or endorsement.
        </p>
        <h2>Quoting and linking</h2>
        <p>
          You may link to public pages and quote brief passages when the quotation is
          accurate, reasonably limited, and accompanied by clear attribution and a link
          to the relevant page. This permission does not extend to automated copying of
          substantial portions of the site.
        </p>
        <h2>Rights requests</h2>
        <p>
          A rights holder or authorized representative may email{" "}
          <a className="text-link" href={`mailto:${site.email}`}>
            {site.email}
          </a>{" "}
          with the exact page URL, a description of the disputed material, contact
          information, the basis of the claim, and any information reasonably needed to
          confirm authority to act.
        </p>
        <h2>Review process</h2>
        <p>
          Complete requests will be reviewed in good faith. Material may be removed,
          replaced, attributed, or otherwise adjusted when appropriate. Incomplete or
          abusive notices may require clarification before action can be taken.
        </p>
      </SimplePage>
    </>
  );
}
