import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd, PageJsonLd } from "@/components/JsonLd";
import { RecipeDirectory } from "@/components/RecipeDirectory";
import {
  getPlayerItemImage,
  recipeCollection,
  recipeUnlockCollection,
} from "@/data/game/playerData";
import { site } from "@/data/site";
import { getWikiEntryByName } from "@/lib/content";
import { createMetadata } from "@/seo/metadata";
import { pageTdk } from "@/seo/tdk";
import styles from "./recipes.module.css";

export const metadata: Metadata = createMetadata(pageTdk.recipes, "/wiki/recipes");

const faqs = [
  {
    question: "How many crafting recipes are listed?",
    answer:
      "The directory contains 614 craftable results across nine stations in the checked 1.0.1.869 installation. Trader exchanges are kept on the separate Trader Prices page.",
  },
  {
    question: "Why can one item have more than one recipe?",
    answer:
      "Some items are available at different stations or through different production paths. Check the station and batch size before collecting materials.",
  },
  {
    question: "How do locked Craftbot and Saw Table recipes open?",
    answer:
      "The 573 Craftbot and Saw Table outputs split into 356 Schematicbot recipes, 120 dedicated progression rewards, 73 recipes available from the start, and 24 entries in the Craftbot core set. Use the unlock-route filters instead of assuming every locked recipe comes from a trader.",
  },
  {
    question: "Can a Schematic Box unlock every locked recipe?",
    answer:
      "No. A Schematic Box selects from the 356-item Schematicbot pool. Trader offers, quests and Farmer tasks, Growlabs, refined treasures, and Warehouse progression use their own routes and are excluded from that random pool.",
  },
  {
    question: "Does crafting time apply to every item in the batch?",
    answer:
      "The displayed time belongs to one recipe batch. Use the Crafting Planner to multiply batches, materials, output, and total station time.",
  },
];

export default function RecipesPage() {
  const recipeNames = [
    ...new Set(
      recipeCollection.recipes.flatMap((recipe) => [
        recipe.output.name,
        ...recipe.ingredients.map((ingredient) => ingredient.name),
      ]),
    ),
  ];
  const wikiLinks = Object.fromEntries(
    recipeNames.flatMap((name) => {
      const entry = getWikiEntryByName(name);
      return entry
        ? [[name.toLowerCase(), `/wiki/${entry.category}/${entry.slug}`] as const]
        : [];
    }),
  );
  const craftbotIcon = getPlayerItemImage("Craftbot");

  return (
    <main>
      <PageJsonLd seo={pageTdk.recipes} path="/wiki/recipes" type="CollectionPage" />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              name: "Scrap Mechanic Recipes",
              description:
                "Crafting ingredients, batch sizes, station times, and unlock requirements for Scrap Mechanic.",
              url: `${site.url}/wiki/recipes`,
              numberOfItems: recipeCollection.recipeCount,
              dateModified: "2026-07-30",
            },
            {
              "@type": "FAQPage",
              mainEntity: faqs.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
              })),
            },
          ],
        }}
      />

      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Wiki", href: "/wiki" },
                { label: "Recipes" },
              ]}
            />
            <span className={styles.eyebrow}>Workshop index / nine stations</span>
            <h1>
              Scrap Mechanic Recipes <span>- Complete Crafting List</span>
            </h1>
            <p>
              Search the item you want to make, check every required material, and
              confirm the correct machine before committing a full storage chest.
            </p>
            <div className={styles.heroActions}>
              <Link href="/tools/crafting-planner">Calculate materials</Link>
              <Link href="/wiki/trades">Compare trader prices</Link>
            </div>
          </div>
          <aside className={styles.heroMachine}>
            {craftbotIcon && (
              <Image
                src={craftbotIcon}
                alt="Craftbot item icon in Scrap Mechanic"
                width={192}
                height={192}
                priority
              />
            )}
            <div>
              <strong>{recipeCollection.recipeCount}</strong>
              <span>craftable results</span>
              <small>Checked version {recipeCollection.checkedVersion}</small>
            </div>
          </aside>
        </div>
      </section>

      <section className={styles.stationSection}>
        <div className="container">
          <header className={styles.sectionHeading}>
            <div>
              <span>Choose the right machine</span>
              <h2>Nine crafting stations, different jobs</h2>
            </div>
            <p>
              Craftbot carries the largest catalog. Smaller stations matter because
              they handle food, field recovery, refining, wood shapes, garments, and
              the mining progression.
            </p>
          </header>
          <div className={styles.stationStrip}>
            {recipeCollection.stations.map((station, index) => (
              <article key={station.slug}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{station.name}</strong>
                <small>{station.recipeCount} recipes</small>
                <p>{station.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.directorySection} id="recipe-directory">
        <div className="container">
          <header className={styles.sectionHeading}>
            <div>
              <span>Search and compare</span>
              <h2>Recipe directory</h2>
            </div>
            <p>
              Each row shows one batch. Search by finished item or by an ingredient
              you already have. Filter totals count recipe rows; progression totals
              below count distinct Craftbot and Saw Table outputs.
            </p>
          </header>
          <Suspense fallback={<div className="empty-state">Preparing recipe filters…</div>}>
            <RecipeDirectory
              recipes={recipeCollection.recipes}
              stations={recipeCollection.stations}
              wikiLinks={wikiLinks}
              unlockRoutes={recipeUnlockCollection.routeByOutput}
            />
          </Suspense>
        </div>
      </section>

      <section className={styles.playerNotes}>
        <div className={`container ${styles.notesGrid}`}>
          <article>
            <span>Batch math</span>
            <h2>Count full batches, not single pieces</h2>
            <p>
              A recipe can produce more than one item. Round up to the next complete
              batch, then keep the extra pieces for repairs or the next vehicle.
            </p>
            <Link href="/tools/crafting-planner">Open the Crafting Planner →</Link>
          </article>
          <article>
            <span>Schematicbot pool</span>
            <h2>356 outputs share two scan options</h2>
            <p>
              Scan an eligible blue-icon part to target its exact recipe without
              consuming the part, or spend one Schematic Box for a random remaining
              recipe. Thirty Saw Table outputs are included in this pool.
            </p>
            <Link href="/wiki/schematics/schematicbot">
              Learn the two scan routes →
            </Link>
          </article>
          <article>
            <span>Dedicated progression</span>
            <h2>120 recipes sit outside the random pool</h2>
            <p>
              That group contains 42 trader offers, 65 quest or Farmer-task
              unlocks, 7 Growlab rewards, 5 refined treasure recipes, and the first
              Plasma Drill recipe from Warehouse progression.
            </p>
            <Link href="/wiki/schematics">Compare every unlock route →</Link>
          </article>
        </div>
      </section>

      <section className={styles.faqSection}>
        <div className={`container ${styles.faqLayout}`}>
          <header>
            <span>Player questions</span>
            <h2>Before filling the Craftbot queue</h2>
            <p>
              Checked July 30, 2026 for version {recipeCollection.checkedVersion}.
              Confirm patch-sensitive values in your current station menu.
            </p>
          </header>
          <div>
            {faqs.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
