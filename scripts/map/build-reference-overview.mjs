import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const root = process.cwd();
const generatedDirectory = path.join(root, "public", "map-assets", "generated");
const vendorDirectory = path.join(root, "public", "map-assets", "sm-map-generator");
const pixelsPerCell = 4;

const canonicalize = (value) => {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]),
    );
  }
  return value;
};

const hash = (value) => createHash("sha256").update(value).digest("hex");
const parseJson = async (file) => JSON.parse(await readFile(file, "utf8"));

function placementOrigin(cell, image) {
  if (cell.rotation === 0) return { x: cell.x - cell.xOffset, y: cell.y - cell.yOffset };
  if (cell.rotation === 1) {
    return { x: cell.x - (image.cellsHigh - 1 - cell.yOffset), y: cell.y - cell.xOffset };
  }
  if (cell.rotation === 2) {
    return {
      x: cell.x - (image.cellsWide - 1 - cell.xOffset),
      y: cell.y - (image.cellsHigh - 1 - cell.yOffset),
    };
  }
  return { x: cell.x - cell.yOffset, y: cell.y - (image.cellsWide - 1 - cell.xOffset) };
}

const worldBundle = await parseJson(path.join(generatedDirectory, "reference-world.json"));
const manifest = await parseJson(path.join(vendorDirectory, "manifest.json"));
const world = worldBundle.world;
const imagesByUuid = new Map(
  manifest.images.filter((image) => image.uuid).map((image) => [image.uuid.toLowerCase(), image]),
);
const excavation = manifest.images.find((image) => image.role === "excavation-composite");
if (!excavation) throw new Error("The vendor manifest has no excavation composite.");

const oceanCounts = new Map();
for (const cell of world.cells) {
  const image = imagesByUuid.get(cell.uuid.toLowerCase());
  if (cell.terrainType === "8" && image?.role === "single-cell") {
    oceanCounts.set(cell.uuid.toLowerCase(), (oceanCounts.get(cell.uuid.toLowerCase()) ?? 0) + 1);
  }
}
const oceanUuid = [...oceanCounts].sort(
  ([leftUuid, leftCount], [rightUuid, rightCount]) =>
    rightCount - leftCount || leftUuid.localeCompare(rightUuid),
)[0]?.[0];
const ocean = oceanUuid ? imagesByUuid.get(oceanUuid) : undefined;
if (!ocean) throw new Error("The reference world has no verified ocean artwork.");

const excavationUuids = new Set([
  "ba31a522-7659-4ec5-b933-8b83960c57f2",
  "bf0ba240-416f-4f32-b87d-3a445919e72a",
]);
const groups = new Map();
const missingUuids = new Set();
let missingFragments = 0;
let excavationCells = 0;

for (const cell of world.cells) {
  const uuid = cell.uuid.toLowerCase();
  if (excavationUuids.has(uuid) && cell.x >= 32 && cell.x <= 63 && cell.y >= 16 && cell.y <= 47) {
    excavationCells += 1;
    continue;
  }
  if (uuid === oceanUuid) continue;
  const image = imagesByUuid.get(uuid);
  if (!image) {
    missingUuids.add(uuid);
    missingFragments += 1;
    continue;
  }
  const origin = placementOrigin(cell, image);
  const id = `${uuid}:${origin.x}:${origin.y}:${cell.rotation}`;
  if (!groups.has(id)) groups.set(id, { id, image, origin, rotation: cell.rotation });
}

const placements = [...groups.values()];
if (excavationCells > 0) {
  placements.push({
    id: "excavation:32:16",
    image: excavation,
    origin: { x: 32, y: 16 },
    rotation: 0,
    destinationWidth: 32,
    destinationHeight: 32,
  });
}
placements.sort((left, right) => left.id.localeCompare(right.id));

const width = (world.bounds.maxX - world.bounds.minX + 1) * pixelsPerCell;
const height = (world.bounds.maxY - world.bounds.minY + 1) * pixelsPerCell;
const oceanTile = await sharp(path.join(vendorDirectory, ocean.path))
  .resize(pixelsPerCell, pixelsPerCell, { kernel: sharp.kernel.lanczos3 })
  .webp({ lossless: true })
  .toBuffer();

const composites = [{ input: oceanTile, tile: true }];
for (const placement of placements) {
  const sourceWidth = placement.image.cellsWide * pixelsPerCell;
  const sourceHeight = placement.image.cellsHigh * pixelsPerCell;
  const rotatedHeight = placement.rotation % 2 === 0 ? sourceHeight : sourceWidth;
  const cellHeight = placement.destinationHeight ?? rotatedHeight / pixelsPerCell;
  const left = Math.round((placement.origin.x - world.bounds.minX) * pixelsPerCell);
  const top = Math.round((world.bounds.maxY - (placement.origin.y + cellHeight - 1)) * pixelsPerCell);
  let image = sharp(path.join(vendorDirectory, placement.image.path))
    .resize(sourceWidth, sourceHeight, { kernel: sharp.kernel.lanczos3 });
  if (placement.rotation) image = image.rotate(placement.rotation * 90);
  composites.push({ input: await image.webp({ lossless: true }).toBuffer(), left, top });
}

await mkdir(generatedDirectory, { recursive: true });
const overviewBytes = await sharp({
  create: { width, height, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
})
  .composite(composites)
  .webp({ quality: 88, effort: 6, smartSubsample: true })
  .toBuffer();
const overviewHash = hash(overviewBytes);
const overviewName = `reference-overview-${overviewHash.slice(0, 16)}.webp`;
await writeFile(path.join(generatedDirectory, overviewName), overviewBytes);

const unsignedDescriptor = {
  schemaVersion: 1,
  gameVersion: worldBundle.gameVersion,
  worldContentHash: worldBundle.contentHash,
  asset: {
    path: overviewName,
    contentHash: overviewHash,
    bytes: overviewBytes.byteLength,
    width,
    height,
  },
  diagnostics: {
    missingFragments,
    missingUuids: [...missingUuids].sort(),
  },
};
const descriptor = {
  ...unsignedDescriptor,
  contentHash: hash(JSON.stringify(canonicalize(unsignedDescriptor))),
};
await writeFile(
  path.join(generatedDirectory, "reference-overview.json"),
  `${JSON.stringify(descriptor, null, 2)}\n`,
);
console.log(`Wrote ${overviewName} (${overviewBytes.byteLength} bytes)`);
