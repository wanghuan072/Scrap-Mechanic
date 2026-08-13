import { describe, expect, it } from "vitest";
import type { CraftingRecipe } from "@/types/game";
import {
  calculateCraftingOrder,
  normalizeCraftQuantity,
} from "@/lib/tools/crafting-planner";

const recipe: CraftingRecipe = {
  id: "test-recipe",
  output: { uuid: "output", name: "Test output", quantity: 4, image: null },
  ingredients: [],
  craftTime: 7,
  schematic: false,
  stationSlug: "craftbot",
  stationName: "Craftbot",
  group: "Test",
};

describe("crafting planner", () => {
  it("rounds up batches and reports extra output", () => {
    expect(calculateCraftingOrder(recipe, 10)).toEqual({
      batches: 3,
      produced: 12,
      totalSeconds: 21,
    });
  });

  it("handles a missing recipe and clamps requested quantities", () => {
    expect(calculateCraftingOrder(undefined, 10)).toEqual({
      batches: 0,
      produced: 0,
      totalSeconds: 0,
    });
    expect(normalizeCraftQuantity(Number.NaN)).toBe(1);
    expect(normalizeCraftQuantity(10000)).toBe(9999);
  });
});
