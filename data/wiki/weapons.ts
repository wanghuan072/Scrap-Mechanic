import type { WikiEntry } from "@/data/types";
import { potatoWeaponSummary } from "@/data/reference/combatStats";

export const weaponEntries: WikiEntry[] = [
  {
    slug: "spudgun",
    category: "weapons",
    name: "Spudgun",
    description:
      "The baseline handheld potato rifle: 28 damage per shot, 1 Potato per trigger, about 58 shots to drop a 1600 HP Farmbot, and the default answer for open-ground bot control.",
    image: "/images/wiki/spudgun.webp",
    imageAlt: "Spudgun weapon icon from Scrap Mechanic",
    gameVersion: "1.0",
    lastTested: "July 2026",
    featured: true,
    facts: [
      { label: "Damage", value: "28 per potato" },
      { label: "Ammo", value: "1 Potato / shot" },
      { label: "Farmbot kill estimate", value: "58 shots (1600 HP)" },
      { label: "Haybot kill estimate", value: "≈4 shots (100 HP)" },
      { label: "Totebot / Tapebot", value: "≈2 shots (40 HP)" },
      { label: "Extra behavior", value: "Can plant Potato crops if shot into soil" },
      { label: "Block interaction", value: "Destroys durability-1 blocks; triggers sensors/switches" },
    ],
    properties: [
      { label: "Aim", value: "Hold Right Mouse for sights zoom" },
      { label: "Unlock path (1.0)", value: "Main-quest schematic → Craftbot recipe" },
      { label: "Ammo crop", value: "Potato (harvest amount 5 / plant)" },
    ],
    tables: [potatoWeaponSummary],
    sections: [
      {
        heading: "When 28 Damage Is the Right Tool",
        paragraphs: [
          "Spudgun is the all-purpose mid-range option. It loses to Shotgun on Farmbot ammo efficiency at point-blank full damage, and it loses to Spudling when you need sustained spray—but it wins on predictable single-target control, aiming, and not dumping two potatoes per click.",
        ],
        bullets: [
          "Use it to peel Haybots off a crop lane without closing to hammer range.",
          "Keep a potato reserve equal to at least one Farmbot budget (58+) before Warehouse runs.",
          "Prioritize Red Explosive Totebots and Tapebots before cleaning chaff.",
        ],
      },
      {
        heading: "Ammo Economy Starts on the Potato Field",
        paragraphs: [
          "Potatoes harvest five per plant at calculator raid value 1, so ammo farms are cheap on raid math compared with fruit. Split inventory into seed stock, combat stock, and trade stock so a single Warehouse attempt cannot empty the seed chest.",
        ],
      },
      {
        heading: "Sights, Cover, and Knockback",
        paragraphs: [
          "ADS zoom helps on Tapebot angles. Potatoes apply light knockback and can detonate explosive canisters—treat those as environmental hazards, not free fireworks next to your hauler.",
        ],
      },
      {
        heading: "Unlock Versus Craft",
        paragraphs: [
          "In 1.0 the schematic reward and the finished gun are different states. Complete the Watchtower-linked main quest chain, confirm the recipe unlock, then craft and test-fire away from crops before the first Warehouse climb.",
        ],
        steps: [
          "Finish the schematic-granting main objective.",
          "Verify the Craftbot recipe is unlocked.",
          "Craft the gun plus a first 60+ potato stack.",
          "Test ADS and fire rate on a safe target dummy area.",
        ],
      },
    ],
    relatedSlugs: ["potato", "spud-shotgun", "spudling-gun", "farmbot", "tapebot"],
    seo: {
      title: "Scrap Mechanic Spudgun — 28 Damage & Ammo Math",
      description:
        "Spudgun stats for Scrap Mechanic: 28 damage, 1 Potato per shot, Farmbot 58-shot estimate, Haybot/Tapebot TTKs, and 1.0 unlock notes. Verify it in-game.",
      keywords: [
        "Scrap Mechanic Spudgun",
        "Scrap Mechanic Spud Gun damage",
        "Scrap Mechanic potato ammo",
        "Scrap Mechanic Farmbot shots",
      ],
    },
  },
  {
    slug: "spud-shotgun",
    category: "weapons",
    name: "Spud Shotgun",
    description:
      "Close-range fry spray: 64 total damage (16 × 4) for 2 Potatoes if every pellet connects—best Farmbot ammo efficiency in the potato family when you can stay near the target.",
    image: "/images/wiki/spud-shotgun.webp",
    imageAlt: "Spud Shotgun weapon icon from Scrap Mechanic",
    gameVersion: "1.0",
    lastTested: "July 2026",
    featured: true,
    facts: [
      { label: "Damage", value: "64 total (16 per fry × 4)" },
      { label: "Ammo", value: "2 Potatoes / shot" },
      { label: "Damage per potato", value: "32 at full connect" },
      { label: "Farmbot kill estimate", value: "≈25 full-damage shots" },
      { label: "Falloff", value: "Yes — long range wastes pellets" },
      { label: "Best niche", value: "Point-blank heavies and packed melee packs" },
    ],
    properties: [
      { label: "Vs Spudgun efficiency", value: "+4 damage per potato when all fries hit" },
      { label: "Farmbot potato cost", value: "≈50 potatoes (25×2) if no falloff" },
      { label: "Spudgun Farmbot cost", value: "≈58 potatoes" },
    ],
    tables: [potatoWeaponSummary],
    sections: [
      {
        heading: "Full Connect or It Is Not Efficient",
        paragraphs: [
          "The Shotgun only beats Spudgun on ammo when the fry spread lands. At falloff ranges you pay two potatoes for partial damage and lose the spreadsheet advantage. Fight from doorways, vehicle corners, and Farmbot flanks—not across open Warehouse atriums.",
        ],
      },
      {
        heading: "Farmbot Budget: ~50 Potatoes",
        paragraphs: [
          "At full damage, about 25 shots clear 1600 HP for roughly 50 potatoes—eight fewer than Spudgun and thirty fewer than Spudling. Bring that stack plus an escape reserve; do not start the pull on the last crate of fries.",
        ],
      },
      {
        heading: "Bad Rooms for Shotgun Pride",
        paragraphs: [
          "Tapebot hallways punish players who insist on closing distance. Clear or suppress ranged angles first, then use Shotgun for the heavy once the room geometry favors you.",
        ],
        bullets: [
          "Leave the cargo truck outside the fight footprint.",
          "Swap to Spudgun if the only safe angle is long.",
          "Do not chase a retreating Farmbot into pesticide clouds just to keep shotgun range.",
        ],
      },
    ],
    relatedSlugs: ["spudgun", "potato", "farmbot", "tapebot"],
    seo: {
      title: "Scrap Mechanic Spud Shotgun — 64 Damage Efficiency",
      description:
        "Compare Scrap Mechanic Spud Shotgun stats, including 64 damage for 2 Potatoes, falloff rules, and why about 25 full hits can defeat a Farmbot.",
      keywords: [
        "Scrap Mechanic Spud Shotgun",
        "Scrap Mechanic shotgun damage",
        "Scrap Mechanic Farmbot ammo",
      ],
    },
  },
  {
    slug: "spudling-gun",
    category: "weapons",
    name: "Spudling Gun",
    description:
      "Rapid-fire potato chunks at 20 damage each with spin-up/spin-down—high sustain and the worst Farmbot potato economy (~80 chunks) unless you need volume of fire.",
    image: "/images/wiki/spudling-gun.webp",
    imageAlt: "Spudling Gun weapon icon from Scrap Mechanic",
    gameVersion: "1.0",
    lastTested: "July 2026",
    facts: [
      { label: "Damage", value: "20 per chunk" },
      { label: "Fire mode", value: "Hold to fire after spin-up" },
      { label: "Farmbot kill estimate", value: "≈80 chunks (1600 HP)" },
      { label: "Ammo pressure", value: "Highest of the handheld potato guns" },
      { label: "Spin behavior", value: "Re-fire during spin-down skips full spin-up" },
    ],
    properties: [
      { label: "Best use", value: "Suppression and multi-target pressure with deep ammo" },
      { label: "Worst use", value: "Unplanned Farmbot pulls on a thin potato stack" },
    ],
    tables: [potatoWeaponSummary],
    sections: [
      {
        heading: "Spin-Up Is Part of the Fight Timer",
        paragraphs: [
          "Spudling does not instantly dump damage. Start the spin behind cover, then expose once the stream is live. Interrupting spin-up in the open against Tapebots is how players die holding an empty click.",
        ],
      },
      {
        heading: "Eighty Chunks Is a Logistics Decision",
        paragraphs: [
          "Farmbot math (~80 × 20) makes Spudling the expensive option. Prefer Shotgun or Spudgun for single heavies; keep Spudling for raid nights or packed melee when you already stocked a potato logistics chain.",
        ],
      },
      {
        heading: "Supply Discipline",
        bullets: [
          "Stage ammo chests near the defense lane, not only in the far warehouse.",
          "Call a magazine change before the gun clicks empty mid-pack.",
          "Do not strip the seed potato chest for one Spudling adventure.",
        ],
      },
    ],
    relatedSlugs: ["spudgun", "spud-shotgun", "potato", "haybot"],
    seo: {
      title: "Scrap Mechanic Spudling Gun — 20 Damage Rapid Fire",
      description:
        "Compare Scrap Mechanic Spudling Gun stats, including 20 damage per chunk, spin-up behavior, and the estimated Farmbot cost versus other Spudguns.",
      keywords: [
        "Scrap Mechanic Spudling Gun",
        "Scrap Mechanic gatling potato",
        "Scrap Mechanic rapid fire",
      ],
    },
  },
  {
    slug: "mountable-spudgun",
    category: "weapons",
    name: "Mountable Spudgun",
    description:
      "Vehicle- or base-mounted 28-damage potato turret that draws from a connected Potato Ammo Container—same damage as handheld Spudgun with logic-driven fire rates.",
    image: "/images/wiki/spudgun.webp",
    imageAlt: "Mountable Spudgun reference using Spudgun icon from Scrap Mechanic",
    gameVersion: "1.0",
    lastTested: "July 2026",
    facts: [
      { label: "Damage", value: "28 per potato (same as Spudgun)" },
      { label: "Ammo source", value: "Connected Potato Ammo Container" },
      { label: "Max fire pacing", value: "About 1 potato / 0.1 s when signaled hard" },
      { label: "Farmbot estimate", value: "58 potatoes at 28 damage" },
      { label: "Fails if", value: "No container link or empty ammo" },
    ],
    properties: [
      { label: "Control", value: "Activation signals / logic / seat wiring" },
      { label: "Defense role", value: "Raid lanes and vehicle turrets" },
    ],
    tables: [potatoWeaponSummary],
    sections: [
      {
        heading: "Container First, Turret Second",
        paragraphs: [
          "A Mountable Spudgun without a stocked, connected Potato Ammo Container is decoration. Wire the container, verify pull, then aim the mount at the raid approach—not at your own crop row.",
        ],
        steps: [
          "Mount the gun with clear firing arcs.",
          "Connect a Potato Ammo Container and fill it.",
          "Test activation from the intended seat or logic gate.",
          "Add a manual cutoff so a stuck signal cannot dump the whole farm ammo.",
        ],
      },
      {
        heading: "Logic Can Outrun Your Potato Farm",
        paragraphs: [
          "High signal rates approach one potato per 0.1 seconds. That clears Farmbots quickly and also empties containers before the next night. Cap automated fire with Sensors or timers aimed at actual bot presence.",
        ],
      },
      {
        heading: "Vehicle Turrets Versus Base Turrets",
        paragraphs: [
          "On vehicles, protect the ammo container inside the wheelbase. On bases, keep reload access outside the killbox so you are not restocking under Tapebot fire.",
        ],
      },
    ],
    relatedSlugs: ["spudgun", "potato", "sensor", "controller"],
    seo: {
      title: "Scrap Mechanic Mountable Spudgun — Turret Ammo Rules",
      description:
        "Review Scrap Mechanic Mountable Spudgun stats, Potato Ammo Container requirements, fire-rate limits, and practical setup for raid or vehicle turrets.",
      keywords: [
        "Scrap Mechanic Mountable Spudgun",
        "Scrap Mechanic turret",
        "Scrap Mechanic Potato Ammo Container",
      ],
    },
  },
  {
    slug: "cornade",
    category: "weapons",
    name: "Cornade",
    description:
      "Thrown explosive for clearing bad angles and grouped bots—high self-risk in tight rooms, best as a planned opener rather than a panic button next to loot.",
    image: "/images/wiki/cornade.webp",
    imageAlt: "Cornade explosive icon from Scrap Mechanic",
    gameVersion: "1.0",
    lastTested: "July 2026",
    featured: true,
    facts: [
      { label: "Type", value: "Thrown explosive" },
      { label: "Best use", value: "Blind corners, packed rooms, stuck heavies" },
      { label: "Main risk", value: "Self-damage and friendly creations" },
      { label: "Introduced", value: "1.0 combat toolkit expansion" },
    ],
    properties: [
      { label: "Vs Tapebot rooms", value: "Softens angles before peeks" },
      { label: "Vs Farmbot", value: "Suppplement to potato DPS, not a full substitute" },
    ],
    sections: [
      {
        heading: "Plan Bounce, Blast, and Retreat",
        paragraphs: [
          "Call the throw before you leave cover. Know where the Cornade can bounce, what loot sits in the blast, and which teammate is pushing. Enclosed Warehouse rooms amplify both the value and the mistake.",
        ],
        bullets: [
          "Do not throw past a teammate entering the same door.",
          "Pull fragile vehicles and open crates out of the radius.",
          "Use it to solve one dangerous angle, then finish with Spudgun or Shotgun.",
        ],
      },
      {
        heading: "When Potatoes Are Safer",
        paragraphs: [
          "If you already have clear LoS on a Farmbot in open ground, potato DPS is more controllable than a panic grenade. Save Cornades for geometry problems—stairwells, roof lips, and Tapebot nests.",
        ],
      },
      {
        heading: "Raid Lane Use",
        paragraphs: [
          "On farms, a Cornade can break a clustered Totebot/Haybot pile at the choke—but only if the choke is not also your watering pipes and Craftbot. Build the killbox so explosives have a designated pit.",
        ],
      },
    ],
    relatedSlugs: ["spudgun", "tapebot", "farmbot", "glowstick"],
    seo: {
      title: "Scrap Mechanic Cornade — Explosive Angle Control",
      description:
        "Use the Scrap Mechanic Cornade for Warehouse angles and clustered bots without destroying loot, teammates, or farm machines. Verify it in-game.",
      keywords: [
        "Scrap Mechanic Cornade",
        "Scrap Mechanic grenade",
        "Scrap Mechanic 1.0 explosive",
      ],
    },
  },
];
