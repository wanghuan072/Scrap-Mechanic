import { describe, expect, it } from "vitest";
import {
  createRaidForecastSeed,
  createRaidTimeline,
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
    expect(timeline.every((wave, index) => index === 0 || wave.at >= timeline[index - 1].at)).toBe(
      true,
    );
  });
});
