import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const gameRoot =
  process.env.SCRAP_MECHANIC_DATA_ROOT ??
  "\\\\192.168.2.2\\共享文件\\Scrap Mechanic";
const shapeSetFolders = [
  path.join(gameRoot, "Data", "Objects", "Database", "ShapeSets"),
  path.join(gameRoot, "Survival", "Objects", "Database", "ShapeSets"),
];

const itemCollection = JSON.parse(
  await readFile(path.join(projectRoot, "src", "data", "game", "items.json"), "utf8"),
);
const knownItems = new Map(
  itemCollection.items.map((item) => [item.uuid.toLowerCase(), item]),
);
const records = new Map();

function copyVector(vector) {
  if (!vector || typeof vector !== "object") return undefined;
  const result = {};
  for (const key of ["x", "y", "z"]) {
    if (typeof vector[key] === "number") result[key] = vector[key];
  }
  return Object.keys(result).length ? result : undefined;
}

function compactUpgradeData(part) {
  const candidates = [
    "survivalEngine",
    "survivalThruster",
    "survivalSeat",
    "survivalPiston",
    "survivalSensor",
    "survivalSpring",
    "survivalController",
    "survivalShape",
  ];
  const result = {};

  for (const key of candidates) {
    const value = part[key];
    if (!value || typeof value !== "object") continue;
    const picked = {};
    for (const field of [
      "level",
      "upgradeCost",
      "upgradeUuid",
      "fuelEfficiency",
      "gears",
      "maxConnections",
      "maxBearings",
      "maxAngle",
      "maxLength",
      "maxVelocity",
      "range",
      "length",
      "stiffnessLimit",
      "force",
      "speed",
    ]) {
      if (
        typeof value[field] === "number" ||
        typeof value[field] === "string" ||
        typeof value[field] === "boolean"
      ) {
        picked[field] = value[field];
      }
    }
    if (Object.keys(picked).length) result[key] = picked;
  }

  return Object.keys(result).length ? result : undefined;
}

function storePart(part, sourceFile) {
  if (!part || typeof part !== "object" || typeof part.uuid !== "string") return;
  const uuid = part.uuid.toLowerCase();
  if (!knownItems.has(uuid)) return;

  const ratings =
    part.ratings && typeof part.ratings === "object"
      ? Object.fromEntries(
          ["durability", "density", "friction", "buoyancy"].flatMap((key) =>
            typeof part.ratings[key] === "number" ? [[key, part.ratings[key]]] : [],
          ),
        )
      : undefined;
  const box =
    part.box && typeof part.box === "object"
      ? {
          x: part.box.x,
          y: part.box.y,
          z: part.box.z,
        }
      : undefined;
  const cylinder =
    part.cylinder && typeof part.cylinder === "object"
      ? {
          axis: part.cylinder.axis,
          depth: part.cylinder.depth,
          diameter: part.cylinder.diameter,
        }
      : undefined;

  const previous = records.get(uuid) ?? {};
  const next = {
    uuid,
    name: knownItems.get(uuid).name,
    sourceFile,
    stackSize: typeof part.stackSize === "number" ? part.stackSize : undefined,
    flammable:
      typeof part.flammable === "boolean" ? part.flammable : undefined,
    physicsMaterial:
      typeof part.physicsMaterial === "string"
        ? part.physicsMaterial
        : undefined,
    ratings: ratings && Object.keys(ratings).length ? ratings : undefined,
    box:
      box && Object.values(box).every((value) => typeof value === "number")
        ? box
        : undefined,
    cylinder:
      cylinder &&
      typeof cylinder.axis === "string" &&
      typeof cylinder.depth === "number" &&
      typeof cylinder.diameter === "number"
        ? cylinder
        : undefined,
    bounds: copyVector(part.bounds),
    upgrade: compactUpgradeData(part),
  };

  const definedNext = Object.fromEntries(
    Object.entries(next).filter(([, value]) => value !== undefined),
  );
  records.set(uuid, { ...previous, ...definedNext });
}

for (const folder of shapeSetFolders) {
  const files = (await readdir(folder)).filter((file) => file.endsWith(".shapeset"));
  for (const file of files) {
    const sourceFile = `${path.basename(path.dirname(path.dirname(folder)))}/${file}`;
    const parsed = JSON.parse(await readFile(path.join(folder, file), "utf8"));
    for (const listName of ["partList", "blockList"]) {
      for (const part of parsed[listName] ?? []) storePart(part, sourceFile);
    }
  }
}

const output = {
  checkedVersion: itemCollection.checkedVersion,
  objectCount: records.size,
  objects: [...records.values()].sort((left, right) =>
    left.name.localeCompare(right.name),
  ),
};

await writeFile(
  path.join(projectRoot, "src", "data", "game", "object-details.json"),
  `${JSON.stringify(output, null, 2)}\n`,
);

console.log(`Wrote ${output.objectCount} object records.`);
