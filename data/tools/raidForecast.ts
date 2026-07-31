export type RaidBotId =
  | "tg"
  | "tb"
  | "tr"
  | "ty"
  | "hb"
  | "pg"
  | "py"
  | "pr"
  | "fb";

export type RaidBotCounts = Partial<Record<RaidBotId, number>>;

export type RaidEnemyGroup = {
  list: RaidBotCounts;
  cost?: number;
  weight?: number;
  delay?: number;
};

export type RaidForecastRow = {
  id: RaidBotId;
  average: number;
  chance: number;
  maximum: number;
};

export type RaidForecastResult = {
  simulations: number;
  rows: RaidForecastRow[];
  averageTotal: number;
  minimumTotal: number;
  maximumTotal: number;
};

export type RaidTimelineWave = {
  at: number;
  bots: RaidBotCounts;
};

export const raidForecastSource = {
  checkedVersion: "1.0.0.867",
  note: "Weighted enemy groups transcribed from the current Survival raid tables.",
};

export const raidBots: Record<
  RaidBotId,
  { name: string; color: string; family: "Totebot" | "Haybot" | "Tapebot" | "Farmbot" }
> = {
  tg: { name: "Totebot", color: "#78b34a", family: "Totebot" },
  tb: { name: "Totebot Blue", color: "#5a8fd6", family: "Totebot" },
  tr: { name: "Totebot Red", color: "#d6543f", family: "Totebot" },
  ty: { name: "Totebot Yellow", color: "#e0b23e", family: "Totebot" },
  hb: { name: "Haybot", color: "#c9973f", family: "Haybot" },
  pg: { name: "Tapebot Green", color: "#67a05a", family: "Tapebot" },
  py: { name: "Tapebot Yellow", color: "#d9c052", family: "Tapebot" },
  pr: { name: "Tapebot Red", color: "#cf4636", family: "Tapebot" },
  fb: { name: "Farmbot", color: "#b03030", family: "Farmbot" },
};

export const raidBotOrder: RaidBotId[] = ["tg", "tb", "tr", "ty", "hb", "pg", "py", "pr", "fb"];

const levelTwoToFourGroups: RaidEnemyGroup[] = [
  { list: { tg: 1, hb: 1 }, cost: 7, weight: 1 },
  { list: { tg: 1, hb: 1, tb: 1 }, cost: 12, weight: 10 },
  { list: { tg: 1, hb: 2, tb: 1 }, cost: 17, weight: 50 },
  { list: { tg: 2, hb: 3 }, cost: 19, weight: 100 },
];

const levelFiveToSevenGroups: RaidEnemyGroup[] = [
  { list: { tg: 1, hb: 1 }, cost: 7, weight: 1 },
  { list: { tg: 2, hb: 2 }, cost: 14, weight: 10 },
  { list: { tg: 3, hb: 3 }, cost: 21, weight: 100 },
  { list: { tg: 3, tb: 3 }, cost: 21, weight: 100 },
  { list: { tg: 3, ty: 2 }, cost: 36, weight: 100 },
  { list: { tg: 3, tr: 2 }, cost: 36, weight: 100 },
  { list: { tg: 3, pg: 3, py: 2 }, cost: 31, weight: 100 },
  { list: { tg: 3, pr: 2 }, cost: 56, weight: 80 },
  { list: { fb: 1 }, cost: 75, weight: 60, delay: 5 },
];

const openingGroups: Record<number, RaidEnemyGroup[]> = {
  1: [{ list: { hb: 1, tg: 2 } }],
  2: [{ list: { hb: 3, tg: 2 } }],
  3: [{ list: { hb: 3, tg: 2, tb: 1 }, delay: 2 }],
  4: [
    { list: { hb: 2, tb: 1, pg: 1, py: 1 }, delay: 2 },
    { list: { hb: 2, tg: 2, tb: 1, pg: 1 }, delay: 2 },
    { list: { tg: 2, tr: 1 }, delay: 2 },
  ],
  5: [{ list: { fb: 1 }, delay: 5 }],
  6: [{ list: { fb: 1 }, delay: 5 }],
  7: [{ list: { fb: 3 }, delay: 5 }],
};

const reinforcementGroups: Record<number, RaidEnemyGroup[]> = {
  1: [
    { list: { tg: 1 }, cost: 2, weight: 1 },
    { list: { tg: 2 }, cost: 4, weight: 10 },
    { list: { hb: 1 }, cost: 5, weight: 100 },
    { list: { tg: 2, hb: 1 }, cost: 9, weight: 100 },
    { list: { tg: 1, hb: 2 }, cost: 12, weight: 100 },
  ],
  2: levelTwoToFourGroups,
  3: [
    ...levelTwoToFourGroups,
    { list: { tg: 2, tr: 1 }, cost: 24, weight: 50 },
    { list: { tg: 3, pg: 1, py: 1 }, cost: 16, weight: 50 },
  ],
  4: [
    ...levelTwoToFourGroups,
    { list: { tg: 2, tr: 1 }, cost: 19, weight: 50 },
    { list: { tg: 2, ty: 1 }, cost: 19, weight: 50 },
    { list: { tg: 3, pg: 1, py: 1 }, cost: 16, weight: 50 },
    { list: { tg: 2, pg: 2, py: 1 }, cost: 19, weight: 50 },
  ],
  5: levelFiveToSevenGroups,
  6: levelFiveToSevenGroups,
  7: levelFiveToSevenGroups,
};

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
