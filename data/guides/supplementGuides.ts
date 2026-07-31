import type { ArticleEntry } from "@/data/types";

export const supplementGuides: ArticleEntry[] = [
  {
    slug: "excavation-island-mining",
    title: "Excavation Island Guide - Underground Mining Loop",
    description:
      "Stage-by-stage Excavation Island loop: prospect, plasma bore, collect, crush, extract—with Minerbot vertical threat rules and potato ammo budgets.",
    category: "1.0",
    image: "/images/scrap-mechanic/screenshot-07.jpg",
    imageAlt: "Underground and industrial Scrap Mechanic exploration scene",
    gameVersion: "1.0",
    published: "2026-07-29",
    updated: "2026-07-30",
    readingTime: "12 min",
    featured: true,
    quickAnswer:
      "Prospect → Plasma Drill bore with reverse clearance → collect/crush behind the face → extract. Budget Spudgun ammo for Minerbots the way you budget Farmbots on the surface.",
    tables: [
      {
        caption: "Mining loop checklist",
        headers: ["Stage", "Tool", "Done when…"],
        rows: [
          ["Scout", "Ore Prospector", "Heading marked; escape road known"],
          ["Bore", "Plasma Drill", "Short corridor reverses cleanly"],
          ["Collect", "Ore Collector", "Material leaves the dig pocket"],
          ["Process", "Ore Crusher", "Output sits in labeled chests"],
          ["Extract", "Surface hauler", "Full load on the road, not deeper"],
        ],
      },
      {
        caption: "Loadout before the first deep bore",
        headers: ["Item", "Why"],
        rows: [
          ["Spudgun + 60+ potatoes", "Minerbot / interrupt fights"],
          ["Cookbot perk meal", "Health + travel perks"],
          ["Glowsticks / headlights", "Vertical sightlines"],
          ["Repair blocks", "Tool mount and wheel recovery"],
          ["Empty chest capacity", "Ore + rare finds"],
        ],
      },
    ],
    sections: [
      {
        heading: "Do Not Arrive Empty-Handed",
        paragraphs: [
          "Excavation Island is a progression region, not a casual sightseeing stop. Bring food with useful Cookbot perks, a Spudgun reserve, Glowsticks or vehicle lights, repair blocks, and a mining frame that can reverse without rebuilding itself underground.",
        ],
        bullets: [
          "Leave fragile cargo haulers on the surface approach.",
          "Carry a Respawn Bed only if you understand its limited uses.",
          "Confirm the surface landmark and road back before the first deep bore.",
        ],
      },
      {
        heading: "Run the Mining Loop in Order",
        steps: [
          "Use the Ore Prospector to choose a dig heading.",
          "Open a short Plasma Drill corridor and confirm reverse clearance.",
          "Clear Cablebots, Minerbots, or Drill Spawners before extending.",
          "Collect ore, process it at the Ore Crusher behind the dig face, and store output.",
          "Retreat with a full inventory instead of forcing one more tunnel.",
        ],
      },
      {
        heading: "Expect Vertical Threats",
        paragraphs: [
          "Minerbots attack from above and can crash into vehicles after being shot down. Keep ceiling sightlines, avoid parking the only engine under the flight path, and treat every new cave opening as an ambush check rather than free space.",
        ],
      },
      {
        heading: "Claygun Helps Routes, Not Absolute Defense",
        paragraphs: [
          "Shape ramps and work floors with the Claygun, but do not rely on clay walls alone. Digging enemies and spawn pressure can invalidate a terrain-only bunker. Combine shaped ground with open kite space and a working vehicle exit.",
        ],
      },
    ],
    relatedWiki: ["plasma-drill", "plasma-saw", "minerbot", "spudgun", "glowstick"],
    seo: {
      title: "Scrap Mechanic Guides - Excavation Island Mining",
      description:
        "Mine Scrap Mechanic Excavation Island with Plasma Drills, Ore Collectors, Crushers, Prospectors, and a plan for Cablebots and Minerbots. Confirm it in-game.",
      keywords: [
        "Scrap Mechanic Excavation Island",
        "Scrap Mechanic mining guide",
        "Scrap Mechanic Plasma Drill",
        "Scrap Mechanic underground",
      ],
    },
  },
  {
    slug: "get-spud-gun",
    title: "How to Get a Spud Gun in Scrap Mechanic 1.0",
    description:
      "Follow the current 1.0 quest and schematic path to unlock and craft a Spud Gun for Survival combat and Warehouse runs.",
    category: "Progression",
    image: "/images/wiki/spudgun.webp",
    imageAlt: "Spudgun weapon icon from Scrap Mechanic",
    gameVersion: "1.0",
    published: "2026-07-29",
    updated: "2026-07-29",
    readingTime: "7 min",
    featured: true,
    quickAnswer:
      "In 1.0, progress the yellow main quest through the Watchtower rebuilding chain to receive the Spud Gun schematic, unlock it through schematic progression, then craft and stock ammunition before Warehouse or Farmbot fights.",
    sections: [
      {
        heading: "Follow the Yellow Markers First",
        paragraphs: [
          "Older Early Access trading routes are not a safe substitute for the current 1.0 unlock path. Use the Logbook, complete the named main objectives, and let the Spud Gun schematic reward register before inventing a side farm just to force an old guide to work.",
        ],
        bullets: [
          "Distinguish yellow main quests from blue builder and green Farmer side work.",
          "Do not spend every Component Kit on cosmetics before the combat unlock.",
          "Confirm the schematic appears in the unlock interface after the quest reward.",
        ],
      },
      {
        heading: "Craft and Supply the Weapon",
        steps: [
          "Unlock the Spud Gun recipe through the schematic reward.",
          "Gather the current Craftbot ingredients shown in your client.",
          "Craft the gun and a first ammunition reserve.",
          "Test fire away from crops and fragile vehicles.",
          "Pack spare ammo before Warehouse, Farmbot, or Trash Bot trips.",
        ],
      },
      {
        heading: "What the Spud Gun Unlocks in Practice",
        paragraphs: [
          "Ranged pressure makes Farmbots, Tapebots, and rooftop boss fights manageable. Mountable Spudguns and later potato weapons expand base defense, but the handheld Spud Gun is the first tool that turns dangerous structures into planned expeditions instead of panic retreats.",
        ],
      },
    ],
    relatedWiki: ["spudgun", "schematicbot", "schematic-box", "farmbot", "tapebot"],
    seo: {
      title: "Scrap Mechanic Guides - How to Get a Spud Gun",
      description:
        "Unlock and craft the Scrap Mechanic 1.0 Spud Gun through the main quest schematic path, then stock ammo for Warehouse and Farmbot fights. Confirm it in-game.",
      keywords: [
        "Scrap Mechanic Spud Gun",
        "how to get Spud Gun",
        "Scrap Mechanic Spudgun unlock",
        "Scrap Mechanic 1.0 weapons",
      ],
    },
  },
  {
    slug: "beat-trash-bot",
    title: "How to Beat the Trash Bot",
    description:
      "Prepare a Warehouse rooftop fight against the Scrap Mechanic 1.0 Trash Bot with ammo, food perks, and a clean escape plan.",
    category: "Combat",
    image: "/images/scrap-mechanic/screenshot-05.jpg",
    imageAlt: "Hostile industrial Scrap Mechanic combat scene",
    gameVersion: "1.0",
    published: "2026-07-29",
    updated: "2026-07-29",
    readingTime: "8 min",
    featured: true,
    quickAnswer:
      "Clear lesser Warehouse bots first, leave cargo outside, bring Spudgun ammo plus Cookbot food perks, kite on open roof space, and extract loot only after the Trash Bot is down.",
    sections: [
      {
        heading: "Preparation Checklist",
        bullets: [
          "Spudgun with a real ammunition reserve, plus Cornades if available.",
          "Cooked food that restores health and grants useful combat perks.",
          "A parked escape vehicle outside the immediate roof fight.",
          "No valuable packing crates or rare schematics left on the approach.",
        ],
      },
      {
        heading: "Fight Sequence",
        steps: [
          "Clear Tapebots and other interior threats that can shoot into the climb.",
          "Secure the rooftop entry and identify lateral kite space.",
          "Prioritize explosive or interrupt enemies if they spawn with the boss.",
          "Keep moving; do not stand in a corner against a large bot.",
          "Recover ammo and move loot to the vehicle before exploring deeper.",
        ],
      },
      {
        heading: "Common Failures",
        paragraphs: [
          "Most failed Trash Bot runs start before the fight: overloaded cargo, empty food, or a climb that dumps the player into a Tapebot angle. Treat the roof as a prepared arena, not the last room of a loot binge.",
        ],
      },
    ],
    relatedWiki: ["farmbot", "spudgun", "cornade", "tapebot", "spud-shotgun"],
    seo: {
      title: "Scrap Mechanic Guides - How to Beat the Trash Bot",
      description:
        "Beat the Scrap Mechanic Trash Bot with Warehouse preparation, Spudgun ammo, food perks, kite space, and a clean extract. Check each step in-game.",
      keywords: [
        "Scrap Mechanic Trash Bot",
        "how to beat Trash Bot",
        "Scrap Mechanic Warehouse boss",
        "Scrap Mechanic 1.0 boss",
      ],
    },
  },
  {
    slug: "health-food-perks",
    title: "Health, Food, and Perk Guide for Scrap Mechanic 1.0",
    description:
      "Understand the 1.0 health system where food and drink restore HP and Cookbot meals grant combat and travel perks.",
    category: "Survival",
    image: "/images/scrap-mechanic/screenshot-03.jpg",
    imageAlt: "Farming and survival supplies in Scrap Mechanic",
    gameVersion: "1.0",
    published: "2026-07-29",
    updated: "2026-07-29",
    readingTime: "8 min",
    featured: true,
    quickAnswer:
      "Forget old hunger-calorie tables. In 1.0, food and drink restore health directly, and Cookbot meals grant perks such as faster movement, reduced fall damage, quicker sledge swings, or regeneration before hard fights.",
    sections: [
      {
        heading: "What Changed",
        paragraphs: [
          "Scrap Mechanic 1.0 replaces the older hunger-focused loop with a health-first system. Raw produce still matters for farming and trading, but prepared Cookbot food is now combat and expedition preparation rather than a vague calorie fill.",
        ],
        bullets: [
          "Eat to recover HP before and during dangerous routes.",
          "Cook deliberate perk meals before Warehouse, mining, or Farmbot work.",
          "Keep a travel food stack separate from seed and trade crates.",
        ],
      },
      {
        heading: "Build a Simple Food Routine",
        steps: [
          "Keep a small protected farm for reliable ingredients.",
          "Place the Cookbot beside labeled ingredient and finished-meal chests.",
          "Cook a combat meal and a travel meal before long trips.",
          "Restock after each Warehouse, mining, or raid defense session.",
        ],
      },
      {
        heading: "Perks Are Loadout",
        paragraphs: [
          "Preview coverage and player reports highlight perks such as faster movement, reduced fall damage, quicker sledgehammer swings, and health regeneration. Exact recipe names can shift with patches, so trust the live Cookbot interface and treat food as part of the loadout checklist beside ammo and fuel.",
        ],
      },
    ],
    relatedWiki: ["crafting-bots", "tomato", "potato", "water-bucket", "component-kit"],
    seo: {
      title: "Scrap Mechanic Guides - Health Food and Perks",
      description:
        "Learn the Scrap Mechanic 1.0 health system, Cookbot food restoration, and perk meals for combat and exploration. Use the checks before departure.",
      keywords: [
        "Scrap Mechanic health",
        "Scrap Mechanic food perks",
        "Scrap Mechanic Cookbot",
        "Scrap Mechanic 1.0 hunger",
      ],
    },
  },
  {
    slug: "claygun-basics",
    title: "Claygun Guide - Shape Terrain Without Trapping Yourself",
    description:
      "Use the Scrap Mechanic 1.0 Claygun for roads, ramps, and dig sites while avoiding sealed exits and false defenses.",
    category: "Building",
    image: "/images/wiki/claygun.webp",
    imageAlt: "Claygun terrain tool from Scrap Mechanic",
    gameVersion: "1.0",
    published: "2026-07-29",
    updated: "2026-07-29",
    readingTime: "7 min",
    quickAnswer:
      "Use the Claygun to flatten build pads, fix vehicle approaches, and open underground work floors in small reversible steps. Never seal your only exit, and never treat clay walls as dig-proof armor.",
    sections: [
      {
        heading: "Safe Uses",
        bullets: [
          "Flatten a pad before placing a Lift or workshop.",
          "Carve a gentle ramp for a mining or cargo vehicle.",
          "Widen a dig pocket so Cablebot fights have kite room.",
          "Repair a washed-out road edge after weather or combat damage.",
        ],
      },
      {
        heading: "Dangerous Habits",
        paragraphs: [
          "Closing a tunnel behind you, burying a vehicle axle, or building a clay bunker against digging enemies creates recovery problems faster than it solves combat. Always leave a reverse path and a second opening when reshaping underground spaces.",
        ],
        steps: [
          "Make a small change.",
          "Drive or walk the route both ways.",
          "Only then expand the shaped area.",
        ],
      },
      {
        heading: "Creative Versus Survival",
        paragraphs: [
          "Creative mode can treat the Claygun as a sculpting brush with fewer consequences. Survival should treat every clay edit as a logistics decision: fuel to return, bots that dig, and machines that need clearance.",
        ],
      },
    ],
    relatedWiki: ["claygun", "plasma-drill", "minerbot", "lift"],
    seo: {
      title: "Scrap Mechanic Guides - How to Use the Claygun",
      description:
        "Shape Scrap Mechanic terrain with the 1.0 Claygun for roads, pads, and mining routes without sealing exits or trusting clay as armor. Check each step in-game.",
      keywords: [
        "Scrap Mechanic Claygun",
        "how to use Claygun",
        "Scrap Mechanic terrain tool",
        "Scrap Mechanic terraforming",
      ],
    },
  },
  {
    slug: "creative-mode",
    title: "Creative Mode Guide - Build Freely and Bring Creations Back",
    description:
      "Use Scrap Mechanic Creative for prototypes, Garage exports, and unlimited building without Survival pressure.",
    category: "Modes",
    image: "/images/scrap-mechanic/screenshot-11.jpg",
    imageAlt: "Complex Scrap Mechanic creation suitable for Creative prototyping",
    gameVersion: "1.0",
    published: "2026-07-29",
    updated: "2026-07-29",
    readingTime: "7 min",
    quickAnswer:
      "Creative is unlimited building; Challenge Mode is the separate puzzle track (1.0.2 fixed empty challenge chests); Garage transfers supported creations into Survival. Prototype here—progress the story in Survival.",
    tables: [
      {
        caption: "Mode comparison",
        headers: ["Mode", "Resources", "Primary use", "1.0 note"],
        rows: [
          ["Survival", "Gathered / crafted", "Story, raids, mining, quests", "Full voiced campaign + Excavation Island"],
          ["Creative", "Unlimited", "Prototypes, showcases, mod tests", "Old Creative worlds can load; back up first"],
          ["Challenge", "Constrained per level", "Puzzle / objective practice", "1.0.2 restored missing challenge chest items"],
        ],
      },
    ],
    sections: [
      {
        heading: "What Creative Is For",
        bullets: [
          "Prototype vehicles, logic, and farms without raids.",
          "Practice Claygun landscaping and Lift workflows.",
          "Test mod packs safely before touching a valued Survival save.",
          "Build showcase creations with the full 1.0 part set.",
        ],
      },
      {
        heading: "Garage Bridge Into Survival",
        paragraphs: [
          "Scrap City’s Garage can bring supported creations from Creative and Survival saves into an active Survival world. Transfer disposable prototypes first. Garage is not a substitute for schematic unlocks, Component Kits, or raid-ready food.",
        ],
      },
      {
        heading: "Challenge Mode Without a Thin Separate Page",
        paragraphs: [
          "Challenge Mode sits beside Creative as constrained building practice. Use it between Survival sessions for Lift/logic drills. If a challenge chest looks empty on an old broken session, update to 1.0.2+ before filing a new report.",
        ],
      },
      {
        heading: "Achievements Ride the Live Branch",
        paragraphs: [
          "Steam Achievements arrived with 1.0. Chase them on current 1.0.x; patch 1.0.1 fixed issues such as Pizzaburger. Do not burn a valued Survival save on experimental mods while hunting unlocks—use a copy.",
        ],
      },
      {
        heading: "Save Hygiene",
        paragraphs: [
          "Back up Creative worlds before the first 1.0 save or mod experiment. Keep one disposable Creative sandbox for Workshop packs.",
        ],
      },
    ],
    relatedWiki: ["claygun", "lift", "controller", "structural-blocks"],
    seo: {
      title: "Scrap Mechanic Guides - Creative, Challenge & Garage",
      description:
        "Compare Scrap Mechanic Creative, Challenge, and Survival; Garage transfers; 1.0.2 challenge chests; and Steam Achievement branch tips. Confirm it in-game.",
      keywords: [
        "Scrap Mechanic Creative Mode",
        "Scrap Mechanic Challenge Mode",
        "Scrap Mechanic Garage",
        "Scrap Mechanic achievements",
      ],
    },
  },
  {
    slug: "controls",
    title: "Scrap Mechanic Controls Guide",
    description:
      "Default building, combat, and Survival interaction bindings—with a checklist for mode differences after 1.0.",
    category: "Basics",
    image: "/images/wiki/handbook.webp",
    imageAlt: "Scrap Mechanic Handbook tool icon",
    gameVersion: "1.0",
    published: "2026-07-29",
    updated: "2026-07-30",
    readingTime: "7 min",
    quickAnswer:
      "Left Mouse places, Right Mouse removes or aims weapons, E interacts, Connect Tool wires parts. Re-check the Handbook after updates—Survival aiming and Creative sledge behavior are not identical.",
    tables: [
      {
        caption: "Default control map (verify in Settings / Handbook)",
        headers: ["Action", "Default", "Notes"],
        rows: [
          ["Place block/part", "Left Mouse", "Build mode selection"],
          ["Remove / aim weapon", "Right Mouse", "Survival: aim Spudguns; Creative sledge block differs"],
          ["Interact", "E", "Stations, seats, chests, quest objects"],
          ["Connect parts", "Connect Tool drag", "Shows signal/bearing direction arrows"],
          ["Lift creation", "Lift tool", "Bearings locked while lifted"],
          ["Inventory / hotbar", "Number keys", "Keep food, ammo, repair one press away"],
          ["Quest / logbook", "Logbook UI", "Yellow main vs blue/green side markers"],
        ],
        note: "Bindings are rebindable. After 1.0 patches, confirm anything that “feels wrong” in the Handbook before blaming a bug.",
      },
    ],
    sections: [
      {
        heading: "Build Loop: Place → Connect → Test Off Lift",
        steps: [
          "Place a disposable frame on the Lift.",
          "Add seat, engine, bearings; Connect Tool every drive link.",
          "Remove the Lift before judging steering.",
          "Only then copy the pattern onto a real vehicle.",
        ],
      },
      {
        heading: "Survival Hotbar Discipline",
        bullets: [
          "Potato stack and Cookbot meal on reachable slots before raids.",
          "Glowstick or light source for Warehouse / mines.",
          "Repair blocks separate from decorative scrap.",
        ],
      },
      {
        heading: "Mode Differences That Break Muscle Memory",
        paragraphs: [
          "Creative sledgehammer hold-to-block behavior is not the Survival Spudgun ADS pattern. Challenge Mode (separate puzzle track; 1.0.2 fixed empty challenge chests) uses constrained parts—do not expect Survival hotkeys to solve Creative logic puzzles automatically.",
        ],
      },
    ],
    relatedWiki: ["handbook", "connect-tool", "lift", "sledgehammer", "spudgun"],
    seo: {
      title: "Scrap Mechanic Guides - Controls and Keybinds",
      description:
        "Scrap Mechanic default controls table for place, remove, aim, interact, Connect Tool, Lift, and Survival hotbar habits. Check each step in-game.",
      keywords: [
        "Scrap Mechanic controls",
        "Scrap Mechanic keybinds",
        "Scrap Mechanic hotkeys",
        "Scrap Mechanic Connect Tool",
      ],
    },
  },
  {
    slug: "warehouse-key-and-farmbot",
    title: "Warehouse Key and Farmbot Route",
    description:
      "Connect Spudgun unlocks, Farmbot fights, Warehouse preparation, and key progression into one current 1.0 combat route.",
    category: "Progression",
    image: "/images/scrap-mechanic/screenshot-05.jpg",
    imageAlt: "Dangerous Scrap Mechanic structure exploration",
    gameVersion: "1.0",
    published: "2026-07-29",
    updated: "2026-07-29",
    readingTime: "9 min",
    quickAnswer:
      "Unlock a Spudgun, prepare food perks and ammo, defeat or carefully engage Farmbots when required for keys or access, then clear Warehouses with Tapebot angles and boss roofs planned in advance.",
    sections: [
      {
        heading: "Route Overview",
        steps: [
          "Secure Spudgun schematic and ammunition.",
          "Cook combat food and stage a repairable combat vehicle.",
          "Handle Farmbot encounters in open ground, not beside the hauler.",
          "Enter Warehouses room by room, clearing Tapebot angles.",
          "Prepare separately for rooftop Trash Bot pressure when present.",
        ],
      },
      {
        heading: "Farmbot Rules",
        paragraphs: [
          "Farmbots punish light vehicles and cramped fights. Create distance, use ranged fire, and never let the only storage truck become the cover wall. If a Warehouse Key or related progression depends on Farmbot work, treat that outing as a dedicated combat trip.",
        ],
      },
      {
        heading: "Warehouse Rules",
        paragraphs: [
          "Warehouses are multi-angle problems. Bring Glowsticks, ammo, and a retreat plan. Recover keys and high-value loot to the exterior vehicle before greedily opening every side room.",
        ],
      },
    ],
    relatedWiki: ["farmbot", "spudgun", "tapebot", "spud-shotgun", "glowstick"],
    seo: {
      title: "Scrap Mechanic Guides - Warehouse Key and Farmbot",
      description:
        "Plan the Scrap Mechanic 1.0 Spudgun, Farmbot, Warehouse Key, and Trash Bot combat route with ammo, food, and extract rules. Confirm it in-game.",
      keywords: [
        "Scrap Mechanic Warehouse Key",
        "Scrap Mechanic Farmbot",
        "Scrap Mechanic Warehouse guide",
        "Scrap Mechanic Spudgun route",
      ],
    },
  },
  {
    slug: "scrap-city-garage-blueprints",
    title: "Scrap City Garage Blueprint Guide",
    description:
      "Load a saved creation, calculate its exact material bill, fill the connected Garage Chest, and assemble it in Survival without guessing why the build button is blocked.",
    category: "Building",
    image: "/images/scrap-mechanic/screenshot-02.jpg",
    imageAlt: "A Scrap Mechanic creation prepared for assembly",
    gameVersion: "1.0.0.867",
    published: "2026-07-30",
    updated: "2026-07-30",
    readingTime: "11 min",
    featured: true,
    quickAnswer:
      "At the Scrap City Garage, select a valid saved creation, review its exact block-and-part cost, connect a Garage Chest, load every missing quantity, and assemble only after the material check reaches zero.",
    tables: [
      {
        caption: "Garage creation sequence",
        headers: ["Step", "Player action", "What the Garage verifies"],
        rows: [
          ["1. Select", "Choose a saved blueprint", "The creation can be read and tracked"],
          ["2. Inspect", "Open the material bill", "Every required shape and exact quantity"],
          ["3. Connect", "Use the Garage Chest", "At least one valid supply container is available"],
          ["4. Fill", "Move or auto-fill missing items", "Only shortages are transferred from inventory"],
          ["5. Assemble", "Start the build", "No invalid part, negative quantity, or missing material remains"],
          ["6. Collect", "Move the finished creation clear", "The tracked blueprint was created successfully"],
        ],
        note:
          "The Garage consumes the exact materials used by the selected creation. It does not replace locked recipes with free parts.",
      },
      {
        caption: "Garage Chest behavior",
        headers: ["Capacity rule", "Value", "Why it matters"],
        rows: [
          ["Inventory slots", "30", "Large mixed blueprints may need careful stack organization"],
          ["Maximum stack", "256", "Blocks can be staged in large quantities"],
          ["Connected inputs", "Included", "Additional linked supply containers count toward the bill"],
          ["Fill chest", "Missing quantities only", "Existing chest stock is not duplicated"],
        ],
      },
      {
        caption: "Why the Garage will not build the blueprint",
        headers: ["Symptom", "Most likely check", "Player fix"],
        rows: [
          ["No material bill", "Blueprint was not selected or cannot be read", "Load a simple unmodified test creation"],
          ["Fill chest moves nothing", "Inventory lacks the listed shortages", "Collect the exact named blocks or parts"],
          ["Materials look complete", "A connected input is missing or inaccessible", "Use the Garage Chest directly for the first test"],
          ["Assembly remains blocked", "Blueprint contains an invalid or unavailable part", "Remove the suspect modded or version-specific part"],
          ["Large build stops short", "One stack or slot is full while another material is absent", "Sort by the bill, not by total item count"],
        ],
      },
    ],
    sections: [
      {
        heading: "Creative Blueprint to Survival Creation",
        paragraphs: [
          "The Garage is the supported bridge for a creation designed in Creative or saved from another supported building context. Survival still pays for every block and part in the selected blueprint, so the transfer is a production job rather than a free spawn.",
          "Start with a small unmodded vehicle. A simple four-wheel test proves that selection, chest connection, material counting, and assembly all work before a complex Workshop creation consumes a full supply run.",
        ],
      },
      {
        heading: "Read the Bill Before Gathering",
        paragraphs: [
          "The material list is calculated from the actual shapes in the selected creation. Paint, symmetry, or visual size does not determine the cost; the included blocks and interactive parts do.",
        ],
        bullets: [
          "Remove decorative mass that does not serve the Survival job.",
          "Replace unavailable mod parts before collecting materials.",
          "Check whether the creation depends on recipes that your current world has not unlocked.",
          "Keep fuel, ammunition, and cargo outside the blueprint bill unless the creation itself requires those items.",
        ],
      },
      {
        heading: "Use Fill Chest Without Losing Track",
        steps: [
          "Empty unrelated items from the Garage Chest.",
          "Select the blueprint and record the current shortages.",
          "Carry the matching blocks and parts in the mechanic's inventory.",
          "Use Fill Chest to transfer only missing quantities.",
          "Review the bill again and load anything held in external storage.",
          "Assemble, then move the finished creation away before preparing another blueprint.",
        ],
      },
      {
        heading: "Workshop Blueprints and Version Mismatch",
        paragraphs: [
          "A Steam Workshop subscription makes a creation available to the building interface; it does not guarantee that every part exists in the current Survival world. A legacy, modded, or newer-version shape can make the Garage reject an otherwise visible blueprint.",
          "Open the creation in Creative first, remove unsupported parts, save a clean copy, and retry that copy. This isolates blueprint compatibility from a missing-material problem.",
        ],
      },
    ],
    relatedWiki: [
      "large-chest",
      "portable-craftbot",
      "component-kit",
      "metal-blocks",
      "bearing",
      "gas-engine",
    ],
    seo: {
      title: "Scrap Mechanic Garage Blueprints - Build in Survival",
      description:
        "Use the Scrap Mechanic Scrap City Garage to load blueprints, calculate materials, fill its chest, fix blocked assembly, and build creations in Survival.",
      keywords: [
        "Scrap Mechanic Garage",
        "Scrap Mechanic blueprints Survival",
        "Scrap Mechanic Workshop blueprints",
        "Scrap Mechanic Garage Chest",
        "how to build blueprints Scrap Mechanic",
      ],
    },
  },
  {
    slug: "achievements",
    title: "Scrap Mechanic Achievement Guide - All 34",
    description:
      "Plan every Steam achievement across quests, Challenges, combat, farming, Garage builds, Workshop sharing, outfits, schematics, Mining Hub tasks, and hidden interactions.",
    category: "Completion",
    image: "/images/scrap-mechanic/trailer-1-0.jpg",
    imageAlt: "Scrap Mechanic 1.0 scene used for the achievement checklist",
    gameVersion: "1.0.3",
    published: "2026-07-30",
    updated: "2026-07-31",
    readingTime: "15 min",
    featured: true,
    quickAnswer:
      "Scrap Mechanic has 34 Steam achievements. Complete the story and builder routes first, keep long counters such as 100 bot kills and 10,000 crafted blocks running in the background, then finish outfit, schematic, Garage, Workshop, Baby Woc, Hay Maze, and Mining Hub requirements.",
    tables: [
      {
        caption: "Story, quest, Challenge, and exploration achievements",
        headers: ["Achievement", "Requirement", "Efficient route"],
        rows: [
          ["My first car", "Complete builder quest: Your first car", "Follow the early blue builder objective"],
          ["True mechanic", "Complete the first 6 challenges", "Use Challenge Mode; Survival quests do not count"],
          ["Growlab champion", "Complete the first Growlab", "Finish the full route including its exit"],
          ["Farmbot smackdown", "Defeat a Farmbot", "Fight in open ground with ranged ammo"],
          ["The farmer's hand", "Bring 10 caged farmers to the Hideout", "Return farmers safely instead of leaving cages on the route"],
          ["True mechanic genius", "Complete all challenges", "Finish the complete Challenge Mode set"],
          ["Helpful builder", "Complete all builder quests", "Clear every blue builder assignment"],
          ["Farmers eating good lately", "Complete all farmer delivery requests", "Track Farmer supply progression separately from the main story"],
          ["New best friend", "Rescue the Baby Woc", "Complete the Baby Woc rescue sequence"],
          ["Bank mechanic", "Reach a vault value of 2,000,000", "Treat the vault as a long-term material objective"],
          ["Up and running", "Activate all stations in the Mining Hub", "Inspect every station before leaving the Hub"],
          ["Still in one piece", "Reach the Center of the Hay Maze", "Finish the maze route rather than circling the outer paths"],
          ["Huberts high friction mustache", "Find Hubert's missing mustache piece", "Search the associated story area before advancing"],
        ],
      },
      {
        caption: "Combat, farming, and production achievements",
        headers: ["Achievement", "Requirement", "Efficient route"],
        rows: [
          ["Bot splat", "Destroy a bot with a creation", "Use a vehicle, trap, or mounted mechanism for the final damage"],
          ["Totebot Junkyard", "Destroy 100 Totebots", "Let ruins and farm defense contribute naturally"],
          ["Haybot Junkyard", "Destroy 100 Haybots", "Combine early Scrap Metal routes with the counter"],
          ["Surviving the impossible", "Survive the Seekerbot", "Prepare movement, health, and a clear escape route"],
          ["Wet circuits", "Throw water on a Haybot", "Carry a filled Water Bucket on an early ruin run"],
          ["Fresh fruits and vegetables", "Harvest 500 crops", "Use repeatable low-value rows and protect spare seeds"],
          ["Minerbot Junkyard", "Destroy 100 Minerbots", "Count mining expeditions instead of farming surface bots"],
          ["Don't touch my tomatoes", "Successfully defend crops 50 times", "Use controlled small raids rather than one oversized field"],
          ["Blocks for days", "Craft 10,000 blocks of any kind", "Craft blocks needed by real builds and Garage bills"],
          ["Master of defence", "Successfully defend crops against a level 5 raid", "Use exact crop value and prepare a kill lane first"],
          ["Lethal snack", "Destroy two blue Tapebots with one Cornade", "Group the two targets before throwing"],
          ["Questionable behaviour", "Blow up a Woc with an explosive canister", "Move valuable creations away from the blast"],
        ],
      },
      {
        caption: "Building, customization, Workshop, and completion achievements",
        headers: ["Achievement", "Requirement", "Efficient route"],
        rows: [
          ["My beautiful background", "Build something in the main menu", "Open the main-menu builder and place a valid creation"],
          ["The Stuntman", "Reach a very high speed while sitting in a seat", "Use a stable straight-line vehicle and a long clear run"],
          ["Tool Time Shenanigans", "Build a creation in the Garage", "Start with a small unmodded blueprint and exact materials"],
          ["Sharp dressed mechanic", "Unlock every outfit", "Track quest pieces and Garment Box processing by slot"],
          ["Blessing the Workshop", "Share a creation on the Steam Workshop", "Publish a saved creation, not only subscribe to one"],
          ["Pizza Burger chow down", "Wear the Pizza Burger shirt while eating a Pizza Burger", "Equip the shirt before consuming the food"],
          ["Friendly revival", "Get revived by the Baby Woc", "Complete the rescue, then be knocked out close enough for revival"],
          ["Schematic collector club", "Unlock all block schematics", "Check block outputs separately from parts and decorations"],
          ["Spectacular Mechanic", "Get every achievement", "Finish after the other 33 requirements have registered"],
        ],
      },
    ],
    sections: [
      {
        heading: "Start with Mutually Exclusive Game Modes",
        paragraphs: [
          "True mechanic and True mechanic genius belong to Challenge Mode. My first car, builder and Farmer progression, raids, Growlabs, the Mining Hub, Baby Woc, outfits, and schematics belong to the current Survival route. Blessing the Workshop requires a Steam Workshop share rather than an in-world Garage build.",
        ],
      },
      {
        heading: "Run Long Counters in the Background",
        bullets: [
          "Use Totebot and Haybot encounters that already support Scrap Metal, quests, or raid defense.",
          "Build required blocks for actual bases and Garage blueprints instead of crafting 10,000 unusable pieces at once.",
          "Use repeated low-value crop plots for the 500-harvest and 50-defense counters.",
          "Reserve Minerbot kills for equipped Excavation Island runs rather than entering only for the counter.",
        ],
      },
      {
        heading: "Prepare the One-Action Achievements",
        paragraphs: [
          "Wet circuits, Pizza Burger chow down, Lethal snack, Questionable behaviour, Friendly revival, and Tool Time Shenanigans depend on a specific combination being true at the moment of the action. Carry or equip the required item first and verify the target or location before committing.",
        ],
      },
      {
        heading: "When an Achievement Does Not Register",
        steps: [
          "Confirm Steam is online and the game is running on the current public version.",
          "Repeat the final action in the correct game mode and on the host when playing co-op.",
          "For multi-step objectives, check the in-game counter or prerequisite instead of repeating only the last animation.",
          "For Pizza Burger, equip the matching shirt before eating; patch 1.0.1 included a fix for this achievement.",
          "Preserve the affected save before changing branches or removing mods.",
        ],
      },
    ],
    relatedWiki: [
      "farmbot",
      "totebot",
      "haybot",
      "minerbot",
      "cornade",
      "garment-box-common",
      "schematic-box",
      "woc",
    ],
    seo: {
      title: "Scrap Mechanic Achievements - All 34 Requirements",
      description:
        "Track all 34 Scrap Mechanic achievements with exact quest, combat, farming, Workshop, outfit, schematic, Garage, Mining Hub, and hidden-action requirements.",
      keywords: [
        "Scrap Mechanic achievements",
        "all Scrap Mechanic achievements",
        "Scrap Mechanic achievement guide",
        "Scrap Mechanic hidden achievements",
        "Scrap Mechanic Spectacular Mechanic",
      ],
    },
  },
];
