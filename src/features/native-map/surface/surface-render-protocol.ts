import type { CellBounds } from "../domain/map-model";
import type { VendorSurfacePlan } from "./vendor-placement-planner";

export const SURFACE_CHUNK_CELLS = 8;
export const MAX_SURFACE_CHUNKS = 252;
export const MAX_ACTIVE_SURFACE_CHUNKS = 96;
export const SURFACE_OVERVIEW_PIXELS_PER_CELL = 4;
export const SURFACE_DETAIL_PIXELS_PER_CELL = 100;
export const SURFACE_DETAIL_MIN_ZOOM = -3;

/** 按屏幕实际像素渲染，最高保留原素材每格 100px，不靠拉伸低清缓存放大。 */
export function surfaceDetailPixelsPerCell(zoom: number, pixelRatio = 1): number {
  const safeZoom = Number.isFinite(zoom) ? Math.min(0, Math.max(-3, zoom)) : -3;
  const ratio = Number.isFinite(pixelRatio) ? Math.min(3, Math.max(1, pixelRatio)) : 1;
  const required = 64 * 2 ** safeZoom * ratio;
  return [16, 32, 64, SURFACE_DETAIL_PIXELS_PER_CELL].find((scale) => scale >= required)
    ?? SURFACE_DETAIL_PIXELS_PER_CELL;
}

export function shouldRenderSurfaceDetails(zoom: number): boolean {
  return Number.isFinite(zoom) && zoom >= SURFACE_DETAIL_MIN_ZOOM;
}

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
  ensureChunks(
    bounds: CellBounds,
    onChunkReady?: (chunk: PreparedSurfaceChunk) => void,
    pixelsPerCell?: number
  ): Promise<void>;
  cancelChunks(): void;
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
