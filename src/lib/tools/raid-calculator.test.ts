import { describe, expect, it } from "vitest";
import {
  calculateRaid,
  getRaidLevel,
  getRaidLevelFraction,
  normalizeWholeNumber,
} from "@/lib/tools/raid-calculator";
import { raidCrops } from "@/lib/data/raid-calculator";

describe("raid calculator", () => {
  it.each([
    [0, undefined],
    [1, 1],
    [49, 1],
    [50, 2],
    [100, 3],
    [550, 4],
    [1000, 5],
    [5500, 6],
    [10000, 6],
    [10001, 7],
  ])("maps plant value %i to raid level %s", (plantValue, expectedLevel) => {
    expect(getRaidLevel(plantValue)?.level).toBe(expectedLevel);
  });

  it("calculates crop value, multiplayer modifier, and next threshold", () => {
    const result = calculateRaid({ pineapple: 1, tomato: 1 }, 3);
    expect(result.plantValue).toBe(1001);
    expect(result.level?.level).toBe(5);
    expect(result.playerModifier).toBe(2);
    expect(result.nextThreshold).toBe(5500);
    expect(result.budget).toBeGreaterThanOrEqual(result.level!.budget.minimum);
  });

  it("clamps whole-number inputs and level progress", () => {
    expect(normalizeWholeNumber(Number.NaN, 1, 4)).toBe(1);
    expect(normalizeWholeNumber(7.9, 1, 4)).toBe(4);
    expect(getRaidLevelFraction(0, 1)).toBe(0);
    expect(getRaidLevelFraction(100000, 7)).toBe(1);
  });

  it("includes all twelve referenced crops and keeps zero-value crops raid-safe", () => {
    expect(raidCrops).toHaveLength(12);
    expect(
      raidCrops
        .filter((crop) => crop.value === 0)
        .map((crop) => crop.name),
    ).toEqual(["Cotton", "Pigment Flower"]);
    expect(calculateRaid({ cotton: 50, "pigment-flower": 50 }, 1).level).toBeUndefined();
  });
});
