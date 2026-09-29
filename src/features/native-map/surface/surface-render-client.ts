import type { CellBounds, WorldMap } from "../domain/map-model";
import { planVendorSurface } from "./vendor-placement-planner";
import { createVendorSurfaceRepository } from "./vendor-surface-repository";
import type { VendorSurfaceRepository } from "./vendor-surface-types";
import {
  MAX_ACTIVE_SURFACE_CHUNKS,
  MAX_SURFACE_CHUNKS,
  SURFACE_CHUNK_CELLS,
  SURFACE_DETAIL_PIXELS_PER_CELL,
  SURFACE_OVERVIEW_PIXELS_PER_CELL,
  type PreparedSurfaceChunk,
  type PreparedSurfaceFrame,
  type SurfaceChunkRequest,
  type SurfaceRenderDiagnostics,
  type SurfaceWorkerResponse
} from "./surface-render-protocol";

export interface SurfaceWorkerChunkResult extends PreparedSurfaceChunk {
  diagnostics: SurfaceRenderDiagnostics;
}

export interface SurfaceWorkerAdapter {
  render(request: SurfaceChunkRequest): Promise<SurfaceWorkerChunkResult>;
  terminate(): void;
}

interface SurfaceRenderClientOptions {
  repository?: Pick<VendorSurfaceRepository, "load">;
  createWorker?: () => SurfaceWorkerAdapter;
}

export interface SurfacePrepareOptions {
  viewportBounds?: CellBounds;
  paddingChunks?: number;
}

class BrowserSurfaceWorkerAdapter implements SurfaceWorkerAdapter {
  private readonly worker = new Worker(
    new URL("./surface-render-worker.ts", import.meta.url),
    { type: "module" }
  );
  private readonly pending = new Map<
    string,
    { resolve(value: SurfaceWorkerChunkResult): void; reject(reason: unknown): void }
  >();
  private terminated = false;

  constructor() {
    this.worker.onmessage = (event: MessageEvent<SurfaceWorkerResponse>) => {
      const response = event.data;
      const pending = this.pending.get(response.requestId);
      if (!pending) {
        if (response.type === "rendered") response.bitmap.close();
        return;
      }
      this.pending.delete(response.requestId);
      if (response.type === "error") {
        pending.reject(new Error(response.message));
      } else {
        pending.resolve({
          id: `${response.bounds.minX}:${response.bounds.minY}`,
          bounds: response.bounds,
          bitmap: response.bitmap,
          diagnostics: response.diagnostics
        });
      }
    };
    this.worker.onerror = (event) => {
      for (const pending of this.pending.values()) {
        pending.reject(event.error ?? new Error(event.message));
      }
      this.pending.clear();
    };
  }

  render(request: SurfaceChunkRequest): Promise<SurfaceWorkerChunkResult> {
    if (this.terminated) return Promise.reject(abortError());
    return new Promise((resolve, reject) => {
      this.pending.set(request.requestId, { resolve, reject });
      this.worker.postMessage(request);
    });
  }

  terminate(): void {
    if (this.terminated) return;
    this.terminated = true;
    this.worker.terminate();
    for (const pending of this.pending.values()) pending.reject(abortError());
    this.pending.clear();
  }
}

function abortError(): DOMException {
  return new DOMException("Surface preparation was replaced.", "AbortError");
}

function intersect(left: CellBounds, right: CellBounds): CellBounds | undefined {
  const bounds = {
    minX: Math.max(left.minX, right.minX),
    minY: Math.max(left.minY, right.minY),
    maxX: Math.min(left.maxX, right.maxX),
    maxY: Math.min(left.maxY, right.maxY)
  };
  return bounds.minX <= bounds.maxX && bounds.minY <= bounds.maxY ? bounds : undefined;
}

function chunkBounds(world: WorldMap, requested: CellBounds, paddingChunks = 1): CellBounds[] {
  const padding = paddingChunks * SURFACE_CHUNK_CELLS;
  const visible = intersect(world.bounds, {
    minX: requested.minX - padding,
    minY: requested.minY - padding,
    maxX: requested.maxX + padding,
    maxY: requested.maxY + padding
  });
  if (!visible) return [];
  const startX = Math.floor((visible.minX - world.bounds.minX) / SURFACE_CHUNK_CELLS)
    * SURFACE_CHUNK_CELLS + world.bounds.minX;
  const startY = Math.floor((visible.minY - world.bounds.minY) / SURFACE_CHUNK_CELLS)
    * SURFACE_CHUNK_CELLS + world.bounds.minY;
  const chunks: CellBounds[] = [];
  for (let y = startY; y <= visible.maxY; y += SURFACE_CHUNK_CELLS) {
    for (let x = startX; x <= visible.maxX; x += SURFACE_CHUNK_CELLS) {
      chunks.push({
        minX: x,
        minY: y,
        maxX: Math.min(x + SURFACE_CHUNK_CELLS - 1, world.bounds.maxX),
        maxY: Math.min(y + SURFACE_CHUNK_CELLS - 1, world.bounds.maxY)
      });
    }
  }
  const centerX = (requested.minX + requested.maxX) / 2;
  const centerY = (requested.minY + requested.maxY) / 2;
  chunks.sort((left, right) => {
    const distance = (bounds: CellBounds) =>
      Math.abs((bounds.minX + bounds.maxX) / 2 - centerX)
      + Math.abs((bounds.minY + bounds.maxY) / 2 - centerY);
    return distance(left) - distance(right)
      || left.minY - right.minY
      || left.minX - right.minX;
  });
  if (chunks.length > MAX_SURFACE_CHUNKS) chunks.length = MAX_SURFACE_CHUNKS;
  return chunks.slice(0, MAX_ACTIVE_SURFACE_CHUNKS);
}

export class SurfaceRenderClient {
  private readonly repository: Pick<VendorSurfaceRepository, "load">;
  private readonly createWorker: () => SurfaceWorkerAdapter;
  private generation = 0;
  private active?: { generation: number; terminate(): void; reject(reason: unknown): void };
  private readonly frames = new Set<PreparedSurfaceFrame>();

  constructor(options: SurfaceRenderClientOptions = {}) {
    this.repository = options.repository ?? createVendorSurfaceRepository();
    this.createWorker = options.createWorker ?? (() => new BrowserSurfaceWorkerAdapter());
  }

  async prepare(world: WorldMap, options: SurfacePrepareOptions = {}): Promise<PreparedSurfaceFrame> {
    const generation = ++this.generation;
    if (this.active) {
      this.active.terminate();
      this.active.reject(abortError());
      this.active = undefined;
    }
    const worker = this.createWorker();
    let terminated = false;
    const terminate = () => {
      if (terminated) return;
      terminated = true;
      worker.terminate();
    };
    let rejectActive!: (reason: unknown) => void;
    const aborted = new Promise<never>((_, reject) => { rejectActive = reject; });
    this.active = { generation, terminate, reject: rejectActive };

    const work = (async () => {
      const bundle = await this.repository.load();
      if (terminated || this.active?.generation !== generation) throw abortError();
      const plan = planVendorSurface(world, bundle);
      const overviewResult = await worker.render({
        requestId: `${generation}:overview`,
        generation,
        bounds: world.bounds,
        plan,
        pixelsPerCell: SURFACE_OVERVIEW_PIXELS_PER_CELL
      });
      if (this.active?.generation !== generation) {
        overviewResult.bitmap.close();
        throw abortError();
      }
      this.active = undefined;
      const chunks = new Map<string, PreparedSurfaceChunk>();
      const recency = new Map<string, number>();
      let clock = 0;
      let disposed = false;
      let queue = Promise.resolve();
      let ensureVersion = 0;
      const frames = this.frames;
      const overview: PreparedSurfaceChunk = {
        id: "overview",
        bounds: world.bounds,
        bitmap: overviewResult.bitmap
      };
      const frame: PreparedSurfaceFrame = {
        generation,
        bounds: world.bounds,
        overview,
        chunks,
        diagnostics: overviewResult.diagnostics,
        ensureChunks(bounds) {
          const version = ++ensureVersion;
          const desiredBounds = chunkBounds(world, bounds, options.paddingChunks ?? 1);
          const desiredIds = new Set(desiredBounds.map((item) => `${item.minX}:${item.minY}`));
          const task = queue.catch(() => {}).then(async () => {
            if (disposed || version !== ensureVersion) return;
            for (const item of desiredBounds) {
              if (disposed || version !== ensureVersion) return;
              const id = `${item.minX}:${item.minY}`;
              recency.set(id, ++clock);
              if (chunks.has(id)) continue;
              const result = await worker.render({
                requestId: `${generation}:${id}:${clock}`,
                generation,
                bounds: item,
                plan,
                pixelsPerCell: SURFACE_DETAIL_PIXELS_PER_CELL
              });
              if (disposed || version !== ensureVersion) {
                result.bitmap.close();
                return;
              }
              chunks.set(id, { id, bounds: item, bitmap: result.bitmap });
              while (chunks.size > MAX_ACTIVE_SURFACE_CHUNKS) {
                const victim = [...chunks.keys()]
                  .filter((candidate) => !desiredIds.has(candidate))
                  .sort((left, right) => (recency.get(left) ?? 0) - (recency.get(right) ?? 0))[0]
                  ?? [...chunks.keys()].sort((left, right) =>
                    (recency.get(left) ?? 0) - (recency.get(right) ?? 0))[0];
                if (!victim) break;
                chunks.get(victim)?.bitmap.close();
                chunks.delete(victim);
                recency.delete(victim);
              }
            }
          });
          queue = task.catch(() => {});
          return task;
        },
        dispose() {
          if (disposed) return;
          disposed = true;
          terminate();
          overview.bitmap.close();
          for (const chunk of chunks.values()) chunk.bitmap.close();
          chunks.clear();
          frames.delete(frame);
        }
      };
      this.frames.add(frame);
      return frame;
    })().catch((error) => {
      terminate();
      if (this.active?.generation === generation) this.active = undefined;
      throw error;
    });
    return Promise.race([work, aborted]);
  }

  dispose(): void {
    this.generation += 1;
    if (this.active) {
      this.active.terminate();
      this.active.reject(abortError());
      this.active = undefined;
    }
    for (const frame of this.frames) frame.dispose();
    this.frames.clear();
  }
}
