import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageJsonLd } from "@/components/JsonLd";
import { quests } from "@/data/quests/quests";
import type { QuestEntry } from "@/data/types";
import { createMetadata } from "@/seo/metadata";
import { pageTdk } from "@/seo/tdk";
import styles from "./quests.module.css";

export const metadata: Metadata = createMetadata(pageTdk.quests, "/wiki/quests");

const mainQuests = quests.filter((quest) => quest.kind === "main");
const builderQuests = quests.filter((quest) => quest.kind === "builder");
const farmerQuests = quests.filter((quest) => quest.kind === "farmer");

const mainPhases = [...new Set(mainQuests.map((quest) => quest.phase))];
const sidePhases = [...new Set(builderQuests.map((quest) => quest.phase))];

const questRecoveryRows = [
  {
    problem: "Watchtower build will not register",
    objective: "Home Is Where Your Couch Is / Built to Last",
    href: "#home-is-where-your-couch-is",
    check:
      "Read the current material list and confirm every requested build state has completed before speaking to Hubert.",
    recovery:
      "Stay near the build until the Logbook changes, then use Hubert as the final trigger. Do not substitute an older tower design.",
  },
  {
    problem: "Growlab Key or waypoint seems missing",
    objective: "A Farmer's Side Hustle",
    href: "#a-farmers-side-hustle",
    check:
      "Speak to Hubert, take the Growlab Key, and actively track the yellow objective in the Logbook.",
    recovery:
      "Return to Hubert if the key handoff never completed. Inside the Growlab, finish the route through the trash-chute exit rather than backtracking at the last room.",
  },
  {
    problem: "The Tomato delivery seems to require machines you do not own",
    objective: "Palate Cleanser",
    href: "#palate-cleanser",
    check:
      "Track Palate Cleanser, use the nearby Packing Station, and deposit the requested Tomatoes into the station rather than trying to craft a separate packing line.",
    recovery:
      "Let the Packing Station produce the packed crate, load that crate onto your vehicle, and deposit it at the Farmers' Hideout Trader. A player-built Large Chest or Vacuum Pump is not listed as one of this quest's three objectives.",
    linkHref: "/wiki/recipes?q=Vacuum%20Pump",
    linkLabel: "Compare later automation recipes",
  },
  {
    problem: "Warehouse objective remains on enter or investigate",
    objective: "The Warehouse",
    href: "#the-warehouse",
    check:
      "Confirm the Warehouse Key handoff, entrance interaction, interior investigation states, roof route, and Trashbot objective in order.",
    recovery:
      "Re-enter through the intended route and let each Logbook state update before advancing. Opening the building early does not complete skipped objective states.",
  },
  {
    problem: "Lost the route after the Trashbot fight",
    objective: "The Warehouse / Lost and Found",
    href: "#lost-and-found",
    check:
      "Confirm the Trashbot defeat and the next yellow quest title before leaving the Warehouse area.",
    recovery:
      "Track the new objective in the Logbook and follow its marker rather than returning to an older roof waypoint.",
    linkHref: "/guides/beat-trash-bot",
    linkLabel: "Open Trashbot guide",
  },
  {
    problem: "A completed checkpoint never opens the next quest",
    objective: "Any main-story transition",
    href: "#main-quests",
    check:
      "Wait for dialogue, reward, and Logbook updates; verify the game is on the current public branch.",
    recovery:
      "Patch 1.0.2 fixed cases where quests did not progress. Update first, preserve the affected save, then repeat only the final interaction on a copy.",
    linkHref: "/updates",
    linkLabel: "Check current patch notes",
  },
  {
    problem: "Raid warning remains active and crops cannot be harvested",
    objective: "Farm raid state",
    href: "#quest-help",
    check:
      "Confirm the public branch has Patch 1.0.3 or later before rebuilding the farm or changing the save.",
    recovery:
      "Patch 1.0.3 fixed a state where raids stopped triggering and harvesting was blocked. Update, keep the affected save and session log, then retest the same plot without mods before making structural changes.",
    linkHref: "/updates/patch-1-0-3",
    linkLabel: "Read Patch 1.0.3 fixes",
  },
  {
    problem: "A co-op client completes the action but the host does not advance",
    objective: "Shared-world objective",
    href: "#quest-help",
    check:
      "Compare the host's active Logbook state with the client's state before repeating a long area.",
    recovery:
      "Have the host perform the final dialogue, delivery, console, or location interaction. If it still fails, keep the save and session log before removing mods.",
  },
];

function QuestRewards({ quest }: { quest: QuestEntry }) {
  return (
    <div className={styles.rewardContents}>
      {quest.rewards?.length ? (
        <ul>
          {quest.rewards.map((reward) => (
            <li
              className={reward.wikiHref ? styles.linkedReward : undefined}
              key={`${reward.type}-${reward.name}`}
            >
              {reward.wikiHref ? (
                <Link href={reward.wikiHref}>
                  <span>{reward.type}</span>
                  <b>{reward.name}</b>
                  <small aria-hidden="true">Wiki →</small>
                </Link>
              ) : (
                <div>
                  <span>{reward.type}</span>
                  <b>{reward.name}</b>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.noReward}>No fixed item reward listed</p>
      )}
      {quest.rewardNote && <p className={styles.rewardNote}>{quest.rewardNote}</p>}
    </div>
  );
}

export default function QuestsPage() {
  return (
    <main>
      <PageJsonLd seo={pageTdk.quests} path="/wiki/quests" type="CollectionPage" />
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Wiki", href: "/wiki" },
                { label: "Quests" },
              ]}
            />
            <span className={styles.eyebrow}>1.0 mission register / objectives and rewards</span>
            <h1>
              Scrap Mechanic Quests <span>- Main and Side Quests</span>
            </h1>
            <p>
              Follow the complete public quest line without opening a separate page for
              every mission. Each entry keeps its objective states and named rewards
              together, including schematic unlocks, customization items, and
              completion-order Scrapper clothing.
            </p>
            <nav className={styles.jumpNav} aria-label="Quest page sections">
              <a href="#main-quests">Main story</a>
              <a href="#side-quests">Side jobs</a>
              <a href="#quest-help">Quest recovery</a>
            </nav>
          </div>
          <div className={styles.questBoard}>
            <div>
              <Image
                src="/images/quests/quest-main.webp"
                alt="Main quest icon from Scrap Mechanic 1.0"
                width={92}
                height={92}
                priority
              />
              <span>Main story</span>
              <strong>{mainQuests.length}</strong>
            </div>
            <div>
              <Image
                src="/images/quests/quest-side.webp"
                alt="Side quest icon from Scrap Mechanic 1.0"
                width={92}
                height={92}
                priority
              />
              <span>Side quests</span>
              <strong>{builderQuests.length + farmerQuests.length}</strong>
            </div>
            <footer>
              <span>Public quest entries</span>
              <b>{quests.length}</b>
            </footer>
          </div>
        </div>
      </section>

      <section className={styles.mainSection} id="main-quests">
        <div className="container">
          <header className={styles.sectionHeading}>
            <div>
              <span>Yellow icon / campaign dossier</span>
              <h2>Main quests</h2>
            </div>
            <p>
              Read from top to bottom for the story route. Objective highlights stay
              visible, while rewards occupy their own field so an unlock is never
              mistaken for a quest requirement.
            </p>
          </header>

          <div className={styles.phaseStack}>
            {mainPhases.map((phase, phaseIndex) => {
              const phaseQuests = mainQuests.filter((quest) => quest.phase === phase);
              return (
                <section className={styles.phase} key={phase}>
                  <header>
                    <span>{String(phaseIndex + 1).padStart(2, "0")}</span>
                    <div>
                      <small>Campaign phase</small>
                      <h3>{phase}</h3>
                      <p>{phaseQuests.length} missions</p>
                    </div>
                  </header>
                  <div className={styles.missionStack}>
                    {phaseQuests.map((quest) => (
                      <article className={styles.mainMission} id={quest.slug} key={quest.slug}>
                        <header className={styles.missionIdentity}>
                          <Image
                            src="/images/quests/quest-main.webp"
                            alt=""
                            width={50}
                            height={50}
                          />
                          <div>
                            <span>
                              Mission {String(mainQuests.indexOf(quest) + 1).padStart(2, "0")}
                            </span>
                            <h4>{quest.title}</h4>
                          </div>
                          <b>{quest.objectiveCount} states</b>
                        </header>
                        <p className={styles.missionSummary}>{quest.summary}</p>
                        <div className={styles.missionFields}>
                          <section className={styles.objectiveField}>
                            <span>Objective highlights</span>
                            {quest.objectiveHighlights?.length ? (
                              <ol>
                                {quest.objectiveHighlights.map((objective) => (
                                  <li key={objective}>{objective}</li>
                                ))}
                              </ol>
                            ) : (
                              <p>Follow the active Logbook state.</p>
                            )}
                          </section>
                          <aside className={styles.rewardField}>
                            <div className={styles.fieldHeading}>
                              <span>Rewards</span>
                              <b>{quest.rewardCount || "—"}</b>
                            </div>
                            <QuestRewards quest={quest} />
                          </aside>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.sideSection} id="side-quests">
        <div className="container">
          <header className={styles.sectionHeading}>
            <div>
              <span>Blue icon / workshop job board</span>
              <h2>Side quests</h2>
            </div>
            <p>
              These jobs ask for builds, deliveries, or creature help. Their reward
              tags show the exact schematic, outfit, item, or variable
              completion-order reward attached to the assignment.
            </p>
          </header>

          <div className={styles.sideDirectory}>
            {sidePhases.map((phase, groupIndex) => {
              const phaseQuests = builderQuests.filter((quest) => quest.phase === phase);
              return (
                <section
                  className={`${styles.sideGroup} ${groupIndex % 3 === 0 ? styles.sideGroupWide : ""}`}
                  key={phase}
                >
                  <header>
                    <div>
                      <span>Job category</span>
                      <h3>{phase}</h3>
                    </div>
                    <b>{String(phaseQuests.length).padStart(2, "0")}</b>
                  </header>
                  <div className={styles.ticketGrid}>
                    {phaseQuests.map((quest) => (
                      <article className={styles.jobTicket} id={quest.slug} key={quest.slug}>
                        <div className={styles.ticketTop}>
                          <Image
                            src="/images/quests/quest-side.webp"
                            alt=""
                            width={38}
                            height={38}
                          />
                          <div>
                            <span>{quest.objectiveCount} objective states</span>
                            <h4>{quest.title}</h4>
                          </div>
                        </div>
                        <p>{quest.summary}</p>
                        <div className={styles.ticketRewards}>
                          <span>Take-home rewards</span>
                          <QuestRewards quest={quest} />
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              );
            })}

            <section className={`${styles.sideGroup} ${styles.sideGroupWide}`}>
              <header>
                <div>
                  <span>Job category</span>
                  <h3>Farmer supply chain</h3>
                </div>
                <b>{String(farmerQuests.length).padStart(2, "0")}</b>
              </header>
              {farmerQuests.map((quest) => (
                <section className={styles.farmerQuest} id={quest.slug} key={quest.slug}>
                  <div className={styles.farmerIcon}>
                    <Image
                      src="/images/quests/quest-side.webp"
                      alt=""
                      width={76}
                      height={76}
                    />
                  </div>
                  <div>
                    <span>Long-form side progression</span>
                    <h4>{quest.title}</h4>
                    <p>{quest.summary}</p>
                  </div>
                  <aside>
                    <b>{quest.objectiveCount}</b>
                    <span>objective states</span>
                    <p>No fixed item reward is listed for the full supply chain.</p>
                  </aside>
                </section>
              ))}
            </section>
          </div>
        </div>
      </section>

      <section className={styles.help} id="quest-help">
        <div className={`container ${styles.helpGrid}`}>
          <header>
            <span>Quest stuck / waypoint missing / objective not updating</span>
            <h2>Match the symptom to the unfinished trigger</h2>
            <p>
              A Scrap Mechanic quest can wait on a build state, item handoff,
              dialogue, console, location trigger, boss defeat, or exit route. The
              active Logbook wording identifies which one is still missing.
            </p>
          </header>
          <div className={styles.recoveryTable}>
            <div className={styles.recoveryHead}>
              <b>What the player sees</b>
              <b>Exact state to check</b>
              <b>Recovery route</b>
            </div>
            {questRecoveryRows.map((row) => (
              <article key={row.problem}>
                <div>
                  <strong>{row.problem}</strong>
                  <Link href={row.href}>{row.objective} →</Link>
                </div>
                <p>{row.check}</p>
                <div>
                  <p>{row.recovery}</p>
                  {row.linkHref && (
                    <Link href={row.linkHref}>{row.linkLabel} →</Link>
                  )}
                </div>
              </article>
            ))}
          </div>
          <aside className={styles.saveRule}>
            <div>
              <span>Before repeating a long area</span>
              <b>Keep the affected save and the session log.</b>
            </div>
            <p>
              Test the current public version first. Back up the world before
              changing branches or removing mods, and keep the original state
              available if the same trigger fails again.
            </p>
            <Link href="/guides/save-backups-and-branches">
              Back up a Survival world →
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
