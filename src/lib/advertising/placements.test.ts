import { describe, expect, it } from "vitest";
import { chooseAdBoundaries, MIN_CONTENT_GAP } from "./placements";

describe("advertisement content spacing", () => {
  it("does not add middle advertisements on short pages", () => {
    expect(chooseAdBoundaries(1100, [400, 700], false)).toEqual([]);
  });
  it("selects one complete boundary near the middle of medium pages", () => {
    expect(chooseAdBoundaries(1800, [600, 850, 1000, 1400], false)).toEqual([850]);
  });
  it("selects long-page thirds and preserves endpoint gaps", () => {
    expect(chooseAdBoundaries(3600, [900, 1200, 1800, 2400, 2800], false)).toEqual([1200, 2400]);
  });
  it("keeps home advertisements between four and six when content permits", () => {
    const points = chooseAdBoundaries(4400, [700, 900, 1600, 1800, 2400, 2600, 3300, 3500], true);
    expect(points.length + 2).toBeGreaterThanOrEqual(4);
    expect(points.length + 2).toBeLessThanOrEqual(6);
    const sequence = [0, ...points, 4400];
    for (let index = 1; index < sequence.length; index++) expect(sequence[index] - sequence[index - 1]).toBeGreaterThanOrEqual(MIN_CONTENT_GAP);
  });
  it("does not invent empty spacing when complete boundaries are unavailable", () => {
    expect(chooseAdBoundaries(2500, [300, 500, 2200], true)).toEqual([]);
  });
  it("rejects duplicate and unsafe boundaries", () => {
    expect(chooseAdBoundaries(1800, [850, 850, -100, 2000], false)).toEqual([850]);
  });
});
