export const versionComparisons = [
  {
    area: "Survival story",
    before: "The Early Access Survival sandbox had opening objectives and progression systems, but not a complete beginning-to-end campaign.",
    now: "1.0 ships a complete Survival story about the crash and the rogue farmbots, with fully voiced NPCs and an ending.",
    impact: "The Logbook now carries a long main-quest route instead of only teaching the opening systems.",
  },
  {
    area: "World and locations",
    before: "Players explored the earlier generated farmland, roads, ruins, Warehouses, Packing Stations, and trading route.",
    now: "The world overhaul adds Growlabs, reworked ruins, expanded roads, desert and forest routes, random NPC encounters, weather hazards, and new story locations.",
    impact: "Old route knowledge still helps, but another player's exact terrain is not a universal map for a new 1.0 world.",
  },
  {
    area: "Mining",
    before: "Resource machines mainly processed trees and surface rocks with drills, saws, collectors, and refining equipment.",
    now: "Drilling Thunder adds Excavation Island, abandoned underground mines, Plasma Drills, mining infrastructure, and rare finds below the surface.",
    impact: "Mining becomes a distinct exploration and vehicle-design problem with underground threats and cargo planning.",
  },
  {
    area: "Bots and combat",
    before: "Survival was built around five established bot types and familiar raid pressure.",
    now: "The number of enemy types more than doubles. New threats include explosive, flying, underwater, ranged, and digging behavior.",
    impact: "Target priority, roof protection, water routes, fire safety, and ranged coverage matter more than a single wall.",
  },
  {
    area: "Building and terrain",
    before: "Players built with the previous block and interactive-part library on terrain that could not be freely reshaped.",
    now: "1.0 adds many blocks and interactive parts, makes the new set available in Creative, and introduces the Claygun for terrain shaping.",
    impact: "Terrain is now part of a build, but bots that can dig mean clay is not guaranteed defense.",
  },
  {
    area: "Recipes and progression",
    before: "Crafting progression centered on stations, materials, upgrades, traders, and the established recipe set.",
    now: "Crafting and resources are rebalanced, some recipes are unlocked through Schematic Boxes and the Schematicbot, and Builder quests teach construction.",
    impact: "Having the materials may not be enough; first confirm that the required recipe has been unlocked.",
  },
  {
    area: "Visuals and performance",
    before: "The Early Access renderer and multiplayer networking carried the older lighting, weather, water, and connected-player behavior.",
    now: "The release includes broad optimization, improved network responsiveness, dynamic lighting with up to 512 lights, volumetric clouds, weather, water, grass, and material improvements.",
    impact: "Returning players should recheck graphics settings and test heavy creations in multiplayer instead of assuming old performance.",
  },
  {
    area: "Quality of life",
    before: "Loot collection, block placement, engine adjustment, and manual watering used the earlier interaction rules.",
    now: "Large Chests collect nearby loot bubbles, force-place expands build placement, engine power can be nudged while driving, and Buckets can fill from Water Containers.",
    impact: "Common farm, vehicle, and recovery chores require fewer repeated manual steps.",
  },
];

export const releaseSystems = [
  {
    number: "01",
    title: "Story and NPCs",
    copy: "A voiced campaign gives Survival a defined route from the crashed ship through the final departure, while side quests add build and supply assignments.",
  },
  {
    number: "02",
    title: "Drilling Thunder",
    copy: "Excavation Island and abandoned mines create a second resource frontier built around drilling rigs, underground travel, rare valuables, and new enemies.",
  },
  {
    number: "03",
    title: "World overhaul",
    copy: "New Growlabs, roads, terrain, ruins, bridges, weather events, and encounters expand how a generated world is read and navigated.",
  },
  {
    number: "04",
    title: "New bot roster",
    copy: "The Survival enemy roster more than doubles. The Red Explosive Totebot is specifically identified by the developers as a high-priority combat target.",
  },
  {
    number: "05",
    title: "Claygun and new parts",
    copy: "The Claygun reshapes terrain in Survival and Creative, while a large new building set expands vehicles, machines, defenses, and decoration.",
  },
  {
    number: "06",
    title: "Schematics and Garage",
    copy: "Schematic progression gates selected recipes, and the Scrap City Garage provides a supported path for using creations across the building modes described by the release.",
  },
  {
    number: "07",
    title: "Survival rebalance",
    copy: "Resource collection, crafting, food, health, perks, and raids were revised so returning players need to relearn more than the story route.",
  },
  {
    number: "08",
    title: "Technical upgrade",
    copy: "Visual rendering, weather, materials, performance, and multiplayer responsiveness all receive major work in the full release.",
  },
];

export const compatibilityDecisions = [
  {
    case: "Old Survival world",
    answer: "Use an older Steam branch",
    detail: "The 1.0 world and story changes are not compatible with old Survival saves. Back up the world before changing branches.",
  },
  {
    case: "Old Creative world",
    answer: "Supported, but back it up",
    detail: "The official release says old Creative worlds can load. Preserve important creations before the first 1.0 save.",
  },
  {
    case: "Parts mod",
    answer: "Needs an explicit check",
    detail: "The developers warn that Parts mods are among the categories most likely to require a 1.0 update.",
  },
  {
    case: "Custom Game",
    answer: "Needs an explicit check",
    detail: "Custom Games may depend on old scripts, recipes, or world behavior. Test on the exact branch named by the author.",
  },
  {
    case: "Workshop blueprint",
    answer: "Inspect dependencies first",
    detail: "A blueprint may load only when all required parts mods are present and compatible with the current branch.",
  },
];

export const releaseFacts = [
  {
    value: "512",
    label: "dynamic lights",
    detail: "Maximum on-screen figure stated for the new lighting system.",
  },
  {
    value: "5 → 10+",
    label: "Survival bot types",
    detail: "The official notes say the previous five-type roster more than doubles.",
  },
  {
    value: "3",
    label: "launch patches",
    detail: "Versions 1.0.1, 1.0.2, and 1.0.3 followed the full release.",
  },
  {
    value: "30 GB",
    label: "storage required",
    detail: "The published minimum and recommended PC requirement.",
  },
];

export const updateVisuals = [
  {
    number: "01",
    eyebrow: "Campaign",
    title: "A complete voiced Survival story",
    image: "/images/updates/story-and-npcs.webp",
    imageAlt: "Official Scrap Mechanic 1.0 story and voiced NPC screenshot",
    fact: "Beginning-to-end story",
    copy: "The Logbook now supports a full route from the crash through the Farming Planet mystery and a defined ending, with voiced NPCs and main-quest progression.",
  },
  {
    number: "02",
    eyebrow: "Generated world",
    title: "New roads, Growlabs, ruins, and hazards",
    image: "/images/updates/world-overhaul.webp",
    imageAlt: "Official Scrap Mechanic 1.0 world overhaul screenshot",
    fact: "Routes are seed-dependent",
    copy: "New forest roads, desert terrain, bridges, Growlabs, reworked ruins, random NPC encounters, and tornadoes make old navigation knowledge useful but not universally mappable.",
  },
  {
    number: "03",
    eyebrow: "Building",
    title: "A larger parts library in both modes",
    image: "/images/updates/new-building-parts.webp",
    imageAlt: "Official Scrap Mechanic 1.0 new building parts screenshot",
    fact: "Creative access from launch",
    copy: "The release adds a large set of blocks, parts, and interactive parts, and makes the new building set available in Creative without Survival progression.",
  },
  {
    number: "04",
    eyebrow: "Combat",
    title: "The enemy roster more than doubles",
    image: "/images/updates/new-enemies.webp",
    imageAlt: "Official Scrap Mechanic 1.0 new enemy bots screenshot",
    fact: "5 previous types → more than 10",
    copy: "Flying, explosive, underwater, ranged, and digging threats change base design. The developers specifically call the Red Explosive Totebot a priority target.",
  },
  {
    number: "05",
    eyebrow: "Terrain",
    title: "The Claygun turns ground into a build system",
    image: "/images/updates/claygun.webp",
    imageAlt: "Official Scrap Mechanic 1.0 Claygun terrain shaping screenshot",
    fact: "Survival + Creative",
    copy: "Players can reshape terrain in both modes, but digging bots prevent clay walls from becoming a guaranteed raid defense.",
  },
  {
    number: "06",
    eyebrow: "Graphics",
    title: "Dynamic lighting without ray tracing",
    image: "/images/updates/visual-upgrade.webp",
    imageAlt: "Official Scrap Mechanic 1.0 visual upgrade screenshot",
    fact: "Up to 512 lights on screen",
    copy: "The visual overhaul combines dynamic lights, volumetric sunlight and clouds, weather, water, reactive grass, and a new material system.",
  },
];
