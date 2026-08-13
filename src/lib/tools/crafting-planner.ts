import type { CraftingRecipe } from "@/types/game";

export function normalizeCraftQuantity(value: number) {
  if (!Number.isFinite(value)) return 1;
  return Math.max(1, Math.min(9999, Math.floor(value)));
}

export function calculateCraftingOrder(
  recipe: CraftingRecipe | undefined,
  quantity: number,
) {
  if (!recipe) {
    return { batches: 0, produced: 0, totalSeconds: 0 };
  }

  const batches = Math.ceil(quantity / Math.max(1, recipe.output.quantity));
  return {
    batches,
    produced: batches * recipe.output.quantity,
    totalSeconds: batches * recipe.craftTime,
  };
}
