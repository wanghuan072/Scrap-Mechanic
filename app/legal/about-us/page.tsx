import type { Metadata } from "next";
import Link from "next/link";
import { PageJsonLd } from "@/components/JsonLd";
import { SimplePage } from "@/components/SimplePage";
import { createMetadata } from "@/seo/metadata";
import { pageTdk } from "@/seo/tdk";

const path = "/legal/about-us";

export const metadata: Metadata = createMetadata(pageTdk.about, path);

export default function AboutUsPage() {
  return (
    <>
      <PageJsonLd seo={pageTdk.about} path={path} type="AboutPage" />
      <SimplePage
        eyebrow="About / editorial approach"
        title="Scrap Mechanic Field Guide - About Us"
        intro="The Scrap Mechanic Field Guide is an independent player resource built around practical decisions, current version boundaries, and connected gameplay systems."
      >
        <h2>Built for player decisions</h2>
        <p>
          Pages begin with a concrete task: starting a world, understanding a part,
          preparing a build, resolving a quest, calculating a raid, or checking whether
          older advice still fits the current release.
        </p>
        <h2>How information is organized</h2>
        <p>
          The <Link className="text-link" href="/guides">guides</Link> explain complete
          player routes, the <Link className="text-link" href="/wiki">wiki</Link> connects
          individual items and systems, and the{" "}
          <Link className="text-link" href="/tools">tools</Link> turn published rules into
          repeatable planning checks.
        </p>
        <h2>Version awareness and corrections</h2>
        <p>
          Scrap Mechanic changed substantially at full release, and individual patches
          can alter progression, recipes, compatibility, or expected behavior. Relevant
          pages identify the game version or review date so players can judge whether an
          instruction belongs to their current branch.
        </p>
        <h2>Editorial responsibility</h2>
        <p>
          The site aims to distinguish confirmed game behavior from practical
          recommendations, avoid invented claims, and correct material errors when they
          are identified. Clear reproduction steps and version information help us
          evaluate corrections fairly.
        </p>
        <h2>Independent status</h2>
        <p>
          This is a fan-made player guide. It is not operated by, affiliated with, or
          endorsed by Axolot Games. Game names, imagery, and other protected assets
          remain the property of their respective owners.
        </p>
      </SimplePage>
    </>
  );
}
