import type { PlayerMarkerType } from "../player-markers/player-marker";

export type Precision = "exact" | "save-exact" | "area-reference" | "unknown";
export type Progress = "locked" | "available" | "visited" | "completed" | "unknown";

export interface LocationProgressEvidence {
  readonly state: "available" | "visited" | "completed" | "unknown";
  readonly source: "quest-manager" | "progression-manager";
  readonly recordId: string;
}

export const MIN_MAP_ZOOM = -5;
export const MAX_MAP_ZOOM = 0;

export interface CellBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface TerrainCell {
  x: number;
  y: number;
  uuid: string;
  rotation: 0 | 1 | 2 | 3;
  xOffset: number;
  yOffset: number;
  flags: number;
  terrainType: string;
  poiType?: string;
}

export interface MapLocation {
  id: string;
  name: string;
  category: string;
  precision: Precision;
  position?: { x: number; y: number; z?: number };
  bounds?: CellBounds;
  questIds: string[];
  resourceIds: string[];
  enemyIds: string[];
  progress?: Progress;
  progressEvidence?: LocationProgressEvidence;
}

export interface WorldMap {
  id: "surface";
  source: "reference" | "save";
  gameVersion: string;
  saveVersion?: number;
  seed?: number;
  bounds: CellBounds;
  cells: TerrainCell[];
  locations: MapLocation[];
}

export interface MapUiState {
  zoom: number;
  center: { x: number; y: number };
  query: string;
  categoryIds: string[];
  locationTypeIds: string[];
  playerMarkerTypeIds: PlayerMarkerType[];
  layerIds: string[];
  selectedLocationId?: string;
}

export interface MapRepository {
  loadLocations(): Promise<MapLocation[]>;
  loadSurface(): Promise<WorldMap>;
}
