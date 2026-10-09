import { describe, expect, it, vi } from "vitest";
import type { WorldMap } from "../domain/map-model";
import { SurfaceRenderClient, type SurfaceWorkerAdapter } from "./surface-render-client";
import type { VendorSurfaceBundle, VendorSurfaceImage } from "./vendor-surface-types";

const ocean: VendorSurfaceImage = {
  uuid: "ocean",
  role: "single-cell",
  url: "/ocean.webp",
  contentHash: "a".repeat(64),
  bytes: 1,
  width: 100,
  height: 100,
  cellsWide: 1,
  cellsHigh: 1
};
const excavation: VendorSurfaceImage = {
  role: "excavation-composite",
  url: "/excavation.webp",
  contentHash: "b".repeat(64),
  bytes: 1,
  width: 3200,
  height: 3200,
  cellsWide: 32,
  cellsHigh: 32
};
const bundle: VendorSurfaceBundle = {
  imagesByUuid: new Map([["ocean", ocean]]),
  excavationComposite: excavation,
  manifestHash: "c".repeat(64)
};
const world: WorldMap = {
  id: "surface",
  source: "reference",
  sourceContentHash: "d".repeat(64),
  gameVersion: "1.0.1.869",
  bounds: { minX: -64, minY: -48, maxX: 63, maxY: 47 },
  cells: [{
    x: 0,
    y: 0,
    uuid: "ocean",
    rotation: 0,
    xOffset: 0,
    yOffset: 0,
    flags: 0,
    terrainType: "8"
  }],
  locations: []
};

function bitmap(width = 256, height = 256) {
  return { width, height, close: vi.fn() } as unknown as ImageBitmap;
}

describe("SurfaceRenderClient", () => {
  it("reports missing detail artwork without replacing the usable overview", async () => {
    const overview = bitmap();
    const incomplete = bitmap();
    const client = new SurfaceRenderClient({
      repository: { load: vi.fn().mockResolvedValue(bundle) },
      overviewRepository: { load: vi.fn().mockResolvedValue({
        overview: { id: "overview", bounds: world.bounds, bitmap: overview },
        diagnostics: { missingFragments: 0, missingUuids: [] }
      }) },
      createWorker: () => ({ terminate: vi.fn(), render: vi.fn(async (request) => ({
        id: "0:0", bounds: request.bounds, bitmap: incomplete,
        diagnostics: { missingFragments: 1, missingUuids: ["unavailable"] }
      })) })
    });
    const frame = await client.prepare(world, { paddingChunks: 0 });
    await expect(frame.ensureChunks({ minX: 0, minY: 0, maxX: 7, maxY: 7 })).rejects.toThrow("terrain artwork");
    expect(incomplete.close).toHaveBeenCalledOnce();
    expect(overview.close).not.toHaveBeenCalled();
    expect(frame.chunks.size).toBe(0);
    client.dispose();
  });
  it("reloads failed detail dependencies when retrying, retaining the overview", async () => {
    const overview = bitmap();
    const load = vi.fn().mockRejectedValueOnce(new Error("Network unavailable")).mockResolvedValue(bundle);
    const render = vi.fn(async (request) => ({
      id: "0:0", bounds: request.bounds, bitmap: bitmap(),
      diagnostics: { missingFragments: 0, missingUuids: [] }
    }));
    const client = new SurfaceRenderClient({
      repository: { load },
      overviewRepository: { load: vi.fn().mockResolvedValue({
        overview: { id: "overview", bounds: world.bounds, bitmap: overview },
        diagnostics: { missingFragments: 0, missingUuids: [] }
      }) },
      createWorker: () => ({ render, terminate: vi.fn() })
    });
    const frame = await client.prepare(world, { paddingChunks: 0 });
    const bounds = { minX: 0, minY: 0, maxX: 7, maxY: 7 };
    await expect(frame.ensureChunks(bounds)).rejects.toThrow("Network unavailable");
    expect(overview.close).not.toHaveBeenCalled();
    await frame.ensureChunks(bounds);
    expect(load).toHaveBeenCalledTimes(2);
    expect(render).toHaveBeenCalledOnce();
    expect(frame.chunks.size).toBe(1);
    client.dispose();
  });
  it("upgrades cached detail after zooming in and reuses it after zooming out", async () => {
    const closeFunctions: ReturnType<typeof vi.fn>[] = [];
    const render = vi.fn(async (request) => {
      const rendered = bitmap(
        (request.bounds.maxX - request.bounds.minX + 1) * request.pixelsPerCell,
        (request.bounds.maxY - request.bounds.minY + 1) * request.pixelsPerCell
      );
      closeFunctions.push(rendered.close as ReturnType<typeof vi.fn>);
      return { id: "0:0", bounds: request.bounds, bitmap: rendered,
        diagnostics: { missingFragments: 0, missingUuids: [] } };
    });
    const client = new SurfaceRenderClient({
      repository: { load: vi.fn().mockResolvedValue(bundle) },
      overviewRepository: { load: vi.fn().mockResolvedValue({
        overview: { id: "overview", bounds: world.bounds, bitmap: bitmap() },
        diagnostics: { missingFragments: 0, missingUuids: [] }
      }) },
      createWorker: () => ({ render, terminate: vi.fn() })
    });
    const bounds = { minX: 0, minY: 0, maxX: 7, maxY: 7 };
    const frame = await client.prepare(world, { paddingChunks: 0 });
    const ready = vi.fn();
    await frame.ensureChunks(bounds, ready, 16);
    expect(frame.chunks.get("0:0")?.bitmap.width).toBe(128);
    await frame.ensureChunks(bounds, ready, 100);
    expect(frame.chunks.get("0:0")?.bitmap.width).toBe(800);
    expect(closeFunctions[0]).toHaveBeenCalledOnce();
    expect(ready).toHaveBeenCalledTimes(2);
    await frame.ensureChunks(bounds, ready, 16);
    expect(render).toHaveBeenCalledTimes(2);
    expect(closeFunctions[1]).not.toHaveBeenCalled();
    client.dispose();
    expect(closeFunctions[1]).toHaveBeenCalledOnce();
  });

  it("rejects invalid detail scales before starting a worker", async () => {
    const createWorker = vi.fn();
    const client = new SurfaceRenderClient({
      overviewRepository: { load: vi.fn().mockResolvedValue({
        overview: { id: "overview", bounds: world.bounds, bitmap: bitmap() },
        diagnostics: { missingFragments: 0, missingUuids: [] }
      }) },
      createWorker
    });
    const frame = await client.prepare(world);
    await expect(frame.ensureChunks(world.bounds, undefined, 101)).rejects.toThrow("pixel scale");
    expect(createWorker).not.toHaveBeenCalled();
    client.dispose();
  });
  it("does not create a detail worker for the bootstrap world", async () => {
    const createWorker = vi.fn();
    const loadVendor = vi.fn();
    const client = new SurfaceRenderClient({
      repository: { load: loadVendor },
      overviewRepository: { load: vi.fn().mockResolvedValue({
        overview: { id: "overview", bounds: world.bounds, bitmap: bitmap() },
        diagnostics: { missingFragments: 0, missingUuids: [] }
      }) },
      createWorker
    });
    const frame = await client.prepare({ ...world, isOverviewOnly: true });
    await frame.ensureChunks(world.bounds, vi.fn());
    expect(createWorker).not.toHaveBeenCalled();
    expect(loadVendor).not.toHaveBeenCalled();
    client.dispose();
  });
  it("uses the static reference overview and starts detail rendering only on demand", async () => {
    const overview = bitmap(512, 384);
    const loadVendor = vi.fn().mockResolvedValue(bundle);
    const render = vi.fn(async (request) => ({
      id: `${request.bounds.minX}:${request.bounds.minY}`,
      bounds: request.bounds,
      bitmap: bitmap(),
      diagnostics: { missingFragments: 0, missingUuids: [] }
    }));
    const createWorker = vi.fn(() => ({ render, terminate: vi.fn() }));
    const client = new SurfaceRenderClient({
      repository: { load: loadVendor },
      overviewRepository: {
        load: vi.fn().mockResolvedValue({
          overview: { id: "overview", bounds: world.bounds, bitmap: overview },
          diagnostics: { missingFragments: 0, missingUuids: [] }
        })
      },
      createWorker
    });

    const frame = await client.prepare(world);
    expect(createWorker).not.toHaveBeenCalled();
    expect(loadVendor).not.toHaveBeenCalled();

    const ready = vi.fn();
    await frame.ensureChunks({ minX: 0, minY: 0, maxX: 0, maxY: 0 }, ready);
    expect(createWorker).toHaveBeenCalledOnce();
    expect(ready).toHaveBeenCalled();
    expect(ready.mock.calls[0][0].id).toBe("0:0");
    client.dispose();
  });

  it("closes a completed bitmap when an in-flight detail queue is cancelled", async () => {
    let resolveRender!: (value: Awaited<ReturnType<SurfaceWorkerAdapter["render"]>>) => void;
    const pending = new Promise<Awaited<ReturnType<SurfaceWorkerAdapter["render"]>>>(
      (resolve) => { resolveRender = resolve; }
    );
    const worker: SurfaceWorkerAdapter = { render: vi.fn(() => pending), terminate: vi.fn() };
    const client = new SurfaceRenderClient({
      repository: { load: vi.fn().mockResolvedValue(bundle) },
      overviewRepository: {
        load: vi.fn().mockResolvedValue({
          overview: { id: "overview", bounds: world.bounds, bitmap: bitmap(512, 384) },
          diagnostics: { missingFragments: 0, missingUuids: [] }
        })
      },
      createWorker: () => worker
    });
    const frame = await client.prepare(world);
    const onReady = vi.fn();
    const task = frame.ensureChunks({ minX: 0, minY: 0, maxX: 0, maxY: 0 }, onReady);
    await vi.waitFor(() => expect(worker.render).toHaveBeenCalledOnce());
    frame.cancelChunks();
    const rendered = bitmap();
    resolveRender({
      id: "0:0",
      bounds: { minX: 0, minY: 0, maxX: 7, maxY: 7 },
      bitmap: rendered,
      diagnostics: { missingFragments: 0, missingUuids: [] }
    });
    await task;

    expect(onReady).not.toHaveBeenCalled();
    expect(rendered.close).toHaveBeenCalledOnce();
    client.dispose();
  });
});
