import Link from "next/link";
import styles from "./wiki-category-planner.module.css";

const toolJobs = [
  {
    scene: "A vehicle is flipped, trapped, or unsafe to edit",
    tool: "Lift",
    href: "/wiki/tools/lift",
    proof: "Creation is stable; bearings remain locked until lowered",
    next: "/guides/first-vehicle",
    nextLabel: "First vehicle recovery",
  },
  {
    scene: "A wheel, controller, sensor, or engine does nothing",
    tool: "Connect Tool",
    href: "/wiki/tools/connect-tool",
    proof: "Signal direction and bearing rotation are visible",
    next: "/builds",
    nextLabel: "Choose the matching build",
  },
  {
    scene: "Two finished creation bodies must become one",
    tool: "Weld Tool",
    href: "/wiki/tools/weld-tool",
    proof: "Orientation is final and moving joints remain separate",
    next: "/guides/first-vehicle",
    nextLabel: "Chassis planning",
  },
  {
    scene: "Controls, pipes, or sensor targets are hard to identify",
    tool: "Paint Tool",
    href: "/wiki/tools/paint-tool",
    proof: "Input, danger, fluid, and movement colors stay consistent",
    next: "/wiki/items/paint-ammo",
    nextLabel: "Paint Ammo",
  },
  {
    scene: "A road, ramp, base edge, or tunnel floor needs reshaping",
    tool: "Claygun",
    href: "/wiki/tools/claygun",
    proof: "The route stays passable and still has an exit",
    next: "/guides/claygun-basics",
    nextLabel: "Claygun controls",
  },
  {
    scene: "Underground rock blocks the mining route",
    tool: "Plasma Drill",
    href: "/wiki/tools/plasma-drill",
    proof: "The bore has reverse clearance and the tool head avoids the chassis",
    next: "/guides/excavation-island-mining",
    nextLabel: "Mining loop",
  },
];

const resourceRoutes = [
  {
    resource: "Component Kit",
    href: "/wiki/resources/component-kit",
    source: "Totebot, Haybot, and Farmbot drops; damaged crates and ruins",
    method: "Combat and loot route",
    use: "Interactive-part and workshop upgrades",
    link: "/wiki/bots",
    linkLabel: "Compare bot drops",
  },
  {
    resource: "Scrap Metal",
    href: "/wiki/resources/scrap-metal",
    source: "Haybot scrap and ruin routes",
    method: "Defeat, collect, and refine",
    use: "Opening vehicle and starter construction",
    link: "/wiki/bots/haybot",
    linkLabel: "Haybot counter",
  },
  {
    resource: "Wood",
    href: "/wiki/resources/wood",
    source: "Large trees and mature forest",
    method: "Powered Saw Blade, collection, then refining",
    use: "Blocks, parts, and light prototypes",
    link: "/builds",
    linkLabel: "Resource collector build",
  },
  {
    resource: "Stone",
    href: "/wiki/resources/stone",
    source: "Square mineable rock formations",
    method: "Powered Drill, collection, then refining",
    use: "Construction and concrete chains",
    link: "/builds",
    linkLabel: "Mining vehicle",
  },
  {
    resource: "Metal",
    href: "/wiki/resources/metal",
    source: "Metal-bearing material separated from drilled rock",
    method: "Drill, collect, and refine",
    use: "Durable blocks, parts, and machines",
    link: "/wiki/blocks/metal-blocks",
    linkLabel: "Compare Metal blocks",
  },
  {
    resource: "Chemicals",
    href: "/wiki/resources/chemicals",
    source: "Pink liquid at Chemical Lakes",
    method: "Bucket or Vacuum Pump from safe ground",
    use: "Crafting, Sticky Wheels, and industrial recipes",
    link: "/wiki/parts/vacuum-pump",
    linkLabel: "Pump setup",
  },
  {
    resource: "Crude Oil",
    href: "/wiki/resources/oil",
    source: "Visible underwater oil deposits",
    method: "Dive and collect; mark productive water",
    use: "Gasoline and industrial crafting chains",
    link: "/wiki/items/gasoline",
    linkLabel: "Gasoline route",
  },
  {
    resource: "Cotton",
    href: "/wiki/resources/cotton",
    source: "Wild plants in autumn-colored forest",
    method: "Gather mature plants or use a supported Growbed route",
    use: "Garments and Dressbot supply",
    link: "/wiki/parts/growbed",
    linkLabel: "Growbed crops",
  },
];

export function WikiCategoryPlanner({ category }: { category: string }) {
  if (category === "tools") {
    return (
      <section className={styles.planner} aria-labelledby="tool-job-heading">
        <header className={styles.plannerHeading}>
          <div>
            <span>Scene → tool → proof</span>
            <h3 id="tool-job-heading">Which tool solves this job?</h3>
          </div>
          <p>
            Choose by the failure in front of the mechanic. The last column opens
            the build or route where that tool matters.
          </p>
        </header>
        <div className={styles.jobTable}>
          <div className={styles.tableHead}>
            <b>Player situation</b>
            <b>Use this</b>
            <b>Successful test</b>
            <b>Continue with</b>
          </div>
          {toolJobs.map((job) => (
            <article key={job.scene}>
              <p>{job.scene}</p>
              <Link href={job.href}>{job.tool} →</Link>
              <p>{job.proof}</p>
              <Link href={job.next}>{job.nextLabel} →</Link>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (category === "resources") {
    return (
      <section className={styles.planner} aria-labelledby="resource-route-heading">
        <header className={styles.plannerHeading}>
          <div>
            <span>Location → collection → use</span>
            <h3 id="resource-route-heading">Where each resource actually comes from</h3>
          </div>
          <p>
            Start from the finished part or build, then follow the row backward to
            the correct biome, bot, node, tool, or refining stage.
          </p>
        </header>
        <div className={`${styles.jobTable} ${styles.resourceTable}`}>
          <div className={styles.tableHead}>
            <b>Resource</b>
            <b>Where to get it</b>
            <b>Collection method</b>
            <b>Key use and next page</b>
          </div>
          {resourceRoutes.map((route) => (
            <article key={route.resource}>
              <Link href={route.href}>{route.resource} →</Link>
              <p>{route.source}</p>
              <p>{route.method}</p>
              <div>
                <p>{route.use}</p>
                <Link href={route.link}>{route.linkLabel} →</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return null;
}
