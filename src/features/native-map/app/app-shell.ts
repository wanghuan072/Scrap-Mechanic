import {
  MAX_MAP_ZOOM,
  MIN_MAP_ZOOM,
  type MapLocation,
  type MapUiState
} from "../domain/map-model";
import {
  createLocationBrowser,
  type LocationBrowser,
  type LocationBrowserRenderInput
} from "../components/location-browser";
import {
  createMapLayerTree,
  type MapLayerTree,
  type MapLayerTreeRenderInput
} from "../components/map-layer-tree";
import {
  createLocationDetails,
  type LocationDetails
} from "../components/location-details";
import {
  createPlayerMarkerEditor,
  type PlayerMarkerEditor
} from "../components/player-marker-editor";
import { createSaveEntry, type SaveEntry } from "../components/save-entry";
import {
  createProgressSummary,
  type ProgressSummary,
  type ProgressSummaryRenderInput
} from "../components/progress-summary";
import type { TerrainCoverageSummary } from "../components/terrain-coverage";
import type {
  PlayerMarker,
  PlayerMarkerDraft,
  PlayerMarkerType
} from "../player-markers/player-marker";

const atlasHeading = "Scrap Mechanic Map";
const atlasKicker = "SCRAP MECHANIC 1.0";
const referenceMap = "Reference Map";
const saveMap = "Personal Map";
const locationBrowserLabel = "Location Browser";
const interactiveMap = "Interactive Map";
const locationDetailsLabel = "Location Details";
const openFilters = "Open Location Filters";
const closeFilters = "Close Location Filters";
const exitSaveMode = "Exit Personal Map";
const mapPlaceholder = "Map Canvas";
const mapViewport = "Map View Controls";
const zoomIn = "Zoom In";
const zoomOut = "Zoom Out";
const resetView = "Reset View";
export interface AppCallbacks {
  onQueryChange?(query: string): void;
  onCategoryChange?(categoryIds: string[]): void;
  onPlayerMarkerTypeChange?(typeIds: PlayerMarkerType[]): void;
  onLayerChange?(layerIds: string[]): void;
  onLocationTypeChange?(typeIds: string[]): void;
  onZoomIn?(): void;
  onZoomOut?(): void;
  onResetView?(): void;
  onAddMarker?(): void;
  onCancelMarker?(): void;
  onSaveMarker?(value: PlayerMarkerDraft | PlayerMarker): void;
  onEditMarker?(marker: PlayerMarker): void;
  onDeleteMarker?(marker: PlayerMarker): void;
  onSaveSelect?(file: File): void;
  onExitSaveMode?(): void;
}

export type AppMode = "base" | "reference" | "save" | "personalized";
export interface PersonalModeSummary {
  seed: number;
  saveVersion: number;
  coverage?: TerrainCoverageSummary;
}

export interface MapBusyState {
  title: string;
  message: string;
  progress?: number;
}

export interface AppShell {
  renderLocations(
    input: MapLocation[] | LocationBrowserRenderInput,
    state?: MapUiState
  ): void;
  renderDetails(location?: MapLocation): void;
  renderPlayerMarkerDraft(draft: PlayerMarkerDraft): void;
  renderPlayerMarker(
    marker?: PlayerMarker,
    options?: { focus?: boolean }
  ): void;
  renderPlayerMarkerEdit(marker: PlayerMarker): void;
  renderMapLayerTree(input: MapLayerTreeRenderInput): void;
  renderMapControls(state: MapUiState): void;
  renderProgress(input?: ProgressSummaryRenderInput): void;
  setMarkerPlacementMode(enabled: boolean): void;
  setPlayerMarkerActionsDisabled(disabled: boolean): void;
  setMarkerEditorError(message: string): void;
  setMode(mode: AppMode, fileName?: string, summary?: PersonalModeSummary): void;
  setBusy(state?: MapBusyState): void;
  setStatus(message: string): void;
  destroy(): void;
}

export function createAppShell(root: HTMLElement, callbacks: AppCallbacks): AppShell {
  root.innerHTML = `
    <div class="app-shell" data-app-mode="base">
      <header class="topbar">
        <div class="brand-lockup">
          <span class="brand-lockup__kicker">${atlasKicker}</span>
          <strong class="brand-lockup__title">${atlasHeading}</strong>
        </div>
        <div class="topbar__actions">
          <button class="filter-toggle" type="button" aria-expanded="false"
            aria-controls="location-panel">${openFilters}</button>
          <div class="mode-readout">
            <span class="mode-badge" data-mode-badge>${referenceMap}</span>
            <span class="mode-file" data-mode-file hidden></span>
            <span class="mode-meta" data-mode-meta hidden></span>
          </div>
          <button class="exit-save-button" type="button" hidden>${exitSaveMode}</button>
        </div>
      </header>
      <aside class="location-panel" id="location-panel" aria-label="${locationBrowserLabel}"
        data-open="false">
        <div class="panel-heading">
          <span aria-hidden="true">01</span>
          <strong>${locationBrowserLabel}</strong>
          <button class="drawer-close" type="button">${closeFilters}</button>
        </div>
        <section class="save-entry" data-save-entry></section>
        <div class="location-panel__tools">
          <div class="location-browser" data-location-browser></div>
          <section class="progress-summary" data-progress-summary hidden></section>
          <button class="mobile-exit-save-button" type="button"
            data-mobile-exit-save hidden>${exitSaveMode}</button>
        </div>
      </aside>
      <section id="map" class="map-panel" role="region" aria-label="${interactiveMap}"
        tabindex="0">
        <div class="map-panel__grid" data-coordinate-grid aria-hidden="true"></div>
        <span class="map-panel__label">${mapPlaceholder}</span>
        <div class="map-controls" data-map-controls>
          <div class="map-viewport-controls" role="group" aria-label="${mapViewport}">
            <button type="button" data-map-zoom-in aria-label="${zoomIn}">+</button>
            <button type="button" data-map-zoom-out aria-label="${zoomOut}">\u2212</button>
            <button type="button" data-map-reset>${resetView}</button>
            <button type="button" data-marker-add>Add Marker</button>
            <output data-map-readout aria-live="polite"></output>
          </div>
        </div>
      </section>
      <aside class="detail-panel" aria-label="${locationDetailsLabel}"
        data-location-details tabindex="-1"></aside>
      <button class="drawer-backdrop" type="button" aria-label="${closeFilters}"
        tabindex="-1"></button>
      <div class="map-busy-overlay" data-map-busy hidden role="status"
        aria-live="polite" aria-atomic="true">
        <div class="map-busy-card">
          <div class="native-map-loader" aria-hidden="true">
            <span class="native-map-loader__orbit"></span>
            <span class="native-map-loader__core"></span>
          </div>
          <span class="map-busy-card__eyebrow">LOCAL SAVE / BROWSER PROCESSING</span>
          <strong data-map-busy-title>Building your personal map</strong>
          <span data-map-busy-message>Reading the local save…</span>
          <div class="map-busy-progress" aria-hidden="true">
            <span data-map-busy-progress></span>
          </div>
          <span class="map-busy-card__privacy">LOCAL MEMORY ONLY · NOTHING IS UPLOADED</span>
        </div>
      </div>
      <div class="status-readout" aria-live="polite" aria-atomic="true"
        data-status></div>
    </div>
  `;

  const shell = root.querySelector<HTMLElement>(".app-shell")!;
  const browserRoot = root.querySelector<HTMLElement>("[data-location-browser]")!;
  const detailsRoot = root.querySelector<HTMLElement>("[data-location-details]")!;
  const saveRoot = root.querySelector<HTMLElement>("[data-save-entry]")!;
  const progressRoot = root.querySelector<HTMLElement>("[data-progress-summary]")!;
  const locationPanel = root.querySelector<HTMLElement>("#location-panel")!;
  const filterToggle = root.querySelector<HTMLButtonElement>(".filter-toggle")!;
  const drawerClose = root.querySelector<HTMLButtonElement>(".drawer-close")!;
  const drawerBackdrop = root.querySelector<HTMLButtonElement>(".drawer-backdrop")!;
  const modeBadge = root.querySelector<HTMLElement>("[data-mode-badge]")!;
  const modeFile = root.querySelector<HTMLElement>("[data-mode-file]")!;
  const modeMeta = root.querySelector<HTMLElement>("[data-mode-meta]")!;
  const exitSaveButton = root.querySelector<HTMLButtonElement>(".exit-save-button")!;
  const mobileExitSaveButton = root.querySelector<HTMLButtonElement>(
    "[data-mobile-exit-save]"
  )!;
  const mapControls = root.querySelector<HTMLElement>("[data-map-controls]")!;
  const zoomInButton = root.querySelector<HTMLButtonElement>(
    "[data-map-zoom-in]"
  )!;
  const zoomOutButton = root.querySelector<HTMLButtonElement>(
    "[data-map-zoom-out]"
  )!;
  const resetViewButton = root.querySelector<HTMLButtonElement>(
    "[data-map-reset]"
  )!;
  const addMarkerButton = root.querySelector<HTMLButtonElement>(
    "[data-marker-add]"
  )!;
  const mapPanel = root.querySelector<HTMLElement>("#map")!;
  const mapReadout = root.querySelector<HTMLOutputElement>(
    "[data-map-readout]"
  )!;
  const status = root.querySelector<HTMLElement>("[data-status]")!;
  const busyOverlay = root.querySelector<HTMLElement>("[data-map-busy]")!;
  const busyTitle = root.querySelector<HTMLElement>("[data-map-busy-title]")!;
  const busyMessage = root.querySelector<HTMLElement>("[data-map-busy-message]")!;
  const busyProgress = root.querySelector<HTMLElement>("[data-map-busy-progress]")!;
  const mobileViewport = window.matchMedia?.("(max-width: 759px)");
  let markerPlacementMode = false;
  let markerEditorMode: "official" | "empty" | "draft" | "view" | "edit" =
    "official";

  const syncDrawerAccessibility = () => {
    const hiddenFromMobileAccess =
      Boolean(mobileViewport?.matches) && locationPanel.dataset.open !== "true";
    locationPanel.inert = hiddenFromMobileAccess;
    locationPanel.toggleAttribute("inert", hiddenFromMobileAccess);
    if (hiddenFromMobileAccess) {
      locationPanel.setAttribute("aria-hidden", "true");
    } else {
      locationPanel.removeAttribute("aria-hidden");
    }
  };
  const setDrawerOpen = (open: boolean) => {
    locationPanel.dataset.open = String(open);
    shell.dataset.drawerOpen = String(open);
    filterToggle.setAttribute("aria-expanded", String(open));
    syncDrawerAccessibility();
  };
  const locationBrowser: LocationBrowser = createLocationBrowser(browserRoot, {
    onQueryChange: callbacks.onQueryChange,
    onCategoryChange: callbacks.onCategoryChange,
    onPlayerMarkerTypeChange: callbacks.onPlayerMarkerTypeChange
  });
  const mapLayerTreeRoot = root.querySelector<HTMLElement>("[data-map-layer-tree]")!;
  const mapLayerTree: MapLayerTree = createMapLayerTree(mapLayerTreeRoot, {
    onLayerChange: callbacks.onLayerChange,
    onLocationTypeChange: callbacks.onLocationTypeChange
  });
  const locationDetails: LocationDetails = createLocationDetails(detailsRoot);
  const playerMarkerEditor: PlayerMarkerEditor = createPlayerMarkerEditor(
    detailsRoot,
    {
      onSave: callbacks.onSaveMarker,
      onCancel: callbacks.onCancelMarker,
      onEdit: callbacks.onEditMarker,
      onDelete: callbacks.onDeleteMarker
    }
  );
  const saveEntry: SaveEntry = createSaveEntry(saveRoot, callbacks.onSaveSelect);
  const progressSummary: ProgressSummary = createProgressSummary(progressRoot);

  const handleToggle = () => setDrawerOpen(locationPanel.dataset.open !== "true");
  const handleClose = () => {
    setDrawerOpen(false);
    filterToggle.focus({ preventScroll: true });
  };
  const setMarkerPlacementMode = (enabled: boolean, restoreFocus = !enabled) => {
    markerPlacementMode = enabled;
    addMarkerButton.textContent = enabled ? "Cancel Adding" : "Add Marker";
    addMarkerButton.setAttribute("aria-pressed", String(enabled));
    mapPanel.dataset.markerPlacement = String(enabled);
    if (restoreFocus) {
      addMarkerButton.focus({ preventScroll: true });
    }
  };
  const handleMarkerControl = (event: MouseEvent) => {
    event.stopPropagation();
    if (markerPlacementMode) {
      setMarkerPlacementMode(false);
      callbacks.onCancelMarker?.();
      return;
    }
    callbacks.onAddMarker?.();
  };
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key !== "Escape") {
      return;
    }
    if (markerPlacementMode) {
      event.preventDefault();
      setMarkerPlacementMode(false);
      callbacks.onCancelMarker?.();
      return;
    }
    if (markerEditorMode === "draft" || markerEditorMode === "edit") {
      event.preventDefault();
      callbacks.onCancelMarker?.();
      return;
    }
    if (locationPanel.dataset.open === "true") {
      handleClose();
    }
  };
  const handleExitSaveMode = () => callbacks.onExitSaveMode?.();
  const handleViewportChange = () => syncDrawerAccessibility();
  const handleMapControlClick = (event: MouseEvent) => event.stopPropagation();

  filterToggle.addEventListener("click", handleToggle);
  drawerClose.addEventListener("click", handleClose);
  drawerBackdrop.addEventListener("click", handleClose);
  exitSaveButton.addEventListener("click", handleExitSaveMode);
  mobileExitSaveButton.addEventListener("click", handleExitSaveMode);
  mapControls.addEventListener("click", handleMapControlClick);
  zoomInButton.addEventListener("click", callbacks.onZoomIn ?? noOp);
  zoomOutButton.addEventListener("click", callbacks.onZoomOut ?? noOp);
  resetViewButton.addEventListener("click", callbacks.onResetView ?? noOp);
  addMarkerButton.addEventListener("click", handleMarkerControl);
  document.addEventListener("keydown", handleEscape);
  mobileViewport?.addEventListener("change", handleViewportChange);

  locationBrowser.render({ locations: [] });
  locationDetails.render();
  setMarkerPlacementMode(false, false);
  syncDrawerAccessibility();

  return {
    renderLocations(input, state) {
      locationBrowser.render(
        Array.isArray(input)
          ? { locations: input, state }
          : input
      );
    },
    renderDetails(location) {
      markerEditorMode = "official";
      delete detailsRoot.dataset.markerEditorMode;
      locationDetails.render(location);
    },
    renderPlayerMarkerDraft(draft) {
      markerEditorMode = "draft";
      playerMarkerEditor.renderDraft(draft);
    },
    renderPlayerMarker(marker, options) {
      markerEditorMode = marker ? "view" : "empty";
      if (marker) {
        playerMarkerEditor.renderMarker(marker);
      } else {
        playerMarkerEditor.renderEmpty();
      }
      if (options?.focus !== false) {
        const selectedMarker = marker
          ? Array.from(
              mapPanel.querySelectorAll<HTMLButtonElement>("[data-player-marker-id]")
            ).find((button) => button.dataset.playerMarkerId === marker.id)
          : undefined;
        (selectedMarker ?? addMarkerButton).focus({ preventScroll: true });
      }
    },
    renderPlayerMarkerEdit(marker) {
      markerEditorMode = "edit";
      playerMarkerEditor.renderEdit(marker);
    },
    renderMapLayerTree(input) {
      mapLayerTree.render(input);
    },
    renderMapControls(state) {
      zoomInButton.disabled = state.zoom >= MAX_MAP_ZOOM;
      zoomOutButton.disabled = state.zoom <= MIN_MAP_ZOOM;
      mapReadout.value = `${coordinatesReadout(state.center.x, state.center.y, state.zoom)}`;
      mapReadout.textContent = mapReadout.value;
    },
    renderProgress(input) {
      progressSummary.render(input);
    },
    setMarkerPlacementMode,
    setPlayerMarkerActionsDisabled(disabled) {
      addMarkerButton.disabled = disabled;
    },
    setMarkerEditorError(message) {
      playerMarkerEditor.setError(message);
    },
    setMode(mode, fileName, summary) {
      const isSaveMode = mode === "save" || mode === "personalized";
      shell.dataset.appMode = isSaveMode ? "save" : "base";
      modeBadge.textContent = isSaveMode ? saveMap : referenceMap;
      modeFile.textContent = fileName ?? "";
      modeFile.hidden = !isSaveMode || !fileName;
      modeMeta.textContent = summary
        ? `Seed ${summary.seed} \u00b7 Save Version ${summary.saveVersion}`
        : "";
      modeMeta.hidden = !isSaveMode || !summary;
      saveEntry.setPersonalized(mode === "personalized");
      saveEntry.setTerrainCoverage(
        mode === "personalized" ? summary?.coverage : undefined
      );
      exitSaveButton.hidden = !isSaveMode;
      mobileExitSaveButton.hidden = !isSaveMode;
    },
    setBusy(nextState) {
      const busy = Boolean(nextState);
      shell.dataset.busy = String(busy);
      shell.setAttribute("aria-busy", String(busy));
      busyOverlay.hidden = !busy;
      saveEntry.setBusy(busy);
      exitSaveButton.disabled = busy;
      mobileExitSaveButton.disabled = busy;
      filterToggle.disabled = busy;
      if (!nextState) return;
      busyTitle.textContent = nextState.title;
      busyMessage.textContent = nextState.message;
      const progress = Math.min(100, Math.max(0, nextState.progress ?? 0));
      busyProgress.style.width = `${progress}%`;
      busyProgress.parentElement?.toggleAttribute(
        "data-indeterminate",
        nextState.progress === undefined
      );
    },
    setStatus(message) {
      status.textContent = message;
      status.hidden = message.length === 0;
    },
    destroy() {
      filterToggle.removeEventListener("click", handleToggle);
      drawerClose.removeEventListener("click", handleClose);
      drawerBackdrop.removeEventListener("click", handleClose);
      exitSaveButton.removeEventListener("click", handleExitSaveMode);
      mobileExitSaveButton.removeEventListener("click", handleExitSaveMode);
      mapControls.removeEventListener("click", handleMapControlClick);
      zoomInButton.removeEventListener("click", callbacks.onZoomIn ?? noOp);
      zoomOutButton.removeEventListener("click", callbacks.onZoomOut ?? noOp);
      resetViewButton.removeEventListener("click", callbacks.onResetView ?? noOp);
      addMarkerButton.removeEventListener("click", handleMarkerControl);
      document.removeEventListener("keydown", handleEscape);
      mobileViewport?.removeEventListener("change", handleViewportChange);
      locationBrowser.destroy();
      mapLayerTree.destroy();
      locationDetails.destroy();
      playerMarkerEditor.destroy();
      saveEntry.destroy();
      progressSummary.destroy();
      root.replaceChildren();
    }
  };
}

function noOp(): void {}

function coordinatesReadout(x: number, y: number, zoom: number): string {
  return `X ${formatMapNumber(x)} \u00b7 Y ${formatMapNumber(y)} \u00b7 Zoom ${formatMapNumber(zoom)}`;
}

function formatMapNumber(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return String(Object.is(rounded, -0) ? 0 : rounded);
}
