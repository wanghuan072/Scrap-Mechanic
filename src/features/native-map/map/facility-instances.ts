import type { MapLocation, WorldMap } from "../domain/map-model";
import { classifyGeneratedPoi } from "./location-type-catalog";
import { createPoiMapInstances } from "./poi-instances";

// These types come from the versioned catalog. Coordinates always come from cells.
const facilityNames = new Map([
  ["POI_MECHANICSTATION_MEDIUM", "Mechanic Station"],
  ["POI_MECHANICSTATION_QUEST_MEDIUM", "Mechanic Station"],
  ["POI_CRASHSITE_AREA", "Crash Site Area"],
  ["POI_WAREHOUSE4_QUEST_LARGE", "Warehouse"],
  ["POI_BUNK_BURIAL_QUEST_MEDIUM", "Investigation Shelter"],
  ["POI_SERVICE_ELEVATOR", "Service Elevator"]
]);

const storyLocations = new Map<string, Pick<MapLocation, "id" | "name" | "category">>([
  ["POI_EXCAVATION", {
    id: "excavation-island",
    name: "Excavation Island Entrance",
    category: "quest"
  }],
  ["POI_MEADOW_GROWLAB_QUEST_LARGE", {
    id: "grow-lab-1",
    name: "Grow Lab 1",
    category: "quest"
  }],
  ["POI_DESERT_GROWLAB_CLIFFTOP_LARGE", {
    id: "grow-lab-2",
    name: "Grow Lab 2",
    category: "quest"
  }],
  ["POI_BURNTFOREST_GROWLAB_FROZEN_LARGE", {
    id: "grow-lab-3",
    name: "Grow Lab 3",
    category: "quest"
  }],
  ["POI_FOREST_GROWLAB_STATION_LARGE", {
    id: "grow-lab-4",
    name: "Grow Lab 4",
    category: "quest"
  }],
  ["POI_MEADOW_GROWLAB_SILODISTRICT_XL", {
    id: "grow-lab-5",
    name: "Grow Lab 5",
    category: "quest"
  }],
  ["POI_LAKE_GROWLAB_ISLAND_XL", {
    id: "grow-lab-6",
    name: "Grow Lab 6",
    category: "quest"
  }],
  ["POI_RUINCITY_XL", {
    id: "grow-lab-7",
    name: "Grow Lab 7",
    category: "quest"
  }],
  ["POI_BURNTFOREST_FARMBOTSCRAPYARD_LARGE", {
    id: "scrapyard",
    name: "Scrapyard",
    category: "poi"
  }]
]);

export function instantiateFacilities(
  world: WorldMap,
  definitions: readonly MapLocation[] = []
): MapLocation[] {
  const definitionsById = new Map(
    definitions.map((definition) => [definition.id, definition])
  );
  const pois = createPoiMapInstances(world.cells);
  const storyInstanceCounts = new Map<string, number>();
  for (const poi of pois) {
    const story = storyLocations.get(poi.poiType);
    if (story) {
      storyInstanceCounts.set(story.id, (storyInstanceCounts.get(story.id) ?? 0) + 1);
    }
  }
  return pois.flatMap((poi) => {
    const story = storyLocations.get(poi.poiType);
    if (story) {
      const definition = definitionsById.get(story.id);
      return [{
        ...(definition ?? story),
        id: storyInstanceCounts.get(story.id) === 1
          ? story.id
          : `${story.id}:${poi.id}`,
        name: definition?.name ?? story.name,
        category: definition?.category ?? story.category,
        precision: "save-exact" as const,
        position: { ...poi.center },
        questIds: definition?.questIds ?? [],
        resourceIds: definition?.resourceIds ?? [],
        enemyIds: definition?.enemyIds ?? []
      }];
    }
    const classification = classifyGeneratedPoi(poi.poiType);
    const name = facilityNames.get(poi.poiType) ?? classification?.label;
    if (!name) return [];
    return [{
      id: `facility:${poi.id}`,
      name: name === "Hideout" ? "Hideout / Trader" : name,
      category: classification?.typeId === "generated:builder-quest" ? "quest" : "poi",
      precision: "save-exact" as const,
      position: { ...poi.center },
      questIds: [], resourceIds: [], enemyIds: []
    }];
  });
}
