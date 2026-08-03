import { builds } from "@/lib/data/builds";
import {
  formatObjectDimensions,
  getGameObjectDetails,
} from "@/lib/game/object-details";
import { getPlayerItemImage } from "@/lib/game/player-data";
import { guides } from "@/lib/data/guides";
import { locations } from "@/lib/data/locations";
import { mods } from "@/lib/data/mods";
import { quests } from "@/lib/data/quests";
import type { ArticleEntry, ToolEntry, WikiEntry } from "@/types/content";
import { tools } from "@/lib/data/tools";
import { updates } from "@/lib/data/updates";
import { blockEntries } from "@/lib/data/wiki";
import { cropBotRoutes } from "@/lib/data/bot-guide";
import { botEntries } from "@/lib/data/wiki";
import { wikiCategories as rawWikiCategories } from "@/lib/data/wiki";
import { cropEntries } from "@/lib/data/wiki";
import { getWikiEntryAliases } from "@/lib/wiki/entry-aliases";
import { consumableRewardEntries } from "@/lib/data/wiki";
import { garmentEntries } from "@/lib/data/wiki";
import { itemEntries } from "@/lib/data/wiki";
import { interactiveRewardEntries } from "@/lib/data/wiki";
import { industrialPartEntries } from "@/lib/data/wiki";
import { partEntries } from "@/lib/data/wiki";
import { questRewardEntries } from "@/lib/data/wiki";
import { resourceEntries } from "@/lib/data/wiki";
import { schematicEntries } from "@/lib/data/wiki";
import { toolWikiEntries } from "@/lib/data/wiki";
import { miningEntries } from "@/lib/data/wiki";
import { weaponEntries } from "@/lib/data/wiki";

const wikiEntries: WikiEntry[] = [
  ...itemEntries,
  ...consumableRewardEntries,
  ...blockEntries,
  ...partEntries,
  ...industrialPartEntries,
  ...interactiveRewardEntries,
  ...toolWikiEntries,
  ...miningEntries,
  ...weaponEntries,
  ...resourceEntries,
  ...cropEntries,
  ...garmentEntries,
  ...questRewardEntries,
  ...botEntries,
  ...schematicEntries,
];

function addUniqueValues(
  current: Array<{ label: string; value: string }> | undefined,
  additions: Array<{ label: string; value: string } | undefined>,
) {
  const values = [...(current ?? [])];
  const labels = new Set(values.map((item) => item.label.toLowerCase()));

  for (const addition of additions) {
    if (!addition || labels.has(addition.label.toLowerCase())) continue;
    values.push(addition);
    labels.add(addition.label.toLowerCase());
  }

  return values;
}

function addObjectProperties(entry: WikiEntry) {
  if (entry.category === "garments" || entry.category === "bots") return entry;
  const aliases = getWikiEntryAliases(entry);
  const details = getGameObjectDetails(
    aliases.length === 1 ? aliases[0] : entry.name,
  );
  if (!details) return entry;
  const dimensions = formatObjectDimensions(details);

  return {
    ...entry,
    properties: addUniqueValues(entry.properties, [
      details.stackSize
        ? { label: "Inventory stack", value: `${details.stackSize}` }
        : undefined,
      dimensions
        ? { label: "Collision size", value: dimensions }
        : undefined,
      details.physicsMaterial
        ? { label: "Physics material", value: details.physicsMaterial }
        : undefined,
      typeof details.flammable === "boolean"
        ? { label: "Flammable", value: details.flammable ? "Yes" : "No" }
        : undefined,
      typeof details.ratings?.durability === "number"
        ? {
            label: "Object durability",
            value: `${details.ratings.durability} / 10`,
          }
        : undefined,
      typeof details.ratings?.density === "number"
        ? { label: "Density", value: `${details.ratings.density} / 10` }
        : undefined,
      typeof details.ratings?.friction === "number"
        ? { label: "Friction", value: `${details.ratings.friction} / 10` }
        : undefined,
      typeof details.ratings?.buoyancy === "number"
        ? { label: "Buoyancy", value: `${details.ratings.buoyancy} / 10` }
        : undefined,
    ]),
  };
}

function addCropBotContext(entry: WikiEntry) {
  if (entry.category !== "crops") return entry;
  const route = cropBotRoutes.find((item) => item.slug === entry.slug);
  if (!route) return entry;

  return {
    ...entry,
    facts: addUniqueValues(entry.facts, [
      { label: "Matching Seedbot", value: route.seedbot },
      { label: "Lootbot route", value: route.lootbot },
      { label: "Cookbot use", value: route.cookbot },
    ]),
    sections: [
      ...entry.sections,
      {
        heading: `${route.crop}: Which Bot Actually Matters?`,
        paragraphs: [
          `${route.seedbot} carries the matching seed type. Seedbots flee instead of attacking; damage can release matching seeds and destroying one releases an additional matching bundle. ${route.lootbot}.`,
          `Cookbot does not grow or harvest ${route.crop}. Its current use for this crop is: ${route.cookbot}. ${route.fieldPlan}`,
        ],
        bullets: [
          "Use a Vacuum Pump creation for planting or harvesting; that is a player-built machine, not an autonomous farm bot.",
          "Check the Raid Calculator before scaling the field, because crop count and crop value change the attacking wave.",
          "Keep seeds, harvest produce, and Cookbot ingredients in separate labeled containers.",
        ],
      },
    ],
    relatedSlugs: [
      ...new Set([
        ...entry.relatedSlugs,
        "seedbot",
        "lootbot",
        "crafting-bots",
      ]),
    ],
  };
}

function entryValue(
  values: Array<{ label: string; value: string }> | undefined,
  label: string,
) {
  return values?.find((item) => item.label === label)?.value;
}

function garmentSlot(name: string) {
  return (
    ["Backpack", "Gloves", "Hat", "Jacket", "Pants", "Shoes", "T-Shirt"].find(
      (slot) => name.endsWith(slot),
    ) ?? "outfit"
  );
}

function garmentSet(name: string) {
  if (name.startsWith("Duckie ")) return "Duckie";
  if (name.startsWith("Scrapper ")) return "Scrapper";
  return name;
}

function personalizeGarment(entry: WikiEntry) {
  if (entry.category !== "garments" || entry.name.startsWith("Garment Box")) {
    return entry;
  }

  const slot = garmentSlot(entry.name);
  const setName = garmentSet(entry.name);
  const unlock =
    entryValue(entry.facts, "Unlock") ?? "Complete the listed 1.0 objective.";
  const isSetPiece = setName === "Duckie" || setName === "Scrapper";
  const progressionNote =
    setName === "Scrapper"
      ? "Scrapper outfit pieces use completion-order progression across eligible jobs, so compare the completed-job count as well as the quest name."
      : "This reward has a fixed quest requirement; it does not come from a random Garment Box roll.";

  return {
    ...entry,
    description: isSetPiece
      ? `${entry.name} fills the ${slot} slot in the six-piece ${setName} outfit. ${unlock}`
      : `${entry.name} is a standalone ${slot} customization unlock. ${unlock}`,
    sections: [
      {
        heading: `${entry.name}: Set and Slot`,
        paragraphs: [
          isSetPiece
            ? `${entry.name} is the ${slot} component of the ${setName} outfit. Equip it from character customization after the reward registers; it changes appearance and provides no armor, health, or machine bonus.`
            : `${entry.name} occupies the ${slot} customization slot. It changes appearance only and does not add armor, health, or build statistics.`,
          progressionNote,
        ],
      },
      {
        heading: "Exact Unlock Check",
        paragraphs: [
          unlock,
          "No normal Craftbot recipe is listed for this wearable. Finish the objective and allow the Logbook and reward sequence to complete before opening character customization.",
        ],
      },
      {
        heading: `If the ${slot} Slot Still Looks Locked`,
        bullets: [
          `Open the ${slot} category rather than searching the placeable-parts inventory.`,
          "Confirm the completed quest on the host's Logbook in a co-op world.",
          setName === "Scrapper"
            ? "Count eligible completed jobs because Scrapper pieces can follow completion position."
            : "Do not process additional Garment Boxes; this piece follows its named objective.",
        ],
      },
    ],
  };
}

function personalizeQuestReward(entry: WikiEntry) {
  if (entry.category !== "quest-rewards") return entry;

  const entryType =
    entryValue(entry.facts, "Entry type") ?? "placeable quest reward";
  const unlock =
    entryValue(entry.facts, "Unlock") ?? "No fixed public quest is listed.";
  const dimensions =
    entryValue(entry.properties, "Dimensions") ??
    entryValue(entry.facts, "Dimensions");
  const durability =
    entryValue(entry.properties, "Durability") ??
    entryValue(entry.facts, "Durability");
  const density = entryValue(entry.properties, "Density");
  const recipeCount = entry.recipes?.length ?? 0;
  const physicalFacts = [
    dimensions ? `${dimensions} collision size` : undefined,
    durability ? `durability ${durability} / 10` : undefined,
    density ? `density ${density} / 10` : undefined,
  ].filter((item): item is string => Boolean(item));
  const typeLabel = entryType.toLowerCase();
  const roleBullets: Record<string, string[]> = {
    "vehicle detail": [
      "Mount it only after steering and suspension work with the normal vehicle load.",
      "Check the complete collision size through wheel travel and full steering lock.",
      "Keep mirrors, panels, wheels, and bumpers on removable body modules during testing.",
    ],
    "workshop furnishing": [
      "Reserve the exact floor footprint before closing walls around the furnishing.",
      "Place dense furnishings on a stationary floor or low inside a moving base.",
      "Prototype the room with cheap blocks before crafting the final reward.",
    ],
    "display decoration": [
      "Use a stable mount so the reward does not become loose cargo.",
      "Leave its full collision shape clear even when the visible model looks smaller.",
      "Keep unique displays away from saws, drills, raid lanes, and vehicle impact edges.",
    ],
    "garden decoration": [
      "Test the footprint beside paths before committing a finished garden layout.",
      "Keep moving farm arms and Vacuum Pump routes clear of the decoration.",
      "Mount it to a stable surface if the garden is part of a vehicle.",
    ],
    "interactive decoration": [
      "Test its interaction or connection before hiding it inside the finished room.",
      "Leave controls reachable after walls and trim are installed.",
      "Separate decorative wiring from safety-critical machine logic.",
    ],
  };

  const specificBullets = roleBullets[typeLabel] ?? [
    "Use the exact collision size when fitting the reward into a compact build.",
    "Test it on a temporary surface before committing expensive surrounding material.",
    "Keep the part accessible until its interaction and orientation are confirmed.",
  ];

  const originalFunctionalDescription = entry.description.includes(
    "is a Survival quest reward used as",
  )
    ? undefined
    : entry.description;

  return {
    ...entry,
    description:
      originalFunctionalDescription ??
      `${entry.name} is a ${typeLabel}${dimensions ? ` with a ${dimensions} collision size` : ""}. Unlock route: ${unlock}`,
    sections: [
      {
        heading: `${entry.name}: Build Data`,
        paragraphs: [
          physicalFacts.length
            ? `${entry.name} is classified as ${typeLabel} with ${physicalFacts.join(", ")}.`
            : `${entry.name} is classified as ${typeLabel}; no complete physical rating set is published for this reward.`,
          recipeCount
            ? `The unlock opens ${recipeCount} current production method${recipeCount === 1 ? "" : "s"} listed below; completing the objective is not the same as receiving unlimited finished copies.`
            : "No standard production recipe is listed, so preserve the registered reward state and test the item before building around it.",
        ],
      },
      {
        heading: "Unlock and Production",
        paragraphs: [
          unlock,
          recipeCount
            ? "Use the exact station, material quantities, and duration shown in the recipe panel after the unlock appears."
            : "This reward arrives through progression rather than a normal Craftbot production queue.",
        ],
        bullets: entry.recipes?.map(
          (recipe) =>
            `${recipe.station}: ${recipe.ingredients} (${recipe.duration}) → ${recipe.output}`,
        ),
      },
      {
        heading: `Using ${entry.name} in a Build`,
        bullets: specificBullets,
      },
    ],
  };
}

export const allWikiEntries: WikiEntry[] = wikiEntries.map((rawEntry) => {
  const entry = addObjectProperties(
    personalizeQuestReward(personalizeGarment(addCropBotContext(rawEntry))),
  );
  const itemImage = getPlayerItemImage(entry.name);
  return itemImage
    ? {
        ...entry,
        image: itemImage,
        imageAlt: `${entry.name} item icon in Scrap Mechanic`,
      }
    : entry;
});

const categoryImageNames: Record<string, string> = {
  items: "Water Bucket",
  blocks: "Scrap Metal Block",
  parts: "Bearing",
  tools: "Connect Tool",
  weapons: "Spud Gun",
  resources: "Component Kit",
  crops: "Tomato",
  garments: "Duckie Hat",
  "quest-rewards": "Anvil",
  schematics: "Schematic box",
};

export const wikiCategories = rawWikiCategories.map((category) => {
  const itemName = categoryImageNames[category.slug];
  const itemImage = itemName ? getPlayerItemImage(itemName) : undefined;
  return itemImage
    ? {
        ...category,
        image: itemImage,
        imageAlt: `${itemName} item icon in Scrap Mechanic`,
      }
    : category;
});

export const articleCollections = {
  guides,
  builds,
  updates,
} as const;

export type ArticleCollectionKey = keyof typeof articleCollections;

export function getWikiCategory(slug: string) {
  return wikiCategories.find((category) => category.slug === slug);
}

export function getWikiEntriesByCategory(category: string) {
  return allWikiEntries.filter((entry) => entry.category === category);
}

export function getWikiEntry(category: string, slug: string) {
  return allWikiEntries.find(
    (entry) => entry.category === category && entry.slug === slug,
  );
}

export function getWikiEntryBySlug(slug: string) {
  return allWikiEntries.find((entry) => entry.slug === slug);
}

const wikiNameAliases: Record<string, string> = {
  "spud gun": "spudgun",
  "mountable spud gun": "mountable spudgun",
  "clay gun": "claygun",
  "plasma drill level 1": "plasma drill",
  "plasma saw 1": "plasma saw",
  "gas engine level 1": "gas engine",
  "electric engine level 1": "electric engine",
  "thruster level 1": "thruster",
  "controller level 1": "controller",
  "piston level 1": "piston",
  "sensor level 1": "sensor",
  "driver's seat level 1": "driver's seat",
  "schematic box": "schematic box",
  "metal block level 1": "metal blocks",
  "metal block level 2": "metal blocks",
  "metal block level 3": "metal blocks",
  "metal block 1": "metal blocks",
  "metal block 2": "metal blocks",
  "metal block 3": "metal blocks",
  "wood block level 1": "wood blocks",
  "wood block level 2": "wood blocks",
  "wood block level 3": "wood blocks",
  "wood block 1": "wood blocks",
  "wood block 2": "wood blocks",
  "wood block 3": "wood blocks",
  "farm bot": "farmbot",
  "tape bot": "tapebot",
  "green totebot": "totebot",
  "seeker bot": "scannerbot",
  "glowbug": "glowb",
};

export function getWikiEntryByName(name: string) {
  const normalized = name.trim().toLowerCase();
  const target = wikiNameAliases[normalized] ?? normalized;
  return allWikiEntries.find((entry) => entry.name.toLowerCase() === target);
}

export function getQuestsForWikiEntry(category: string, slug: string) {
  const wikiHref = `/wiki/${category}/${slug}`;

  return quests.flatMap((quest) =>
    (quest.rewards ?? [])
      .filter((reward) => reward.wikiHref === wikiHref)
      .map((reward) => ({
        quest,
        reward,
      })),
  );
}

export function getArticleCollection(key: ArticleCollectionKey): ArticleEntry[] {
  return [...articleCollections[key]];
}

export function getArticle(key: ArticleCollectionKey, slug: string) {
  return articleCollections[key].find((entry) => entry.slug === slug);
}

export function getTool(slug: string): ToolEntry | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export type SearchDocument = {
  title: string;
  description: string;
  href: string;
  type: string;
  image: string;
  keywords: string[];
};

export const searchDocuments: SearchDocument[] = [
  {
    title: "All Scrap Mechanic Bots",
    description:
      "Compare hostile farm bots, neutral Seedbots and Lootbots, new Drilling Thunder enemies, crafting stations, crop routes, drops, and counters.",
    href: "/wiki/bots",
    type: "Bot field index",
    image: "/images/wiki/haybot.png",
    keywords: [
      "Scrap Mechanic bots",
      "all Scrap Mechanic bots",
      "Scrap Mechanic new bots",
      "Scrap Mechanic neutral bots",
      "Scrap Mechanic farm bots",
      "Scrap Mechanic tape bots",
      "Scrap Mechanic survival bots",
      "which bot gives crop seeds",
      "Seedbot crops",
      "Seeker Bot",
    ],
  },
  {
    title: "Scrap Mechanic Recipes",
    description:
      "Browse crafting ingredients, batch sizes, station times, and schematic requirements across 614 recipes.",
    href: "/wiki/recipes",
    type: "Crafting directory",
    image: getPlayerItemImage("Craftbot") ?? "/images/scrap-mechanic/screenshot-03.jpg",
    keywords: [
      "Scrap Mechanic recipes",
      "Craftbot recipes",
      "crafting ingredients",
      "Cookbot",
      "Refinebot",
      "Saw Table",
    ],
  },
  {
    title: "Scrap Mechanic Trader Prices",
    description:
      "Compare Farmers Hideout crate exchanges and Mining Hub Wonk prices.",
    href: "/wiki/trades",
    type: "Trading directory",
    image:
      getPlayerItemImage("Wonk Stack") ??
      "/images/scrap-mechanic/screenshot-03.jpg",
    keywords: [
      "Scrap Mechanic trader",
      "Farmers Hideout",
      "Mining Hub",
      "Wonk Stack",
      "trader prices",
    ],
  },
  ...allWikiEntries.map((entry) => ({
    title: entry.name,
    description: entry.description,
    href: `/wiki/${entry.category}/${entry.slug}`,
    type: `Wiki · ${entry.category}`,
    image: entry.image,
    keywords: [entry.name, entry.category, ...entry.seo.keywords],
  })),
  ...Object.entries(articleCollections).flatMap(([type, entries]) =>
    entries.map((entry) => ({
      title: entry.title,
      description: entry.description,
      href: type === "mods" ? `/mods#${entry.slug}` : `/${type}/${entry.slug}`,
      type: type.slice(0, 1).toUpperCase() + type.slice(1),
      image: entry.image,
      keywords: [entry.title, entry.category, ...entry.seo.keywords],
    })),
  ),
  ...quests.map((quest) => ({
    title: quest.title,
    description: quest.summary,
    href: `/wiki/quests#${quest.slug}`,
    type: quest.kind === "main" ? "Quest · Main story" : "Quest · Side quest",
    image:
      quest.kind === "main"
        ? "/images/quests/quest-main.webp"
        : "/images/quests/quest-side.webp",
    keywords: [
      quest.title,
      quest.phase,
      quest.kind,
      "Scrap Mechanic quests",
      "Scrap Mechanic 1.0",
    ],
  })),
  ...mods.map((mod) => ({
    title: mod.title,
    description: mod.summary,
    href: `/mods#${mod.slug}`,
    type: "Steam Workshop mod",
    image: mod.image,
    keywords: [
      mod.title,
      mod.bestFor,
      "Scrap Mechanic mods",
      "Scrap Mechanic Workshop",
      mod.compatibility,
    ],
  })),
  ...tools.filter((tool) => tool.status === "available").map((tool) => ({
    title: tool.name,
    description: tool.description,
    href: `/tools/${tool.slug}`,
    type: "Tool",
    image: tool.image,
    keywords: [tool.name, ...tool.seo.keywords],
  })),
  ...locations.map((location) => ({
    title: location.name,
    description: location.description,
    href: `/map#${location.slug}`,
    type: `Map · ${location.type}`,
    image: "/images/scrap-mechanic/screenshot-09.jpg",
    keywords: [location.name, location.type, ...location.keywords],
  })),
];

export function searchContent(query: string) {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .map((term) => term.trim())
    .filter(Boolean);

  if (!terms.length) return [];

  return searchDocuments
    .map((document) => {
      const haystack = [
        document.title,
        document.description,
        document.type,
        ...document.keywords,
      ]
        .join(" ")
        .toLowerCase();
      const score = terms.reduce(
        (total, term) => total + (haystack.includes(term) ? 1 : 0),
        0,
      );
      return { document, score };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.document.title.localeCompare(b.document.title))
    .map((result) => result.document);
}

export { builds, guides, locations, mods, quests, tools, updates };
