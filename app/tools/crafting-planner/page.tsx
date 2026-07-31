import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CraftingPlanner } from "@/components/CraftingPlanner";
import { JsonLd } from "@/components/JsonLd";
import {
  recipeCollection,
  recipeUnlockCollection,
} from "@/data/game/playerData";
import { site } from "@/data/site";
import { getTool } from "@/lib/content";
import { createMetadata } from "@/seo/metadata";
import styles from "./crafting-planner-page.module.css";

const tool = getTool("crafting-planner")!;
const uniqueOutputCount = new Set(
  recipeCollection.recipes.map((recipe) => recipe.output.uuid),
).size;

export const metadata: Metadata = createMetadata(
  tool.seo,
  "/tools/crafting-planner",
);

const faqs = [
  {
    question: "How does the planner handle recipe output greater than one?",
    answer:
      "It rounds the requested amount up to complete batches, then shows the actual output and any extra pieces.",
  },
  {
    question: "Can the planner calculate schematic-locked items?",
    answer:
      "Yes. It calculates their material order and marks that the matching schematic must be unlocked before crafting.",
  },
  {
    question: "Are trader exchanges included?",
    answer:
      "No. Crafting and trading remain separate so packed crops, rescued Farmers, and Wonk Stacks never appear as normal workshop ingredients.",
  },
];

export default function CraftingPlannerPage() {
  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "SoftwareApplication",
              name: "Scrap Mechanic Crafting Planner",
              description: tool.seo.description,
              applicationCategory: "GameApplication",
              operatingSystem: "Web browser",
              url: `${site.url}/tools/crafting-planner`,
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
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
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: "Crafting Planner" },
            ]}
          />
          <span className={styles.eyebrow}>Material totals / batch planning</span>
          <h1>
            Scrap Mechanic Crafting Planner <span>- Material Calculator</span>
          </h1>
          <p>
            Choose a craftable item and quantity. The planner returns full batches,
            exact direct materials, finished output, extra pieces, station time, and
            unlock requirements.
          </p>
          <div className={styles.heroFacts}>
            <span>{recipeCollection.recipeCount} recipes</span>
            <span>{uniqueOutputCount} unique outputs</span>
            <span>{recipeCollection.stations.length} stations</span>
            <span>Checked version {recipeCollection.checkedVersion}</span>
          </div>
        </div>
      </section>

      <section className={styles.toolSection}>
        <div className="container">
          <CraftingPlanner
            recipes={recipeCollection.recipes}
            unlockRoutes={recipeUnlockCollection.routeByOutput}
          />
        </div>
      </section>

      <section className={styles.workflowSection}>
        <div className={`container ${styles.workflowGrid}`}>
          <header>
            <span>Plan before loading the station</span>
            <h2>A three-step workshop routine</h2>
            <p>
              The planner handles one finished item at a time so the result remains
              easy to verify against the station menu.
            </p>
          </header>
          <ol>
            <li>
              <span>01</span>
              <div>
                <strong>Choose the finished item</strong>
                <p>Use the exact in-game name and select the correct station option.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>Enter the quantity</strong>
                <p>Batch rounding is automatic, including leftover output.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>Stage materials beside the station</strong>
                <p>Keep quest and repair reserves outside the active crafting chest.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section className={styles.guideSection}>
        <div className={`container ${styles.guideGrid}`}>
          <article>
            <span>Need another recipe?</span>
            <h2>Browse the complete crafting list</h2>
            <p>
              Search by output, ingredient, station, or Craftbot group when you are
              comparing several possible workshop paths.
            </p>
            <Link href="/wiki/recipes">Open all recipes →</Link>
          </article>
          <article>
            <span>Buying instead of building?</span>
            <h2>Check both trader inventories</h2>
            <p>
              Hideout crate exchanges and Mining Hub Wonk prices use a separate list
              with exact quantities.
            </p>
            <Link href="/wiki/trades">Open Trader Prices →</Link>
          </article>
        </div>
      </section>

      <section className={styles.faqSection}>
        <div className={`container ${styles.faqGrid}`}>
          <header>
            <span>Planner questions</span>
            <h2>What the total means</h2>
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
