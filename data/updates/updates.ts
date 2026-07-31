import type { ArticleEntry } from "@/data/types";

export const updates: ArticleEntry[] = [
  {
    slug: "1-0-drilling-thunder",
    title: "1.0 & Drilling Thunder - What Changed",
    description:
      "The official full-release baseline for story, world changes, new bots, building parts, saves, mods, and PC requirements.",
    category: "Major Update",
    image: "/images/scrap-mechanic/trailer-1-0.jpg",
    imageAlt: "Scrap Mechanic 1.0 trailer artwork",
    gameVersion: "1.0",
    published: "2026-07-24",
    updated: "2026-07-28",
    readingTime: "8 min",
    featured: true,
    sourceUrl: "https://steamcommunity.com/games/387990/announcements/detail/684133298613520064",
    quickAnswer:
      "Scrap Mechanic left Early Access on July 24, 2026. Drilling Thunder adds the complete Survival story, Excavation Island and underground mining, Growlabs, more bots and parts, terrain shaping, schematic progression, rebalanced crafting, and a visual overhaul.",
    sections: [
      {
        heading: "The Survival Story Is Now Complete",
        paragraphs: [
          "The official announcement describes a full story from the crash through the end of the Survival journey, supported by voiced NPCs. New locations, Growlabs, reworked ruins, and random NPC encounters expand the generated world.",
        ],
      },
      {
        heading: "Excavation Island and the World Overhaul",
        paragraphs: [
          "The 1.0 world adds Excavation Island and abandoned mines built around drilling, underground discovery, and rare finds. Reworked terrain generation adds new forest roads, desert areas, bridges, ruins, weather hazards, and more readable road connections.",
        ],
      },
      {
        heading: "Building, Digging, and Combat Expanded",
        bullets: [
          "More than double the previous number of Survival bot types.",
          "A large set of new blocks, parts, and interactive parts.",
          "The Claygun for shaping terrain in Survival and Creative.",
          "Enemies that can dig, so shaped terrain is not guaranteed protection.",
          "The Cornade as an explosive option for difficult combat spaces.",
          "Steam achievements and new garments.",
          "Network responsiveness and broad performance work.",
        ],
      },
      {
        heading: "Schematics, Garage, and Builder Progression",
        bullets: [
          "The Schematicbot unlocks additional Craftbot parts during Survival progression.",
          "Builder quests give new players guided construction objectives.",
          "The Garage in Scrap City can bring supported creations into Survival.",
          "Crafting and resource collection were rebalanced to reduce repeated grind.",
          "Cookbot food now connects to the revised health and perk systems.",
        ],
      },
      {
        heading: "Raid and Quality-of-Life Changes",
        bullets: [
          "Raids were redesigned with updated scaling, behavior, interface, and newer enemies.",
          "Large Chests can collect nearby loot bubbles.",
          "Blocks can be force placed in more building situations.",
          "Engine speed can be adjusted by a single notch while driving.",
          "Water Buckets can collect water from a Water Container.",
        ],
      },
      {
        heading: "Save and Mod Decisions",
        paragraphs: [
          "Old Creative worlds can load in 1.0, but important creations should be backed up. Old Survival worlds require an older Steam branch. Some mods can work, while Parts and Custom Games mods are especially likely to need an update.",
        ],
      },
      {
        heading: "Updated PC Requirements",
        bullets: [
          "Minimum: Windows 10 64-bit, Intel Core i5-1235U, 8 GB RAM, Intel Iris Xe, DirectX 11, and 30 GB storage.",
          "Recommended: Windows 11, Intel Core i5-12500 or Ryzen 5 5600, 16 GB RAM, RTX 3060 12 GB or RX 6700 XT 12 GB, DirectX 11, and 30 GB storage.",
        ],
      },
    ],
    relatedWiki: ["schematicbot", "claygun", "red-explosive-totebot", "large-chest"],
    seo: {
      title: "Scrap Mechanic Updates - 1.0 Drilling Thunder",
      description:
        "Review the official Scrap Mechanic 1.0 Drilling Thunder changes, story, saves, mods, bots, parts, and system requirements. Confirm the live version.",
      keywords: ["Scrap Mechanic 1.0", "Scrap Mechanic Drilling Thunder", "Scrap Mechanic Chapter 2"],
    },
  },
  {
    slug: "patch-1-0-1",
    title: "Patch 1.0.1 - Schematics, Multiplayer and Crashes",
    description:
      "The first post-launch fixes for recipe unlocks, schematic behavior, multiplayer steering, achievements, and mod crashes.",
    category: "Patch Notes",
    image: "/images/scrap-mechanic/screenshot-11.jpg",
    imageAlt: "A Scrap Mechanic machine representing patch fixes",
    gameVersion: "1.0.1",
    published: "2026-07-26",
    updated: "2026-07-28",
    readingTime: "4 min",
    featured: true,
    sourceUrl: "https://steamcommunity.com/games/387990/announcements/detail/670623586021542521",
    quickAnswer:
      "Patch 1.0.1 fixed several schematic and recipe unlock issues, multiplayer steering synchronization, a handbook crash, a Pizzaburger achievement issue, and some mod crashes.",
    sections: [
      {
        heading: "Progression Fixes",
        bullets: [
          "A Schematic Box could sometimes fail to unlock anything.",
          "Already unlocked items could still show a schematic icon.",
          "Crafting recipes could fail to unlock in games with many players.",
        ],
      },
      {
        heading: "Other Official Fixes",
        bullets: [
          "Client steering angle synchronization.",
          "A crash when being knocked out while reading the handbook.",
          "The Pizzaburger achievement.",
          "Some mod-related crashes.",
          "Player name tags remaining visible after hiding the interface.",
        ],
      },
    ],
    relatedWiki: ["schematic-box", "controller"],
    seo: {
      title: "Scrap Mechanic Updates - Patch 1.0.1 - Uses and Guide",
      description:
        "Read the Scrap Mechanic 1.0.1 fixes for schematics, recipe unlocks, multiplayer steering, crashes, mods, and achievements. Confirm the live version.",
      keywords: ["Scrap Mechanic 1.0.1", "Scrap Mechanic patch notes", "Scrap Mechanic schematic fix"],
    },
  },
  {
    slug: "patch-1-0-2",
    title: "Patch 1.0.2 - Quest Progression and Mod Menu Fixes",
    description:
      "The next launch-week fixes for challenge chests, Creative and Custom Game mods, quest progression, and crashes.",
    category: "Patch Notes",
    image: "/images/scrap-mechanic/screenshot-07.jpg",
    imageAlt: "Players inside a Scrap Mechanic quest area",
    gameVersion: "1.0.2",
    published: "2026-07-27",
    updated: "2026-07-30",
    readingTime: "3 min",
    featured: true,
    sourceUrl: "https://steamcommunity.com/games/387990/announcements/detail/670623586021542714",
    quickAnswer:
      "Patch 1.0.2 restored the mods button in Creative and Custom Game menus, fixed missing challenge chest items, addressed quests that would not progress, and resolved additional crashes.",
    sections: [
      {
        heading: "Official Fix List",
        bullets: [
          "Fixed missing items from challenge chests.",
          "Restored the mods button in Creative and Custom Game mode menus.",
          "Fixed issues that could prevent certain quests from progressing.",
          "Resolved additional crash issues.",
        ],
      },
      {
        heading: "What to Do If a Quest Is Still Stuck",
        paragraphs: [
          "Update the game, restart Steam, re-read the full objective, and let the host perform the final interaction in multiplayer. Back up the save before changing branches or removing mods.",
        ],
      },
    ],
    relatedWiki: ["schematic-box", "lift"],
    seo: {
      title: "Scrap Mechanic Updates - Patch 1.0.2 - Uses and Guide",
      description:
        "Read the Scrap Mechanic 1.0.2 fixes for quest progression, challenge chests, Creative and Custom Game mods, and crashes. Confirm the live version.",
      keywords: ["Scrap Mechanic 1.0.2", "Scrap Mechanic quest fix", "Scrap Mechanic patch notes"],
    },
  },
  {
    slug: "patch-1-0-3",
    title: "Patch 1.0.3 - Raid, Vault, Underground and CPU Fixes",
    description:
      "Ten listed launch fixes and additions covering Creative commands, raids, Vault quests, underground events, Thruster UI, rendering, older CPUs, and crashes.",
    category: "Patch Notes",
    image: "/images/updates/visual-upgrade.webp",
    imageAlt: "Scrap Mechanic 1.0 dynamic lighting and world rendering",
    gameVersion: "1.0.3",
    published: "2026-07-29",
    updated: "2026-07-30",
    readingTime: "4 min",
    featured: true,
    sourceUrl: "https://steamcommunity.com/games/387990/announcements/detail/689764519146160688",
    quickAnswer:
      "Patch 1.0.3 is the current public baseline. It adds three Creative chat commands and lists nine fixes or stability changes for rendering, raids, turret-seat parts, Vault quests, underground events, the Thruster interface, older CPUs, and crashes.",
    sections: [
      {
        heading: "Creative Mode Additions",
        bullets: [
          "Added /weather for changing Creative weather.",
          "Added /timeofday for setting the time of day.",
          "Added /timeprogress for controlling time progression.",
        ],
      },
      {
        heading: "Progression and World Fixes",
        bullets: [
          "Fixed raids that could stop triggering and block harvesting.",
          "Fixed a Vault quest that could fail when its quota was completed early.",
          "Fixed valuables that could become impossible to pick up during the Vault introduction.",
          "Fixed players becoming stuck during a deep-underground event.",
        ],
      },
      {
        heading: "Building, Rendering and Stability",
        bullets: [
          "Fixed bearings, suspensions, and pistons being lost when a turret seat was removed.",
          "Fixed rendering issues in Creative and Challenge modes.",
          "Fixed Thruster interface bugs.",
          "Fixed a crash affecting older CPUs.",
          "Added miscellaneous crash and stability fixes.",
        ],
      },
      {
        heading: "What to Do After Updating",
        paragraphs: [
          "Confirm Steam has downloaded 1.0.3, restart the game, and retry the affected quest or creation from a backed-up save. A fixed engine bug does not repair an already damaged save automatically, so preserve the original before testing.",
        ],
      },
    ],
    relatedWiki: ["thruster", "bearing", "suspension", "piston"],
    seo: {
      title: "Scrap Mechanic 1.0.3 Patch Notes - Raid & Quest Fixes",
      description:
        "Read all Scrap Mechanic 1.0.3 changes for Creative commands, raids not starting, Vault quest bugs, underground events, Thruster UI, old CPUs, and crashes.",
      keywords: [
        "Scrap Mechanic 1.0.3",
        "Scrap Mechanic raids not starting",
        "Scrap Mechanic vault quest not progressing",
        "Scrap Mechanic old CPU crash",
        "Scrap Mechanic Creative commands",
      ],
    },
  },
];
