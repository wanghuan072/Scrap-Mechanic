import type { Metadata } from "next";
import Link from "next/link";
import { SimplePage } from "@/components/common/SimplePage";
import { PageJsonLd } from "@/seo/JsonLd";
import { site } from "@/config/site";
import { createMetadata } from "@/seo/metadata";
import { pageTdk } from "@/seo/tdk";

const path = "/terms-of-service";

export const metadata: Metadata = createMetadata(pageTdk.terms, path);

export default function TermsOfServicePage() {
  return (
    <>
      <PageJsonLd seo={pageTdk.terms} path={path} />
      <SimplePage
        eyebrow="Legal / site use"
        title="Scrap Mechanic Terms of Service"
        intro="These terms govern use of the independent Scrap Mechanic Field Guide, including its guides, wiki pages, build information, browser tools, and external links."
      >
        <h2>Acceptance and scope</h2>
        <p>
          By accessing or using scrapmechanic.org, you agree to these terms. If you do
          not agree, do not use the site. These terms apply to public pages, search,
          calculators, navigation, and communications sent to the site address. The{" "}
          <Link className="text-link" href="/privacy-policy">
            privacy policy
          </Link>{" "}
          explains how information may be processed during those interactions.
        </p>
        <p>
          The Scrap Mechanic Field Guide is an independent fan publication. It is not an
          Axolot Games service and cannot create obligations, guarantees, support
          commitments, or official statements on behalf of the developer or a game
          platform.
        </p>
        <h2>Permitted use</h2>
        <p>
          You may read and link to public pages and use the information for personal
          gameplay assistance. You may use the browser tools to estimate your own
          crafting or raid plans. Limited quotation is permitted when it is accurate,
          reasonably necessary, and accompanied by clear attribution and a link to the
          relevant page.
        </p>
        <h2>Prohibited use</h2>
        <p>
          You may not interfere with site availability or security, attempt unauthorized
          access, submit malicious code, overwhelm the service with automated requests,
          bypass technical restrictions, impersonate the site, or use public contact
          details for abusive or deceptive communication. Substantial automated copying,
          bulk republication, resale, or presentation of original site material as
          another publisher&apos;s work is not permitted.
        </p>
        <h2>Accuracy, versions, and player judgment</h2>
        <p>
          Game behavior can differ across patches, Steam branches, multiplayer state,
          world progression, local configuration, and installed mods. Pages may identify
          a tested version or review date, but content cannot guarantee the behavior of
          every save, server, branch, or future release.
        </p>
        <p>
          Exact values are intended to describe the version boundary stated on the page.
          Build routes and tactical recommendations also depend on player goals, skill,
          available materials, and world conditions. Verify important values in your
          current game before committing rare materials or altering an established
          creation.
        </p>
        <h2>Calculators and browser tools</h2>
        <p>
          Planning tools estimate outcomes from the values you enter and the rules
          implemented on the relevant page. They do not access, upload, or modify game
          files. Results can be affected by incorrect inputs, rounding, version changes,
          or assumptions described alongside the tool. You remain responsible for
          checking the displayed result against your current game state.
        </p>
        <h2>Worlds, saves, and modifications</h2>
        <p>
          Keep independent backups before changing versions, enabling mods, or testing
          unfamiliar instructions. You remain responsible for your game installation,
          saves, creations, Workshop subscriptions, server settings, and decisions based
          on site information. The site cannot restore a damaged world, resolve a mod
          conflict, recover an account, or reverse an in-game action.
        </p>
        <h2>Third-party services</h2>
        <p>
          External websites, downloads, platforms, and services have their own terms,
          privacy practices, availability, and security controls. A link is provided for
          navigation or context and does not make this site responsible for third-party
          content, files, accounts, purchases, moderation, or service interruptions.
        </p>
        <h2>Ownership and independent status</h2>
        <p>
          Original explanatory writing, custom page organization, interface presentation,
          and planning materials remain protected by applicable law. Scrap Mechanic,
          associated trademarks, and game assets belong to Axolot Games and their
          respective rights holders. The{" "}
          <Link className="text-link" href="/copyright">
            copyright notice
          </Link>{" "}
          explains the distinction and the process for sending a rights request.
        </p>
        <h2>Availability and disclaimers</h2>
        <p>
          The site and its content are provided on an as-available basis for general
          informational use. To the extent permitted by applicable law, no warranty is
          made that every page will remain uninterrupted, error-free, complete, or
          compatible with every game version, device, browser, mod, or multiplayer
          configuration.
        </p>
        <h2>Responsibility and limitation</h2>
        <p>
          You are responsible for how you use the site and for maintaining backups of
          important saves and creations. To the extent permitted by applicable law, the
          site operator is not liable for indirect, incidental, or consequential loss
          arising from reliance on game guidance, tool estimates, external links, mod
          use, version changes, or unavailable services. Nothing in these terms excludes
          a responsibility that cannot lawfully be excluded.
        </p>
        <h2>Changes and contact</h2>
        <p>
          Site features or these terms may change to reflect operation, security,
          editorial practice, or legal requirements. The published page applies from the
          time it is made available. Questions about these terms may be sent to{" "}
          <a className="text-link" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          . Contacting the site does not create an official support relationship with
          Axolot Games.
        </p>
      </SimplePage>
    </>
  );
}
