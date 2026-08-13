import { describe, expect, it } from "vitest";
import { buildSpecs } from "@/lib/data/builds";
import {
  formatCraftTime,
  getBuildPartCosts,
  getDirectMaterialTotals,
  getPreferredRecipe,
} from "@/lib/builds/calculations";

describe("build calculations", () => {
  it("prefers the Craftbot recipe for a Bearing", () => {
    expect(getPreferredRecipe("Bearing")?.stationSlug).toBe("craftbot");
  });

  it("aggregates direct material totals for a published build", () => {
    const costs = getBuildPartCosts(buildSpecs["starter-car"]);
    const totals = getDirectMaterialTotals(costs);
    expect(costs).toHaveLength(buildSpecs["starter-car"].parts.length);
    expect(totals.every((material) => material.quantity > 0)).toBe(true);
  });

  it("formats sub-minute and mixed craft times", () => {
    expect(formatCraftTime(45)).toBe("45s");
    expect(formatCraftTime(125)).toBe("2m 5s");
  });
});
