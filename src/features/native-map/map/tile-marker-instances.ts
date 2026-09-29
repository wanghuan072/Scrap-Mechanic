import type { VendorMarkerDefinition } from "../data/vendor-marker-catalog";
import type { MapLocation, TerrainCell, WorldMap } from "../domain/map-model";
import { TERRAIN_CELL_SIZE } from "./coordinate-system";

const MAX_LOGICAL_SIZE_CELLS = 16;

interface TileDefinitionGroup {
  definitions: VendorMarkerDefinition[];
  logicalSizeCells: number;
}

function nextPowerOfTwo(value: number): number {
  let result = 1;
  while (result < value && result < MAX_LOGICAL_SIZE_CELLS) result *= 2;
  return result;
}

function logicalSizeFor(
  definitions: readonly VendorMarkerDefinition[],
  cells: readonly TerrainCell[]
): number {
  const requiredByCoordinates = Math.max(
    1,
    ...definitions.map((definition) =>
      Math.ceil(
        Math.max(definition.localX, definition.localY) / TERRAIN_CELL_SIZE
      )
    )
  );
  const requiredByOffsets = Math.max(
    1,
    ...cells.map((cell) => Math.max(cell.xOffset, cell.yOffset) + 1)
  );
  return nextPowerOfTwo(
    Math.min(
      MAX_LOGICAL_SIZE_CELLS,
      Math.max(requiredByCoordinates, requiredByOffsets)
    )
  );
}

function instanceOrigin(
  cell: TerrainCell,
  size: number
): { x: number; y: number } {
  switch (cell.rotation) {
    case 1:
      return {
        x: cell.x - (size - 1 - cell.yOffset),
        y: cell.y - cell.xOffset
      };
    case 2:
      return {
        x: cell.x - (size - 1 - cell.xOffset),
        y: cell.y - (size - 1 - cell.yOffset)
      };
    case 3:
      return {
        x: cell.x - cell.yOffset,
        y: cell.y - (size - 1 - cell.xOffset)
      };
    default:
      return {
        x: cell.x - cell.xOffset,
        y: cell.y - cell.yOffset
      };
  }
}

function rotateLocal(
  rotation: TerrainCell["rotation"],
  localX: number,
  localY: number,
  size: number
): { x: number; y: number } {
  const extent = size * TERRAIN_CELL_SIZE;
  switch (rotation) {
    case 1:
      return { x: extent - localY, y: localX };
    case 2:
      return { x: extent - localX, y: extent - localY };
    case 3:
      return { x: localY, y: extent - localX };
    default:
      return { x: localX, y: localY };
  }
}

export function instantiateTileMarkers(
  world: WorldMap,
  definitions: readonly VendorMarkerDefinition[]
): MapLocation[] {
  const cellsByUuid = new Map<string, TerrainCell[]>();
  for (const cell of world.cells) {
    const uuid = cell.uuid.toLowerCase();
    const existing = cellsByUuid.get(uuid);
    if (existing) existing.push(cell);
    else cellsByUuid.set(uuid, [cell]);
  }

  const definitionsByUuid = new Map<string, VendorMarkerDefinition[]>();
  for (const definition of definitions) {
    if (
      !definition.id
      || !Number.isFinite(definition.localX)
      || !Number.isFinite(definition.localY)
      || definition.localX < 0
      || definition.localY < 0
    ) {
      continue;
    }
    const uuid = definition.tileUuid.toLowerCase();
    const existing = definitionsByUuid.get(uuid);
    if (existing) existing.push(definition);
    else definitionsByUuid.set(uuid, [definition]);
  }

  const groupsByUuid = new Map<string, TileDefinitionGroup>();
  for (const [uuid, tileDefinitions] of definitionsByUuid) {
    const matchingCells = cellsByUuid.get(uuid);
    if (!matchingCells) continue;
    groupsByUuid.set(uuid, {
      definitions: tileDefinitions,
      logicalSizeCells: logicalSizeFor(tileDefinitions, matchingCells)
    });
  }

  const seenInstances = new Set<string>();
  const locations = new Map<string, MapLocation>();
  for (const cell of world.cells) {
    const uuid = cell.uuid.toLowerCase();
    const group = groupsByUuid.get(uuid);
    if (!group) continue;
    const size = group.logicalSizeCells;
    if (
      !Number.isSafeInteger(cell.xOffset)
      || !Number.isSafeInteger(cell.yOffset)
      || cell.xOffset < 0
      || cell.yOffset < 0
      || cell.xOffset >= size
      || cell.yOffset >= size
    ) {
      continue;
    }
    const origin = instanceOrigin(cell, size);
    const instanceId = `${uuid}:${origin.x}:${origin.y}:${cell.rotation}`;
    if (seenInstances.has(instanceId)) continue;
    seenInstances.add(instanceId);

    for (const definition of group.definitions) {
      const local = rotateLocal(
        cell.rotation,
        definition.localX,
        definition.localY,
        size
      );
      const id = `resource:${origin.x}:${origin.y}:${cell.rotation}:${definition.id}`;
      if (locations.has(id)) continue;
      locations.set(id, {
        id,
        name: definition.name,
        category: "resource",
        precision: "exact",
        position: {
          x: origin.x + local.x / TERRAIN_CELL_SIZE,
          y: origin.y + local.y / TERRAIN_CELL_SIZE
        },
        questIds: [],
        resourceIds: [definition.category],
        enemyIds: []
      });
    }
  }

  return [...locations.values()].sort((left, right) =>
    left.id < right.id ? -1 : left.id > right.id ? 1 : 0
  );
}
