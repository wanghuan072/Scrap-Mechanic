/* eslint-disable @next/next/no-html-link-for-pages -- 遵循项目导航规则：进入独立页面时使用完整文档导航。 */
import type { Metadata } from "next";
import Image from "next/image";
import { JsonLd, PageJsonLd } from "@/seo/JsonLd";
import {
  recipeCollection,
  schematicUnlocks,
  tradeCollection,
} from "@/lib/game/player-data";
import { site } from "@/config/site";
import {
  allWikiEntries,
  builds,
  getWikiEntriesByCategory,
  guides,
  locations,
  mods,
  quests,
  tools,
  updates,
  wikiCategories,
} from "@/lib/content/catalog";
import { createMetadata } from "@/seo/metadata";
import { pageTdk } from "@/seo/tdk";
import styles from "@/style/page/home/home.module.css";

export const metadata: Metadata = createMetadata(pageTdk.home, "/");

const startSteps = [
  {
    number: "1",
    title: "Crash Site",
    copy: "Find the bucket, put out 3 ship fires, and restore power.",
    href: "/guides/beginner-first-hours",
    image: "/images/scrap-mechanic/screenshot-08.jpg",
  },
  {
    number: "2",
    title: "Mechanic Station",
    copy: "Install its second Master Battery and build the Craftbot.",
    href: "/wiki/quests#the-mechanic-station",
    image: "/images/scrap-mechanic/screenshot-02.jpg",
  },
  {
    number: "3",
    title: "First Vehicle",
    copy: "Build a low, repairable chassis.",
    href: "/guides/first-vehicle",
    image: "/images/scrap-mechanic/screenshot-10.jpg",
  },
  {
    number: "4",
    title: "Farming Basics",
    copy: "Grow only what you can protect.",
    href: "/guides/farming-basics",
    image: "/images/scrap-mechanic/screenshot-03.jpg",
  },
  {
    number: "5",
    title: "Main Quest",
    copy: "Follow the current 1.0 route.",
    href: "/wiki/quests",
    image: "/images/scrap-mechanic/screenshot-07.jpg",
  },
];

const guideLanes = [
  {
    label: "Survival",
    copy: "Crop value, raids, and Warehouse combat.",
    slugs: ["farming-basics", "raid-levels", "warehouse-key-and-farmbot"],
  },
  {
    label: "Building",
    copy: "Starter chassis and tested automation.",
    slugs: ["first-vehicle", "controller-and-logic"],
  },
  {
    label: "Progression",
    copy: "Garage blueprints and achievement routes.",
    slugs: ["scrap-city-garage-blueprints", "achievements"],
  },
] as const;

const taskRoutes = [
  {
    verb: "Make",
    title: "Recipes",
    metric: `${recipeCollection.recipeCount}`,
    detail: "craft lines",
    href: "/wiki/recipes",
  },
  {
    verb: "Trade",
    title: "Trades",
    metric: `${tradeCollection.tradeCount}`,
    detail: "offers",
    href: "/wiki/trades",
  },
  {
    verb: "Progress",
    title: "Quests",
    metric: `${quests.length}`,
    detail: "missions",
    href: "/wiki/quests",
  },
  {
    verb: "Unlock",
    title: "Schematics",
    metric: `${schematicUnlocks.length}`,
    detail: "unlocks",
    href: "/wiki/schematics",
  },
] as const;

const faqs = [
  {
    question: "How do I get started in Scrap Mechanic 1.0?",
    answer:
      "Enter the crashed ship, take the Water Bucket from the nearby pond, extinguish the three marked interior fires, recover the ruin's Master Battery, restore ship power, reconnect the console, and open the Logbook before leaving for the Mechanic Station.",
  },
  {
    question: "Where is the Water Bucket at the Scrap Mechanic Crash Site?",
    answer:
      "Activate Getting Started inside the ship, then follow the path opposite the entrance to the nearby pond. The Water Bucket is at the pond edge beside the farming tutorial supplies.",
  },
  {
    question: "Does the first Master Battery power the Mechanic Station?",
    answer:
      "No. The Master Battery from the ruin near the Crash Site powers the crashed ship. The Mechanic Station objective marks a separate battery in the station's bunk-room area.",
  },
  {
    question: "Can an old Survival world load in 1.0?",
    answer:
      "Old Survival worlds require the older Steam branch. Back up important worlds before switching versions.",
  },
  {
    question: "Why does another player's map not match mine?",
    answer:
      "Survival worlds are generated. Navigate with roads, large structures, and location roles rather than copied coordinates.",
  },
  {
    question: "Do older mods work after 1.0?",
    answer:
      "Some can, but Parts and Custom Games mods are particularly likely to need an update. Test a copied world first.",
  },
  {
    question: "Where should I look when a quest will not progress?",
    answer:
      "Confirm the current objective, remove mods for a copied test save, and check the latest patch before repeating a dangerous story area.",
  },
  {
    question: "How do I start Excavation Island mining?",
    answer:
      "Bring lights, food perks, a Spudgun, and a repairable mining vehicle. Scout with the Ore Prospector, dig with a Plasma Drill, and process ore behind the dig face while watching for Cablebots and Minerbots.",
  },
];


const homeIconPaths: Record<string, string> = {
  "raid-calculator": "M5 3h14v18H5z M8 6h8 M8 10h1 M12 10h1 M16 10h1 M8 14h1 M12 14h1 M16 14h1 M8 18h1 M12 18h1 M16 18h1",
  "crafting-planner": "m12 3 9 5-9 5-9-5 9-5Z M3 8v9l9 5 9-5V8 M12 13v9",
  "wheel-angle-calculator": "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z M12 3v5 M12 16v5 M3 12h5 M16 12h5",
  items: "M7 7V4h10v3 M4 7h16v14H4z M9 11h6",
  blocks: "m12 3 9 5-9 5-9-5 9-5Z M3 8v9l9 5 9-5V8 M12 13v9",
  parts: "M12 4v3 M12 17v3 M4 12h3 M17 12h3 M6 6l2 2 M16 16l2 2 M6 18l2-2 M16 8l2-2 M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z",
  tools: "m14 4-3 5 4 4 5-3a7 7 0 0 1-8 8l-6 4-4-4 6-6a7 7 0 0 1 6-8Z",
  weapons: "M9 21V7l3-4 3 4v14 M6 17h12 M9 10h6",
  resources: "M8 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z M16 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z M5 13a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z",
  crops: "M12 22V10 M12 14C3 14 3 8 3 4c6 0 9 3 9 10Z M12 10c0-5 4-8 9-8 0 6-3 8-9 8Z",
  garments: "m8 3-6 4 3 5 3-2v11h8V10l3 2 3-5-6-4c0 5-8 5-8 0Z",
  "quest-rewards": "m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6Z",
  bots: "M12 2v4 M5 6h14v14H5z M2 10v6 M22 10v6 M8 11h1 M15 11h1 M9 16h6",
  schematics: "M5 4h14v16H5z M8 8h8v8H8z M9 1v3 M15 1v3 M9 20v3 M15 20v3 M1 9h4 M1 15h4 M19 9h4 M19 15h4",
};

function HomeIcon({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={homeIconPaths[name] ?? homeIconPaths.blocks} />
    </svg>
  );
}

export default function Home() {
  const latestUpdate = updates[0];
  const updateBullets = latestUpdate.sections.flatMap((section) => section.bullets ?? []).slice(0, 4);
  const featuredGuides = guides.filter((guide) => guide.featured);
  const leadGuide =
    guides.find((guide) => guide.slug === "beginner-first-hours") ??
    featuredGuides[0] ??
    guides[0];
  const returnGuide = guides.find((guide) => guide.slug === "returning-to-1-0");
  const featuredBuilds = builds.filter((build) => build.featured);
  const leadBuild = featuredBuilds[0] ?? builds[0];
  const featuredMods = mods.slice(0, 4);
  const mapPreview = locations.slice(0, 6);
  const availableTools = tools.filter((tool) => tool.status === "available");
  const briefing = [
    { label: "Guides", value: `${guides.length}`, href: "/guides" },
    { label: "Wiki", value: `${allWikiEntries.length}`, href: "/wiki" },
    { label: "Recipes", value: `${recipeCollection.recipeCount}`, href: "/wiki/recipes" },
    { label: "Quests", value: `${quests.length}`, href: "/wiki/quests" },
    { label: "Builds", value: `${builds.length}`, href: "/builds" },
    { label: "Tools", value: `${availableTools.length}`, href: "/tools" },
  ];

  return (
    <main className={styles.home}>
      <link
        rel="preload"
        as="image"
        href="/images/scrap-mechanic/home-hero-mobile-v2.webp"
        media="(max-width: 768px)"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href="/images/scrap-mechanic/home-hero-desktop.webp"
        media="(min-width: 769px)"
        fetchPriority="high"
      />
      <PageJsonLd seo={pageTdk.home} path="/" />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }}
      />

      <section className={styles.hero}>
        <picture className={styles.heroPicture}>
          <source
            media="(max-width: 768px)"
            srcSet="/images/scrap-mechanic/home-hero-mobile-v2.webp"
          />
          <img
            className={styles.heroImage}
            src="/images/scrap-mechanic/home-hero-desktop.webp"
            alt="A mechanic working beside an automated Scrap Mechanic farm"
            fetchPriority="high"
            loading="eager"
            decoding="async"
          />
        </picture>
        <div className={styles.heroShade} />
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroCopy}>
            <span className={styles.heroKicker}>FIELD GUIDE · v{site.currentVersion}</span>
            <h1>
              Scrap Mechanic{" "}
              <span>- Survival Field Guide</span>
            </h1>
            <p>
              Clear routes for first hours, wiki lookups, blueprints, raid math,
              and 1.0 compatibility checks — built for the decision in front of you.
            </p>
            <div className={styles.heroActions}>
              <a className={`${styles.heroButton} ${styles.orangeButton}`} href="/guides/beginner-first-hours">
                Start guide <span aria-hidden="true">›</span>
              </a>
              <a className={`${styles.heroButton} ${styles.blueButton}`} href="/wiki">
                Open wiki <span aria-hidden="true">›</span>
              </a>
              <a className={`${styles.heroButton} ${styles.greenButton}`} href="/tools">
                Run tools <span aria-hidden="true">›</span>
              </a>
            </div>
          </div>
          <aside className={styles.heroBrief}>
            <span>Current release</span>
            <strong>{latestUpdate.title}</strong>
            <p>{latestUpdate.quickAnswer}</p>
            <a href={`/updates/${latestUpdate.slug}`}>Read briefing ›</a>
          </aside>
        </div>
      </section>

      <section className={`container ${styles.versionStrip}`} aria-label="Scrap Mechanic version and data status">
        <div className={styles.liveVersion}><span>Live game</span><strong>{site.currentVersion}</strong></div>
        <dl className={styles.versionFacts}>
          <div><dt>Official patch</dt><dd>{site.currentVersionPublished}</dd></div>
          <div><dt>Status checked</dt><dd>{site.lastChecked}</dd></div>
        </dl>
        <details className={styles.versionNote}>
          <summary>Live release confirmed · Dataset status</summary>
          <p>The live game version and the checked version of a dataset are shown separately. Recipes, trades, unlocks, raid tables, and individual wiki entries keep their own version labels until they are re-extracted or retested.</p>
          <a href={site.currentVersionSource} target="_blank" rel="noopener noreferrer">Official patch note ↗</a>
        </details>
      </section>

      <div className={`container ${styles.dashboard}`}>
        <section className={`${styles.panel} ${styles.briefPanel}`}>
          <div className={styles.sectionLabel}>
            <div className={styles.sectionIntro}>
              <h2>Ops brief</h2>
              <p>Live counts from the same indexes used on every inner page.</p>
            </div>
          </div>
          <div className={styles.briefGrid}>
            {briefing.map((item) => (
              <a href={item.href} key={item.label} className={styles.briefStat}>
                <small>{item.label}</small>
                <b>{item.value}</b>
              </a>
            ))}
            <div className={styles.briefMeta}>
              <span>Checked {site.lastChecked}</span>
              <strong>Live game {site.currentVersion}</strong>
            </div>
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.sectionLabel}>
            <div className={styles.sectionIntro}>
              <h2>Start path</h2>
              <p>Five decisions that unlock the rest of Survival.</p>
            </div>
            <a href="/guides/beginner-first-hours">First hours →</a>
          </div>
          <div className={styles.startGrid}>
            {startSteps.map((step) => (
              <a href={step.href} className={styles.startCard} key={step.number}>
                <div className={styles.tileImage}>
                  <Image
                    src={step.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 96px, 260px"
                    quality={82}
                  />
                </div>
                <b>{step.number}</b>
                <div className={styles.startCopy}>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        <div className={styles.utilityRow}>
        <section className={`${styles.panel} ${styles.splitPanel}`}>
          <div className={styles.sectionLabel}>
            <div className={styles.sectionIntro}>
              <h2>Survival map and landmarks</h2>
              <p>
                View the reference map or a supported local Survival save in your browser.
                Explore landmarks, progression routes, risks, and preparation.
              </p>
            </div>
            <a href="/map">Open interactive map →</a>
          </div>
          <div className={styles.mapBody}>
            <a href="/map#interactive-map" className={styles.mapPreview}>
              <Image src="/map-assets/generated/reference-overview-61a4ead9b0ea2721.webp" alt="Reference Survival surface map with roads, islands and terrain" width={512} height={384} sizes="(max-width: 768px) 90vw, 360px" />
              <span>Open interactive map →</span>
            </a>
          <div className={styles.landmarkGrid}>
            {mapPreview.map((location) => (
              <details key={location.slug} className={styles.landmarkCard}>
                <summary>
                  <a href={`/map#${location.slug}`}>
                    <small>{location.type} · {location.danger}</small>
                    <h3 className={styles.landmarkName}>{location.name}</h3>
                  </a>
                </summary>
                <p>{location.description}</p>
              </details>
            ))}
          </div>
          </div>
        </section>
        <section className={styles.panel}>
          <div className={styles.sectionLabel}>
            <div className={styles.sectionIntro}>
              <h2>Working tools</h2>
              <p>Open a calculator for raid pressure, material totals, or steering geometry.</p>
            </div>
            <a href="/tools">Compare all tools →</a>
          </div>
          <div className={styles.toolsGrid}>
            {availableTools.map((tool) => (
              <a href={`/tools/${tool.slug}`} className={styles.toolCard} key={tool.slug}>
                <div className={styles.toolSymbol}><HomeIcon name={tool.slug} /></div>
                <div>
                  <h3>{tool.name}</h3>
                  <p>{tool.description}</p>
                  <span>Open tool ›</span>
                </div>
              </a>
            ))}
          </div>
        </section>
        </div>

        <section className={styles.panel}>
          <div className={styles.sectionLabel}>
            <div className={styles.sectionIntro}>
              <h2>Field manual</h2>
              <p>Two start points, then Survival / Building / Progression manuals.</p>
            </div>
            <a href="/guides">All {guides.length} guides →</a>
          </div>
          <div className={styles.manualBody}>
            <div className={styles.manualLead}>
              <article className={styles.guideFeature}>
              <a href={`/guides/${leadGuide.slug}`}>
                <div className={styles.guideFeatureImage}>
                  <Image
                    src={leadGuide.image}
                    alt={leadGuide.imageAlt}
                    fill
                    sizes="(max-width: 768px) 140px, 220px"
                    quality={82}
                  />
                </div>
                <div>
                  <span>New world · {leadGuide.readingTime}</span>
                  <h3>{leadGuide.title}</h3>
                  <b>Open first-hours route →</b>
                </div>
              </a>
              <details className={styles.guideOverview}>
                <summary>First-hours route overview</summary>
                <p>{leadGuide.quickAnswer}</p>
              </details>
              </article>
              {returnGuide ? (
                <article className={styles.returnCard}>
                <a href={`/guides/${returnGuide.slug}`}>
                  <div className={styles.returnImage}>
                    <Image src={returnGuide.image} alt={returnGuide.imageAlt} fill sizes="(max-width: 768px) 140px, 220px" quality={82} />
                  </div>
                  <div>
                  <span>Existing save · {returnGuide.readingTime}</span>
                  <h3>{returnGuide.title}</h3>
                  <b>Read return brief →</b>
                  </div>
                </a>
                <details className={styles.guideOverview}>
                  <summary>Save and compatibility overview</summary>
                  <p>{returnGuide.quickAnswer}</p>
                </details>
                </article>
              ) : null}
            </div>
            <div className={styles.laneBoard}>
              {guideLanes.map((lane) => {
                const entries = lane.slugs
                  .map((slug) => guides.find((item) => item.slug === slug))
                  .filter((guide): guide is (typeof guides)[number] => Boolean(guide));
                return (
                  <div className={styles.laneColumn} key={lane.label}>
                    <header>
                      <div>
                        <h3>{lane.label}</h3>
                        <p>{lane.copy}</p>
                      </div>
                    </header>
                    {entries.map((guide) => (
                      <a
                        href={`/guides/${guide.slug}`}
                        key={guide.slug}
                      >
                        <div className={styles.laneImage}>
                          <Image src={guide.image} alt="" fill sizes="56px" quality={82} />
                        </div>
                        <div>
                          <small>{guide.readingTime}</small>
                          <span>{guide.title}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.sectionLabel}>
            <div className={styles.sectionIntro}>
              <h2>Reference desk</h2>
              <p>Task indexes first, encyclopedia categories second.</p>
            </div>
            <a href="/wiki">Wiki directory →</a>
          </div>
          <div className={styles.referenceBody}>
            <div className={styles.taskGrid}>
              {taskRoutes.map((task) => (
                <a
                  href={task.href}
                  className={styles.taskCard}
                  key={task.href}
                >
                  <small>{task.verb}</small>
                  <h3>{task.title}</h3>
                  <b>{task.metric}</b>
                  <span>{task.detail}</span>
                </a>
              ))}
            </div>
            <div className={styles.wikiDirectory}>
              {wikiCategories.map((category) => (
                <a
                  href={`/wiki/${category.slug}`}
                  className={styles.wikiTile}
                  key={category.slug}
                >
                  <div className={styles.wikiThumb}>
                    <HomeIcon name={category.slug} />
                  </div>
                  <div>
                    <h3>{category.name}</h3>
                    <small>{getWikiEntriesByCategory(category.slug).length} entries</small>
                  </div>
                  <b aria-hidden="true">→</b>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.sectionLabel}>
            <div className={styles.sectionIntro}>
              <h2>Blueprints</h2>
              <p>Job-first builds with part counts and commissioning tests.</p>
            </div>
            <a href="/builds">All {builds.length} files →</a>
          </div>
          <div className={styles.buildShowcase}>
            <a href={`/builds/${leadBuild.slug}`} className={styles.buildFeature}>
              <Image
                src={leadBuild.image}
                alt={leadBuild.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 48vw"
                quality={82}
              />
              <div>
                <span>{leadBuild.category}</span>
                <h3>{leadBuild.title}</h3>
                <p>{leadBuild.description}</p>
              </div>
            </a>
            <div className={styles.buildStack}>
              {featuredBuilds.slice(1, 6).map((build) => (
                <a
                  href={`/builds/${build.slug}`}
                  key={build.slug}
                >
                  <div className={styles.buildThumb}>
                    <Image src={build.image} alt="" fill sizes="72px" quality={82} />
                  </div>
                  <div>
                    <small>{build.category}</small>
                    <h3>{build.title}</h3>
                  </div>
                  <b aria-hidden="true">↗</b>
                </a>
              ))}
            </div>
          </div>
        </section>

        <div className={styles.newsRow}>
        <section className={`${styles.panel} ${styles.updatePanel}`}>
          <div className={styles.updateArt}>
            <Image
              src={latestUpdate.image}
              alt={latestUpdate.imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 280px"
              quality={82}
            />
          </div>
          <div className={styles.updateInfo}>
            <h2 className={styles.panelKicker}>Situation report</h2>
            <h3>{latestUpdate.title}</h3>
            <p className={styles.updateAnswer}>{latestUpdate.quickAnswer}</p>
            <ul>
              {updateBullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
          <div className={styles.updateMachine}>

            <a href="/updates">
              All updates <span aria-hidden="true">›</span>
            </a>
          </div>
        </section>
        <section className={styles.panel}>
          <div className={styles.sectionLabel}>
            <div className={styles.sectionIntro}>
              <h2>Workshop</h2>
              <p>Post-1.0 candidates, legacy dependencies, and current status warnings.</p>
            </div>
            <a href="/mods">Mods board →</a>
          </div>
          <div className={styles.modsGrid}>
            {featuredMods.map((mod, index) => (
              <a
                href={`/mods#${mod.slug}`}
                key={mod.slug}
                className={styles.modCard}
              >
                <div className={styles.modImage}>
                  <Image
                    src={mod.image}
                    alt={mod.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 120px"
                    quality={82}
                  />
                </div>
                <div>
                  <span>
                    {String(index + 1).padStart(2, "0")} ·{" "}
                    {mod.workshopStatus === "removed-incompatible"
                      ? "Removed / incompatible"
                      : mod.compatibility === "legacy-check"
                        ? "Legacy compatibility check"
                        : mod.compatibility === "recent-1-0-candidate"
                          ? "Needs current-save testing"
                          : mod.compatibility}
                  </span>
                  <h3>{mod.title}</h3>
                  <p>{mod.bestFor}</p>
                </div>
              </a>
            ))}
          </div>
          <p className={styles.modNote}>Test mods on a copied save before using them in your current world.</p>
        </section>
        </div>

        <section className={`${styles.panel} ${styles.faqPanel}`}>
          <div className={styles.sectionLabel}>
            <div className={styles.sectionIntro}>
              <h2>FAQ</h2>
              <p>High-frequency field questions from Crash Site through Excavation Island.</p>
            </div>
          </div>
          <div className={styles.faqList}>
            {faqs.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
          <aside className={styles.helpPanel}>
            <span>Need a lookup?</span>
            <p>Search guides, builds, quests, and wiki entries in one pass.</p>
            <a href="/search">Search field guide ›</a>
          </aside>
        </section>
      </div>
    </main>
  );
}
