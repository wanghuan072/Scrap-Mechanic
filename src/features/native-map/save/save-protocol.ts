import type { TileCatalog } from "../terrain/normalize-terrain";
import type { SavedWorldRecord } from "./world-descriptor-decoder";

export type SaveStage =
  | "reading"
  | "sqlite"
  | "decompressing"
  | "decoding"
  | "player-content"
  | "compositing"
  | "normalizing"
  | "rendering";

export type SaveErrorCode =
  | "EMPTY_FILE"
  | "FILE_TOO_LARGE"
  | "NOT_SQLITE"
  | "NOT_SURVIVAL_SAVE"
  | "UNSUPPORTED_SAVE_VERSION"
  | "MISSING_SURFACE_DATA"
  | "DECOMPRESSION_FAILED"
  | "DECODE_FAILED"
  | "UNKNOWN_TILE_UUID"
  | "UNSUPPORTED_BROWSER";

export type LuaValue =
  | null
  | boolean
  | number
  | string
  | { kind: "array"; values: LuaValue[]; negativeValues: Record<number, LuaValue> }
  | { kind: "table"; entries: Array<[LuaValue, LuaValue]> }
  | { kind: "uuid"; value: string }
  | { kind: "vec3"; x: number; y: number; z: number }
  | { kind: "quat"; x: number; y: number; z: number; w: number }
  | { kind: "color"; r: number; g: number; b: number; a: number }
  | { kind: "handle"; type: number; value: number };

export interface SaveProgress {
  quests: Array<{ id: string; state: "active" | "tracked" | "completed" }>;
  completedGrowLabs: string[];
  seedTier: number;
  vaultTotal: number;
  warehouseConsoleUnlocked: boolean;
  hasCraftedBeacon: boolean;
  reachedUndergroundDepths: number[];
  collectedLogIds: string[];
  scannerbot?: { x: number; y: number; mode: "patrol" | "hunt" | "unknown" };
  warnings: string[];
}

export interface SaveMetadata {
  fileName: string;
  saveVersion: 28;
  seed: number;
}

export interface NormalizedTerrainTransfer {
  gameVersion: string;
  bounds: { minX: number; minY: number; maxX: number; maxY: number };
  uuids: string[];
  terrainTypes: string[];
  poiTypes: Array<string | null>;
  uuidIndexes: Uint16Array;
  xOffsets: Int32Array;
  yOffsets: Int32Array;
  rotations: Uint8Array;
  flags: Int32Array;
}

export interface NormalizedPlayerContentTransfer {
  bodyIds: Uint32Array;
  bodyKinds: Uint8Array;
  shapeBodyIndexes: Uint32Array;
  shapeUuidIndexes: Uint16Array;
  positions: Float32Array;
  rotations: Float32Array;
  sizes: Float32Array;
  colors: Uint8Array;
  footprintBounds: Float32Array;
  footprintOrder: Uint32Array;
  maxFootprintSpan: number;
  uuids: string[];
  skippedRecords: number;
  warnings: string[];
}

export interface DecodedSavedWorld {
  worldId: number;
  kind: SavedWorldRecord["kind"];
  visited: boolean;
}

export interface DecodedSave {
  metadata: SaveMetadata;
  terrain: NormalizedTerrainTransfer;
  playerContent: NormalizedPlayerContentTransfer;
  worlds: DecodedSavedWorld[];
  progress: SaveProgress;
}

export interface SerializedSaveError {
  code: SaveErrorCode;
  message: string;
  stage?: string;
  offset?: number;
}

export interface WorkerInboundMessage {
  type: "parse";
  requestId: number;
  fileName: string;
  bytes: ArrayBuffer;
  catalog: TileCatalog;
}

export type WorkerOutboundMessage =
  | { type: "progress"; requestId: number; stage: SaveStage }
  | { type: "success"; requestId: number; save: DecodedSave }
  | { type: "error"; requestId: number; error: SerializedSaveError };
