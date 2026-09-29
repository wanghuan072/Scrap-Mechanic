import { createHash } from "node:crypto";
import { expect, it, vi } from "vitest";
import { loadSmMapGeneratorResourceDocument } from "./sm-map-generator-assets";

const resource = "{\"ok\":true}\n";
const licenseHash = "83da68bc67cf206ab292f2ee6cf9109016c89c53cc9673bb66ece8df7abd6c9a";
const archiveHash = "c3c5a62317e187ca7738dae015ab493ecf093c11bb8f0294bb94dbcfaa8004a89";
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

function images(): Array<Record<string, unknown>> {
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
    schemaVersion: 3,
    gameVersion: "1.0.1.869",
    generator: "tools/vendor/cli.ts",
    sourceRepository: "https://github.com/xKoldx/sm_map_generator",
    upstreamVersion: "1.7.0",
    sourceArchiveHash: archiveHash,
    license: {
      bytes: 1075, contentHash: licenseHash, path: "LICENSE",
      sourcePath: "LICENSE", spdx: "MIT"
    },
    resourceLocations: {
      bytes: new TextEncoder().encode(resource).byteLength,
      contentHash: createHash("sha256").update(resource).digest("hex"),
      path: "resource-locations.json",
      sourcePath: "public/runtime/data/all_resource_locations.json"
    },
    images: images(),
    ...overrides
  };
  return JSON.stringify({
    ...unsigned,
    contentHash: createHash("sha256")
      .update(`${JSON.stringify(canonicalize(unsigned), null, 2)}\n`)
      .digest("hex")
  });
}

it("loads the marker catalog through the shared schema-3 manifest", async () => {
  const fetcher = vi.fn(async (url: string | URL | Request) =>
    new Response(String(url).endsWith("manifest.json") ? manifest() : resource));
  await expect(loadSmMapGeneratorResourceDocument(
    "/vendor/sm-map-generator/manifest.json",
    fetcher as typeof fetch
  )).resolves.toBe(resource);
  expect(fetcher).toHaveBeenCalledTimes(2);
});

it("rejects a manifest with a bad license or canonical content hash", async () => {
  const badLicense = manifest({
    license: {
      bytes: 4, contentHash: "0".repeat(64), path: "LICENSE",
      sourcePath: "LICENSE", spdx: "MIT"
    }
  });
  await expect(loadSmMapGeneratorResourceDocument(
    "/vendor/sm-map-generator/manifest.json",
    vi.fn(async () => new Response(badLicense)) as typeof fetch
  )).rejects.toThrow(/malformed|license/i);

  const parsed = JSON.parse(manifest()) as Record<string, unknown>;
  parsed.contentHash = "0".repeat(64);
  await expect(loadSmMapGeneratorResourceDocument(
    "/vendor/sm-map-generator/manifest.json",
    vi.fn(async () => new Response(JSON.stringify(parsed))) as typeof fetch
  )).rejects.toThrow(/integrity/i);
});

it("rejects a manifest response above the bounded runtime size", async () => {
  const fetcher = vi.fn(async () => new Response(manifest(), {
    headers: { "content-length": String(2 * 1024 * 1024 + 1) }
  }));
  await expect(loadSmMapGeneratorResourceDocument(
    "/vendor/sm-map-generator/manifest.json",
    fetcher as typeof fetch
  )).rejects.toThrow(/size limit/i);
});

it("rejects marker content that fails its hash", async () => {
  const fetcher = vi.fn()
    .mockResolvedValueOnce(new Response(manifest()))
    .mockResolvedValueOnce(new Response("different"));
  await expect(loadSmMapGeneratorResourceDocument(
    "/vendor/sm-map-generator/manifest.json",
    fetcher as typeof fetch
  )).rejects.toThrow(/integrity/i);
});
