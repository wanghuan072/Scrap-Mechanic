import {
  maximumRaidPlantValue,
  raidCropValueThresholds,
  raidCrops,
  raidLevels,
} from "@/lib/data/raid-calculator";

export type CropCounts = Record<string, number>;

export function normalizeWholeNumber(
  value: number,
  minimum = 0,
  maximum = 9999,
) {
  if (!Number.isFinite(value)) return minimum;
  return Math.max(minimum, Math.min(maximum, Math.floor(value)));
}

export function getRaidLevel(plantValue: number) {
  if (plantValue <= 0) return undefined;
  if (plantValue > raidCropValueThresholds.at(-1)!) return raidLevels.at(-1);

  for (let index = raidCropValueThresholds.length - 1; index >= 0; index -= 1) {
    if (plantValue >= raidCropValueThresholds[index]) {
      return raidLevels[Math.min(index, raidLevels.length - 2)];
    }
  }

  return undefined;
}

export function getRaidLevelFraction(plantValue: number, level: number) {
  if (plantValue <= 0) return 0;
  if (plantValue >= maximumRaidPlantValue) return 1;

  const minimum = raidCropValueThresholds[level - 1];
  const maximum =
    level < raidLevels.length
      ? raidCropValueThresholds[level]
      : maximumRaidPlantValue;

  return Math.max(0, Math.min(1, (plantValue - minimum) / (maximum - minimum)));
}

export function calculateRaid(counts: CropCounts, players: number) {
  const plantValue = raidCrops.reduce(
    (total, crop) => total + (counts[crop.slug] ?? 0) * crop.value,
    0,
  );
  const level = getRaidLevel(plantValue);
  const playerModifier = Math.min(1 + (players - 1) * 0.5, 2);

  if (!level) {
    return {
      plantValue,
      level: undefined,
      playerModifier,
      budget: 0,
      fraction: 0,
      nextThreshold: 1,
    };
  }

  const fraction = getRaidLevelFraction(plantValue, level.level);
  const budget = Math.ceil(
    fraction * (level.budget.maximum - level.budget.minimum) +
      level.budget.minimum * playerModifier,
  );
  const nextLevel = raidLevels.find(
    (candidate) => candidate.minimumPlantValue > plantValue,
  );

  return {
    plantValue,
    level,
    playerModifier,
    budget,
    fraction,
    nextThreshold: nextLevel?.minimumPlantValue,
  };
}
