import type {
  MapLocation,
  MapRepository,
  MapUiState
} from "../domain/map-model";
import {
  MAP_LAYER_DEFINITIONS,
  normalizeMapLayerIds,
  resolveVisibleMapLayerIds
} from "../domain/map-layers";
import { parseUiState, serializeUiState } from "../domain/ui-state";
import {
  createMapView,
  type MapView,
  type PreparedMapWorld,
  type MapViewport
} from "../map/map-view";
import {
  buildLocationNameInventory,
  type LocationNameInventory
} from "../map/location-name-inventory";
import { createAppShell, type AppShell } from "./app-shell";
import { SaveClient } from "../save/save-client";
import type {
  DecodedSave,
  SaveProgress,
  SaveStage
} from "../save/save-protocol";
import { joinSaveProgress } from "../progress/progress-location-join";
import {
  materializeTerrainTransferAsync,
  type TileCatalog
} from "../terrain/normalize-terrain";
import { loadTileCatalog } from "../terrain/tile-catalog";
import type {
  PlayerMarker,
  PlayerMarkerDraft
} from "../player-markers/player-marker";
import { createPlayerMarkerScopeId } from "../player-markers/player-marker-scope";
import { PlayerMarkerStore } from "../player-markers/player-marker-store";
import type {
  VendorMarkerCatalog,
  VendorMarkerDefinition
} from "../data/vendor-marker-catalog";
import { instantiateTileMarkers } from "../map/tile-marker-instances";
import { instantiateFacilities } from "../map/facility-instances";
import { mapPointToCell } from "../map/coordinate-system";

const stageMessages: Record<SaveStage, string> = {
  reading: "Reading the local save…",
  sqlite: "Checking Survival data…",
  decompressing: "Decompressing terrain data…",
  decoding: "Decoding terrain…",
  "player-content": "Reading player builds and vehicles…",
  compositing: "Composing the personal surface…",
  normalizing: "Validating the personal map…",
  rendering: "Preparing the first map frame…"
};

function availableLocationTypeIds(inventory: LocationNameInventory): Set<string> {
  return new Set(
    inventory.groups.flatMap((group) => group.types.map((type) => type.id))
  );
}

function normalizeLocationTypeIds(
  typeIds: readonly string[],
  inventory: LocationNameInventory
): string[] {
  const available = availableLocationTypeIds(inventory);
  return [...new Set(typeIds.filter((id) => available.has(id)))].sort((left, right) =>
    left.localeCompare(right, "en")
  );
}

export interface AppController {
  focusLocation(locationId: string): Promise<boolean>;
  destroy(): void;
}

export interface MapProgressSummary {
  activeQuests: number;
  completedQuests: number;
  completedGrowLabs: number;
  collectedLogs: number;
  seedTier: number;
  vaultTotal: number;
}

export interface MapIntegrationCallbacks {
  onLocationChange?(locationId: string | undefined, category: string | undefined): void;
  onModeChange?(mode: "reference" | "personal"): void;
  onProgressChange?(summary: MapProgressSummary | undefined): void;
}

interface SaveParser {
  parseSave(
    file: File,
    onProgress: (stage: SaveStage) => void,
    catalog: TileCatalog
  ): Promise<DecodedSave>;
  cancel(): void;
  dispose(): void;
}

export interface StartAppOptions {
  saveClient?: SaveParser;
  loadTileCatalog?: () => Promise<TileCatalog>;
  loadDefaultSave?: () => Promise<File | undefined>;
  createMapView?: typeof createMapView;
  playerMarkerStore?: PlayerMarkerStore;
  loadVendorMarkerCatalog?: () => Promise<VendorMarkerCatalog>;
  integration?: MapIntegrationCallbacks;
}

export async function startApp(
  root: HTMLElement,
  repository: MapRepository,
  options: StartAppOptions = {}
): Promise<AppController> {
  const [staticCatalog, vendorMarkerCatalog, referenceSurface] = await Promise.all([
    repository.loadLocations(),
    options.loadVendorMarkerCatalog
      ? options.loadVendorMarkerCatalog().catch((error: unknown) => ({
          definitions: [],
          diagnostics: [
            error instanceof Error
              ? error.message
              : "Optional resource marker data could not be loaded."
          ]
        }))
      : Promise.resolve({ definitions: [], diagnostics: [] }),
    repository.loadSurface()
  ]);
  const parsedState = parseUiState(window.location.search);
  const initialParams = new URLSearchParams(window.location.search);
  const migrateLegacyLocationLabels =
    parsedState.layerIds.includes("labels") && !initialParams.has("locationTypes");
  const hasInitialViewport =
    initialParams.has("z")
    || initialParams.has("x")
    || initialParams.has("y");
  const initialSelection = parsedState.selectedLocationId
    ? staticCatalog.find((location) => location.id === parsedState.selectedLocationId)
    : undefined;
  let state: MapUiState = {
    ...parsedState,
    selectedLocationId: initialSelection?.id
  };
  const markerDefinitions: readonly VendorMarkerDefinition[] =
    vendorMarkerCatalog.definitions;
  let activeSaveProgress: SaveProgress | undefined;
  let activeLocationIdsByProgressId = new Map<string, readonly string[]>();
  const mergeLocations = (
    primary: readonly MapLocation[],
    additions: readonly MapLocation[]
  ): MapLocation[] => {
    const merged = new Map<string, MapLocation>();
    for (const location of primary) {
      if (!merged.has(location.id)) merged.set(location.id, location);
    }
    for (const location of additions) {
      if (!merged.has(location.id)) merged.set(location.id, location);
    }
    return [...merged.values()];
  };
  const withDerivedLocations = (
    candidate: Awaited<ReturnType<MapRepository["loadSurface"]>>
  ): typeof candidate => ({
    ...candidate,
    locations: mergeLocations(
      instantiateFacilities(candidate, staticCatalog),
      instantiateTileMarkers(candidate, markerDefinitions)
    )
  });
  let world = withDerivedLocations(referenceSurface);
  const buildFullLocationCatalog = (
    activeWorld: typeof world
  ): MapLocation[] => {
    const activeById = new Map(activeWorld.locations.map((location) => [location.id, location]));
    return mergeLocations(
      staticCatalog.filter(
        (location) => !(location.id === "mechanic-station" && location.precision === "area-reference")
      ).map((location) => activeById.get(location.id) ?? location),
      activeWorld.locations
    );
  };
  let catalog = buildFullLocationCatalog(world);
  if (parsedState.selectedLocationId) {
    state = {
      ...state,
      selectedLocationId: catalog.find(
        (location) => location.id === parsedState.selectedLocationId
      )?.id
    };
  }
  let locationNameInventory = buildLocationNameInventory(world);
  state = {
    ...state,
    locationTypeIds: migrateLegacyLocationLabels
      ? normalizeLocationTypeIds(
          [...availableLocationTypeIds(locationNameInventory)],
          locationNameInventory
        )
      : normalizeLocationTypeIds(state.locationTypeIds, locationNameInventory)
  };
  const playerMarkerStore = options.playerMarkerStore
    ?? createBrowserPlayerMarkerStore();
  const initialPlayerMarkerLoad = playerMarkerStore.load();
  let activeMapScopeId = await createPlayerMarkerScopeId(world);
  let destroyed = false;
  let loadGeneration = 0;
  let rendering = false;
  let map: MapView;
  const saveClient = options.saveClient ?? new SaveClient();
  const getTileCatalog = options.loadTileCatalog ?? loadTileCatalog;
  const makeMapView = options.createMapView ?? createMapView;
  let saveGeneration = 0;
  let personalWorld: typeof world | undefined;
  let activeSaveSelection: object | undefined;
  let visiblePlayerMarkers: PlayerMarker[] = [];
  let selectedPlayerMarkerId: string | undefined;
  let playerMarkerDraft: PlayerMarkerDraft | undefined;
  let markerEditorMode: "empty" | "draft" | "view" | "edit" = "empty";
  let placingPlayerMarker = false;
  let placementStatusActive = false;
  let markerTransitionGeneration = 0;
  let activeMarkerTransitionGeneration: number | undefined;

  const commitWorld = (
    nextWorld: typeof world,
    options: {
      locationsDerived?: boolean;
    } = {}
  ): void => {
    const derivedWorld = options.locationsDerived
      ? nextWorld
      : withDerivedLocations(nextWorld);
    const nextInventory = buildLocationNameInventory(derivedWorld);
    const nextCatalog = buildFullLocationCatalog(derivedWorld);
    world = derivedWorld;
    catalog = nextCatalog;
    locationNameInventory = nextInventory;
    state = {
      ...state,
      locationTypeIds: normalizeLocationTypeIds(
        state.locationTypeIds,
        nextInventory
      )
    };
  };

  const matchesQuery = (location: MapLocation): boolean => {
    const query = state.query.trim().toLocaleLowerCase();
    return query.length === 0 || location.name.toLocaleLowerCase().includes(query);
  };
  const matchesCategories = (location: MapLocation): boolean =>
    state.categoryIds.length === 0 || state.categoryIds.includes(location.category);
  const getSidebarLocations = (): MapLocation[] => {
    const source = state.query.trim().length > 0 ? catalog : world.locations;
    return source.filter(
      (location) => matchesQuery(location) && matchesCategories(location)
    );
  };
  const getMapLocations = (): MapLocation[] => world.locations.filter((location) =>
    location.id === state.selectedLocationId
    || (matchesQuery(location) && matchesCategories(location))
  );
  const getSelectedLocation = (): MapLocation | undefined =>
    state.selectedLocationId
      ? catalog.find((location) => location.id === state.selectedLocationId)
      : undefined;
  const matchesPlayerMarkerQuery = (marker: PlayerMarker): boolean => {
    const query = state.query.trim().toLocaleLowerCase();
    return query.length === 0
      || marker.name.toLocaleLowerCase().includes(query)
      || marker.notes.toLocaleLowerCase().includes(query);
  };
  const refreshVisiblePlayerMarkers = (): void => {
    visiblePlayerMarkers = playerMarkerStore
      .list(activeMapScopeId)
      .filter(
        (marker) =>
          state.playerMarkerTypeIds.includes(marker.type)
          && matchesPlayerMarkerQuery(marker)
      );
  };
  const getSelectedPlayerMarker = (): PlayerMarker | undefined =>
    selectedPlayerMarkerId
      ? playerMarkerStore
          .list(activeMapScopeId)
          .find((marker) => marker.id === selectedPlayerMarkerId)
      : undefined;
  const renderSelectionDetails = (
    playerMarkerFocus = true
  ): void => {
    if (playerMarkerDraft && markerEditorMode === "draft") {
      shell.renderPlayerMarkerDraft(playerMarkerDraft);
      return;
    }
    const selectedPlayerMarker = getSelectedPlayerMarker();
    if (selectedPlayerMarker) {
      if (markerEditorMode === "edit") {
        shell.renderPlayerMarkerEdit(selectedPlayerMarker);
      } else {
        markerEditorMode = "view";
        shell.renderPlayerMarker(selectedPlayerMarker, {
          focus: playerMarkerFocus
        });
      }
      return;
    }
    selectedPlayerMarkerId = undefined;
    markerEditorMode = "empty";
    shell.renderDetails(getSelectedLocation());
  };
  const clearPlayerMarkerWork = (clearSelection = true): void => {
    placingPlayerMarker = false;
    playerMarkerDraft = undefined;
    map.setMarkerPlacementMode(false);
    shell.setMarkerPlacementMode(false);
    if (placementStatusActive) {
      placementStatusActive = false;
      shell.setStatus("");
    }
    if (clearSelection) {
      selectedPlayerMarkerId = undefined;
      markerEditorMode = "empty";
      map.selectPlayerMarker(undefined);
    } else {
      markerEditorMode = selectedPlayerMarkerId ? "view" : "empty";
    }
  };
  const playerMarkerActionsAvailable = (): boolean =>
    !destroyed && activeMarkerTransitionGeneration === undefined;
  const renderMapLayerTree = (): void => {
    shell.renderMapLayerTree({
      layerIds: [...resolveVisibleMapLayerIds(state.layerIds)],
      inventory: locationNameInventory,
      selectedLocationTypeIds: state.locationTypeIds,
      disabled: !playerMarkerActionsAvailable()
    });
  };
  const beginMarkerTransition = (): number => {
    const generation = ++markerTransitionGeneration;
    activeMarkerTransitionGeneration = generation;
    clearPlayerMarkerWork();
    renderSelectionDetails();
    renderMapLayerTree();
    shell.setPlayerMarkerActionsDisabled(true);
    return generation;
  };
  const finishMarkerTransition = (
    generation: number,
    cancelMarkerWork = false
  ): boolean => {
    if (activeMarkerTransitionGeneration !== generation) {
      return false;
    }
    if (cancelMarkerWork) {
      clearPlayerMarkerWork();
      renderSelectionDetails();
    }
    activeMarkerTransitionGeneration = undefined;
    if (!destroyed) {
      renderMapLayerTree();
      shell.setPlayerMarkerActionsDisabled(false);
    }
    return true;
  };
  const syncUrl = () => {
    const nextUrl = `${window.location.pathname}${serializeUiState(state, window.location.search)}${window.location.hash}`;
    window.history.replaceState(null, "", nextUrl);
  };
  const applyLayerVisibility = () => {
    const visibleLayers = resolveVisibleMapLayerIds(state.layerIds);
    const searchingLocations = state.query.trim().length > 0;
    for (const layer of MAP_LAYER_DEFINITIONS) {
      map.setLayerVisibility(
        layer.id,
        visibleLayers.has(layer.id)
          || (searchingLocations && layer.categoryIds.length > 0)
      );
    }
  };
  const syncViewportFromMap = () => {
    state = { ...state, ...map.getViewport() };
    shell.renderMapControls(state);
    syncUrl();
  };
  const render = (
    worldChanged = false,
    restoredViewport?: MapViewport,
    focusSelection = false,
    refreshSelectionDetails = true
  ) => {
    if (destroyed) {
      return;
    }

    rendering = true;
    refreshVisiblePlayerMarkers();
    shell.renderLocations({
      locations: getSidebarLocations(),
      availableCategoryIds: [...new Set(
        world.locations.map((location) => location.category)
      )].sort(),
      state
    });
    renderMapLayerTree();
    if (worldChanged) {
      map.setWorld(world);
      if (restoredViewport) {
        map.setViewport(restoredViewport);
      }
    }
    applyLayerVisibility();
    map.setLocations(getMapLocations());
    map.setPlayerMarkers(visiblePlayerMarkers);
    map.setLocationNames(locationNameInventory, state.locationTypeIds);
    map.selectLocation(state.selectedLocationId, { focus: focusSelection });
    map.selectPlayerMarker(selectedPlayerMarkerId);
    if (refreshSelectionDetails) {
      renderSelectionDetails();
    }
    state = { ...state, ...map.getViewport() };
    shell.renderMapControls(state);
    rendering = false;
    syncUrl();
  };
  const selectLocation = async (locationId: string): Promise<void> => {
    const location = catalog.find((candidate) => candidate.id === locationId);
    if (!location) {
      return;
    }

    clearPlayerMarkerWork();
    saveGeneration += 1;
    activeSaveSelection = undefined;
    saveClient.cancel();
    map.discardPreparedWorld();
    loadGeneration += 1;
    state = { ...state, selectedLocationId: location.id };
    render(false, undefined, true);
    options.integration?.onLocationChange?.(location.id, location.category);
  };
  const renderActiveProgress = (): void => {
    if (!activeSaveProgress) {
      shell.renderProgress();
      options.integration?.onProgressChange?.(undefined);
      return;
    }
    options.integration?.onProgressChange?.({
      activeQuests: activeSaveProgress.quests.filter(
        (quest) => quest.state === "active" || quest.state === "tracked"
      ).length,
      completedQuests: activeSaveProgress.quests.filter(
        (quest) => quest.state === "completed"
      ).length,
      completedGrowLabs: activeSaveProgress.completedGrowLabs.length,
      collectedLogs: activeSaveProgress.collectedLogIds.length,
      seedTier: activeSaveProgress.seedTier,
      vaultTotal: activeSaveProgress.vaultTotal
    });
    shell.renderProgress({
      progress: activeSaveProgress,
      locationIdsByProgressId: activeLocationIdsByProgressId,
      onSelectProgress(progressId, locationId) {
        if (locationId) {
          void selectLocation(locationId);
          return;
        }
        if (progressId !== "scannerbot") return;
        const scannerbot = activeSaveProgress?.scannerbot;
        if (!scannerbot || !Number.isFinite(scannerbot.x) || !Number.isFinite(scannerbot.y)) return;
        const viewport: MapViewport = {
          center: mapPointToCell(scannerbot),
          zoom: state.zoom
        };
        state = { ...state, ...viewport, selectedLocationId: undefined };
        clearPlayerMarkerWork();
        map.setViewport(viewport);
        render(false, undefined, false);
        shell.setStatus("Scannerbot saved position selected.");
      }
    });
  };
  const selectPlayerMarker = (
    markerId: string,
    playerMarkerFocus = true
  ): void => {
    if (!playerMarkerActionsAvailable()) {
      return;
    }
    const marker = playerMarkerStore
      .list(activeMapScopeId)
      .find((candidate) => candidate.id === markerId);
    if (!marker) {
      return;
    }

    clearPlayerMarkerWork(false);
    selectedPlayerMarkerId = marker.id;
    markerEditorMode = "view";
    state = { ...state, selectedLocationId: undefined };
    map.selectLocation(undefined, { focus: false });
    render(false, undefined, false, false);
    renderSelectionDetails(playerMarkerFocus);
  };
  const beginPlayerMarkerPlacement = (): void => {
    if (!playerMarkerActionsAvailable()) {
      return;
    }
    placingPlayerMarker = true;
    playerMarkerDraft = undefined;
    selectedPlayerMarkerId = undefined;
    markerEditorMode = "empty";
    state = { ...state, selectedLocationId: undefined };
    map.selectLocation(undefined, { focus: false });
    map.selectPlayerMarker(undefined);
    map.setMarkerPlacementMode(true);
    shell.setMarkerPlacementMode(true);
    shell.renderPlayerMarker();
    placementStatusActive = true;
    shell.setStatus("Select a map position for the new marker.");
    syncUrl();
  };
  const placePlayerMarker = (position: PlayerMarkerDraft["position"]): void => {
    if (!playerMarkerActionsAvailable() || !placingPlayerMarker) {
      return;
    }
    placingPlayerMarker = false;
    map.setMarkerPlacementMode(false);
    shell.setMarkerPlacementMode(false);
    playerMarkerDraft = {
      mapScopeId: activeMapScopeId,
      position: { ...position },
      name: "",
      type: "note",
      notes: ""
    };
    markerEditorMode = "draft";
    placementStatusActive = false;
    shell.setStatus("");
    renderSelectionDetails();
  };
  const cancelPlayerMarkerWork = (): void => {
    if (!playerMarkerActionsAvailable()) {
      return;
    }
    const wasEditing = markerEditorMode === "edit";
    clearPlayerMarkerWork(false);
    shell.setStatus("");
    if (wasEditing && getSelectedPlayerMarker()) {
      markerEditorMode = "view";
      renderSelectionDetails();
      return;
    }
    selectedPlayerMarkerId = undefined;
    markerEditorMode = "empty";
    map.selectPlayerMarker(undefined);
    renderSelectionDetails();
  };
  const savePlayerMarker = (value: PlayerMarkerDraft | PlayerMarker): void => {
    if (!playerMarkerActionsAvailable()) {
      return;
    }
    if (
      "id" in value
        ? getSelectedPlayerMarker()?.id !== value.id
        : value.mapScopeId !== activeMapScopeId
    ) {
      return;
    }
    try {
      const saved = "id" in value
        ? playerMarkerStore.update(value.id, {
            name: value.name,
            type: value.type,
            notes: value.notes
          })
        : playerMarkerStore.create({
            ...value,
            mapScopeId: activeMapScopeId
          });
      playerMarkerDraft = undefined;
      placingPlayerMarker = false;
      selectedPlayerMarkerId = saved.id;
      markerEditorMode = "view";
      state = { ...state, selectedLocationId: undefined };
      map.setMarkerPlacementMode(false);
      shell.setMarkerPlacementMode(false);
      shell.setStatus("");
      render();
    } catch (error) {
      shell.setMarkerEditorError(
        error instanceof Error ? error.message : "Player marker could not be saved."
      );
    }
  };
  const editPlayerMarker = (marker: PlayerMarker): void => {
    if (!playerMarkerActionsAvailable()) {
      return;
    }
    const selected = getSelectedPlayerMarker();
    if (!selected || selected.id !== marker.id) {
      return;
    }
    markerEditorMode = "edit";
    shell.renderPlayerMarkerEdit(selected);
  };
  const deletePlayerMarker = (marker: PlayerMarker): void => {
    if (!playerMarkerActionsAvailable()) {
      return;
    }
    const selected = getSelectedPlayerMarker();
    if (!selected || selected.id !== marker.id) {
      return;
    }
    try {
      playerMarkerStore.delete(marker.id);
      selectedPlayerMarkerId = undefined;
      markerEditorMode = "empty";
      map.selectPlayerMarker(undefined);
      render(false, undefined, false, false);
      shell.renderPlayerMarker();
    } catch (error) {
      shell.setMarkerEditorError(
        error instanceof Error ? error.message : "Player marker could not be saved."
      );
    }
  };
  const selectSave = async (file: File): Promise<void> => {
    const markerTransition = beginMarkerTransition();
    const generation = ++saveGeneration;
    const selection = {};
    activeSaveSelection = selection;
    saveClient.cancel();
    map.discardPreparedWorld();
    shell.setStatus(stageMessages.reading);
    let prepared: PreparedMapWorld | undefined;
    try {
      const tileCatalog = await getTileCatalog();
      if (destroyed || generation !== saveGeneration) return;
      const save = await saveClient.parseSave(file, (stage) => {
          if (!destroyed && generation === saveGeneration) {
            shell.setStatus(stageMessages[stage]);
          }
        }, tileCatalog);
      if (destroyed || generation !== saveGeneration) {
        return;
      }
      let candidateWorld = await materializeTerrainTransferAsync(
        save.terrain,
        save.metadata,
        () => !destroyed && generation === saveGeneration
      );
      if (destroyed || generation !== saveGeneration) {
        return;
      }
      candidateWorld = withDerivedLocations(candidateWorld);
      const progressJoin = joinSaveProgress(candidateWorld.locations, save.progress);
      candidateWorld = { ...candidateWorld, locations: progressJoin.locations };
      const candidateMapScopeId = await createPlayerMarkerScopeId(candidateWorld);
      if (destroyed || generation !== saveGeneration) {
        return;
      }
      shell.setStatus(stageMessages.compositing);
      prepared = await map.prepareWorld(
        candidateWorld,
        save.playerContent
      );
      if (destroyed || generation !== saveGeneration) {
        map.discardPreparedWorld(prepared);
        return;
      }

      await map.commitPreparedWorld(prepared);
      if (
        destroyed
        || generation !== saveGeneration
        || activeSaveSelection !== selection
      ) {
        return;
      }
      if (!finishMarkerTransition(markerTransition, true)) {
        return;
      }
      loadGeneration += 1;
      activeSaveProgress = save.progress;
      activeLocationIdsByProgressId = new Map(progressJoin.locationIdsByProgressId);
      personalWorld = candidateWorld;
      commitWorld(candidateWorld, { locationsDerived: true });
      activeMapScopeId = candidateMapScopeId;
      state = {
        ...state,
        selectedLocationId: state.selectedLocationId && catalog.some(
          (location) => location.id === state.selectedLocationId
        ) ? state.selectedLocationId : undefined
      };
      shell.setMode("personalized", save.metadata.fileName, {
        seed: save.metadata.seed,
        saveVersion: save.metadata.saveVersion,
        coverage: prepared.coverage
      });
      options.integration?.onModeChange?.("personal");
      renderActiveProgress();
      render(false);
      shell.setStatus("Your personal map is ready. The save's actual layout and player content are shown with verified sm_map_generator artwork.");
    } catch (error) {
      map.discardPreparedWorld(prepared);
      if (!destroyed && generation === saveGeneration) {
        map.setLocationNames(locationNameInventory, state.locationTypeIds);
        shell.setStatus(
          `${error instanceof Error ? error.message : "The save could not be read."} Please select another Scrap Mechanic 1.0 Survival .db save.`
        );
      }
    } finally {
      finishMarkerTransition(markerTransition);
      if (activeSaveSelection === selection) {
        activeSaveSelection = undefined;
      }
    }
  };
  const exitSaveMode = async (): Promise<void> => {
    const exitingPersonalWorld = personalWorld;
    if (!exitingPersonalWorld) {
      return;
    }
    const markerTransition = beginMarkerTransition();
    const exitSaveGeneration = ++saveGeneration;
    const exitLoadGeneration = ++loadGeneration;
    saveClient.cancel();
    map.discardPreparedWorld();
    let preparedReference: PreparedMapWorld | undefined;
    try {
      const baseWorld = await repository.loadSurface();
      if (
        destroyed
        || exitSaveGeneration !== saveGeneration
        || exitLoadGeneration !== loadGeneration
        || personalWorld !== exitingPersonalWorld
      ) {
        finishMarkerTransition(markerTransition);
        return;
      }
      shell.setStatus(stageMessages.compositing);
      preparedReference = await map.prepareWorld(baseWorld);
      if (
        destroyed
        || exitSaveGeneration !== saveGeneration
        || exitLoadGeneration !== loadGeneration
        || personalWorld !== exitingPersonalWorld
      ) {
        map.discardPreparedWorld(preparedReference);
        finishMarkerTransition(markerTransition);
        return;
      }
      await map.commitPreparedWorld(preparedReference);
      if (!finishMarkerTransition(markerTransition, true)) {
        return;
      }
      commitWorld(baseWorld);
      personalWorld = undefined;
      activeSaveProgress = undefined;
      activeLocationIdsByProgressId = new Map();
      activeMapScopeId = "default";
      shell.setMode("reference");
      options.integration?.onModeChange?.("reference");
      renderActiveProgress();
      shell.setStatus("");
      render(false);
    } catch (error) {
      map.discardPreparedWorld(preparedReference);
      if (
        !destroyed
        && exitSaveGeneration === saveGeneration
        && exitLoadGeneration === loadGeneration
        && personalWorld === exitingPersonalWorld
      ) {
        finishMarkerTransition(markerTransition);
        shell.setStatus(error instanceof Error ? error.message : "The base map could not be restored.");
      }
    }
  };

  const shell: AppShell = createAppShell(root, {
    onQueryChange(query) {
      state = { ...state, query };
      render(false, undefined, false, false);
    },
    onCategoryChange(categoryIds) {
      state = { ...state, categoryIds };
      render(false, undefined, false, false);
    },
    onPlayerMarkerTypeChange(playerMarkerTypeIds) {
      state = { ...state, playerMarkerTypeIds: [...playerMarkerTypeIds].sort() };
      render(false, undefined, false, false);
    },
    onLayerChange(layerIds) {
      state = { ...state, layerIds: normalizeMapLayerIds(layerIds) };
      applyLayerVisibility();
      map.setLocationNames(locationNameInventory, state.locationTypeIds);
      shell.renderMapControls(state);
      syncUrl();
    },
    onLocationTypeChange(locationTypeIds) {
      state = {
        ...state,
        locationTypeIds: normalizeLocationTypeIds(
          locationTypeIds,
          locationNameInventory
        )
      };
      map.setLocationNames(locationNameInventory, state.locationTypeIds);
      syncUrl();
    },
    onZoomIn() {
      map.zoomIn();
      syncViewportFromMap();
    },
    onZoomOut() {
      map.zoomOut();
      syncViewportFromMap();
    },
    onResetView() {
      map.resetView();
      syncViewportFromMap();
    },
    onAddMarker() {
      beginPlayerMarkerPlacement();
    },
    onCancelMarker() {
      cancelPlayerMarkerWork();
    },
    onSaveMarker(value) {
      savePlayerMarker(value);
    },
    onEditMarker(marker) {
      editPlayerMarker(marker);
    },
    onDeleteMarker(marker) {
      deletePlayerMarker(marker);
    },
    onSaveSelect(file) {
      void selectSave(file);
    },
    onExitSaveMode() {
      void exitSaveMode();
    }
  });
  try {
    map = makeMapView(root.querySelector<HTMLElement>("#map")!, {
      onViewportChange(viewport) {
        if (rendering || destroyed) {
          return;
        }
        state = { ...state, ...viewport };
        shell.renderMapControls(state);
        syncUrl();
      },
      onLocationSelect(locationId) {
        void selectLocation(locationId);
      },
      onPlayerMarkerSelect(markerId) {
        selectPlayerMarker(markerId);
      },
      onMarkerPlacement(position) {
        placePlayerMarker(position);
      }
    });
  } catch (error) {
    saveClient.dispose();
    shell.destroy();
    throw error;
  }
  shell.setMode("reference");
  options.integration?.onModeChange?.("reference");
  shell.renderProgress();
  render(
    true,
    hasInitialViewport
      ? {
          center: state.center,
          zoom: state.zoom
        }
      : undefined,
    Boolean(state.selectedLocationId)
  );
  if (initialPlayerMarkerLoad.warning) {
    shell.setStatus(initialPlayerMarkerLoad.warning);
  }
  if (options.loadDefaultSave) {
    const defaultSaveGeneration = saveGeneration;
    void options.loadDefaultSave()
      .then((file) => {
        if (
          file
          && !destroyed
          && saveGeneration === defaultSaveGeneration
        ) {
          void selectSave(file);
        }
      })
      .catch((error: unknown) => {
        if (!destroyed && saveGeneration === defaultSaveGeneration) {
          shell.setStatus(
            `${error instanceof Error ? error.message : "The default save could not be loaded."} The base map is still available.`
          );
        }
      });
  }

  return {
    async focusLocation(locationId) {
      if (destroyed || !catalog.some((location) => location.id === locationId)) {
        return false;
      }
      await selectLocation(locationId);
      return true;
    },
    destroy() {
      if (destroyed) {
        return;
      }
      clearPlayerMarkerWork();
      destroyed = true;
      activeSaveSelection = undefined;
      loadGeneration += 1;
      saveGeneration += 1;
      saveClient.dispose();
      map.destroy();
      shell.destroy();
    }
  };
}

function createBrowserPlayerMarkerStore(): PlayerMarkerStore {
  try {
    return new PlayerMarkerStore(window.localStorage);
  } catch {
    return new PlayerMarkerStore({
      get length() {
        return 0;
      },
      clear() {},
      getItem() {
        throw new Error("Storage access denied");
      },
      key() {
        return null;
      },
      removeItem() {},
      setItem() {
        throw new Error("Storage access denied");
      }
    });
  }
}
