import * as L from "leaflet";
import type { TerrainCoverageSummary } from "../components/terrain-coverage";
import { getMapLayerDefinition } from "../domain/map-layers";
import {
  MAX_MAP_ZOOM,
  MIN_MAP_ZOOM,
  type CellBounds,
  type MapLocation,
  type MapUiState,
  type WorldMap
} from "../domain/map-model";
import type { PlayerMarker, PlayerMarkerPosition } from "../player-markers/player-marker";
import type { NormalizedPlayerContentTransfer } from "../save/save-protocol";
import {
  SurfaceRenderClient,
  type SurfacePrepareOptions
} from "../surface/surface-render-client";
import type { PreparedSurfaceFrame } from "../surface/surface-render-protocol";
import {
  cellBoundsToMapPointBounds,
  cellToMapPoint,
  mapPointToCell
} from "./coordinate-system";
import type { LocationNameInventory } from "./location-name-inventory";
import {
  createLocationLayer,
  type LocationSelectionOptions
} from "./location-layer";
import { createPlayerMarkerLayer } from "./player-marker-layer";
import { createPoiLabelLayer } from "./poi-label-layer";
import {
  createPlayerContentLayer,
  type PlayerContentLayer
} from "./player-content-layer";
import { SurfaceChunkLayer } from "./surface-chunk-layer";

export type MapViewport = Pick<MapUiState, "center" | "zoom">;

export interface MapViewCallbacks {
  onViewportChange(viewport: MapViewport): void;
  onLocationSelect(locationId: string): void;
  onPlayerMarkerSelect(markerId: string): void;
  onMarkerPlacement(position: PlayerMarkerPosition): void;
}

export interface PreparedMapWorld {
  readonly world: WorldMap;
  readonly generation: number;
  readonly coverage: TerrainCoverageSummary;
  readonly frame: PreparedSurfaceFrame;
  readonly playerContent?: NormalizedPlayerContentTransfer;
}

export interface MapView {
  setWorld(world: WorldMap, legacyNetworkPolicy?: unknown): void;
  prepareWorld(
    world: WorldMap,
    playerContent?: NormalizedPlayerContentTransfer
  ): Promise<PreparedMapWorld>;
  commitPreparedWorld(prepared: PreparedMapWorld): Promise<void>;
  discardPreparedWorld(prepared?: PreparedMapWorld): void;
  setViewport(viewport: MapViewport): void;
  setLocations(locations: MapLocation[]): void;
  setLocationNames(inventory: LocationNameInventory, selectedTypeIds: readonly string[]): void;
  selectLocation(locationId?: string, options?: LocationSelectionOptions): void;
  setPlayerMarkers(markers: readonly PlayerMarker[]): void;
  selectPlayerMarker(markerId?: string): void;
  setMarkerPlacementMode(enabled: boolean): void;
  setLayerVisibility(layerId: string, visible: boolean): void;
  zoomIn(): void;
  zoomOut(): void;
  resetView(): void;
  getViewport(): MapViewport;
  destroy(): void;
}

export interface MapViewOptions {
  surfaceRenderClient?: Pick<SurfaceRenderClient, "prepare" | "dispose">;
  surfaceChunkLayer?: SurfaceChunkLayer;
  playerContentLayer?: PlayerContentLayer;
}

function visibleCellBounds(map: L.Map): CellBounds {
  const bounds = map.getBounds();
  const first = mapPointToCell({ x: bounds.getWest(), y: bounds.getSouth() });
  const second = mapPointToCell({ x: bounds.getEast(), y: bounds.getNorth() });
  return {
    minX: Math.floor(Math.min(first.x, second.x)),
    minY: Math.floor(Math.min(first.y, second.y)),
    maxX: Math.ceil(Math.max(first.x, second.x)),
    maxY: Math.ceil(Math.max(first.y, second.y))
  };
}

function summarizeCoverage(
  world: WorldMap,
  frame: PreparedSurfaceFrame
): TerrainCoverageSummary {
  const missing = frame.diagnostics.missingFragments;
  return {
    totalCells: world.cells.length,
    vendorImageCells: Math.max(0, world.cells.length - missing),
    missingImageCells: missing,
    distinctMissingUuids: frame.diagnostics.missingUuids.length
  };
}

export function createMapView(
  element: HTMLElement,
  callbacks: MapViewCallbacks,
  options: MapViewOptions = {}
): MapView {
  const map = L.map(element, {
    crs: L.CRS.Simple,
    minZoom: MIN_MAP_ZOOM,
    maxZoom: MAX_MAP_ZOOM,
    zoomControl: false,
    attributionControl: true
  }).setView([0, 0], MIN_MAP_ZOOM);
  const renderClient = options.surfaceRenderClient ?? new SurfaceRenderClient();
  const chunkLayer = options.surfaceChunkLayer ?? new SurfaceChunkLayer(map);
  const locationLayer = createLocationLayer(map, callbacks.onLocationSelect);
  const poiLabelLayer = createPoiLabelLayer(map);
  const playerMarkerLayer = createPlayerMarkerLayer(map, callbacks.onPlayerMarkerSelect);
  const playerContentLayer = options.playerContentLayer ?? createPlayerContentLayer(map);
  const coordinateGrid = element.querySelector<HTMLElement>("[data-coordinate-grid]");
  let names: LocationNameInventory = { groups: [], instances: [] };
  let selectedNameTypes: readonly string[] = [];
  let worldBounds: L.LatLngBoundsExpression | undefined;
  let terrainVisible = true;
  let markerPlacement = false;
  let generation = 0;
  let pending: PreparedMapWorld | undefined;
  let suppressViewport = false;

  const getViewport = (): MapViewport => {
    const center = map.getCenter();
    return {
      center: mapPointToCell({ x: center.lng, y: center.lat }),
      zoom: map.getZoom()
    };
  };
  const notifyViewport = () => {
    if (!suppressViewport) callbacks.onViewportChange(getViewport());
  };
  const applyNames = () => {
    poiLabelLayer.setLocationNames(names.instances, selectedNameTypes);
    poiLabelLayer.setVisible(selectedNameTypes.length > 0);
  };
  const updateVisibleChunks = () => chunkLayer.updateVisible(visibleCellBounds(map));
  const fitWorld = (world: WorldMap) => {
    const bounds = cellBoundsToMapPointBounds(world.bounds);
    worldBounds = [[bounds.min.y, bounds.min.x], [bounds.max.y, bounds.max.x]];
    map.fitBounds(worldBounds, { animate: false });
  };
  const setMarkerPlacementMode = (enabled: boolean) => {
    markerPlacement = enabled;
    element.dataset.markerPlacement = String(enabled);
  };
  const handleClick = (event: L.LeafletMouseEvent) => {
    if (!markerPlacement) return;
    setMarkerPlacementMode(false);
    callbacks.onMarkerPlacement(mapPointToCell({ x: event.latlng.lng, y: event.latlng.lat }));
  };
  const prepareOptions = (): SurfacePrepareOptions => ({
    viewportBounds: visibleCellBounds(map),
    paddingChunks: 1
  });

  map.on("moveend zoomend", notifyViewport);
  map.on("moveend zoomend", updateVisibleChunks);
  map.on("click", handleClick);
  setMarkerPlacementMode(false);

  const view: MapView = {
    setWorld(world) {
      setMarkerPlacementMode(false);
      names = { groups: [], instances: [] };
      selectedNameTypes = [];
      applyNames();
      fitWorld(world);
      void view.prepareWorld(world)
        .then((prepared) => view.commitPreparedWorld(prepared))
        .catch((error) => {
          if (!(error instanceof DOMException && error.name === "AbortError")) {
            element.dispatchEvent(new CustomEvent("surface-error", { detail: String(error) }));
          }
        });
    },
    async prepareWorld(world, playerContent) {
      const nextGeneration = ++generation;
      if (pending) {
        chunkLayer.discard(pending.frame);
        pending = undefined;
      }
      const frame = await renderClient.prepare(world, prepareOptions());
      if (nextGeneration !== generation) {
        frame.dispose();
        throw new DOMException("Prepared map was replaced.", "AbortError");
      }
      const prepared: PreparedMapWorld = {
        world,
        generation: nextGeneration,
        coverage: summarizeCoverage(world, frame),
        frame,
        playerContent
      };
      pending = prepared;
      chunkLayer.stage(frame);
      return prepared;
    },
    async commitPreparedWorld(prepared) {
      if (pending !== prepared || prepared.generation !== generation) {
        throw new DOMException("Prepared map is stale.", "AbortError");
      }
      suppressViewport = true;
      try {
        fitWorld(prepared.world);
        chunkLayer.commit(prepared.frame);
        chunkLayer.setVisible(terrainVisible);
        playerContentLayer.setContent(prepared.playerContent);
        pending = undefined;
        setMarkerPlacementMode(false);
        applyNames();
        updateVisibleChunks();
      } finally {
        suppressViewport = false;
      }
      callbacks.onViewportChange(getViewport());
    },
    discardPreparedWorld(prepared) {
      if (!pending || (prepared && pending !== prepared)) return;
      generation += 1;
      chunkLayer.discard(pending.frame);
      pending = undefined;
    },
    setViewport(viewport) {
      const point = cellToMapPoint(viewport.center);
      map.setView([point.y, point.x], viewport.zoom, { animate: false });
    },
    setLocations(locations) { locationLayer.setLocations(locations); },
    setLocationNames(inventory, selectedTypeIds) {
      names = { groups: [...inventory.groups], instances: [...inventory.instances] };
      selectedNameTypes = [...selectedTypeIds];
      applyNames();
    },
    selectLocation(locationId, selectionOptions) {
      locationLayer.selectLocation(locationId, selectionOptions);
    },
    setPlayerMarkers(markers) { playerMarkerLayer.setMarkers(markers); },
    selectPlayerMarker(markerId) { playerMarkerLayer.selectMarker(markerId); },
    setMarkerPlacementMode,
    setLayerVisibility(layerId, visible) {
      const definition = getMapLayerDefinition(layerId);
      if (!definition?.available) return;
      if (definition.id === "terrain") {
        terrainVisible = visible;
        chunkLayer.setVisible(visible);
        return;
      }
      if (definition.id === "player-content") {
        playerContentLayer.setVisible(visible);
        return;
      }
      if (definition.id === "grid") {
        if (coordinateGrid) coordinateGrid.hidden = !visible;
        return;
      }
      if (definition.id === "labels") {
        playerMarkerLayer.setLabelsVisible(visible);
        return;
      }
      if (definition.id === "player-markers") {
        playerMarkerLayer.setVisible(visible);
        return;
      }
      for (const categoryId of definition.categoryIds) {
        locationLayer.setCategoryVisibility(categoryId, visible);
      }
    },
    zoomIn() { map.zoomIn(1, { animate: false }); },
    zoomOut() { map.zoomOut(1, { animate: false }); },
    resetView() { if (worldBounds) map.fitBounds(worldBounds, { animate: false }); },
    getViewport,
    destroy() {
      setMarkerPlacementMode(false);
      generation += 1;
      pending = undefined;
      renderClient.dispose();
      chunkLayer.dispose();
      locationLayer.destroy();
      poiLabelLayer.destroy();
      playerMarkerLayer.destroy();
      playerContentLayer.destroy();
      map.off("moveend zoomend", notifyViewport);
      map.off("moveend zoomend", updateVisibleChunks);
      map.off("click", handleClick);
      map.remove();
      L.DomEvent.off(element);
    }
  };
  return view;
}
