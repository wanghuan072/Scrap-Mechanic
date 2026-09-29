import { createHash } from "node:crypto";
import { expect, it, vi } from "vitest";
import { createVendorSurfaceRepository } from "./vendor-surface-repository";

const licenseHash = "83da68bc67cf206ab292f2ee6cf9109016c89c53cc9673bb66ece8df7abd6c9a";
const archiveHash = "c3c5a62317e187ca7738dae015ab493ecf093c11bb8f0294bb94dbcfaa8004a89";
const dataHash = createHash("sha256").update("{}\n").digest("hex");
const imageHash = createHash("sha256").update("image").digest("hex");

function uuid(index: number): string {
  return `00000000-0000-4000-8000-${index.toString(16).padStart(12, "0")}`;
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entry]) => [key, canonicalize(entry)]));
  }
  return value;
}

function validImages(): Array<Record<string, unknown>> {
  return [
    ...Array.from({ length: 421 }, (_, index) => {
      const id = uuid(index + 1);
      return {
        bytes: 5, contentHash: imageHash, path: `assets/tiles/${id}.webp`,
        sourcePath: `public/assets/tiles/${id}.webp`, uuid: id,
        role: "single-cell", width: 100, height: 100, cellsWide: 1, cellsHigh: 1
      };
    }),
    ...Array.from({ length: 63 }, (_, index) => {
      const id = uuid(index + 10_000);
      return {
        bytes: 5, contentHash: imageHash, path: `assets/${id}.webp`,
        sourcePath: `public/assets/${id}.webp`, uuid: id,
        role: "multi-cell", width: 200, height: 200, cellsWide: 2, cellsHigh: 2
      };
    }),
    {
      bytes: 5, contentHash: imageHash, path: "assets/excavation_island_special.webp",
      sourcePath: "public/assets/excavation_island_special.webp",
      role: "excavation-composite", width: 3200, height: 3200,
      cellsWide: 32, cellsHigh: 32
    }
  ];
}

function manifest(overrides: Record<string, unknown> = {}): string {
  const unsigned = {
    schemaVersion: 3, gameVersion: "1.0.1.869", generator: "tools/vendor/cli.ts",
    sourceRepository: "https://github.com/xKoldx/sm_map_generator",
    upstreamVersion: "1.7.0", sourceArchiveHash: archiveHash,
    license: { bytes: 1075, contentHash: licenseHash, path: "LICENSE", sourcePath: "LICENSE", spdx: "MIT" },
    resourceLocations: {
      bytes: 3, contentHash: dataHash, path: "resource-locations.json",
      sourcePath: "public/runtime/data/all_resource_locations.json"
    },
    images: validImages(),
    ...overrides
  };
  return JSON.stringify({
    ...unsigned,
    contentHash: createHash("sha256")
      .update(`${JSON.stringify(canonicalize(unsigned), null, 2)}\n`).digest("hex")
  });
}

function fetchManifest(body: string): typeof fetch {
  return vi.fn(async () => new Response(body)) as typeof fetch;
}

it("loads immutable lowercase UUID lookup and the excavation composite", async () => {
  const repository = createVendorSurfaceRepository({
    manifestUrl: "/vendor/sm-map-generator/manifest.json",
    fetcher: fetchManifest(manifest())
  });
  const bundle = await repository.load();
  expect(bundle.imagesByUuid.size).toBe(484);
  expect(bundle.imagesByUuid.get(uuid(1).toUpperCase())).toMatchObject({
    role: "single-cell",
    url: "/vendor/sm-map-generator/assets/tiles/00000000-0000-4000-8000-000000000001.webp"
  });
  expect(bundle.excavationComposite).toMatchObject({
    role: "excavation-composite",
    cellsWide: 32,
    cellsHigh: 32
  });
  expect((bundle.imagesByUuid as unknown as { set?: unknown }).set).toBeUndefined();
  expect(Object.isFrozen(bundle.excavationComposite)).toBe(true);
});

it.each([
  ["wrong schema", { schemaVersion: 2 }, /malformed|schema/i],
  ["unknown role", { images: validImages().map((image, index) => index === 0 ? { ...image, role: "other" } : image) }, /malformed|role/i],
  ["unsafe path", { images: validImages().map((image, index) => index === 0 ? { ...image, path: "../escape.webp" } : image) }, /malformed|path/i],
  ["non webp", { images: validImages().map((image, index) => index === 0 ? { ...image, path: "assets/tiles/a.png" } : image) }, /malformed|webp|path/i],
  ["bad dimensions", { images: validImages().map((image, index) => index === 0 ? { ...image, width: 101 } : image) }, /malformed|dimension/i],
  ["duplicate uuid", { images: validImages().map((image, index, all) => index === 1 ? { ...all[0]! } : image) }, /duplicate/i],
  ["missing composite", { images: validImages().slice(0, -1) }, /composite|485|malformed/i]
])("rejects %s", async (_name, overrides, expected) => {
  const repository = createVendorSurfaceRepository({
    manifestUrl: "/vendor/sm-map-generator/manifest.json",
    fetcher: fetchManifest(manifest(overrides))
  });
  await expect(repository.load()).rejects.toThrow(expected);
});

it("shares an in-flight load, caches success, and retries after failure", async () => {
  let resolveFirst!: (response: Response) => void;
  const first = new Promise<Response>((resolve) => { resolveFirst = resolve; });
  const fetcher = vi.fn()
    .mockImplementationOnce(() => first)
    .mockResolvedValueOnce(new Response("broken"))
    .mockResolvedValue(new Response(manifest()));
  const repository = createVendorSurfaceRepository({
    manifestUrl: "/vendor/sm-map-generator/manifest.json",
    fetcher: fetcher as typeof fetch
  });
  const left = repository.load();
  const right = repository.load();
  resolveFirst(new Response(manifest()));
  expect(await left).toBe(await right);
  expect(fetcher).toHaveBeenCalledTimes(1);
  expect(await repository.load()).toBe(await left);
  expect(fetcher).toHaveBeenCalledTimes(1);

  const retrying = createVendorSurfaceRepository({
    manifestUrl: "/vendor/sm-map-generator/manifest.json",
    fetcher: fetcher as typeof fetch
  });
  await expect(retrying.load()).rejects.toThrow(/malformed/i);
  await expect(retrying.load()).resolves.toMatchObject({ manifestHash: expect.any(String) });
  expect(fetcher).toHaveBeenCalledTimes(3);
});
