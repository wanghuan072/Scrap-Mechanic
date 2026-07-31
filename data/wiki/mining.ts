import type { WikiEntry } from "@/data/types";

const miningLoopTable = {
  caption: "Excavation Island processing loop",
  headers: ["Stage", "Tool / part", "Job", "Failure mode if skipped"],
  rows: [
    ["1. Scout", "Ore Prospector", "Choose dig heading before a long bore", "Dead-end tunnels, wasted fuel"],
    ["2. Bore", "Plasma Drill", "Dig terrain and collect valuables", "Stuck frame, no escape pocket"],
    ["3. Collect", "Ore Collector", "Move recovered material into storage", "Inventory clog mid-fight"],
    ["4. Process", "Ore Crusher", "Turn ore into usable output", "Hauling raw material forever"],
    ["5. Stage", "Large Chest + lights", "Park output behind dig face", "Loot lost to Minerbot crash"],
  ],
  note: "Plasma Drill Level 1 recipe values are taken from the 1.0.1.869 Craftbot data. Recheck the recipe after a balance patch.",
};

const undergroundThreatTable = {
  caption: "Underground threat checklist",
  headers: ["Threat", "What it changes", "Preparation"],
  rows: [
    ["Minerbot", "Vertical rock showers; crash after kill", "Ceiling sightlines, ranged ammo, cargo not under flight path"],
    ["Cablebot", "Targets destructible creation parts and can dig toward them", "Clear before extending the bore; protect the power train"],
    ["Battery depletion", "The Plasma Drill stops before valuables are ready", "Carry a separate reserve and keep the power connection accessible"],
    ["Darkness", "Missed ledges and bot silhouettes", "Glowsticks / headlights on corridor and vehicle"],
  ],
  note: "The drill description, recipe, and object ratings use the 1.0.1.869 item data; the linked bot pages carry the combat values used here.",
};

export const miningEntries: WikiEntry[] = [
  {
    slug: "plasma-drill",
    category: "tools",
    name: "Plasma Drill",
    description:
      "Battery-powered Excavation Island drill that digs terrain, collects valuables, and ejects them for pickup. Level 1 costs 100 Metal Block 2, 10 Component Kits, and 10 Circuit Boards at a Craftbot.",
    image: "/images/game-items/plasma-drill-level-1-9b9c0a82.webp",
    imageAlt: "Plasma Drill Level 1 inventory icon from Scrap Mechanic",
    gameVersion: "1.0",
    lastTested: "July 2026",
    featured: true,
    facts: [
      { label: "Introduced", value: "1.0 / Drilling Thunder" },
      { label: "Primary job", value: "Dig terrain and collect valuables" },
      { label: "Power", value: "Batteries" },
      { label: "Beam", value: "Adjustable through the tool setting" },
      { label: "Craft time", value: "60 seconds at the Craftbot" },
      { label: "Mounting rule", value: "Stable frame + reverse path" },
      { label: "Paired scout", value: "Ore Prospector before long tunnels" },
      { label: "Paired pickup", value: "Ore Collector behind dig face" },
      { label: "Paired process", value: "Ore Crusher away from combat pocket" },
      { label: "Signature threat", value: "Minerbot overhead pressure" },
    ],
    properties: [
      { label: "Stack size", value: "5" },
      { label: "Durability", value: "8 / 10" },
      { label: "Density", value: "3 / 10" },
      { label: "Friction", value: "2 / 10" },
      { label: "Buoyancy", value: "3 / 10" },
    ],
    recipes: [
      {
        station: "Craftbot",
        duration: "60 seconds",
        ingredients: "100 Metal Block Level 2 + 10 Component Kits + 10 Circuit Boards",
        output: "1 Plasma Drill Level 1",
      },
    ],
    tables: [miningLoopTable, undergroundThreatTable],
    sections: [
      {
        heading: "Vehicle Geometry Before Drill Length",
        paragraphs: [
          "Reach only matters if the frame can reverse. Build a low mining chassis with tool contact you can see, a clear reverse corridor, and cargo chests that are not under the rock face or Minerbot crash zone.",
        ],
        bullets: [
          "Test reverse with a full tool extension before deep work.",
          "Keep repair blocks and a Spudgun on the same vehicle.",
          "Never make the only engine the forward crumple zone.",
        ],
      },
      {
        heading: "Run the Five-Stage Mining Loop",
        paragraphs: [
          "Scout with the Ore Prospector, open a short bore with the Plasma Drill, move recovered material into collection, crush it behind the dig face, then stage the output. The drill already collects valuables and ejects them when ready, so keep its discharge side reachable.",
        ],
        steps: [
          "Prospect and mark the heading.",
          "Open a short bore; confirm reverse + lights.",
          "Clear Minerbots and Cablebots before extending.",
          "Collect and crush in a rear bay.",
          "Extract when chests are full—do not force one more tunnel.",
        ],
      },
      {
        heading: "Why the Ore Parts Share One Workflow",
        paragraphs: [
          "Ore Prospector, Collector, and Crusher perform consecutive jobs. Keeping them in one route makes it easier to diagnose whether a failed mining run started with the heading, pickup, processing, or storage instead of treating each part as an isolated checklist.",
        ],
      },
      {
        heading: "Combat Interrupts Are Normal",
        paragraphs: [
          "Budget potato ammo for Minerbots the same way you budget for Farmbots on the surface. A mining trip that cannot afford a vertical fight is not ready—bring food perks, Glowsticks, and an abort plan to the surface road.",
        ],
      },
    ],
    relatedSlugs: ["plasma-saw", "minerbot", "glowstick", "claygun", "spudgun"],
    seo: {
      title: "Scrap Mechanic Plasma Drill - Recipe and Stats",
      description:
        "Scrap Mechanic Plasma Drill guide with its Craftbot recipe, battery use, adjustable beam, durability 8 stats, and Excavation Island mining setup.",
      keywords: [
        "Scrap Mechanic Plasma Drill",
        "Scrap Mechanic mining",
        "Scrap Mechanic Ore Crusher",
        "Scrap Mechanic Excavation Island",
      ],
    },
  },
  {
    slug: "plasma-saw",
    category: "tools",
    name: "Plasma Saw",
    description:
      "An officially previewed cutting tool that is not present as a usable 1.0 item in the checked game data. Its placeholder UUID has no icon, recipe, description, or physical object record.",
    image: "/images/wiki/plasma-saw-devblog.png",
    imageAlt: "Plasma Saw shown in the official Scrap Mechanic Devblog 22 preview",
    gameVersion: "1.0",
    lastTested: "July 2026",
    facts: [
      { label: "Official preview", value: "Devblog 22 / September 2021" },
      { label: "Previewed role", value: "Cut trees and crystal rock; damage bots" },
      { label: "1.0.1 item record", value: "Name and UUID only" },
      { label: "Current icon", value: "Not present in checked item data" },
      { label: "Current recipe", value: "Not present in Craftbot recipe data" },
      { label: "Current object values", value: "No usable object record found" },
    ],
    sections: [
      {
        heading: "What the Official Preview Showed",
        paragraphs: [
          "Devblog 22 introduced the Plasma Saw as a vehicle-mounted tool able to cut trees and crystal rock, with a second use as a defensive weapon against bots. That preview explains the concept image on this page; it does not confirm that the part shipped in the public 1.0 branch.",
        ],
      },
      {
        heading: "What the Current Game Data Contains",
        paragraphs: [
          "The checked 1.0.1.869 item list contains “Plasma saw 1” and UUID d70849a1-cc53-4d17-b3bc-cac1adc75ceb, but its description and image are empty. The same snapshot contains no Plasma Saw recipe, trade, or physical object values.",
        ],
      },
      {
        heading: "Do Not Budget a Current Build Around It",
        paragraphs: [
          "Do not reserve batteries, bearings, or chassis space for a Plasma Saw in a current Survival blueprint. Use the Plasma Drill page for the implemented mining part, and recheck this status only after an official update adds an icon, recipe, and object definition.",
        ],
      },
    ],
    relatedSlugs: ["plasma-drill", "saw-blade", "minerbot", "glowstick"],
    seo: {
      title: "Scrap Mechanic Plasma Saw - Current 1.0 Status",
      description:
        "Scrap Mechanic Plasma Saw status: its official preview promised tree and crystal cuts, but current 1.0.1 data has no usable object, icon, or recipe.",
      keywords: [
        "Scrap Mechanic Plasma Saw",
        "Scrap Mechanic crystal rock",
        "Scrap Mechanic mining tools",
      ],
    },
  },
];
