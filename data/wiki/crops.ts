import type { WikiEntry } from "@/data/types";
import { classicCropValues, cropGrowTimes } from "@/data/reference/combatStats";

const traderSeedTable = {
  caption: "Trader seed exchanges (Steam farming guide baselines)",
  headers: ["You receive", "You pay"],
  rows: [
    ["5 Banana Seeds", "3 Carrot Crates"],
    ["5 Orange Seeds", "3 Tomato Crates"],
    ["5 Blueberry Seeds", "3 Redbeet Crates"],
  ],
  note: "Crate-to-seed ratios follow the community Steam farming guide. Exact trader stock rotates—bring spare produce crates when shopping for fruit seeds.",
};

const seedCrateTable = {
  caption: "Seed drop chances from crates",
  headers: ["Seed group", "Green crate", "Golden crate"],
  rows: [
    ["Carrot / Redbeet / Tomato / Potato", "≈3.2%", "≈2.8%"],
    ["Banana / Orange / Blueberry", "—", "≈2.8%"],
  ],
  note: "Percentages are community Steam farming-guide figures. Broccoli, Pineapple, Cotton, and Chili seed sources vary—confirm in the live 1.0 client and trader inventory.",
};

export const cropEntries: WikiEntry[] = [
  {
    slug: "tomato",
    category: "crops",
    name: "Tomato",
    description:
      "The early Survival staple for food and trading crates—1.0 calculator value 1, 21-minute grow cycle, and the overview hub for classic versus modern raid math.",
    image: "/images/wiki/tomato.webp",
    imageAlt: "Tomato crop from Scrap Mechanic",
    gameVersion: "1.0",
    lastTested: "July 2026",
    featured: true,
    facts: [
      { label: "Grow time", value: "21 min (10.5 fertilized)" },
      { label: "Harvest amount", value: "1" },
      { label: "Extra watering", value: "No" },
      { label: "1.0 calculator value", value: "1" },
      { label: "Seed crates", value: "Green ≈3.2% / Golden ≈2.8%" },
      { label: "Trader role", value: "Tomato crates buy Orange seeds (5 seeds / 3 crates)" },
      { label: "Early niche", value: "Food + trading crate economy" },
      { label: "Raid posture", value: "Lowest plant-value band—safe for learning defense" },
    ],
    properties: [
      { label: "Seed", value: "Tomato Seed" },
      { label: "Requires", value: "Soil, water, seed" },
      { label: "Classic raid value", value: "1 (pre-1.0 tables)" },
      { label: "Best first plot", value: "Small row while testing watering and raid warnings" },
    ],
    tables: [cropGrowTimes, classicCropValues, seedCrateTable, traderSeedTable],
    sections: [
      {
        heading: "Why Tomato Anchors the Early Farm",
        paragraphs: [
          "Tomato sits at plant value 1 on the 1.0 Raid Calculator—the same floor as Potato—so it teaches watering and harvest rhythm without jumping raid tiers. Use it to fill cookpots and to bank Tomato Crates for later Orange seed trades.",
        ],
      },
      {
        heading: "Crate Odds and the Trading Ladder",
        paragraphs: [
          "Tomato Seeds appear in green crates (~3.2%) and golden crates (~2.8%). Once crates exist, the trader loop matters: three Tomato Crates exchange for five Orange Seeds. Planting tomatoes is therefore both supper and a ticket into fruit-seed progression.",
        ],
        bullets: [
          "Separate eating tomatoes from crate-bound produce.",
          "Store Tomato Seeds away from the active field.",
          "Check the Raid Calculator before replacing tomato rows with bananas or chilies.",
        ],
      },
      {
        heading: "Classic Values Versus the 1.0 Curve",
        paragraphs: [
          "Pre-1.0 tables treated Tomato like Carrot and Redbeet at raid value 1, while Potato sat at 1.5 and fruit at 2. The live calculator reweights everything—Tomato stays cheap (1), but Blueberry jumps to 50 and Pineapple to 1000. Read both tables on this page before trusting muscle memory from older guides.",
        ],
      },
      {
        heading: "Water Once, Harvest Promptly",
        paragraphs: [
          "At 21 real minutes (10.5 with fertilizer), Tomato matches the standard crop clock. Missed harvests waste soil time more than they raise risk—clear the row on schedule so the next seed cycle starts before night pressure peaks.",
        ],
        steps: [
          "Plant a row you can water in one pass.",
          "Fertilize only after the unfertilized cycle is proven.",
          "Move ripe tomatoes to food or crate storage the same session.",
        ],
      },
      {
        heading: "Grow-Time Hub for the Whole Farm",
        paragraphs: [
          "Use the shared grow-time table here when planning mixed fields: most crops share Tomato’s 21 / 10.5 timing, Potato yields five units, and Broccoli/Pineapple double the clock with a second watering unless fertilized. Tomato is the reference crop those exceptions deviate from.",
        ],
      },
    ],
    relatedSlugs: ["carrot", "potato", "orange", "fertilizer", "soil-bag", "water-bucket"],
    seo: {
      title: "Scrap Mechanic Tomato — Grow Time, Seeds & Raid Value 1",
      description:
        "Tomato farming in Scrap Mechanic 1.0: 21-minute grow time, calculator value 1, crate seed odds, trader Orange seed exchange, and classic vs modern raid tables.",
      keywords: [
        "Scrap Mechanic Tomato",
        "Tomato Seed",
        "Tomato raid value",
        "Scrap Mechanic farming",
        "Tomato grow time",
      ],
    },
  },
  {
    slug: "carrot",
    category: "crops",
    name: "Carrot",
    description:
      "Early food crop at calculator value 2—slightly spicier raid weight than Tomato, and the crate currency that unlocks Banana seeds at the trader.",
    image: "/images/wiki/carrot.webp",
    imageAlt: "Carrot crop from Scrap Mechanic",
    gameVersion: "1.0",
    lastTested: "July 2026",
    facts: [
      { label: "Grow time", value: "21 min (10.5 fertilized)" },
      { label: "Harvest amount", value: "1" },
      { label: "1.0 calculator value", value: "2" },
      { label: "Seed crates", value: "Green ≈3.2% / Golden ≈2.8%" },
      { label: "Trader role", value: "Carrot crates buy Banana seeds (5 seeds / 3 crates)" },
      { label: "Food role", value: "Reliable early nutrition row" },
      { label: "Raid note", value: "Twice Tomato’s plant value per plant" },
    ],
    properties: [
      { label: "Seed", value: "Carrot Seed" },
      { label: "Requires", value: "Soil, water, seed" },
      { label: "Classic raid value", value: "1" },
      { label: "Compared to Tomato", value: "Same grow clock; higher 1.0 plant value" },
    ],
    sections: [
      {
        heading: "Value 2 Changes Row Planning",
        paragraphs: [
          "Carrots grow on the same 21-minute clock as Tomatoes but score 2 on the 1.0 calculator. A wide carrot field raises raid pressure faster than an equally sized tomato patch—count plants against the Raid Calculator before doubling rows.",
        ],
      },
      {
        heading: "Carrot Crates Buy Banana Seeds",
        paragraphs: [
          "Three Carrot Crates trade for five Banana Seeds. That makes carrots the early bridge into mid-tier fruit: farm carrots intentionally when the next goal is bananas, not only when the cookpot is empty.",
        ],
        bullets: [
          "Bank crates separately from snack carrots.",
          "Do not eat the crate quota the night before a trader run.",
          "Replant enough carrots to replace what the trade consumed.",
        ],
      },
      {
        heading: "Seed Odds Match the Starter Pack",
        paragraphs: [
          "Carrot Seeds share the green (~3.2%) and golden (~2.8%) crate table with Tomato, Redbeet, and Potato. When a crate drops any of those four, decide immediately whether the seed goes into food rows or trading rows.",
        ],
      },
      {
        heading: "Straight Rows for Later Vacuum Work",
        paragraphs: [
          "Carrots are a common first automation test because they are cheap and frequent. Plant straight, leave a walking lane, and keep seed stock labeled so a Vacuum Pump experiment does not mix carrot and redbeet lines.",
        ],
        steps: [
          "Water the full row in one pass.",
          "Harvest into a carrot-only crate.",
          "Split the crate into food versus trader stacks.",
        ],
      },
      {
        heading: "Classic Muscle Memory Is Wrong Here",
        paragraphs: [
          "Older guides listed Carrot at raid value 1 beside Tomato. Under 1.0 calculator weights, Carrot is 2. Update spreadsheets and mental math before assuming a “small carrot farm” is still raid-invisible.",
        ],
      },
    ],
    relatedSlugs: ["tomato", "redbeet", "banana", "soil-bag", "water-bucket"],
    seo: {
      title: "Scrap Mechanic Carrot — Raid Value 2 & Banana Seed Trade",
      description:
        "Grow Carrots in Scrap Mechanic 1.0 for food and Carrot Crate trades (5 Banana Seeds for 3 crates), with calculator plant value 2. Verify it in-game.",
      keywords: [
        "Scrap Mechanic Carrot",
        "Carrot Seed",
        "Carrot Crate",
        "Banana Seed trade",
        "Scrap Mechanic farming",
      ],
    },
  },
  {
    slug: "redbeet",
    category: "crops",
    name: "Redbeet",
    description:
      "Mid-early produce at calculator value 5—five times a Tomato—and the crate currency that funds Blueberry seeds at the trader.",
    image: "/images/wiki/redbeet.webp",
    imageAlt: "Redbeet crop from Scrap Mechanic",
    gameVersion: "1.0",
    lastTested: "July 2026",
    facts: [
      { label: "Grow time", value: "21 min (10.5 fertilized)" },
      { label: "Harvest amount", value: "1" },
      { label: "1.0 calculator value", value: "5" },
      { label: "Seed crates", value: "Green ≈3.2% / Golden ≈2.8%" },
      { label: "Trader role", value: "Redbeet crates buy Blueberry seeds (5 seeds / 3 crates)" },
      { label: "Farm role", value: "Step-up produce between carrots and fruit" },
      { label: "Raid note", value: "Small fields climb raid bands quickly" },
    ],
    properties: [
      { label: "Seed", value: "Redbeet Seed" },
      { label: "Requires", value: "Soil, water, seed" },
      { label: "Classic raid value", value: "1" },
      { label: "1.0 jump", value: "From classic 1 → calculator 5" },
    ],
    sections: [
      {
        heading: "Five Plant-Value Points Per Beet",
        paragraphs: [
          "Redbeet’s 1.0 calculator value of 5 means ten plants already rival a much larger tomato field. Treat redbeet expansion as a conscious raid decision, not as free food variety.",
        ],
      },
      {
        heading: "Redbeet Crates Unlock Blueberries",
        paragraphs: [
          "Three Redbeet Crates exchange for five Blueberry Seeds. If blueberries are the next raid or cooking goal, schedule redbeet batches specifically to fund that trade instead of scattering mixed produce.",
        ],
        bullets: [
          "Label redbeet crates so they are not cooked by mistake.",
          "Complete the trader trip before planting the new blueberry row.",
          "Keep blueberry seeds out of the redbeet chest.",
        ],
      },
      {
        heading: "Same Clock, Different Budget",
        paragraphs: [
          "Grow time matches Tomato and Carrot (21 / 10.5). The difference is entirely in raid math and trader value. Fertilizer speeds the crate pipeline when you are racing toward a blueberry purchase.",
        ],
      },
      {
        heading: "Mixed-Row Labeling Discipline",
        paragraphs: [
          "Redbeets look like “just another root crop” beside carrots. Mis-harvested seeds stall both food and trader plans. One painted marker or chest color per root crop prevents the expensive mix-up.",
        ],
        steps: [
          "Assign a chest color to redbeet seeds and produce.",
          "Harvest the redbeet row alone before touching carrots.",
          "Update the Raid Calculator after each new redbeet planting.",
        ],
      },
      {
        heading: "Defense Before the Second Row",
        paragraphs: [
          "Because each plant is worth 5, the second redbeet row is where many farms meet stronger raid budgets. Confirm Spudgun ammo and approach walls before planting that expansion.",
        ],
      },
    ],
    relatedSlugs: ["carrot", "blueberry", "tomato", "spudgun", "fertilizer"],
    seo: {
      title: "Scrap Mechanic Redbeet — Value 5 & Blueberry Seed Trade",
      description:
        "Redbeet farming in Scrap Mechanic 1.0: calculator value 5, crate seed odds, and trading Redbeet Crates for Blueberry Seeds. Verify it in-game.",
      keywords: [
        "Scrap Mechanic Redbeet",
        "Redbeet Seed",
        "Redbeet raid value",
        "Blueberry Seed trade",
        "Scrap Mechanic farming",
      ],
    },
  },
  {
    slug: "potato",
    category: "crops",
    name: "Potato",
    description:
      "The ammo crop: calculator value 1 like Tomato, but harvest amount 5 per plant—Survival’s primary Spudgun economy engine.",
    image: "/images/wiki/potato.webp",
    imageAlt: "Potato crop from Scrap Mechanic",
    gameVersion: "1.0",
    lastTested: "July 2026",
    featured: true,
    facts: [
      { label: "Grow time", value: "21 min (10.5 fertilized)" },
      { label: "Harvest amount", value: "5" },
      { label: "1.0 calculator value", value: "1" },
      { label: "Seed crates", value: "Green ≈3.2% / Golden ≈2.8%" },
      { label: "Primary use", value: "Spudgun / Shotgun / Spudling ammunition" },
      { label: "Raid posture", value: "Low plant value; high strategic importance" },
      { label: "Planning rule", value: "Split seeds, defense ammo, and expedition ammo" },
    ],
    properties: [
      { label: "Seed", value: "Potato Seed" },
      { label: "Requires", value: "Soil, water, seed" },
      { label: "Classic raid value", value: "1.5" },
      { label: "Yield advantage", value: "5× harvest vs most crops’ single unit" },
    ],
    sections: [
      {
        heading: "Five Potatoes Per Plant Is the Whole Point",
        paragraphs: [
          "Most crops return one unit; Potato returns five on the same 21-minute clock. That yield is why potato fields fund Farmbot fights (≈58 Spudgun shots) and Warehouse clears without needing huge soil footprints.",
        ],
      },
      {
        heading: "Triple-Bucket Inventory",
        paragraphs: [
          "Never treat the harvest as one pile. Bucket one: seeds for the next cycle. Bucket two: base-defense magazine beside the farm lane. Bucket three: expedition loadout. Mixing those buckets is how a Warehouse run empties the farm’s only defense reserve.",
        ],
        bullets: [
          "Label chests Seeds / Defense / Expedition.",
          "Restock defense before filling the buggy.",
          "Count Farmbot pulls against the expedition bucket only.",
        ],
      },
      {
        heading: "Low Raid Value, High Operational Value",
        paragraphs: [
          "At calculator value 1, potatoes barely move raid tiers compared with bananas or oranges. You can plant a serious ammo field without the plant-value spike of fruit—use that asymmetry deliberately when defense is ready but high-value produce is not.",
        ],
      },
      {
        heading: "Weapon Family Demand Curve",
        paragraphs: [
          "Spudgun sips ammo; Spudling gulps it; Shotgun spends two potatoes per trigger for high close-range damage. Size the potato plot to the weapons you actually carry, not to a theoretical max fire rate.",
        ],
        steps: [
          "List the week’s planned fights (raids, ruins, Farmbots).",
          "Estimate potato spend from weapon choice.",
          "Plant one cycle ahead of that spend.",
        ],
      },
      {
        heading: "Classic 1.5 Versus Calculator 1",
        paragraphs: [
          "Older raid tables scored Potato at 1.5. The 1.0 calculator scores it at 1. If an outdated guide warns that potatoes spike raids, re-check with the live calculator—ammo fields are kinder on plant value than fruit fields of similar soil area.",
        ],
      },
    ],
    relatedSlugs: ["spudgun", "spud-shotgun", "spudling-gun", "tomato", "farmbot", "fertilizer"],
    seo: {
      title: "Scrap Mechanic Potato — Ammo Economy & Harvest ×5",
      description:
        "Potato farming for Spudgun ammo in Scrap Mechanic 1.0: harvest amount 5, calculator value 1, and how to split seeds vs combat stock. Check it in Survival.",
      keywords: [
        "Scrap Mechanic Potato",
        "potato ammo",
        "Spudgun farm",
        "Potato Seed",
        "Scrap Mechanic farming",
      ],
    },
  },
  {
    slug: "cotton-crop",
    category: "crops",
    name: "Cotton Crop",
    description:
      "A fabric and crafting resource plant—not a raid-primary food crop. Absent from the 1.0 Raid Calculator plant list; grow it for Cotton supply and garments, not for raid budgeting.",
    image: "/images/wiki/cotton-crop.webp",
    imageAlt: "Cotton crop from Scrap Mechanic",
    gameVersion: "1.0",
    lastTested: "July 2026",
    facts: [
      { label: "Grow time", value: "21 min (10.5 fertilized)" },
      { label: "Harvest amount", value: "1" },
      { label: "1.0 calculator value", value: "Not listed—resource/garment crop" },
      { label: "Output", value: "Cotton for crafting and garments" },
      { label: "Raid role", value: "Not raid-primary; do not plan plant value around it" },
      { label: "When to plant", value: "After food/ammo rows are stable" },
      { label: "Storage", value: "Keep Cotton separate from food produce crates" },
    ],
    properties: [
      { label: "Seed", value: "Cotton Seed" },
      { label: "Requires", value: "Soil, water, seed" },
      { label: "Compared to food crops", value: "Same grow clock; different economy" },
      { label: "Calculator note", value: "Omitted from on-site Raid Calculator crop list" },
    ],
    sections: [
      {
        heading: "Not a Raid Calculator Crop",
        paragraphs: [
          "Cotton does not appear among the 1.0 calculator plant values (Tomato through Pineapple). Do not estimate raid tiers from cotton rows. Plant it for fabric and crafting demand, while food and fruit rows own the raid math.",
        ],
      },
      {
        heading: "Garment and Crafting Pull",
        paragraphs: [
          "Natural world Cotton can cover occasional recipes. A dedicated cotton-crop row becomes worthwhile when garment work or repeat crafts create steady demand. Until then, soil is better spent on potatoes and tomatoes.",
        ],
        bullets: [
          "Track which recipes actually consume Cotton each session.",
          "Plant one test row before committing a full field.",
          "Do not displace ammo potatoes for vanity fabric stockpiles.",
        ],
      },
      {
        heading: "Same Water Clock, Different Chest",
        paragraphs: [
          "Cotton shares the 21 / 10.5 grow timing with standard food crops. Water it on the same pass if convenient, but harvest into a crafting chest—not into the trader produce crates used for fruit-seed exchanges.",
        ],
      },
      {
        heading: "Seed Hygiene Beside Food Rows",
        paragraphs: [
          "Cotton Seeds mixed into tomato or potato bags waste planting actions. Color-code the cotton seed pouch and keep harvested Cotton beside garment materials rather than cookpot inputs.",
        ],
        steps: [
          "Reserve a crafting-side chest for Cotton.",
          "Water with the food rows if the hose pass is shared.",
          "Restock Cotton Seeds only after checking garment project needs.",
        ],
      },
      {
        heading: "Defense Still Matters Around Resource Rows",
        paragraphs: [
          "Even without calculator plant value, bots path through whatever soil sits on the approach. Place cotton behind or beside defended food rows so a raid does not casually flatten your fabric supply while you fight on the tomato line.",
        ],
      },
    ],
    relatedSlugs: ["cotton", "soil-bag", "tomato", "potato", "fertilizer"],
    seo: {
      title: "Scrap Mechanic Cotton Crop — Fabric, Not Raid Value",
      description:
        "Grow Cotton Crop for crafting and garments in Scrap Mechanic. Not on the 1.0 Raid Calculator—plan fabric supply separately from food raid math.",
      keywords: [
        "Scrap Mechanic Cotton Crop",
        "Cotton Seed",
        "Scrap Mechanic Cotton",
        "garment farming",
        "Scrap Mechanic fabric",
      ],
    },
  },
  {
    slug: "banana",
    category: "crops",
    name: "Banana",
    description:
      "Mid-tier fruit at calculator value 15—matches Chili’s plant weight—and typically unlocked by trading Carrot Crates for Banana Seeds.",
    image: "/images/wiki/banana.webp",
    imageAlt: "Banana crop from Scrap Mechanic",
    gameVersion: "1.0",
    lastTested: "July 2026",
    facts: [
      { label: "Grow time", value: "21 min (10.5 fertilized)" },
      { label: "Harvest amount", value: "1" },
      { label: "1.0 calculator value", value: "15" },
      { label: "Seed source", value: "Golden crates ≈2.8%; trader via Carrot Crates" },
      { label: "Trader exchange", value: "5 Banana Seeds = 3 Carrot Crates" },
      { label: "Raid tier", value: "Mid fruit pressure" },
      { label: "Batch advice", value: "Plant for a known food or trade goal" },
    ],
    properties: [
      { label: "Seed", value: "Banana Seed" },
      { label: "Requires", value: "Soil, water, seed" },
      { label: "Classic raid value", value: "2" },
      { label: "1.0 jump", value: "Classic 2 → calculator 15" },
    ],
    sections: [
      {
        heading: "Fifteen Points Changes the Night",
        paragraphs: [
          "Each Banana scores 15 on the 1.0 calculator—fifteen Tomatoes of plant value in one soil tile. A casual double row can leap raid budgets. Open the Raid Calculator before the second watering can comes out.",
        ],
      },
      {
        heading: "From Carrot Crates to Banana Rows",
        paragraphs: [
          "Golden crates drop Banana Seeds around 2.8%, and the trader sells five Banana Seeds for three Carrot Crates. Build carrot surplus first; bananas are a purchased escalation, not a free early-field default.",
        ],
        bullets: [
          "Finish the carrot trade before clearing soil for bananas.",
          "Keep Banana Seeds labeled—fruit seeds look interchangeable in a hurry.",
          "Plant only the seed count you can defend this week.",
        ],
      },
      {
        heading: "Fruit Batch Logistics",
        paragraphs: [
          "Bananas spoil a plan when harvested into mixed fruit crates. Run banana-only storage until the batch is eaten, delivered, or traded. Vacuum lines should not merge bananas with blueberries until sorting exists.",
        ],
      },
      {
        heading: "Paired With Chili at Value 15",
        paragraphs: [
          "Chili also sits at calculator value 15. Choosing banana versus chili is about food/trade goals and seed access, not about raid weight—the plant values match. Diversify for cooking, not for “safer” raid math.",
        ],
        steps: [
          "Check total plant value with bananas added.",
          "Confirm ammo and walls for the new tier.",
          "Harvest the batch promptly so soil returns to lower-value crops if needed.",
        ],
      },
      {
        heading: "Classic Guides Understate the Spike",
        paragraphs: [
          "Pre-1.0 fruit values of 2 made bananas feel mild. Under calculator weights they are a mid-tier spike. Ignore classic fruit rankings when sizing 1.0 fields.",
        ],
      },
    ],
    relatedSlugs: ["carrot", "chili", "blueberry", "orange", "soil-bag"],
    seo: {
      title: "Scrap Mechanic Banana — Raid Value 15 & Seed Trades",
      description:
        "Banana farming in Scrap Mechanic 1.0: calculator value 15, golden-crate seeds, and trading 3 Carrot Crates for 5 Banana Seeds. Check it in Survival.",
      keywords: [
        "Scrap Mechanic Banana",
        "Banana Seed",
        "Banana raid value",
        "Carrot Crate trade",
        "Scrap Mechanic fruit",
      ],
    },
  },
  {
    slug: "blueberry",
    category: "crops",
    name: "Blueberry",
    description:
      "Fruit crop at calculator value 50—the jump from mid-tier bananas into serious raid budgeting, often funded by Redbeet Crate trades.",
    image: "/images/wiki/blueberry.webp",
    imageAlt: "Blueberry crop from Scrap Mechanic",
    gameVersion: "1.0",
    lastTested: "July 2026",
    facts: [
      { label: "Grow time", value: "21 min (10.5 fertilized)" },
      { label: "Harvest amount", value: "1" },
      { label: "1.0 calculator value", value: "50" },
      { label: "Seed source", value: "Golden crates ≈2.8%; trader via Redbeet Crates" },
      { label: "Trader exchange", value: "5 Blueberry Seeds = 3 Redbeet Crates" },
      { label: "Raid tier", value: "High mid-tier; few plants move thresholds" },
      { label: "Batch size", value: "Keep first plantings tiny" },
    ],
    properties: [
      { label: "Seed", value: "Blueberry Seed" },
      { label: "Requires", value: "Soil, water, seed" },
      { label: "Classic raid value", value: "2" },
      { label: "1.0 jump", value: "Classic 2 → calculator 50" },
    ],
    sections: [
      {
        heading: "Fifty Plant-Value Points Per Bush",
        paragraphs: [
          "One Blueberry equals fifty Tomatoes on the 1.0 calculator. Two or three plants can cross raid thresholds that entire tomato fields never reached. Plant count—not soil aesthetics—is the defense decision.",
        ],
      },
      {
        heading: "Fund Seeds With Redbeet Crates",
        paragraphs: [
          "Golden crates offer ~2.8% Blueberry Seed odds; the trader route spends three Redbeet Crates for five seeds. Schedule redbeet production as the blueberry wallet, then convert crates before the seeds sit unused.",
        ],
        bullets: [
          "Do not plant blueberries the same hour you still lack Spudgun reserves.",
          "Store Blueberry Seeds beside other golden-crate fruit seeds, labeled.",
          "Re-run the Raid Calculator after each new bush.",
        ],
      },
      {
        heading: "Traceable Batches Beat Pretty Mixed Beds",
        paragraphs: [
          "Blueberries in a rainbow fruit bed hide how much plant value you actually added. One labeled row and one matching chest make it obvious whether the next raid tier was intentional.",
        ],
      },
      {
        heading: "Harvest Windows and Escape Vehicles",
        paragraphs: [
          "At value 50, unfinished blueberry rows sitting overnight are expensive bait. Water on schedule, harvest when ripe, and keep the escape vehicle outside the raid footprint—not parked on the berry path.",
        ],
        steps: [
          "Add blueberries only after walls and ammo are ready.",
          "Harvest into a blueberry-only crate.",
          "Drop plant value again if the next goal does not need fruit.",
        ],
      },
      {
        heading: "Bridge Toward Oranges, Not Past Them Blindly",
        paragraphs: [
          "Blueberry (50) sits below Orange (100) but far above Banana (15). Use blueberries as a controlled bridge: learn the raid tier they create before unlocking orange-scale value.",
        ],
      },
    ],
    relatedSlugs: ["redbeet", "banana", "orange", "spudgun", "farmbot"],
    seo: {
      title: "Scrap Mechanic Blueberry — Raid Value 50 Guide",
      description:
        "Blueberry farming in Scrap Mechanic 1.0: calculator value 50, golden-crate seeds, and Redbeet Crate trader exchanges. Check the related systems first.",
      keywords: [
        "Scrap Mechanic Blueberry",
        "Blueberry Seed",
        "Blueberry raid value",
        "Redbeet Crate trade",
        "Scrap Mechanic fruit farming",
      ],
    },
  },
  {
    slug: "orange",
    category: "crops",
    name: "Orange",
    description:
      "High fruit crop at calculator value 100—transport and trader Tomato-Crate funding matter as much as watering once seeds are in hand.",
    image: "/images/wiki/orange.webp",
    imageAlt: "Orange crop from Scrap Mechanic",
    gameVersion: "1.0",
    lastTested: "July 2026",
    facts: [
      { label: "Grow time", value: "21 min (10.5 fertilized)" },
      { label: "Harvest amount", value: "1" },
      { label: "1.0 calculator value", value: "100" },
      { label: "Seed source", value: "Golden crates ≈2.8%; trader via Tomato Crates" },
      { label: "Trader exchange", value: "5 Orange Seeds = 3 Tomato Crates" },
      { label: "Raid tier", value: "High—single plants are budget events" },
      { label: "Logistics", value: "Design harvest → pack → haul before planting" },
    ],
    properties: [
      { label: "Seed", value: "Orange Seed" },
      { label: "Requires", value: "Soil, water, seed" },
      { label: "Classic raid value", value: "2" },
      { label: "1.0 jump", value: "Classic 2 → calculator 100" },
    ],
    sections: [
      {
        heading: "One Hundred Points Is a Raid Decision",
        paragraphs: [
          "A single Orange matches a hundred Tomatoes of calculator plant value. Planting “a few oranges for fun” is how farms meet raid levels they have not built for. Confirm the calculator total before the seeds touch soil.",
        ],
      },
      {
        heading: "Tomato Crates Buy the Seeds",
        paragraphs: [
          "Five Orange Seeds cost three Tomato Crates at the trader, with golden crates offering another ~2.8% seed chance. Early tomato farming literally pays for orange escalation—keep that pipeline honest instead of eating every tomato.",
        ],
        bullets: [
          "Bank Tomato Crates with orange seeds as the stated goal.",
          "Do not open orange rows until ammo chests are full.",
          "Separate orange produce from lower-value fruit in storage.",
        ],
      },
      {
        heading: "Design Backward From the Hauler",
        paragraphs: [
          "Oranges often exist to leave the farm. Before planting, know where ripe fruit sits, how the cargo vehicle turns, and which gate opens under raid pressure. A beautiful orange row against a dead-end wall fails the logistics test.",
        ],
        steps: [
          "Mark a harvest path wide enough for the vehicle.",
          "Stage a packing chest beside the row exit.",
          "Load cargo only after the route is clear of bots.",
        ],
      },
      {
        heading: "Still a 21-Minute Crop",
        paragraphs: [
          "Despite the raid weight, Orange uses the standard 21 / 10.5 grow clock—no double watering. The difficulty is political (raid budget), not horticultural. Fertilizer shortens the window you spend exposed at high plant value.",
        ],
      },
      {
        heading: "Step Below Broccoli Territory",
        paragraphs: [
          "Orange at 100 is the last common fruit before Broccoli (500) and Pineapple (1000) rewrite the farm’s threat model. Master orange-scale defense before touching those longer, double-water crops.",
        ],
      },
    ],
    relatedSlugs: ["tomato", "blueberry", "broccoli", "pineapple", "large-chest"],
    seo: {
      title: "Scrap Mechanic Orange — Raid Value 100 & Tomato Trades",
      description:
        "Orange farming in Scrap Mechanic 1.0: calculator value 100, golden-crate seeds, 3 Tomato Crates for 5 Orange Seeds, and haul logistics. Check it in Survival.",
      keywords: [
        "Scrap Mechanic Orange",
        "Orange Seed",
        "Orange raid value",
        "Tomato Crate trade",
        "Scrap Mechanic fruit",
      ],
    },
  },
  {
    slug: "broccoli",
    category: "crops",
    name: "Broccoli",
    description:
      "High-value 42-minute crop at calculator value 500—needs a second watering unless fertilized, and belongs only on farms already cleared for serious raid pressure.",
    image: "/images/wiki/broccoli.webp",
    imageAlt: "Broccoli crop from Scrap Mechanic",
    gameVersion: "1.0",
    lastTested: "July 2026",
    facts: [
      { label: "Grow time", value: "42 min (21 fertilized)" },
      { label: "Harvest amount", value: "1" },
      { label: "Extra watering", value: "Yes, unless fertilized" },
      { label: "1.0 calculator value", value: "500" },
      { label: "Raid tier", value: "Elite plant-value crop" },
      { label: "Classic note", value: "High-value (≥3) on pre-1.0 tables" },
      { label: "Prep rule", value: "Defense and water coverage before seeds" },
    ],
    properties: [
      { label: "Seed", value: "Broccoli Seed" },
      { label: "Requires", value: "Soil, water cycle discipline, seed" },
      { label: "Compared to Orange", value: "5× calculator value; 2× grow time" },
      { label: "Fertilizer effect", value: "Halves time and skips the extra watering requirement" },
    ],
    tables: [cropGrowTimes, classicCropValues],
    sections: [
      {
        heading: "Double Clock, Double Watering Tax",
        paragraphs: [
          "Broccoli takes 42 real minutes unfertilized and demands a second watering unless fertilizer is used. Miss the second water and you have spent soil and raid budget on a stalled plant. Build the watering habit—or budget fertilizer—before the first seed.",
        ],
      },
      {
        heading: "Five Hundred Plant-Value Points",
        paragraphs: [
          "At calculator value 500, one Broccoli equals five Oranges or five hundred Tomatoes. A single decorative broccoli in the front yard can rewrite the night’s raid level. Treat each plant as a deliberate threat event.",
        ],
        bullets: [
          "Run the Raid Calculator with the exact plant count.",
          "Do not “try one” beside an undefended starter shack.",
          "Keep spare seeds offline so a failed raid does not burn the only stock.",
        ],
      },
      {
        heading: "Fertilizer as a Safety Tool",
        paragraphs: [
          "Fertilizer cuts grow time to 21 minutes and removes the extra watering requirement. On broccoli, that is not a luxury speed-up—it is fewer hours of high plant value sitting in the open and fewer chances to miss a water tick.",
        ],
        steps: [
          "Confirm hose or irrigation coverage on the broccoli plot.",
          "Apply fertilizer when the unfertilized double-water loop is still unreliable.",
          "Harvest immediately and decide whether to replant or drop plant value.",
        ],
      },
      {
        heading: "Classic High-Value Flag Still Applies",
        paragraphs: [
          "Pre-1.0 tables already marked Broccoli as high-value (raid value 3). The 1.0 calculator amplifies that idea to 500. Old warnings about “high-value crops summoning worse nights” remain directionally true—only the numbers got louder.",
        ],
      },
      {
        heading: "Combat Lane Before Cosmetics",
        paragraphs: [
          "Broccoli rows need a kill lane, potato ammo, and a vehicle exit more than they need decorative lattice. If the defense rehearsal has not happened with orange-scale value, broccoli is premature.",
        ],
      },
    ],
    relatedSlugs: ["pineapple", "fertilizer", "orange", "farmbot", "potato"],
    seo: {
      title: "Scrap Mechanic Broccoli — Value 500 & Double Watering",
      description:
        "Broccoli in Scrap Mechanic 1.0: 42-minute grow time, second watering unless fertilized, calculator value 500, and high-raid preparation. Verify it in-game.",
      keywords: [
        "Scrap Mechanic Broccoli",
        "Broccoli Seed",
        "Broccoli raid value",
        "double watering",
        "Scrap Mechanic high value crop",
      ],
    },
  },
  {
    slug: "pineapple",
    category: "crops",
    name: "Pineapple",
    description:
      "Top calculator crop at plant value 1000 with the same 42-minute / double-water rules as Broccoli—advanced farms only, verified as a complete cycle before scaling.",
    image: "/images/wiki/pineapple.webp",
    imageAlt: "Pineapple crop from Scrap Mechanic",
    gameVersion: "1.0",
    lastTested: "July 2026",
    facts: [
      { label: "Grow time", value: "42 min (21 fertilized)" },
      { label: "Harvest amount", value: "1" },
      { label: "Extra watering", value: "Yes, unless fertilized" },
      { label: "1.0 calculator value", value: "1000" },
      { label: "Raid tier", value: "Maximum common plant-value crop" },
      { label: "Classic note", value: "High-value (≥3) beside Broccoli" },
      { label: "Scale rule", value: "One successful full cycle before a second plant" },
    ],
    properties: [
      { label: "Seed", value: "Pineapple Seed" },
      { label: "Requires", value: "Soil, disciplined watering, seed" },
      { label: "Compared to Broccoli", value: "Same grow rules; 2× calculator value (1000 vs 500)" },
      { label: "Best use", value: "Planned advanced batch with escape logistics" },
    ],
    tables: [cropGrowTimes, classicCropValues],
    sections: [
      {
        heading: "Thousand-Point Plants",
        paragraphs: [
          "Pineapple’s 1.0 calculator value is 1000—the top entry on the on-site crop list. One plant can dominate raid thresholds by itself. If broccoli felt expensive, pineapple is the intentional endgame produce decision.",
        ],
      },
      {
        heading: "Share Broccoli’s Clock and Water Tax",
        paragraphs: [
          "Unfertilized pineapples take 42 minutes and need a second watering. Fertilizer halves the clock to 21 and drops the extra water requirement. The horticulture is identical to broccoli; only the raid weight doubles.",
        ],
        bullets: [
          "Prove the double-water loop on broccoli or a single pineapple first.",
          "Prefer fertilizer when overnight exposure at value 1000 is unacceptable.",
          "Keep the grow-time table handy when mixing with 21-minute fruit.",
        ],
      },
      {
        heading: "One Complete Cycle Before Scaling",
        paragraphs: [
          "Plant one pineapple, finish every watering, defend the window, harvest it, and move it through the intended cargo or cooking path. Scale seed count only after that loop works without improvisation.",
        ],
        steps: [
          "Stage seeds, fertilizer, and ammo before planting.",
          "Complete watering ticks on a timer or alarm.",
          "Harvest, secure cargo, then decide on a second plant.",
        ],
      },
      {
        heading: "Classic High-Value Memory, Modern Numbers",
        paragraphs: [
          "Classic tables grouped Pineapple with Broccoli as high-value (3). Modern calculator math puts pineapple at 1000 versus broccoli’s 500. Use the shared classic and grow-time tables on this page when translating old guides into 1.0 planning.",
        ],
      },
      {
        heading: "Endgame Defense Is Non-Optional",
        paragraphs: [
          "Expect Tapebot- and Farmbot-tier pressure when plant value lives in the pineapple band. Metal-facing walls, potato reserves sized for heavy bots, and a clear kite lane are prerequisites—not upgrades you add after the first failed night.",
        ],
      },
    ],
    relatedSlugs: ["broccoli", "fertilizer", "orange", "farmbot", "tapebot", "potato"],
    seo: {
      title: "Scrap Mechanic Pineapple — Raid Value 1000 Guide",
      description:
        "Pineapple farming in Scrap Mechanic 1.0: calculator value 1000, 42-minute grow time, second watering unless fertilized, and full-cycle scaling rules.",
      keywords: [
        "Scrap Mechanic Pineapple",
        "Pineapple Seed",
        "Pineapple raid value",
        "high value crop",
        "Scrap Mechanic advanced farming",
      ],
    },
  },
  {
    slug: "chili",
    category: "crops",
    name: "Chili",
    description:
      "A 1.0 mid-tier plant-value spike at calculator value 15—on par with Banana—but with grow timing that should be verified in the live client before large plantings.",
    image: "/images/wiki/chili.webp",
    imageAlt: "Chili crop from Scrap Mechanic 1.0",
    gameVersion: "1.0",
    lastTested: "July 2026",
    featured: true,
    facts: [
      { label: "Introduced", value: "1.0 crop" },
      { label: "1.0 calculator value", value: "15" },
      { label: "Grow time", value: "Verify in live client" },
      { label: "Raid posture", value: "Mid-tier spike equal to Banana per plant" },
      { label: "Compared to Tomato", value: "15× plant value" },
      { label: "Compared to Blueberry", value: "Lower than 50; still far above starter crops" },
      { label: "Best use", value: "Controlled batches once defense matches value 15 rows" },
    ],
    properties: [
      { label: "Seed", value: "Chili Seed" },
      { label: "Requires", value: "Soil, water, seed (confirm cycle in client)" },
      { label: "Calculator peer", value: "Banana (also 15)" },
      { label: "Data confidence", value: "Plant value confirmed; grow timing pending client check" },
    ],
    sections: [
      {
        heading: "Value 15 Without Banana’s Crate Story",
        paragraphs: [
          "Chili matches Banana at calculator value 15, so raid math treats them as peers. Seed acquisition and cooking goals differ—chili is a 1.0 addition, not the old carrot-crate fruit ladder. Do not assume banana logistics automatically apply.",
        ],
      },
      {
        heading: "Mid-Tier Spike, Not Starter Garnish",
        paragraphs: [
          "Fifteen points per plant means a short chili row outpaces a large tomato field. Players who plant chili because “new crop” often meet raid budgets their hammer-and-scrap walls cannot hold. Check the Raid Calculator first.",
        ],
        bullets: [
          "Add chili only after carrot/tomato defense is boringly reliable.",
          "Keep spare Chili Seeds outside the active plot.",
          "Replant lower-value crops if a chili experiment overshoots the intended raid level.",
        ],
      },
      {
        heading: "Verify Grow Timing In-Client",
        paragraphs: [
          "Community grow-time dumps cover the classic set through pineapple; chili is called out as a 1.0 crop whose exact real-minute cycle should be confirmed live. Time one plant from water to harvest before scheduling multi-row automation.",
        ],
        steps: [
          "Plant a single chili beside a known 21-minute tomato control row.",
          "Note watering ticks and ripe time in real minutes.",
          "Scale rows only after the timing note is written down.",
        ],
      },
      {
        heading: "Raid-Pressure Framing Versus Food Ambition",
        paragraphs: [
          "Grow chili when the produce or cooking goal is explicit. If the only reason is seed availability, plant tomatoes or potatoes instead. Chili’s job on a prepared farm is controlled mid-tier value—not background decoration.",
        ],
      },
      {
        heading: "Sit Between Banana and Blueberry Decisions",
        paragraphs: [
          "At 15, chili is the same raid weight as banana and far below blueberry’s 50. Use it to practice mid-tier nights without jumping to berry-scale budgets—or swap one-for-one with bananas when recipe needs change but plant value must stay flat.",
        ],
      },
    ],
    relatedSlugs: ["banana", "blueberry", "tomato", "potato", "farmbot"],
    seo: {
      title: "Scrap Mechanic Chili — 1.0 Raid Value 15",
      description:
        "Chili in Scrap Mechanic 1.0: calculator plant value 15 (peer to Banana), mid-tier raid pressure framing, and grow time verification in the live client.",
      keywords: [
        "Scrap Mechanic Chili",
        "Chili Seed",
        "Chili raid value",
        "Scrap Mechanic 1.0 crop",
        "Scrap Mechanic farming",
      ],
    },
  },
];
