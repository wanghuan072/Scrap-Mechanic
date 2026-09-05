import type { ArticleEntry, DataTable } from "@/types/content";
import {
  maximumRaidPlantValue,
  raidCrops,
  raidLevels,
} from "@/lib/data/raid-calculator";
import { calculateRaid } from "@/lib/tools/raid-calculator";
import {
  getEligibleRaidBotIds,
  getOpeningRaidGroups,
  raidBotOrder,
  raidBots,
} from "@/lib/tools/raid-forecast";
import type { RaidBotCounts } from "@/types/tools";

function formatNumber(value: number) {
  return value.toLocaleString("en-US");
}

function formatBotCounts(list: RaidBotCounts) {
  return raidBotOrder
    .filter((id) => (list[id] ?? 0) > 0)
    .map((id) => `${list[id]}× ${raidBots[id].name}`)
    .join(", ");
}

export function formatRaidLevelRange(index: number) {
  const level = raidLevels[index];
  const nextLevel = raidLevels[index + 1];
  if (!level) return "";
  if (!nextLevel) return `${formatNumber(level.minimumPlantValue)}+`;
  return `${formatNumber(level.minimumPlantValue)}–${formatNumber(nextLevel.minimumPlantValue - 1)}`;
}

function createRaidCropValueTable(): DataTable {
  return {
    caption: "Scrap Mechanic 1.0 raid crop values",
    headers: ["Planted crop", "Raid value", "Raid-pressure effect"],
    rows: raidCrops.map((crop) => [
      crop.name,
      formatNumber(crop.value),
      crop.value === 0
        ? "Adds no raid pressure"
        : `Adds ${formatNumber(crop.value)} point${crop.value === 1 ? "" : "s"} while planted`,
    ]),
    note: "Cotton and Pigment Flower have a raid value of zero and cannot start a raid by themselves. Only planted crops count; harvested items and produce stored in containers do not add raid pressure.",
  };
}

function createRaidLevelTable(): DataTable {
  return {
    caption: "Scrap Mechanic raid level table",
    headers: [
      "Raid level",
      "Crop value band",
      "Configured 1-player budget",
      "Opening group",
      "Eligible reinforcement bots",
    ],
    rows: raidLevels.map((level, index) => {
      const openingGroups = getOpeningRaidGroups(level.level).map((group) =>
        formatBotCounts(group.list),
      );
      const openingText =
        openingGroups.length === 1
          ? openingGroups[0]
          : openingGroups
              .map((group, groupIndex) => `Option ${groupIndex + 1}: ${group}`)
              .join(" / ");
      const eligibleBots = getEligibleRaidBotIds(level.level)
        .map((id) => raidBots[id].name)
        .join(", ");

      return [
        level.level === 7 ? "Level 7 / Super Raid" : `Level ${level.level}`,
        formatRaidLevelRange(index),
        `${formatNumber(level.budget.minimum)}–${formatNumber(level.budget.maximum)}`,
        openingText,
        eligibleBots,
      ];
    }),
    note: `Level 1 starts at one positive crop-value point; zero means no active raid. Level 7 starts at 10,001, while raid-intensity interpolation stops increasing at ${formatNumber(maximumRaidPlantValue)}. Opening groups are added before the weighted reinforcement budget is spent.`,
  };
}

function createMultiplayerTable(): DataTable {
  const playerRows = [
    { label: "1", players: 1, effect: "Base minimum-budget term" },
    { label: "2", players: 2, effect: "+50% of the level minimum" },
    { label: "3", players: 3, effect: "2× cap reached" },
    { label: "4+", players: 4, effect: "No additional modifier increase" },
  ];

  return {
    caption: "Multiplayer raid budget modifier",
    headers: ["Players", "Minimum-budget multiplier", "Effect"],
    rows: playerRows.map(({ label, players, effect }) => [
      label,
      `${calculateRaid({}, players).playerModifier.toFixed(2)}×`,
      effect,
    ]),
    note: "The modifier applies to the level minimum term, not to the entire final budget.",
  };
}

export function createRaidLevelsGuideEntry(entry: ArticleEntry): ArticleEntry {
  return {
    ...entry,
    tables: [
      createRaidCropValueTable(),
      createRaidLevelTable(),
      createMultiplayerTable(),
      ...(entry.tables ?? []),
    ],
  };
}
