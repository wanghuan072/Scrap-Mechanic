import type { ArticleEntry } from "@/data/types";
import { supplementGuides } from "@/data/guides/supplementGuides";

const coreGuides: ArticleEntry[] = [
  {
    slug: "beginner-first-hours",
    title: "Beginner Guide - Your First Hours in Survival",
    description:
      "A practical route from the crash area to a working vehicle, safer storage, and a manageable first farm.",
    category: "Beginner",
    image: "/images/scrap-mechanic/screenshot-03.jpg",
    imageAlt: "A Scrap Mechanic character beginning a new Survival journey",
    gameVersion: "1.0",
    published: "2026-07-28",
    updated: "2026-07-28",
    readingTime: "9 min",
    featured: true,
    quickAnswer:
      "Secure the crash area, carry only what you can protect, follow the road toward a Mechanic Station, and build a simple reliable vehicle before expanding the farm.",
    sections: [
      {
        heading: "Leave the Crash Area Ready",
        paragraphs: [
          "Take time to understand the Lift, Sledgehammer, and Connect Tool before traveling. Store anything you do not need immediately, then gather enough basic material to repair mistakes without walking all the way back.",
        ],
        bullets: [
          "Keep food and spare seeds separate from building materials.",
          "Mark the direction you leave so the crash area remains easy to find.",
          "Use the first small builds to test controls, not to create a permanent vehicle.",
        ],
      },
      {
        heading: "Follow the Road, Not a Universal Map",
        paragraphs: [
          "Survival terrain is generated, so another player's exact route is not a dependable map for your world. Roads and recognizable locations are more useful than copied coordinates.",
        ],
      },
      {
        heading: "Build a Vehicle You Can Repair",
        steps: [
          "Start with a low rectangular frame and four correctly oriented wheel bearings.",
          "Add a seat, engine, and only the connections needed to drive and steer.",
          "Remove the Lift and test steering at low speed.",
          "Add storage and protection only after the frame drives reliably.",
        ],
      },
      {
        heading: "Treat the First Farm as a Test",
        paragraphs: [
          "A large crop field can trigger a fight before you have the tools to defend it. Begin with a plot you can water and protect by hand, store spare seeds away from the field, and expand after you understand the warning and attack route.",
        ],
      },
    ],
    relatedWiki: ["lift", "bearing", "connect-tool", "tomato"],
    seo: {
      title: "Scrap Mechanic Guides - Beginner Survival Route",
      description:
        "Start Scrap Mechanic 1.0 with a clear route for the crash area, Mechanic Station, first vehicle, storage, and farming. Check each step in-game.",
      keywords: ["Scrap Mechanic beginner guide", "Scrap Mechanic what to do first", "Scrap Mechanic Survival guide"],
    },
  },
  {
    slug: "returning-to-1-0",
    title: "Returning Player Guide - What Changed in 1.0",
    description:
      "The important decisions for players returning from an older Survival or Creative version.",
    category: "1.0",
    image: "/images/scrap-mechanic/trailer-1-0.jpg",
    imageAlt: "Scrap Mechanic 1.0 trailer artwork",
    gameVersion: "1.0.2",
    published: "2026-07-28",
    updated: "2026-07-28",
    readingTime: "7 min",
    featured: true,
    quickAnswer:
      "Start a new Survival world for the complete 1.0 story. Old Creative worlds can load, while old Survival worlds require an older Steam branch.",
    sections: [
      {
        heading: "Choose the Right World First",
        paragraphs: [
          "The official 1.0 announcement says old Creative worlds can load in 1.0. Old Survival worlds remain available only by switching to an older game version. Back up any world or important creation before changing branches.",
        ],
      },
      {
        heading: "Expect a New Progression Layer",
        bullets: [
          "Survival now has a complete story with voiced NPCs.",
          "The world includes new locations, Growlabs, reworked terrain, and more bots.",
          "Schematics can gate recipes that older players remember as immediately available.",
          "The Claygun changes how terrain can be shaped in both Survival and Creative.",
        ],
      },
      {
        heading: "Treat Old Mods as Versioned Files",
        paragraphs: [
          "Some older mods may still work, but the official release notes warn that Parts and Custom Games mods are especially likely to need updates. Keep the mod version aligned with the game branch and test a copy of the world first.",
        ],
      },
    ],
    relatedWiki: ["schematic-box", "controller", "structural-blocks"],
    seo: {
      title: "Scrap Mechanic Guides - Returning to 1.0",
      description:
        "Return to Scrap Mechanic 1.0 safely with the correct world, save, mod, schematic, and Survival progression expectations. Check each step in-game.",
      keywords: ["Scrap Mechanic 1.0 guide", "Scrap Mechanic returning player", "Scrap Mechanic old save"],
    },
  },
  {
    slug: "first-vehicle",
    title: "First Vehicle Guide - Build for Reliability",
    description:
      "Build a starter vehicle that steers correctly, stays upright, and can be repaired without rebuilding the entire frame.",
    category: "Building",
    image: "/images/scrap-mechanic/screenshot-10.jpg",
    imageAlt: "A simple four-wheel vehicle driving in Scrap Mechanic",
    gameVersion: "1.0",
    published: "2026-07-28",
    updated: "2026-07-28",
    readingTime: "8 min",
    featured: true,
    quickAnswer:
      "Use a low, wide frame; check every bearing direction; test the empty chassis off the Lift; and add weight only after steering works.",
    sections: [
      {
        heading: "Build the Chassis Before the Body",
        paragraphs: [
          "The first test should include only the frame, wheels, bearings, seat, and engine. Decorative panels and large storage boxes can hide a steering mistake and make the vehicle harder to recover.",
        ],
      },
      {
        heading: "Connection Order",
        steps: [
          "Place one bearing for each wheel and attach the wheels to the moving faces.",
          "Connect the drive bearings to the engine.",
          "Connect only the steering bearings to the Driver's Seat.",
          "Use the Connect Tool to reverse any wheel that rotates against the others.",
          "Remove the Lift and test forward, reverse, left, and right at low power.",
        ],
      },
      {
        heading: "Keep the Center of Mass Low",
        bullets: [
          "Mount heavy storage close to the chassis.",
          "Use a wider track before adding a tall body.",
          "Avoid a long unsupported nose that catches terrain.",
        ],
      },
    ],
    relatedWiki: ["bearing", "connect-tool", "lift", "structural-blocks"],
    seo: {
      title: "Scrap Mechanic Guides - Build Your First Vehicle",
      description:
        "Build a stable first Scrap Mechanic vehicle with correct bearings, steering, weight balance, and a repairable frame. Check each step in-game.",
      keywords: ["Scrap Mechanic first vehicle", "Scrap Mechanic car guide", "Scrap Mechanic beginner car"],
    },
  },
  {
    slug: "farming-basics",
    title: "Farming Guide - Start Small and Protect Seeds",
    description:
      "Set up a first plot, organize water, and avoid losing every seed to an early raid.",
    category: "Farming",
    image: "/images/scrap-mechanic/screenshot-06.jpg",
    imageAlt: "A farm and growing area in Scrap Mechanic Survival",
    gameVersion: "1.0",
    published: "2026-07-28",
    updated: "2026-07-28",
    readingTime: "7 min",
    featured: true,
    quickAnswer:
      "Plant only what you can water and defend, keep backup seeds away from the field, and prepare the approach before the raid begins.",
    sections: [
      {
        heading: "The Farm Is Also a Combat Area",
        paragraphs: [
          "Planted crops can attract hostile bots. The important early decision is not how large a field can fit, but how much of that field you can water, harvest, and protect with current equipment.",
        ],
      },
      {
        heading: "Protect Recovery Supplies",
        bullets: [
          "Never plant every seed you own.",
          "Keep food, spare seeds, and construction material in separate storage.",
          "Leave a clear route between the bed, storage, and field.",
        ],
      },
      {
        heading: "Upgrade When Repetition Becomes the Problem",
        paragraphs: [
          "Buckets are enough for a small plot. Move to pumps, containers, and a controlled watering arm only when manual watering is the limiting task. Automation should remove repeated work without creating a machine that is harder to repair than the farm itself.",
        ],
      },
    ],
    relatedWiki: ["tomato", "water-bucket", "logic-gate", "controller"],
    seo: {
      title: "Scrap Mechanic Guides - Farming Basics - Survival Guide",
      description:
        "Start a safer Scrap Mechanic farm with manageable crops, protected seeds, watering, and a plan for early raids. Use the checks before departure.",
      keywords: ["Scrap Mechanic farming guide", "Scrap Mechanic first farm", "Scrap Mechanic crop raid"],
    },
  },
  {
    slug: "raid-defense",
    title: "Raid Defense Guide - Control the Approach",
    description:
      "Defend crops with current plant-value thresholds, durability-aware contact surfaces, controlled approach lanes, and realistic potato ammo budgets.",
    category: "Combat",
    image: "/images/scrap-mechanic/screenshot-01.jpg",
    imageAlt: "Players defending an area from hostile bots in Scrap Mechanic",
    gameVersion: "1.0",
    published: "2026-07-28",
    updated: "2026-07-30",
    readingTime: "12 min",
    featured: true,
    quickAnswer:
      "Run the Raid Calculator before planting high-value rows, force bots into one kill lane, use Metal-tier durability on contact surfaces, and stock Spudgun potatoes for the expected bot mix.",
    tables: [
      {
        caption: "1.0 calculator plant values (on-site tool)",
        headers: ["Crop", "Plant value", "Defense note"],
        rows: [
          ["Tomato / Potato", "1", "Cheap food/ammo fields"],
          ["Carrot", "2", "Mild step up"],
          ["Redbeet", "5", "Counts fast—check totals"],
          ["Banana / Chili", "15", "Mid-tier spike"],
          ["Blueberry", "50", "Serious raid budgeting"],
          ["Orange", "100", "One plant is a decision"],
          ["Broccoli", "500", "Advanced farms only"],
          ["Pineapple", "1000", "Top calculator crop"],
        ],
        note: "Use /tools/raid-calculator for the exact total and distance to the next current threshold.",
      },
      {
        caption: "Potato ammo quick reference",
        headers: ["Target", "HP", "Spudgun (28)", "Shotgun full (64)"],
        rows: [
          ["Totebot / Tapebot", "40", "≈2", "1"],
          ["Haybot", "100", "≈4", "2"],
          ["Farmbot", "1500", "54", "≈24"],
        ],
      },
    ],
    sections: [
      {
        heading: "Plant Value Is the Real Raid Difficulty Slider",
        paragraphs: [
          "Raids care about planted value in a cluster, not how pretty the farm looks. Ten oranges (1000) outrank a huge tomato field. Open the Raid Calculator before the second high-value row, and keep seed chests outside the raid radius so a wipe does not delete replant capacity.",
        ],
      },
      {
        heading: "One Kill Lane, Not a Decorative Maze",
        bullets: [
          "Force bots through a single lit approach you can shoot.",
          "Put crops behind the contact line; put Craftbots and pipes farther back.",
          "Leave a human escape path that is not the bot funnel.",
          "Mark repair kits and ammo crates with paint so night panic has landmarks.",
        ],
      },
      {
        heading: "Durability Beats Wishful Wood",
        paragraphs: [
          "Bot attacks use break chance by durability level—not a simple hit-point bar. Haybots struggle past mid-high durability; Farmbots still threaten softer shells and can trash low-durability blocks by walking over them. Put Metal-tier material on the first contact face; keep scrap wood for interior scaffolding.",
        ],
      },
      {
        heading: "Ammo and Food Before the Warning Ends",
        paragraphs: [
          "Restock potatoes and Cookbot meals when the unauthorized-farming warning appears—not after the first Totebot is in the crops. If your plant value can summon Tapebots or worse, treat the night like a mini Warehouse: ADS angles, not hammer heroics.",
        ],
      },
      {
        heading: "Recover Before You Replant",
        steps: [
          "Clear remaining bots and loot Circuit Boards / Scrap Metal.",
          "Repair the kill lane and any broken automation.",
          "Move spare seeds back to protected storage.",
          "Re-run the Raid Calculator before expanding the next row.",
        ],
      },
    ],
    relatedWiki: ["haybot", "farmbot", "tapebot", "spudgun", "spud-shotgun", "tomato", "pineapple"],
    seo: {
      title: "Scrap Mechanic Guides - Raid Defense with Plant Values",
      description:
        "Defend Scrap Mechanic farms using 1.0 plant values, classic wave context, durability rules, and potato ammo budgets for Totebot through Farmbot.",
      keywords: [
        "Scrap Mechanic raid defense",
        "Scrap Mechanic crop value",
        "Scrap Mechanic farm defense",
        "Scrap Mechanic raid levels",
      ],
    },
  },
  {
    slug: "multiplayer-basics",
    title: "Multiplayer Guide - Safer Shared Worlds",
    description:
      "Organize a co-op world so builds, storage, mods, and progression remain understandable for every player.",
    category: "Multiplayer",
    image: "/images/scrap-mechanic/screenshot-07.jpg",
    imageAlt: "Two players exploring together in Scrap Mechanic",
    gameVersion: "1.0.2",
    published: "2026-07-28",
    updated: "2026-07-28",
    readingTime: "6 min",
    quickAnswer:
      "Agree on the game branch and mod list first, label shared storage, and let the host verify quest and recipe progression after updates.",
    sections: [
      {
        heading: "Match the Environment",
        bullets: [
          "Every player should use the same game branch.",
          "Keep the active mod list short and version-compatible.",
          "Back up the host save before changing the mod set.",
        ],
      },
      {
        heading: "Make Shared Work Visible",
        paragraphs: [
          "Label storage and leave incomplete builds in a clear work area. A shared world becomes difficult when nobody knows which materials are reserved or which machine is safe to modify.",
        ],
      },
      {
        heading: "Verify Progression Together",
        paragraphs: [
          "The 1.0.1 patch fixed a case where crafting recipes did not unlock correctly in games with many players. After an update, let the host confirm the quest state and ask each player to check newly unlocked recipes before continuing.",
        ],
      },
    ],
    relatedWiki: ["schematic-box", "connect-tool", "component-kit"],
    seo: {
      title: "Scrap Mechanic Guides - Multiplayer Basics",
      description:
        "Run a safer Scrap Mechanic co-op world with matching versions, compatible mods, shared storage, and progression checks. Check each step in-game.",
      keywords: ["Scrap Mechanic multiplayer", "Scrap Mechanic co-op guide", "Scrap Mechanic multiplayer mods"],
    },
  },
  {
    slug: "crafting-and-upgrade-priorities",
    title: "Crafting Guide - Upgrade What Removes the Bottleneck",
    description:
      "Choose Craftbot parts, interactive upgrades, storage, and production improvements in an order that solves real problems.",
    category: "Crafting",
    image: "/images/scrap-mechanic/screenshot-07.jpg",
    imageAlt: "A busy Scrap Mechanic crafting workshop",
    gameVersion: "1.0.2",
    published: "2026-07-28",
    updated: "2026-07-28",
    readingTime: "10 min",
    featured: true,
    quickAnswer:
      "Upgrade the system that is stopping the next goal: transport before remote gathering, storage before bulk production, and recipe unlocks before farming materials for a part you still cannot craft.",
    sections: [
      {
        heading: "Start from the Next Job",
        paragraphs: [
          "A useful upgrade makes the next complete loop easier. Decide whether the next loop is farming, mining, exploration, combat, or cargo transport, then list the part that is currently forcing repeated manual work.",
        ],
        bullets: [
          "If trips are slow, improve reliable transport before adding production.",
          "If materials are lost or mixed, fix storage before gathering more.",
          "If the recipe is locked, pursue schematic progression before stockpiling every ingredient.",
        ],
      },
      {
        heading: "Protect a Repair Reserve",
        paragraphs: [
          "Do not spend the last Component Kits, Circuit Boards, fuel, or structural material on an optional upgrade. A machine that cannot be repaired after one field test is not a finished upgrade.",
        ],
      },
      {
        heading: "A Practical Upgrade Order",
        steps: [
          "Make the starter vehicle steer, stop, and return reliably.",
          "Create labeled storage for fuel, electronics, food, seeds, and building material.",
          "Improve the Craftbot path and unlock the recipe needed for the next job.",
          "Build one focused machine and test it on a small real workload.",
          "Upgrade durability, capacity, or speed only after the bottleneck is observed.",
        ],
      },
    ],
    relatedWiki: ["crafting-bots", "component-kit", "schematicbot", "large-chest"],
    seo: {
      title: "Scrap Mechanic Guides - Crafting and Upgrade Priorities",
      description:
        "Choose Scrap Mechanic crafting upgrades by the real bottleneck in transport, storage, recipes, farming, or mining. Use the checks before departure.",
      keywords: ["Scrap Mechanic crafting guide", "Scrap Mechanic upgrade order", "Scrap Mechanic Craftbot"],
    },
  },
  {
    slug: "warehouse-preparation",
    title: "Warehouse Guide - Prepare, Clear, and Return Safely",
    description:
      "A practical checklist for ammunition, food, route marking, room clearing, loot handling, and recovery before entering a Warehouse.",
    category: "Exploration",
    image: "/images/scrap-mechanic/screenshot-05.jpg",
    imageAlt: "A dangerous industrial structure in Scrap Mechanic",
    gameVersion: "1.0",
    published: "2026-07-28",
    updated: "2026-07-28",
    readingTime: "11 min",
    featured: true,
    quickAnswer:
      "Bring ranged combat equipment, leave unrelated valuables at base, park a recoverable vehicle outside the approach, and clear one angle and room at a time.",
    sections: [
      {
        heading: "Load for the Structure, Not the Whole Game",
        bullets: [
          "A ranged weapon and a protected ammunition reserve.",
          "Food for recovery and enough light for the return route.",
          "Only the tools needed for interaction and emergency building.",
          "Empty inventory space divided between essential loot and optional material.",
        ],
      },
      {
        heading: "Establish a Surface Staging Point",
        paragraphs: [
          "Park outside the immediate combat lane with the vehicle facing the return direction. Put backup food and ammunition in a separate chest so one failed entry does not consume the entire supply.",
        ],
      },
      {
        heading: "Clear by Angles",
        steps: [
          "Stop before a new doorway and listen.",
          "Expose one side of the room while keeping hard cover.",
          "Remove the visible ranged threat before crossing open floor.",
          "Check upper levels and side openings before collecting drops.",
          "Return valuable loot to the staging point before pushing deeper.",
        ],
      },
      {
        heading: "Know When the Run Is Complete",
        paragraphs: [
          "A run that returns with useful progression and preserves the equipment is successful. Do not turn a controlled expedition into an inventory recovery because one optional corner remains uncleared.",
        ],
      },
    ],
    relatedWiki: ["tapebot", "spudgun", "cornade", "glowstick"],
    seo: {
      title: "Scrap Mechanic Guides - Warehouse Preparation",
      description:
        "Prepare ammunition, food, staging storage, room-clearing tactics, and a safe return route for Scrap Mechanic Warehouses. Confirm it in-game.",
      keywords: ["Scrap Mechanic Warehouse guide", "Scrap Mechanic Tapebot", "Scrap Mechanic warehouse preparation"],
    },
  },
  {
    slug: "trading-and-packing",
    title: "Trading Guide - Farms, Packing Stations, and Cargo",
    description:
      "Turn a crop objective into a complete harvest, packing, hauling, and trading route without losing the delivery on the road.",
    category: "Progression",
    image: "/images/scrap-mechanic/screenshot-03.jpg",
    imageAlt: "A Scrap Mechanic farm prepared for a produce delivery",
    gameVersion: "1.0",
    published: "2026-07-28",
    updated: "2026-07-28",
    readingTime: "9 min",
    quickAnswer:
      "Confirm the required produce first, grow only the batch you need, test the road with an empty cargo vehicle, and keep the load low and physically contained.",
    sections: [
      {
        heading: "Work Backward from the Trade",
        steps: [
          "Identify the item or progression goal you are pursuing.",
          "Confirm which produce and packed cargo support that goal.",
          "Reserve the seeds for another complete planting.",
          "Prepare watering and raid defense for the exact crop batch.",
          "Test the Packing Station and trader route before loading cargo.",
        ],
      },
      {
        heading: "Build a Cargo Vehicle, Not a Fast Car",
        paragraphs: [
          "A produce hauler needs a low deck, a wide stable stance, boundaries that keep the load from sliding out, and enough steering clearance for road junctions. Top speed is secondary.",
        ],
        bullets: [
          "Keep the load between the axles.",
          "Use a gate or removable restraint instead of stacking loose cargo high.",
          "Carry fuel and a Lift where they remain accessible after a rollover.",
        ],
      },
      {
        heading: "Protect the Return",
        paragraphs: [
          "Leave room for the reward, do not fill every inventory slot with roadside loot, and keep enough fuel to return even if the loaded vehicle takes a slower route.",
        ],
      },
    ],
    relatedWiki: ["large-chest", "suspension", "carrot", "orange"],
    seo: {
      title: "Scrap Mechanic Guides - Packing Station and Trading",
      description:
        "Plan crop batches, Packing Station routes, stable cargo vehicles, and trader deliveries in Scrap Mechanic Survival. Follow the route with a recoverable save.",
      keywords: ["Scrap Mechanic Packing Station", "Scrap Mechanic trader", "Scrap Mechanic produce crates"],
    },
  },
  {
    slug: "exploration-and-loot",
    title: "Exploration Guide - Find More and Lose Less",
    description:
      "A repeatable exploration loop for generated worlds, roadside ruins, inventory decisions, route markers, and safe returns.",
    category: "Exploration",
    image: "/images/scrap-mechanic/screenshot-09.jpg",
    imageAlt: "Mechanics exploring the generated Scrap Mechanic world",
    gameVersion: "1.0",
    published: "2026-07-28",
    updated: "2026-07-28",
    readingTime: "8 min",
    quickAnswer:
      "Travel from one known landmark to the next, mark decision points, clear before looting, and return when the important cargo or repair reserve is at risk.",
    sections: [
      {
        heading: "Use a Reversible Landmark Chain",
        paragraphs: [
          "Generated terrain makes copied coordinates unreliable. Build a route from stable observations: the road left from base, the bridge crossed, the station passed, the ruin entered, and the direction used to leave.",
        ],
      },
      {
        heading: "Give Every Trip a Priority",
        bullets: [
          "Resource trip: carry the collection tool and return with one material family.",
          "Loot trip: keep inventory open and avoid heavy construction work.",
          "Story trip: preserve food, weapons, and objective items over ordinary blocks.",
          "Scout trip: travel light and record the route instead of clearing everything.",
        ],
      },
      {
        heading: "Use a Three-Stage Loot Rule",
        steps: [
          "Clear the immediate threat.",
          "Move priority loot to the vehicle or staging chest.",
          "Only then decide whether optional material is worth the remaining space.",
        ],
      },
      {
        heading: "Return Before the Vehicle Becomes the Loot",
        paragraphs: [
          "Extra exploration is not profitable when the vehicle carrying the first half of the trip is destroyed. Turn around while the route, fuel, and repair capacity still make the return routine.",
        ],
      },
    ],
    relatedWiki: ["glowstick", "large-chest", "gasoline", "sledgehammer"],
    seo: {
      title: "Scrap Mechanic Guides - Exploration and Loot Routes",
      description:
        "Navigate generated worlds, mark routes, prioritize loot, and return safely from Scrap Mechanic exploration trips. Use the checks before departure.",
      keywords: ["Scrap Mechanic exploration guide", "Scrap Mechanic loot", "Scrap Mechanic generated map"],
    },
  },
  {
    slug: "automated-farming",
    title: "Automated Farming Guide - One Reliable Crop Row",
    description:
      "Build planting, watering, fertilizer, and harvest automation one tested stage at a time.",
    category: "Farming",
    image: "/images/scrap-mechanic/screenshot-06.jpg",
    imageAlt: "An automated Scrap Mechanic farm with machines beside crop rows",
    gameVersion: "1.0",
    published: "2026-07-28",
    updated: "2026-07-28",
    readingTime: "12 min",
    featured: true,
    quickAnswer:
      "Automate one straight row first: confirm pump direction, container contents, coverage, and controls at each stage before adding the next row.",
    sections: [
      {
        heading: "Standardize the Farm Geometry",
        paragraphs: [
          "Straight rows and predictable spacing make every later step easier. Leave a service lane for the mechanic and enough edge space for a pump, moving arm, or harvesting vehicle.",
        ],
      },
      {
        heading: "Build the System in Four Tests",
        steps: [
          "Fill the water system and prove that every soil plot receives water.",
          "Load one seed and verify the planting direction and spacing.",
          "Apply one unit of Fertilizer only after the correct plot is targeted.",
          "Harvest one mature row and confirm the output reaches the intended storage.",
        ],
      },
      {
        heading: "Separate Inputs",
        bullets: [
          "Use labeled containers for seeds, water, Fertilizer, and harvested crops.",
          "Give collection and delivery separate controls.",
          "Keep the manual Water Bucket and seed reserve outside the machine.",
        ],
      },
      {
        heading: "Automation Does Not Replace Defense",
        paragraphs: [
          "A faster crop cycle still needs a protected approach, an escape path, and storage outside the raid lane. Scale the machine and the farm defense together.",
        ],
      },
    ],
    relatedWiki: ["vacuum-pump", "water-system", "sensor", "fertilizer"],
    seo: {
      title: "Scrap Mechanic Guides - Automated Farming",
      description:
        "In Scrap Mechanic, automate planting, watering, fertilizer, and harvesting with Vacuum Pumps, containers, and tested crop rows. Verify the current role in-game.",
      keywords: ["Scrap Mechanic automated farming", "Scrap Mechanic Vacuum Pump farm", "Scrap Mechanic watering system"],
    },
  },
  {
    slug: "controller-and-logic",
    title: "Logic Guide - Controllers, Sensors, and Safe Machines",
    description:
      "Build readable moving systems by separating motion, activation, detection, and emergency stops.",
    category: "Building",
    image: "/images/scrap-mechanic/screenshot-11.jpg",
    imageAlt: "A complex logic-controlled machine in Scrap Mechanic",
    gameVersion: "1.0",
    published: "2026-07-28",
    updated: "2026-07-28",
    readingTime: "11 min",
    quickAnswer:
      "Make the mechanism work with a manual Switch first, add one Controller sequence, then add Sensor or Logic Gate conditions only after the stopped and moving states are safe.",
    sections: [
      {
        heading: "Separate Four Responsibilities",
        bullets: [
          "Motion: Bearings and Pistons perform the physical movement.",
          "Sequence: Controllers define positions and timing.",
          "Decision: Sensors and Logic Gates decide whether movement is allowed.",
          "Control: Switches, Buttons, and seats give the player authority.",
        ],
      },
      {
        heading: "Build from Manual to Automatic",
        steps: [
          "Create the moving frame and test its physical clearance.",
          "Trigger it with one manual control.",
          "Add the Controller sequence at low speed.",
          "Add one Sensor or logic condition.",
          "Test normal use, obstruction, lost power, and emergency stop.",
        ],
      },
      {
        heading: "Make Debugging Visible",
        paragraphs: [
          "Paint connection groups, keep important gates accessible, and add status lights where a mechanism has several states. Hidden logic may look clean, but it turns a small fault into a rebuild.",
        ],
      },
    ],
    relatedWiki: ["controller", "sensor", "logic-gate", "switch"],
    seo: {
      title: "Scrap Mechanic Guides - Controller and Logic",
      description:
        "Build safe Scrap Mechanic logic with Controllers, Sensors, Logic Gates, manual controls, and readable debugging. Use the checks before departure.",
      keywords: ["Scrap Mechanic logic guide", "Scrap Mechanic Controller", "Scrap Mechanic Sensor"],
    },
  },
  {
    slug: "save-backups-and-branches",
    title: "Save Guide - Backups, Old Worlds, and Steam Branches",
    description:
      "Protect Creative and Survival worlds before updating, switching branches, testing mods, or troubleshooting quest progression.",
    category: "Troubleshooting",
    image: "/images/scrap-mechanic/trailer-1-0.jpg",
    imageAlt: "Scrap Mechanic 1.0 Drilling Thunder release artwork",
    gameVersion: "1.0.2",
    published: "2026-07-28",
    updated: "2026-07-28",
    readingTime: "8 min",
    featured: true,
    quickAnswer:
      "Back up the complete save before changing game versions or mods. Old Creative worlds can load in 1.0, while old Survival worlds require an older branch.",
    sections: [
      {
        heading: "Create a Backup Before the Experiment",
        steps: [
          "Close the game so the save is not being written.",
          "Copy the complete Survival or Creative save to a dated folder outside the active save directory.",
          "Record the game version and enabled mod list beside the backup.",
          "Open a copied world first after changing branch or mod configuration.",
        ],
      },
      {
        heading: "Know the 1.0 Boundary",
        paragraphs: [
          "The official 1.0 release guidance says older Creative worlds remain usable in 1.0. Older Survival worlds require switching to an older Steam version because the full-release Survival world and progression changed substantially.",
        ],
      },
      {
        heading: "Preserve Evidence for a Real Bug",
        bullets: [
          "Keep the affected save instead of repeatedly overwriting it.",
          "Record the objective that failed and the action immediately before it.",
          "Test a copy without incompatible mods.",
          "Keep the session log when reporting a reproducible problem.",
        ],
      },
    ],
    relatedWiki: ["schematic-box", "schematicbot", "handbook"],
    seo: {
      title: "Scrap Mechanic Guides - Save Backups and Old Worlds",
      description:
        "Back up Scrap Mechanic saves, understand old Survival and Creative world compatibility, and test Steam branches safely. Check each step in-game.",
      keywords: ["Scrap Mechanic save backup", "Scrap Mechanic old Survival world", "Scrap Mechanic Steam branch"],
    },
  },
];

export const guides: ArticleEntry[] = [...coreGuides, ...supplementGuides];
