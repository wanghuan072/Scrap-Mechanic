import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { PageJsonLd } from "@/seo/JsonLd";
import { buildFailureChecks } from "@/lib/data/builds";
import { buildSpecList, buildSpecs } from "@/lib/data/builds";
import { getPlayerItemImage } from "@/lib/game/player-data";
import { botBuildRoutes } from "@/lib/data/bot-guide";
import { builds, getWikiEntryByName } from "@/lib/content/catalog";
import { createMetadata } from "@/seo/metadata";
import { pageTdk } from "@/seo/tdk";
import styles from "@/style/page/builds/builds.module.css";

export const metadata: Metadata = createMetadata(pageTdk.builds, "/builds");

const jobRoutes = [
  {
    number: "01",
    need: "Learn steering and drive",
    answer: "Starter car",
    slug: "starter-car",
  },
  {
    number: "02",
    need: "Explore rough terrain",
    answer: "Off-road scout",
    slug: "off-road-scout",
  },
  {
    number: "03",
    need: "Move packed produce",
    answer: "Cargo hauler",
    slug: "cargo-hauler",
  },
  {
    number: "04",
    need: "Collect loose resources",
    answer: "Collector truck",
    slug: "resource-collector-truck",
  },
  {
    number: "05",
    need: "Mine Excavation Island",
    answer: "Mining vehicle",
    slug: "mining-vehicle",
  },
  {
    number: "06",
    need: "Water a crop row",
    answer: "Automatic watering",
    slug: "automatic-watering",
  },
  {
    number: "07",
    need: "Harvest a crop row",
    answer: "Vacuum harvester",
    slug: "vacuum-harvester",
  },
  {
    number: "08",
    need: "Close a vehicle entrance",
    answer: "Defense gate",
    slug: "base-defense-gate",
  },
  {
    number: "09",
    need: "Learn multi-input logic",
    answer: "Basic logic door",
    slug: "basic-logic-door",
  },
  {
    number: "10",
    need: "Move between floors",
    answer: "Piston elevator",
    slug: "piston-elevator",
  },
  {
    number: "11",
    need: "Control two-door access",
    answer: "Sensor airlock",
    slug: "sensor-airlock-door",
  },
];

const toolGuide = [
  {
    name: "Lift",
    scene: "Frames, wheel alignment, underside access, rollover recovery",
    rule: "Keep one reachable frame point after bodywork and cargo are fitted.",
  },
  {
    name: "Connect Tool",
    scene: "Steering, engines, bearings, switches, Sensors, Controllers",
    rule: "Test one signal path at a time and reverse only the incorrect bearing.",
  },
  {
    name: "Weld Tool",
    scene: "Moving a tested module onto a final chassis or fixed structure",
    rule: "Prove the module separately before welding it into a harder-to-reach space.",
  },
  {
    name: "Paint Tool",
    scene: "Marking controls, movement zones, service points, and safe positions",
    rule: "Use the same color for the same function throughout one creation.",
  },
];

const workHeads = [
  {
    name: "Resource Collector",
    scene: "Picking up logs and resource pieces",
    build: "resource-collector-truck",
  },
  {
    name: "Vacuum Pump",
    scene: "Moving crops and items through connected containers",
    build: "vacuum-harvester",
  },
  {
    name: "Water Cannon",
    scene: "Delivering stored water across a fixed crop row",
    build: "automatic-watering",
  },
  {
    name: "Plasma Drill Level 1",
    scene: "Powered mining on Excavation Island",
    build: "mining-vehicle",
  },
  {
    name: "Piston Level 1",
    scene: "Short linear travel for gates, lifts, gantries, and tool heads",
    build: "piston-elevator",
  },
  {
    name: "Sensor Level 1",
    scene: "Detecting position or presence within a ten-block range",
    build: "sensor-airlock-door",
  },
];

const progressionSystems = [
  {
    need: "Repair a vehicle far from the Mechanic Station",
    machine: "Portable Craftbot",
    machineHref: "/wiki/parts/portable-craftbot",
    boundary: "4 × 3 × 3; durability 4 / 10; keep the interaction face protected and reachable",
    route: "/builds/cargo-hauler",
    routeLabel: "Add to a cargo hauler",
  },
  {
    need: "Grow starter crops away from normal soil",
    machine: "Growbed",
    machineHref: "/wiki/parts/growbed",
    boundary: "Only Cotton, Pigment Flower, Potato, Tomato, and Carrot; requires power and water",
    route: "/builds/automatic-watering",
    routeLabel: "Plan the water system",
  },
  {
    need: "Process Excavation Island ore",
    machine: "Crushbot → Prospectorbot",
    machineHref: "/wiki/parts/crushbot",
    boundary: "Crush raw ore first; the Prospectorbot stage needs crushed ore, water, and output space",
    route: "/builds/mining-vehicle",
    routeLabel: "Run the mining loop",
  },
  {
    need: "Produce material-matched wedges",
    machine: "Sawbot",
    machineHref: "/wiki/parts/sawbot",
    boundary: "9 × 7 × 5 station; the inserted block chooses the wedge material",
    route: "/builds/starter-car",
    routeLabel: "Prototype a vehicle body",
  },
  {
    need: "Make ice blocks from a water line",
    machine: "Freezer",
    machineHref: "/wiki/parts/freezer",
    boundary: "Water input only; keep ice output separate from liquid storage",
    route: "/wiki/parts/vacuum-pump",
    routeLabel: "Prove the pump first",
  },
  {
    need: "Drive on steep walls",
    machine: "Sticky Wheel",
    machineHref: "/wiki/parts/sticky-wheel",
    boundary: "Consumes Chemicals; tune grip with the center of mass close to the wall",
    route: "/builds/off-road-scout",
    routeLabel: "Start from a stable scout",
  },
  {
    need: "Aim a mounted tool or weapon through 360 degrees",
    machine: "Turret Seat",
    machineHref: "/wiki/parts/turret-seat",
    boundary: "7 × 7 base footprint; leave the full rotating assembly clear",
    route: "/builds/base-defense-gate",
    routeLabel: "Separate aim from access",
  },
  {
    need: "Rebuild a saved Creative or Workshop creation in Survival",
    machine: "Scrap City Garage",
    machineHref: "/map#scrap-city-garage",
    boundary: "The 30-slot Garage Chest must contain every exact block and part shortage",
    route: "/guides/scrap-city-garage-blueprints",
    routeLabel: "Load and assemble a blueprint",
  },
];

const buildComparison: Record<string, { keyPart: string }> = {
  "starter-car": {
    keyPart: "Gas Engine Level 1",
  },
  "mining-vehicle": {
    keyPart: "Plasma Drill Level 1",
  },
  "automatic-watering": {
    keyPart: "Water Cannon",
  },
  "base-defense-gate": {
    keyPart: "Piston Level 1",
  },
  "basic-logic-door": {
    keyPart: "Logic Gate",
  },
  "resource-collector-truck": {
    keyPart: "Resource Collector",
  },
  "cargo-hauler": {
    keyPart: "Large Chest",
  },
  "vacuum-harvester": {
    keyPart: "Vacuum Pump",
  },
  "piston-elevator": {
    keyPart: "Piston Level 1",
  },
  "off-road-scout": {
    keyPart: "Off-Road Suspension Level 1",
  },
  "sensor-airlock-door": {
    keyPart: "Sensor Level 1",
  },
};

function wikiHref(name: string) {
  const entry = getWikiEntryByName(name);
  return entry
    ? `/wiki/${entry.category}/${entry.slug}`
    : `/wiki/recipes?q=${encodeURIComponent(name)}#recipe-directory`;
}

function ItemIcon({ name, size = 66 }: { name: string; size?: number }) {
  const image = getPlayerItemImage(name);
  return image ? (
    <Image
      src={image}
      alt={`${name} item icon`}
      width={size}
      height={size}
    />
  ) : null;
}

export default function BuildsPage() {
  const leadBuild = builds.find((build) => build.slug === "starter-car")!;
  const totalPartTypes = new Set(
    buildSpecList.flatMap((spec) => spec.parts.map((part) => part.name)),
  ).size;
  const totalTests = buildSpecList.reduce(
    (total, spec) => total + spec.tests.length,
    0,
  );

  return (
    <main className={styles.page}>
      <PageJsonLd seo={pageTdk.builds} path="/builds" type="CollectionPage" />
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
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Builds" },
            ]}
          />
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <span>Build &amp; Progression Lab / 11 working blueprints</span>
              <h1>Scrap Mechanic Builds - Build the Job, Not Just the Shape</h1>
              <p>
                Start with the task: drive, haul, mine, water, harvest, defend, or
                automate. Each blueprint gives you a baseline size, part count,
                crafting cost, connection map, construction order, and pass/fail
                test before decoration begins.
              </p>
              <div className={styles.heroActions}>
                <a href="#choose-a-job">Choose a job</a>
                <Link href="/tools/crafting-planner">Plan crafting materials</Link>
              </div>
            </div>
            <aside className={styles.heroPanel}>
              <span>Workshop coverage</span>
              <dl>
                <div>
                  <dt>Blueprints</dt>
                  <dd>{builds.length}</dd>
                </div>
                <div>
                  <dt>Unique part types</dt>
                  <dd>{totalPartTypes}</dd>
                </div>
                <div>
                  <dt>Commissioning tests</dt>
                  <dd>{totalTests}</dd>
                </div>
                <div>
                  <dt>Design baseline</dt>
                  <dd>1.0</dd>
                </div>
              </dl>
              <div className={styles.heroParts} aria-label="Common build parts">
                {["Lift", "Connect Tool", "Bearing", "Controller Level 1"].map(
                  (name) => (
                    <Link href={wikiHref(name)} key={name} title={name}>
                      <ItemIcon name={name} size={54} />
                    </Link>
                  ),
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className={styles.jobSection} id="choose-a-job">
        <div className="container">
          <header className={styles.heading}>
            <div>
              <span>Start here</span>
              <h2>Choose the job and compare the build</h2>
            </div>
            <p>
              Find the job you need, then check its baseline size, build time,
              working part, and difficulty in the same row. Each blueprint appears
              once, with one route to its complete construction file.
            </p>
          </header>
          <div className={styles.comparisonTable}>
            <div className={styles.comparisonHead}>
              <span>Job</span>
              <span>Recommended blueprint</span>
              <span>Baseline</span>
              <span>Build time</span>
              <span>Key part</span>
              <span>Part types</span>
              <span>Difficulty</span>
              <span aria-hidden="true">Open</span>
            </div>
            {jobRoutes.map((job) => {
              const spec = buildSpecs[job.slug];
              const comparison = buildComparison[job.slug];
              const footprint =
                spec.baseline.find((item) => item.label === "Footprint")
                  ?.value ??
                spec.baseline.find((item) => item.label.includes("row"))?.value ??
                spec.baseline[0].value;
              return (
                <Link
                  className={styles.comparisonRow}
                  href={`/builds/${job.slug}`}
                  key={job.slug}
                >
                  <div className={styles.comparisonBuild}>
                    <span>{job.number}</span>
                    <strong>{job.need}</strong>
                  </div>
                  <div className={styles.comparisonFocus}>
                    <span className={styles.mobileLabel}>
                      Recommended blueprint
                    </span>
                    <div>
                      <strong className={styles.recommendedBuild}>
                        {job.answer}
                      </strong>
                      <small>{spec.blueprintId}</small>
                    </div>
                  </div>
                  <div className={styles.comparisonMetric}>
                    <span className={styles.mobileLabel}>Baseline</span>
                    <strong>{footprint}</strong>
                  </div>
                  <div className={styles.comparisonMetric}>
                    <span className={styles.mobileLabel}>Build time</span>
                    <strong>{spec.buildTime}</strong>
                  </div>
                  <div className={styles.comparisonPart}>
                    <ItemIcon name={comparison.keyPart} size={48} />
                    <div>
                      <span className={styles.mobileLabel}>Key part</span>
                      <strong>{comparison.keyPart}</strong>
                    </div>
                  </div>
                  <div className={styles.comparisonMetric}>
                    <span className={styles.mobileLabel}>Part types</span>
                    <strong>{spec.parts.length}</strong>
                  </div>
                  <div className={styles.comparisonMetric}>
                    <span className={styles.mobileLabel}>Difficulty</span>
                    <strong>{spec.difficulty}</strong>
                  </div>
                  <b className={styles.comparisonArrow} aria-hidden="true">
                    ↗
                  </b>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.botPressureSection}>
        <div className="container">
          <header className={styles.heading}>
            <div>
              <span>Bot-specific changes</span>
              <h2>When the bot changes, change the build</h2>
            </div>
            <p>
              “Farm defense” is not one mechanism. Melee swarms test the impact
              lane, Tapebots test sight lines, Yellow Totebots test vertical
              clearance, and underground bots test whether a vehicle protects its
              working parts.
            </p>
          </header>
          <div className={styles.botPressureTable}>
            <div className={styles.botPressureHead}>
              <span>Bot or resource route</span>
              <span>Failure pressure</span>
              <span>Use this blueprint</span>
              <span>Change before testing</span>
            </div>
            {botBuildRoutes.map((route) => (
              <article className={styles.botPressureRow} key={route.pressure}>
                <Link href={route.botHref}>{route.bot} ↗</Link>
                <p data-label="Failure pressure">{route.pressure}</p>
                <Link data-label="Use this blueprint" href={route.href}>
                  {route.build} ↗
                </Link>
                <p data-label="Change before testing">{route.change}</p>
              </article>
            ))}
          </div>
          <div className={styles.botPressureLinks}>
            <Link href="/wiki/bots">Compare every bot family →</Link>
            <Link href="/tools/raid-calculator">Calculate the next crop raid →</Link>
            <Link href="/wiki/crops">Plan the crop and seed route →</Link>
          </div>
        </div>
      </section>

      <section className={styles.toolsSection}>
        <div className={`container ${styles.toolsGrid}`}>
          <header className={styles.sideHeading}>
            <span>Tool decisions</span>
            <h2>Which tool belongs to which stage?</h2>
            <p>
              The building tools solve different workshop problems. Use them in a
              deliberate order: support, connect, test, relocate, then label.
            </p>
            <Link href="/wiki/tools">Browse every tool →</Link>
          </header>
          <div className={styles.toolRows}>
            {toolGuide.map((tool, index) => {
              const usedBy = buildSpecList.filter((spec) =>
                spec.toolkit.some((item) => item.name === tool.name),
              );
              return (
                <article className={styles.toolRow} key={tool.name}>
                  <Link
                    className={styles.toolIdentity}
                    href={wikiHref(tool.name)}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <ItemIcon name={tool.name} size={72} />
                    <h3>{tool.name}</h3>
                  </Link>
                  <div>
                    <span>Use it for</span>
                    <p>{tool.scene}</p>
                  </div>
                  <div>
                    <span>Workshop rule</span>
                    <p>{tool.rule}</p>
                  </div>
                  <div className={styles.usedBy}>
                    <span>Used in</span>
                    <p>{usedBy.length} blueprints</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.headSection}>
        <div className="container">
          <header className={styles.heading}>
            <div>
              <span>Working parts</span>
              <h2>Match the mechanism to the scene</h2>
            </div>
            <p>
              A tool head defines the job; the chassis or structure only carries
              it. Keep power, movement, and storage as separate testable systems.
            </p>
          </header>
          <div className={styles.headRail}>
            {workHeads.map((head) => {
              const build = builds.find((entry) => entry.slug === head.build)!;
              return (
                <article key={head.name}>
                  <Link href={wikiHref(head.name)}>
                    <ItemIcon name={head.name} size={88} />
                    <span>Part file ↗</span>
                  </Link>
                  <div>
                    <h3>{head.name}</h3>
                    <p>{head.scene}</p>
                    <Link href={`/builds/${head.build}`}>
                      Use in {build.title} →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.systemSection}>
        <div className="container">
          <header className={styles.heading}>
            <div>
              <span>1.0 progression machines</span>
              <h2>Choose the station after the job is proven</h2>
            </div>
            <p>
              These machines extend a working build or production line. They are
              not replacements for the blueprints above: first prove movement,
              water, storage, or mining, then install the matching station.
            </p>
          </header>
          <div className={styles.systemTable}>
            <div className={styles.systemHead}>
              <span>Player need</span>
              <span>Machine or station</span>
              <span>Hard limit to design around</span>
              <span>Next working route</span>
            </div>
            {progressionSystems.map((system) => (
              <article key={system.need}>
                <p>{system.need}</p>
                <Link href={system.machineHref}>{system.machine} ↗</Link>
                <p>{system.boundary}</p>
                <Link href={system.route}>{system.routeLabel} →</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.diagnosticsSection}>
        <div className={`container ${styles.diagnosticsGrid}`}>
          <header className={styles.sideHeading}>
            <span>First correction</span>
            <h2>Diagnose the symptom before rebuilding</h2>
            <p>
              Change one variable and repeat the same loaded test. Several changes
              at once hide the cause.
            </p>
          </header>
          <div className={styles.diagnosticTable}>
            <div className={styles.diagnosticHead}>
              <span>Symptom</span>
              <span>Inspect</span>
              <span>First change</span>
            </div>
            {buildFailureChecks.map((item) => (
              <div className={styles.diagnosticRow} key={item.symptom}>
                <strong>{item.symptom}</strong>
                <p>{item.inspect}</p>
                <p>{item.firstChange}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.startSection}>
        <div className={`container ${styles.startGrid}`}>
          <Image
            src={leadBuild.image}
            alt={leadBuild.imageAlt}
            fill
            sizes="100vw"
          />
          <div>
            <span>First workshop file / VEH-01</span>
            <h2>Start with the bare chassis</h2>
            <p>
              Build the 10 × 16 starter frame, align six Bearings, connect four
              Wheels, and prove steering at low engine power before adding a chest
              or body panels.
            </p>
            <Link href="/builds/starter-car">Build the starter car →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
