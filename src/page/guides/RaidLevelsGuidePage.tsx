import Link from "next/link";
import { ArticlePage } from "@/components/content/ArticlePage";
import { raidLevels } from "@/lib/data/raid-calculator";
import {
  createRaidLevelsGuideEntry,
  formatRaidLevelRange,
} from "@/lib/data/raid-levels-guide";
import type { ArticleEntry } from "@/types/content";
import styles from "@/style/page/guides/raid-levels-guide.module.css";

const levelSignals = [
  "First warning",
  "Melee pressure",
  "Ranged units",
  "Mixed groups",
  "Farmbot entry",
  "Heavy budget",
  "Super Raid",
];

function levelTone(level: number) {
  if (level >= 7) return styles.super;
  if (level >= 5) return styles.severe;
  if (level >= 3) return styles.guarded;
  return styles.low;
}

function RaidLevelScale() {
  return (
    <section
      className={styles.scaleSection}
      aria-labelledby="raid-level-scale-title"
    >
      <header className={styles.scaleHeader}>
        <div>
          <span>Threat calibration</span>
          <h2 id="raid-level-scale-title">Seven raid bands at a glance</h2>
        </div>
        <p>
          Read crop value from left to right; bot counts remain weighted after
          the opening group.
        </p>
      </header>
      <div
        className={styles.scaleViewport}
        role="region"
        aria-label="Scrollable raid level scale"
        tabIndex={0}
      >
        <ol className={styles.scale}>
          {raidLevels.map((level, index) => (
            <li
              className={`${styles.tier} ${levelTone(level.level)}`}
              key={level.level}
            >
              <span>Level</span>
              <strong>{String(level.level).padStart(2, "0")}</strong>
              <b>{formatRaidLevelRange(index)}</b>
              <small>{levelSignals[index]}</small>
            </li>
          ))}
        </ol>
      </div>
      <footer className={styles.scaleFooter}>
        <span>
          <b>1</b> point starts Level 1
        </span>
        <span>
          <b>100,000</b> is the intensity ceiling
        </span>
        <Link href="/tools/raid-calculator">Calculate your farm →</Link>
      </footer>
    </section>
  );
}

export function RaidLevelsGuidePage({ entry }: { entry: ArticleEntry }) {
  return (
    <ArticlePage
      basePath="/guides"
      collectionLabel="Guides"
      entry={createRaidLevelsGuideEntry(entry)}
      featuredContent={<RaidLevelScale />}
    />
  );
}
