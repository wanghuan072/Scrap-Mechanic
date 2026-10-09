import {
  MAX_MAP_ZOOM,
  MIN_MAP_ZOOM,
  type MapUiState
} from "./map-model";
import { normalizeMapLayerIds } from "./map-layers";
import {
  PLAYER_MARKER_TYPES,
  type PlayerMarkerType
} from "../player-markers/player-marker";

const DEFAULT_PLAYER_MARKER_TYPE_IDS = [...PLAYER_MARKER_TYPES].sort();
const LOCATION_TYPE_ID_PATTERN = /^(fixed|generated):[a-z0-9]+(?:-[a-z0-9]+)*$/;

const DEFAULT_UI_STATE: MapUiState = {
  zoom: 0,
  center: { x: 0, y: 0 },
  query: "",
  categoryIds: [],
  locationTypeIds: [],
  playerMarkerTypeIds: DEFAULT_PLAYER_MARKER_TYPE_IDS,
  layerIds: [],
};

const MAX_STRING_LENGTH = 100;
const MAX_LOCATION_ID_LENGTH = 256;

function locationIdLimit(value: string | null | undefined): number {
  return /^(resource|facility):[a-z0-9-]+:/.test(value ?? "")
    ? MAX_LOCATION_ID_LENGTH : MAX_STRING_LENGTH;
}

function readString(value: string | null, maximumLength = MAX_STRING_LENGTH): string | undefined {
  if (value === null || value.length > maximumLength) {
    return undefined;
  }

  return value;
}

function readIdList(value: string | null): string[] {
  if (value === null || value.length === 0) {
    return [];
  }

  return value.split(",").filter((id) => id.length > 0 && id.length <= MAX_STRING_LENGTH);
}

function normalizePlayerMarkerTypeIds(values: readonly string[]): PlayerMarkerType[] {
  const allowed = new Set<string>(PLAYER_MARKER_TYPES);
  return [...new Set(values.filter((value) => allowed.has(value)))]
    .sort() as PlayerMarkerType[];
}

function normalizeLocationTypeIds(values: readonly string[]): string[] {
  return [...new Set(values.filter((value) => LOCATION_TYPE_ID_PATTERN.test(value)))]
    .sort();
}

function readFiniteNumber(value: string | null): number | undefined {
  if (value === null || value.trim().length === 0) {
    return undefined;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function readZoom(value: string | null): number | undefined {
  const zoom = readFiniteNumber(value);
  if (zoom === undefined || !Number.isInteger(zoom)) return undefined;
  return Math.min(MAX_MAP_ZOOM, Math.max(MIN_MAP_ZOOM, zoom));
}

function setString(params: URLSearchParams, key: string, value: string | undefined, maximumLength = MAX_STRING_LENGTH): void {
  if (value !== undefined && value.length <= maximumLength) {
    params.set(key, value);
  }
}

function setIdList(params: URLSearchParams, key: string, values: string[]): void {
  const validValues = values.filter((value) => value.length > 0 && value.length <= MAX_STRING_LENGTH);
  if (validValues.length > 0) {
    params.set(key, validValues.join(","));
  }
}

export function parseUiState(search: string): MapUiState {
  const params = new URLSearchParams(search);
  const query = readString(params.get("q"));
  const selected = params.get("selected");
  const selectedLocationId = readString(selected, locationIdLimit(selected));

  return {
    zoom: readZoom(params.get("z")) ?? DEFAULT_UI_STATE.zoom,
    center: {
      x: readFiniteNumber(params.get("x")) ?? DEFAULT_UI_STATE.center.x,
      y: readFiniteNumber(params.get("y")) ?? DEFAULT_UI_STATE.center.y,
    },
    query: query ?? DEFAULT_UI_STATE.query,
    categoryIds: readIdList(params.get("cat")),
    locationTypeIds: normalizeLocationTypeIds(readIdList(params.get("locationTypes"))),
    playerMarkerTypeIds: params.has("markers")
      ? normalizePlayerMarkerTypeIds(readIdList(params.get("markers")))
      : [...DEFAULT_UI_STATE.playerMarkerTypeIds],
    layerIds: normalizeMapLayerIds(readIdList(params.get("layers"))),
    ...(selectedLocationId && selectedLocationId.length > 0 ? { selectedLocationId } : {}),
  };
}

export function serializeUiState(state: MapUiState, currentSearch = ""): string {
  const params = new URLSearchParams(currentSearch);
  for (const key of [
    "z", "x", "y", "q", "cat", "locationTypes", "markers", "layers", "selected",
    // 旧地图参数和任何可能暴露本地存档信息的参数都不得继续写回地址栏。
    "region", "save", "file", "filename", "path", "seed"
  ]) {
    params.delete(key);
  }

  if (
    Number.isInteger(state.zoom)
    && state.zoom >= MIN_MAP_ZOOM
    && state.zoom <= MAX_MAP_ZOOM
  ) {
    params.set("z", String(state.zoom));
  }
  if (Number.isFinite(state.center.x)) {
    params.set("x", String(state.center.x));
  }
  if (Number.isFinite(state.center.y)) {
    params.set("y", String(state.center.y));
  }

  if (state.query.length > 0) {
    setString(params, "q", state.query);
  }
  setIdList(params, "cat", state.categoryIds);
  setIdList(
    params,
    "locationTypes",
    normalizeLocationTypeIds(state.locationTypeIds),
  );
  // 明确保留“全部关闭”，避免刷新后重新启用默认地点。
  if (state.locationTypeIds.length === 0) params.set("locationTypes", "");
  const playerMarkerTypeIds = normalizePlayerMarkerTypeIds(
    state.playerMarkerTypeIds
  );
  if (
    playerMarkerTypeIds.length !== DEFAULT_PLAYER_MARKER_TYPE_IDS.length
    || playerMarkerTypeIds.some(
      (typeId, index) => typeId !== DEFAULT_PLAYER_MARKER_TYPE_IDS[index]
    )
  ) {
    params.set("markers", playerMarkerTypeIds.join(","));
  }
  setIdList(params, "layers", normalizeMapLayerIds(state.layerIds));
  setString(params, "selected", state.selectedLocationId, locationIdLimit(state.selectedLocationId));

  const encoded = params.toString();
  return encoded.length > 0 ? `?${encoded}` : "";
}
