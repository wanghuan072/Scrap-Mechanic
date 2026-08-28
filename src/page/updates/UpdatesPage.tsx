import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { GptAd } from "@/components/ads/GptAd";
import { EvidenceStatus } from "@/components/common/EvidenceStatus";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { JsonLd, PageJsonLd } from "@/seo/JsonLd";
import {
  compatibilityDecisions,
  releaseFacts,
  releaseSystems,
  updateVisuals,
  versionComparisons,
} from "@/lib/data/updates";
import { updates } from "@/lib/data/updates";
import { createMetadata } from "@/seo/metadata";
import { pageTdk } from "@/seo/tdk";
import { site } from "@/config/site";
import styles from "@/style/page/updates/updates.module.css";

export const metadata: Metadata = createMetadata(pageTdk.updates, "/updates");

const release = updates.find((update) => update.slug === "1-0-drilling-thunder")!;
const patches = updates
  .filter((update) => update.slug !== release.slug)
  .sort((a, b) => b.gameVersion.localeCompare(a.gameVersion, undefined, { numeric: true }));

const patchEvidence: Record<
  string,
  { listedChanges: number; focus: string; sourceUrl: string }
> = {
  "patch-1-0-1": {
    listedChanges: 8,
    focus: "Schematics, recipes, multiplayer steering, achievements, and crashes",
    sourceUrl:
      "https://steamcommunity.com/games/387990/announcements/detail/670623586021542521",
  },
  "patch-1-0-2": {
    listedChanges: 4,
    focus: "Challenge chests, the Mods button, stuck quests, and crashes",
    sourceUrl:
      "https://steamcommunity.com/games/387990/announcements/detail/670623586021542714",
  },
  "patch-1-0-3": {
    listedChanges: 10,
    focus: "Creative commands, raids, Vault quests, underground events, and older CPUs",
    sourceUrl:
      "https://steamcommunity.com/games/387990/announcements/detail/689764519146160688",
  },
  "patch-1-0-4": {
    listedChanges: 14,
    focus: "Creative and Challenge parts, Growlab progress, building, rendering, quests, and achievements",
    sourceUrl:
      "https://steamcommunity.com/ogg/387990/announcements/detail/689764519146161793",
  },
  "patch-1-0-5": {
    listedChanges: 1,
    focus: "Welding onto bearings, suspensions, and pistons after the 1.0.4 regression",
    sourceUrl:
      "https://steamcommunity.com/ogg/387990/announcements/detail/689764519146162105",
  },
};

const updateFaqs = [
  {
    question: "What is the latest Scrap Mechanic version?",
    answer:
      "The latest public version in the official announcements is Scrap Mechanic 1.0.5, published on August 3, 2026. This page was checked on August 21, 2026.",
  },
  {
    question: "When did Scrap Mechanic 1.0 and Drilling Thunder release?",
    answer:
      "Scrap Mechanic left Early Access on July 24, 2026. The 1.0 release includes the Drilling Thunder expansion, a complete Survival story, the world overhaul, underground mining, new bots and parts, and the new visual system.",
  },
  {
    question: "Do old Scrap Mechanic Survival saves work in 1.0?",
    answer:
      "Old Survival worlds require an older Steam branch because the 1.0 world and story baseline is not compatible with them. Old Creative worlds can load in 1.0, but important creations should still be backed up before the first save.",
  },
  {
    question: "Why are Scrap Mechanic raids not starting after 1.0?",
    answer:
      "Patch 1.0.3 fixed an issue that could stop raids from triggering and prevent harvesting. Update the game and retest from a backup; the patch note does not promise that an already damaged save will repair itself.",
  },
  {
    question: "What are the Scrap Mechanic 1.0 Creative chat commands?",
    answer:
      "Patch 1.0.3 added three Creative Mode commands: /weather, /timeofday, and /timeprogress.",
  },
  {
    question: "What PC specs does Scrap Mechanic 1.0 require?",
    answer:
      "The published minimum is Windows 10 64-bit, an Intel Core i5-1235U, 8 GB RAM, Intel Iris Xe graphics, DirectX 11, and 30 GB storage. The recommendation is Windows 11, an Intel Core i5-12500 or Ryzen 5 5600, 16 GB RAM, and an RTX 3060 12 GB or RX 6700 XT 12 GB.",
  },
];

export default function UpdatesPage() {
  return (
    <main>
      <PageJsonLd seo={pageTdk.updates} path="/updates" type="CollectionPage" />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: updateFaqs.map((item) => ({
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
        <Image
          className={styles.heroImage}
          src="/images/scrap-mechanic/trailer-1-0.jpg"
          alt=""
          fill
          sizes="100vw"
          quality={60}
          loading="eager"
          fetchPriority="high"
        />
        <div className={styles.heroShade} />
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Updates" }]} />
            <span className={styles.eyebrow}>
              Official release data / checked August 21, 2026
            </span>
            <h1>
              Scrap Mechanic Updates <span>- 1.0.3 Current</span>
            </h1>
            <p>
              A picture-led, data-backed guide to Scrap Mechanic 1.0 and Drilling
              Thunder: what the release added, what changed for returning players, and
              which launch bugs were fixed in patches 1.0.1 through 1.0.5.
            </p>
            <nav className={styles.jumpNav} aria-label="Scrap Mechanic update sections">
              <a href="#visual-evidence">Official screenshots</a>
              <a href="#comparison">Before vs 1.0</a>
              <a href="#compatibility">Saves and mods</a>
              <a href="#patches">Patch timeline</a>
              <a href="#faq">Update FAQ</a>
            </nav>
          </div>
          <aside className={styles.releasePlate}>
            <span>Current public baseline</span>
            <strong>{site.currentVersion}</strong>
            <dl>
              <div>
                <dt>Full release</dt>
                <dd>July 24, 2026</dd>
              </div>
              <div>
                <dt>Latest patch</dt>
                <dd>August 3, 2026</dd>
              </div>
              <div>
                <dt>Launch patches</dt>
                <dd>5 / 37 listed changes</dd>
              </div>
              <div>
                <dt>Expansion</dt>
                <dd>Drilling Thunder</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <EvidenceStatus
        label="Official Scrap Mechanic release status"
        status="Live release correction"
        title={`Official current version: ${site.currentVersion}`}
        summary="Official patches 1.0.4 and 1.0.5 are now included below. Older recipes, trades, raid tables, and wiki entries continue to show their own checked versions instead of inheriting the live release number."
        facts={[
          { label: "Live game", value: site.currentVersion },
          { label: "Published", value: site.currentVersionPublished },
          { label: "Verified", value: site.lastChecked },
        ]}
        source={{ label: "Official 1.0.5 note", href: site.currentVersionSource }}
        tone="confirmed"
      />

      <section className={styles.intro}>
        <div className={`container ${styles.introGrid}`}>
          <header>
            <span>Scrap Mechanic Chapter 2 explained</span>
            <h2>This is a new Survival baseline</h2>
          </header>
          <div>
            <p>
              Scrap Mechanic 1.0 combines the Drilling Thunder expansion with the end of
              Early Access. The headline additions are a complete voiced Survival story,
              Excavation Island, underground mines, Growlabs, terrain shaping, a larger
              bot roster, schematics, new building parts, and a major visual overhaul.
            </p>
            <p>
              A returning vehicle may still be mechanically useful, but its world,
              routes, enemies, recipes, progression, raids, lighting, and multiplayer
              behavior now sit inside a different version boundary. Start with the
              current version and save decision before following an old guide.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.factStrip} aria-label="Scrap Mechanic 1.0 key numbers">
        <div className={`container ${styles.factGrid}`}>
          {releaseFacts.map((fact) => (
            <article key={fact.label}>
              <strong>{fact.value}</strong>
              <span>{fact.label}</span>
              <p>{fact.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.visualEvidence} id="visual-evidence">
        <div className="container">
          <header className={styles.sectionHeading}>
            <div>
              <span>Official 1.0 screenshots</span>
              <h2>Six changes you can see</h2>
            </div>
            <p>
              Each image comes from the official 1.0 release announcement. The captions
              connect the promotional screenshots to a measurable feature or a player
              decision instead of treating them as background decoration.
            </p>
          </header>
          <div className={styles.visualStack}>
            {updateVisuals.map((visual) => (
              <article className={styles.visualCard} key={visual.number}>
                <div className={styles.visualImage}>
                  <Image
                    src={visual.image}
                    alt={visual.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 62vw"
                  />
                  <span>{visual.number}</span>
                </div>
                <div className={styles.visualCopy}>
                  <span>{visual.eyebrow}</span>
                  <h3>{visual.title}</h3>
                  <strong>{visual.fact}</strong>
                  <p>{visual.copy}</p>
                </div>
              </article>
            ))}
          </div>
          <a
            className={styles.officialLink}
            href={release.sourceUrl}
            target="_blank"
            rel="noreferrer"
          >
            Open the official Scrap Mechanic 1.0 announcement ↗
          </a>
        </div>
      </section>

      <GptAd slotId="div-gpt-ad-updates-1" unit="banner1" />

      <section className={styles.comparison} id="comparison">
        <div className="container">
          <header className={styles.sectionHeading}>
            <div>
              <span>Early Access vs full release</span>
              <h2>Eight changes that affect how you play</h2>
            </div>
            <p>
              This Scrap Mechanic 1.0 comparison focuses on decisions: what existed
              before, what changed in Drilling Thunder, and what returning players need
              to relearn.
            </p>
          </header>
          <div className={styles.comparisonTable}>
            <div className={styles.comparisonHead}>
              <b>System</b>
              <b>Before 1.0</b>
              <b>In Scrap Mechanic 1.0</b>
              <b>What changes for the player</b>
            </div>
            {versionComparisons.map((row, index) => (
              <article className={styles.comparisonRow} key={row.area}>
                <header>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{row.area}</h3>
                </header>
                <div>
                  <small>Before 1.0</small>
                  <p>{row.before}</p>
                </div>
                <div>
                  <small>In 1.0</small>
                  <p>{row.now}</p>
                </div>
                <div>
                  <small>Player impact</small>
                  <p>{row.impact}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.systems} id="new-systems">
        <div className="container">
          <header className={styles.sectionHeading}>
            <div>
              <span>Drilling Thunder feature map</span>
              <h2>What Scrap Mechanic 1.0 adds</h2>
            </div>
            <p>
              These systems overlap. A Growlab can be a story location, combat space,
              source of progression, and reason to redesign an exploration vehicle.
            </p>
          </header>
          <div className={styles.systemGrid}>
            {releaseSystems.map((system) => (
              <article className={styles.system} key={system.number}>
                <span>{system.number}</span>
                <h3>{system.title}</h3>
                <p>{system.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.compatibility} id="compatibility">
        <div className="container">
          <header className={styles.sectionHeading}>
            <div>
              <span>Before loading an old world</span>
              <h2>Scrap Mechanic 1.0 saves and mods</h2>
            </div>
            <p>
              Version choice is the first decision. A backup cannot make incompatible
              content work, but it prevents a test from becoming permanent damage.
            </p>
          </header>
          <div className={styles.decisionList}>
            {compatibilityDecisions.map((decision, index) => (
              <article key={decision.case}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{decision.case}</h3>
                <strong>{decision.answer}</strong>
                <p>{decision.detail}</p>
              </article>
            ))}
          </div>
          <div className={styles.decisionLinks}>
            <Link href="/guides/returning-to-1-0">
              Open the save and Steam branch guide →
            </Link>
            <Link href="/mods">Review current Workshop recommendations →</Link>
          </div>
        </div>
      </section>

      <section className={styles.requirements}>
        <div className={`container ${styles.requirementsGrid}`}>
          <header>
            <span>Published 1.0 requirements</span>
            <h2>Scrap Mechanic system requirements</h2>
            <p>
              The full release changed the PC baseline. Recheck graphics settings before
              judging an old heavy creation on the new renderer.
            </p>
          </header>
          <article>
            <span>Minimum</span>
            <dl>
              <div>
                <dt>OS</dt>
                <dd>Windows 10 64-bit</dd>
              </div>
              <div>
                <dt>CPU</dt>
                <dd>Intel Core i5-1235U</dd>
              </div>
              <div>
                <dt>Memory</dt>
                <dd>8 GB RAM</dd>
              </div>
              <div>
                <dt>Graphics</dt>
                <dd>Intel Iris Xe</dd>
              </div>
              <div>
                <dt>Storage</dt>
                <dd>30 GB</dd>
              </div>
            </dl>
          </article>
          <article>
            <span>Recommended</span>
            <dl>
              <div>
                <dt>OS</dt>
                <dd>Windows 11</dd>
              </div>
              <div>
                <dt>CPU</dt>
                <dd>Intel i5-12500 or Ryzen 5 5600</dd>
              </div>
              <div>
                <dt>Memory</dt>
                <dd>16 GB RAM</dd>
              </div>
              <div>
                <dt>Graphics</dt>
                <dd>RTX 3060 12 GB or RX 6700 XT 12 GB</dd>
              </div>
              <div>
                <dt>Storage</dt>
                <dd>30 GB</dd>
              </div>
            </dl>
          </article>
        </div>
      </section>

      <GptAd slotId="div-gpt-ad-updates-2" unit="banner2" />

      <section className={styles.patches} id="patches">
        <div className="container">
          <header className={styles.sectionHeading}>
            <div>
              <span>37 listed launch changes</span>
              <h2>Scrap Mechanic patch notes timeline</h2>
            </div>
            <p>
              Patches are newest first. Each card separates the official list count from
              our player-facing explanation so a repaired launch bug is not mistaken for a
              feature from the original Drilling Thunder release.
            </p>
          </header>
          <div className={styles.patchGrid}>
            {patches.map((patch) => {
              const evidence = patchEvidence[patch.slug];
              return (
                <article className={styles.patch} key={patch.slug}>
                  <div className={styles.patchImage}>
                    <Image
                      src={patch.image}
                      alt={patch.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className={styles.patchBody}>
                    <header>
                      <span>{patch.published} UTC</span>
                      <strong>{patch.gameVersion}</strong>
                    </header>
                    <div className={styles.patchMetric}>
                      <b>{evidence.listedChanges}</b>
                      <span>officially listed changes</span>
                    </div>
                    <h3>{patch.title}</h3>
                    <p>{evidence.focus}</p>
                    <ul>
                      {patch.sections
                        .flatMap((section) => section.bullets ?? [])
                        .slice(0, 5)
                        .map((fix) => (
                          <li key={fix}>{fix}</li>
                        ))}
                    </ul>
                    <div className={styles.patchLinks}>
                      <Link href={`/updates/${patch.slug}`}>Read complete patch briefing →</Link>
                      <a href={evidence.sourceUrl} target="_blank" rel="noreferrer">
                        Official Steam note ↗
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.faq} id="faq">
        <div className="container">
          <header className={styles.sectionHeading}>
            <div>
              <span>Version and troubleshooting answers</span>
              <h2>Scrap Mechanic update FAQ</h2>
            </div>
            <p>
              Direct answers for the long-tail questions players search after the 1.0
              release: latest version, release date, old saves, stopped raids, Creative
              commands, and PC requirements.
            </p>
          </header>
          <div className={styles.faqList}>
            {updateFaqs.map((item, index) => (
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
