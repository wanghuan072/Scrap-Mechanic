import type { Metadata } from "next";
import { PageJsonLd } from "@/components/JsonLd";
import { SimplePage } from "@/components/SimplePage";
import { site } from "@/data/site";
import { createMetadata } from "@/seo/metadata";
import { pageTdk } from "@/seo/tdk";

const path = "/legal/terms-of-service";

export const metadata: Metadata = createMetadata(pageTdk.terms, path);

export default function TermsOfServicePage() {
  return (
    <>
      <PageJsonLd seo={pageTdk.terms} path={path} />
      <SimplePage
        eyebrow="Legal / site use"
        title="Scrap Mechanic Terms of Service"
        intro="These terms govern access to the Scrap Mechanic Field Guide, its informational pages, browser tools, and links to third-party services."
      >
        <h2>Acceptance and permitted use</h2>
        <p>
          By using the site, you agree to use it lawfully and without interfering with
          its operation, security, or availability. You may read, link to, and use the
          player guidance for personal, non-commercial gameplay assistance.
        </p>
        <h2>Informational limits</h2>
        <p>
          Game behavior can differ across patches, Steam branches, multiplayer state,
          local configuration, and installed mods. Content is provided for general
          player assistance and does not guarantee a specific in-game result.
        </p>
        <h2>Calculators and browser tools</h2>
        <p>
          Planning tools estimate outcomes from the values you enter and the rules
          displayed on the relevant page. They do not access or modify game files.
          Verify important totals in your current game version before spending rare
          materials or changing an established world.
        </p>
        <h2>Worlds, saves, and modifications</h2>
        <p>
          Keep independent backups before changing versions, enabling mods, or testing
          unfamiliar instructions. You remain responsible for your game installation,
          saves, Workshop subscriptions, and decisions based on site information.
        </p>
        <h2>Third-party services</h2>
        <p>
          External websites and services have their own terms, availability, and
          policies. A link does not make this site responsible for third-party content,
          downloads, accounts, transactions, or service interruptions.
        </p>
        <h2>Ownership and independent status</h2>
        <p>
          Original writing and site presentation remain protected by applicable law.
          Scrap Mechanic and its game assets belong to Axolot Games and their respective
          rights holders. This independent guide is not affiliated with or endorsed by
          Axolot Games.
        </p>
        <h2>Changes and contact</h2>
        <p>
          Features or these terms may change to reflect site operation, security, or
          legal requirements. Questions about these terms may be sent to{" "}
          <a className="text-link" href={`mailto:${site.email}`}>
            {site.email}
          </a>.
        </p>
      </SimplePage>
    </>
  );
}
