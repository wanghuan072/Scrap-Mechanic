import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const gameRoot =
  process.env.SCRAP_MECHANIC_DATA ??
  String.raw`\\192.168.2.2\共享文件\Scrap Mechanic`;
const survivalRoot = path.join(gameRoot, "Survival");

function withoutLineComments(value) {
  return value
    .split(/\r?\n/)
    .map((line) => line.replace(/\/\/.*$/, ""))
    .join("\n");
}

async function readJson(filePath) {
  return JSON.parse(withoutLineComments(await readFile(filePath, "utf8")));
}

function collectRewards(groups, predicate) {
  return new Set(
    groups.flatMap((group) =>
      (group.rewards ?? [])
        .filter(predicate)
        .map((reward) => reward.item)
        .filter(Boolean),
    ),
  );
}

function symbolsFromLuaList(source, declaration) {
  const start = source.indexOf(declaration);
  if (start < 0) throw new Error(`Could not find ${declaration}`);
  const tail = source.slice(start);
  const body = tail.slice(tail.indexOf("{") + 1, tail.indexOf("\n}"));
  return [...body.matchAll(/ITEMS\.([a-zA-Z0-9_]+)/g)].map(
    (match) => match[1],
  );
}

function assertCount(label, value, expected) {
  if (value !== expected) {
    throw new Error(`${label}: expected ${expected}, received ${value}`);
  }
}

const itemsSource = await readFile(
  path.join(survivalRoot, "Scripts", "game", "survival_items.lua"),
  "utf8",
);
const itemUuidBySymbol = new Map(
  [...itemsSource.matchAll(
    /([a-zA-Z0-9_]+)\s*=\s*sm\.uuid\.new\(\s*"([a-f0-9-]{36})"\s*\)/g,
  )].map((match) => [match[1], match[2]]),
);
const uuidFor = (symbol) => {
  const uuid = itemUuidBySymbol.get(symbol);
  if (!uuid) throw new Error(`Unknown item symbol: ${symbol}`);
  return uuid;
};

const recipeManagerSource = await readFile(
  path.join(survivalRoot, "Scripts", "game", "managers", "RecipeManager.lua"),
  "utf8",
);
const defaultUnlocked = new Set(
  symbolsFromLuaList(recipeManagerSource, "local DefaultUnlockedItems").map(
    uuidFor,
  ),
);

const craftbotDirectory = path.join(survivalRoot, "CraftingRecipes", "craftbot");
const craftbotFiles = (await readdir(craftbotDirectory))
  .filter((fileName) => fileName.endsWith(".json"))
  .sort();
const craftbotRecipes = (
  await Promise.all(
    craftbotFiles.map((fileName) =>
      readJson(path.join(craftbotDirectory, fileName)),
    ),
  )
).flat();
const sawTableRecipes = await readJson(
  path.join(survivalRoot, "CraftingRecipes", "sawtable.json"),
);
const recipeOutputs = new Set(
  [...craftbotRecipes, ...sawTableRecipes]
    .map((recipe) => recipe.itemId)
    .filter(Boolean),
);
const coreOutputs = new Set(
  (
    await readJson(
      path.join(craftbotDirectory, "craftbot_core.json"),
    )
  ).map((recipe) => recipe.itemId),
);

const traderRecipes = [
  ...(await readJson(
    path.join(survivalRoot, "CraftingRecipes", "hideout.json"),
  )),
  ...(await readJson(
    path.join(survivalRoot, "CraftingRecipes", "mininghubTrader.json"),
  )),
];
const traderUnlocks = new Set(
  traderRecipes
    .filter((recipe) => recipe.schematic)
    .map((recipe) => recipe.itemId),
);

const tradeGroups = await readJson(
  path.join(
    survivalRoot,
    "ScriptJsonFiles",
    "Trader",
    "trader.tradegroup",
  ),
);
const traderQuestUnlocks = collectRewards(
  tradeGroups.questGroups ?? [],
  (reward) => reward.unlockCraftBot === true,
);

const questCollection = await readJson(
  path.join(
    survivalRoot,
    "ScriptableObjects",
    "scriptableObjectSets",
    "sob_quests.sobset",
  ),
);
const storyQuestUnlocks = new Set(
  questCollection.scriptableObjectList.flatMap((quest) =>
    (quest.data?.rewards ?? [])
      .filter((reward) => reward.type === "schematic")
      .map((reward) => uuidFor(reward.name)),
  ),
);
const questUnlocks = new Set([...traderQuestUnlocks, ...storyQuestUnlocks]);

const growlabUnlocks = new Set(
  [
    "obj_container_chest_looting",
    "obj_interactive_beehive",
    "obj_interactive_freezer",
    "tool_shotgun",
    "obj_interactive_thruster_01",
    "obj_container_XXL_chest",
    "obj_rewards_fireworks",
  ].map(uuidFor),
);
const treasureUnlocks = new Set(
  [
    "obj_resource_refinedcoralium",
    "obj_resource_refinednimbolium",
    "obj_resource_refinedlemonium",
    "obj_resource_refinedsapphire",
    "obj_resource_refinedcrystal",
  ].map(uuidFor),
);
const specialUnlocks = new Set([uuidFor("obj_interactive_plasmadrill_lvl1")]);

const dedicated = new Set([
  ...traderUnlocks,
  ...questUnlocks,
  ...growlabUnlocks,
  ...treasureUnlocks,
  ...specialUnlocks,
]);

const routeSets = {
  trader: traderUnlocks,
  quest: questUnlocks,
  growlab: growlabUnlocks,
  treasure: treasureUnlocks,
  special: specialUnlocks,
};
const routeByOutput = {};
for (const uuid of [...recipeOutputs].sort()) {
  let route = Object.entries(routeSets).find(([, set]) => set.has(uuid))?.[0];
  if (!route) {
    route = defaultUnlocked.has(uuid)
      ? "default"
      : coreOutputs.has(uuid)
        ? "core"
        : "schematicbot";
  }
  routeByOutput[uuid] = route;
}

const routeCounts = Object.values(routeByOutput).reduce((counts, route) => {
  counts[route] = (counts[route] ?? 0) + 1;
  return counts;
}, {});
const sawTableInSchematicbotPool = new Set(
  sawTableRecipes
    .map((recipe) => recipe.itemId)
    .filter((uuid) => routeByOutput[uuid] === "schematicbot"),
).size;

assertCount("Craftbot and Saw Table outputs", recipeOutputs.size, 573);
assertCount("Schematicbot pool", routeCounts.schematicbot, 356);
assertCount("Dedicated routes", dedicated.size, 120);
assertCount("Default unlocked", routeCounts.default, 73);
assertCount("Core recipes", routeCounts.core, 24);
assertCount("Trader offers", routeCounts.trader, 42);
assertCount("Trader quest unlocks", traderQuestUnlocks.size, 18);
assertCount("Story quest unlocks", storyQuestUnlocks.size, 47);
assertCount("Combined quest unlocks", routeCounts.quest, 65);
assertCount("Growlab unlocks", routeCounts.growlab, 7);
assertCount("Treasure unlocks", routeCounts.treasure, 5);
assertCount("Special unlocks", routeCounts.special, 1);
assertCount("Saw Table scan-pool outputs", sawTableInSchematicbotPool, 30);

const result = {
  checkedVersion: "1.0.2",
  counts: {
    craftbotSawTableOutputs: recipeOutputs.size,
    schematicbot: routeCounts.schematicbot,
    dedicated: dedicated.size,
    default: routeCounts.default,
    core: routeCounts.core,
    trader: routeCounts.trader,
    traderQuest: traderQuestUnlocks.size,
    storyQuest: storyQuestUnlocks.size,
    quest: routeCounts.quest,
    growlab: routeCounts.growlab,
    treasure: routeCounts.treasure,
    special: routeCounts.special,
    sawTableInSchematicbotPool,
  },
  routeByOutput,
};

await writeFile(
  path.join("data", "game", "recipe-unlocks.json"),
  `${JSON.stringify(result, null, 2)}\n`,
  "utf8",
);
console.log(JSON.stringify(result.counts, null, 2));
