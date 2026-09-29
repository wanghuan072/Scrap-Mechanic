import { describe, expect, it } from "vitest";
import type { CellBounds, TerrainCell, WorldMap } from "../domain/map-model";
import { planVendorSurface } from "./vendor-placement-planner";
import type { VendorSurfaceBundle, VendorSurfaceImage } from "./vendor-surface-types";

const WORLD_BOUNDS = { minX: -64, minY: -48, maxX: 63, maxY: 47 } as const;
const LAKE_A = "00000000-0000-4000-8000-000000000008";
const LAKE_B = "00000000-0000-4000-8000-000000000009";
const LAND = "00000000-0000-4000-8000-000000000010";
const MULTI = "00000000-0000-4000-8000-000000000011";
const UNKNOWN_A = "00000000-0000-4000-8000-000000000012";
const UNKNOWN_B = "00000000-0000-4000-8000-000000000013";
const EXCAVATION_A = "ba31a522-7659-4ec5-b933-8b83960c57f2";
const EXCAVATION_B = "bf0ba240-416f-4f32-b87d-3a445919e72a";

function image(uuid: string | undefined, cellsWide = 1, cellsHigh = 1): VendorSurfaceImage {
  return Object.freeze({
    uuid,
    role: uuid ? (cellsWide === 1 && cellsHigh === 1 ? "single-cell" : "multi-cell") : "excavation-composite",
    url: uuid ? `/vendor/${uuid}.webp` : "/vendor/excavation.webp",
    contentHash: "a".repeat(64),
    bytes: 100,
    width: cellsWide * 100,
    height: cellsHigh * 100,
    cellsWide,
    cellsHigh
  });
}

function cell(overrides: Partial<TerrainCell> = {}): TerrainCell {
  return {
    x: -64,
    y: -48,
    uuid: LAKE_A,
    rotation: 0,
    xOffset: 0,
    yOffset: 0,
    flags: 0,
    terrainType: "8",
    ...overrides
  };
}

function world(cells: TerrainCell[], bounds: CellBounds = WORLD_BOUNDS): WorldMap {
  return {
    id: "surface",
    source: "save",
    gameVersion: "1.0.1.869",
    bounds,
    cells,
    locations: []
  };
}

function bundle(entries: VendorSurfaceImage[] = []): VendorSurfaceBundle {
  return {
    imagesByUuid: new Map([
      [LAKE_A, image(LAKE_A)],
      [LAKE_B, image(LAKE_B)],
      [LAND, image(LAND)],
      ...entries.filter((entry): entry is VendorSurfaceImage & { uuid: string } => Boolean(entry.uuid))
        .map((entry) => [entry.uuid, entry] as const)
    ]),
    excavationComposite: image(undefined, 32, 32),
    manifestHash: "b".repeat(64)
  };
}

function placedCells(
  uuid: string,
  cellsWide: number,
  cellsHigh: number,
  rotation: 0 | 1 | 2 | 3,
  originX: number,
  originY: number
): TerrainCell[] {
  const cells: TerrainCell[] = [];
  for (let xOffset = 0; xOffset < cellsWide; xOffset += 1) {
    for (let yOffset = 0; yOffset < cellsHigh; yOffset += 1) {
      let x: number;
      let y: number;
      if (rotation === 0) [x, y] = [originX + xOffset, originY + yOffset];
      else if (rotation === 1) [x, y] = [originX + cellsHigh - 1 - yOffset, originY + xOffset];
      else if (rotation === 2) [x, y] = [originX + cellsWide - 1 - xOffset, originY + cellsHigh - 1 - yOffset];
      else [x, y] = [originX + yOffset, originY + cellsWide - 1 - xOffset];
      cells.push(cell({ x, y, uuid, rotation, xOffset, yOffset, terrainType: "2" }));
    }
  }
  return cells;
}

describe("planVendorSurface", () => {
  it("maps increasing X rightward and world Y to inverted canvas Y", () => {
    const plan = planVendorSurface(world([
      cell(),
      cell({ x: -63, y: -47, uuid: LAND, terrainType: "2" })
    ]), bundle());

    expect(plan.placements).toHaveLength(1);
    expect(plan.placements[0]).toMatchObject({
      cellBounds: { minX: -63, minY: -47, maxX: -63, maxY: -47 },
      destination: { x: 1, y: 94, width: 1, height: 1 }
    });
  });

  it.each([
    { rotation: 0 as const, width: 2, height: 3, y: 45 },
    { rotation: 1 as const, width: 3, height: 2, y: 46 },
    { rotation: 2 as const, width: 2, height: 3, y: 45 },
    { rotation: 3 as const, width: 3, height: 2, y: 46 }
  ])("derives the origin and rotated size for clockwise turn $rotation", ({ rotation, width, height, y }) => {
    const multiImage = image(MULTI, 2, 3);
    const plan = planVendorSurface(world([
      cell(),
      ...placedCells(MULTI, 2, 3, rotation, 0, 0).reverse()
    ]), bundle([multiImage]));

    expect(plan.placements).toHaveLength(1);
    expect(plan.placements[0]).toMatchObject({
      id: `${MULTI}:0:0:${rotation}`,
      clockwiseTurns: rotation,
      cellBounds: { minX: 0, minY: 0, maxX: width - 1, maxY: height - 1 },
      destination: { x: 64, y, width, height }
    });
  });

  it.each([
    { cellsWide: 3, cellsHigh: 2, rotation: 0 as const, width: 3, height: 2 },
    { cellsWide: 3, cellsHigh: 2, rotation: 1 as const, width: 2, height: 3 },
    { cellsWide: 4, cellsHigh: 3, rotation: 2 as const, width: 4, height: 3 },
    { cellsWide: 4, cellsHigh: 3, rotation: 3 as const, width: 3, height: 4 }
  ])("supports odd/even source dimensions at rotation $rotation", ({ cellsWide, cellsHigh, rotation, width, height }) => {
    const multiImage = image(MULTI, cellsWide, cellsHigh);
    const plan = planVendorSurface(world([
      cell(),
      ...placedCells(MULTI, cellsWide, cellsHigh, rotation, -10, -10)
    ]), bundle([multiImage]));

    expect(plan.placements[0]?.destination).toMatchObject({ width, height });
    expect(plan.placements[0]?.cellBounds).toEqual({
      minX: -10,
      minY: -10,
      maxX: -10 + width - 1,
      maxY: -10 + height - 1
    });
  });

  it("deduplicates multi-cell art and keeps IDs stable across input order", () => {
    const multiImage = image(MULTI, 2, 2);
    const cells = [cell(), ...placedCells(MULTI, 2, 2, 3, 5, -2), cell({ x: 20, y: 20, uuid: LAND, terrainType: "2" })];
    const forward = planVendorSurface(world(cells), bundle([multiImage]));
    const reverse = planVendorSurface(world([...cells].reverse()), bundle([multiImage]));

    expect(forward.placements).toHaveLength(2);
    expect(forward.placements.map(({ id }) => id)).toEqual(reverse.placements.map(({ id }) => id));
    expect(forward.placements.filter(({ image: entry }) => entry.uuid === MULTI)).toHaveLength(1);
  });

  it("uses the most frequent known lake UUID for ocean with lexical tie-breaking", () => {
    const plan = planVendorSurface(world([
      cell({ x: -64 }),
      cell({ x: -63, uuid: LAKE_B }),
      cell({ x: -62, uuid: LAKE_B }),
      cell({ x: -61, uuid: LAKE_A })
    ]), bundle());
    expect(plan.oceanImage.uuid).toBe(LAKE_A);
  });

  it("replaces reviewed excavation sources with one calibrated composite", () => {
    const plan = planVendorSurface(world([
      cell(),
      cell({ x: 32, y: 16, uuid: EXCAVATION_A, terrainType: "2" }),
      cell({ x: 47, y: 31, uuid: EXCAVATION_B, terrainType: "2" })
    ]), bundle());

    expect(plan.excavationReplacedCellCount).toBe(2);
    expect(plan.placements).toHaveLength(1);
    expect(plan.placements[0]).toMatchObject({
      id: "excavation:32:16",
      image: { role: "excavation-composite" },
      cellBounds: { minX: 32, minY: 16, maxX: 63, maxY: 47 },
      destination: { x: 96, y: 0, width: 32, height: 32 }
    });
  });

  it("returns one sorted missing diagnostic plus its affected cells per UUID", () => {
    const plan = planVendorSurface(world([
      cell(),
      cell({ x: 1, y: 2, uuid: UNKNOWN_B, terrainType: "2" }),
      cell({ x: 3, y: 4, uuid: UNKNOWN_A, terrainType: "2" }),
      cell({ x: 5, y: 6, uuid: UNKNOWN_B, terrainType: "2" })
    ]), bundle());

    expect(plan.missingUuids).toEqual([UNKNOWN_A, UNKNOWN_B]);
    expect(plan.missingCells).toEqual([
      { x: 3, y: 4, uuid: UNKNOWN_A },
      { x: 1, y: 2, uuid: UNKNOWN_B },
      { x: 5, y: 6, uuid: UNKNOWN_B }
    ]);
  });

  it("rejects non-canonical world bounds", () => {
    expect(() => planVendorSurface(world([cell()], { ...WORLD_BOUNDS, maxX: 64 }), bundle()))
      .toThrow(/bounds/i);
  });

  it("rejects offsets outside the declared source footprint", () => {
    expect(() => planVendorSurface(world([
      cell(),
      cell({ x: 0, y: 0, uuid: MULTI, xOffset: 2, terrainType: "2" })
    ]), bundle([image(MULTI, 2, 2)]))).toThrow(/offset/i);
  });

  it("rejects contradictory cells at one world coordinate", () => {
    expect(() => planVendorSurface(world([
      cell(),
      cell({ x: 0, y: 0, uuid: LAND, terrainType: "2" }),
      cell({ x: 0, y: 0, uuid: LAKE_B, terrainType: "2" })
    ]), bundle())).toThrow(/contradict/i);
  });

  it("rejects a saved multi-cell footprint that disagrees with manifest dimensions", () => {
    expect(() => planVendorSurface(world([
      cell(),
      ...placedCells(MULTI, 2, 2, 0, 0, 0)
    ]), bundle([image(MULTI, 1, 2)]))).toThrow(/footprint|dimension/i);
  });
});

it("covers every visible UUID in the checked-in reference world", async () => {
  const reference = JSON.parse(await readFile(
    resolve("public/map-assets/generated/reference-world.json"),
    "utf8"
  )) as { gameVersion: string; world: Pick<WorldMap, "bounds" | "cells"> };
  const manifest = JSON.parse(await readFile(
    resolve("public/map-assets/sm-map-generator/manifest.json"),
    "utf8"
  )) as { contentHash: string; images: Array<Omit<VendorSurfaceImage, "url"> & { path: string }> };
  const images = manifest.images.map((entry) => ({
    ...entry,
    url: `/vendor/sm-map-generator/${entry.path}`
  }));
  const excavationComposite = images.find(({ role }) => role === "excavation-composite")!;
  const referenceBundle: VendorSurfaceBundle = {
    imagesByUuid: new Map(images.filter((entry): entry is typeof entry & { uuid: string } => Boolean(entry.uuid))
      .map((entry) => [entry.uuid, entry])),
    excavationComposite,
    manifestHash: manifest.contentHash
  };
  const referenceWorld: WorldMap = {
    id: "surface",
    source: "reference",
    gameVersion: reference.gameVersion,
    bounds: reference.world.bounds,
    cells: reference.world.cells,
    locations: []
  };

  const surfacePlan = planVendorSurface(referenceWorld, referenceBundle);
  expect(surfacePlan.missingUuids).toEqual([]);
  expect(surfacePlan.placements.length).toBeGreaterThan(0);
});
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
