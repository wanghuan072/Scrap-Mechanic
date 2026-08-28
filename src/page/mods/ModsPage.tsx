import type { Metadata } from "next";
import Image from "next/image";
import { GptAd } from "@/components/ads/GptAd";
import { EvidenceStatus } from "@/components/common/EvidenceStatus";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { JsonLd, PageJsonLd } from "@/seo/JsonLd";
import { mods, workshopLeaderboard } from "@/lib/data/mods";
import { createMetadata } from "@/seo/metadata";
import { pageTdk } from "@/seo/tdk";
import styles from "@/style/page/mods/mods.module.css";

export const metadata: Metadata = createMetadata(pageTdk.mods, "/mods");

const recentMods = mods.filter((mod) => mod.compatibility === "recent-1-0-candidate");
const availableRecentMods = recentMods.filter(
  (mod) => mod.workshopStatus !== "removed-incompatible",
);
const classicMods = mods.filter((mod) => mod.compatibility === "legacy-check");

const modFaqs = [
  {
    question: "What are the best Scrap Mechanic mods after 1.0?",
    answer:
      "For a current test, start with an item whose Steam page is still available and whose author has checked the current game. Heavy-Duty Vehicle Parts and Solid remain candidates for disposable Creative test worlds. Better Survival Chapter 2 is quarantined because Steam currently shows it as removed and incompatible.",
  },
  {
    question: "How many downloads does a Scrap Mechanic Workshop mod have?",
    answer:
      "Steam does not expose a verified public download counter for these Workshop items. This guide therefore shows lifetime subscriptions as the closest cumulative install signal, current subscribers as active subscriptions, and Workshop views as page reach. None of those numbers equals confirmed players or unique downloads.",
  },
  {
    question: "Why are Scrap Mechanic mods not working after 1.0?",
    answer:
      "The official 1.0 guidance says some mods still work, but Parts mods and Custom Games are especially likely to need author updates. Old scripts, missing dependencies, a mismatched game branch, or loading a world with a changed mod list can all cause problems.",
  },
  {
    question: "How do I install Scrap Mechanic mods from the Steam Workshop?",
    answer:
      "For an available Parts mod, subscribe on Steam, open the world settings, and enable the item with every required dependency. Do not use third-party mirrors for a removed item. Always test a copied world before changing an important save.",
  },
  {
    question: "Do Scrap Mechanic mods disable achievements?",
    answer:
      "Do not assume every Workshop subscription has the same effect. Manual file replacement and -dev setups may affect achievements, while ordinary Parts subscriptions can behave differently. Check the current author instructions before using any mod in an achievement-focused save.",
  },
];

export default function ModsPage() {
  return (
    <main>
      <PageJsonLd seo={pageTdk.mods} path="/mods" type="CollectionPage" />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: modFaqs.map((item) => ({
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
          <div>
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Mods" }]} />
            <span className={styles.eyebrow}>Steam Workshop data / checked July 30, 2026</span>
            <h1>
              Scrap Mechanic Mods <span>- Workshop Picks by Purpose</span>
            </h1>
            <p>
              This page tracks six Scrap Mechanic Workshop items by purpose: two
              post-1.0 candidates for current testing, one removed item retained as a
              warning, and three classics for legacy Creative builds. Every entry states
              when it should be tested, quarantined, or avoided.
            </p>
          </div>
          <aside className={styles.compatibilityCard}>
            <span>1.0 rule</span>
            <strong>Popularity ≠ compatibility</strong>
            <p>
              The official 1.0 notes warn that Parts and Custom Games may need author
              updates. A high all-time rank tells you a mod mattered—not that it is safe
              for a current save.
            </p>
            <dl>
              <div>
                <dt>Post-1.0 candidates</dt>
                <dd>{availableRecentMods.length}</dd>
              </div>
              <div>
                <dt>Legacy classics</dt>
                <dd>{classicMods.length}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <EvidenceStatus
        label="Steam Workshop status correction"
        status="Workshop alert"
        title="One previous pick is now quarantined"
        summary="Steam currently shows BETTER SURVIVAL Chapter 2 as removed and incompatible with Scrap Mechanic. The entry remains visible so existing links and the original title stay intact, but it is no longer presented as installable or recommended."
        facts={[
          { label: "Workshop ID", value: "3770927146" },
          { label: "Current state", value: "Removed / incompatible" },
          { label: "Checked", value: "August 21, 2026" },
        ]}
        source={{
          label: "View Steam status",
          href: "https://steamcommunity.com/sharedfiles/filedetails/?id=3770927146",
        }}
        tone="alert"
      />

      <section className={styles.methodology}>
        <div className={`container ${styles.methodologyGrid}`}>
          <header>
            <span>Read the numbers correctly</span>
            <h2>Downloads, users, and Steam&apos;s actual data</h2>
          </header>
          <div className={styles.metricNotes}>
            <article>
              <b>Lifetime subscriptions</b>
              <p>
                The closest public cumulative-install signal. It includes past
                subscriptions and is not a verified unique download count.
              </p>
            </article>
            <article>
              <b>Current subscribers</b>
              <p>
                Accounts currently subscribed to the Workshop item. This is the best
                public proxy for current users, not a count of people actively playing.
              </p>
            </article>
            <article>
              <b>Workshop views</b>
              <p>
                Reach for the item page. Views can explain discovery, but they do not
                prove an install, successful launch, or 1.0 compatibility.
              </p>
            </article>
          </div>
          <p className={styles.snapshot}>
            Ranking comes from Steam&apos;s “Total Unique Subscribers” order. Counts are
            a July 30, 2026 snapshot from Steam&apos;s published-file data and will change.
          </p>
        </div>
      </section>

      <section className={styles.recent}>
        <div className="container">
          <header className={styles.sectionHeading}>
            <div>
              <span>Updated after 1.0</span>
              <h2>Current Scrap Mechanic mods worth testing</h2>
            </div>
            <p>
              These items were updated after the July 24 release. That makes them more
              relevant to a search for Scrap Mechanic 1.0 mods, but every scripted part,
              save, multiplayer session, and later game patch still needs a clean test.
            </p>
          </header>
          <div className={styles.recentStack}>
            {recentMods.map((mod, index) => (
              <article className={styles.recentMod} id={mod.slug} key={mod.slug}>
                <div className={styles.modImage}>
                  <Image
                    src={mod.image}
                    alt={mod.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 46vw"
                  />
                  <span>0{index + 1}</span>
                </div>
                <div className={styles.modCopy}>
                  {mod.workshopStatus === "removed-incompatible" ? (
                    <div className={styles.statusAlert} role="status">
                      <b>Quarantined Workshop item</b>
                      <p>{mod.statusNote}</p>
                      <small>Checked {mod.statusCheckedAt}</small>
                    </div>
                  ) : null}
                  <div className={styles.modTopline}>
                    <span>Updated {mod.updated}</span>
                    <b>Workshop {mod.workshopId}</b>
                  </div>
                  <h3>{mod.title}</h3>
                  <p className={styles.bestFor}>{mod.bestFor}</p>
                  <p>{mod.summary}</p>
                  <div className={styles.recommendation}>
                    <b>
                      {mod.workshopStatus === "removed-incompatible"
                        ? "Why the old record remains"
                        : "Why I recommend it"}
                    </b>
                    <p>{mod.whyRecommended}</p>
                  </div>
                  <ul>
                    {mod.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                  <div className={styles.modStats}>
                    <span>
                      <b>{mod.lifetimeSubscriptions.toLocaleString("en-US")}</b>
                      Lifetime subs
                    </span>
                    <span>
                      <b>{mod.subscriptions.toLocaleString("en-US")}</b>
                      Current subs
                    </span>
                    <span>
                      <b>{mod.views.toLocaleString("en-US")}</b>
                      Workshop views
                    </span>
                    <span>
                      <b>{mod.favorites.toLocaleString("en-US")}</b>
                      Current favorites
                    </span>
                  </div>
                  <p className={styles.install}>
                    <b>Install method:</b> {mod.installMethod}
                  </p>
                  <aside>
                    <b>Compatibility note</b>
                    <p>{mod.caution}</p>
                  </aside>
                  <a href={mod.workshopUrl} target="_blank" rel="noreferrer">
                    {mod.workshopStatus === "removed-incompatible"
                      ? "View removed Workshop record ↗"
                      : "Open in Steam Workshop ↗"}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <GptAd slotId="div-gpt-ad-mods-1" unit="banner1" />

      <section className={styles.classics}>
        <div className="container">
          <header className={styles.sectionHeading}>
            <div>
              <span>Huge legacy audiences</span>
              <h2>Popular Creative mods to verify first</h2>
            </div>
            <p>
              New Legend, Interactive Parts, and Wings answer common searches for
              building packs, legacy blueprint dependencies, and a Scrap Mechanic
              airplane mod. Their recorded update dates predate 1.0, so install them for
              a clear purpose—not simply because the subscriber number is large.
            </p>
          </header>
          <div className={styles.classicList}>
            {classicMods.map((mod, index) => (
              <article className={styles.classicMod} id={mod.slug} key={mod.slug}>
                <span className={styles.classicNumber}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className={styles.classicImage}>
                  <Image
                    src={mod.image}
                    alt={mod.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 210px"
                  />
                </div>
                <div className={styles.classicCopy}>
                  <span>Last recorded update {mod.updated}</span>
                  <h3>{mod.title}</h3>
                  <p>{mod.summary}</p>
                  <strong>Why I recommend it</strong>
                  <p>{mod.whyRecommended}</p>
                  <p className={styles.classicCaution}>
                    <b>Use with care:</b> {mod.caution}
                  </p>
                  <small>{mod.bestFor}</small>
                </div>
                <dl>
                  <div>
                    <dt>Lifetime subs</dt>
                    <dd>{mod.lifetimeSubscriptions.toLocaleString("en-US")}</dd>
                  </div>
                  <div>
                    <dt>Current subs</dt>
                    <dd>{mod.subscriptions.toLocaleString("en-US")}</dd>
                  </div>
                  <div>
                    <dt>Workshop views</dt>
                    <dd>{mod.views.toLocaleString("en-US")}</dd>
                  </div>
                </dl>
                <a href={mod.workshopUrl} target="_blank" rel="noreferrer">
                  Workshop ↗
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.leaderboard}>
        <div className="container">
          <header className={styles.sectionHeading}>
            <div>
              <span>Supporting evidence</span>
              <h2>Where my picks sit in Workshop rankings</h2>
            </div>
            <p>
              This table is a cross-check, not the recommendation list. It shows why
              three of my legacy picks matter in the Workshop ecosystem and identifies
              other top-ranked dependencies without pretending every old popular mod
              belongs in a current 1.0 setup.
            </p>
          </header>
          <div className={styles.tableFrame}>
            <table>
              <caption>Scrap Mechanic Workshop popularity snapshot, July 30, 2026</caption>
              <thead>
                <tr>
                  <th>Rank / mod</th>
                  <th>What it adds</th>
                  <th>Lifetime subs</th>
                  <th>Current subs</th>
                  <th>Updated</th>
                  <th>My verdict</th>
                </tr>
              </thead>
              <tbody>
                {workshopLeaderboard.map((mod) => (
                  <tr key={mod.workshopId}>
                    <td>
                      <span className={styles.rank}>#{mod.rank}</span>
                      <a href={mod.workshopUrl} target="_blank" rel="noreferrer">
                        {mod.title} ↗
                      </a>
                      <small>Workshop {mod.workshopId}</small>
                    </td>
                    <td>{mod.purpose}</td>
                    <td>{mod.lifetimeSubscriptions.toLocaleString("en-US")}</td>
                    <td>{mod.subscriptions.toLocaleString("en-US")}</td>
                    <td>{mod.updated}</td>
                    <td>
                      <span
                        className={
                          mod.status === "core-pick" ? styles.coreTag : styles.contextTag
                        }
                      >
                        {mod.status === "core-pick" ? "My core pick" : "Data context"}
                      </span>
                      <small>{mod.note}</small>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <GptAd slotId="div-gpt-ad-mods-2" unit="banner2" />

      <section className={styles.safety}>
        <div className={`container ${styles.safetyGrid}`}>
          <header>
            <span>How to install Scrap Mechanic mods safely</span>
            <h2>A five-minute test routine</h2>
            <p>
              A Workshop item can affect parts, scripts, recipes, world rules, or the
              creations already saved in a world.
            </p>
          </header>
          <ol>
            <li>
              <b>Read the Workshop page.</b>
              <p>Check update date, game mode, manual steps, dependencies, and comments.</p>
            </li>
            <li>
              <b>Back up the world.</b>
              <p>Keep a copy outside the active save folder before changing the mod set.</p>
            </li>
            <li>
              <b>Use a disposable test world.</b>
              <p>Confirm parts load, scripts run, and the game can save and reopen.</p>
            </li>
            <li>
              <b>Match multiplayer clients.</b>
              <p>Every player should use the same branch, mod item, and dependencies.</p>
            </li>
          </ol>
        </div>
      </section>

      <section className={styles.faq}>
        <div className="container">
          <header className={styles.sectionHeading}>
            <div>
              <span>Workshop troubleshooting</span>
              <h2>Scrap Mechanic mod FAQ</h2>
            </div>
            <p>
              Quick answers for the compatibility, download-count, installation, and
              achievement questions players ask after the 1.0 release.
            </p>
          </header>
          <div className={styles.faqList}>
            {modFaqs.map((item, index) => (
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
