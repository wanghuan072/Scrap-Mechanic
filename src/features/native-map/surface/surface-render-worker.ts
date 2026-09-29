/// <reference lib="webworker" />

import type { CellBounds } from "../domain/map-model";
import { readBoundedVendorResponse } from "../vendor/sm-map-generator-assets";
import {
  surfaceSeamOverlap,
  type SurfaceChunkRequest,
  type SurfaceRenderDiagnostics,
  type SurfaceWorkerResponse
} from "./surface-render-protocol";
import type { VendorPlacement } from "./vendor-placement-planner";
import type { VendorSurfaceImage } from "./vendor-surface-types";

export const FALLBACK_RGBA = "#6f7476";
const FALLBACK_ALTERNATE = "#555a5c";
const DEFAULT_MAXIMUM_CACHED_IMAGES = 64;

export interface SurfaceDecodedImage {
  readonly width: number;
  readonly height: number;
  close(): void;
}

export interface SurfaceCanvasContext {
  fillStyle: string;
  imageSmoothingEnabled: boolean;
  imageSmoothingQuality: ImageSmoothingQuality;
  save(): void;
  restore(): void;
  beginPath(): void;
  rect(x: number, y: number, width: number, height: number): void;
  clip(): void;
  translate(x: number, y: number): void;
  rotate(radians: number): void;
  drawImage(image: SurfaceDecodedImage, dx: number, dy: number, width: number, height: number): void;
  fillRect(x: number, y: number, width: number, height: number): void;
}

export interface SurfaceCanvas {
  width: number;
  height: number;
  getContext(type: "2d"): SurfaceCanvasContext | null;
}

export interface SurfaceChunkDependencies {
  loadImage(image: VendorSurfaceImage): Promise<SurfaceDecodedImage>;
  createCanvas(width: number, height: number): SurfaceCanvas;
}

export interface RenderedSurfaceChunk {
  readonly canvas: SurfaceCanvas;
  readonly width: number;
  readonly height: number;
  readonly diagnostics: SurfaceRenderDiagnostics;
}

export interface VerifiedVendorImageCacheOptions {
  fetcher?: typeof fetch;
  decode?: (bytes: Uint8Array, image: VendorSurfaceImage) => Promise<SurfaceDecodedImage>;
  maximumEntries?: number;
}

interface CachedImage {
  promise: Promise<SurfaceDecodedImage>;
  decoded?: SurfaceDecodedImage;
}

async function sha256Hex(bytes: Uint8Array): Promise<string> {
  const owned = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(owned).set(bytes);
  const digest = await crypto.subtle.digest("SHA-256", owned);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function defaultDecode(
  bytes: Uint8Array,
  image: VendorSurfaceImage
): Promise<SurfaceDecodedImage> {
  const blobBytes = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(blobBytes).set(bytes);
  const bitmap = await createImageBitmap(new Blob([blobBytes], { type: "image/webp" }));
  if (bitmap.width !== image.width || bitmap.height !== image.height) {
    bitmap.close();
    throw new Error(`Vendor image dimensions do not match: ${image.url}`);
  }
  return bitmap;
}

export class VerifiedVendorImageCache {
  private readonly fetcher: typeof fetch;
  private readonly decode: NonNullable<VerifiedVendorImageCacheOptions["decode"]>;
  private readonly maximumEntries: number;
  private readonly entries = new Map<string, CachedImage>();
  private disposed = false;

  constructor(options: VerifiedVendorImageCacheOptions = {}) {
    this.fetcher = options.fetcher ?? fetch;
    this.decode = options.decode ?? defaultDecode;
    this.maximumEntries = options.maximumEntries ?? DEFAULT_MAXIMUM_CACHED_IMAGES;
    if (!Number.isSafeInteger(this.maximumEntries) || this.maximumEntries < 1) {
      throw new Error("Vendor image cache size must be a positive integer");
    }
  }

  load(image: VendorSurfaceImage): Promise<SurfaceDecodedImage> {
    if (this.disposed) return Promise.reject(new DOMException("Vendor image cache disposed.", "AbortError"));
    const key = `${image.url}:${image.contentHash}`;
    const current = this.entries.get(key);
    if (current) {
      this.entries.delete(key);
      this.entries.set(key, current);
      return current.promise;
    }

    const cached: CachedImage = { promise: Promise.resolve(undefined as never) };
    cached.promise = this.loadVerified(image).then((decoded) => {
      if (this.disposed || !this.entries.has(key)) {
        decoded.close();
        throw new DOMException("Vendor image was evicted before use.", "AbortError");
      }
      cached.decoded = decoded;
      return decoded;
    }).catch((error) => {
      if (this.entries.get(key) === cached) this.entries.delete(key);
      throw error;
    });
    this.entries.set(key, cached);
    this.trim();
    return cached.promise;
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    for (const entry of this.entries.values()) {
      if (entry.decoded) entry.decoded.close();
      else void entry.promise.then((decoded) => decoded.close()).catch(() => {});
    }
    this.entries.clear();
  }

  private async loadVerified(image: VendorSurfaceImage): Promise<SurfaceDecodedImage> {
    const fetcher = this.fetcher;
    const response = await fetcher(image.url);
    if (!response.ok) throw new Error(`Vendor image request failed (${response.status}): ${image.url}`);
    const bytes = await readBoundedVendorResponse(response, image.bytes, `Vendor image ${image.url}`);
    if (bytes.byteLength !== image.bytes || await sha256Hex(bytes) !== image.contentHash) {
      throw new Error(`Vendor image integrity check failed: ${image.url}`);
    }
    const decoded = await this.decode(bytes, image);
    if (decoded.width !== image.width || decoded.height !== image.height) {
      decoded.close();
      throw new Error(`Vendor image dimensions do not match: ${image.url}`);
    }
    return decoded;
  }

  private trim(): void {
    while (this.entries.size > this.maximumEntries) {
      const oldestKey = this.entries.keys().next().value as string | undefined;
      if (oldestKey === undefined) return;
      const oldest = this.entries.get(oldestKey);
      this.entries.delete(oldestKey);
      if (oldest?.decoded) oldest.decoded.close();
      else if (oldest) void oldest.promise.then((decoded) => decoded.close()).catch(() => {});
    }
  }
}

function intersects(left: CellBounds, right: CellBounds): boolean {
  return left.minX <= right.maxX && left.maxX >= right.minX
    && left.minY <= right.maxY && left.maxY >= right.minY;
}

function drawPlacement(
  context: SurfaceCanvasContext,
  image: SurfaceDecodedImage,
  placement: VendorPlacement,
  request: SurfaceChunkRequest,
  width: number,
  height: number
): void {
  const scale = request.pixelsPerCell;
  const chunkCanvasX = request.bounds.minX - request.plan.worldBounds.minX;
  const chunkCanvasY = request.plan.worldBounds.maxY - request.bounds.maxY;
  const left = (placement.destination.x - chunkCanvasX) * scale;
  const top = (placement.destination.y - chunkCanvasY) * scale;
  const destinationWidth = placement.destination.width * scale;
  const destinationHeight = placement.destination.height * scale;
  const sourceWidth = placement.image.cellsWide * scale;
  const sourceHeight = placement.image.cellsHigh * scale;
  const overlap = surfaceSeamOverlap(scale);
  const drawWidth = sourceWidth + overlap;
  const drawHeight = sourceHeight + overlap;
  const offset = overlap / 2;

  context.save();
  context.beginPath();
  context.rect(0, 0, width, height);
  context.clip();
  if (placement.clockwiseTurns === 0) {
    context.drawImage(image, left - offset, top - offset, drawWidth, drawHeight);
  } else {
    context.translate(left + destinationWidth / 2, top + destinationHeight / 2);
    context.rotate((-placement.clockwiseTurns * Math.PI) / 2);
    context.drawImage(image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
  }
  context.restore();
}

function drawMissingCell(
  context: SurfaceCanvasContext,
  x: number,
  y: number,
  request: SurfaceChunkRequest
): void {
  const scale = request.pixelsPerCell;
  const left = (x - request.bounds.minX) * scale;
  const top = (request.bounds.maxY - y) * scale;
  context.fillStyle = FALLBACK_RGBA;
  context.fillRect(left, top, scale, scale);
  context.fillStyle = FALLBACK_ALTERNATE;
  const half = scale / 2;
  context.fillRect(left, top, half, half);
  context.fillRect(left + half, top + half, half, half);
}

export async function renderSurfaceChunk(
  request: SurfaceChunkRequest,
  dependencies: SurfaceChunkDependencies
): Promise<RenderedSurfaceChunk> {
  if (!Number.isInteger(request.pixelsPerCell) || request.pixelsPerCell < 1 || request.pixelsPerCell > 100) {
    throw new Error("Surface pixel scale is invalid.");
  }
  if (!intersects(request.bounds, request.plan.worldBounds)) {
    throw new Error("Surface chunk is outside the planned world bounds.");
  }
  const cellWidth = request.bounds.maxX - request.bounds.minX + 1;
  const cellHeight = request.bounds.maxY - request.bounds.minY + 1;
  if (cellWidth < 1 || cellHeight < 1) throw new Error("Surface chunk bounds are invalid.");
  const width = cellWidth * request.pixelsPerCell;
  const height = cellHeight * request.pixelsPerCell;
  const canvas = dependencies.createCanvas(width, height);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Surface worker could not create a 2D context.");
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  const ocean = await dependencies.loadImage(request.plan.oceanImage);
  for (let y = 0; y < cellHeight; y += 1) {
    for (let x = 0; x < cellWidth; x += 1) {
      context.drawImage(
        ocean,
        x * request.pixelsPerCell,
        y * request.pixelsPerCell,
        request.pixelsPerCell,
        request.pixelsPerCell
      );
    }
  }

  const orderedPlacements = [...request.plan.placements].sort((left, right) =>
    Number(left.image.role === "excavation-composite")
      - Number(right.image.role === "excavation-composite")
  );
  for (const placement of orderedPlacements) {
    if (!intersects(placement.cellBounds, request.bounds)) continue;
    const decoded = await dependencies.loadImage(placement.image);
    drawPlacement(context, decoded, placement, request, width, height);
  }

  const missingUuids = new Set<string>();
  let missingFragments = 0;
  for (const cell of request.plan.missingCells) {
    if (!intersects({ minX: cell.x, minY: cell.y, maxX: cell.x, maxY: cell.y }, request.bounds)) continue;
    drawMissingCell(context, cell.x, cell.y, request);
    missingUuids.add(cell.uuid);
    missingFragments += 1;
  }

  return {
    canvas,
    width,
    height,
    diagnostics: { missingFragments, missingUuids: [...missingUuids].sort() }
  };
}

function createOffscreenCanvas(width: number, height: number): SurfaceCanvas {
  return new OffscreenCanvas(width, height) as unknown as SurfaceCanvas;
}

const workerScope = globalThis as unknown as DedicatedWorkerGlobalScope;
if (typeof WorkerGlobalScope !== "undefined" && workerScope instanceof WorkerGlobalScope) {
  const cache = new VerifiedVendorImageCache();
  workerScope.onmessage = async (event: MessageEvent<SurfaceChunkRequest>) => {
    const request = event.data;
    try {
      const rendered = await renderSurfaceChunk(request, {
        loadImage: (image) => cache.load(image),
        createCanvas: createOffscreenCanvas
      });
      const offscreen = rendered.canvas as unknown as OffscreenCanvas;
      const bitmap = offscreen.transferToImageBitmap();
      const response: SurfaceWorkerResponse = {
        type: "rendered",
        requestId: request.requestId,
        generation: request.generation,
        bounds: request.bounds,
        bitmap,
        diagnostics: rendered.diagnostics
      };
      workerScope.postMessage(response, [bitmap]);
    } catch (error) {
      const response: SurfaceWorkerResponse = {
        type: "error",
        requestId: request.requestId,
        generation: request.generation,
        message: error instanceof Error ? error.message : String(error)
      };
      workerScope.postMessage(response);
    }
  };
}
