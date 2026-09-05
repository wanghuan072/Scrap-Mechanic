import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { GptAd } from "@/components/ads/GptAd";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { JsonLd, PageJsonLd } from "@/seo/JsonLd";
import { recipeCollection } from "@/lib/game/player-data";
import { site } from "@/config/site";
import {
  raidCrops,
  raidCropValueThresholds,
  raidLevels,
  raidTimingRules,
} from "@/lib/data/raid-calculator";
import { raidBotOrder } from "@/lib/tools/raid-forecast";
import { createMetadata } from "@/seo/metadata";
import { pageTdk } from "@/seo/tdk";
import styles from "@/style/page/tools/tools.module.css";

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
      "The Tools section contains three working calculators: the Scrap Mechanic Raid Calculator, the Crafting Planner, and the Wheel Angle Calculator. Placeholder tools and the old checklist have been removed.",
  },
  {
    question: "What does the Scrap Mechanic Raid Calculator calculate?",
    answer:
      `It totals ${raidCrops.length} current crop values, selects one of seven raid levels, applies the player modifier, returns the exact bot budget, and simulates weighted outcomes for nine enemy variants. The forecast estimates probabilities and sample timelines; it does not claim the exact live roll or spawn position.`,
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
  {
    question: "What does the Wheel Angle Calculator model?",
    answer:
      "It calculates ideal inner and outer front-wheel angles for one fixed rear axle and one independently steered front axle. Tire grip, suspension movement, body clearance, rear steering, and steering linkages remain outside the model.",
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
              numberOfItems: 3,
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
                {
                  "@type": "ListItem",
                  position: 3,
                  url: `${site.url}/tools/wheel-angle-calculator`,
                  name: "Scrap Mechanic Wheel Angle Calculator",
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
          sizes="100vw"
          quality={60}
          loading="eager"
          fetchPriority="high"
        />
        <div className={styles.heroShade} />
        <div className={`container ${styles.heroInner}`}>
          <div>
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Tools" }]} />
            <span className={styles.eyebrow}>Three calculators / no placeholder tools</span>
            <h1>
              Scrap Mechanic Tools <span>- Data In, Decisions Out</span>
            </h1>
            <p>
              Check raid pressure before planting, total materials before loading a
              station, or calculate separate front-wheel limits before tuning a vehicle.
              Every tool exposes its inputs, rules, and limits so the result can be
              checked.
            </p>
          </div>
          <aside className={styles.heroPlate}>
            <span>Live tool inventory</span>
            <strong>03</strong>
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
                <dt>Steering presets</dt>
                <dd>3 editable</dd>
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
            <strong>1–89°</strong>
            <span>steering model</span>
            <p>Conventional front-steer angle range with guarded inputs.</p>
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
              Raid pressure and crafting cost use different inputs, version checks, and
              uncertainty boundaries, so their calculators remain separate.
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

          <header className={`${styles.sectionHeading} ${styles.steeringHeading}`}>
            <div>
              <span>Vehicle geometry</span>
              <h2>One steering tool, one clear model</h2>
            </div>
            <p>
              The wheel-angle tool stays independent because it models bearing-center
              geometry instead of game-data totals.
            </p>
          </header>

          <div className={styles.toolStack}>
            <article className={`${styles.toolCard} ${styles.wheelCard}`}>
              <div className={styles.toolVisual}>
                <Image
                  src="/images/game-items/driver-s-seat-cf3fdcfc.webp"
                  alt="Driver's Seat used to configure steering bearings"
                  fill
                  sizes="(max-width: 768px) 100vw, 48vw"
                />
                <span>03 / Steering geometry</span>
              </div>
              <div className={styles.toolCopy}>
                <span className={styles.status}>Available now</span>
                <h3>Scrap Mechanic Wheel Angle Calculator</h3>
                <p>
                  Convert wheelbase, steering-bearing spacing, and the maximum inner
                  wheel angle into separate left and right bearing limits for ideal
                  Ackermann steering.
                </p>
                <dl className={styles.metrics}>
                  <div>
                    <dt>Presets</dt>
                    <dd>3</dd>
                  </div>
                  <div>
                    <dt>Angle range</dt>
                    <dd>1–89°</dd>
                  </div>
                  <div>
                    <dt>Steering axles</dt>
                    <dd>1 front</dd>
                  </div>
                  <div>
                    <dt>Setup</dt>
                    <dd>Level 5</dd>
                  </div>
                </dl>
                <div className={styles.boundary}>
                  <b>Geometry proof</b>
                  <p>
                    A 6 × 4 chassis with a 27° inside-wheel limit needs a 20.82°
                    outside-wheel limit for the ideal bearing-center model.
                  </p>
                </div>
                <Link href="/tools/wheel-angle-calculator">
                  Open Wheel Angle Calculator →
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <GptAd slotId="div-gpt-ad-tools-1" unit="banner1" />

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
            <article>
              <span>Wheel Angle Calculator knows</span>
              <strong>Ideal bearing-center steering geometry</strong>
              <p>
                Wheelbase, pivot track, and inner-wheel limit determine the ideal outer
                angle, angle difference, turning radius, and physical bearing settings.
              </p>
            </article>
            <article>
              <span>Wheel Angle Calculator cannot know</span>
              <strong>Grip, flex, clearance, or special steering</strong>
              <p>
                Tire friction, suspension movement, body contact, rear steering,
                multiple axles, and linkages still require an in-game test.
              </p>
            </article>
          </div>
        </div>
      </section>

      <GptAd slotId="div-gpt-ad-tools-2" unit="banner2" />

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
