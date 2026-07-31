import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd, PageJsonLd } from "@/components/JsonLd";
import {
  recipeCollection,
  recipeUnlockCollection,
} from "@/data/game/playerData";
import { site } from "@/data/site";
import {
  raidCrops,
  raidCropValueThresholds,
  raidLevels,
  raidTimingRules,
} from "@/data/tools/raidCalculator";
import { raidBotOrder } from "@/data/tools/raidForecast";
import { createMetadata } from "@/seo/metadata";
import { pageTdk } from "@/seo/tdk";
import styles from "./tools.module.css";

export const metadata: Metadata = createMetadata(pageTdk.tools, "/tools");

const uniqueRecipeOutputs = new Set(
  recipeCollection.recipes.map((recipe) => recipe.output.uuid),
).size;
const outputsWithAlternatives = new Set(
  recipeCollection.recipes
    .filter(
      (recipe, _, all) =>
        all.filter((candidate) => candidate.output.uuid === recipe.output.uuid).length >
        1,
    )
    .map((recipe) => recipe.output.uuid),
).size;
const highestCropValue = Math.max(...raidCrops.map((crop) => crop.value));
const totalListedRaidRules = raidCropValueThresholds.length + raidTimingRules.length;

const toolFaqs = [
  {
    question: "Which Scrap Mechanic tools are available here?",
    answer:
      "The Tools section contains two working calculators: the Scrap Mechanic Raid Calculator and the Crafting Planner. Placeholder tools and the old checklist have been removed.",
  },
  {
    question: "What does the Scrap Mechanic Raid Calculator calculate?",
    answer:
      "It totals 10 current crop values, selects one of seven raid levels, applies the player modifier, returns the exact bot budget, and simulates weighted outcomes for nine enemy variants. The forecast estimates probabilities and sample timelines; it does not claim the exact live roll or spawn position.",
  },
  {
    question: "How much crafting data is in the Crafting Planner?",
    answer: `The planner contains ${recipeCollection.recipeCount} recipes across ${recipeCollection.stations.length} stations, representing ${uniqueRecipeOutputs} unique outputs. It also identifies batch rounding, direct ingredients, station time, and known unlock routes.`,
  },
  {
    question: "Does the Crafting Planner calculate nested ingredients?",
    answer:
      "No. It deliberately totals direct recipe inputs for the selected station recipe. Craftable ingredients are labeled so you can open a separate order without mixing direct and recursive totals.",
  },
];

export default function ToolsPage() {
  return (
    <main>
      <PageJsonLd seo={pageTdk.tools} path="/tools" type="CollectionPage" />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "ItemList",
              name: "Scrap Mechanic calculators",
              numberOfItems: 2,
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  url: `${site.url}/tools/raid-calculator`,
                  name: "Scrap Mechanic Raid Calculator",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  url: `${site.url}/tools/crafting-planner`,
                  name: "Scrap Mechanic Crafting Planner",
                },
              ],
            },
            {
              "@type": "FAQPage",
              mainEntity: toolFaqs.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
              })),
            },
          ],
        }}
      />

      <section className={styles.hero}>
        <Image
          className={styles.heroImage}
          src="/images/scrap-mechanic/screenshot-10.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
        />
        <div className={styles.heroShade} />
        <div className={`container ${styles.heroInner}`}>
          <div>
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Tools" }]} />
            <span className={styles.eyebrow}>Two calculators / no placeholder tools</span>
            <h1>
              Scrap Mechanic Tools <span>- Data In, Decisions Out</span>
            </h1>
            <p>
              Use the Raid Calculator before planting and the Crafting Planner before
              loading a station. Both tools expose their inputs, version boundaries,
              rounding rules, and limits so every result can be checked against the
              current game data.
            </p>
          </div>
          <aside className={styles.heroPlate}>
            <span>Live tool inventory</span>
            <strong>02</strong>
            <dl>
              <div>
                <dt>Raid inputs</dt>
                <dd>{raidCrops.length} crops</dd>
              </div>
              <div>
                <dt>Crafting records</dt>
                <dd>{recipeCollection.recipeCount} recipes</dd>
              </div>
              <div>
                <dt>Placeholders</dt>
                <dd>0</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <section className={styles.factStrip} aria-label="Tools data coverage">
        <div className={`container ${styles.factGrid}`}>
          <article>
            <strong>{raidLevels.length}</strong>
            <span>raid bands</span>
            <p>Level 1 through the strict Super Raid boundary.</p>
          </article>
          <article>
            <strong>{uniqueRecipeOutputs}</strong>
            <span>unique outputs</span>
            <p>Covered by {recipeCollection.recipeCount} station recipes.</p>
          </article>
          <article>
            <strong>{recipeCollection.stations.length}</strong>
            <span>crafting stations</span>
            <p>From the Workbench to the Mining Hub Dispenser.</p>
          </article>
          <article>
            <strong>{recipeUnlockCollection.counts.schematicbot}</strong>
            <span>Schematicbot outputs</span>
            <p>Marked by the current unlock-route data.</p>
          </article>
        </div>
      </section>

      <section className={styles.toolSection}>
        <div className="container">
          <header className={styles.sectionHeading}>
            <div>
              <span>Choose the decision you need</span>
              <h2>Two tools, two verified jobs</h2>
            </div>
            <p>
              The calculators remain separate because raid pressure and crafting cost
              use different inputs, version checks, and uncertainty boundaries.
            </p>
          </header>

          <div className={styles.toolStack}>
            <article className={`${styles.toolCard} ${styles.raidCard}`}>
              <div className={styles.toolVisual}>
                <Image
                  src="/images/scrap-mechanic/screenshot-01.jpg"
                  alt="Scrap Mechanic farm prepared for a crop raid"
                  fill
                  sizes="(max-width: 768px) 100vw, 48vw"
                />
                <span>01 / Defense data</span>
              </div>
              <div className={styles.toolCopy}>
                <span className={styles.status}>Available now</span>
                <h3>Scrap Mechanic Raid Calculator</h3>
                <p>
                  Convert planted crops into total crop value, raid level, exact bot
                  budget, multiplayer modifier, weighted enemy probabilities, and one
                  possible drop timeline.
                </p>
                <dl className={styles.metrics}>
                  <div>
                    <dt>Crop inputs</dt>
                    <dd>{raidCrops.length}</dd>
                  </div>
                  <div>
                    <dt>Value range</dt>
                    <dd>
                      {Math.min(...raidCrops.map((crop) => crop.value))}–
                      {highestCropValue.toLocaleString("en-US")}
                    </dd>
                  </div>
                  <div>
                    <dt>Enemy variants</dt>
                    <dd>{raidBotOrder.length}</dd>
                  </div>
                  <div>
                    <dt>Super starts</dt>
                    <dd>10,001</dd>
                  </div>
                </dl>
                <div className={styles.boundary}>
                  <b>Boundary proof</b>
                  <p>
                    10 Pineapples = 10,000 points, Level 6, base budget 700. Add
                    one Tomato and 10,001 becomes a Super Raid with a one-player budget
                    of 1,001.
                  </p>
                </div>
                <Link href="/tools/raid-calculator">Open Raid Calculator →</Link>
              </div>
            </article>

            <article className={`${styles.toolCard} ${styles.craftingCard}`}>
              <div className={styles.toolVisual}>
                <Image
                  src="/images/game-items/craftbot-b63c6440.webp"
                  alt="Craftbot used by the Scrap Mechanic Crafting Planner"
                  fill
                  sizes="(max-width: 768px) 100vw, 48vw"
                />
                <span>02 / Workshop data</span>
              </div>
              <div className={styles.toolCopy}>
                <span className={styles.status}>Available now</span>
                <h3>Scrap Mechanic Crafting Planner</h3>
                <p>
                  Search the extracted recipe set, select an output and station option,
                  then calculate complete batches, direct materials, extra output,
                  total station time, and the known unlock route.
                </p>
                <dl className={styles.metrics}>
                  <div>
                    <dt>Recipes</dt>
                    <dd>{recipeCollection.recipeCount}</dd>
                  </div>
                  <div>
                    <dt>Outputs</dt>
                    <dd>{uniqueRecipeOutputs}</dd>
                  </div>
                  <div>
                    <dt>Stations</dt>
                    <dd>{recipeCollection.stations.length}</dd>
                  </div>
                  <div>
                    <dt>Alt. outputs</dt>
                    <dd>{outputsWithAlternatives}</dd>
                  </div>
                </dl>
                <div className={styles.boundary}>
                  <b>Batch proof</b>
                  <p>
                    Requested quantity is divided by recipe output and rounded up to a
                    whole batch. The planner shows the actual production total and any
                    unavoidable extra pieces.
                  </p>
                </div>
                <Link href="/tools/crafting-planner">Open Crafting Planner →</Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.stationSection}>
        <div className={`container ${styles.stationLayout}`}>
          <header>
            <span>Crafting database distribution</span>
            <h2>Where the 614 recipes live</h2>
            <p>
              The Craftbot carries most records, but the planner keeps the other eight
              station datasets separate so an identical output can retain the correct
              batch size, time, and ingredient path.
            </p>
          </header>
          <div className={styles.stationBars}>
            {recipeCollection.stations.map((station) => (
              <article key={station.slug}>
                <div>
                  <strong>{station.name}</strong>
                  <span>{station.recipeCount} recipes</span>
                </div>
                <div className={styles.bar}>
                  <i
                    style={
                      {
                        "--station-share": `${(station.recipeCount / recipeCollection.recipeCount) * 100}%`,
                      } as CSSProperties
                    }
                  />
                </div>
                <small>
                  {((station.recipeCount / recipeCollection.recipeCount) * 100).toFixed(
                    1,
                  )}
                  % of database
                </small>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.guardrailSection}>
        <div className="container">
          <header className={styles.sectionHeading}>
            <div>
              <span>What the numbers can prove</span>
              <h2>Calculation boundaries</h2>
            </div>
            <p>
              A useful calculator must also say what it cannot infer from static data.
            </p>
          </header>
          <div className={styles.guardrailGrid}>
            <article>
              <span>Raid Calculator knows</span>
              <strong>{totalListedRaidRules} published numeric rules</strong>
              <p>
                Crop values, thresholds, budget bands, player scaling, timers, and
                distance rules determine the exact result. Weighted group tables power
                the forecast.
              </p>
            </article>
            <article>
              <span>Raid Calculator cannot know</span>
              <strong>Live spawn rolls and pathfinding</strong>
              <p>
                The precise enemy sequence, drop direction, positions, terrain, and
                runtime navigation remain session outcomes even when probabilities are
                available.
              </p>
            </article>
            <article>
              <span>Crafting Planner knows</span>
              <strong>Direct station cost and complete batches</strong>
              <p>
                It multiplies the selected recipe inputs, time, and output using the
                requested quantity and chosen station option.
              </p>
            </article>
            <article>
              <span>Crafting Planner does not mix</span>
              <strong>Trades, recursive crafts, or stored inventory</strong>
              <p>
                Trader exchanges and deeper ingredient trees stay separate so the
                result remains auditable against one in-game recipe panel.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.faqSection}>
        <div className="container">
          <header className={styles.sectionHeading}>
            <div>
              <span>Tool data questions</span>
              <h2>Scrap Mechanic calculator FAQ</h2>
            </div>
            <p>
              Short answers about coverage, calculation scope, recipe depth, and raid
              uncertainty.
            </p>
          </header>
          <div className={styles.faqList}>
            {toolFaqs.map((item, index) => (
              <article key={item.question}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
