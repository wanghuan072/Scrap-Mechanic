import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { GptAd } from "@/components/ads/GptAd";
import { SectionHero } from "@/components/common/SectionHero";
import { site } from "@/config/site";
import { PageJsonLd } from "@/seo/JsonLd";
import { guides } from "@/lib/content/catalog";
import { createMetadata } from "@/seo/metadata";
import { pageTdk } from "@/seo/tdk";
import styles from "@/style/page/guides/guides.module.css";

export const metadata: Metadata = createMetadata(pageTdk.guides, "/guides");

export default function GuidesPage() {
  const featured =
    guides.find((guide) => guide.slug === "beginner-first-hours") ?? guides[0];
  const lanes = [
    {
      label: "Resources",
      copy: "Oil, water, battery, and schematic routes with recipe-backed checkpoints.",
      slugs: [
        "how-to-get-oil",
        "how-to-get-water",
        "how-to-get-battery",
        "how-to-get-schematics",
      ],
    },
    {
      label: "Survival",
      copy: "Crop-value decisions, raid recovery, ammunition budgets, and Warehouse combat.",
      slugs: ["farming-basics", "raid-levels", "warehouse-key-and-farmbot"],
    },
    {
      label: "Building",
      copy: "One exact starter chassis and three automation systems with pass/fail tests.",
      slugs: ["first-vehicle", "controller-and-logic"],
    },
    {
      label: "Progression",
      copy: "Garage blueprint production and a complete 34-achievement route.",
      slugs: ["scrap-city-garage-blueprints", "achievements"],
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
        intro={`${guides.length} complete manuals: two start points, four acquisition guides, then data-led Survival, Building, and Progression routes. Detailed item records stay in the Wiki instead of being repeated here.`}
        metrics={[
          { label: "Manuals", value: `${guides.length}` },
          { label: "Lanes", value: "4" },
          { label: "Standalone", value: "2" },
        ]}
        title="Scrap Mechanic"
        tone="orange"
      />

      <section className={styles.manual}>
        <div className="container">
          <div className={styles.manualHeading}>
            <div>
              <span>Two standalone manuals</span>
              <h2>Choose your starting point</h2>
            </div>
            <p>
              New worlds start with measured first-hour checkpoints. Existing
              worlds start with the save, mod, and patch boundary.
            </p>
          </div>
          <div className={styles.manualGrid}>
            <article className={styles.coverStory}>
              <Link
                className={styles.coverImage}
                href={`/guides/${featured.slug}`}
              >
                <Image
                  src={featured.image}
                  alt={featured.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 58vw"
                  quality={60}
                  loading="eager"
                  fetchPriority="high"
                />
                <span>Start here / {featured.readingTime}</span>
              </Link>
              <div className={styles.coverCopy}>
                <span>
                  {featured.category} · Version {featured.gameVersion}
                </span>
                <h3>{featured.title}</h3>
                <p>{featured.quickAnswer}</p>
                <Link href={`/guides/${featured.slug}`}>
                  Open the first-hours route →
                </Link>
              </div>
            </article>

            <aside className={styles.dispatch}>
              <span className={styles.dispatchLabel}>Current dispatch</span>
              <h3>Returning after Early Access?</h3>
              <p>
                Check old Creative and Survival worlds, mod categories,
                schematic state, multiplayer ownership, and the current patch
                timeline before changing a save.
              </p>
              <Link href="/guides/returning-to-1-0">
                Read the 1.0 return brief →
              </Link>
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
                <div>
                  <dt>Public baseline</dt>
                  <dd>{site.currentVersion}</dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>
      </section>

      <GptAd slotId="div-gpt-ad-guides-1" unit="banner1" />

      <section className={styles.lanes}>
        <div className="container">
          <div className={styles.laneHeading}>
            <div>
              <span>{guides.length - 2} category guides</span>
              <h2>Four jobs, practical routes first</h2>
            </div>
            <p>
              Each lane covers a different player decision and links to the
              exact Wiki records behind its numbers.
            </p>
          </div>
          {lanes.map((lane, laneIndex) => {
            const entries = lane.slugs
              .map((slug) => guides.find((guide) => guide.slug === slug))
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
                      prefetch={false}
                    >
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <div className={styles.guideThumb}>
                        <Image src={guide.image} alt="" fill sizes="88px" />
                      </div>
                      <div>
                        <small>
                          {guide.category} · {guide.readingTime}
                        </small>
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
