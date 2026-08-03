import type { Metadata } from "next";
import Link from "next/link";
import { PageJsonLd } from "@/components/JsonLd";
import { SimplePage } from "@/components/SimplePage";
import { site } from "@/data/site";
import { createMetadata } from "@/seo/metadata";
import { pageTdk } from "@/seo/tdk";

const path = "/about";

export const metadata: Metadata = createMetadata(pageTdk.about, path);

export default function AboutUsPage() {
  return (
    <>
      <PageJsonLd seo={pageTdk.about} path={path} type="AboutPage" />
      <SimplePage
        eyebrow="About / editorial approach"
        title="Scrap Mechanic Field Guide - About Us"
        intro="The Scrap Mechanic Field Guide is an independent, player-focused reference for practical decisions, version-aware game data, and connected Scrap Mechanic systems."
      >
        <h2>What this Scrap Mechanic guide is for</h2>
        <p>
          The site is designed for players who need a usable answer while planning a
          Survival world, checking a component, solving a quest, comparing build
          requirements, or returning after a major update. Pages begin with a player
          decision and then connect the values, restrictions, and related systems needed
          to act on it.
        </p>
        <p>
          Coverage currently centers on Scrap Mechanic {site.currentVersion}. The site
          was last reviewed across its current-version content on {site.lastChecked}.
          Version labels matter because recipes, progression, quests, object behavior,
          and mod compatibility can change between releases or Steam branches.
        </p>
        <h2>How information is organized</h2>
        <p>
          The <Link className="text-link" href="/guides">guides</Link> explain complete
          player routes and the order in which decisions matter. The{" "}
          <Link className="text-link" href="/wiki">wiki</Link> connects individual items,
          parts, blocks, bots, locations, recipes, trades, quests, and game mechanics.
          The <Link className="text-link" href="/builds">build pages</Link> translate part
          choices into working vehicle and machine plans, while the{" "}
          <Link className="text-link" href="/tools">browser tools</Link> turn published
          crafting and raid rules into repeatable calculations.
        </p>
        <p>
          This structure is intentional. A recipe value is more useful when a player can
          also reach the required station, understand the unlock condition, estimate the
          material total, and see where the crafted part fits into a practical build.
        </p>
        <h2>What we check</h2>
        <p>
          Structured pages use concrete fields where the game data supports them,
          including recipe inputs and outputs, craft time, station requirements, trade
          costs, unlock conditions, object properties, and compatibility notes. Guides
          add player-facing context such as preparation order, failure conditions, and
          checks that can be repeated in a normal world.
        </p>
        <p>
          Exact values and observed behavior are kept separate from tactical advice. A
          material quantity, station requirement, or quest condition should be stated as
          a checkable fact; a recommended route or build choice is presented as practical
          guidance that may change with play style, world state, or multiplayer roles.
        </p>
        <h2>Version boundaries and update policy</h2>
        <p>
          Scrap Mechanic changed substantially at full release, and later patches can
          alter progression, recipes, compatibility, or expected behavior. Relevant
          pages identify a version, patch, or review marker so players can judge whether
          an instruction fits their current game. The{" "}
          <Link className="text-link" href="/updates">updates section</Link> records the
          release context used by the rest of the guide.
        </p>
        <p>
          When a material error is identified, the affected value or instruction is
          reviewed against the page&apos;s version boundary and connected content. Corrections
          should update every dependent route, calculation, or link rather than changing
          one sentence while leaving conflicting advice elsewhere.
        </p>
        <h2>Corrections and editorial accountability</h2>
        <p>
          Useful corrections include the exact page URL, the disputed statement or
          number, the game version and Steam branch, whether mods were active, and steps
          another player can repeat. This detail helps distinguish a site error from a
          branch difference, multiplayer-state issue, mod conflict, or save-specific
          condition.
        </p>
        <p>
          Send corrections to the address on the{" "}
          <Link className="text-link" href="/contact">contact page</Link>. The goal is to
          make material fixes clearly and consistently, without inventing certainty when
          a mechanic is version-dependent or cannot be reproduced.
        </p>
        <h2>What the site does not provide</h2>
        <p>
          The Scrap Mechanic Field Guide is not an official support channel. It cannot
          recover accounts, restore saves, moderate multiplayer servers, approve mods,
          or speak for the developer. Players should keep their own backups before
          changing game versions, enabling mods, or testing unfamiliar build and world
          instructions.
        </p>
        <h2>Independent status</h2>
        <p>
          This is a fan-made player guide operated independently of Axolot Games. It is
          not affiliated with, sponsored by, or endorsed by the developer. Scrap
          Mechanic names, imagery, and other protected game assets remain the property
          of Axolot Games and their respective rights holders. Ownership and reuse rules
          are explained in the{" "}
          <Link className="text-link" href="/copyright">copyright notice</Link>.
        </p>
      </SimplePage>
    </>
  );
}
