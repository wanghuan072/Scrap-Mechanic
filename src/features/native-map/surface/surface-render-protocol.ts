import type { CellBounds } from "../domain/map-model";
import type { VendorSurfacePlan } from "./vendor-placement-planner";

export const SURFACE_CHUNK_CELLS = 8;
export const MAX_SURFACE_CHUNKS = 252;
export const MAX_ACTIVE_SURFACE_CHUNKS = 96;
export const SURFACE_OVERVIEW_PIXELS_PER_CELL = 4;
export const SURFACE_DETAIL_PIXELS_PER_CELL = 32;

export function surfaceSeamOverlap(pixelsPerCell: number): 0.5 | 1 {
  if (!Number.isFinite(pixelsPerCell) || pixelsPerCell <= 0) {
    throw new Error("Surface render scale must be a positive number of pixels per cell");
  }
  return pixelsPerCell >= 50 ? 1 : 0.5;
}

export interface SurfaceRenderDiagnostics {
  missingFragments: number;
  missingUuids: string[];
}

export interface SurfaceChunkRequest {
  requestId: string;
  generation: number;
  bounds: CellBounds;
  plan: VendorSurfacePlan;
  pixelsPerCell: number;
}

export interface PreparedSurfaceChunk {
  id: string;
  bounds: CellBounds;
  bitmap: ImageBitmap;
}

export interface PreparedSurfaceFrame {
  generation: number;
  bounds: CellBounds;
  overview: PreparedSurfaceChunk;
  chunks: Map<string, PreparedSurfaceChunk>;
  diagnostics: SurfaceRenderDiagnostics;
  ensureChunks(bounds: CellBounds): Promise<void>;
  dispose(): void;
}

export interface SurfaceWorkerSuccessMessage {
  type: "rendered";
  requestId: string;
  generation: number;
  bounds: CellBounds;
  bitmap: ImageBitmap;
  diagnostics: SurfaceRenderDiagnostics;
}

export interface SurfaceWorkerErrorMessage {
  type: "error";
  requestId: string;
  generation: number;
  message: string;
}

export type SurfaceWorkerResponse =
  | SurfaceWorkerSuccessMessage
  | SurfaceWorkerErrorMessage;
