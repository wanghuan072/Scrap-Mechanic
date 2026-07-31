import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageJsonLd } from "@/components/JsonLd";
import { SectionHero } from "@/components/SectionHero";
import { guides } from "@/lib/content";
import { createMetadata } from "@/seo/metadata";
import { pageTdk } from "@/seo/tdk";
import styles from "./guides.module.css";

export const metadata: Metadata = createMetadata(pageTdk.guides, "/guides");

export default function GuidesPage() {
  const featured = guides.find((guide) => guide.slug === "beginner-first-hours") ?? guides[0];
  const fieldGuides = guides.filter((guide) => guide.slug !== featured.slug);
  const lanes = [
    {
      label: "Survive",
      copy: "Plant-value raids, mining loops, combat ammo math, and recoverable routes.",
      slugs: [
        "raid-defense",
        "farming-basics",
        "excavation-island-mining",
        "health-food-perks",
        "warehouse-key-and-farmbot",
        "beat-trash-bot",
        "get-spud-gun",
      ],
    },
    {
      label: "Build",
      copy: "Vehicles, automation, Claygun, controls, and Craftbot priorities.",
      slugs: [
        "first-vehicle",
        "automated-farming",
        "claygun-basics",
        "controller-and-logic",
        "controls",
        "crafting-and-upgrade-priorities",
      ],
    },
    {
      label: "Maintain",
      copy: "1.0 return, Creative/Challenge/Garage, multiplayer, and save branches.",
      slugs: [
        "returning-to-1-0",
        "creative-mode",
        "multiplayer-basics",
        "save-backups-and-branches",
        "trading-and-packing",
        "exploration-and-loot",
      ],
    },
  ];

  return (
    <main>
      <PageJsonLd seo={pageTdk.guides} path="/guides" type="CollectionPage" />
      <SectionHero
        accent="Survival Guides and Field Manuals"
        eyebrow="Survival knowledge / arranged by player decision"
        image="/images/scrap-mechanic/screenshot-03.jpg"
        imageAlt="A mechanic overlooking a working Scrap Mechanic farm"
        intro="Start with the problem in front of you—not a wall of identical articles. Routes are organized around surviving, building, and keeping the world recoverable."
        metrics={[
          { label: "Manuals", value: `${guides.length}` },
          { label: "Baseline", value: "1.0.2" },
          { label: "Best first read", value: "First hours" },
        ]}
        title="Scrap Mechanic"
        tone="orange"
      />

      <section className={styles.manual}>
        <div className="container">
          <div className={styles.manualHeading}>
            <div>
              <span>Priority brief</span>
              <h2>Open one manual first</h2>
            </div>
            <p>
              Start with the first-hours route, or jump to the 1.0 return brief if you
              already know the Early Access loop.
            </p>
          </div>
          <div className={styles.manualGrid}>
          <article className={styles.coverStory}>
            <Link className={styles.coverImage} href={`/guides/${featured.slug}`}>
              <Image
                src={featured.image}
                alt={featured.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 58vw"
                priority
              />
              <span>Start here / {featured.readingTime}</span>
            </Link>
            <div className={styles.coverCopy}>
              <span>{featured.category} · Version {featured.gameVersion}</span>
              <h3>{featured.title}</h3>
              <p>{featured.quickAnswer}</p>
              <Link href={`/guides/${featured.slug}`}>Open the first-hours route →</Link>
            </div>
          </article>

          <aside className={styles.dispatch}>
            <span className={styles.dispatchLabel}>Current dispatch</span>
            <h3>Returning after Early Access?</h3>
            <p>
              World generation, story progression, schematics, bots, and compatibility
              changed together. Check the version boundary before loading an old save.
            </p>
            <Link href="/guides/returning-to-1-0">Read the 1.0 return brief →</Link>
            <dl>
              <div>
                <dt>Old Creative worlds</dt>
                <dd>1.0 compatible</dd>
              </div>
              <div>
                <dt>Old Survival worlds</dt>
                <dd>Legacy branch</dd>
              </div>
              <div>
                <dt>Parts / Custom Games</dt>
                <dd>Check updates</dd>
              </div>
            </dl>
          </aside>
          </div>
        </div>
      </section>

      <section className={styles.lanes}>
        <div className="container">
          <div className={styles.laneHeading}>
            <div>
              <span>Choose by job</span>
              <h2>Three working lanes</h2>
            </div>
            <p>Each lane mixes routes, checklists, and system explanations instead of repeating one card format.</p>
          </div>
          {lanes.map((lane, laneIndex) => {
            const entries = lane.slugs
              .map((slug) => fieldGuides.find((guide) => guide.slug === slug))
              .filter((entry) => entry !== undefined);
            return (
              <section className={styles.lane} key={lane.label}>
                <header>
                  <b>0{laneIndex + 1}</b>
                  <div>
                    <h3>{lane.label}</h3>
                    <p>{lane.copy}</p>
                  </div>
                </header>
                <div className={styles.laneEntries}>
                  {entries.map((guide, index) => (
                    <Link
                      className={styles.guideRow}
                      href={`/guides/${guide.slug}`}
                      key={guide.slug}
                    >
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <div>
                        <small>{guide.category} · {guide.readingTime}</small>
                        <h4>{guide.title}</h4>
                        <p>{guide.description}</p>
                      </div>
                      <b aria-hidden="true">↗</b>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </main>
  );
}
