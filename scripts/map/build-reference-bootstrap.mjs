import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const directory = path.join(process.cwd(), "public/map-assets/generated");
const canonicalize = (value) => Array.isArray(value)
  ? value.map(canonicalize)
  : value && typeof value === "object"
    ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]))
    : value;
const digest = (value) => createHash("sha256").update(JSON.stringify(canonicalize(value))).digest("hex");
const read = async (name) => JSON.parse(await readFile(path.join(directory, name), "utf8"));
const source = await read("reference-world.json");
const { contentHash: sourceHash, ...sourceUnsigned } = source;
if (digest(sourceUnsigned) !== sourceHash) throw new Error("Reference world integrity check failed.");
const unsigned = {
  schemaVersion: 1,
  gameVersion: source.gameVersion,
  worldContentHash: sourceHash,
  world: {
    ...source.world,
    // 概览和主要地点先显示；完整资源和高清地形由原始世界数据补齐。
    cells: source.world.cells.filter((cell) => Boolean(cell.poiType)),
    isOverviewOnly: true,
  },
};
const bundle = { ...unsigned, contentHash: digest(unsigned) };
const text = `${JSON.stringify(bundle)}\n`;
await writeFile(path.join(directory, "reference-bootstrap.json"), text);
const buildInfo = await read("build-info.json");
const { contentHash: oldHash, ...buildUnsigned } = buildInfo;
if (digest(buildUnsigned) !== oldHash) throw new Error("Build info integrity check failed.");
buildUnsigned.files = buildUnsigned.files.filter((file) => file.name !== "reference-bootstrap.json");
buildUnsigned.files.push({ name: "reference-bootstrap.json", contentHash: bundle.contentHash, bytes: Buffer.byteLength(text) });
await writeFile(path.join(directory, "build-info.json"), `${JSON.stringify({ ...buildUnsigned, contentHash: digest(buildUnsigned) }, null, 2)}\n`);
console.log(`Reference bootstrap: ${Buffer.byteLength(text)} bytes, ${unsigned.world.cells.length} landmark cells`);
