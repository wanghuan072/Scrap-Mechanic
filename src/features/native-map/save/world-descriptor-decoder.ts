import type { SaveRecords } from "./sqlite-records";
import { decodeStoredBlob } from "./stored-blob-decoder";

const DESCRIPTOR_PREFIX_BYTES = 4;
const MAX_SCRIPT_NAME_BYTES = 512;
const MAX_CLASS_NAME_BYTES = 256;
const SURVIVAL_WORLD_SCRIPT_ROOT = "$survival_data/scripts/game/worlds/";
const utf8 = new TextDecoder("utf-8", { fatal: true });

export interface SavedWorldRecord {
  worldId: number;
  kind:
    | "surface"
    | "grow-lab"
    | "mining-center"
    | "scrap-yard"
    | "underground-station"
    | "boss"
    | "unknown";
  scriptName: string;
  className: string;
}

function readText(
  bytes: Uint8Array,
  offset: number,
  maxBytes: number
): { value: string; next: number } | undefined {
  if (offset + 2 > bytes.length) return undefined;
  const length = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
    .getUint16(offset, false);
  if (length === 0 || length > maxBytes || offset + 2 + length > bytes.length) {
    return undefined;
  }
  try {
    return {
      value: utf8.decode(bytes.subarray(offset + 2, offset + 2 + length)),
      next: offset + 2 + length
    };
  } catch {
    return undefined;
  }
}

function supportedScriptIdentity(scriptName: string): string | undefined {
  const normalizedPath = scriptName.replaceAll("\\", "/").toLowerCase();
  if (!normalizedPath.startsWith(SURVIVAL_WORLD_SCRIPT_ROOT)) return undefined;
  const relativePath = normalizedPath.slice(SURVIVAL_WORLD_SCRIPT_ROOT.length);
  if (relativePath.includes("/") || !relativePath.endsWith(".lua")) return undefined;
  return relativePath.slice(0, -4);
}

const FIXED_CLASS_KINDS = new Map<string, SavedWorldRecord["kind"]>([
  ["mininghub", "mining-center"],
  ["undergroundworld_mininghub", "mining-center"],
  ["scrapyard", "scrap-yard"],
  ["undergroundworld_scrapyard", "scrap-yard"],
  ["undergroundstation01", "underground-station"],
  ["undergroundstation02", "underground-station"],
  ["undergroundworld_station_01", "underground-station"],
  ["undergroundworld_station_02", "underground-station"],
  ["finalbosslobby", "boss"],
  ["trashbotboss", "boss"],
  ["undergroundworld_final_boss_lobby", "boss"],
  ["undergroundworld_trashbot_boss", "boss"]
]);

function classify(scriptName: string, className: string): SavedWorldRecord["kind"] {
  const scriptIdentity = supportedScriptIdentity(scriptName);
  if (!scriptIdentity) return "unknown";
  const classIdentity = className.toLowerCase();
  if (scriptIdentity === "overworld" && classIdentity === "overworld") return "surface";
  for (let number = 1; number <= 7; number += 1) {
    const identity = `growlabworld${number}`;
    if (
      classIdentity === identity
      && (scriptIdentity === identity || scriptIdentity === "growlabworld")
    ) return "grow-lab";
  }
  if (scriptIdentity === "undergroundworld") {
    return FIXED_CLASS_KINDS.get(classIdentity) ?? "unknown";
  }
  return "unknown";
}

export function decodeWorldDescriptor(blob: Uint8Array): SavedWorldRecord | undefined {
  const { worldId, data } = decodeStoredBlob(blob, { stage: "world-descriptor" });
  if (data.byteLength < DESCRIPTOR_PREFIX_BYTES + 4) return undefined;
  const script = readText(data, DESCRIPTOR_PREFIX_BYTES, MAX_SCRIPT_NAME_BYTES);
  if (!script || !script.value.includes("/") || !script.value.toLowerCase().includes(".lua")) {
    return undefined;
  }
  const className = readText(data, script.next, MAX_CLASS_NAME_BYTES);
  if (!className) return undefined;
  return {
    worldId,
    kind: classify(script.value, className.value),
    scriptName: script.value,
    className: className.value
  };
}

export function decodeWorldDescriptors(
  blobs: readonly Uint8Array[] | Pick<SaveRecords, "worldDescriptors">
): SavedWorldRecord[] {
  const values = "worldDescriptors" in blobs ? blobs.worldDescriptors : blobs;
  const records: SavedWorldRecord[] = [];
  for (const blob of values) {
    const descriptor = decodeWorldDescriptor(blob);
    if (descriptor) records.push(descriptor);
  }
  return records;
}
