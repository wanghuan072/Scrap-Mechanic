import type {
  LocationProgressEvidence,
  MapLocation
} from "../domain/map-model";
import type { SaveProgress } from "../save/save-protocol";

export interface ProgressLocationJoin {
  readonly locations: MapLocation[];
  readonly locationIdsByProgressId: ReadonlyMap<string, readonly string[]>;
  readonly unmatchedProgressIds: readonly string[];
}

const evidenceRank: Record<LocationProgressEvidence["state"], number> = {
  unknown: 0,
  available: 1,
  visited: 2,
  completed: 3
};

const growLabAliases = new Map<string, readonly string[]>([
  ["137", ["grow-lab-1", "POI_MEADOW_GROWLAB_QUEST_LARGE"]],
  ["103", ["grow-lab-2", "POI_MEADOW_GROWLAB_SILODISTRICT_XL"]],
  ["507", ["grow-lab-3", "POI_BURNTFOREST_GROWLAB_FROZEN_LARGE"]],
  ["206", ["grow-lab-4", "POI_FOREST_GROWLAB_STATION_LARGE"]],
  ["803", ["grow-lab-5", "POI_LAKE_GROWLAB_ISLAND_XL"]],
  ["304", ["grow-lab-7", "POI_DESERT_GROWLAB_CLIFFTOP_LARGE"]]
]);

function normalized(value: string): string {
  return value.trim().toLocaleLowerCase("en");
}

function growLabRecordAliases(recordId: string): Set<string> {
  const aliases = growLabAliases.get(recordId) ?? [recordId];
  return new Set([recordId, ...aliases].map(normalized));
}

function locationMatchesGrowLab(location: MapLocation, aliases: ReadonlySet<string>): boolean {
  return aliases.has(normalized(location.id))
    || location.questIds.some((id) => aliases.has(normalized(id)));
}

function shouldReplace(
  current: LocationProgressEvidence | undefined,
  candidate: LocationProgressEvidence
): boolean {
  if (!current) return true;
  const rank = evidenceRank[candidate.state] - evidenceRank[current.state];
  if (rank !== 0) return rank > 0;
  if (candidate.source !== current.source) return candidate.source < current.source;
  return candidate.recordId.localeCompare(current.recordId, "en") < 0;
}

export function joinSaveProgress(
  locations: readonly MapLocation[],
  progress: SaveProgress
): ProgressLocationJoin {
  const evidenceByLocationId = new Map<string, LocationProgressEvidence>();
  const reverse = new Map<string, Set<string>>();
  const unmatched = new Set<string>();
  const recordMatch = (
    recordId: string,
    evidence: Omit<LocationProgressEvidence, "recordId">,
    predicate: (location: MapLocation) => boolean
  ): void => {
    const matches = locations.filter(predicate).map(({ id }) => id).sort((left, right) =>
      left.localeCompare(right, "en")
    );
    if (matches.length === 0) {
      unmatched.add(recordId);
      return;
    }
    const ids = reverse.get(recordId) ?? new Set<string>();
    for (const id of matches) {
      ids.add(id);
      const candidate: LocationProgressEvidence = { ...evidence, recordId };
      if (shouldReplace(evidenceByLocationId.get(id), candidate)) {
        evidenceByLocationId.set(id, candidate);
      }
    }
    reverse.set(recordId, ids);
  };

  for (const quest of progress.quests) {
    const state = quest.state === "completed"
      ? "completed"
      : quest.state === "tracked" ? "visited" : "available";
    recordMatch(
      quest.id,
      { state, source: "quest-manager" },
      (location) => location.questIds.includes(quest.id)
    );
  }
  for (const recordId of progress.completedGrowLabs) {
    const aliases = growLabRecordAliases(recordId);
    recordMatch(
      recordId,
      { state: "completed", source: "progression-manager" },
      (location) => locationMatchesGrowLab(location, aliases)
    );
  }

  return {
    locations: locations.map((location) => {
      const evidence = evidenceByLocationId.get(location.id);
      return evidence
        ? { ...location, progress: evidence.state, progressEvidence: evidence }
        : location;
    }),
    locationIdsByProgressId: new Map(
      [...reverse]
        .sort(([left], [right]) => left.localeCompare(right, "en"))
        .map(([id, locationIds]) => [id, [...locationIds].sort((left, right) =>
          left.localeCompare(right, "en")
        )])
    ),
    unmatchedProgressIds: [...unmatched].sort((left, right) => left.localeCompare(right, "en"))
  };
}
