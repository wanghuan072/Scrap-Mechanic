import type { LuaValue, SaveProgress } from "./save-protocol";
import { decodeLuaObject } from "./lua-value-decoder";
import { decodeStoredBlob } from "./stored-blob-decoder";
import type { SaveStorageRecords, StorageRecord } from "./storage-records";

const MAX_PROGRESS_INTEGER = 0x7fff_ffff;
const SUPPORTED_UNDERGROUND_DEPTHS = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8]);

function tableEntries(value: LuaValue | undefined): Array<[LuaValue, LuaValue]> | undefined {
  return value && typeof value === "object" && value.kind === "table"
    ? value.entries
    : undefined;
}

function field(value: LuaValue | undefined, name: string): { found: boolean; value?: LuaValue } {
  const entry = tableEntries(value)?.find(([key]) => key === name);
  return entry ? { found: true, value: entry[1] } : { found: false };
}

function stringKeys(value: LuaValue | undefined, requireTrue: boolean): string[] | undefined {
  const entries = tableEntries(value);
  if (!entries) return undefined;
  const result: string[] = [];
  for (const [key, entry] of entries) {
    if (requireTrue && entry !== true) continue;
    if (typeof key === "string") result.push(key);
  }
  return result;
}

function arrayStrings(value: LuaValue | undefined): string[] | undefined {
  if (!value || typeof value !== "object") return undefined;
  if (value.kind === "array") {
    if (Object.keys(value.negativeValues).length > 0 || value.values.some((entry) => typeof entry !== "string")) {
      return undefined;
    }
    return value.values as string[];
  }
  if (value.kind !== "table") return undefined;
  const ordered = value.entries
    .map(([key, entry]) => ({ key, entry }))
    .filter(({ key, entry }) => Number.isInteger(key) && (key as number) >= 1 && typeof entry === "string")
    .sort((left, right) => (left.key as number) - (right.key as number));
  if (ordered.length !== value.entries.length) return undefined;
  return ordered.map(({ entry }) => entry as string);
}

function exactBoolean(
  root: LuaValue,
  name: string,
  fallback: boolean,
  warnings: string[],
  scope: string
): boolean {
  const entry = field(root, name);
  if (!entry.found) return fallback;
  if (typeof entry.value === "boolean") return entry.value;
  warnings.push(`${scope}: ${name} is not a boolean.`);
  return fallback;
}

function boundedInteger(
  root: LuaValue,
  name: string,
  fallback: number,
  warnings: string[],
  scope: string
): number {
  const entry = field(root, name);
  if (!entry.found) return fallback;
  if (
    typeof entry.value === "number"
    && Number.isFinite(entry.value)
    && Number.isInteger(entry.value)
    && entry.value >= 0
    && entry.value <= MAX_PROGRESS_INTEGER
  ) return entry.value;
  warnings.push(`${scope}: ${name} is not a bounded non-negative integer.`);
  return fallback;
}

function sameBytes(left: Uint8Array, right: Uint8Array): boolean {
  return left.byteLength === right.byteLength && left.every((byte, index) => byte === right[index]);
}

function decodeRecord(record: StorageRecord, scope: string, warnings: string[]): LuaValue | undefined {
  const decoded = decodeStoredBlob(record.data, {
    ...(record.worldId === undefined ? {} : { expectedWorldId: record.worldId }),
    stage: `progress-${scope}`
  });
  if (!sameBytes(decoded.key, record.key)) {
    throw new Error(`${scope} stored-blob key does not match its database key.`);
  }
  try {
    return decodeLuaObject(decoded.data);
  } catch (error) {
    warnings.push(`${scope} was ignored: ${error instanceof Error ? error.message : String(error)}`);
    return undefined;
  }
}

function uniqueSorted(values: readonly string[]): string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function decodeProgression(root: LuaValue, progress: SaveProgress): void {
  const scope = "Storage channel 79";
  if (!tableEntries(root)) {
    progress.warnings.push(`${scope} was ignored: expected a table.`);
    return;
  }
  const growLabs = field(root, "completedGrowlabs");
  if (growLabs.found) {
    const entries = tableEntries(growLabs.value);
    if (!entries) {
      progress.warnings.push(`${scope}: completedGrowlabs is not a table.`);
    } else {
      const ids: string[] = [];
      for (const [key, value] of entries) {
        if (value !== true) continue;
        if (typeof key === "string" && key.length > 0) ids.push(key);
        else if (typeof key === "number" && Number.isInteger(key) && key >= 0) ids.push(String(key));
      }
      progress.completedGrowLabs = uniqueSorted(ids);
    }
  }
  progress.seedTier = boundedInteger(root, "seedTier", progress.seedTier, progress.warnings, scope);
  progress.vaultTotal = boundedInteger(root, "vaultTotal", progress.vaultTotal, progress.warnings, scope);
  progress.warehouseConsoleUnlocked = exactBoolean(
    root, "warehouseConsoleUnlocked", progress.warehouseConsoleUnlocked, progress.warnings, scope
  );
  progress.hasCraftedBeacon = exactBoolean(
    root, "hasCraftedBeacon", progress.hasCraftedBeacon, progress.warnings, scope
  );
  const depths = field(root, "reachedUndergroundDepths");
  if (depths.found) {
    const entries = tableEntries(depths.value);
    if (!entries) {
      progress.warnings.push(`${scope}: reachedUndergroundDepths is not a table.`);
    } else {
      const reached = new Set<number>();
      for (const [key, value] of entries) {
        if (value !== true || typeof key !== "number" || !Number.isInteger(key)) continue;
        if (SUPPORTED_UNDERGROUND_DEPTHS.has(key)) reached.add(key);
        else progress.warnings.push(`${scope}: unsupported underground depth ${key} was ignored.`);
      }
      progress.reachedUndergroundDepths = [...reached].sort((left, right) => left - right);
    }
  }
}

function decodeScannerbot(root: LuaValue, progress: SaveProgress): void {
  const scope = "Storage channel 58";
  if (!tableEntries(root)) {
    progress.warnings.push(`${scope} was ignored: expected a table.`);
    return;
  }
  const data = field(root, "scannerbotData");
  if (!data.found || data.value === null) return;
  const position = field(data.value, "currentPosition");
  const value = position.value;
  if (
    !position.found || !value || typeof value !== "object" || value.kind !== "vec3"
    || !Number.isFinite(value.x) || !Number.isFinite(value.y)
  ) {
    progress.warnings.push(`${scope}: scannerbotData.currentPosition is invalid.`);
    return;
  }
  const huntMode = field(root, "huntMode").value;
  progress.scannerbot = {
    x: value.x,
    y: value.y,
    mode: huntMode === true ? "hunt" : huntMode === false ? "patrol" : "unknown"
  };
}

function decodeLogs(root: LuaValue, progress: SaveProgress): void {
  const logs = arrayStrings(root);
  if (!logs) {
    progress.warnings.push("Storage channel 60 was ignored: expected the reviewed log array shape.");
    return;
  }
  progress.collectedLogIds = uniqueSorted(logs.filter((value) => value.length > 0));
}

function objectIdFromKey(key: Uint8Array): number | undefined {
  return key.byteLength === 4
    ? new DataView(key.buffer, key.byteOffset, key.byteLength).getUint32(0, true)
    : undefined;
}

function questManagerValue(
  root: LuaValue,
  storage: SaveStorageRecords,
  progress: SaveProgress
): LuaValue | undefined {
  if (!root || typeof root !== "object" || root.kind !== "handle" || root.type !== 10039) {
    progress.warnings.push("Storage channel 44 was ignored: expected a scriptable-object handle.");
    return undefined;
  }
  const object = storage.scriptableObjectsById.get(root.value);
  if (!object) {
    progress.warnings.push(`Storage channel 44 could not resolve scriptable object ${root.value}.`);
    return undefined;
  }
  const candidates = storage.objectStorage.filter((record) =>
    record.table === "ScriptData"
    && objectIdFromKey(record.key) === root.value
    && record.worldId === object.worldId
  );
  if (candidates.length !== 1) {
    progress.warnings.push(`Storage channel 44 resolved ${candidates.length} Quest Manager records.`);
    return undefined;
  }
  return decodeRecord(candidates[0]!, "Quest Manager", progress.warnings);
}

function decodeQuests(root: LuaValue, progress: SaveProgress): void {
  if (!tableEntries(root)) {
    progress.warnings.push("Quest Manager was ignored: expected a table.");
    return;
  }
  const states = new Map<string, "active" | "tracked" | "completed">();
  for (const id of stringKeys(field(root, "activeQuests").value, false) ?? []) {
    states.set(id, "active");
  }
  const tracked = field(root, "trackedQuests").value;
  const trackedPlayers = tracked && typeof tracked === "object" && tracked.kind === "array"
    ? tracked.values
    : tableEntries(tracked)?.map(([, value]) => value) ?? [];
  for (const player of trackedPlayers) {
    for (const id of stringKeys(player, false) ?? []) states.set(id, "tracked");
  }
  const completed = field(root, "completedQuests").value;
  const completedIds = arrayStrings(completed) ?? stringKeys(completed, true) ?? [];
  for (const id of completedIds) states.set(id, "completed");
  progress.quests = [...states]
    .map(([id, state]) => ({ id, state }))
    .sort((left, right) => left.id.localeCompare(right.id));
}

export function decodeSaveProgress(storage: SaveStorageRecords): SaveProgress {
  const progress: SaveProgress = {
    quests: [],
    completedGrowLabs: [],
    seedTier: 1,
    vaultTotal: 0,
    warehouseConsoleUnlocked: false,
    hasCraftedBeacon: false,
    reachedUndergroundDepths: [],
    collectedLogIds: [],
    warnings: [...storage.warnings]
  };
  for (const [channel, decoder] of [
    [79, decodeProgression],
    [58, decodeScannerbot],
    [60, decodeLogs]
  ] as const) {
    for (const record of storage.globalByChannel.get(channel) ?? []) {
      const value = decodeRecord(record, `Storage channel ${channel}`, progress.warnings);
      if (value !== undefined) decoder(value, progress);
    }
  }
  for (const record of storage.globalByChannel.get(44) ?? []) {
    const handle = decodeRecord(record, "Storage channel 44", progress.warnings);
    if (handle === undefined) continue;
    const manager = questManagerValue(handle, storage, progress);
    if (manager !== undefined) decodeQuests(manager, progress);
  }
  return progress;
}
