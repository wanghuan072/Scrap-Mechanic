import { createHash } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { WorldMap } from "../domain/map-model";
import { BrowserReferenceOverviewRepository } from "./reference-overview-repository";

const bytes = new Uint8Array([1, 2, 3, 4]);
const assetHash = createHash("sha256").update(bytes).digest("hex");

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value as Record<string, unknown>).sort().map(
      (key) => [key, canonicalize((value as Record<string, unknown>)[key])]
    ));
  }
  return value;
}

function descriptor(assetContentHash = assetHash) {
  const unsigned = {
    schemaVersion: 1,
    gameVersion: "1.0.1.869",
    worldContentHash: "a".repeat(64),
    asset: {
      path: "reference-overview-test.webp",
      contentHash: assetContentHash,
      bytes: bytes.byteLength,
      width: 512,
      height: 384
    },
    diagnostics: { missingFragments: 0, missingUuids: [] }
  };
  return {
    ...unsigned,
    contentHash: createHash("sha256")
      .update(JSON.stringify(canonicalize(unsigned)))
      .digest("hex")
  };
}

const world: WorldMap = {
  id: "surface",
  source: "reference",
  sourceContentHash: "a".repeat(64),
  gameVersion: "1.0.1.869",
  bounds: { minX: -64, minY: -48, maxX: 63, maxY: 47 },
  cells: [],
  locations: []
};

afterEach(() => vi.unstubAllGlobals());

describe("BrowserReferenceOverviewRepository", () => {
  it("verifies and decodes the overview asset", async () => {
    const fetcher = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify(descriptor())))
      .mockResolvedValueOnce(new Response(bytes, {
        headers: { "content-length": String(bytes.byteLength) }
      }));
    const bitmap = { width: 512, height: 384, close: vi.fn() } as unknown as ImageBitmap;
    vi.stubGlobal("fetch", fetcher);
    vi.stubGlobal("createImageBitmap", vi.fn().mockResolvedValue(bitmap));

    const result = await new BrowserReferenceOverviewRepository().load(world);

    expect(result.overview.bitmap).toBe(bitmap);
    expect(result.overview.bounds).toEqual(world.bounds);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("rejects an asset whose bytes do not match the descriptor", async () => {
    vi.stubGlobal("fetch", vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify(descriptor("0".repeat(64)))))
      .mockResolvedValueOnce(new Response(bytes)));
    vi.stubGlobal("createImageBitmap", vi.fn());

    await expect(new BrowserReferenceOverviewRepository().load(world))
      .rejects.toThrow("integrity check");
  });
});
