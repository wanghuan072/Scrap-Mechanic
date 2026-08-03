import type { Metadata } from "next";
import Link from "next/link";
import { SimplePage } from "@/components/common/SimplePage";
import { PageJsonLd } from "@/seo/JsonLd";
import { site } from "@/config/site";
import { createMetadata } from "@/seo/metadata";
import { pageTdk } from "@/seo/tdk";

const path = "/copyright";

export const metadata: Metadata = createMetadata(pageTdk.copyright, path);

export default function CopyrightPage() {
  return (
    <>
      <PageJsonLd seo={pageTdk.copyright} path={path} />
      <SimplePage
        eyebrow="Legal / rights"
        title="Scrap Mechanic Copyright Notice"
        intro="This notice explains ownership of original Scrap Mechanic Field Guide material, the treatment of game-related names and media, permitted quotation, and rights requests."
      >
        <h2>What this notice covers</h2>
        <p>
          The Scrap Mechanic Field Guide combines original explanatory writing, custom
          information architecture, page presentation, planning tools, and game-related
          reference material. Different rights can apply to those elements. This notice
          distinguishes material created for the site from names, screenshots, visual
          elements, and other assets owned by Axolot Games or another rights holder.
        </p>
        <h2>Original Field Guide material</h2>
        <p>
          Unless stated otherwise, original guide prose, comparisons, editorial notes,
          page organization, interface presentation, and custom planning materials are
          protected by applicable copyright law. They may not be copied in substantial
          part, republished in bulk, sold, mirrored, or presented as another publisher&apos;s
          work without written permission.
        </p>
        <p>
          Facts about a game mechanic are not claimed as exclusive site property. The
          site&apos;s particular explanation, arrangement, selection, and presentation of
          those facts may still be protected. Rewriting a page&apos;s wording while retaining
          its distinctive structure, comparisons, and organization may remain an
          unauthorized reproduction.
        </p>
        <h2>Game names, trademarks, and media</h2>
        <p>
          Scrap Mechanic, Axolot Games, associated names, characters, locations, user
          interface elements, screenshots, artwork, models, textures, audio, and other
          game assets belong to Axolot Games and their respective rights holders. They
          are used only to identify, explain, and discuss the game. Their appearance does
          not transfer ownership to this site or imply sponsorship, affiliation, or
          endorsement.
        </p>
        <p>
          Product names and trademarks are used descriptively so players can identify
          the relevant game, version, item, mechanic, or platform. All trademark rights
          remain with their owners. The Field Guide does not claim an official role in
          developing, publishing, supporting, or moderating Scrap Mechanic.
        </p>
        <h2>Quoting and linking</h2>
        <p>
          You may link to public pages and quote brief passages when the quotation is
          accurate, reasonably limited, and accompanied by clear attribution and a link
          to the relevant page. A quotation should not remove version qualifications,
          calculation assumptions, or surrounding context in a way that changes the
          meaning.
        </p>
        <p>
          This permission does not extend to scraping or automated copying of substantial
          portions of the site, reproducing complete guides or data directories,
          republishing custom tool logic, removing ownership notices, or using the site
          name and presentation in a way that suggests an official partnership.
        </p>
        <h2>Requests to reuse original material</h2>
        <p>
          A permission request should identify the exact page and material, the portion
          you want to use, the publication or product where it will appear, whether the
          use is commercial, the expected audience, and the attribution you propose.
          Permission is not granted unless it is confirmed in writing.
        </p>
        <h2>Rights requests</h2>
        <p>
          A rights holder or authorized representative may email{" "}
          <a className="text-link" href={`mailto:${site.email}`}>
            {site.email}
          </a>{" "}
          with the exact page URL, a clear description of the disputed material, the
          protected work involved, contact information, the basis of the claim, the
          requested action, and information reasonably needed to confirm authority to
          act for the rights holder.
        </p>
        <p>
          Include enough detail to locate the material without sending unrelated private
          information. Knowingly inaccurate, abusive, or incomplete notices may delay
          review. General factual corrections should instead follow the process on the{" "}
          <Link className="text-link" href="/contact">
            contact page
          </Link>
          .
        </p>
        <h2>Review process</h2>
        <p>
          Complete requests are reviewed in good faith by checking the identified page,
          the claimed ownership, the way the material is used, and the action requested.
          Material may be removed, replaced, attributed, restricted, or otherwise
          adjusted when appropriate. A request may require clarification when the page,
          work, authority, or legal basis cannot be identified.
        </p>
        <h2>Privacy and contact details</h2>
        <p>
          Contact information submitted with a rights request is handled for the purpose
          of evaluating, documenting, and responding to that request. Do not include
          passwords, payment information, or unrelated sensitive data. More information
          appears in the{" "}
          <Link className="text-link" href="/privacy-policy">
            privacy policy
          </Link>
          .
        </p>
        <h2>Independent fan-site statement</h2>
        <p>
          The Scrap Mechanic Field Guide is independent of Axolot Games and is not an
          official game website. References to Scrap Mechanic are used to identify the
          subject of the guides, wiki entries, builds, updates, and browser tools. All
          rights not expressly granted in this notice are reserved by their respective
          owners.
        </p>
      </SimplePage>
    </>
  );
}
