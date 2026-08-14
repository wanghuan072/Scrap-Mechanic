import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { GptAd } from "@/components/ads/GptAd";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { site } from "@/config/site";
import { locations } from "@/lib/data/locations";
import { JsonLd, PageJsonLd } from "@/seo/JsonLd";
import { createMetadata } from "@/seo/metadata";
import { pageTdk } from "@/seo/tdk";
import styles from "@/style/page/map/map.module.css";

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
      "Switch between Story Areas, Grow Labs, Underground, and Boss Areas before leaving the surface. Each region view isolates a progression space so you can plan the approach and return route.",
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

const interactiveMapUrl = "https://scrap-mechanic-map.vercel.app/";
const mapReviewDateIso = "2026-08-14";
const mapReviewDate = "August 14, 2026";
const mapStats = {
  regionViews: 18,
  locationEntries: 376,
  markerTypes: 5,
} as const;

const mapFaqs = [
  {
    question: "How do I open the Scrap Mechanic map?",
    answer:
      "Use the Open interactive map button near the top of this page or scroll to the embedded viewer. This browser-based map viewer is not an in-game map button or a map mod; choose a region, then pan, zoom, search, and enable the layers you need.",
  },
  {
    question: "Does every Scrap Mechanic Survival world use the same map?",
    answer:
      "The viewer separates fixed and story references from a Generated Locations index. Treat the displayed map as a planning reference, then confirm generated roads, ruins, resources, and route relationships in your own Survival world.",
  },
  {
    question: "Can I use coordinates from another player's world?",
    answer:
      "The viewer displays an X and Y readout and can overlay a Coordinate Grid. Coordinates are most reliable inside the same map reference; confirm the destination in your own world before committing cargo or rare equipment.",
  },
  {
    question: "What happened to the Scrap Mechanic Chapter 2 map?",
    answer:
      "The content many players previously called Chapter 2 was released as Scrap Mechanic 1.0 and Drilling Thunder. Use the viewer's current region list and compare Terrain, Location Names, and Generated Locations instead of relying on an older cropped map.",
  },
  {
    question: "Is this a Scrap Mechanic seed map generator or save editor?",
    answer:
      "No. This is a reference map viewer: it does not generate a world from a seed, upload or parse a save, edit terrain, or install a map mod. Use its regions, coordinates, layers, and player markers to plan a route, then confirm generated locations in your own Survival world.",
  },
  {
    question: "Are tornadoes fixed map locations?",
    answer:
      "No. Treat tornadoes as dynamic weather hazards rather than permanent landmarks. If one blocks a route, divert early or postpone a loaded delivery instead of relying on a fixed marker.",
  },
  {
    question: "How do I open the underground map in Scrap Mechanic 1.0?",
    answer:
      "Open the region selector inside the map viewer, expand Underground, then choose the Mining Hub, Underground Station 1 or 2, Drilling Area 1 or 2, or the Underground Guidance Area. Switch back to Surface World when you need to plan the road approach.",
  },
];

const mapRegions = [
  {
    label: "Surface",
    count: "2 views",
    locations: "Surface World · Scrapyard",
    text: "Use for the main terrain, roads, generated locations, and surface route planning.",
  },
  {
    label: "Story Areas",
    count: "1 view",
    locations: "Excavation Island",
    text: "Switch away from the surface when a progression objective moves into its own map space.",
  },
  {
    label: "Grow Labs",
    count: "7 views",
    locations: "Grow Lab 1–7",
    text: "Inspect each lab as an individual region instead of searching for it on the surface layer.",
  },
  {
    label: "Underground",
    count: "6 views",
    locations: "Mining · Stations · Drilling · Guidance",
    text: "Plan mining and underground progression with dedicated station and drilling-area views.",
  },
  {
    label: "Boss Areas",
    count: "2 views",
    locations: "Final Boss Hall · Trashbot Boss Area",
    text: "Open the encounter space before carrying valuable equipment into a boss route.",
  },
];

const mapTools = [
  {
    number: "01",
    label: "Choose a region",
    text: `Start with one of ${mapStats.regionViews} region views so surface, lab, underground, and boss geometry never compete for attention.`,
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
    text: "Use Vehicle and Resource markers to compare the surface approach with the selected lab, underground, or boss view before choosing a build.",
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
            url: interactiveMapUrl,
            applicationCategory: "GameApplication",
            operatingSystem: "Any web browser",
            isAccessibleForFree: true,
          },
          isBasedOn: interactiveMapUrl,
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
                hazards. Open the embedded viewer to search locations, switch regions,
                combine layers, and mark a route before leaving the garage.
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
                <span>Verified for Scrap Mechanic {site.currentVersion}</span>
                <time dateTime={mapReviewDateIso}>Updated {mapReviewDate}</time>
                <Link href="/updates/1-0-drilling-thunder">Version notes</Link>
                <Link href="/about">Editorial policy</Link>
              </div>
            </div>

            <aside className={styles.heroPanel} aria-label="Interactive map coverage">
              <span>Viewer coverage</span>
              <dl>
                <div>
                  <dt>Region views</dt>
                  <dd>{mapStats.regionViews}</dd>
                </div>
                <div>
                  <dt>Location index</dt>
                  <dd>{mapStats.locationEntries}</dd>
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
          <span>Field index</span>
          <Link href="#interactive-map">Interactive map</Link>
          <Link href="#map-tools">Map tools</Link>
          <Link href="#map-regions">Map regions</Link>
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
                Use the Scrap Mechanic map viewer below to explore{" "}
                {mapStats.regionViews} selectable regions from the 1.0 and Drilling
                Thunder world, search the location index, combine terrain and
                coordinate layers, and place route markers.
              </p>
              <div className={styles.mapStatus} role="status">
                <span className={styles.statusLight} aria-hidden="true" />
                <div>
                  <strong>Viewer connected</strong>
                  <p>Interactive map and location controls available below.</p>
                </div>
              </div>
            </div>
          </header>

          <div className={styles.viewerFrame} aria-label="Embedded interactive Scrap Mechanic map">
            <div className={styles.viewerToolbar}>
              <span>WORLD_VIEWER</span>
              <span className={styles.viewerMode}>Embedded interactive map</span>
            </div>
            <iframe
              className={styles.interactiveMapFrame}
              src={interactiveMapUrl}
              title="Interactive Scrap Mechanic world map"
              width="1200"
              height="760"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="fullscreen"
              allowFullScreen
            />
            <dl className={styles.viewerStats}>
              <div>
                <dt>Region views</dt>
                <dd>{mapStats.regionViews} selectable</dd>
              </div>
              <div>
                <dt>Generated index</dt>
                <dd>{mapStats.locationEntries} entries</dd>
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
                Choose the region that matches your objective, reveal only the layers
                you need, and mark the safe return route before carrying fuel, cargo,
                or rare equipment into the field.
              </p>
              <p className={styles.quickStartNote}>
                Map scope: {mapStats.regionViews} region views plus search, layers,
                markers, coordinates, and zoom. Generated roads and sites can vary, so
                confirm the final route in your own save.
              </p>
            </div>

            <dl className={styles.quickStartSteps}>
              <div>
                <dt>Start here</dt>
                <dd>Use Surface World for roads, bases, resources, and early routes</dd>
              </div>
              <div>
                <dt>Find a destination</dt>
                <dd>Search the Location Browser or switch to a story region</dd>
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

      <GptAd slotId="div-gpt-ad-map-1" unit="banner1" />

      <section className={styles.generatedSection} id="map-tools">
        <div className={`container ${styles.generatedGrid}`}>
          <div className={styles.sectionHeading}>
            <span className={styles.eyebrow}>Map workflow</span>
            <h2>Plan Routes in a Generated World</h2>
            <p>
              The viewer combines a fixed reference map with a large generated-location
              index. Use its controls to narrow the reference, then verify the final
              route against your own Survival world.
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
        aria-label="Interactive map region index"
      >
        <div className={`container ${styles.regionInner}`}>
          <div className={styles.regionLead}>
            <div>
              <span className={styles.eyebrow}>Viewer region index</span>
              <h2>Explore All 18 Map Regions</h2>
            </div>
            <p>
              The region selector separates surface navigation from self-contained
              story, lab, underground, and boss spaces. Pick the matching view before
              searching for a location or adding a marker.
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
            The viewer contains hundreds of searchable map records. This curated field
            directory turns the most useful surface, story, generated, and hazard
            entries into preparation notes you can use before opening a region view.
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

      <GptAd slotId="div-gpt-ad-map-2" unit="banner2" />

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
              belong only to one generated save or selected region view.
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
