import raidForecastJson from "@/data/tools/raid-forecast.json";
import type {
  RaidBotCounts,
  RaidBotId,
  RaidEnemyGroup,
  RaidForecastResult,
  RaidTimelineWave,
} from "@/types/tools";

export type {
  RaidBotCounts,
  RaidBotId,
  RaidEnemyGroup,
  RaidForecastResult,
  RaidTimelineWave,
} from "@/types/tools";

export const raidForecastSource = raidForecastJson.raidForecastSource;
export const raidBots = raidForecastJson.raidBots as Record<
  RaidBotId,
  { name: string; color: string; family: "Totebot" | "Haybot" | "Tapebot" | "Farmbot" }
>;
export const raidBotOrder = raidForecastJson.raidBotOrder as RaidBotId[];
const openingGroups = raidForecastJson.openingGroups as Record<number, RaidEnemyGroup[]>;
const reinforcementGroups = raidForecastJson.reinforcementGroups as Record<number, RaidEnemyGroup[]>;

function createRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function pickWeighted(groups: RaidEnemyGroup[], random: () => number) {
  const totalWeight = groups.reduce((total, group) => total + (group.weight ?? 1), 0);
  let target = random() * totalWeight;

  for (const group of groups) {
    target -= group.weight ?? 1;
    if (target <= 0) return group;
  }

  return groups[groups.length - 1];
}

function addBotCounts(target: RaidBotCounts, source: RaidBotCounts) {
  for (const id of raidBotOrder) {
    const count = source[id];
    if (count) target[id] = (target[id] ?? 0) + count;
  }
}

function rollOpeningGroup(level: number, random: () => number) {
  return pickWeighted(openingGroups[level], random);
}

function rollReinforcementGroups(level: number, budget: number, random: () => number) {
  const selected: RaidEnemyGroup[] = [];
  const pool = reinforcementGroups[level];
  let remaining = budget;

  while (true) {
    const affordable = pool.filter((group) => remaining >= Math.max(group.cost ?? 1, 1));
    if (affordable.length === 0) break;

    const group = pickWeighted(affordable, random);
    selected.push(group);
    remaining -= Math.max(group.cost ?? 1, 1);
  }

  return selected;
}

export function getOpeningRaidGroups(level: number) {
  return openingGroups[level] ?? [];
}

export function getMinimumReinforcementCost(level: number) {
  const costs = (reinforcementGroups[level] ?? []).map((group) => group.cost ?? 1);
  return costs.length > 0 ? Math.min(...costs) : undefined;
}

export function getRaidForecastSimulationCount(plantValue: number) {
  return plantValue > 10000 ? 1500 : 10000;
}

export function createRaidForecastSeed(plantValue: number, players: number, salt = 0) {
  return (
    Math.imul(plantValue + 1, 2654435761) ^
    Math.imul(players + 7, 2246822519) ^
    Math.imul(salt + 11, 3266489917)
  ) >>> 0;
}

export function simulateRaidForecast(
  level: number,
  budget: number,
  simulations: number,
  seed: number,
): RaidForecastResult {
  const random = createRandom(seed);
  const totals: RaidBotCounts = {};
  const maximums: RaidBotCounts = {};
  const appearances: RaidBotCounts = {};
  let allBotTotal = 0;
  let minimumTotal = Number.POSITIVE_INFINITY;
  let maximumTotal = 0;

  for (let run = 0; run < simulations; run += 1) {
    const raid: RaidBotCounts = {};
    addBotCounts(raid, rollOpeningGroup(level, random).list);

    for (const group of rollReinforcementGroups(level, budget, random)) {
      addBotCounts(raid, group.list);
    }

    let runTotal = 0;
    for (const id of raidBotOrder) {
      const count = raid[id] ?? 0;
      if (count <= 0) continue;
      totals[id] = (totals[id] ?? 0) + count;
      appearances[id] = (appearances[id] ?? 0) + 1;
      maximums[id] = Math.max(maximums[id] ?? 0, count);
      runTotal += count;
    }

    allBotTotal += runTotal;
    minimumTotal = Math.min(minimumTotal, runTotal);
    maximumTotal = Math.max(maximumTotal, runTotal);
  }

  return {
    simulations,
    rows: raidBotOrder
      .filter((id) => (totals[id] ?? 0) > 0)
      .map((id) => ({
        id,
        average: (totals[id] ?? 0) / simulations,
        chance: ((appearances[id] ?? 0) / simulations) * 100,
        maximum: maximums[id] ?? 0,
      })),
    averageTotal: allBotTotal / simulations,
    minimumTotal: Number.isFinite(minimumTotal) ? minimumTotal : 0,
    maximumTotal,
  };
}

export function createRaidTimeline(level: number, budget: number, seed: number) {
  const random = createRandom(seed);
  const opening = rollOpeningGroup(level, random);
  const waves = [opening, ...rollReinforcementGroups(level, budget, random)];
  let at = 12;

  return waves.map<RaidTimelineWave>((wave) => {
    const result = { at, bots: wave.list };
    at += wave.delay ?? 2;
    return result;
  });
}
