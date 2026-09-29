import type { CellBounds, TerrainCell, WorldMap } from "../domain/map-model";
import type { VendorSurfaceBundle, VendorSurfaceImage } from "./vendor-surface-types";

const SURFACE_BOUNDS: CellBounds = Object.freeze({
  minX: -64,
  minY: -48,
  maxX: 63,
  maxY: 47
});

const EXCAVATION_SOURCE_UUIDS = new Set([
  "ba31a522-7659-4ec5-b933-8b83960c57f2",
  "bf0ba240-416f-4f32-b87d-3a445919e72a"
]);

const EXCAVATION_BOUNDS: CellBounds = Object.freeze({
  minX: 32,
  minY: 16,
  maxX: 63,
  maxY: 47
});

export interface VendorPlacement {
  readonly id: string;
  readonly image: VendorSurfaceImage;
  readonly cellBounds: CellBounds;
  readonly clockwiseTurns: 0 | 1 | 2 | 3;
  readonly destination: Readonly<{ x: number; y: number; width: number; height: number }>;
}

export interface MissingVendorCell {
  readonly x: number;
  readonly y: number;
  readonly uuid: string;
}

export interface VendorSurfacePlan {
  readonly worldBounds: CellBounds;
  readonly oceanImage: VendorSurfaceImage;
  readonly placements: readonly VendorPlacement[];
  readonly missingUuids: readonly string[];
  readonly missingCells: readonly MissingVendorCell[];
  readonly excavationReplacedCellCount: number;
}

interface PlacementGroup {
  readonly id: string;
  readonly image: VendorSurfaceImage;
  readonly originX: number;
  readonly originY: number;
  readonly rotation: 0 | 1 | 2 | 3;
  readonly cellsByOffset: Map<string, TerrainCell>;
}

function assertSurfaceBounds(bounds: CellBounds): void {
  if (
    bounds.minX !== SURFACE_BOUNDS.minX ||
    bounds.minY !== SURFACE_BOUNDS.minY ||
    bounds.maxX !== SURFACE_BOUNDS.maxX ||
    bounds.maxY !== SURFACE_BOUNDS.maxY
  ) {
    throw new Error("Vendor surface planning requires canonical surface bounds x=-64..63/y=-48..47");
  }
}

function isInside(bounds: CellBounds, x: number, y: number): boolean {
  return x >= bounds.minX && x <= bounds.maxX && y >= bounds.minY && y <= bounds.maxY;
}

function placementOrigin(
  cell: TerrainCell,
  image: VendorSurfaceImage
): Readonly<{ x: number; y: number }> {
  const { x, y, xOffset, yOffset, rotation } = cell;
  if (rotation === 0) return { x: x - xOffset, y: y - yOffset };
  if (rotation === 1) return { x: x - (image.cellsHigh - 1 - yOffset), y: y - xOffset };
  if (rotation === 2) {
    return {
      x: x - (image.cellsWide - 1 - xOffset),
      y: y - (image.cellsHigh - 1 - yOffset)
    };
  }
  return { x: x - yOffset, y: y - (image.cellsWide - 1 - xOffset) };
}

function rotatedDimensions(
  image: VendorSurfaceImage,
  rotation: 0 | 1 | 2 | 3
): Readonly<{ width: number; height: number }> {
  return rotation % 2 === 0
    ? { width: image.cellsWide, height: image.cellsHigh }
    : { width: image.cellsHigh, height: image.cellsWide };
}

function toPlacement(group: PlacementGroup, worldBounds: CellBounds): VendorPlacement {
  const { width, height } = rotatedDimensions(group.image, group.rotation);
  const cellBounds = Object.freeze({
    minX: group.originX,
    minY: group.originY,
    maxX: group.originX + width - 1,
    maxY: group.originY + height - 1
  });
  const destination = Object.freeze({
    x: group.originX - worldBounds.minX,
    y: worldBounds.maxY - cellBounds.maxY,
    width,
    height
  });
  return Object.freeze({
    id: group.id,
    image: group.image,
    cellBounds,
    clockwiseTurns: group.rotation,
    destination
  });
}

function chooseOceanImage(
  cells: readonly TerrainCell[],
  bundle: VendorSurfaceBundle
): VendorSurfaceImage {
  const counts = new Map<string, number>();
  for (const cell of cells) {
    if (cell.terrainType !== "8") continue;
    const normalizedUuid = cell.uuid.toLowerCase();
    const candidate = bundle.imagesByUuid.get(normalizedUuid);
    if (!candidate || candidate.role !== "single-cell") continue;
    counts.set(normalizedUuid, (counts.get(normalizedUuid) ?? 0) + 1);
  }
  const selectedUuid = [...counts].sort(
    ([leftUuid, leftCount], [rightUuid, rightCount]) =>
      rightCount - leftCount || leftUuid.localeCompare(rightUuid)
  )[0]?.[0];
  if (!selectedUuid) {
    throw new Error("Vendor surface plan has no known single-cell terrainType 8 image for the ocean");
  }
  return bundle.imagesByUuid.get(selectedUuid)!;
}

function excavationPlacement(
  image: VendorSurfaceImage,
  worldBounds: CellBounds
): VendorPlacement {
  return Object.freeze({
    id: "excavation:32:16",
    image,
    cellBounds: EXCAVATION_BOUNDS,
    clockwiseTurns: 0,
    destination: Object.freeze({
      x: EXCAVATION_BOUNDS.minX - worldBounds.minX,
      y: worldBounds.maxY - EXCAVATION_BOUNDS.maxY,
      width: 32,
      height: 32
    })
  });
}

export function planVendorSurface(
  world: WorldMap,
  bundle: VendorSurfaceBundle
): VendorSurfacePlan {
  assertSurfaceBounds(world.bounds);

  const coordinateOwners = new Set<string>();
  for (const cell of world.cells) {
    if (!Number.isInteger(cell.x) || !Number.isInteger(cell.y) || !isInside(world.bounds, cell.x, cell.y)) {
      throw new Error(`Terrain cell (${cell.x}, ${cell.y}) is outside canonical surface bounds`);
    }
    const coordinate = `${cell.x}:${cell.y}`;
    if (coordinateOwners.has(coordinate)) {
      throw new Error(`Contradictory terrain cells occupy (${cell.x}, ${cell.y})`);
    }
    coordinateOwners.add(coordinate);
  }

  const oceanImage = chooseOceanImage(world.cells, bundle);
  const missingUuids = new Set<string>();
  const missingCells: MissingVendorCell[] = [];
  const groups = new Map<string, PlacementGroup>();
  let excavationReplacedCellCount = 0;

  for (const cell of world.cells) {
    const uuid = cell.uuid.toLowerCase();
    if (EXCAVATION_SOURCE_UUIDS.has(uuid) && isInside(EXCAVATION_BOUNDS, cell.x, cell.y)) {
      excavationReplacedCellCount += 1;
      continue;
    }
    if (uuid === oceanImage.uuid) continue;

    const image = bundle.imagesByUuid.get(uuid);
    if (!image) {
      missingUuids.add(uuid);
      missingCells.push(Object.freeze({ x: cell.x, y: cell.y, uuid }));
      continue;
    }
    if (
      !Number.isInteger(cell.xOffset) || !Number.isInteger(cell.yOffset) ||
      cell.xOffset < 0 || cell.xOffset >= image.cellsWide ||
      cell.yOffset < 0 || cell.yOffset >= image.cellsHigh
    ) {
      throw new Error(`Terrain offset for ${uuid} is outside the vendor image footprint`);
    }

    const origin = placementOrigin(cell, image);
    const id = `${uuid}:${origin.x}:${origin.y}:${cell.rotation}`;
    let group = groups.get(id);
    if (!group) {
      group = {
        id,
        image,
        originX: origin.x,
        originY: origin.y,
        rotation: cell.rotation,
        cellsByOffset: new Map()
      };
      groups.set(id, group);
    }
    const offsetKey = `${cell.xOffset}:${cell.yOffset}`;
    if (group.cellsByOffset.has(offsetKey)) {
      throw new Error(`Contradictory cells for vendor placement ${id} at source offset ${offsetKey}`);
    }
    group.cellsByOffset.set(offsetKey, cell);
  }

  const placements = [...groups.values()].map((group) => toPlacement(group, world.bounds));
  if (excavationReplacedCellCount > 0) {
    placements.push(excavationPlacement(bundle.excavationComposite, world.bounds));
  }
  placements.sort((left, right) => left.id.localeCompare(right.id));
  missingCells.sort((left, right) =>
    left.uuid.localeCompare(right.uuid) || left.x - right.x || left.y - right.y
  );

  return Object.freeze({
    worldBounds: Object.freeze({ ...world.bounds }),
    oceanImage,
    placements: Object.freeze(placements),
    missingUuids: Object.freeze([...missingUuids].sort()),
    missingCells: Object.freeze(missingCells),
    excavationReplacedCellCount
  });
}
