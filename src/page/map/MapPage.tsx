import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { site } from "@/config/site";
import { NativeMapClient } from "@/features/native-map/NativeMapClient";
import { locations } from "@/lib/data/locations";
import { JsonLd, PageJsonLd } from "@/seo/JsonLd";
import { createMetadata } from "@/seo/metadata";
import { pageTdk } from "@/seo/tdk";
import styles from "@/style/page/map/map.module.css";
import { MapSectionSelect } from "./MapSectionSelect";

const mapOgImage = "/images/og/scrap-mechanic-map.jpg";

export const metadata: Metadata = createMetadata(pageTdk.map, "/map", {
  image: mapOgImage,
});

const locationGroups = [
  {
    key: "starting-route",
    eyebrow: "Surface World",
    title: "Start with the connected road route",
    description:
      "Start in the map's Surface World view, then use Location Names and the location browser to connect the Mechanic Station, road network, production stops, and your chosen base route.",
  },
  {
    key: "story",
    eyebrow: "Story, labs, and bosses",
    title: "Prepare before following story markers",
    description:
      "Use surface story markers and the personal-map progress panel to connect Grow Labs, quest state, Scannerbot activity, and other verified save records with the route you can travel.",
  },
  {
    key: "exploration",
    eyebrow: "Generated locations",
    title: "Use small landmarks to build a reliable route",
    description:
      "Use the Generated Locations tree to narrow hundreds of map entries into camps and ruins, quest locations, major sites, resources, road locations, or warehouses before plotting a trip.",
  },
  {
    key: "region-hazard",
    eyebrow: "Layers and hazards",
    title: "Terrain and weather can change the safest route",
    description:
      "Combine Terrain, Coordinate Grid, Resource & Hazard locations, and player markers. Use the Danger marker type for risky approaches and keep Base or Vehicle markers on safe recovery points.",
  },
] as const;

const kindLabels = {
  landmark: "Landmark",
  "location-group": "Generated location type",
  region: "Region",
  "dynamic-hazard": "Dynamic hazard",
};

const mapReviewDateIso = "2026-09-29";
const mapReviewDate = "September 29, 2026";
const mapStats = {
  modes: 2,
  surfaceGrid: "128 × 96",
  markerTypes: 5,
  saveVersion: "v28",
} as const;

const mapFaqs = [
  {
    question: "How do I open the Scrap Mechanic map?",
    answer:
      "Use the Open interactive map button near the top of this page or scroll to the native viewer. The map runs directly on this page; pan, zoom, search, choose layers, or select a local Survival save for a personal surface map.",
  },
  {
    question: "Does every Scrap Mechanic Survival world use the same map?",
    answer:
      "No. Reference mode provides a complete planning surface, while Personal Map mode reads the actual terrain grid from a supported local Survival save so generated roads, ruins, resources, and route relationships match that save.",
  },
  {
    question: "Can I use coordinates from another player's world?",
    answer:
      "The viewer displays an X and Y readout and can overlay a Coordinate Grid, but generated layouts differ. Load your own supported save when a coordinate must match your world before committing cargo or rare equipment.",
  },
  {
    question: "What happened to the Scrap Mechanic Chapter 2 map?",
    answer:
      "The content many players previously called Chapter 2 was released as Scrap Mechanic 1.0 and Drilling Thunder. This viewer focuses on the Survival surface and its generated layout rather than presenting older chapter labels as separate maps.",
  },
  {
    question: "Is this a Scrap Mechanic seed map generator or save editor?",
    answer:
      "No. It can parse a supported Survival v28 .db file locally in your browser, but it does not upload the file, regenerate the world from only its seed, edit the save, change terrain, or install a mod.",
  },
  {
    question: "Are tornadoes fixed map locations?",
    answer:
      "No. Treat tornadoes as dynamic weather hazards rather than permanent landmarks. If one blocks a route, divert early or postpone a loaded delivery instead of relying on a fixed marker.",
  },
  {
    question: "Does the viewer include underground and interior maps?",
    answer:
      "No. The current viewer renders the Survival surface. A personal save can show verified underground-depth and Grow Lab records in its progress panel, but it does not render separate underground, interior, or boss-area floor plans.",
  },
];

const mapRegions = [
  {
    label: "Reference Map",
    count: "Always available",
    locations: "Verified 128 × 96 surface",
    text: "Open a complete planning surface without selecting a local save.",
  },
  {
    label: "Personal Map",
    count: "Local v28 save",
    locations: "Actual generated terrain",
    text: "Replace the reference terrain with the layout decoded from your supported save.",
  },
  {
    label: "Player Content",
    count: "Independent layer",
    locations: "Builds · Vehicles",
    text: "Show supported player creations without changing the verified terrain artwork.",
  },
  {
    label: "Save Progress",
    count: "Verified records",
    locations: "Quests · Labs · Logs · Scannerbot",
    text: "Read supported progress records without inventing an overall completion percentage.",
  },
  {
    label: "Local Markers",
    count: "5 marker types",
    locations: "Resource · Danger · Base · Vehicle · Note",
    text: "Keep private route notes in this browser, isolated by map scope.",
  },
];

const mapTools = [
  {
    number: "01",
    label: "Choose a map mode",
    text: "Use the verified reference surface for general planning or select a supported local save when the route must match your generated world.",
  },
  {
    number: "02",
    label: "Search and filter",
    text: "Use Location Browser search, then narrow the generated index by quests, camps, major sites, resources, roads, or warehouses.",
  },
  {
    number: "03",
    label: "Build the layer stack",
    text: "Toggle Terrain, Location Names, Coordinate Grid, Player Markers, and marker names according to the current task.",
  },
  {
    number: "04",
    label: "Mark the route",
    text: "Add Resource, Danger, Base, Vehicle, or Note markers, then use the X/Y readout and Reset View control to stay oriented.",
  },
];

const routeSteps = [
  {
    number: "01",
    title: "Start from a known landmark",
    text: "Select Surface World, search the Location Browser, and use the Mechanic Station or another visible reference as the route origin.",
  },
  {
    number: "02",
    title: "Record decision points",
    text: "Enable Coordinate Grid and Player Marker Names, then place Note markers at road forks or layer transitions instead of marking every straight segment.",
  },
  {
    number: "03",
    title: "Match the vehicle to the trip",
    text: "Use Vehicle and Resource markers to compare terrain, road width, storage stops, and the return route before choosing a build.",
  },
  {
    number: "04",
    title: "Protect the return journey",
    text: "Place Base and Danger markers on the safe exit and risky approach, then reset the view and verify both ends of the route before departure.",
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
      <PageJsonLd
        seo={pageTdk.map}
        path="/map"
        type="CollectionPage"
        additionalProperties={{
          dateModified: mapReviewDateIso,
          primaryImageOfPage: {
            "@type": "ImageObject",
            url: `${site.url}${mapOgImage}`,
            width: 1200,
            height: 630,
          },
          author: {
            "@type": "Organization",
            name: site.publisherName,
            url: `${site.url}/about`,
          },
          about: {
            "@type": "VideoGame",
            name: site.name,
            url: site.officialUrl,
            sameAs: site.steamUrl,
          },
          mainEntity: {
            "@type": "WebApplication",
            name: "Scrap Mechanic Interactive Map",
            url: `${site.url}/map`,
            applicationCategory: "GameApplication",
            operatingSystem: "Any web browser",
            isAccessibleForFree: true,
            softwareVersion: "1.0.1.869 map data",
            featureList: [
              "Reference Survival surface",
              "Browser-local Survival save parsing",
              "Player builds and vehicles",
              "Verified save progress",
              "Search, layers, coordinates, and local markers",
            ],
          },
        }}
      />
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
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <span className={styles.eyebrow}>World navigation / interactive viewer</span>
              <h1>
                Scrap Mechanic Map <span>- Interactive Map</span>
              </h1>
              <p className={styles.intro}>
                Explore Survival landmarks, progression routes, resource areas, and
                hazards. Use the native viewer to search locations, combine layers,
                mark a route, or open a supported local save without uploading it.
              </p>

              <div className={styles.heroActions}>
                <Link className={styles.primaryAction} href="#interactive-map">
                  Open interactive map
                </Link>
                <Link className={styles.secondaryAction} href="#location-directory">
                  Browse locations
                </Link>
              </div>

              <div className={styles.reviewLine} aria-label="Map review details">
                <span>Live game {site.currentVersion} · map review is separately dated</span>
                <time dateTime={mapReviewDateIso}>Updated {mapReviewDate}</time>
                <Link href="/updates/1-0-drilling-thunder">Version notes</Link>
                <Link href="/about">Editorial policy</Link>
              </div>
            </div>

            <aside className={styles.heroPanel} aria-label="Interactive map coverage">
              <span>Viewer coverage</span>
              <dl>
                <div>
                  <dt>Map modes</dt>
                  <dd>{mapStats.modes}</dd>
                </div>
                <div>
                  <dt>Surface grid</dt>
                  <dd>{mapStats.surfaceGrid}</dd>
                </div>
                <div>
                  <dt>Marker types</dt>
                  <dd>{mapStats.markerTypes}</dd>
                </div>
                <div>
                  <dt>Navigation</dt>
                  <dd>X / Y / Zoom</dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>
      </section>

      <nav className={styles.sectionNav} aria-label="Map page sections">
        <div className={`container ${styles.sectionNavInner}`}>
          <MapSectionSelect className={styles.sectionSelect} sections={[
            { id: "interactive-map", label: "Interactive map" },
            { id: "map-tools", label: "Map tools" },
            { id: "map-regions", label: "Map modes" },
            ...locationGroups.map((group) => ({ id: group.key, label: group.eyebrow })),
            { id: "map-faq", label: "FAQ" },
          ]} />
          <span>Field index</span>
          <Link href="#interactive-map">Interactive map</Link>
          <Link href="#map-tools">Map tools</Link>
          <Link href="#map-regions">Map modes</Link>
          {locationGroups.map((group) => (
            <Link href={`#${group.key}`} key={group.key}>
              {group.eyebrow}
            </Link>
          ))}
          <Link href="#map-faq">FAQ</Link>
        </div>
      </nav>

      <section className={styles.mapSection} id="interactive-map">
        <div className={`container ${styles.mapLayout}`}>
          <header className={styles.mapHeader}>
            <div className={styles.mapCopy}>
              <span className={styles.eyebrow}>Live world viewer</span>
              <h2>Explore the Interactive Survival Map</h2>
            </div>
            <div className={styles.mapIntroduction}>
              <p>
                Use the Scrap Mechanic map viewer below to explore the verified surface,
                search locations, combine terrain and coordinate layers, place route
                markers, or load a supported local save as a private personal map.
              </p>
              <div className={styles.mapStatus} role="status">
                <span className={styles.statusLight} aria-hidden="true" />
                <div>
                  <strong>Native viewer available</strong>
                  <p>The map and its local-save tools run directly on this page.</p>
                </div>
              </div>
            </div>
          </header>

          <div className={styles.viewerFrame} aria-label="Native interactive Scrap Mechanic map">
            <div className={styles.viewerToolbar}>
              <span>WORLD_VIEWER</span>
              <span className={styles.viewerMode}>Native browser map · local processing</span>
            </div>
            <NativeMapClient className={styles.interactiveMapFrame} />
            <dl className={styles.viewerStats}>
              <div>
                <dt>Map modes</dt>
                <dd>{mapStats.modes} available</dd>
              </div>
              <div>
                <dt>Save support</dt>
                <dd>Survival {mapStats.saveVersion}</dd>
              </div>
              <div>
                <dt>Player markers</dt>
                <dd>{mapStats.markerTypes} marker types</dd>
              </div>
              <div>
                <dt>Navigation</dt>
                <dd>X / Y / Zoom</dd>
              </div>
            </dl>
          </div>

          <aside className={styles.quickStart} aria-labelledby="map-quick-start-title">
            <div className={styles.quickStartIntro}>
              <span className={styles.panelLabel}>Player quick start</span>
              <h3 id="map-quick-start-title">Build a route before leaving the garage</h3>
              <p>
                Choose reference or personal mode, reveal only the layers you need, and
                mark the safe return route before carrying fuel, cargo, or rare equipment
                into the field.
              </p>
              <p className={styles.quickStartNote}>
                Map scope: one verified surface with reference and personal modes, plus
                search, layers, markers, coordinates, and zoom. Load your own save when
                generated roads and sites must match exactly.
              </p>
            </div>

            <dl className={styles.quickStartSteps}>
              <div>
                <dt>Start here</dt>
                <dd>Use Surface World for roads, bases, resources, and early routes</dd>
              </div>
              <div>
                <dt>Find a destination</dt>
                <dd>Search the Location Browser or select your local Survival save</dd>
              </div>
              <div>
                <dt>Read the route</dt>
                <dd>Combine Terrain, Location Names, and Coordinate Grid</dd>
              </div>
              <div>
                <dt>Mark recovery points</dt>
                <dd>Add Base, Vehicle, Danger, Resource, or Note markers</dd>
              </div>
              <div>
                <dt>Before departure</dt>
                <dd>Reset the view and verify both ends of the planned route</dd>
              </div>
              <div>
                <dt>At the destination</dt>
                <dd>Match nearby landmarks and coordinates before unloading cargo</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <section className={styles.generatedSection} id="map-tools">
        <div className={`container ${styles.generatedGrid}`}>
          <div className={styles.sectionHeading}>
            <span className={styles.eyebrow}>Map workflow</span>
            <h2>Scrap Mechanic Map Generator</h2>
            <p>
              Select a supported local Survival .db save to generate a map view of your
              world, find landmarks, and plan routes. Your save is processed only in
              your browser. This tool does not create a new game world or regenerate
              terrain from a seed.
            </p>
          </div>

          <ol className={styles.mapToolGrid}>
            {mapTools.map((tool) => (
              <li key={tool.number}>
                <span>{tool.number}</span>
                <strong>{tool.label}</strong>
                <p>{tool.text}</p>
              </li>
            ))}
          </ol>

          <aside className={styles.layerPanel} aria-label="Map layers available in the viewer">
            <span className={styles.panelLabel}>Layer stack</span>
            <ul>
              <li><strong>Terrain</strong><span>Keep geographic context visible.</span></li>
              <li><strong>Location Names</strong><span>Label fixed and generated places.</span></li>
              <li><strong>Coordinate Grid</strong><span>Read positions with X and Y.</span></li>
              <li><strong>Player Markers</strong><span>Show Resource, Danger, Base, Vehicle, or Note.</span></li>
            </ul>
          </aside>
        </div>
      </section>

      <section
        className={styles.regionSection}
        id="map-regions"
        aria-label="Interactive map capability index"
      >
        <div className={`container ${styles.regionInner}`}>
          <div className={styles.regionLead}>
            <div>
              <span className={styles.eyebrow}>Viewer capability index</span>
              <h2>Explore Five Map Capabilities</h2>
            </div>
            <p>
              Reference and personal modes use the same surface tools while player
              content, verified progress, and local markers remain independent layers.
              Choose the mode that matches the route you need to plan.
            </p>
          </div>
          <div className={styles.regionGrid}>
            {mapRegions.map((region, index) => (
              <article key={region.label}>
                <div>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <small>{region.count}</small>
                </div>
                <strong>{region.label}</strong>
                <p className={styles.regionLocations}>{region.locations}</p>
                <p>{region.text}</p>
              </article>
            ))}
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
            The viewer derives searchable records from the active surface and its
            verified marker data. This curated field directory turns useful surface,
            story, generated, and hazard entries into preparation notes for your route.
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

      <section className={styles.faqSection} id="map-faq">
        <div className={`container ${styles.faqLayout}`}>
          <div className={styles.sectionHeading}>
            <span className={styles.eyebrow}>Map FAQ</span>
            <h2>Generated-world navigation questions</h2>
            <p>
              These answers separate reusable location knowledge from details that
              belong only to one generated save or personal-map state.
            </p>
          </div>
          <div className={styles.faqList}>
            {mapFaqs.map((item) => (
              <article key={item.question}>
                <strong>{item.question}</strong>
                <p>{item.answer}</p>
              </article>
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
