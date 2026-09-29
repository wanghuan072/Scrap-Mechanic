import { SaveParseError } from "./save-errors";
import { decodeLuaObject } from "./lua-value-decoder";
import type { LuaValue } from "./save-protocol";
import type { SaveRecords } from "./sqlite-records";
import { decodeStoredBlob } from "./stored-blob-decoder";
import { decodeWorldDescriptors } from "./world-descriptor-decoder";

const TERRAIN_KEY_BYTES = 4;

function wrapperError(message: string, offset?: number): never {
  throw new SaveParseError("DECODE_FAILED", {
    stage: "script-data",
    offset,
    message
  });
}

export function decodeScriptData(blob: Uint8Array, expectedWorldId?: number): LuaValue {
  const decoded = decodeStoredBlob(blob, {
    expectedWorldId,
    stage: "script-data"
  });
  if (decoded.key.byteLength !== TERRAIN_KEY_BYTES) {
    return wrapperError(`Unsupported ScriptData key size ${decoded.key.byteLength}.`, 16);
  }
  return decodeLuaObject(decoded.data);
}

const TERRAIN_KEYS = new Set(["bounds", "seed", "uid", "xOffset", "yOffset", "rotation", "flags"]);

function isTerrainRoot(value: LuaValue): boolean {
  if (!value || typeof value !== "object" || value.kind !== "table") return false;
  const keys = new Set(
    value.entries
      .map(([key]) => key)
      .filter((key): key is string => typeof key === "string")
  );
  return [...TERRAIN_KEYS].every((key) => keys.has(key));
}

export function isTerrainScriptData(blob: Uint8Array, expectedWorldId: number): boolean {
  try {
    return isTerrainRoot(decodeScriptData(blob, expectedWorldId));
  } catch (error) {
    if (error instanceof SaveParseError) return false;
    throw error;
  }
}

export function decodeSurfaceCandidates(
  candidates: readonly Uint8Array[],
  expectedWorldId?: number
): LuaValue {
  let lastError: unknown;
  for (const candidate of candidates) {
    try {
      const value = decodeScriptData(candidate, expectedWorldId);
      if (isTerrainRoot(value)) return value;
      lastError = new SaveParseError("DECODE_FAILED", {
        stage: "script-data",
        message: "Decoded ScriptData is not a terrain root."
      });
    } catch (error) {
      lastError = error;
    }
  }
  if (lastError instanceof SaveParseError) throw lastError;
  throw new SaveParseError("MISSING_SURFACE_DATA", {
    stage: "script-data",
    message: "No complete surface terrain candidate was found."
  });
}

export interface DiscoveredSurface {
  worldId: number;
  value: LuaValue;
  diagnostic: string | undefined;
}

export function decodeDiscoveredSurface(
  records: Pick<SaveRecords, "terrainCandidates" | "worldDescriptors">
): DiscoveredSurface {
  const tried = new Set<number>();
  let lastError: unknown;
  const tryWorld = (worldId: number): LuaValue | undefined => {
    if (tried.has(worldId)) return undefined;
    tried.add(worldId);
    const candidates = records.terrainCandidates.get(worldId);
    if (!candidates) return undefined;
    try {
      return decodeSurfaceCandidates(candidates, worldId);
    } catch (error) {
      lastError = error;
      return undefined;
    }
  };

  for (const descriptor of decodeWorldDescriptors(records.worldDescriptors)) {
    if (descriptor.kind !== "surface") continue;
    const value = tryWorld(descriptor.worldId);
    if (value !== undefined) {
      return { worldId: descriptor.worldId, value, diagnostic: undefined };
    }
  }

  const legacy = tryWorld(1);
  if (legacy !== undefined) return { worldId: 1, value: legacy, diagnostic: undefined };

  for (const worldId of records.terrainCandidates.keys()) {
    const value = tryWorld(worldId);
    if (value !== undefined) {
      return {
        worldId,
        value,
        diagnostic: `No classified surface terrain was valid; using terrain world ${worldId}.`
      };
    }
  }
  if (lastError instanceof SaveParseError) throw lastError;
  throw new SaveParseError("MISSING_SURFACE_DATA", {
    stage: "script-data",
    message: "No complete surface terrain candidate was found."
  });
}
