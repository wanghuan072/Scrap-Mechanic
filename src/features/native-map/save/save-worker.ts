import { serializeSaveError } from "./save-errors";
import type { WorkerInboundMessage, WorkerOutboundMessage } from "./save-protocol";
import { readSaveRecords } from "./sqlite-reader";
import { decodeDiscoveredSurface } from "./script-data-decoder";
import type { SaveRecords } from "./sqlite-records";
import { decodeWorldDescriptors } from "./world-descriptor-decoder";
import type { DecodedSavedWorld, SaveProgress } from "./save-protocol";
import { decodeSaveProgress } from "./save-progress-decoder";
import {
  normalizeTerrainTransfer,
  terrainTransferables
} from "../terrain/normalize-terrain";
import {
  decodePlayerContent,
  emptyPlayerContent,
  playerContentTransferables
} from "./player-content-decoder";
import type { NormalizedPlayerContentTransfer } from "./save-protocol";

interface WorkerScope {
  addEventListener(type: "message", listener: (event: MessageEvent<WorkerInboundMessage>) => void): void;
  postMessage(message: WorkerOutboundMessage, transfer?: Transferable[]): void;
}

const workerScope = globalThis as unknown as WorkerScope;

if ("importScripts" in globalThis) {
  workerScope.addEventListener("message", (event) => {
    void parseSaveRequest(event.data);
  });
}

interface SaveWorkerDependencies {
  read(bytes: Uint8Array): ReturnType<typeof readSaveRecords>;
  decode(records: SaveRecords): ReturnType<typeof decodeDiscoveredSurface>;
  decodePlayer?(
    records: SaveRecords,
    overworldId: number
  ): NormalizedPlayerContentTransfer;
  decodeProgress?(records: SaveRecords): SaveProgress;
  normalize: typeof normalizeTerrainTransfer;
}

const defaultDependencies: SaveWorkerDependencies = {
  read: readSaveRecords,
  decode: decodeDiscoveredSurface,
  decodePlayer: (records, overworldId) =>
    decodePlayerContent(records.playerRows, overworldId),
  decodeProgress: (records) => decodeSaveProgress(records.storage),
  normalize: normalizeTerrainTransfer
};

function decodeSavedWorldState(records: SaveRecords): {
  worlds: DecodedSavedWorld[];
} {
  const surface = decodeWorldDescriptors(records)
    .find((record) => record.kind === "surface");
  return {
    worlds: surface ? [{ worldId: surface.worldId, kind: "surface", visited: true }] : []
  };
}

export async function parseSaveRequest(
  message: WorkerInboundMessage,
  scope: WorkerScope = workerScope,
  dependencies: SaveWorkerDependencies = defaultDependencies
): Promise<void> {
  const { requestId } = message;
  try {
    scope.postMessage({ type: "progress", requestId, stage: "reading" });
    scope.postMessage({ type: "progress", requestId, stage: "sqlite" });
    const records = await dependencies.read(new Uint8Array(message.bytes));
    scope.postMessage({ type: "progress", requestId, stage: "decompressing" });
    scope.postMessage({ type: "progress", requestId, stage: "decoding" });
    const discoveredSurface = dependencies.decode(records);
    const decodedTerrain = discoveredSurface.value;
    const savedWorldState = decodeSavedWorldState(records);
    const progress = dependencies.decodeProgress
      ? dependencies.decodeProgress(records)
      : decodeSaveProgress(records.storage);
    scope.postMessage({ type: "progress", requestId, stage: "normalizing" });
    const metadata = {
      fileName: message.fileName,
      saveVersion: 28 as const,
      seed: records.seed
    };
    const terrain = dependencies.normalize(
      decodedTerrain,
      metadata,
      message.catalog
    );
    scope.postMessage({ type: "progress", requestId, stage: "player-content" });
    let playerContent: NormalizedPlayerContentTransfer;
    try {
      playerContent = dependencies.decodePlayer
        ? dependencies.decodePlayer(records, discoveredSurface.worldId)
        : records.playerRows
          ? decodePlayerContent(records.playerRows, discoveredSurface.worldId)
          : emptyPlayerContent(["Player content was not available in this save reader."]);
    } catch (error) {
      playerContent = emptyPlayerContent([
        `Player content could not be decoded: ${error instanceof Error ? error.message : String(error)}`
      ]);
    }
    scope.postMessage({ type: "progress", requestId, stage: "rendering" });
    const success: WorkerOutboundMessage = {
      type: "success",
      requestId,
      save: {
        metadata,
        terrain,
        playerContent,
        worlds: savedWorldState.worlds,
        progress
      }
    };
    const transfer: Transferable[] = terrainTransferables(terrain);
    transfer.push(...playerContentTransferables(playerContent));
    scope.postMessage(success, transfer);
  } catch (error) {
    scope.postMessage({
      type: "error",
      requestId,
      error: serializeSaveError(error)
    });
  }
}
