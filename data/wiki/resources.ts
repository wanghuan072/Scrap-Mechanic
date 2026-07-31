import type { WikiEntry } from "@/data/types";

export const resourceEntries: WikiEntry[] = [
  {
    slug: "component-kit",
    category: "resources",
    name: "Component Kit",
    description:
      "A valuable upgrade material used to improve interactive parts and crafting stations in Survival.",
    image: "/images/wiki/component-kit.webp",
    imageAlt: "component kit image from Scrap Mechanic",
    gameVersion: "1.0",
    lastTested: "July 2026",
    featured: true,
    facts: [
      { label: "Type", value: "Upgrade resource" },
      { label: "Used for", value: "Part and station upgrades" },
      { label: "Planning rule", value: "Upgrade around the next build goal" },
    ],
    sections: [
      {
        heading: "Spend for a Purpose",
        paragraphs: [
          "Component Kits are easiest to waste when every available upgrade looks useful. Decide what the next vehicle, farm, or production step needs, then spend only on the parts that remove that bottleneck.",
        ],
      },
      {
        heading: "Good Priorities",
        bullets: [
          "Unlock the production capacity required by the next confirmed recipe.",
          "Improve a critical engine, seat, Controller, or other part only when the build needs it.",
          "Keep a reserve for repairs and an unexpected progression requirement.",
        ],
      },
    ],
    relatedSlugs: ["controller", "circuit-board", "schematic-box"],
    seo: {
      title: "Scrap Mechanic Component Kit - Uses and Guide",
      description:
        "Plan Component Kit spending for upgrades, crafting stations, vehicles, and Survival progression in Scrap Mechanic. Review its role before committing materials.",
      keywords: ["Scrap Mechanic Component Kit", "Scrap Mechanic upgrades", "Scrap Mechanic resources"],
    },
  },
  {
    slug: "scrap-metal",
    category: "resources",
    name: "Scrap Metal",
    description:
      "An early Survival material recovered from defeated Haybots and refined for basic construction.",
    image: "/images/wiki/scrap-metal.webp",
    imageAlt: "scrap metal image from Scrap Mechanic",
    gameVersion: "1.0",
    lastTested: "July 2026",
    facts: [
      { label: "Type", value: "Early building resource" },
      { label: "How to get it", value: "Haybot scrap" },
      { label: "Used for", value: "Starter construction and progression" },
    ],
    sections: [
      {
        heading: "Early Metal Route",
        paragraphs: [
          "Haybots leave scrap that can be refined into useful early material. A short route through nearby ruins can support the first vehicle, but fighting several bots at once is riskier than returning for a second trip.",
        ],
      },
      {
        heading: "Collect Without Losing the Run",
        bullets: [
          "Listen before entering a ruin and pull one bot into open space.",
          "Refine only when the area is safe.",
          "Bring recovered material home before exploring farther.",
        ],
      },
    ],
    relatedSlugs: ["haybot", "structural-blocks", "water-bucket"],
    seo: {
      title: "Scrap Mechanic Scrap Metal - Uses and Guide",
      description:
        "Find and manage Scrap Metal for early vehicles, construction, and Survival progression in Scrap Mechanic. Compare the practical requirements in-game.",
      keywords: ["Scrap Mechanic Scrap Metal", "Scrap Mechanic Haybot scrap", "Scrap Mechanic early metal"],
    },
  },
  {
    slug: "wood",
    category: "resources",
    name: "Wood",
    description:
      "A core building resource gathered from trees and processed into practical construction material.",
    image: "/images/wiki/wood.webp",
    imageAlt: "wood image from Scrap Mechanic",
    gameVersion: "1.0",
    lastTested: "July 2026",
    facts: [
      { label: "Gathered from", value: "Trees and wooden resource objects" },
      { label: "Used for", value: "Blocks, parts, and general construction" },
      { label: "Collection need", value: "Cutting, transport, and refinement" },
    ],
    sections: [
      {
        heading: "Collection Is a Vehicle Problem",
        paragraphs: [
          "A good wood run keeps cutting equipment, loose resource objects, refinement, and cargo from interfering with one another. Start with a compact collector before building a huge forestry machine.",
        ],
        bullets: [
          "Clear the fall direction before cutting near the vehicle.",
          "Keep the driver protected from moving logs.",
          "Unload before the extra mass ruins steering.",
        ],
      },
    ],
    relatedSlugs: ["wood-blocks", "vacuum-pump", "large-chest"],
    seo: {
      title: "Scrap Mechanic Wood Gathering - Uses and Guide",
      description:
        "Gather, transport, refine, and store Wood efficiently for Scrap Mechanic building projects. Check its connected uses before the next Survival run.",
      keywords: ["Scrap Mechanic Wood", "Scrap Mechanic tree cutting", "Scrap Mechanic resource vehicle"],
    },
  },
  {
    slug: "stone",
    category: "resources",
    name: "Stone",
    description:
      "A heavy raw resource gathered from rock formations and refined for construction and crafting.",
    image: "/images/wiki/stone.webp",
    imageAlt: "stone image from Scrap Mechanic",
    gameVersion: "1.0",
    lastTested: "July 2026",
    facts: [
      { label: "Gathered from", value: "Mineable rock formations" },
      { label: "Used for", value: "Construction and crafting" },
      { label: "Transport issue", value: "Heavy, awkward resource objects" },
    ],
    sections: [
      {
        heading: "Stability Comes Before Throughput",
        paragraphs: [
          "Stone collection puts uneven loads and impacts into a vehicle. A slow machine with a wide stance and protected controls usually completes more trips than a powerful drill mounted on a narrow chassis.",
        ],
        bullets: [
          "Lower the tool into the rock instead of driving the whole vehicle into it.",
          "Separate collection from refinement if the first design becomes unstable.",
          "Test the return route under full load.",
        ],
      },
    ],
    relatedSlugs: ["piston", "suspension", "concrete-blocks"],
    seo: {
      title: "Scrap Mechanic Stone Mining - Uses and Guide",
      description:
        "Mine and transport Stone with a stable vehicle, controlled tool head, and safe return route in Scrap Mechanic. Check the related systems first.",
      keywords: ["Scrap Mechanic Stone", "Scrap Mechanic mining", "Scrap Mechanic rock resource"],
    },
  },
  {
    slug: "metal",
    category: "resources",
    name: "Metal",
    description:
      "A fundamental refined resource for stronger blocks, interactive parts, tools, and durable machines.",
    image: "/images/wiki/metal.webp",
    imageAlt: "metal image from Scrap Mechanic",
    gameVersion: "1.0",
    lastTested: "July 2026",
    facts: [
      { label: "Role", value: "Core refined building resource" },
      { label: "Used for", value: "Parts, machines, and stronger blocks" },
      { label: "Planning rule", value: "Reserve it for the proven design" },
    ],
    sections: [
      {
        heading: "Prototype Before Spending",
        paragraphs: [
          "Metal becomes expensive when every failed frame is built at final strength. Validate size and movement with cheaper material, then rebuild the load-bearing sections that need durability.",
        ],
        bullets: [
          "Keep a reserve for bearings, engines, and repairs.",
          "Do not convert every resource before checking current recipes.",
          "Store refined Metal separately from Scrap Metal.",
        ],
      },
    ],
    relatedSlugs: ["scrap-metal", "metal-blocks", "component-kit"],
    seo: {
      title: "Scrap Mechanic Metal Resource - Uses and Guide",
      description:
        "Manage refined Metal for durable parts, stronger blocks, repairs, and efficient Scrap Mechanic construction. Check the related systems first.",
      keywords: ["Scrap Mechanic Metal", "Scrap Mechanic refined metal", "Scrap Mechanic crafting resource"],
    },
  },
  {
    slug: "chemicals",
    category: "resources",
    name: "Chemicals",
    description:
      "A fluid crafting resource collected for material production and recipes that use chemical components.",
    image: "/images/wiki/chemicals.webp",
    imageAlt: "chemicals image from Scrap Mechanic",
    gameVersion: "1.0",
    lastTested: "July 2026",
    facts: [
      { label: "Type", value: "Consumable crafting resource" },
      { label: "Landmark", value: "Chemical Lake" },
      { label: "Logistics", value: "Collection, containment, and storage" },
    ],
    sections: [
      {
        heading: "Collect for a Recipe Plan",
        paragraphs: [
          "Chemical collection is easier to manage when the destination is known. Check the intended recipes, size the container for that batch, and avoid leaving an experimental collection machine loaded indefinitely.",
        ],
        bullets: [
          "Build a stable shoreline approach.",
          "Keep collection controls reachable from safe ground.",
          "Label chemical storage away from water and fuel.",
        ],
      },
    ],
    relatedSlugs: ["vacuum-pump", "large-chest", "paint-ammo"],
    seo: {
      title: "Scrap Mechanic Chemicals - Uses and Guide",
      description:
        "Collect and store Chemicals safely for planned crafting batches and material production in Scrap Mechanic. Compare the practical requirements in-game.",
      keywords: ["Scrap Mechanic Chemicals", "Scrap Mechanic Chemical Lake", "Scrap Mechanic resource collection"],
    },
  },
  {
    slug: "oil",
    category: "resources",
    name: "Oil",
    description:
      "A collected Survival resource used in crafting chains connected to fuel and industrial production.",
    image: "/images/wiki/oil.webp",
    imageAlt: "oil image from Scrap Mechanic",
    gameVersion: "1.0",
    lastTested: "July 2026",
    facts: [
      { label: "Type", value: "Collected crafting resource" },
      { label: "Used for", value: "Fuel-related and industrial recipes" },
      { label: "Best trip", value: "Dedicated collection run" },
    ],
    sections: [
      {
        heading: "Separate Gathering from General Exploration",
        paragraphs: [
          "A dedicated collection trip carries the correct container and has space for the result. Mixing it with a long loot run often leaves the mechanic choosing between important cargo.",
        ],
        bullets: [
          "Check the current recipe requirement before leaving.",
          "Use a vehicle that can recover from shoreline terrain.",
          "Return with a useful batch instead of filling every slot.",
        ],
      },
    ],
    relatedSlugs: ["gasoline", "vacuum-pump", "large-chest"],
    seo: {
      title: "Scrap Mechanic Oil - Collection and Crafting Guide",
      description:
        "Plan Oil collection trips, storage, and fuel-related crafting in Scrap Mechanic Survival. Check its connected uses before the next Survival run.",
      keywords: ["Scrap Mechanic Oil", "Scrap Mechanic fuel crafting", "Scrap Mechanic resource guide"],
    },
  },
  {
    slug: "cotton",
    category: "resources",
    name: "Cotton",
    description:
      "A harvestable natural resource used in crafting and garment-related progression.",
    image: "/images/wiki/cotton.webp",
    imageAlt: "cotton image from Scrap Mechanic",
    gameVersion: "1.0",
    lastTested: "July 2026",
    facts: [
      { label: "Type", value: "Natural harvestable resource" },
      { label: "Used for", value: "Crafting and garment-related needs" },
      { label: "Also exists as", value: "A plantable crop" },
    ],
    sections: [
      {
        heading: "Keep Natural and Farmed Supply Organized",
        paragraphs: [
          "Cotton can enter the base from exploration or farming. Store it near the recipes that consume it and avoid using every seed if the farm is meant to provide a repeatable supply.",
        ],
        bullets: [
          "Harvest natural Cotton when it fits the current route.",
          "Keep planting stock separate from crafting stock.",
          "Add a dedicated crop row only when demand is repeatable.",
        ],
      },
    ],
    relatedSlugs: ["cotton-crop", "soil-bag", "crafting-bots"],
    seo: {
      title: "Scrap Mechanic Cotton Resource - Uses and Guide",
      description:
        "Gather and organize Cotton from exploration or farming for Scrap Mechanic crafting and garment needs. Compare the practical requirements in-game.",
      keywords: ["Scrap Mechanic Cotton", "Scrap Mechanic cotton plant", "Scrap Mechanic garment crafting"],
    },
  },
];
