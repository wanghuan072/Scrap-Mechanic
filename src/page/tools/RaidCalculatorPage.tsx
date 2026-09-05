import type { Metadata } from "next";
import Link from "next/link";
import { GptAd } from "@/components/ads/GptAd";
import { EvidenceStatus } from "@/components/common/EvidenceStatus";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { RaidCalculator } from "@/page/tools/components/RaidCalculator";
import { JsonLd } from "@/seo/JsonLd";
import { site } from "@/config/site";
import { raidCrops, raidLevels, raidTimingRules } from "@/lib/data/raid-calculator";
import { getTool } from "@/lib/content/catalog";
import { createMetadata } from "@/seo/metadata";
import styles from "@/style/page/tools/raid-calculator-page.module.css";

const tool = getTool("raid-calculator")!;

const raidFaq = [
  {
    question: "Can one crop trigger a raid in Scrap Mechanic 1.0?",
    answer:
      "Yes. The current Level 1 threshold begins at a positive plant value of 1, so one Tomato or one Potato enters the first raid band. The final bot budget and group roll are still separate calculations.",
  },
  {
    question: "Why did the raid panel disappear after I reloaded or drove away?",
    answer:
      "Raid state is saved, but the panel is local: it is shown while the player is inside the 96-unit raid area and the farm is the closest positive-value raid. Return to the crop cluster before assuming the countdown was deleted.",
  },
  {
    question: "Why can I not plant more crops during the attack?",
    answer:
      "The soil blocks new planting while its area has an active raid. Finish the attack state first; adding seeds is not a valid way to change the live wave after it begins.",
  },
  {
    question: "Why did no bots appear at the exact timer position?",
    answer:
      "The calculator determines level and budget, not a fixed spawn tile. Terrain, valid navigation, drop positions, player proximity, and the weighted enemy-group roll control the live arrival.",
  },
];

export const metadata: Metadata = createMetadata(
  tool.seo,
  "/tools/raid-calculator",
);

export default function RaidCalculatorPage() {
  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Scrap Mechanic Raid Calculator",
          description: tool.seo.description,
          applicationCategory: "GameApplication",
          operatingSystem: "Web browser",
          url: `${site.url}/tools/raid-calculator`,
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: raidFaq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }}
      />

      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Tools", href: "/tools" },
                { label: "Raid Calculator" },
              ]}
            />
            <span className={styles.eyebrow}>Current 1.0 crop values / instant calculation</span>
            <h1>
              Scrap Mechanic Raid Calculator <span>- Crop Raid Tool</span>
            </h1>
            <p>
              Enter every planted crop in one cluster and the number of players counted
              by the raid. The calculator returns the current raid level, exact bot
              budget, multiplayer modifier, weighted enemy forecast, and one possible
              drop timeline.
            </p>
            <div className={styles.heroFacts}>
              <span>Checked version 1.0.0.867</span>
              <span>{raidCrops.length} current crop values</span>
              <span>7 raid levels</span>
              <span>9 enemy variants</span>
              <span>Up to 10,000 simulations</span>
            </div>
          </div>
          <aside className={styles.heroPlate}>
            <span>Critical 1.0 boundary</span>
            <strong>10,001</strong>
            <p>
              Super Raid starts above 10,000 crop-value points. Exactly 10,000 remains
              Level 6.
            </p>
          </aside>
        </div>
      </section>

      <EvidenceStatus
        label="Raid calculator data status"
        status="Recheck required"
        title="Raid tables are versioned separately from the live game"
        summary="Crop thresholds, timing rules, budgets, and weighted enemy groups are transcribed from Survival raid data. They remain usable as a documented 1.0 baseline, but have not been re-extracted from the current 1.0.5 build."
        facts={[
          { label: "Live game", value: site.currentVersion },
          { label: "Raid dataset", value: "1.0.0.867" },
          { label: "Method", value: "Game-file transcription" },
        ]}
        tone="review"
      />

      <section className={styles.toolSection}>
        <div className="container">
          <RaidCalculator />
        </div>
      </section>

      <GptAd slotId="div-gpt-ad-raid-calculator-1" unit="banner1" />

      <section className={styles.rulesSection}>
        <div className="container">
          <header className={styles.sectionHeading}>
            <div>
              <span>Current timing and area rules</span>
              <h2>What happens after the farm is detected</h2>
            </div>
            <p>
              The calculator handles the numerical raid decision. The live world still
              controls spawn direction, exact positions, pathfinding, and which valid
              weighted enemy groups are rolled. Read the <Link
                className={styles.inlineGuideLink}
                href="/guides/raid-levels"
              >
                Raid Levels guide
              </Link> for the full threshold and bot table.
            </p>
          </header>
          <div className={styles.timingGrid}>
            {raidTimingRules.map((rule, index) => (
              <article key={rule.label}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <small>{rule.label}</small>
                <strong>{rule.value}</strong>
                <p>{rule.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.thresholdSection}>
        <div className={`container ${styles.thresholdLayout}`}>
          <header>
            <span>Raid level table</span>
            <h2>Every current crop-value threshold</h2>
            <p>
              Crop count alone is not enough. A Pineapple contributes 1,000 points,
              while a Tomato contributes 1, so two equal-sized plots can create very
              different raids. The <Link
                className={styles.inlineGuideLink}
                href="/guides/raid-levels"
              >
                seven raid-level bands
              </Link> explain where each threshold begins.
            </p>
            <Link href="/wiki/crops">Browse the crop Wiki →</Link>
          </header>
          <div className={styles.thresholdTable}>
            <div className={styles.tableHead}>
              <b>Level</b>
              <b>Starts at</b>
              <b>Base budget band</b>
            </div>
            {raidLevels.map((level) => (
              <div className={styles.tableRow} key={level.level}>
                <strong>{level.level === 7 ? "Super" : `Level ${level.level}`}</strong>
                <span>{level.minimumPlantValue.toLocaleString("en-US")}</span>
                <span>
                  {level.budget.minimum.toLocaleString("en-US")}–
                  {level.budget.maximum.toLocaleString("en-US")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.explainerSection}>
        <div className={`container ${styles.explainerGrid}`}>
          <article>
            <span>Exact result</span>
            <h2>What the calculator knows</h2>
            <ul>
              <li>Total crop value for the entered planting cluster.</li>
              <li>The discrete raid level, including the strict Super boundary.</li>
              <li>The interpolated bot budget with the current player modifier.</li>
              <li>How many crop-value points remain before the next level.</li>
              <li>Expected bot averages, appearance rates, and observed simulation range.</li>
            </ul>
          </article>
          <article>
            <span>Runtime outcome</span>
            <h2>What remains random</h2>
            <ul>
              <li>The exact live weighted sequence, beyond the simulated forecast.</li>
              <li>The exact direction and position of each group drop.</li>
              <li>How terrain and pathfinding change the route to the crops.</li>
              <li>Live-session behavior after groups have been generated and locked.</li>
            </ul>
          </article>
        </div>
      </section>

      <GptAd slotId="div-gpt-ad-raid-calculator-2" unit="banner2" />

      <section className={styles.faqSection}>
        <div className={`container ${styles.faqLayout}`}>
          <header>
            <span>Current raid troubleshooting</span>
            <h2>Timer, planting, and spawn questions</h2>
            <p>
              Use these checks after the number is correct but the live farm does
              not behave the way an older raid guide describes.
            </p>
            <Link href="/guides/farming-basics">Build the farm defense route →</Link>
          </header>
          <div className={styles.faqList}>
            {raidFaq.map((item, index) => (
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
