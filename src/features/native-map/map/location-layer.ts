import * as L from "leaflet";
import type { MapLocation } from "../domain/map-model";
import {
  cellBoundsToMapPointBounds,
  cellToMapPoint,
  type MapPoint
} from "./coordinate-system";

interface LocationMarker {
  location: MapLocation;
  marker: L.Marker;
}

interface LocationCluster {
  locations: MapLocation[];
  anchors: MapPoint[];
}

const mapLocationLabel = "Map location";
const clusterActionLabel = "Zoom into";
const viewportPaddingRatio = 0.25;
const viewportRenderDebounceMs = 50;
const zeroViewportLocationLimit = 100;
const clusterCellSizePx = 64;
const spiderfyAngleStep = Math.PI * (3 - Math.sqrt(5));

export interface LocationLayer {
  setLocations(locations: MapLocation[]): void;
  selectLocation(
    locationId?: string,
    options?: LocationSelectionOptions
  ): void;
  setCategoryVisibility(categoryId: string, visible: boolean): void;
  destroy(): void;
}

export interface LocationSelectionOptions {
  focus?: boolean;
}

export function createLocationLayer(
  map: L.Map,
  onLocationSelect: (locationId: string) => void
): LocationLayer {
  const renderedLayer = L.layerGroup().addTo(map);
  const categoryVisibility = new Map<string, boolean>();
  const markers = new Map<string, LocationMarker>();
  const clusterMarkers = new Set<L.Marker>();
  const spiderLegs = new Set<L.Polyline>();
  const locationCatalog = new Map<string, MapLocation>();
  let selectedLocationId: string | undefined;
  let spiderfiedLocationIds: readonly string[] | undefined;
  let viewportRenderTimer: ReturnType<typeof setTimeout> | undefined;
  let destroyed = false;

  const updateMarkerSelection = () => {
    for (const [locationId, { marker }] of markers) {
      marker
        .getElement()
        ?.querySelector("button")
        ?.setAttribute("aria-pressed", String(locationId === selectedLocationId));
    }
  };

  const findMarkerButton = (locationId: string): HTMLElement | undefined =>
    Array.from(
      map
        .getContainer()
        .querySelectorAll<HTMLElement>("[data-map-location-id]")
    ).find((element) => element.dataset.mapLocationId === locationId);

  const getFocusedMarkerId = (): string | undefined => {
    const activeElement = map.getContainer().ownerDocument.activeElement;
    return activeElement instanceof HTMLElement
      ? activeElement.closest<HTMLElement>("[data-map-location-id]")?.dataset
          .mapLocationId
      : undefined;
  };

  const fitLocationBounds = (location: MapLocation) => {
    if (location.bounds) {
      map.fitBounds(toLeafletBounds(location.bounds), { animate: false });
      return;
    }
    const anchor = getLocationAnchor(location);
    if (anchor) map.panTo(toLeafletPoint(anchor), { animate: false });
  };

  const clearRenderedMarkers = (): void => {
    for (const { marker } of markers.values()) marker.off();
    for (const marker of clusterMarkers) marker.off();
    renderedLayer.clearLayers();
    markers.clear();
    clusterMarkers.clear();
    spiderLegs.clear();
  };

  const createMarker = (
    location: MapLocation,
    position?: L.LatLngExpression
  ): void => {
    const anchor = getLocationAnchor(location);
    const markerPosition = position ?? (anchor ? toLeafletPoint(anchor) : undefined);
    if (!markerPosition) return;
    const marker = L.marker(markerPosition, {
      icon: L.divIcon({
        className: "map-location-icon",
        html: markerButtonMarkup(location),
        iconSize: [40, 46],
        iconAnchor: [20, 44]
      }),
      keyboard: false,
      title: location.name
    });
    const handleSelection = () => {
      spiderfiedLocationIds = undefined;
      selectLocation(location.id, { focus: false });
      onLocationSelect(location.id);
    };
    marker.on("click", handleSelection);
    marker.addTo(renderedLayer);
    const button = marker
      .getElement()
      ?.querySelector<HTMLButtonElement>("[data-map-location-id]");
    button?.addEventListener("click", (event) => {
      // Leaflet does not consistently forward clicks from nested native buttons.
      // Handle the accessible button directly so every marker opens its details.
      event.stopPropagation();
      handleSelection();
    });
    markers.set(location.id, { location, marker });
  };

  const clusterCenter = (cluster: LocationCluster): MapPoint => ({
    x: cluster.anchors.reduce((total, anchor) => total + anchor.x, 0)
      / cluster.anchors.length,
    y: cluster.anchors.reduce((total, anchor) => total + anchor.y, 0)
      / cluster.anchors.length
  });

  const createClusterMarker = (cluster: LocationCluster): void => {
    const center = clusterCenter(cluster);
    const count = cluster.locations.length;
    const marker = L.marker(toLeafletPoint(center), {
      icon: L.divIcon({
        className: "map-location-cluster-icon",
        html: clusterButtonMarkup(count),
        iconSize: [48, 48],
        iconAnchor: [24, 24]
      }),
      keyboard: false,
      title: `${count} locations`
    });
    marker.on("click", () => {
      if (map.getZoom() < map.getMaxZoom()) {
        spiderfiedLocationIds = undefined;
        map.setView(
          toLeafletPoint(center),
          Math.min(map.getZoom() + 1, map.getMaxZoom()),
          { animate: false }
        );
        return;
      }
      spiderfiedLocationIds = cluster.locations.map(({ id }) => id);
      renderVisibleMarkers();
    });
    marker.addTo(renderedLayer);
    clusterMarkers.add(marker);
  };

  const isInsidePaddedViewport = (location: MapLocation): boolean => {
    const anchor = getLocationAnchor(location);
    return Boolean(
      anchor
      && map
        .getBounds()
        .pad(viewportPaddingRatio)
        .contains(toLeafletPoint(anchor))
    );
  };

  const hasUsableViewport = (): boolean => {
    const size = map.getSize();
    return size.x > 0 && size.y > 0;
  };

  const visibleLocations = (forcedLocationId?: string): MapLocation[] => {
    const viewportIsUsable = hasUsableViewport();
    const visible: MapLocation[] = [];
    for (const location of locationCatalog.values()) {
      if (location.id === forcedLocationId) continue;
      if (categoryVisibility.get(location.category) === false) continue;
      if (viewportIsUsable && !isInsidePaddedViewport(location)) continue;
      visible.push(location);
      if (!viewportIsUsable && visible.length >= zeroViewportLocationLimit) break;
    }
    return visible;
  };

  const groupLocations = (locations: readonly MapLocation[]): LocationCluster[] => {
    const groups = new Map<string, LocationCluster>();
    for (const location of locations) {
      const anchor = getLocationAnchor(location);
      if (!anchor) continue;
      const pixel = map.latLngToContainerPoint(toLeafletPoint(anchor));
      const key = `${Math.floor(pixel.x / clusterCellSizePx)}:${Math.floor(pixel.y / clusterCellSizePx)}`;
      const existing = groups.get(key);
      if (existing) {
        existing.locations.push(location);
        existing.anchors.push(anchor);
      } else {
        groups.set(key, { locations: [location], anchors: [anchor] });
      }
    }
    return [...groups.values()];
  };

  const renderSpider = (locations: readonly MapLocation[]): void => {
    const anchors = locations.map(getLocationAnchor).filter(
      (anchor): anchor is MapPoint => Boolean(anchor)
    );
    if (anchors.length === 0) return;
    const center = {
      x: anchors.reduce((total, anchor) => total + anchor.x, 0) / anchors.length,
      y: anchors.reduce((total, anchor) => total + anchor.y, 0) / anchors.length
    };
    const centerLatLng = L.latLng(toLeafletPoint(center));
    const centerPixel = map.latLngToContainerPoint(centerLatLng);
    for (const [index, location] of locations.entries()) {
      const angle = index * spiderfyAngleStep;
      const radius = 28 + Math.sqrt(index) * 10;
      const point = L.point(
        centerPixel.x + Math.cos(angle) * radius,
        centerPixel.y + Math.sin(angle) * radius
      );
      const position = map.containerPointToLatLng(point);
      const leg = L.polyline([centerLatLng, position], {
        className: "map-location-spider-leg",
        interactive: false,
        weight: 1.5
      }).addTo(renderedLayer);
      spiderLegs.add(leg);
      createMarker(location, position);
    }
  };

  const renderVisibleMarkers = (
    forceLocationId?: string,
    focusedMarkerId = getFocusedMarkerId()
  ): void => {
    if (destroyed) return;
    const selectedLocation = selectedLocationId
      ? locationCatalog.get(selectedLocationId)
      : undefined;
    const forcedLocationId = forceLocationId ?? selectedLocation?.id;
    const spiderIds = new Set(
      map.getZoom() === map.getMaxZoom()
        ? spiderfiedLocationIds ?? []
        : []
    );
    const spiderLocations = [...spiderIds]
      .map((id) => locationCatalog.get(id))
      .filter((location): location is MapLocation => Boolean(location));
    clearRenderedMarkers();

    const candidates = visibleLocations(forcedLocationId).filter(
      ({ id }) => !spiderIds.has(id)
    );
    for (const cluster of groupLocations(candidates)) {
      if (cluster.locations.length === 1) createMarker(cluster.locations[0]!);
      else createClusterMarker(cluster);
    }
    if (spiderLocations.length > 0) renderSpider(spiderLocations);
    if (forcedLocationId && !markers.has(forcedLocationId)) {
      const forced = locationCatalog.get(forcedLocationId);
      if (forced) createMarker(forced);
    }
    updateMarkerSelection();

    if (focusedMarkerId) {
      const nextMarker = findMarkerButton(focusedMarkerId);
      if (nextMarker) nextMarker.focus({ preventScroll: true });
      else map.getContainer().focus({ preventScroll: true });
    }
  };

  const scheduleViewportRender = (): void => {
    if (destroyed) return;
    spiderfiedLocationIds = undefined;
    if (viewportRenderTimer !== undefined) clearTimeout(viewportRenderTimer);
    viewportRenderTimer = setTimeout(() => {
      viewportRenderTimer = undefined;
      renderVisibleMarkers();
    }, viewportRenderDebounceMs);
  };

  const selectLocation = (
    locationId?: string,
    options: LocationSelectionOptions = {}
  ) => {
    selectedLocationId = locationId;
    spiderfiedLocationIds = undefined;
    const location = locationId ? locationCatalog.get(locationId) : undefined;
    if (location && options.focus !== false) {
      fitLocationBounds(location);
      renderVisibleMarkers(location.id);
      updateMarkerSelection();
      findMarkerButton(location.id)?.focus({ preventScroll: true });
      return;
    }
    renderVisibleMarkers();
  };

  map.on("moveend", scheduleViewportRender);
  map.on("zoomend", scheduleViewportRender);

  return {
    setLocations(nextLocationValues) {
      const focusedMarkerId = getFocusedMarkerId();
      locationCatalog.clear();
      for (const location of [...nextLocationValues].sort((left, right) =>
        Number(left.category === "resource") - Number(right.category === "resource")
        || (left.id < right.id ? -1 : left.id > right.id ? 1 : 0)
      )) {
        if (!locationCatalog.has(location.id)) locationCatalog.set(location.id, location);
      }
      spiderfiedLocationIds = undefined;
      renderVisibleMarkers(undefined, focusedMarkerId);
    },
    selectLocation,
    setCategoryVisibility(categoryId, visible) {
      categoryVisibility.set(categoryId, visible);
      spiderfiedLocationIds = undefined;
      renderVisibleMarkers();
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      map.off("moveend", scheduleViewportRender);
      map.off("zoomend", scheduleViewportRender);
      if (viewportRenderTimer !== undefined) {
        clearTimeout(viewportRenderTimer);
        viewportRenderTimer = undefined;
      }
      clearRenderedMarkers();
      renderedLayer.removeFrom(map);
      locationCatalog.clear();
    }
  };
}

function getLocationAnchor(location: MapLocation): MapPoint | undefined {
  if (location.position) {
    return cellToMapPoint(location.position);
  }
  if (!location.bounds) {
    return undefined;
  }

  const bounds = cellBoundsToMapPointBounds(location.bounds);
  return {
    x: (bounds.min.x + bounds.max.x) / 2,
    y: (bounds.min.y + bounds.max.y) / 2
  };
}

function toLeafletPoint(point: MapPoint): L.LatLngTuple {
  return [point.y, point.x];
}

function toLeafletBounds(
  bounds: NonNullable<MapLocation["bounds"]>
): L.LatLngBoundsExpression {
  const points = cellBoundsToMapPointBounds(bounds);
  return [toLeafletPoint(points.min), toLeafletPoint(points.max)];
}

function markerButtonMarkup(location: MapLocation): string {
  const name = escapeHtml(location.name);
  const category = escapeHtml(location.category);
  const locationId = escapeHtml(location.id);

  return `<button class="map-location-marker" type="button"
    data-map-location-id="${locationId}" aria-pressed="false"
    aria-label="${mapLocationLabel}: ${name}">
    <span class="map-location-marker__icon" aria-hidden="true">
      <svg viewBox="0 0 24 30" focusable="false">
        <path d="M12 1.5c-5.8 0-10.5 4.6-10.5 10.3 0 7.4 9.1 16.1 9.5 16.5.6.5 1.4.5 2 0 .4-.4 9.5-9.1 9.5-16.5C22.5 6.1 17.8 1.5 12 1.5Z" />
        <circle cx="12" cy="11.8" r="4.1" />
      </svg>
    </span>
    <span class="location-card__marker" data-category="${category}"
      aria-hidden="true"></span>
    <span class="visually-hidden">${mapLocationLabel}: ${name}</span>
  </button>`;
}

function clusterButtonMarkup(count: number): string {
  const label = `${clusterActionLabel} ${count} locations`;
  return `<button class="map-location-cluster" type="button"
    data-map-location-cluster data-location-count="${count}"
    aria-label="${label}">
    <span aria-hidden="true">${count}</span>
  </button>`;
}

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      })[character]!
  );
}
