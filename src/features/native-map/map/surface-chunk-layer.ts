import * as L from "leaflet";
import type { CellBounds } from "../domain/map-model";
import {
  MAX_ACTIVE_SURFACE_CHUNKS,
  shouldRenderSurfaceDetails,
  surfaceDetailPixelsPerCell,
  type PreparedSurfaceFrame
} from "../surface/surface-render-protocol";

function intersects(left: CellBounds, right: CellBounds): boolean {
  return left.minX <= right.maxX && left.maxX >= right.minX
    && left.minY <= right.maxY && left.maxY >= right.minY;
}

export class SurfaceChunkLayer {
  private committed?: PreparedSurfaceFrame;
  private staged?: PreparedSurfaceFrame;
  private activeIds: string[] = [];
  private recency = new Map<string, number>();
  private clock = 0;
  private visibilityRequest = 0;
  private map?: L.Map;
  private container?: HTMLDivElement;
  private visible = true;
  private readonly canvases = new Map<string, HTMLCanvasElement>();
  private readonly canvasBitmaps = new Map<string, ImageBitmap>();

  constructor(map?: L.Map) {
    if (map) this.attach(map);
  }

  attach(map: L.Map): void {
    if (this.map === map) return;
    this.detach();
    this.map = map;
    const container = document.createElement("div");
    container.className = "surface-chunk-layer leaflet-zoom-hide";
    container.dataset.surfaceChunks = "";
    container.style.position = "absolute";
    container.style.inset = "0";
    container.style.pointerEvents = "none";
    map.getPanes().overlayPane.append(container);
    this.container = container;
    map.on("zoom viewreset moveend", this.layout, this);
    this.renderActive();
  }

  detach(): void {
    this.map?.off("zoom viewreset moveend", this.layout, this);
    this.container?.remove();
    this.canvases.clear();
    this.canvasBitmaps.clear();
    this.container = undefined;
    this.map = undefined;
  }

  setVisible(visible: boolean): void {
    this.visible = visible;
    if (this.container) this.container.hidden = !visible;
  }

  get currentFrame(): PreparedSurfaceFrame | undefined {
    return this.committed;
  }

  get activeChunkIds(): readonly string[] {
    return this.activeIds;
  }

  stage(frame: PreparedSurfaceFrame): void {
    if (this.staged === frame) return;
    this.staged?.dispose();
    this.staged = frame;
  }

  commit(frame: PreparedSurfaceFrame): void {
    if (this.staged !== frame) this.stage(frame);
    const previous = this.committed;
    this.committed = frame;
    this.staged = undefined;
    this.activeIds = [];
    this.recency.clear();
    this.visibilityRequest += 1;
    for (const canvas of this.canvases.values()) canvas.remove();
    this.canvases.clear();
    this.canvasBitmaps.clear();
    previous?.dispose();
    this.updateVisible(frame.bounds);
  }

  install(frame: PreparedSurfaceFrame): void {
    this.stage(frame);
    this.commit(frame);
  }

  discard(frame?: PreparedSurfaceFrame): void {
    if (!this.staged || (frame && frame !== this.staged)) return;
    const discarded = this.staged;
    this.staged = undefined;
    discarded.dispose();
  }

  updateVisible(bounds: CellBounds): void {
    if (!this.committed) {
      this.activeIds = [];
      return;
    }
    const frame = this.committed;
    const request = ++this.visibilityRequest;
    if (!this.map || !shouldRenderSurfaceDetails(this.map.getZoom())) {
      frame.cancelChunks();
      this.activeIds = [];
      this.renderActive();
      this.map?.getContainer().dispatchEvent(new Event("surface-ready"));
      return;
    }
    const visible = [...frame.chunks.values()]
      .filter((chunk) => intersects(chunk.bounds, bounds));
    for (const chunk of visible) this.recency.set(chunk.id, ++this.clock);
    visible.sort((left, right) =>
      (this.recency.get(right.id) ?? 0) - (this.recency.get(left.id) ?? 0)
    );
    this.activeIds = visible.slice(0, MAX_ACTIVE_SURFACE_CHUNKS).map((chunk) => chunk.id);
    this.renderActive();
    void frame.ensureChunks(bounds, () => {
      if (this.committed !== frame || request !== this.visibilityRequest) return;
      this.updateVisibleFromCache(bounds);
    }, surfaceDetailPixelsPerCell(this.map.getZoom(), window.devicePixelRatio)).then(() => {
      if (this.committed !== frame || request !== this.visibilityRequest) return;
      this.updateVisibleFromCache(bounds);
      this.map?.getContainer().dispatchEvent(new Event("surface-ready"));
    }).catch((error) => {
      if (this.committed !== frame || request !== this.visibilityRequest || !this.map) return;
      if (error instanceof DOMException && error.name === "AbortError") return;
      this.map.getContainer().dispatchEvent(new CustomEvent("surface-error", {
        detail: error instanceof Error ? error.message : String(error)
      }));
    });
  }

  private updateVisibleFromCache(bounds: CellBounds): void {
    if (!this.committed) return;
    const visible = [...this.committed.chunks.values()]
      .filter((chunk) => intersects(chunk.bounds, bounds));
    for (const chunk of visible) this.recency.set(chunk.id, ++this.clock);
    visible.sort((left, right) =>
      (this.recency.get(right.id) ?? 0) - (this.recency.get(left.id) ?? 0)
    );
    this.activeIds = visible.slice(0, MAX_ACTIVE_SURFACE_CHUNKS).map((chunk) => chunk.id);
    this.renderActive();
  }

  dispose(): void {
    const staged = this.staged;
    const committed = this.committed;
    this.staged = undefined;
    this.committed = undefined;
    this.activeIds = [];
    this.visibilityRequest += 1;
    if (staged && staged !== committed) staged.dispose();
    committed?.dispose();
    this.detach();
  }

  private renderActive(): void {
    if (!this.container || !this.committed) return;
    const active = new Set(["overview", ...this.activeIds]);
    for (const [id, canvas] of this.canvases) {
      if (!active.has(id)) {
        canvas.remove();
        this.canvases.delete(id);
        this.canvasBitmaps.delete(id);
      }
    }
    for (const id of ["overview", ...this.activeIds]) {
      const chunk = id === "overview"
        ? this.committed.overview
        : this.committed.chunks.get(id);
      if (!chunk) continue;
      if (this.canvasBitmaps.get(id) === chunk.bitmap) continue;
      // 同一分块放大后会升级位图；必须替换画布，而不是继续展示旧低清副本。
      this.canvases.get(id)?.remove();
      const canvas = document.createElement("canvas");
      canvas.width = chunk.bitmap.width;
      canvas.height = chunk.bitmap.height;
      canvas.dataset.surfaceChunkId = id;
      canvas.style.position = "absolute";
      const context = navigator.userAgent.includes("jsdom")
        ? null
        : canvas.getContext("2d");
      context?.drawImage(chunk.bitmap, 0, 0);
      this.container.append(canvas);
      this.canvases.set(id, canvas);
      this.canvasBitmaps.set(id, chunk.bitmap);
    }
    this.container.hidden = !this.visible;
    this.layout();
  }

  private readonly layout = (): void => {
    if (!this.map || !this.committed) return;
    for (const [id, canvas] of this.canvases) {
      const chunk = this.committed.chunks.get(id);
      const resolvedChunk = id === "overview" ? this.committed.overview : chunk;
      if (!resolvedChunk) continue;
      const topLeft = this.map.latLngToLayerPoint([
        (resolvedChunk.bounds.maxY + 1) * 64,
        resolvedChunk.bounds.minX * 64
      ]);
      const bottomRight = this.map.latLngToLayerPoint([
        resolvedChunk.bounds.minY * 64,
        (resolvedChunk.bounds.maxX + 1) * 64
      ]);
      L.DomUtil.setPosition(canvas, topLeft);
      canvas.style.width = `${bottomRight.x - topLeft.x}px`;
      canvas.style.height = `${bottomRight.y - topLeft.y}px`;
    }
  };
}
