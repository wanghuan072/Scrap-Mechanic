import type * as L from "leaflet";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { PreparedSurfaceFrame } from "../surface/surface-render-protocol";

vi.mock("leaflet", () => ({ DomUtil: { setPosition: vi.fn() } }));
import { SurfaceChunkLayer } from "./surface-chunk-layer";

afterEach(() => vi.unstubAllGlobals());

describe("surface detail canvas replacement", () => {
  it("replaces the existing canvas when a chunk upgrades after zooming", async () => {
    const elements: Array<{ width: number; height: number; dataset: Record<string, string>; style: Record<string, string>; remove: ReturnType<typeof vi.fn>; append: ReturnType<typeof vi.fn> }> = [];
    vi.stubGlobal("document", { createElement: () => {
      const element = { width: 0, height: 0, dataset: {}, style: {}, remove: vi.fn(), append: vi.fn() };
      elements.push(element);
      return element;
    } });
    vi.stubGlobal("navigator", { userAgent: "jsdom" });
    vi.stubGlobal("window", { devicePixelRatio: 1 });
    let zoom = -3;
    const map = {
      getPanes: () => ({ overlayPane: { append: vi.fn() } }),
      on: vi.fn(), off: vi.fn(), getZoom: () => zoom,
      getContainer: () => new EventTarget(),
      latLngToLayerPoint: ([lat, lng]: number[]) => ({ x: lng, y: -lat })
    } as unknown as L.Map;
    const bounds = { minX: 0, minY: 0, maxX: 7, maxY: 7 };
    const chunks: PreparedSurfaceFrame["chunks"] = new Map();
    const frame: PreparedSurfaceFrame = {
      generation: 1, bounds, chunks,
      overview: { id: "overview", bounds, bitmap: { width: 32, height: 32 } as ImageBitmap },
      diagnostics: { missingFragments: 0, missingUuids: [] },
      ensureChunks: vi.fn(async (_, ready, scale = 100) => {
        const chunk = { id: "0:0", bounds, bitmap: { width: 8 * scale, height: 8 * scale } as ImageBitmap };
        chunks.set(chunk.id, chunk);
        ready?.(chunk);
      }),
      cancelChunks: vi.fn(), dispose: vi.fn()
    };
    const layer = new SurfaceChunkLayer(map);
    layer.install(frame);
    await Promise.resolve();
    const oldCanvas = elements.find((element) => element.dataset.surfaceChunkId === "0:0")!;
    expect(oldCanvas.width).toBe(128);
    zoom = 0;
    vi.stubGlobal("window", { devicePixelRatio: 2 });
    layer.updateVisible(bounds);
    await Promise.resolve();
    const newCanvas = elements.filter((element) => element.dataset.surfaceChunkId === "0:0").at(-1)!;
    expect(newCanvas).not.toBe(oldCanvas);
    expect(newCanvas.width).toBe(800);
    expect(oldCanvas.remove).toHaveBeenCalledOnce();
    expect(frame.ensureChunks).toHaveBeenLastCalledWith(bounds, expect.any(Function), 100);
    layer.dispose();
  });
});
