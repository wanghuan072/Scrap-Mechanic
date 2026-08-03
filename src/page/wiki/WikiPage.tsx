import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionHero } from "@/components/common/SectionHero";
import { PageJsonLd } from "@/seo/JsonLd";
import {
  recipeCollection,
  schematicUnlocks,
  tradeCollection,
} from "@/lib/game/player-data";
import { allWikiEntries, getWikiEntriesByCategory, quests, wikiCategories } from "@/lib/content/catalog";
import { createMetadata } from "@/seo/metadata";
import { pageTdk } from "@/seo/tdk";
import styles from "@/style/page/wiki/wiki-directory.module.css";

export const metadata: Metadata = createMetadata(pageTdk.wiki, "/wiki");

const catalogGroups = [
  {
    eyebrow: "Build",
    title: "Building & Automation",
    description:
      "Choose structural material, then connect the moving, powered, sensing, and storage parts that make a creation work.",
    slugs: ["blocks", "parts"],
  },
  {
    eyebrow: "Carry",
    title: "Inventory & Materials",
    description:
      "Find portable supplies, progression objects, raw materials, refined resources, fuel, and upgrade components.",
    slugs: ["items", "resources"],
  },
  {
    eyebrow: "Use",
    title: "Tools & Combat",
    description:
      "Compare the mechanic's working kit with handheld and mountable options for hostile routes, raids, and Warehouses.",
    slugs: ["tools", "weapons"],
  },
  {
    eyebrow: "Grow",
    title: "Farming",
    description:
      "Check crops, seeds, watering, harvest roles, packing routes, ammunition uses, and raid pressure.",
    slugs: ["crops"],
  },
  {
    eyebrow: "Survive",
    title: "Bots & Creatures",
    description:
      "Identify hostile robots and passive creatures by behavior, threat, useful drops, and safer counterplay.",
    slugs: ["bots"],
  },
  {
    eyebrow: "Unlock",
    title: "Customization & Rewards",
    description:
      "Track outfit pieces, placeable quest rewards, decorative unlocks, and the practical build uses behind them.",
    slugs: ["garments", "quest-rewards"],
  },
] as const;

const taskRoutes = [
  {
    index: "01",
    verb: "Make",
    title: "Crafting Recipes",
    question: "What do I need to build it?",
    description:
      "Search outputs or ingredients, choose a station, and separate default recipes from schematic-gated production.",
    metric: `${recipeCollection.recipeCount} recipes`,
    detail: `${recipeCollection.stations.length} crafting stations`,
    href: "/wiki/recipes",
  },
  {
    index: "02",
    verb: "Trade",
    title: "Trader Prices",
    question: "What will the trader actually give me?",
    description:
      "Compare exact costs and distinguish finished items from purchases that only unlock a recipe.",
    metric: `${tradeCollection.tradeCount} offers`,
    detail: `${schematicUnlocks.length} recipe unlocks`,
    href: "/wiki/trades",
  },
  {
    index: "03",
    verb: "Progress",
    title: "Quest Directory",
    question: "What should I complete next?",
    description:
      "Follow prerequisites, objectives, locations, and the exact rewards attached to each mission.",
    metric: `${quests.length} missions`,
    detail: "Main and optional paths",
    href: "/wiki/quests",
  },
  {
    index: "04",
    verb: "Unlock",
    title: "Schematic Catalog",
    question: "Why is this recipe still unavailable?",
    description:
      "Connect every schematic trader cost to the recipe, materials, station, and output it unlocks.",
    metric: `${schematicUnlocks.length} unlocks`,
    detail: "Cost → recipe → craft",
    href: "/wiki/schematics",
  },
] as const;

function getCategory(slug: string) {
  const category = wikiCategories.find((item) => item.slug === slug);
  if (!category) {
    throw new Error(`Missing Wiki category: ${slug}`);
  }
  return category;
}

export default function WikiPage() {
  return (
    <main>
      <PageJsonLd seo={pageTdk.wiki} path="/wiki" type="CollectionPage" />
      <SectionHero
        accent="Player Directory"
        eyebrow="Plan / find / build / progress"
        image="/images/scrap-mechanic/screenshot-04.jpg"
        imageAlt="Scrap Mechanic workshop and inventory systems"
        intro="Start with the job you are doing: make an item, price a trade, follow a quest, identify a part, or prepare for a bot."
        metrics={[
          { label: "Entries", value: `${allWikiEntries.length}` },
          { label: "Recipes", value: `${recipeCollection.recipeCount}` },
          { label: "Quests", value: `${quests.length}` },
        ]}
        title="Scrap Mechanic Wiki"
        tone="cyan"
      />

      <section className={styles.systemSection}>
        <div className={`container ${styles.taskLayout}`}>
          <header className={styles.taskHeader}>
            <div>
              <span>Start with the result you need</span>
              <h2>Four jobs, four direct routes</h2>
            </div>
            <p>
              These are working indexes, not Wiki categories. Choose one when you
              need to make, exchange, complete, or unlock something.
            </p>
            <dl>
              <div>
                <dt>Indexes</dt>
                <dd>Recipes · Trades</dd>
              </div>
              <div>
                <dt>Progression</dt>
                <dd>Quests · Schematics</dd>
              </div>
            </dl>
          </header>

          <nav className={styles.taskList} aria-label="Player task indexes">
            {taskRoutes.map((task) => (
              <Link href={task.href} key={task.href}>
                <span className={styles.taskIndex}>{task.index}</span>
                <div className={styles.taskName}>
                  <small>{task.verb}</small>
                  <strong>{task.title}</strong>
                </div>
                <div className={styles.taskQuestion}>
                  <h3>{task.question}</h3>
                  <p>{task.description}</p>
                </div>
                <div className={styles.taskMetric}>
                  <strong>{task.metric}</strong>
                  <span>{task.detail}</span>
                </div>
                <span className={styles.taskArrow} aria-hidden="true">
                  ↗
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <section className="page-section page-section-dark">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Browse by what it is</span>
              <h2>The encyclopedia layer</h2>
            </div>
            <p>
              Once you know the object, browse its category for properties,
              acquisition routes, recipes, trades, and connected entries.
            </p>
          </div>

          <div className={styles.catalogGrid}>
            {catalogGroups.map((group, groupIndex) => {
              const categories = group.slugs.map(getCategory);
              const primaryCategory = categories[0];
              const totalEntries = categories.reduce(
                (total, category) =>
                  total + getWikiEntriesByCategory(category.slug).length,
                0,
              );

              return (
                <article className={styles.catalogCard} key={group.title}>
                  <div className={styles.catalogIndex}>
                    <span>{String(groupIndex + 1).padStart(2, "0")}</span>
                    <small>{group.eyebrow}</small>
                  </div>
                  <div className={styles.catalogImage}>
                    <Image
                      src={primaryCategory.image}
                      alt={primaryCategory.imageAlt}
                      fill
                      sizes="(max-width: 700px) 90px, 116px"
                    />
                  </div>
                  <div className={styles.catalogBody}>
                    <span>{totalEntries} entries</span>
                    <h3>{group.title}</h3>
                    <p>{group.description}</p>
                    <div className={styles.categoryLinks}>
                      {categories.map((category) => (
                        <Link href={`/wiki/${category.slug}`} key={category.slug}>
                          {category.name}
                          <small>
                            {getWikiEntriesByCategory(category.slug).length}
                          </small>
                        </Link>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
