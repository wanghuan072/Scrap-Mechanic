import * as L from "leaflet";
import { icon as renderIcon, type IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faCampground,
  faHammer,
  faLandmark,
  faLocationDot,
  faRoad,
  faTriangleExclamation,
  faWarehouse
} from "@fortawesome/free-solid-svg-icons";
import { cellToMapPoint, type MapPoint } from "./coordinate-system";
import type { LocationNameInstance } from "./location-name-inventory";

const expandedLabelZoom = -1;
const overviewIconZoom = -4;
const viewportPaddingRatio = 0.25;
const clusterCellSizePx = {
  expanded: 64,
  compact: 80,
  overview: 112
} as const;
const spiderfyAngleStep = Math.PI * (3 - Math.sqrt(5));

interface LocationIcon {
  imageUrl?: string;
  vectorIcon?: IconDefinition;
  typeLabel: string;
}

const locationIcons: Readonly<Record<string, LocationIcon>> = {
  "fixed:pigment-flower": {
    imageUrl: "/map-assets/game-icons/locations/pigment-flower.png",
    typeLabel: "Pigment Flower"
  },
  "fixed:oil-geyser": {
    imageUrl: "/map-assets/game-icons/locations/oil-geyser.png",
    typeLabel: "Oil Geyser"
  },
  "fixed:epic-legendary-loot-crate": {
    imageUrl: "/map-assets/game-icons/locations/epic-loot-crate.png",
    typeLabel: "Epic/Legendary Loot Crate"
  },
  "fixed:standard-loot-crate": {
    imageUrl: "/map-assets/game-icons/locations/standard-loot-crate.png",
    typeLabel: "Standard Loot Crate"
  },
  "fixed:stone-node": {
    imageUrl: "/map-assets/game-icons/locations/stone-node.png",
    typeLabel: "Stone Node"
  },
  "fixed:wild-beehive": {
    imageUrl: "/map-assets/game-icons/locations/wild-beehive.png",
    typeLabel: "Wild Beehive"
  },
  "fixed:wild-corn": {
    imageUrl: "/map-assets/game-icons/locations/wild-corn.png",
    typeLabel: "Wild Corn"
  },
  "fixed:wild-cotton": {
    imageUrl: "/map-assets/game-icons/locations/wild-cotton.png",
    typeLabel: "Wild Cotton"
  },
  "fixed:mechanic-station": {
    imageUrl: "/map-assets/game-icons/locations/mechanic-station.png",
    typeLabel: "Mechanic Station"
  },
  "generated:builder-quest": {
    vectorIcon: faHammer,
    typeLabel: "Builder Quest Locations"
  },
  "generated:camps-ruins": {
    vectorIcon: faCampground,
    typeLabel: "Camps & Ruins"
  },
  "generated:major": {
    vectorIcon: faLandmark,
    typeLabel: "Major Generated Locations"
  },
  "generated:resource-hazard": {
    vectorIcon: faTriangleExclamation,
    typeLabel: "Resource & Hazard"
  },
  "generated:road": {
    vectorIcon: faRoad,
    typeLabel: "Road Locations"
  },
  "generated:warehouse": {
    vectorIcon: faWarehouse,
    typeLabel: "Warehouse"
  }
};

interface PositionedName {
  key: string;
  instance: LocationNameInstance;
  point: MapPoint;
}

interface NameCluster {
  instances: PositionedName[];
  points: MapPoint[];
}

export interface PoiLabelLayer {
  setLocationNames(
    instances: readonly LocationNameInstance[],
    selectedTypeIds: readonly string[]
  ): void;
  setVisible(visible: boolean): void;
  destroy(): void;
}

export function createPoiLabelLayer(map: L.Map): PoiLabelLayer {
  const layer = L.layerGroup();
  const interactiveMarkers = new Set<L.Marker>();
  let visible = false;
  let instances: readonly LocationNameInstance[] = [];
  let selectedTypeIds = new Set<string>();
  let spiderfiedKeys: readonly string[] | undefined;

  const clearRendered = (): void => {
    for (const marker of interactiveMarkers) marker.off();
    interactiveMarkers.clear();
    layer.clearLayers();
  };

  const displayMode = (): "expanded" | "overview" | "compact" => {
    const zoom = map.getZoom();
    return zoom >= expandedLabelZoom
      ? "expanded"
      : zoom <= overviewIconZoom
        ? "overview"
        : "compact";
  };

  const createNameMarker = (
    positioned: PositionedName,
    position: L.LatLngExpression = toLeafletPoint(positioned.point)
  ): void => {
    const { instance } = positioned;
    const label = escapeHtml(instance.label);
    const gameArtClass = locationIcons[instance.typeId]?.imageUrl
      ? " poi-place-marker--game-art"
      : "";
    const marker = L.marker(position, {
      icon: L.divIcon({
        className: "poi-place-label-icon",
        html: `<span class="poi-place-marker poi-place-marker--${displayMode()}${gameArtClass}" role="img" aria-label="${label}"><span class="poi-place-glyph" aria-hidden="true">${locationIconMarkup(instance.typeId, "poi-place-art")}</span><span class="poi-place-label">${label}</span></span>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      }),
      interactive: true,
      keyboard: true,
      title: instance.label,
      alt: instance.label,
      riseOnHover: true
    }).addTo(layer);
    interactiveMarkers.add(marker);
  };

  const clusterCenter = (cluster: NameCluster): MapPoint => ({
    x: cluster.points.reduce((total, point) => total + point.x, 0)
      / cluster.points.length,
    y: cluster.points.reduce((total, point) => total + point.y, 0)
      / cluster.points.length
  });

  const createClusterMarker = (cluster: NameCluster): void => {
    const center = clusterCenter(cluster);
    const count = cluster.instances.length;
    const typeId = cluster.instances[0]!.instance.typeId;
    const typeLabel = locationIcons[typeId]?.typeLabel
      ?? cluster.instances[0]!.instance.label;
    const mode = displayMode();
    const marker = L.marker(toLeafletPoint(center), {
      icon: L.divIcon({
        className: "map-location-cluster-icon poi-label-cluster-icon",
        html: clusterMarkup(count, typeId, typeLabel, mode),
        iconSize: [48, 48],
        iconAnchor: [24, 24]
      }),
      interactive: true,
      keyboard: false,
      title: `${count} ${typeLabel} locations`
    });
    marker.on("click", () => {
      if (map.getZoom() < map.getMaxZoom()) {
        spiderfiedKeys = undefined;
        map.setView(
          toLeafletPoint(center),
          Math.min(map.getZoom() + 1, map.getMaxZoom()),
          { animate: false }
        );
        return;
      }
      spiderfiedKeys = cluster.instances.map(({ key }) => key);
      render();
    });
    marker.addTo(layer);
    interactiveMarkers.add(marker);
  };

  const selectedVisibleInstances = (): PositionedName[] => {
    const rendered = new Set<string>();
    const viewport = map.getBounds().pad(viewportPaddingRatio);
    const result: PositionedName[] = [];
    for (const instance of instances) {
      if (!selectedTypeIds.has(instance.typeId)) continue;
      const point = cellToMapPoint(instance.position);
      const duplicateKey = `${instance.label}\u0000${point.x}\u0000${point.y}`;
      if (rendered.has(duplicateKey)) continue;
      rendered.add(duplicateKey);
      if (!viewport.contains(toLeafletPoint(point))) continue;
      result.push({
        key: `${instance.id}\u0000${duplicateKey}`,
        instance,
        point
      });
    }
    return result;
  };

  const groupInstances = (values: readonly PositionedName[]): NameCluster[] => {
    const groups = new Map<string, NameCluster>();
    const cellSize = clusterCellSizePx[displayMode()];
    for (const positioned of values) {
      const pixel = map.latLngToContainerPoint(toLeafletPoint(positioned.point));
      const key = `${positioned.instance.typeId}:${Math.floor(pixel.x / cellSize)}:${Math.floor(pixel.y / cellSize)}`;
      const existing = groups.get(key);
      if (existing) {
        existing.instances.push(positioned);
        existing.points.push(positioned.point);
      } else {
        groups.set(key, { instances: [positioned], points: [positioned.point] });
      }
    }
    return [...groups.values()];
  };

  const renderSpider = (values: readonly PositionedName[]): void => {
    if (values.length === 0) return;
    const center = {
      x: values.reduce((total, value) => total + value.point.x, 0) / values.length,
      y: values.reduce((total, value) => total + value.point.y, 0) / values.length
    };
    const centerLatLng = L.latLng(toLeafletPoint(center));
    const centerPixel = map.latLngToContainerPoint(centerLatLng);
    for (const [index, positioned] of values.entries()) {
      const angle = index * spiderfyAngleStep;
      const radius = 28 + Math.sqrt(index) * 10;
      const pixel = L.point(
        centerPixel.x + Math.cos(angle) * radius,
        centerPixel.y + Math.sin(angle) * radius
      );
      const position = map.containerPointToLatLng(pixel);
      L.polyline([centerLatLng, position], {
        className: "map-location-spider-leg",
        interactive: false,
        weight: 1.5
      }).addTo(layer);
      createNameMarker(positioned, position);
    }
  };

  function render(): void {
    clearRendered();
    if (!visible) return;
    const selected = selectedVisibleInstances();
    const byKey = new Map(selected.map((value) => [value.key, value]));
    const spiderKeys = new Set(
      map.getZoom() === map.getMaxZoom() ? spiderfiedKeys ?? [] : []
    );
    const spiderValues = [...spiderKeys]
      .map((key) => byKey.get(key))
      .filter((value): value is PositionedName => Boolean(value));
    const clusteredValues = selected.filter(({ key }) => !spiderKeys.has(key));

    for (const cluster of groupInstances(clusteredValues)) {
      if (cluster.instances.length === 1) createNameMarker(cluster.instances[0]!);
      else createClusterMarker(cluster);
    }
    renderSpider(spiderValues);
  }

  function handleViewportEnd(): void {
    spiderfiedKeys = undefined;
    render();
  }

  map.on("moveend", handleViewportEnd);
  map.on("zoomend", handleViewportEnd);

  return {
    setLocationNames(nextInstances, nextSelectedTypeIds) {
      instances = [...nextInstances];
      selectedTypeIds = new Set(nextSelectedTypeIds);
      spiderfiedKeys = undefined;
      render();
    },
    setVisible(nextVisible) {
      if (visible === nextVisible) return;
      visible = nextVisible;
      spiderfiedKeys = undefined;
      if (visible) {
        layer.addTo(map);
        render();
      } else {
        clearRendered();
        layer.removeFrom(map);
      }
    },
    destroy() {
      map.off("moveend", handleViewportEnd);
      map.off("zoomend", handleViewportEnd);
      clearRendered();
      if (map.hasLayer(layer)) layer.removeFrom(map);
    }
  };
}

function toLeafletPoint(point: MapPoint): L.LatLngTuple {
  return [point.y, point.x];
}

function clusterMarkup(
  count: number,
  typeId: string,
  typeLabel: string,
  mode: "expanded" | "overview" | "compact"
): string {
  const label = `Zoom into ${count} ${typeLabel} locations`;
  const gameArtClass = locationIcons[typeId]?.imageUrl
    ? " map-location-cluster--game-art"
    : "";
  return `<button class="map-location-cluster map-location-cluster--${mode} poi-label-cluster${gameArtClass}" type="button"
    data-poi-label-cluster data-location-count="${count}"
    data-location-type="${escapeHtml(typeId)}" aria-label="${escapeHtml(label)}">
    <span class="map-location-cluster__glyph" aria-hidden="true">${locationIconMarkup(typeId, "map-location-cluster__art")}</span>
    <span class="map-location-cluster__count" aria-hidden="true">${count}</span>
  </button>`;
}

function locationIconMarkup(typeId: string, imageClass = ""): string {
  const locationIcon = locationIcons[typeId];
  if (locationIcon?.imageUrl) {
    return `<img class="${imageClass}" src="${locationIcon.imageUrl}" alt="" draggable="false">`;
  }
  return renderIcon(locationIcon?.vectorIcon ?? fallbackLocationIcon()).html.join("");
}

function fallbackLocationIcon(): IconDefinition {
  return faLocationDot;
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
