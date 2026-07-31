import type { WikiEntry } from "@/data/types";
import { farmbotBreakChances, haybotBreakChances } from "@/data/reference/combatStats";

export const blockEntries: WikiEntry[] = [
  {
    slug: "structural-blocks",
    category: "blocks",
    name: "Structural Blocks",
    description:
      "Building materials where durability is a bot break-chance tier—not a hit-point bar. Metal Block 3 is the practical raid shell; scrap wood is for prototypes.",
    image: "/images/wiki/structural-blocks.webp",
    imageAlt: "structural blocks image from Scrap Mechanic",
    gameVersion: "1.0",
    lastTested: "July 2026",
    featured: true,
    facts: [
      { label: "Durability model", value: "Break probability by quality level" },
      { label: "Haybot vs dur 8+", value: "Cannot break" },
      { label: "Farmbot vs low dur", value: "Can destroy by walking over" },
      { label: "Practical ceiling", value: "Metal Block 3 for contact faces" },
      { label: "Second tier", value: "Concrete Block 3 (heavy, high durability)" },
      { label: "Prototype material", value: "Scrap Wood / Scrap Metal" },
    ],
    tables: [haybotBreakChances, farmbotBreakChances],
    sections: [
      {
        heading: "Durability Is Chance, Not HP",
        paragraphs: [
          "When a bot hits a block, the game rolls against that block’s durability level. Soft materials fail often; high tiers almost never. That is why a thin scrap-wood “armor” wall fails on raid night even if it “looked thick.”",
        ],
      },
      {
        heading: "Put Expensive Material Only on Contact Faces",
        paragraphs: [
          "A vehicle or farm killbox should use Metal-tier blocks on the first impact surface and cheaper structure behind it. Armoring every decorative panel with Metal 3 wastes weight and Component Kit crafting time.",
        ],
        bullets: [
          "Wheels → bearings → frame load path first.",
          "Raid approach wall second.",
          "Paint and bodywork last.",
        ],
      },
      {
        heading: "Farmbots Punish Soft Floors",
        paragraphs: [
          "Farmbot melee tables show 100% break chance on durability 1–3 and still threaten mid tiers. Do not let a Farmbot path across scrap-wood decking that holds your Craftbot or ammo chests.",
        ],
      },
      {
        heading: "Prototype Cheap, Reinforce Proven Paths",
        paragraphs: [
          "Validate steering and tool mounts in scrap wood, then replace only the load paths that survived testing. That keeps early Survival mobile without committing Metal 3 to a bad chassis.",
        ],
      },
    ],
    relatedSlugs: ["metal-blocks", "concrete-blocks", "scrap-wood-block", "farmbot", "haybot"],
    seo: {
      title: "Scrap Mechanic Blocks — Durability vs Haybot/Farmbot",
      description:
        "How Scrap Mechanic block durability works as break chance, with Haybot/Farmbot tables and when to use Metal Block 3 versus scrap wood. Verify it in-game.",
      keywords: [
        "Scrap Mechanic block durability",
        "Scrap Mechanic Metal Block 3",
        "Scrap Mechanic farm defense blocks",
      ],
    },
  },
  {
    slug: "scrap-wood-block",
    category: "blocks",
    name: "Scrap Wood Block",
    description:
      "An accessible early building block for prototypes, temporary structures, and the first vehicle frame.",
    image: "/images/wiki/scrap-wood-block.webp",
    imageAlt: "scrap wood block image from Scrap Mechanic",
    gameVersion: "1.0",
    lastTested: "July 2026",
    facts: [
      { label: "Role", value: "Early structure" },
      { label: "Best use", value: "Prototypes and replaceable frames" },
      { label: "Avoid", value: "Treating it as permanent armor" },
    ],
    sections: [
      {
        heading: "Build Cheap, Test Early",
        paragraphs: [
          "Scrap Wood is ideal when the shape is still changing. Use it to validate wheel spacing, steering clearance, and storage position, then reinforce only the parts that have proved useful.",
        ],
        bullets: [
          "Keep moving joints visible during the first test.",
          "Replace exposed load paths before entering heavy combat.",
          "Recover unused blocks instead of abandoning old prototypes.",
        ],
      },
    ],
    relatedSlugs: ["scrap-metal-block", "bearing", "lift"],
    seo: {
      title: "Scrap Mechanic Scrap Wood Block - Uses and Guide",
      description:
        "In Scrap Mechanic, use Scrap Wood Blocks for low-cost prototypes, starter vehicles, and temporary Survival structures. Verify the current role in-game.",
      keywords: ["Scrap Mechanic Scrap Wood Block", "Scrap Mechanic starter blocks", "Scrap Mechanic prototype"],
    },
  },
  {
    slug: "scrap-metal-block",
    category: "blocks",
    name: "Scrap Metal Block",
    description:
      "An early metal building block suited to stronger frames and protected machine sections.",
    image: "/images/wiki/scrap-metal-block.webp",
    imageAlt: "scrap metal block image from Scrap Mechanic",
    gameVersion: "1.0",
    lastTested: "July 2026",
    facts: [
      { label: "Role", value: "Early reinforced structure" },
      { label: "Use for", value: "Frames, guards, and mounts" },
      { label: "Tradeoff", value: "More weight than light materials" },
    ],
    sections: [
      {
        heading: "Reinforce the Load Path",
        paragraphs: [
          "A full metal shell is not automatically a good vehicle. Put stronger material between wheels, suspension mounts, storage, and tools, while leaving non-critical panels light.",
        ],
        bullets: [
          "Protect bearings without blocking their motion.",
          "Keep the roof lighter than the chassis.",
          "Test steering again after every major weight increase.",
        ],
      },
    ],
    relatedSlugs: ["scrap-metal", "structural-blocks", "suspension"],
    seo: {
      title: "Scrap Mechanic Scrap Metal Block - Uses and Guide",
      description:
        "Use Scrap Metal Blocks for reinforced frames, protected mounts, and balanced vehicle construction in Scrap Mechanic. Confirm its current role.",
      keywords: ["Scrap Mechanic Scrap Metal Block", "Scrap Mechanic metal frame", "Scrap Mechanic vehicle armor"],
    },
  },
  {
    slug: "wood-blocks",
    category: "blocks",
    name: "Wood Blocks",
    description:
      "General-purpose building materials available in multiple qualities for frames, walls, floors, and visual structure.",
    image: "/images/wiki/wood-blocks.webp",
    imageAlt: "wood blocks image from Scrap Mechanic",
    gameVersion: "1.0",
    lastTested: "July 2026",
    facts: [
      { label: "Family", value: "Wood Block 1, 2, and 3" },
      { label: "Use for", value: "General construction" },
      { label: "Design strength", value: "Easy visual separation from metal systems" },
    ],
    sections: [
      {
        heading: "Use Material Families Deliberately",
        paragraphs: [
          "Wood is useful when a build needs readable floors, walls, and non-mechanical sections. Higher-quality material should protect the areas that actually receive force rather than every decorative surface.",
        ],
        bullets: [
          "Separate living or storage areas from mechanical bays with color and material.",
          "Keep engine and bearing mounts easy to inspect.",
          "Upgrade the vulnerable edge first, not the entire build at once.",
        ],
      },
    ],
    relatedSlugs: ["metal-blocks", "concrete-blocks", "paint-tool"],
    seo: {
      title: "Scrap Mechanic Wood Blocks - Uses and Guide",
      description:
        "Plan Wood Block use across frames, floors, walls, and readable base layouts in Scrap Mechanic. Check its connected uses before the next Survival run.",
      keywords: ["Scrap Mechanic Wood Blocks", "Scrap Mechanic Wood 1 2 3", "Scrap Mechanic base building"],
    },
  },
  {
    slug: "metal-blocks",
    category: "blocks",
    name: "Metal Blocks",
    description:
      "A family of stronger building blocks for durable frames, machine protection, and high-load structures.",
    image: "/images/wiki/metal-blocks.webp",
    imageAlt: "metal blocks image from Scrap Mechanic",
    gameVersion: "1.0",
    lastTested: "July 2026",
    facts: [
      { label: "Family", value: "Metal Block 1, 2, and 3" },
      { label: "Use for", value: "Durable frames and protection" },
      { label: "Vehicle concern", value: "Weight distribution" },
    ],
    sections: [
      {
        heading: "Durability Needs a Chassis Plan",
        paragraphs: [
          "Metal makes sense around collision points, tool mounts, and high-value controls. On a vehicle, uncontrolled metal weight raises fuel demand and makes recovery harder.",
        ],
        bullets: [
          "Keep mass low and between the axles.",
          "Do not encase serviceable parts behind permanent layers.",
          "Use lighter material for wide decorative panels.",
        ],
      },
    ],
    relatedSlugs: ["scrap-metal", "gas-engine", "suspension"],
    seo: {
      title: "Scrap Mechanic Metal Blocks - Uses and Guide",
      description:
        "Use Metal Blocks for durable frames and protected machinery while controlling vehicle weight in Scrap Mechanic. Check the related systems first.",
      keywords: ["Scrap Mechanic Metal Blocks", "Scrap Mechanic Metal 1 2 3", "Scrap Mechanic durable block"],
    },
  },
  {
    slug: "concrete-blocks",
    category: "blocks",
    name: "Concrete Blocks",
    description:
      "Heavy construction blocks suited to stationary defenses, foundations, and structures that benefit from mass.",
    image: "/images/wiki/concrete-blocks.webp",
    imageAlt: "concrete blocks image from Scrap Mechanic",
    gameVersion: "1.0",
    lastTested: "July 2026",
    facts: [
      { label: "Family", value: "Concrete Block 1, 2, and 3" },
      { label: "Best use", value: "Stationary foundations and barriers" },
      { label: "Vehicle concern", value: "High mass" },
    ],
    sections: [
      {
        heading: "Mass Is Useful When It Has a Job",
        paragraphs: [
          "Concrete can stabilize a fixed structure and make barriers harder to push around. The same weight can make a mobile creation slow, unstable, and costly to recover.",
        ],
        bullets: [
          "Anchor defenses to a coherent foundation.",
          "Leave paths for repair and crop access.",
          "Use a lighter vehicle to service a heavy base.",
        ],
      },
    ],
    relatedSlugs: ["logic-gate", "structural-blocks", "farmbot"],
    seo: {
      title: "Scrap Mechanic Concrete Blocks - Uses and Guide",
      description:
        "In Scrap Mechanic, use Concrete Blocks for foundations, barriers, and stationary defense without overloading mobile builds. Verify the current role in-game.",
      keywords: ["Scrap Mechanic Concrete Blocks", "Scrap Mechanic base defense", "Scrap Mechanic foundation"],
    },
  },
  {
    slug: "cardboard-block",
    category: "blocks",
    name: "Cardboard Block",
    description:
      "A very light and fragile block useful for mockups, breakable targets, and mechanisms where low mass matters.",
    image: "/images/wiki/cardboard-block.webp",
    imageAlt: "cardboard block image from Scrap Mechanic",
    gameVersion: "1.0",
    lastTested: "July 2026",
    facts: [
      { label: "Role", value: "Lightweight and breakable material" },
      { label: "Good for", value: "Mockups, targets, and tests" },
      { label: "Poor for", value: "Protecting important controls" },
    ],
    sections: [
      {
        heading: "Build for Failure on Purpose",
        paragraphs: [
          "Cardboard is useful when a part should be easy to remove or destroy. It is a testing material, not reliable protection for a seat, engine, storage chest, or farm wall.",
        ],
        bullets: [
          "Use it to check size before spending stronger blocks.",
          "Keep it away from the load path of a moving machine.",
          "Replace the final prototype sections that must survive impact.",
        ],
      },
    ],
    relatedSlugs: ["structural-blocks", "wood-blocks", "sledgehammer"],
    seo: {
      title: "Scrap Mechanic Cardboard Block - Uses and Guide",
      description:
        "Use Cardboard Blocks for lightweight mockups, breakable targets, and low-mass experiments in Scrap Mechanic. Check the related systems first.",
      keywords: ["Scrap Mechanic Cardboard Block", "Scrap Mechanic lightweight block", "Scrap Mechanic test build"],
    },
  },
];
