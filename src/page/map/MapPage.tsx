import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { locations } from "@/lib/data/locations";
import { JsonLd, PageJsonLd } from "@/seo/JsonLd";
import { createMetadata } from "@/seo/metadata";
import { pageTdk } from "@/seo/tdk";
import styles from "@/style/page/map/map.module.css";

export const metadata: Metadata = createMetadata(pageTdk.map, "/map");

const locationGroups = [
  {
    key: "starting-route",
    eyebrow: "Early Survival route",
    title: "Start with the connected road route",
    description:
      "The opening landmarks form a practical chain from the crashed ship to a working base, produce logistics, and trading. Follow active objectives, but record the road junctions that will bring you home.",
  },
  {
    key: "story",
    eyebrow: "Progression destinations",
    title: "Prepare before following story markers",
    description:
      "Later objectives lead into more demanding structures, combat zones, and underground routes. Establish safe storage and a reversible approach before carrying valuable equipment into them.",
  },
  {
    key: "exploration",
    eyebrow: "Resource and loot routes",
    title: "Use small landmarks to build a reliable route",
    description:
      "Ruins, camps, lakes, and industrial sites are more useful when treated as named stops between major destinations. Mark the decision point on the road, not every object beside it.",
  },
  {
    key: "region-hazard",
    eyebrow: "Regions and dynamic threats",
    title: "Terrain and weather can change the safest route",
    description:
      "Open desert travel increases fuel and recovery demands, while tornadoes can interrupt an otherwise familiar road. Keep an alternate junction and delay loaded cargo runs when conditions turn unsafe.",
  },
] as const;

const kindLabels = {
  landmark: "Landmark",
  "location-group": "Generated location type",
  region: "Region",
  "dynamic-hazard": "Dynamic hazard",
};

const mapFaqs = [
  {
    question: "Does every Scrap Mechanic Survival world use the same map?",
    answer:
      "No. Survival worlds are generated, so roads, terrain, biomes, ruins, and many location relationships vary by save. The same location types can appear in different positions and route contexts.",
  },
  {
    question: "Can I use coordinates from another player's world?",
    answer:
      "Only as context for that specific world or seed. Do not expect copied coordinates to identify the same landmark in your save; use active objectives, road junctions, silhouettes, and biome clues instead.",
  },
  {
    question: "Why does an older guide show a different road or biome?",
    answer:
      "The world layout can differ by generated save, and the 1.0 release changed major parts of Survival progression and world content. Check the guide version, then navigate by the role of a location rather than one screenshot.",
  },
  {
    question: "Will the interactive map change my save file?",
    answer:
      "The final map integration is not connected yet. Its supported inputs, processing behavior, and safety instructions will be documented here before any save-based feature is enabled. Always back up an original save before using external tools.",
  },
  {
    question: "Are tornadoes fixed map locations?",
    answer:
      "No. Treat tornadoes as dynamic weather hazards rather than permanent landmarks. If one blocks a route, divert early or postpone a loaded delivery instead of relying on a fixed marker.",
  },
  {
    question: "Will the map include underground routes?",
    answer:
      "The page already separates surface navigation from mining and underground preparation. Exact layer support will be confirmed after the interactive viewer URL and its available world data are reviewed.",
  },
];

const routeSteps = [
  {
    number: "01",
    title: "Start from a known landmark",
    text: "Use the crashed ship, Mechanic Station, a Packing Station, or another unmistakable structure as the route origin.",
  },
  {
    number: "02",
    title: "Record decision points",
    text: "Remember road forks, bridges, and biome changes. They are more reusable than a trail of markers placed along a straight road.",
  },
  {
    number: "03",
    title: "Match the vehicle to the trip",
    text: "Cargo routes need stability and clearance; scouting needs recovery options; underground mining needs space to turn with a full load.",
  },
  {
    number: "04",
    title: "Protect the return journey",
    text: "Face the vehicle toward the exit, keep critical supplies outside combat areas, and unload important discoveries before the next objective.",
  },
];

const relatedRoutes = [
  {
    href: "/guides/beginner-first-hours",
    label: "First-hours Survival route",
    text: "Turn the Crash Site and Mechanic Station landmarks into a stable first base.",
  },
  {
    href: "/wiki/quests",
    label: "Quest directory",
    text: "Match objective names with the locations and preparation they require.",
  },
  {
    href: "/wiki/trades",
    label: "Trading and deliveries",
    text: "Plan Packing Station cargo and Farmers Hideout reward routes.",
  },
  {
    href: "/builds/mining-vehicle",
    label: "Mining vehicle build",
    text: "Prepare a machine for narrow routes, excavation, storage, and recovery.",
  },
];

export default function MapPage() {
  return (
    <main className={styles.mapPage}>
      <PageJsonLd seo={pageTdk.map} path="/map" type="CollectionPage" />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: mapFaqs.map((item) => ({
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
          className={styles.backdrop}
          src="/images/scrap-mechanic/screenshot-01.jpg"
          alt="Mechanics exploring an industrial area in Scrap Mechanic"
          fill
          sizes="100vw"
          quality={60}
          loading="eager"
          fetchPriority="high"
        />
        <div className={styles.shade} />

        <div className={`container ${styles.heroContent}`}>
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Map" }]} />
          <span className={styles.eyebrow}>World navigation / location field guide</span>
          <h1>
            Scrap Mechanic Map <span>- Interactive Map</span>
          </h1>
          <p className={styles.intro}>
            Explore the major landmarks, progression routes, resource areas, and
            hazards found across Scrap Mechanic Survival. Use the location guide now,
            then open the interactive world map here when the embedded viewer is
            connected.
          </p>

          <div className={styles.heroActions}>
            <Link className={styles.primaryAction} href="#location-directory">
              Browse locations
            </Link>
            <Link className={styles.secondaryAction} href="#interactive-map">
              Check map status
            </Link>
          </div>
        </div>
      </section>

      <nav className={styles.sectionNav} aria-label="Map page sections">
        <div className={`container ${styles.sectionNavInner}`}>
          <span>Field index</span>
          <Link href="#interactive-map">Interactive map</Link>
          {locationGroups.map((group) => (
            <Link href={`#${group.key}`} key={group.key}>
              {group.eyebrow}
            </Link>
          ))}
          <Link href="#save-data">World data</Link>
          <Link href="#map-faq">FAQ</Link>
        </div>
      </nav>

      <section className={styles.generatedSection}>
        <div className={`container ${styles.generatedGrid}`}>
          <div className={styles.sectionHeading}>
            <span className={styles.eyebrow}>Before using any map</span>
            <h2>Every Survival world is generated</h2>
          </div>
          <div className={styles.generatedCopy}>
            <p>
              There is no single universal layout that places every road, ruin,
              resource area, and progression destination at the same coordinates.
              Your save is the source of truth for exact placement.
            </p>
            <p>
              Use this directory to identify what a location does, how to recognize
              it, and what to carry. When the interactive viewer is connected, this
              same page will explain which world inputs it supports instead of
              presenting a generic image as your personal map.
            </p>
          </div>
          <dl className={styles.worldFacts}>
            <div>
              <dt>Fixed across saves</dt>
              <dd>Location roles, quest purpose, preparation principles</dd>
            </div>
            <div>
              <dt>Varies by world</dt>
              <dd>Exact position, road relationship, nearby terrain</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className={styles.mapSection} id="interactive-map">
        <div className={`container ${styles.mapLayout}`}>
          <div className={styles.mapCopy}>
            <span className={styles.eyebrow}>Viewer connection</span>
            <h2>Interactive map connection in progress</h2>
            <p>
              The external map has been built by the project team, but its final URL
              has not been supplied yet. This reserved viewport is ready for that
              embed; the guide remains fully usable without it.
            </p>
            <div className={styles.mapStatus} role="status">
              <span className={styles.statusLight} aria-hidden="true" />
              <div>
                <strong>Integration pending</strong>
                <p>No iframe or unsupported viewer has been inserted.</p>
              </div>
            </div>
          </div>

          <div className={styles.viewerFrame} aria-label="Interactive map placeholder">
            <div className={styles.viewerToolbar}>
              <span>WORLD_VIEWER</span>
              <span>AWAITING URL</span>
            </div>
            <div className={styles.viewerCanvas}>
              <span className={`${styles.mapMarker} ${styles.markerOne}`}>A</span>
              <span className={`${styles.mapMarker} ${styles.markerTwo}`}>B</span>
              <span className={`${styles.mapMarker} ${styles.markerThree}`}>C</span>
              <div className={styles.crosshair} aria-hidden="true" />
              <div className={styles.viewerMessage}>
                <span>Embed target prepared</span>
                <strong>Interactive world viewer</strong>
                <p>The final map URL will replace this panel.</p>
              </div>
            </div>
            <dl className={styles.viewerStats}>
              <div>
                <dt>Map viewer</dt>
                <dd>Integration pending</dd>
              </div>
              <div>
                <dt>Location guide</dt>
                <dd>Available now</dd>
              </div>
              <div>
                <dt>World layouts</dt>
                <dd>Vary by save</dd>
              </div>
              <div>
                <dt>Game baseline</dt>
                <dd>Survival 1.0</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className={styles.directorySection} id="location-directory">
        <div className={`container ${styles.directoryIntro}`}>
          <div className={styles.sectionHeading}>
            <span className={styles.eyebrow}>Location directory</span>
            <h2>Plan by purpose, risk, and route</h2>
          </div>
          <p>
            Select a landmark from the index or move through the four route groups.
            Each entry explains its role, navigation clues, danger level, and the
            supplies worth checking before departure.
          </p>
        </div>

        <div className={`container ${styles.locationIndex}`}>
          {locations.map((location) => (
            <Link href={`#${location.slug}`} key={location.slug}>
              {location.name}
            </Link>
          ))}
        </div>

        <div className={`container ${styles.groupList}`}>
          {locationGroups.map((group) => {
            const groupLocations = locations.filter(
              (location) => location.group === group.key,
            );

            return (
              <section className={styles.locationGroup} id={group.key} key={group.key}>
                <header className={styles.groupHeader}>
                  <span className={styles.groupNumber}>
                    {String(locationGroups.indexOf(group) + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <span className={styles.eyebrow}>{group.eyebrow}</span>
                    <h2>{group.title}</h2>
                    <p>{group.description}</p>
                  </div>
                </header>

                <div className={styles.locationGrid}>
                  {groupLocations.map((location) => (
                    <article
                      className={styles.locationCard}
                      id={location.slug}
                      key={location.slug}
                    >
                      <div className={styles.locationMeta}>
                        <span>{kindLabels[location.kind]}</span>
                        <span className={styles.danger} data-danger={location.danger}>
                          {location.danger} danger
                        </span>
                      </div>
                      <h3>{location.name}</h3>
                      {location.aliases?.length ? (
                        <p className={styles.aliases}>
                          Also known as: {location.aliases.join(", ")}
                        </p>
                      ) : null}
                      <p className={styles.locationDescription}>{location.description}</p>

                      <div className={styles.navigationNote}>
                        <strong>How to recognize and route</strong>
                        <p>{location.navigation}</p>
                      </div>

                      <div className={styles.preparationList}>
                        <strong>Before you go</strong>
                        <ul>
                          {location.preparation.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      {location.relatedHref && location.relatedLabel ? (
                        <Link className={styles.cardLink} href={location.relatedHref}>
                          {location.relatedLabel} <span aria-hidden="true">→</span>
                        </Link>
                      ) : null}
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      <section className={styles.planningSection}>
        <div className={`container ${styles.planningInner}`}>
          <div className={styles.sectionHeading}>
            <span className={styles.eyebrow}>Route planning method</span>
            <h2>Make a generated world easier to navigate</h2>
          </div>
          <div className={styles.stepsGrid}>
            {routeSteps.map((step) => (
              <article className={styles.stepCard} key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.saveSection} id="save-data">
        <div className={`container ${styles.saveLayout}`}>
          <div className={styles.sectionHeading}>
            <span className={styles.eyebrow}>Future world-data support</span>
            <h2>Prepare your Survival world data safely</h2>
            <p>
              No upload or parsing control is active on this page. When the viewer is
              connected, the accepted file or folder, processing location, and
              privacy behavior will be stated beside the control.
            </p>
          </div>
          <div className={styles.savePanel}>
            <span className={styles.panelLabel}>Common Windows save location</span>
            <code>
              {"%AppData%\\Axolot Games\\Scrap Mechanic\\User\\User_<STEAMID>\\Save\\Survival"}
            </code>
            <ul>
              <li>Back up the original world before using any third-party utility.</li>
              <li>Work from a copy; never allow a viewer to overwrite the only save.</li>
              <li>Wait for the supported input instructions instead of guessing.</li>
              <li>Use the location directory above while integration is pending.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.faqSection} id="map-faq">
        <div className={`container ${styles.faqLayout}`}>
          <div className={styles.sectionHeading}>
            <span className={styles.eyebrow}>Map FAQ</span>
            <h2>Generated-world navigation questions</h2>
            <p>
              These answers separate reusable location knowledge from details that
              belong only to one save or map integration.
            </p>
          </div>
          <div className={styles.faqList}>
            {mapFaqs.map((item, index) => (
              <details key={item.question} open={index === 0}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.relatedSection}>
        <div className={`container ${styles.relatedInner}`}>
          <div className={styles.sectionHeading}>
            <span className={styles.eyebrow}>Continue planning</span>
            <h2>Turn the route into a workable build</h2>
          </div>
          <div className={styles.relatedGrid}>
            {relatedRoutes.map((route) => (
              <Link href={route.href} key={route.href}>
                <strong>{route.label}</strong>
                <span>{route.text}</span>
                <small>Open guide →</small>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
