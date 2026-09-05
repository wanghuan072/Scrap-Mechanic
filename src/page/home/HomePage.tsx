import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { GptAd } from "@/components/ads/GptAd";
import { EvidenceStatus } from "@/components/common/EvidenceStatus";
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
        <Image
          className={styles.heroImage}
          src="/images/scrap-mechanic/screenshot-03.jpg"
          alt="A mechanic working beside an automated Scrap Mechanic farm"
          fill
          sizes="100vw"
          quality={60}
          loading="eager"
          fetchPriority="high"
        />
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
              <Link className={`${styles.heroButton} ${styles.orangeButton}`} href="/guides/beginner-first-hours">
                Start guide <span aria-hidden="true">›</span>
              </Link>
              <Link className={`${styles.heroButton} ${styles.blueButton}`} href="/wiki">
                Open wiki <span aria-hidden="true">›</span>
              </Link>
              <Link className={`${styles.heroButton} ${styles.greenButton}`} href="/tools">
                Run tools <span aria-hidden="true">›</span>
              </Link>
            </div>
          </div>
          <aside className={styles.heroBrief}>
            <span>Current release</span>
            <strong>{latestUpdate.title}</strong>
            <p>{latestUpdate.quickAnswer}</p>
            <Link href={`/updates/${latestUpdate.slug}`}>Read briefing ›</Link>
          </aside>
        </div>
      </section>

      <EvidenceStatus
        label="Scrap Mechanic version and data status"
        status="Live release confirmed"
        title={`Scrap Mechanic ${site.currentVersion} is live`}
        summary="The live game version and the checked version of a dataset are shown separately. Recipes, trades, unlocks, raid tables, and individual wiki entries keep their own version labels until they are re-extracted or retested."
        facts={[
          { label: "Live game", value: site.currentVersion },
          { label: "Official patch", value: site.currentVersionPublished },
          { label: "Status checked", value: site.lastChecked },
        ]}
        source={{
          label: "Official patch note",
          href: site.currentVersionSource,
        }}
        tone="confirmed"
      />

      <GptAd slotId="div-gpt-ad-home-1" unit="banner1" />

      <div className={`container ${styles.dashboard}`}>
        <section className={styles.panel}>
          <div className={styles.sectionLabel}>
            <div className={styles.sectionIntro}>
              <h2>Working tools</h2>
              <p>Open a calculator for raid pressure, material totals, or steering geometry.</p>
            </div>
            <Link href="/tools">Compare all tools →</Link>
          </div>
          <div className={styles.toolsGrid}>
            {availableTools.map((tool) => (
              <Link href={`/tools/${tool.slug}`} className={styles.toolCard} key={tool.slug}>
                <div className={styles.toolSymbol}>{tool.symbol}</div>
                <div>
                  <h3>{tool.name}</h3>
                  <p>{tool.description}</p>
                  <span>Open tool ›</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className={`${styles.panel} ${styles.briefPanel}`}>
          <div className={styles.sectionLabel}>
            <div className={styles.sectionIntro}>
              <h2>Ops brief</h2>
              <p>Live counts from the same indexes used on every inner page.</p>
            </div>
          </div>
          <div className={styles.briefGrid}>
            {briefing.map((item) => (
              <Link href={item.href} key={item.label} className={styles.briefStat}>
                <small>{item.label}</small>
                <b>{item.value}</b>
              </Link>
            ))}
            <div className={styles.briefMeta}>
              <span>Checked {site.lastChecked}</span>
              <strong>Live game {site.currentVersion}</strong>
            </div>
          </div>
        </section>

        <section className={`${styles.panel} ${styles.updatePanel}`}>
          <div className={styles.updateArt}>
            <Image
              src={latestUpdate.image}
              alt={latestUpdate.imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 280px"
              quality={60}
            />
          </div>
          <div className={styles.updateInfo}>
            <h2 className={styles.panelKicker}>Situation report</h2>
            <h3>{latestUpdate.title}</h3>
            <ul>
              {updateBullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
          <div className={styles.updateMachine}>
            <Image
              src="/images/scrap-mechanic/screenshot-10.jpg"
              alt="A Scrap Mechanic drilling vehicle"
              fill
              sizes="(max-width: 768px) 100vw, 260px"
              quality={60}
            />
            <Link href="/updates">
              All updates <span aria-hidden="true">›</span>
            </Link>
          </div>
        </section>

        <GptAd slotId="div-gpt-ad-home-2" unit="banner2" />

        <section className={styles.panel}>
          <div className={styles.sectionLabel}>
            <div className={styles.sectionIntro}>
              <h2>Start path</h2>
              <p>Five decisions that unlock the rest of Survival.</p>
            </div>
            <Link href="/guides/beginner-first-hours">First hours →</Link>
          </div>
          <div className={styles.startGrid}>
            {startSteps.map((step) => (
              <Link href={step.href} className={styles.startCard} key={step.number}>
                <div className={styles.tileImage}>
                  <Image
                    src={step.image}
                    alt=""
                    fill
                    sizes="96px"
                    quality={60}
                  />
                </div>
                <b>{step.number}</b>
                <div className={styles.startCopy}>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.sectionLabel}>
            <div className={styles.sectionIntro}>
              <h2>Field manual</h2>
              <p>Two start points, then Survival / Building / Progression manuals.</p>
            </div>
            <Link href="/guides">All {guides.length} guides →</Link>
          </div>
          <div className={styles.manualBody}>
            <div className={styles.manualLead}>
              <Link href={`/guides/${leadGuide.slug}`} className={styles.guideFeature}>
                <div className={styles.guideFeatureImage}>
                  <Image
                    src={leadGuide.image}
                    alt={leadGuide.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    quality={60}
                  />
                </div>
                <div>
                  <span>New world · {leadGuide.readingTime}</span>
                  <h3>{leadGuide.title}</h3>
                  <p>{leadGuide.quickAnswer}</p>
                  <b>Open first-hours route →</b>
                </div>
              </Link>
              {returnGuide ? (
                <Link href={`/guides/${returnGuide.slug}`} className={styles.returnCard}>
                  <span>Existing save · {returnGuide.readingTime}</span>
                  <h3>{returnGuide.title}</h3>
                  <p>{returnGuide.quickAnswer}</p>
                  <b>Read return brief →</b>
                </Link>
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
                    {entries.map((guide, index) => (
                      <Link
                        href={`/guides/${guide.slug}`}
                        key={guide.slug}
                        prefetch={false}
                      >
                        <em>{String(index + 1).padStart(2, "0")}</em>
                        <div>
                          <small>{guide.readingTime}</small>
                          <span>{guide.title}</span>
                        </div>
                      </Link>
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
            <Link href="/wiki">Wiki directory →</Link>
          </div>
          <div className={styles.referenceBody}>
            <div className={styles.taskGrid}>
              {taskRoutes.map((task) => (
                <Link
                  href={task.href}
                  className={styles.taskCard}
                  key={task.href}
                  prefetch={false}
                >
                  <small>{task.verb}</small>
                  <h3>{task.title}</h3>
                  <b>{task.metric}</b>
                  <span>{task.detail}</span>
                </Link>
              ))}
            </div>
            <div className={styles.wikiDirectory}>
              {wikiCategories.map((category, index) => (
                <Link
                  href={`/wiki/${category.slug}`}
                  className={styles.wikiTile}
                  key={category.slug}
                  prefetch={false}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div className={styles.wikiThumb}>
                    <Image src={category.image} alt="" fill sizes="72px" />
                  </div>
                  <div>
                    <h3>{category.name}</h3>
                    <small>{getWikiEntriesByCategory(category.slug).length} entries</small>
                  </div>
                  <b aria-hidden="true">→</b>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <GptAd slotId="div-gpt-ad-home-3" unit="banner3" />

        <section className={styles.panel}>
          <div className={styles.sectionLabel}>
            <div className={styles.sectionIntro}>
              <h2>Blueprints</h2>
              <p>Job-first builds with part counts and commissioning tests.</p>
            </div>
            <Link href="/builds">All {builds.length} files →</Link>
          </div>
          <div className={styles.buildShowcase}>
            <Link href={`/builds/${leadBuild.slug}`} className={styles.buildFeature}>
              <Image
                src={leadBuild.image}
                alt={leadBuild.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 48vw"
                quality={60}
              />
              <div>
                <span>{leadBuild.category}</span>
                <h3>{leadBuild.title}</h3>
                <p>{leadBuild.description}</p>
              </div>
            </Link>
            <div className={styles.buildStack}>
              {featuredBuilds.slice(1, 6).map((build, index) => (
                <Link
                  href={`/builds/${build.slug}`}
                  key={build.slug}
                  prefetch={false}
                >
                  <span>A-{String(index + 2).padStart(2, "0")}</span>
                  <div>
                    <small>{build.category}</small>
                    <h3>{build.title}</h3>
                  </div>
                  <b aria-hidden="true">↗</b>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={`${styles.panel} ${styles.splitPanel}`}>
          <div className={styles.sectionLabel}>
            <div className={styles.sectionIntro}>
              <h2>Survival map and landmarks</h2>
              <p>
                Understand generated-world locations, progression routes, risks,
                and preparation.
              </p>
            </div>
            <Link href="/map">Open location guide →</Link>
          </div>
          <div className={styles.landmarkGrid}>
            {mapPreview.map((location) => (
              <Link
                href={`/map#${location.slug}`}
                key={location.slug}
                className={styles.landmarkCard}
                prefetch={false}
              >
                <small>{location.type} · {location.danger}</small>
                <h3>{location.name}</h3>
                <p>{location.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.sectionLabel}>
            <div className={styles.sectionIntro}>
              <h2>Workshop</h2>
              <p>Post-1.0 candidates, legacy dependencies, and current status warnings.</p>
            </div>
            <Link href="/mods">Mods board →</Link>
          </div>
          <div className={styles.modsGrid}>
            {featuredMods.map((mod, index) => (
              <Link
                href={`/mods#${mod.slug}`}
                key={mod.slug}
                className={styles.modCard}
                prefetch={false}
              >
                <div className={styles.modImage}>
                  <Image
                    src={mod.image}
                    alt={mod.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 120px"
                    quality={60}
                  />
                </div>
                <div>
                  <span>
                    {String(index + 1).padStart(2, "0")} ·{" "}
                    {mod.workshopStatus === "removed-incompatible"
                      ? "quarantined"
                      : mod.compatibility}
                  </span>
                  <h3>{mod.title}</h3>
                  <p>{mod.bestFor}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <GptAd slotId="div-gpt-ad-home-4" unit="banner1" />

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
            <Link href="/search">Search field guide ›</Link>
          </aside>
        </section>
      </div>
    </main>
  );
}
