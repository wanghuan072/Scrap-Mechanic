import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const projectRoot = process.cwd();
const gameRoot =
  process.env.SCRAP_MECHANIC_GAME_DIR ??
  "\\\\192.168.2.2\\共享文件\\Scrap Mechanic";
const checkedVersion = "1.0.1.869";

const recipeRoot = path.join(gameRoot, "Survival", "CraftingRecipes");
const outputDataDir = path.join(projectRoot, "data", "game");
const outputImageDir = path.join(
  projectRoot,
  "public",
  "images",
  "game-items",
);

function stripJsonComments(input) {
  let output = "";
  let inString = false;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (let index = 0; index < input.length; index += 1) {
    const current = input[index];
    const next = input[index + 1];

    if (lineComment) {
      if (current === "\n") {
        lineComment = false;
        output += current;
      }
      continue;
    }

    if (blockComment) {
      if (current === "*" && next === "/") {
        blockComment = false;
        index += 1;
      }
      continue;
    }

    if (!inString && current === "/" && next === "/") {
      lineComment = true;
      index += 1;
      continue;
    }

    if (!inString && current === "/" && next === "*") {
      blockComment = true;
      index += 1;
      continue;
    }

    output += current;

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (current === "\\") {
        escaped = true;
      } else if (current === '"') {
        inString = false;
      }
    } else if (current === '"') {
      inString = true;
    }
  }

  return output;
}

async function readJson(filePath) {
  const input = await fs.readFile(filePath, "utf8");
  return JSON.parse(stripJsonComments(input.replace(/^\uFEFF/, "")));
}

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}

function isPlayerFacingTitle(title) {
  return (
    typeof title === "string" &&
    title.trim().length > 0 &&
    !/^(obj_|blk_|jnt_|harvest_|character_|uuid_)/i.test(title)
  );
}

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

const descriptionFiles = [
  path.join(
    gameRoot,
    "Data",
    "Gui",
    "Language",
    "English",
    "InventoryItemDescriptions.json",
  ),
  path.join(
    gameRoot,
    "ChallengeData",
    "Gui",
    "Language",
    "English",
    "inventoryDescriptions.json",
  ),
  path.join(
    gameRoot,
    "Survival",
    "Gui",
    "Language",
    "English",
    "inventoryDescriptions.json",
  ),
  path.join(
    gameRoot,
    "Data",
    "Gui",
    "Language",
    "English",
    "CustomizationDescriptions.json",
  ),
];

const descriptions = new Map();
for (const filePath of descriptionFiles) {
  const records = await readJson(filePath);
  for (const [uuid, record] of Object.entries(records)) {
    if (record?.title) {
      descriptions.set(uuid.toLowerCase(), {
        name: record.title.trim(),
        description: record.description?.trim() ?? "",
      });
    }
  }
}

const iconAtlases = [
  {
    image: path.join(gameRoot, "Data", "Gui", "IconMap.png"),
    map: path.join(gameRoot, "Data", "Gui", "IconMap.xml"),
  },
  {
    image: path.join(gameRoot, "ChallengeData", "Gui", "IconMapChallenge.png"),
    map: path.join(gameRoot, "ChallengeData", "Gui", "IconMapChallenge.xml"),
  },
  {
    image: path.join(gameRoot, "Survival", "Gui", "IconMapSurvival.png"),
    map: path.join(gameRoot, "Survival", "Gui", "IconMapSurvival.xml"),
  },
];

const iconLocations = new Map();
for (const atlas of iconAtlases) {
  const xml = await fs.readFile(atlas.map, "utf8");
  const sizeMatch = xml.match(
    /<Group[^>]+texture="[^"]+"[^>]+size="(\d+)\s+(\d+)"/,
  );
  const width = Number(sizeMatch?.[1] ?? 96);
  const height = Number(sizeMatch?.[2] ?? 96);
  const indexPattern =
    /<Index\s+name="([^"]+)">\s*<Frame\s+point="(\d+)\s+(\d+)"\s*\/>\s*<\/Index>/g;

  for (const match of xml.matchAll(indexPattern)) {
    const uuid = match[1].toLowerCase();
    if (uuid === "empty") continue;
    iconLocations.set(uuid, {
      atlas: atlas.image,
      left: Number(match[2]),
      top: Number(match[3]),
      width,
      height,
    });
  }
}

const stationDefinitions = {
  "cookbot.json": {
    slug: "cookbot",
    name: "Cookbot",
    description: "Prepared food and recovery meals.",
  },
  "dispenser.json": {
    slug: "mechanic-station",
    name: "Mechanic Station",
    description: "The first full-size crafting machines for a new workshop.",
  },
  "dressbot.json": {
    slug: "dressbot",
    name: "Dressbot",
    description: "Garment Box processing for character customization.",
  },
  "mininghubdispenser.json": {
    slug: "mining-hub-dispenser",
    name: "Mining Hub Dispenser",
    description: "Mining machines used on Excavation Island.",
  },
  "portablecrafter.json": {
    slug: "portable-crafter",
    name: "Portable Crafter",
    description: "Compact field recipes for early progression and recovery.",
  },
  "refinery.json": {
    slug: "refinebot",
    name: "Refinebot",
    description: "Automatic conversion of resource pieces into building blocks.",
  },
  "sawtable.json": {
    slug: "saw-table",
    name: "Saw Table",
    description: "Woodworking shapes, beams, panels, and furniture parts.",
  },
  "workbench.json": {
    slug: "workbench",
    name: "Workbench",
    description: "Early hand-built essentials before the workshop is upgraded.",
  },
};

function resolveStation(relativePath) {
  const normalized = relativePath.replaceAll("\\", "/").toLowerCase();
  if (normalized.startsWith("craftbot/")) {
    const group = path
      .basename(normalized, ".json")
      .replace(/^craftbot_/, "")
      .replaceAll("_", " ");
    return {
      slug: "craftbot",
      name: "Craftbot",
      group: group.replace(/\b\w/g, (letter) => letter.toUpperCase()),
      description:
        "The main workshop station for parts, blocks, machines, lights, and unlocked rewards.",
    };
  }
  return stationDefinitions[normalized];
}

function getItem(uuid) {
  const normalized = uuid.toLowerCase();
  const record = descriptions.get(normalized);
  return {
    uuid: normalized,
    name: record?.name ?? "",
    description: record?.description ?? "",
  };
}

const recipeFiles = (await walk(recipeRoot)).filter((filePath) =>
  filePath.toLowerCase().endsWith(".json"),
);
const recipes = [];
const trades = [];
const neededIconUuids = new Set();

for (const filePath of recipeFiles) {
  const relativePath = path.relative(recipeRoot, filePath);
  const normalizedName = relativePath.replaceAll("\\", "/").toLowerCase();
  const parsed = await readJson(filePath);
  const isTrade =
    normalizedName === "hideout.json" ||
    normalizedName === "mininghubtrader.json";

  let rows = [];
  if (Array.isArray(parsed)) {
    rows = parsed;
  } else if (normalizedName === "refinery.json") {
    rows = Object.values(parsed);
  }

  if (!rows.length) continue;

  const station = resolveStation(relativePath);
  const venue = isTrade
    ? normalizedName === "hideout.json"
      ? {
          slug: "farmers-hideout",
          name: "Farmers Hideout",
          currency: "Packed produce and rescued Farmers",
        }
      : {
          slug: "mining-hub",
          name: "Mining Hub",
          currency: "Wonk Stacks",
        }
    : undefined;

  for (const row of rows) {
    if (!row?.itemId || !Array.isArray(row.ingredientList)) continue;
    const output = getItem(row.itemId);
    const ingredients = row.ingredientList.map((ingredient) => ({
      ...getItem(ingredient.itemId),
      quantity: Number(ingredient.quantity ?? 0),
    }));

    if (
      !isPlayerFacingTitle(output.name) ||
      ingredients.some((ingredient) => !isPlayerFacingTitle(ingredient.name))
    ) {
      continue;
    }

    neededIconUuids.add(output.uuid);
    ingredients.forEach((ingredient) => neededIconUuids.add(ingredient.uuid));

    const record = {
      id: `${slugify(relativePath)}-${output.uuid.slice(0, 8)}-${recipes.length + trades.length}`,
      output: {
        uuid: output.uuid,
        name: output.name,
        quantity: Number(row.quantity ?? 1),
      },
      ingredients: ingredients.map(({ uuid, name, quantity }) => ({
        uuid,
        name,
        quantity,
      })),
      craftTime: Number(row.craftTime ?? 0),
      schematic: row.schematic === true,
    };

    if (isTrade && venue) {
      trades.push({ ...record, venueSlug: venue.slug });
    } else if (station) {
      recipes.push({
        ...record,
        stationSlug: station.slug,
        stationName: station.name,
        group: station.group ?? "Essentials",
      });
    }
  }
}

const wikiFiles = (await walk(path.join(projectRoot, "data", "wiki"))).filter(
  (filePath) => filePath.endsWith(".ts"),
);
const wikiNames = new Set();
for (const filePath of wikiFiles) {
  const input = await fs.readFile(filePath, "utf8");
  for (const match of input.matchAll(/^\s*(?:"name"|name):\s*"([^"]+)"/gm)) {
    wikiNames.add(match[1].toLowerCase());
  }
}

const wikiImageAliases = new Map([
  ["spudgun", "spud gun"],
  ["mountable spudgun", "mountable spud gun"],
  ["claygun", "clay gun"],
  ["plasma drill", "plasma drill level 1"],
  ["plasma saw", "plasma saw 1"],
  ["gas engine", "gas engine level 1"],
  ["electric engine", "electric engine level 1"],
  ["thruster", "thruster level 1"],
  ["controller", "controller level 1"],
  ["piston", "piston level 1"],
  ["sensor", "sensor level 1"],
  ["driver's seat", "driver's seat level 1"],
]);

for (const [uuid, record] of descriptions) {
  const normalizedName = record.name.toLowerCase();
  if (
    wikiNames.has(normalizedName) ||
    [...wikiImageAliases.values()].includes(normalizedName)
  ) {
    neededIconUuids.add(uuid);
  }
}

await fs.mkdir(outputDataDir, { recursive: true });
await fs.mkdir(outputImageDir, { recursive: true });

const atlasBuffers = new Map();
for (const atlas of iconAtlases) {
  atlasBuffers.set(atlas.image, await fs.readFile(atlas.image));
}

const imageByUuid = new Map();
const iconJobs = [];
for (const uuid of neededIconUuids) {
  const location = iconLocations.get(uuid);
  const item = descriptions.get(uuid);
  if (!location || !item || !isPlayerFacingTitle(item.name)) continue;

  const fileName = `${slugify(item.name) || "item"}-${uuid.slice(0, 8)}.webp`;
  const outputPath = path.join(outputImageDir, fileName);
  imageByUuid.set(uuid, `/images/game-items/${fileName}`);
  iconJobs.push(async () => {
    await sharp(atlasBuffers.get(location.atlas))
      .extract({
        left: location.left,
        top: location.top,
        width: location.width,
        height: location.height,
      })
      .webp({ quality: 92, lossless: true })
      .toFile(outputPath);
  });
}

for (let index = 0; index < iconJobs.length; index += 16) {
  await Promise.all(iconJobs.slice(index, index + 16).map((job) => job()));
}

function attachImages(record) {
  return {
    ...record,
    output: {
      ...record.output,
      image: imageByUuid.get(record.output.uuid) ?? null,
    },
    ingredients: record.ingredients.map((ingredient) => ({
      ...ingredient,
      image: imageByUuid.get(ingredient.uuid) ?? null,
    })),
  };
}

const stations = [
  {
    slug: "craftbot",
    name: "Craftbot",
    description: stationDefinitions["workbench.json"].description.replace(
      "Early hand-built essentials before the workshop is upgraded.",
      "The main workshop station for parts, blocks, machines, lights, and unlocked rewards.",
    ),
  },
  ...Object.values(stationDefinitions),
]
  .filter(
    (station, index, collection) =>
      collection.findIndex((candidate) => candidate.slug === station.slug) ===
      index,
  )
  .map((station) => ({
    ...station,
    recipeCount: recipes.filter(
      (recipe) => recipe.stationSlug === station.slug,
    ).length,
  }))
  .filter((station) => station.recipeCount > 0);

const venues = [
  {
    slug: "farmers-hideout",
    name: "Farmers Hideout",
    currency: "Packed produce and rescued Farmers",
    description:
      "Trade crop crates and rescued Farmers for seeds, supplies, parts, and progression equipment.",
  },
  {
    slug: "mining-hub",
    name: "Mining Hub",
    currency: "Wonk Stacks",
    description:
      "Spend Wonk Stacks on mining equipment, heavy-duty parts, weapons, blocks, and outfit pieces.",
  },
].map((venue) => ({
  ...venue,
  tradeCount: trades.filter((trade) => trade.venueSlug === venue.slug).length,
}));

const items = [...neededIconUuids]
  .map((uuid) => {
    const record = descriptions.get(uuid);
    if (!record || !isPlayerFacingTitle(record.name)) return null;
    return {
      uuid,
      name: record.name,
      description: record.description,
      image: imageByUuid.get(uuid) ?? null,
    };
  })
  .filter(Boolean)
  .sort((left, right) => left.name.localeCompare(right.name));

await fs.writeFile(
  path.join(outputDataDir, "recipes.json"),
  `${JSON.stringify(
    {
      checkedVersion,
      recipeCount: recipes.length,
      stations,
      recipes: recipes.map(attachImages),
    },
    null,
    2,
  )}\n`,
);
await fs.writeFile(
  path.join(outputDataDir, "trades.json"),
  `${JSON.stringify(
    {
      checkedVersion,
      tradeCount: trades.length,
      venues,
      trades: trades.map(attachImages),
    },
    null,
    2,
  )}\n`,
);
await fs.writeFile(
  path.join(outputDataDir, "items.json"),
  `${JSON.stringify({ checkedVersion, items }, null, 2)}\n`,
);

console.log(
  JSON.stringify(
    {
      checkedVersion,
      recipes: recipes.length,
      trades: trades.length,
      stations: stations.length,
      venues: venues.length,
      icons: imageByUuid.size,
      items: items.length,
    },
    null,
    2,
  ),
);
