import { describe, expect, it } from "vitest";
import {
  createRaidForecastSeed,
  createRaidTimeline,
  getEligibleRaidBotIds,
  getReinforcementRaidGroups,
  raidBots,
  simulateRaidForecast,
} from "@/lib/tools/raid-forecast";

describe("raid forecast", () => {
  it("is deterministic for the same inputs", () => {
    const seed = createRaidForecastSeed(1000, 2);
    expect(simulateRaidForecast(5, 400, 250, seed)).toEqual(
      simulateRaidForecast(5, 400, 250, seed),
    );
  });

  it("creates a chronological timeline beginning at 12 seconds", () => {
    const timeline = createRaidTimeline(3, 100, 12345);
    expect(timeline.length).toBeGreaterThan(0);
    expect(timeline[0].at).toBe(12);
    expect(
      timeline.every(
        (wave, index) => index === 0 || wave.at >= timeline[index - 1].at,
      ),
    ).toBe(true);
  });

  it("derives eligible bot ids from the weighted groups", () => {
    expect(getEligibleRaidBotIds(1)).toEqual(["tg", "hb"]);
    expect(getEligibleRaidBotIds(7)).toEqual([
      "tg",
      "tb",
      "tr",
      "ty",
      "hb",
      "pg",
      "py",
      "pr",
      "fb",
    ]);
  });

  it("keeps the referenced Level 3 groups and Blue Tapebot label exact", () => {
    const groups = getReinforcementRaidGroups(3);
    expect(groups.find((group) => group.cost === 24)?.list).toEqual({
      tg: 1,
      tr: 1,
    });
    expect(groups.find((group) => group.cost === 16)?.list).toEqual({
      tg: 1,
      pg: 1,
      py: 1,
    });
    expect(raidBots.pr.name).toBe("Tapebot Blue");
  });
});
