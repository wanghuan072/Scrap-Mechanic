import type { WikiEntry } from "@/data/types";

export const itemEntries: WikiEntry[] = [
  {
    slug: "water-bucket",
    category: "items",
    name: "Water Bucket",
    description:
      "A portable bucket used to move water by hand, water early crops, and briefly interrupt some hostile bots.",
    image: "/images/wiki/water-bucket.webp",
    imageAlt: "water bucket image from Scrap Mechanic",
    gameVersion: "1.0",
    lastTested: "July 2026",
    featured: true,
    facts: [
      { label: "Type", value: "Portable item" },
      { label: "Primary use", value: "Moving water" },
      { label: "Useful for", value: "Early farming and emergency bot control" },
    ],
    sections: [
      {
        heading: "What the Water Bucket Does",
        paragraphs: [
          "The Water Bucket is the simple, manual way to carry water before a farm has pumps, containers, and automated watering. It remains useful after automation because it is quick to grab and does not depend on a powered machine.",
        ],
      },
      {
        heading: "Practical Uses",
        bullets: [
          "Water a small starter plot without building a full watering system.",
          "Carry water to a test build before committing to pipes and pumps.",
          "Use a splash to create a brief opening against bots that react to water.",
        ],
      },
      {
        heading: "What to Build Next",
        paragraphs: [
          "Once repeated bucket trips become the slowest part of farming, move to a pump, water container, switch, and watering arm. Keep at least one bucket near the farm for recovery when an automated connection breaks.",
        ],
      },
    ],
    relatedSlugs: ["tomato", "connect-tool", "controller"],
    seo: {
      title: "Scrap Mechanic Water Bucket - Farming Uses Guide",
      description:
        "Learn how the Water Bucket helps with early farming, water transport, and emergency bot control in Scrap Mechanic Survival. Check it in Survival.",
      keywords: ["Scrap Mechanic Water Bucket", "Scrap Mechanic watering", "Scrap Mechanic farming"],
    },
  },
  {
    slug: "circuit-board",
    category: "items",
    name: "Circuit Board",
    description:
      "A common electronic crafting material recovered while fighting bots and exploring Survival.",
    image: "/images/wiki/circuit-board.webp",
    imageAlt: "circuit board image from Scrap Mechanic",
    gameVersion: "1.0",
    lastTested: "July 2026",
    facts: [
      { label: "Type", value: "Crafting material" },
      { label: "Obtained from", value: "Bot combat and exploration" },
      { label: "Best practice", value: "Store separately for planned upgrades" },
    ],
    sections: [
      {
        heading: "Why Circuit Boards Matter",
        paragraphs: [
          "Circuit Boards feed into the electronic side of Survival crafting. New players often spend them as soon as a recipe appears, but keeping a reserve makes it easier to finish a vehicle or station upgrade without another supply run.",
        ],
      },
      {
        heading: "Reliable Collection Habits",
        bullets: [
          "Clear nearby ruins only when you have room to carry the recovered materials.",
          "Keep a labeled chest for electronic materials at the main work area.",
          "Plan a complete build before spending a large reserve on optional parts.",
        ],
      },
    ],
    relatedSlugs: ["haybot", "controller", "connect-tool"],
    seo: {
      title: "Scrap Mechanic Circuit Board - Uses and Guide",
      description:
        "Understand where Circuit Boards fit into Scrap Mechanic Survival crafting and how to manage them for builds and upgrades. Check it in Survival.",
      keywords: ["Scrap Mechanic Circuit Board", "Scrap Mechanic materials", "Scrap Mechanic crafting"],
    },
  },
  {
    slug: "master-battery",
    category: "items",
    name: "Master Battery",
    description:
      "A progression item used to restore power to major early Survival facilities.",
    image: "/images/wiki/master-battery.webp",
    imageAlt: "master battery image from Scrap Mechanic",
    gameVersion: "1.0",
    lastTested: "July 2026",
    featured: true,
    facts: [
      { label: "Type", value: "Progression part" },
      { label: "Used for", value: "Powering major facilities" },
      { label: "Carry rule", value: "Transport it only for the active objective" },
    ],
    sections: [
      {
        heading: "Why It Matters",
        paragraphs: [
          "The Master Battery is not ordinary vehicle fuel. It belongs to the opening progression chain, so read the active objective and place it in the facility that is asking for power.",
        ],
      },
      {
        heading: "Safe Handling",
        bullets: [
          "Do not bury it in general storage with batteries and circuit boards.",
          "Clear the facility entrance before carrying it through a hostile area.",
          "If an objective does not react, confirm the target and current game patch before moving other progression items.",
        ],
      },
    ],
    relatedSlugs: ["circuit-board", "lift", "component-kit"],
    seo: {
      title: "Scrap Mechanic Master Battery - Uses and Guide",
      description:
        "Learn what the Master Battery powers and how to handle this early progression item in Scrap Mechanic Survival. Review its role before committing materials.",
      keywords: ["Scrap Mechanic Master Battery", "Scrap Mechanic station power", "Scrap Mechanic quest item"],
    },
  },
  {
    slug: "soil-bag",
    category: "items",
    name: "Soil Bag",
    description:
      "A placeable farming item that creates a crop plot on suitable ground.",
    image: "/images/wiki/soil-bag.webp",
    imageAlt: "soil bag image from Scrap Mechanic",
    gameVersion: "1.0",
    lastTested: "July 2026",
    facts: [
      { label: "Type", value: "Farming item" },
      { label: "Creates", value: "One plantable soil plot" },
      { label: "Plan around", value: "Water access and raid approach" },
    ],
    sections: [
      {
        heading: "Choose the Plot Before Placing It",
        paragraphs: [
          "Soil placement defines the shape of the future farm. Leave room for walking, watering equipment, crop collection, and a defended approach instead of filling every available tile.",
        ],
      },
      {
        heading: "Starter Farm Layout",
        bullets: [
          "Keep the first plot close enough to water manually.",
          "Use straight rows if a Vacuum Pump or watering arm will be added later.",
          "Store spare seeds away from the planted crop line.",
        ],
      },
    ],
    relatedSlugs: ["water-bucket", "tomato", "vacuum-pump"],
    seo: {
      title: "Scrap Mechanic Soil Bag and Farm Plots - Uses and Guide",
      description:
        "Place Soil Bags for practical crop rows, manual watering, automation, and defensible farms in Scrap Mechanic. Check the related systems first.",
      keywords: ["Scrap Mechanic Soil Bag", "Scrap Mechanic farm plot", "Scrap Mechanic farming layout"],
    },
  },
  {
    slug: "gasoline",
    category: "items",
    name: "Gasoline",
    description:
      "Consumable fuel for gas-powered movement and machinery, including gas engines and thrusters.",
    image: "/images/wiki/gasoline.webp",
    imageAlt: "gasoline image from Scrap Mechanic",
    gameVersion: "1.0",
    lastTested: "July 2026",
    facts: [
      { label: "Type", value: "Consumable fuel" },
      { label: "Powers", value: "Gas Engines and Thrusters" },
      { label: "Best reserve", value: "Base stock plus return-trip fuel" },
    ],
    sections: [
      {
        heading: "Fuel Is a Route Limit",
        paragraphs: [
          "A vehicle that can reach a landmark but cannot return is not ready for the trip. Load fuel according to the complete route, terrain, cargo weight, and time spent recovering from mistakes.",
        ],
      },
      {
        heading: "Use It Efficiently",
        bullets: [
          "Reduce unnecessary engine power on light road vehicles.",
          "Keep an emergency reserve outside the vehicle fuel container.",
          "Avoid testing unstable prototypes with the entire base supply loaded.",
        ],
      },
    ],
    relatedSlugs: ["gas-engine", "thruster", "battery"],
    seo: {
      title: "Scrap Mechanic Gasoline and Vehicle Fuel",
      description:
        "Manage Gasoline for engines, thrusters, long routes, and reliable return trips in Scrap Mechanic Survival. Compare the practical requirements in-game.",
      keywords: ["Scrap Mechanic Gasoline", "Scrap Mechanic fuel", "Scrap Mechanic gas engine"],
    },
  },
  {
    slug: "battery",
    category: "items",
    name: "Battery",
    description:
      "Consumable power used by electrical parts and electric vehicle systems.",
    image: "/images/wiki/battery.webp",
    imageAlt: "battery image from Scrap Mechanic",
    gameVersion: "1.0",
    lastTested: "July 2026",
    facts: [
      { label: "Type", value: "Consumable power" },
      { label: "Powers", value: "Electric systems" },
      { label: "Not the same as", value: "Master Battery" },
    ],
    sections: [
      {
        heading: "Plan the Whole Electrical System",
        paragraphs: [
          "Battery demand depends on how often a machine runs and how much work it performs. Test the build with a small supply, then size storage for the actual job instead of filling every container.",
        ],
      },
      {
        heading: "Storage Habit",
        bullets: [
          "Separate normal Batteries from story-related power items.",
          "Keep a reserve for recovery tools and essential transport.",
          "Label electrical storage near the machine that consumes it.",
        ],
      },
    ],
    relatedSlugs: ["electric-engine", "master-battery", "circuit-board"],
    seo: {
      title: "Scrap Mechanic Battery Power - Uses and Guide",
      description:
        "Use and store Scrap Mechanic Batteries for electric engines and powered systems while keeping them separate from the Master Battery during Survival trips.",
      keywords: ["Scrap Mechanic Battery", "Scrap Mechanic electric engine", "Scrap Mechanic power"],
    },
  },
  {
    slug: "paint-ammo",
    category: "items",
    name: "Paint Ammo",
    description:
      "Consumable color supply used by the Paint Tool in Survival.",
    image: "/images/wiki/paint-ammo.webp",
    imageAlt: "paint ammo image from Scrap Mechanic",
    gameVersion: "1.0",
    lastTested: "July 2026",
    facts: [
      { label: "Type", value: "Tool consumable" },
      { label: "Used by", value: "Paint Tool" },
      { label: "Practical value", value: "Labels, signals, and color sensors" },
    ],
    sections: [
      {
        heading: "Color Can Be Functional",
        paragraphs: [
          "Paint is useful for more than decoration. Use consistent colors for fuel, water, controls, moving hazards, and connection groups so a complex build can be understood at a glance.",
        ],
      },
      {
        heading: "Spend It Where It Helps",
        bullets: [
          "Mark switches and matching machine sections.",
          "Create high-contrast edges around moving parts.",
          "Reserve exact sensor colors for logic projects that depend on them.",
        ],
      },
    ],
    relatedSlugs: ["paint-tool", "sensor", "logic-gate"],
    seo: {
      title: "Scrap Mechanic Paint Ammo - Uses and Crafting Guide",
      description:
        "Use Paint Ammo for build labels, safety markings, decoration, and color-sensor systems in Scrap Mechanic Survival. Confirm its current role.",
      keywords: ["Scrap Mechanic Paint Ammo", "Scrap Mechanic Paint Tool", "Scrap Mechanic colors"],
    },
  },
  {
    slug: "fertilizer",
    category: "items",
    name: "Fertilizer",
    description:
      "A farming consumable that accelerates crop growth and can be applied by hand or through farm machinery.",
    image: "/images/wiki/fertilizer.webp",
    imageAlt: "fertilizer image from Scrap Mechanic",
    gameVersion: "1.0",
    lastTested: "July 2026",
    facts: [
      { label: "Type", value: "Farming consumable" },
      { label: "Effect", value: "Faster crop growth" },
      { label: "Automation", value: "Can be delivered through a Vacuum Pump system" },
    ],
    sections: [
      {
        heading: "Use It to Shorten Exposure",
        paragraphs: [
          "Fertilizer is most valuable when a crop has a reason to finish sooner: a planned delivery, limited play time, or a farm that should not remain active longer than necessary.",
        ],
      },
      {
        heading: "Avoid Waste",
        bullets: [
          "Confirm the row is planted and watered before applying it.",
          "Test an automated dispenser on one plot before filling its container.",
          "Do not expand a field only because fertilizer is available.",
        ],
      },
    ],
    relatedSlugs: ["soil-bag", "vacuum-pump", "tomato"],
    seo: {
      title: "Scrap Mechanic Fertilizer - Uses and Guide",
      description:
        "Apply Fertilizer efficiently by hand or with farm automation to shorten crop growth in Scrap Mechanic. Compare the practical requirements in-game.",
      keywords: ["Scrap Mechanic Fertilizer", "Scrap Mechanic crop growth", "Scrap Mechanic farm automation"],
    },
  },
  {
    slug: "glowstick",
    category: "items",
    name: "Glowstick",
    description:
      "A throwable light source for caves, dark structures, and temporary route marking.",
    image: "/images/wiki/glowstick.webp",
    imageAlt: "glowstick image from Scrap Mechanic",
    gameVersion: "1.0",
    lastTested: "July 2026",
    facts: [
      { label: "Type", value: "Throwable consumable" },
      { label: "Used for", value: "Temporary light and route marking" },
      { label: "Best locations", value: "Mines, Warehouses, and dark ruins" },
    ],
    sections: [
      {
        heading: "Mark Decisions, Not Every Meter",
        paragraphs: [
          "A Glowstick is most useful at junctions, drops, and cleared entrances. Scattering them everywhere makes the route harder to read and consumes the supply before the return journey.",
        ],
      },
      {
        heading: "Exploration Pattern",
        bullets: [
          "Use one side or color convention consistently.",
          "Mark the exit side of a room after it is cleared.",
          "Keep part of the stack unused for the return trip.",
        ],
      },
    ],
    relatedSlugs: ["spudgun", "sledgehammer", "component-kit"],
    seo: {
      title: "Scrap Mechanic Glowstick - Uses and Guide",
      description:
        "Use Glowsticks for temporary lighting and readable routes through mines, Warehouses, and ruins in Scrap Mechanic. Review its role before committing materials.",
      keywords: ["Scrap Mechanic Glowstick", "Scrap Mechanic cave light", "Scrap Mechanic exploration"],
    },
  },
];
