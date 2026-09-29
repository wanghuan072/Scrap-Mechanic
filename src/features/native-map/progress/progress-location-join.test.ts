import { expect, it } from "vitest";
import type { MapLocation } from "../domain/map-model";
import type { SaveProgress } from "../save/save-protocol";
import { joinSaveProgress } from "./progress-location-join";

function location(id: string, questIds: string[], extra: Partial<MapLocation> = {}): MapLocation {
  return {
    id,
    name: id,
    category: "quest",
    precision: "exact",
    position: { x: 4, y: 5 },
    questIds,
    resourceIds: ["component-kit"],
    enemyIds: ["haybot"],
    ...extra
  };
}

function progress(overrides: Partial<SaveProgress> = {}): SaveProgress {
  return {
    quests: [], completedGrowLabs: [], seedTier: 1, vaultTotal: 0,
    warehouseConsoleUnlocked: false, hasCraftedBeacon: false,
    reachedUndergroundDepths: [], collectedLogIds: [], warnings: [],
    ...overrides
  };
}

it("joins quest IDs to every known location with stable precedence and reverse indexes", () => {
  const locations = [
    location("beta", ["quest_shared", "quest_done"]),
    location("alpha", ["quest_shared"]),
    location("available", ["quest_active"], { progress: "unknown" })
  ];
  const joined = joinSaveProgress(locations, progress({ quests: [
    { id: "quest_shared", state: "tracked" },
    { id: "quest_active", state: "active" },
    { id: "quest_done", state: "completed" }
  ] }));

  expect(joined.locations.find(({ id }) => id === "beta")).toMatchObject({
    position: { x: 4, y: 5 }, resourceIds: ["component-kit"], enemyIds: ["haybot"],
    progress: "completed",
    progressEvidence: { state: "completed", source: "quest-manager", recordId: "quest_done" }
  });
  expect(joined.locations.find(({ id }) => id === "alpha")?.progress).toBe("visited");
  expect(joined.locations.find(({ id }) => id === "available")?.progress).toBe("available");
  expect(joined.locationIdsByProgressId.get("quest_shared")).toEqual(["alpha", "beta"]);
  expect(joined.unmatchedProgressIds).toEqual([]);
});

it("maps reviewed Grow Lab POI values to canonical location metadata", () => {
  const joined = joinSaveProgress([
    location("grow-lab-1", ["grow-lab-1"]),
    location("grow-lab-2", ["grow-lab-2"]),
    location("growlab-poi", ["POI_FOREST_GROWLAB_STATION_LARGE"])
  ], progress({ completedGrowLabs: ["137", "103", "POI_FOREST_GROWLAB_STATION_LARGE"] }));

  expect(joined.locations.map(({ id, progress: state }) => [id, state])).toEqual([
    ["grow-lab-1", "completed"],
    ["grow-lab-2", "completed"],
    ["growlab-poi", "completed"]
  ]);
  expect(joined.locations[0]?.progressEvidence).toEqual({
    state: "completed", source: "progression-manager", recordId: "137"
  });
});

it("does not infer completion from unknown quests or unrelated progress fields", () => {
  const untouched = location("mechanic-station", ["quest_known"]);
  const joined = joinSaveProgress([untouched], progress({
    quests: [{ id: "quest_unknown", state: "completed" }],
    completedGrowLabs: ["999"],
    reachedUndergroundDepths: [1, 3, 8],
    collectedLogIds: ["log-known"],
    scannerbot: { x: 1, y: 2, mode: "hunt" }
  }));

  expect(joined.locations[0]).toBe(untouched);
  expect(joined.locations[0]).not.toHaveProperty("progressEvidence");
  expect(joined.unmatchedProgressIds).toEqual(["999", "quest_unknown"]);
});

it("returns no personal evidence when progress records are absent", () => {
  const original = location("plain", []);
  const joined = joinSaveProgress([original], progress());
  expect(joined.locations).toEqual([original]);
  expect(joined.locationIdsByProgressId.size).toBe(0);
  expect(joined.unmatchedProgressIds).toEqual([]);
});
