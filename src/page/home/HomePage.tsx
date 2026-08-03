import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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
    label: "Survive",
    href: "/guides",
    slugs: ["raid-defense", "farming-basics", "excavation-island-mining", "get-spud-gun"],
  },
  {
    label: "Build",
    href: "/guides",
    slugs: ["first-vehicle", "automated-farming", "controller-and-logic", "crafting-and-upgrade-priorities"],
  },
  {
    label: "Maintain",
    href: "/guides",
    slugs: ["returning-to-1-0", "multiplayer-basics", "save-backups-and-branches", "trading-and-packing"],
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
  const leadGuide = featuredGuides[0] ?? guides[0];
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
          priority
        />
        <div className={styles.heroShade} />
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroCopy}>
            <span className={styles.heroKicker}>FIELD GUIDE · v{site.currentVersion}</span>
            <h1>
              Scrap Mechanic{" "}
              <span>- Survival Operations Desk</span>
            </h1>
            <p>
              Compact routes for progression, wiki lookups, blueprints, raid math,
              and 1.0 compatibility decisions.
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
              <Link className={`${styles.heroButton} ${styles.darkButton}`} href="/builds">
                Blueprints <span aria-hidden="true">›</span>
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

      <div className={`container ${styles.dashboard}`}>
        <section className={styles.panel}>
          <div className={styles.sectionLabel}>
            <h2>Working tools</h2>
            <p>Open either calculator directly from the operations desk.</p>
            <Link href="/tools">Compare both tools →</Link>
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
            <h2>Ops brief</h2>
            <p>Live counts from the same indexes used on every inner page.</p>
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
              <strong>Baseline {site.currentVersion}</strong>
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
              sizes="280px"
            />
            <Link href="/updates">
              All updates <span aria-hidden="true">›</span>
            </Link>
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.sectionLabel}>
            <h2>Start path</h2>
            <p>Five decisions that unlock the rest of Survival.</p>
            <Link href="/guides/beginner-first-hours">First hours →</Link>
          </div>
          <div className={styles.startGrid}>
            {startSteps.map((step) => (
              <Link href={step.href} className={styles.startCard} key={step.number}>
                <div className={styles.tileImage}>
                  <Image src={step.image} alt="" fill sizes="(max-width: 768px) 100vw, 200px" />
                </div>
                <b>{step.number}</b>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.sectionLabel}>
            <h2>Field manual</h2>
            <p>Same Survive / Build / Maintain lanes as the Guides page.</p>
            <Link href="/guides">All {guides.length} guides →</Link>
          </div>
          <div className={styles.manualBody}>
            <Link href={`/guides/${leadGuide.slug}`} className={styles.guideFeature}>
              <div className={styles.guideFeatureImage}>
                <Image src={leadGuide.image} alt={leadGuide.imageAlt} fill sizes="(max-width: 768px) 100vw, 40vw" />
              </div>
              <div>
                <span>Lead file · {leadGuide.readingTime}</span>
                <h3>{leadGuide.title}</h3>
                <p>{leadGuide.quickAnswer}</p>
                <b>Open route →</b>
              </div>
            </Link>
            <div className={styles.laneBoard}>
              {guideLanes.map((lane) => (
                <div className={styles.laneColumn} key={lane.label}>
                  <header>
                    <h3>{lane.label}</h3>
                    <Link href={lane.href}>Index ›</Link>
                  </header>
                  {lane.slugs.map((slug) => {
                    const guide = guides.find((item) => item.slug === slug);
                    if (!guide) return null;
                    return (
                      <Link href={`/guides/${guide.slug}`} key={guide.slug}>
                        <small>{guide.readingTime}</small>
                        <span>{guide.title}</span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.sectionLabel}>
            <h2>Reference desk</h2>
            <p>Task indexes first, encyclopedia categories second.</p>
            <Link href="/wiki">Wiki directory →</Link>
          </div>
          <div className={styles.referenceBody}>
            <div className={styles.taskGrid}>
              {taskRoutes.map((task) => (
                <Link href={task.href} className={styles.taskCard} key={task.href}>
                  <small>{task.verb}</small>
                  <h3>{task.title}</h3>
                  <b>{task.metric}</b>
                  <span>{task.detail}</span>
                </Link>
              ))}
            </div>
            <div className={styles.wikiDirectory}>
              {wikiCategories.map((category, index) => (
                <Link href={`/wiki/${category.slug}`} className={styles.wikiTile} key={category.slug}>
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

        <section className={styles.panel}>
          <div className={styles.sectionLabel}>
            <h2>Blueprints</h2>
            <p>Job-first builds with part counts and commissioning tests.</p>
            <Link href="/builds">All {builds.length} files →</Link>
          </div>
          <div className={styles.buildShowcase}>
            <Link href={`/builds/${leadBuild.slug}`} className={styles.buildFeature}>
              <Image src={leadBuild.image} alt={leadBuild.imageAlt} fill sizes="(max-width: 768px) 100vw, 48vw" />
              <div>
                <span>{leadBuild.category}</span>
                <h3>{leadBuild.title}</h3>
                <p>{leadBuild.description}</p>
              </div>
            </Link>
            <div className={styles.buildStack}>
              {featuredBuilds.slice(1, 6).map((build, index) => (
                <Link href={`/builds/${build.slug}`} key={build.slug}>
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
            <h2>Landmarks</h2>
            <p>Generated-world navigation by role, not coordinates.</p>
            <Link href="/map">Map desk →</Link>
          </div>
          <div className={styles.landmarkGrid}>
            {mapPreview.map((location) => (
              <Link href={`/map#${location.slug}`} key={location.slug} className={styles.landmarkCard}>
                <small>{location.type} · {location.danger}</small>
                <h3>{location.name}</h3>
                <p>{location.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.sectionLabel}>
            <h2>Workshop</h2>
            <p>Post-1.0 mod candidates with install and risk notes.</p>
            <Link href="/mods">Mods board →</Link>
          </div>
          <div className={styles.modsGrid}>
            {featuredMods.map((mod, index) => (
              <Link href={`/mods#${mod.slug}`} key={mod.slug} className={styles.modCard}>
                <div className={styles.modImage}>
                  <Image src={mod.image} alt={mod.imageAlt} fill sizes="180px" />
                </div>
                <div>
                  <span>{String(index + 1).padStart(2, "0")} · {mod.compatibility}</span>
                  <h3>{mod.title}</h3>
                  <p>{mod.bestFor}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className={`${styles.panel} ${styles.faqPanel}`}>
          <div className={styles.sectionLabel}>
            <h2>FAQ</h2>
            <p>High-frequency field questions.</p>
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
