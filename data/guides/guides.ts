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

const guideEnhancements: Record<string, Partial<ArticleEntry>> = {
  "beginner-first-hours": {
    title: "Beginner Guide - Crash Site to Mechanic Station",
    description:
      "Complete the opening ship recovery in order: find the Water Bucket, extinguish three marked fires, install the first Master Battery, reconnect the console, take the Logbook, and only then choose a farm or first-car branch.",
    category: "Standalone",
    image: "/images/scrap-mechanic/screenshot-02.jpg",
    imageAlt: "Mechanics working inside a powered Scrap Mechanic station",
    gameVersion: "1.0.3",
    updated: "2026-07-31",
    readingTime: "17 min",
    quickAnswer:
      "Enter the crashed ship to start Getting Started, follow the path opposite its entrance to the pond, fill the Water Bucket, extinguish the three marked fires inside, recover the nearby Master Battery, restore ship power, reconnect the console with the Connect Tool, and take the Logbook before leaving for the Mechanic Station.",
    media: [
      {
        src: "/images/wiki/water-bucket.webp",
        alt: "Water Bucket item from Scrap Mechanic",
        caption:
          "The Water Bucket beside the Crash Site pond is the first required tool. Fill it at the water, return to the ship, and repeat until all three marked interior fires are out.",
      },
      {
        src: "/images/wiki/master-battery.webp",
        alt: "Master Battery item from Scrap Mechanic",
        caption:
          "The first Master Battery belongs in the crashed ship. The Mechanic Station later marks a different Master Battery for its own control panel.",
      },
    ],
    tables: [
      {
        caption: "Getting Started completion checkpoints",
        headers: ["Step", "Where / item", "What proves it is complete"],
        rows: [
          ["1. Start", "Inside crashed ship", "Getting Started and the fire objective are active"],
          ["2. Find water", "Path opposite ship entrance", "The pond, farming billboard, soil, seeds, and bucket are visible"],
          ["3. Fill bucket", "Pond edge", "The empty Water Bucket changes to its filled state"],
          ["4. Extinguish", "Crashed ship interior", "All 3 marked interior fires are gone"],
          ["5. Recover power", "Nearby ruin", "The marked Master Battery is in your hands"],
          ["6. Restore ship", "Ship battery socket", "The ship and Mini Craftbot receive power"],
          ["7. Reconnect", "Ship console", "The Connect Tool objective updates after the requested connection"],
          ["8. Navigate", "Logbook", "Mechanic Station appears as the next waypoint"],
        ],
        note:
          "Do not use the permanent exterior flame or later Fire Extinguisher quest as the completion check. Getting Started tracks the marked fires inside the ship.",
      },
      {
        caption: "The two early Master Batteries",
        headers: ["Battery", "Marked location", "Correct destination"],
        rows: [
          ["Crash Site battery", "Ruin near the crashed ship", "Crashed ship battery socket"],
          ["Mechanic Station battery", "Station bunk-room objective area", "Mechanic Station control panel"],
        ],
        note:
          "They are fixed progression objects, not normal Batteries and not one reusable battery carried between both facilities.",
      },
      {
        caption: "Choose the next branch only after the Logbook",
        headers: ["Next job", "Start condition", "First measurable target"],
        rows: [
          ["First farm", "Bucket, soil, and seeds at the pond", "One short row watered and harvested by hand"],
          ["Your First Car", "Open the blue builder objective", "Complete the 12-state vehicle lesson"],
          ["Mechanic Station", "Waypoint recorded in the Logbook", "Install its second Master Battery and build the Craftbot"],
        ],
      },
      {
        caption: "Optional starter-car test baseline",
        headers: ["Measurement", "Baseline", "Commissioning proof"],
        rows: [
          ["Frame", "10 × 16 blocks", "A low ladder frame with room for front steering"],
          ["Ground clearance", "2 blocks", "Crosses a shallow road edge without beaching"],
          ["Wood Block Level 1", "48", "Bare frame is complete before decorative bodywork"],
          ["Bearings", "6", "4 wheel hubs and 2 front steering pivots"],
          ["Controls", "1 seat + 1 Gas Engine", "Seat, engine, and driven bearings form one visible path"],
          ["First payload", "Driver + 1 low chest", "Steering and braking still work after loading"],
        ],
        note:
          "This is a workshop baseline for testing, not a Getting Started requirement. Finish the ship recovery before spending time on a permanent chassis.",
      },
      {
        caption: "Small first-farm values",
        headers: ["Crop", "1.0 plant value", "Why it belongs or waits"],
        rows: [
          ["Tomato", "1", "Food and the lowest-value practice row"],
          ["Potato", "1", "Food now; Spudgun ammunition later"],
          ["Carrot", "2", "Food with twice Tomato's calculator value"],
          ["Redbeet", "5", "Delay larger rows until the approach is defended"],
        ],
        note:
          "Never plant the final seed. A seed chest outside the crop approach is the recovery plan after a failed night.",
      },
    ],
    sections: [
      {
        heading: "1. Trigger Getting Started Inside the Ship",
        paragraphs: [
          "Walk into the crashed maintenance ship before looting outward. The active yellow objective is the reliable start signal: it sends you to water and later replaces completed markers with the Master Battery, console, and Logbook steps. If the pond has no useful marker yet, return to the ship interior and let Getting Started activate.",
        ],
        bullets: [
          "Opening fire: Water Bucket and pond water.",
          "Later Hideout fire quest: Fire Extinguisher received after Built to Last.",
          "These are separate objectives; an extinguisher is not required to leave the Crash Site.",
        ],
      },
      {
        heading: "2. Find the Water Bucket at the Pond",
        paragraphs: [
          "Stand at the ship entrance and take the path running away from it. The nearby pond is grouped with a farming billboard, Soil Bags, seeds, and a planted Tomato. The Water Bucket sits at the pond edge. Use the empty bucket on the water, return to the ship, throw the splash at a marked fire, then refill for the next marked fire.",
        ],
      },
      {
        heading: "3. Extinguish the Three Marked Interior Fires",
        steps: [
          "Carry a filled Water Bucket back through the ship entrance.",
          "Aim at one fire carrying the active objective marker and throw the water.",
          "Return to the pond when the bucket is empty and refill it.",
          "Repeat until all three marked fires inside the ship are gone and the objective changes.",
        ],
      },
      {
        heading: "4. Recover the First Master Battery",
        paragraphs: [
          "After the final marked fire is extinguished, Getting Started points toward the ruin near the Crash Site. Follow the crash debris and damaged-crate trail, clear the immediate approach, take the marked Master Battery, and carry it back to the ship socket. Do not save this battery for the Mechanic Station; the station objective marks its own battery later.",
        ],
      },
      {
        heading: "5. Power the Ship, Reconnect the Console, Take the Logbook",
        paragraphs: [
          "Installing the Master Battery restores the crashed ship's powered opening systems and Mini Craftbot. Follow the remaining objective state instead of leaving immediately: craft the Connect Tool, make the requested console connection, then collect and open the Logbook. The ship phase is complete when the Mechanic Station waypoint can be selected in the Logbook.",
        ],
      },
      {
        heading: "6. Choose Farming or Your First Car",
        paragraphs: [
          "The pond area already contains the pieces for a manual farming lesson, while the blue Your First Car assignment contains a twelve-state vehicle tutorial. Both are useful after Getting Started, but neither should replace the fire, battery, console, and Logbook sequence. A small farm supplies food; a simple car shortens the road trip. Choose the current bottleneck rather than trying to finish both as one oversized build.",
        ],
        steps: [
          "Farm branch: plant one short Tomato, Potato, or Carrot row that can be watered entirely by hand.",
          "Vehicle branch: complete steering and power connections before adding a chest or bodywork.",
          "Keep spare seeds away from the planted row and keep the vehicle outside the likely bot approach.",
        ],
      },
      {
        heading: "7. Follow a Reversible Route to the Mechanic Station",
        paragraphs: [
          "Use the Logbook waypoint and the road network rather than another world's coordinates. Generated terrain changes the exact turns, but the destination is recognizable by the illuminated wrench. Record bridges and large junctions in reverse order so the Crash Site remains findable after dark. At the station, locate its separate Master Battery, restore the control panel, and build the Craftbot required by the next progression stage.",
        ],
      },
      {
        heading: "Opening Questions That Should Not Stop the Route",
        bullets: [
          "Cannot find the bucket: return to the ship, activate the fire objective, then follow the path opposite the entrance to the pond edge.",
          "Fire will not count: target the three marked fires inside the ship, not an unmarked exterior flame.",
          "Ship still has no power: the first Master Battery must be inserted into the crashed ship socket.",
          "Mechanic Station still has no power: locate the second battery marked by The Mechanic Station objective.",
          "No station waypoint: finish the console objective and open the Logbook before starting the road journey.",
        ],
      },
    ],
    relatedWiki: ["water-bucket", "master-battery", "connect-tool", "mini-craftbot", "soil-bag", "tomato", "lift", "bearing"],
    relatedGuides: ["first-vehicle", "farming-basics"],
    relatedRoutes: [
      { label: "Getting Started objectives", href: "/wiki/quests#getting-started" },
      { label: "The Mechanic Station objectives", href: "/wiki/quests#the-mechanic-station" },
      { label: "Check current 1.0 patches", href: "/updates" },
    ],
    seo: {
      title: "Scrap Mechanic Beginner Guide - Crash Site Route",
      description:
        "Start Scrap Mechanic: find the Water Bucket, put out three ship fires, recover both Master Batteries, unlock the Logbook, and reach the Mechanic Station.",
      keywords: [
        "Scrap Mechanic beginner guide",
        "Scrap Mechanic what to do first",
        "Scrap Mechanic how to put out fire",
        "Scrap Mechanic Water Bucket location",
        "Scrap Mechanic Master Battery location",
        "Scrap Mechanic crashed ship",
        "Scrap Mechanic Logbook",
      ],
    },
  },
  "returning-to-1-0": {
    title: "Returning Player Guide - Saves, Mods, and 1.0 Systems",
    description:
      "A version-boundary checklist for old Creative and Survival worlds, Parts and Custom Game mods, schematics, multiplayer hosts, and launch patches through 1.0.3.",
    category: "Standalone",
    gameVersion: "1.0.3",
    updated: "2026-07-31",
    readingTime: "13 min",
    quickAnswer:
      "Old Creative worlds can load in 1.0; old Survival worlds need a legacy Steam branch. Back up the complete save before switching, test Parts or Custom Game mods on a copy, and use the 1.0.3 public baseline before diagnosing raid, Vault, underground, or Thruster problems.",
    media: [
      {
        src: "/images/updates/world-overhaul.webp",
        alt: "Scrap Mechanic 1.0 world overhaul scene",
        caption:
          "The 1.0 Survival route is built around reworked terrain, story progression, new locations, mining, and new bot families—not only balance changes to the Early Access world.",
      },
      {
        src: "/images/wiki/schematic-box.webp",
        alt: "Schematic Box icon from Scrap Mechanic",
        caption:
          "Schematics now gate parts of the Craftbot list. A collected box and a registered recipe are separate states, so check the Schematicbot before assuming a Craftbot bug.",
      },
    ],
    tables: [
      {
        caption: "World and mod compatibility boundary",
        headers: ["Existing content", "1.0 handling", "Safe test"],
        rows: [
          ["Old Creative world", "Can load in 1.0", "Back up, disable suspect mods, open a copy"],
          ["Old Survival world", "Requires an older Steam branch", "Keep legacy and 1.0 saves in separate dated backups"],
          ["Saved creations", "Back up important builds", "Open a simple unmodded copy first"],
          ["Parts mods", "Most likely to need updates", "Verify every interactive part before saving"],
          ["Custom Games", "May need an updated package", "Test menu load and a throwaway world"],
          ["Multiplayer world", "Host owns progression state", "Let the host perform the final quest interaction"],
        ],
      },
      {
        caption: "Public 1.0 patch checkpoints",
        headers: ["Version", "Relevant fixes", "What to retest"],
        rows: [
          ["1.0", "Full story, world overhaul, schematics, Garage, mining", "Start a new Survival world for the complete route"],
          ["1.0.1", "Schematic unlocks, recipe display, multiplayer steering, Pizzaburger", "Re-register a box and recheck the Craftbot list"],
          ["1.0.2", "Quest progression, challenge chest items, mod menu, crashes", "Retry the objective as host on a backed-up save"],
          ["1.0.3", "Raids, Vault quests, underground events, Thruster UI, older CPUs", "Confirm the patch before rebuilding or abandoning the save"],
        ],
      },
      {
        caption: "Old expectation versus current 1.0 system",
        headers: ["System", "Old habit", "Current decision"],
        rows: [
          ["Recipes", "Expect Craftbot list immediately", "Register Schematic Boxes with the Schematicbot"],
          ["Survival map", "Reuse an old route or coordinate map", "Start from generated roads and current quest markers"],
          ["Creative tools", "Treat terrain as fixed", "Use Claygun shaping and 1.0.3 Creative commands"],
          ["Food", "Carry any meal", "Use Cookbot health and perk effects for the job"],
          ["Garage", "Rebuild a creation manually", "Load a supported blueprint and pay its exact material bill"],
          ["Bots", "Prepare for the old roster", "Plan for new colored, digging, mining, and boss behaviors"],
        ],
      },
    ],
    sections: [
      {
        heading: "Back Up the Whole World Before Changing a Branch",
        steps: [
          "Close the game so the save is not being written.",
          "Copy the complete world to a dated folder outside the active save directory.",
          "Record the game version, branch, host, and enabled mod list beside it.",
          "Open a copied world first after changing branch or mod configuration.",
          "Keep the untouched backup until quests, creations, and storage have all been checked.",
        ],
      },
      {
        heading: "Do Not Use a Legacy Survival World to Judge 1.0",
        paragraphs: [
          "The complete story, reworked world generation, Growlabs, Excavation Island, new bots, Schematicbot progression, and Scrap City Garage belong to the new Survival baseline. A legacy branch is for preserving an old world, not for sampling the complete 1.0 progression.",
        ],
      },
      {
        heading: "Separate Schematic Failure From Crafting Failure",
        steps: [
          "Confirm the box entered the inventory.",
          "Take it to the Schematicbot and register the matching recipe.",
          "Check the Craftbot for the exact item rather than only the schematic icon.",
          "If no recipe appears, update past 1.0.1 and repeat on the host.",
          "Preserve the save before removing mods or changing branches.",
        ],
      },
      {
        heading: "Multiplayer Retest Order",
        bullets: [
          "Host loads the backed-up world and performs the final quest or unlock interaction.",
          "Clients rejoin only after the objective state is visible to the host.",
          "Steering is tested on a simple vehicle before a complex bearing creation.",
          "One mod category is restored at a time so a failing package has a name.",
        ],
      },
      {
        heading: "When the Current Patch Still Does Not Fix the Save",
        paragraphs: [
          "A patched engine condition does not always repair state already written into a world. Keep the affected copy, record the objective and the action immediately before it stopped, and retry from the last clean backup. Repeatedly overwriting the only world removes the evidence needed to distinguish a current bug from damaged legacy state.",
        ],
      },
    ],
    relatedWiki: ["schematic-box", "schematicbot", "claygun", "handbook", "thruster"],
    relatedGuides: ["scrap-city-garage-blueprints", "achievements"],
    seo: {
      title: "Scrap Mechanic 1.0 Returning Player Guide",
      description:
        "Return to Scrap Mechanic 1.0.3 with exact old-save boundaries, patch checkpoints, schematic troubleshooting, mod tests, and multiplayer host steps.",
      keywords: [
        "Scrap Mechanic returning player",
        "Scrap Mechanic old save",
        "Scrap Mechanic 1.0 mods",
        "Scrap Mechanic legacy branch",
        "Scrap Mechanic 1.0.3",
      ],
    },
  },
  "farming-basics": {
    title: "Farming and Raid Defense Guide",
    description:
      "Plan crop rows with exact 1.0 plant values, a protected seed reserve, one defended approach, and automation sized to an 8–12 plot test row.",
    category: "Survival",
    updated: "2026-07-31",
    readingTime: "15 min",
    quickAnswer:
      "Tomato and Potato count 1 each, while one Pineapple counts 1000. Calculate the planted total before watering high-value crops, keep seeds and machinery outside the bot approach, and automate only after one 8–12 plot row survives a complete water, harvest, and raid cycle.",
    media: [
      {
        src: "/images/wiki/tomato.webp",
        alt: "Tomato crop icon from Scrap Mechanic",
        caption:
          "Tomato is the value-1 baseline. Every higher crop should be compared with this unit before a visually small fruit row is added.",
      },
      {
        src: "/images/wiki/water-system.webp",
        alt: "Water System part icon from Scrap Mechanic",
        caption:
          "A Water System removes bucket repetition, but it does not protect seeds, defend the approach, or verify that every soil plot received water.",
      },
    ],
    tables: [
      {
        caption: "1.0 crop plant values",
        headers: ["Crop", "Plant value", "Tomato equivalent"],
        rows: [
          ["Tomato", "1", "1 Tomato"],
          ["Potato", "1", "1 Tomato"],
          ["Carrot", "2", "2 Tomatoes"],
          ["Redbeet", "5", "5 Tomatoes"],
          ["Banana", "15", "15 Tomatoes"],
          ["Chili", "15", "15 Tomatoes"],
          ["Blueberry", "50", "50 Tomatoes"],
          ["Orange", "100", "100 Tomatoes"],
          ["Broccoli", "500", "500 Tomatoes"],
          ["Pineapple", "1000", "1000 Tomatoes"],
        ],
        note:
          "Use the Raid Calculator for the current total and next threshold; mixed beds hide value faster than labeled single-crop rows.",
      },
      {
        caption: "Potato-ammo floor for a failed farm lane",
        headers: ["Bot", "Normal HP", "Spudgun at 28", "Spud Shotgun at 64"],
        rows: [
          ["Totebot", "40", "2 hits", "1 full hit"],
          ["Tapebot", "40", "2 hits", "1 full hit"],
          ["Haybot", "100", "4 hits", "2 full hits"],
          ["Farmbot", "1500", "54 hits", "≈24 full hits"],
        ],
        note:
          "Reserve misses and retreat ammunition on top of the mathematical floor. Shotgun values assume full close-range damage.",
      },
      {
        caption: "When the farm is ready to automate",
        headers: ["Check", "Test size", "Pass condition"],
        rows: [
          ["Manual row", "8–12 soil plots", "Every plot can still be reached by bucket"],
          ["Water delivery", "1 Water Container + 1 Water Cannon", "Every plot changes to watered state"],
          ["Arm travel", "1–2 Pistons", "Dry pass clears crops and service lane"],
          ["Cycle control", "1 Controller + start control", "One trigger completes out-and-return"],
          ["Recovery", "Manual seed and bucket reserve", "Farm continues after the machine stops"],
        ],
      },
    ],
    sections: [
      {
        heading: "Plant by Value, Not by Soil Count",
        paragraphs: [
          "Ten Oranges contribute 1000 plant-value points, the same calculator weight as one Pineapple and one thousand Tomatoes. A small fruit patch can therefore demand a stronger night than a broad starter field. Label rows by crop and record the count before watering so the Raid Calculator receives real numbers.",
        ],
      },
      {
        heading: "Protect the Recovery Layer",
        bullets: [
          "Store spare seeds away from the crop approach and away from harvested produce.",
          "Keep a manual Water Bucket even after installing a Water System.",
          "Place the vehicle outside the kill lane; it is transport, not disposable cover.",
          "Use Metal-tier material on first-contact faces and scrap material behind it.",
        ],
      },
      {
        heading: "Build One Lit Kill Lane",
        steps: [
          "Walk the route from open terrain to the crop row before the warning.",
          "Block side approaches without removing the mechanic's escape path.",
          "Place hard peek cover where Tapebot shots cannot see the field center.",
          "Stage potatoes and food behind the firing position, not beside the crops.",
          "Repair the lane before replanting the next batch.",
        ],
      },
      {
        heading: "Watering Automation Is a Coverage Test",
        paragraphs: [
          "The FRM-03 watering baseline starts with 8–12 plots, one Water Container, one Water Cannon, two Pistons, a Controller, separate water and master controls, and an optional end Sensor. The number that matters is missed plots per pass. Speed increases only after a complete zero-miss cycle.",
        ],
      },
      {
        heading: "Harvest, Repair, Recalculate",
        steps: [
          "Clear all remaining bots and move drops out of the approach.",
          "Inspect walls, Pipes, Pistons, and storage connections.",
          "Return spare seeds only after the defense path is functional.",
          "Enter the next crop counts in the Raid Calculator.",
          "Expand one row or one automation stage—not both on the same untested night.",
        ],
      },
    ],
    relatedWiki: ["tomato", "potato", "pineapple", "water-bucket", "water-system", "vacuum-pump", "haybot", "tapebot", "farmbot"],
    relatedGuides: ["beginner-first-hours", "controller-and-logic", "warehouse-key-and-farmbot"],
    seo: {
      title: "Scrap Mechanic Farming and Raid Defense Guide",
      description:
        "Use exact Scrap Mechanic crop values, bot HP, potato ammo, an 8–12 plot watering baseline, protected seeds, and one tested raid lane before expanding the farm.",
      keywords: [
        "Scrap Mechanic farming guide",
        "Scrap Mechanic crop value",
        "Scrap Mechanic raid defense",
        "Scrap Mechanic farm automation",
        "Scrap Mechanic raid calculator",
      ],
    },
  },
  "warehouse-key-and-farmbot": {
    title: "Warehouse Route - Spudguns, Farmbots, Tapebots, and Trashbot",
    description:
      "A combat route with exact weapon damage, Farmbot key drops, Tapebot projectile pressure, Warehouse staging, and Trashbot phase rules.",
    category: "Survival",
    gameVersion: "1.0.3",
    updated: "2026-07-31",
    readingTime: "16 min",
    quickAnswer:
      "Budget at least 54 accurate Spudgun hits for a 1500 HP Farmbot, secure its guaranteed Warehouse Key, clear 40 HP Tapebots from hard cover, bank loot outside the entrance, and enter Trashbot phases ready for the eye-open damage window and five exposed-core hits.",
    media: [
      {
        src: "/images/wiki/farmbot.png",
        alt: "Farmbot image from Scrap Mechanic",
        caption:
          "Farmbot: 1500 HP, guaranteed Warehouse Key, 66.7% Component Kit roll, and 33.3% Circuit Board roll on Normal difficulty.",
      },
      {
        src: "/images/wiki/tapebot.png",
        alt: "Tapebot image from Scrap Mechanic",
        caption:
          "Tapebots have only 40 HP but deliver ranged pressure: Blue projectiles deal 55 damage and Red projectiles deal 62.",
      },
    ],
    tables: [
      {
        caption: "Weapon budget against a 1500 HP Farmbot",
        headers: ["Weapon", "Damage / potato cost", "Accurate hit floor", "Use condition"],
        rows: [
          ["Spudgun", "28 / 1 Potato", "54", "Safest range and predictable economy"],
          ["Spud Shotgun", "64 / 2 Potatoes", "≈24 full hits", "Only when full spread damage lands"],
          ["Spudling Gun", "20 / 1 Potato", "≈75 chunks", "Sustained fire after spin-up"],
          ["Mountable Spudgun", "28 / 1 Potato", "54", "Connected Potato Ammo Container required"],
        ],
        note:
          "Carry a miss and escape reserve beyond the hit floor. Losing the hauler costs more than waiting for another prepared pull.",
      },
      {
        caption: "Combat target and loot decisions",
        headers: ["Target", "Normal data", "Progression value", "Immediate action"],
        rows: [
          ["Farmbot", "1500 HP; kick 10; swipe 35", "Warehouse Key always", "Pick up the key before secondary loot"],
          ["Tapebot", "40 HP; Blue 55 / Red 62 damage", "Battery ≈35.7%; Kit ≈14.3%", "Clear one sightline at a time"],
          ["Haybot", "100 HP; poke 20; swing 30", "Scrap Metal always", "Do not spend Farmbot reserve unnecessarily"],
          ["Trashbot", "30 HP per phase before scaling", "Scripted boss progression", "Damage eye window, then land 5 core hits"],
        ],
      },
      {
        caption: "Trashbot arena timing",
        headers: ["State", "Data", "Player job"],
        rows: [
          ["Pattern active / eye closed", "No normal damage window", "Read projectile or shockwave path"],
          ["Eye open", "30 phase HP before player multiplier", "Use the preloaded firing lane"],
          ["Core exposed", "5 required core hits", "Keep one shooter line clear"],
          ["Stun window", "3 seconds", "Reload and reposition immediately"],
          ["Explosion event", "30-unit radius", "Leave the center before greed damage"],
        ],
        note:
          "The encounter tracks the maximum player count it has seen, so a co-op phase should not be budgeted like a fresh solo arena.",
      },
    ],
    sections: [
      {
        heading: "Stage the Route Before the Farmbot Pull",
        steps: [
          "Unlock or craft the chosen Spudgun and split combat potatoes from farm-defense potatoes.",
          "Park the cargo vehicle outside the Farmbot kite path.",
          "Carry healing food, Glowsticks, repair blocks, and one empty loot section.",
          "Choose open ground with no dead end behind the player.",
          "Count the ammunition again before firing the first shot.",
        ],
      },
      {
        heading: "Farmbot: The Key Is the Mandatory Drop",
        paragraphs: [
          "Every Normal Farmbot drops a Warehouse Key. Component Kits at 66.7% and Circuit Boards at 33.3% are additional rolls, not substitutes for the key. Pick the key up immediately; do not leave it exposed while chasing a smaller bot or repairing cosmetic vehicle damage.",
        ],
      },
      {
        heading: "Warehouse: Convert Rooms Into Single Angles",
        bullets: [
          "Peek from a hard corner; never fight from the center of an atrium.",
          "Blue Tapebot shots at 55 and Red shots at 62 can erase a bad open crossing quickly.",
          "Move valuable loot to an exterior chest between sections.",
          "Use Glowsticks to reveal the next angle, not only the floor under the player.",
          "Retreat to cleared space instead of backing into an unopened side room.",
        ],
      },
      {
        heading: "Do Not Treat Trashbot as a Larger Farmbot",
        paragraphs: [
          "Trashbot is controlled by attack patterns, eye state, phase health, and an exposed-core recovery sequence. Continuous fire into a closed eye wastes potatoes and hides the next projectile wall. Reload before the opening, deliver the phase damage, land five core hits, and reset movement space.",
        ],
      },
      {
        heading: "Extraction Is a Separate Phase",
        steps: [
          "Move keys and progression items to the exterior vehicle first.",
          "Unload the current section before opening optional rooms.",
          "Keep the return route lit and free of parked debris.",
          "Leave when healing or miss reserve reaches the route minimum.",
          "Repair and restock outside the combat structure.",
        ],
      },
    ],
    relatedWiki: ["spudgun", "spud-shotgun", "spudling-gun", "farmbot", "tapebot", "haybot", "trashbot", "glowstick"],
    relatedGuides: ["farming-basics", "achievements"],
    seo: {
      title: "Scrap Mechanic Warehouse, Farmbot and Trashbot Guide",
      description:
        "Plan Scrap Mechanic Warehouse combat with Farmbot ammo math, guaranteed keys, Tapebot damage, loot staging, and Trashbot phase and core data.",
      keywords: [
        "Scrap Mechanic Warehouse guide",
        "Scrap Mechanic Farmbot",
        "Scrap Mechanic Warehouse Key",
        "Scrap Mechanic Tapebot",
        "Scrap Mechanic Trashbot",
        "Scrap Mechanic Spudgun ammo",
      ],
    },
  },
  "first-vehicle": {
    title: "First Vehicle Guide - Exact Starter Chassis",
    description:
      "Build the VEH-01 starter car with a 10 × 16 footprint, 48-block frame, six bearings, four wheels, and repeatable steering and load tests.",
    category: "Building",
    updated: "2026-07-31",
    readingTime: "14 min",
    quickAnswer:
      "Build a low 10 × 16 ladder frame from 48 Wood Block Level 1, use six Bearings for four hubs and two steering pivots, start engine power low, and pass full-lock, ditch, rollover, and one-chest tests before adding bodywork.",
    media: [
      {
        src: "/images/wiki/bearing.webp",
        alt: "Bearing part icon from Scrap Mechanic",
        caption:
          "Six bearings define the starter chassis: four wheel hubs and two front steering pivots. Direction errors should be fixed before bodywork hides the connections.",
      },
      {
        src: "/images/wiki/connect-tool.webp",
        alt: "Connect Tool icon from Scrap Mechanic",
        caption:
          "Use the Connect Tool to separate steering bearings, drive bearings, engine throttle, and optional lights into readable groups.",
      },
    ],
    tables: [
      {
        caption: "VEH-01 starter bill",
        headers: ["Part", "Quantity", "Job"],
        rows: [
          ["Wood Block Level 1", "48", "Low ladder frame"],
          ["Bearing", "6", "4 wheel hubs + 2 steering pivots"],
          ["Wheel", "4", "Road contact"],
          ["Driver's Seat Level 1", "1", "Steering and throttle input"],
          ["Gas Engine Level 1", "1", "Drive power"],
          ["Switch", "1 optional", "Headlight control"],
          ["Headlight", "2 optional", "Night route visibility"],
          ["Large Chest", "1 maximum for first test", "Low-mounted cargo"],
        ],
      },
      {
        caption: "Frame and connection specification",
        headers: ["System", "Setting", "Pass condition"],
        rows: [
          ["Footprint", "10 × 16 blocks", "Symmetrical rails and three or more crossmembers"],
          ["Ground clearance", "2 blocks", "Shallow ditch crossed diagonally"],
          ["Steering", "Front pivots mirrored", "Both full-lock turns clear the frame"],
          ["Drive", "Rear-wheel or four-wheel", "All driven wheels agree on forward"],
          ["Power", "Low, then one step at a time", "No rollover or steering loss"],
          ["Payload", "Driver + one light chest", "Loaded return keeps steering authority"],
        ],
      },
      {
        caption: "Failure diagnosis",
        headers: ["Symptom", "Likely cause", "Specific correction"],
        rows: [
          ["Vehicle fights itself", "One drive bearing reversed", "Inspect arrows and reverse only that hub"],
          ["Turns opposite input", "Steering pivots not mirrored", "Reverse one front steering bearing"],
          ["Wheel rub at full lock", "Track too narrow or rail too close", "Widen front corners before reducing steering"],
          ["Flips after adding chest", "Mass above or behind wheelbase", "Move chest low and forward"],
          ["Beaches on road edge", "Clearance below 2 blocks", "Raise local frame without raising cargo"],
          ["Cannot recover", "Body covers all Lift points", "Leave exposed front and rear recovery pads"],
        ],
      },
    ],
    sections: [
      {
        heading: "Lay Out the 48-Block Frame",
        steps: [
          "Build two 16-block rails.",
          "Join them with at least three crossmembers.",
          "Keep seat, engine, and future chest inside the wheelbase.",
          "Leave both front corners open for steering travel.",
          "Mark one accessible Lift point at each end.",
        ],
      },
      {
        heading: "Install Six Bearings by Role",
        paragraphs: [
          "The four wheel bearings rotate for drive; the two front pivot bearings rotate for steering. Mixing those roles produces connections that look complete but behave unpredictably. Connect the seat only to the steering pivots and engine throttle, then connect the engine only to driven wheel hubs.",
        ],
      },
      {
        heading: "Commission the Empty Chassis",
        bullets: [
          "Drive straight and reverse without adding power.",
          "Complete a full-lock circle in both directions.",
          "Cross a shallow ditch diagonally.",
          "Tip the empty chassis in a safe area and recover it with the Lift.",
        ],
      },
      {
        heading: "Load One Chest, Then Repeat the Tests",
        paragraphs: [
          "A Large Chest changes mass distribution even when the body looks symmetrical. Mount it low, inside the wheelbase, and closer to the steering axle if the front tires lose authority. The first vehicle is complete when one light chest returns safely—not when every available part fits on the frame.",
        ],
      },
      {
        heading: "Upgrade by Route, Not by Decoration",
        bullets: [
          "Rough road: add four Off-Road Suspension units and retest rollover behavior.",
          "Long night route: protect fuel and add two Switch-controlled Headlights.",
          "Second chest: extend the wheelbase before loading it.",
          "Heavy tool head: move to a dedicated mining or harvesting chassis.",
        ],
      },
    ],
    relatedWiki: ["bearing", "connect-tool", "lift", "drivers-seat", "gas-engine", "large-chest", "suspension"],
    relatedGuides: ["beginner-first-hours", "controller-and-logic", "scrap-city-garage-blueprints"],
    seo: {
      title: "Scrap Mechanic First Vehicle - 10 × 16 Starter Car",
      description:
        "Build a Scrap Mechanic starter car with 48 blocks, 6 bearings, 4 wheels, exact connections, load tests, rollover recovery, and symptom-based steering fixes.",
      keywords: [
        "Scrap Mechanic first vehicle",
        "Scrap Mechanic starter car",
        "Scrap Mechanic bearing direction",
        "Scrap Mechanic car not steering",
        "Scrap Mechanic beginner build",
      ],
    },
  },
  "controller-and-logic": {
    title: "Controller and Automation Guide - Three Tested Machines",
    description:
      "Use exact part bills and commissioning tests for an 8–12 plot watering gantry, an 8 × 14 Vacuum Pump harvester, and a 6 × 6 Piston elevator.",
    category: "Building",
    updated: "2026-07-31",
    readingTime: "17 min",
    quickAnswer:
      "Prove movement with a manual control, then add one Controller sequence and one safety layer. Start with FRM-03 watering, FRM-08 harvesting, or LOG-09 lifting; each has a fixed baseline, a dry test, and a failure condition that must pass before automatic operation.",
    media: [
      {
        src: "/images/wiki/controller.webp",
        alt: "Controller part icon from Scrap Mechanic",
        caption:
          "The Controller owns positions and timing. It should not also be the only emergency stop or the only way to recover a jammed mechanism.",
      },
      {
        src: "/images/wiki/vacuum-pump.webp",
        alt: "Vacuum Pump part icon from Scrap Mechanic",
        caption:
          "A Vacuum Pump in In mode collects into connected storage; Out mode belongs to a separate, clearly labeled planting or delivery path.",
      },
    ],
    tables: [
      {
        caption: "FRM-03 automatic watering baseline",
        headers: ["Element", "Quantity / size", "Commissioning proof"],
        rows: [
          ["Crop row", "8–12 soil plots", "Every plot remains reachable manually"],
          ["Water Container", "1", "Cannon receives stored water"],
          ["Water Cannon", "1", "Fixed test waters one plot before motion"],
          ["Piston Level 1", "2", "Dry pass reaches both limits"],
          ["Controller Level 1", "1", "Slow out-and-return sequence"],
          ["Switch", "2", "Separate master stop and water enable"],
          ["Button", "1", "Starts one cycle, not continuous motion"],
          ["Sensor Level 1", "1 optional", "Confirms home position after manual success"],
        ],
      },
      {
        caption: "FRM-08 Vacuum Pump harvester baseline",
        headers: ["Element", "Quantity / size", "Commissioning proof"],
        rows: [
          ["Footprint", "8 × 14 blocks", "Fits the service lane without entering soil"],
          ["Metal Block Level 1", "56", "Low row-following chassis"],
          ["Wheels / Bearings", "4 / 6", "Slow travel with front steering"],
          ["Vacuum Pump", "1 in In mode", "One mature crop reaches storage"],
          ["Large Chest", "1 dedicated", "No seed or supply mixture"],
          ["Travel speed", "Lowest reliable pass", "One complete row with zero misses"],
        ],
      },
      {
        caption: "LOG-09 Piston elevator baseline",
        headers: ["Element", "Quantity / size", "Commissioning proof"],
        rows: [
          ["Platform", "6 × 6 blocks", "Off-center load stays guided"],
          ["Pistons", "4 in matched pairs", "Both sides reach equal height"],
          ["Controller", "1", "Repeats two fixed landings"],
          ["Buttons", "2", "One accessible from each landing"],
          ["Emergency Switch", "1 outside shaft", "Mid-travel stop remains recoverable"],
          ["Sensors / Logic Gates", "2 + 2 optional", "Added only after manual cycles pass"],
        ],
      },
      {
        caption: "Four responsibility rule",
        headers: ["Responsibility", "Parts", "Question to answer"],
        rows: [
          ["Motion", "Bearing / Piston", "What physically moves?"],
          ["Sequence", "Controller", "Which positions and timing are repeatable?"],
          ["Decision", "Sensor / Logic Gate", "When is movement allowed?"],
          ["Authority", "Switch / Button / Seat", "How does the player start and stop it?"],
          ["Recovery", "Manual control / service access", "How is a jam cleared with power off?"],
        ],
      },
    ],
    sections: [
      {
        heading: "Choose One Machine, Not One Box of Parts",
        paragraphs: [
          "The watering gantry removes repeated water passes, the Vacuum Pump harvester removes repeated pickup, and the Piston elevator solves vertical access. Their parts overlap, but their failure conditions do not. Build the machine whose measured bottleneck already exists.",
        ],
      },
      {
        heading: "Commission Manual Movement First",
        steps: [
          "Build the moving frame and check its complete physical envelope.",
          "Trigger motion from one manual control at the lowest speed.",
          "Add the Controller only after the frame clears every edge.",
          "Mark home, work, and stop states with paint.",
          "Test obstruction and lost power before adding Sensors.",
        ],
      },
      {
        heading: "Watering: Count Missed Plots",
        paragraphs: [
          "A fast arm that misses one of twelve plots has failed. Run the two Pistons dry, water one fixed plot, then combine motion and delivery. Adjust Cannon height or row spacing before increasing speed, and preserve a bucket route beside the gantry.",
        ],
      },
      {
        heading: "Harvesting: Protect Storage Meaning",
        paragraphs: [
          "The Pump must be in In mode and connected to one dedicated Large Chest. A planting output should use a different container and a visibly different control. The harvest pass gets faster only after the chest count matches the mature crop count.",
        ],
      },
      {
        heading: "Elevator: Stop Outside the Crush Zone",
        paragraphs: [
          "Four Pistons move the 6 × 6 platform in matched pairs, but the external emergency Switch is what makes a jam recoverable. Test an off-center block load and a mid-travel stop before a mechanic steps onto the platform.",
        ],
      },
      {
        heading: "Add Sensors Last",
        bullets: [
          "A Sensor confirms a state; it does not repair bad geometry.",
          "A Logic Gate should express one named condition, not hide an unexplained chain.",
          "Status lights should show home, moving, and fault states where the operator can see them.",
          "Every automatic cycle needs a manual stop and physical service access.",
        ],
      },
    ],
    relatedWiki: ["controller", "piston", "sensor", "logic-gate", "switch", "vacuum-pump", "water-system", "large-chest"],
    relatedGuides: ["first-vehicle", "farming-basics"],
    seo: {
      title: "Scrap Mechanic Controller and Automation Guide",
      description:
        "Build Scrap Mechanic watering, Vacuum Pump harvesting, and Piston elevator systems with exact parts, sizes, connections, recovery controls, and failure tests.",
      keywords: [
        "Scrap Mechanic Controller guide",
        "Scrap Mechanic automation",
        "Scrap Mechanic automatic watering",
        "Scrap Mechanic Vacuum Pump",
        "Scrap Mechanic Piston elevator",
        "Scrap Mechanic logic guide",
      ],
    },
  },
  "scrap-city-garage-blueprints": {
    category: "Progression",
    media: [
      {
        src: "/images/wiki/large-chest.webp",
        alt: "Large Chest icon from Scrap Mechanic",
        caption:
          "The Garage Chest uses 30 inventory slots and 256-item stacks. Sort it by the material bill, not by total item count.",
      },
      {
        src: "/images/wiki/component-kit.webp",
        alt: "Component Kit icon from Scrap Mechanic",
        caption:
          "Interactive and upgraded parts can make a compact blueprint materially expensive. The Garage still requires the exact included parts and quantities.",
      },
    ],
    relatedGuides: ["first-vehicle", "returning-to-1-0", "achievements"],
  },
  achievements: {
    category: "Progression",
    media: [
      {
        src: "/images/wiki/garment-box-common.webp",
        alt: "Common Garment Box icon from Scrap Mechanic",
        caption:
          "Sharp dressed mechanic depends on the full outfit set, so Garment Box processing should be tracked by missing slot rather than by box count alone.",
      },
      {
        src: "/images/wiki/farmbot-statue.webp",
        alt: "Farmbot statue icon from Scrap Mechanic",
        caption:
          "Farmbot smackdown is one of several combat goals that can share a route with Warehouse Keys, bot counters, and Survival progression.",
      },
    ],
    relatedGuides: ["warehouse-key-and-farmbot", "scrap-city-garage-blueprints", "returning-to-1-0"],
  },
};

const guideOrder = [
  "beginner-first-hours",
  "returning-to-1-0",
  "farming-basics",
  "warehouse-key-and-farmbot",
  "first-vehicle",
  "controller-and-logic",
  "scrap-city-garage-blueprints",
  "achievements",
];

const guidePool = [...coreGuides, ...supplementGuides];

export const guides: ArticleEntry[] = guideOrder.map((slug) => {
  const entry = guidePool.find((guide) => guide.slug === slug);

  if (!entry) {
    throw new Error(`Missing curated guide: ${slug}`);
  }

  return {
    ...entry,
    ...guideEnhancements[slug],
  };
});
