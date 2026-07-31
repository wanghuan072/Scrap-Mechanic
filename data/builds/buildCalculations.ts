import {
  getRecipeUnlockLabel,
  recipeCollection,
  type CraftingRecipe,
  type RecipeIngredient,
} from "@/data/game/playerData";
import type { BuildPart, BuildSpec } from "./specs";

export type BuildPartCost = {
  part: BuildPart;
  recipe?: CraftingRecipe;
  batches: number;
  craftSeconds: number;
  ingredients: Array<RecipeIngredient & { total: number }>;
  unlock: string;
};

export type DirectMaterialTotal = {
  uuid: string;
  name: string;
  quantity: number;
  image: string | null;
};

const stationPriority = new Map([
  ["craftbot", 0],
  ["mechanic-station", 1],
  ["workbench", 2],
]);

export function getPreferredRecipe(partName: string) {
  return recipeCollection.recipes
    .filter(
      (recipe) =>
        recipe.output.name.localeCompare(partName, undefined, {
          sensitivity: "accent",
        }) === 0,
    )
    .sort(
      (left, right) =>
        (stationPriority.get(left.stationSlug) ?? 10) -
          (stationPriority.get(right.stationSlug) ?? 10) ||
        left.craftTime - right.craftTime,
    )[0];
}

export function getBuildPartCosts(spec: BuildSpec): BuildPartCost[] {
  return spec.parts.map((part) => {
    const recipe = getPreferredRecipe(part.name);
    const batches = recipe
      ? Math.ceil(part.quantity / recipe.output.quantity)
      : 0;

    return {
      part,
      recipe,
      batches,
      craftSeconds: recipe ? recipe.craftTime * batches : 0,
      ingredients:
        recipe?.ingredients.map((ingredient) => ({
          ...ingredient,
          total: ingredient.quantity * batches,
        })) ?? [],
      unlock: recipe
        ? getRecipeUnlockLabel(recipe.output.uuid)
        : "Not listed at a crafting station",
    };
  });
}

export function getDirectMaterialTotals(
  partCosts: BuildPartCost[],
): DirectMaterialTotal[] {
  const totals = new Map<string, DirectMaterialTotal>();

  partCosts.forEach(({ ingredients }) => {
    ingredients.forEach((ingredient) => {
      const current = totals.get(ingredient.uuid);
      totals.set(ingredient.uuid, {
        uuid: ingredient.uuid,
        name: ingredient.name,
        image: ingredient.image,
        quantity: (current?.quantity ?? 0) + ingredient.total,
      });
    });
  });

  return [...totals.values()].sort(
    (left, right) =>
      right.quantity - left.quantity || left.name.localeCompare(right.name),
  );
}

export function formatCraftTime(seconds: number) {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return remainingSeconds ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
}
