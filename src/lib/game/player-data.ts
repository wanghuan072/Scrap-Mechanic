import itemsJson from "@/data/game/items.json";
import recipeUnlocksJson from "@/data/game/recipe-unlocks.json";
import recipesJson from "@/data/game/recipes.json";
import tradesJson from "@/data/game/trades.json";

import type {
  CraftingRecipe,
  ItemCollection,
  PlayerItem,
  RecipeCollection,
  RecipeUnlockCollection,
  RecipeUnlockRoute,
  SchematicUnlock,
  TradeCollection,
} from "@/types/game";

export type {
  CraftingRecipe,
  PlayerItem,
  RecipeIngredient,
  RecipeUnlockCounts,
  RecipeUnlockRoute,
  SchematicUnlock,
  TraderOffer,
  TradingVenue,
} from "@/types/game";

export const recipeCollection = recipesJson as RecipeCollection;
export const tradeCollection = tradesJson as TradeCollection;
export const playerItems = (itemsJson as ItemCollection).items;
export const recipeUnlockCollection =
  recipeUnlocksJson as RecipeUnlockCollection;

export const recipeUnlockRouteLabels: Record<RecipeUnlockRoute, string> = {
  schematicbot: "Schematicbot scan",
  trader: "Trader recipe offer",
  quest: "Quest or Farmer task",
  growlab: "Growlab reward",
  treasure: "Refined treasure",
  special: "Warehouse progression",
  default: "Available from the start",
  core: "Craftbot core set",
};

export function getRecipeUnlockRoute(
  outputUuid: string,
): RecipeUnlockRoute | undefined {
  return recipeUnlockCollection.routeByOutput[outputUuid];
}

export function getRecipeUnlockLabel(outputUuid: string) {
  const route = getRecipeUnlockRoute(outputUuid);
  return route
    ? recipeUnlockRouteLabels[route]
    : "Available with its crafting station";
}

export function getRecipeUnlockHref(outputUuid: string) {
  const route = getRecipeUnlockRoute(outputUuid);
  if (route === "schematicbot") return "/wiki/schematics/schematicbot";
  if (route === "trader") return "/wiki/schematics#trader-schematic-offers";
  if (route === "quest" || route === "special") return "/wiki/quests";
  if (route === "growlab") return "/wiki/quests#main-quests";
  if (route === "treasure") return "/wiki/resources";
  return undefined;
}

const recipesByOutputUuid = new Map<string, CraftingRecipe[]>();

recipeCollection.recipes.forEach((recipe) => {
  const matches = recipesByOutputUuid.get(recipe.output.uuid) ?? [];
  matches.push(recipe);
  recipesByOutputUuid.set(recipe.output.uuid, matches);
});

export const schematicUnlocks: SchematicUnlock[] = tradeCollection.trades
  .filter((offer) => offer.schematic)
  .map((offer) => ({
    offer,
    recipes: recipesByOutputUuid.get(offer.output.uuid) ?? [],
  }));

export const schematicOutputUuids = schematicUnlocks.map(
  ({ offer }) => offer.output.uuid,
);

const itemByName = new Map<string, PlayerItem>();

playerItems.forEach((item) => {
  const key = item.name.toLowerCase();
  const current = itemByName.get(key);
  if (!current) {
    itemByName.set(key, item);
    return;
  }
  if (item.image && !current.image) {
    itemByName.set(key, {
      ...item,
      description: item.description || current.description,
    });
    return;
  }
  if (!current.description && item.description) {
    itemByName.set(key, { ...current, description: item.description });
  }
});

const imageAliases: Record<string, string> = {
  spudgun: "spud gun",
  "mountable spudgun": "mountable spud gun",
  claygun: "clay gun",
  "plasma drill": "plasma drill level 1",
  "plasma saw": "plasma saw 1",
  "gas engine": "gas engine level 1",
  "electric engine": "electric engine level 1",
  thruster: "thruster level 1",
  controller: "controller level 1",
  piston: "piston level 1",
  sensor: "sensor level 1",
  "driver's seat": "driver's seat level 1",
};

export function getPlayerItem(name: string) {
  const normalized = name.toLowerCase();
  return itemByName.get(imageAliases[normalized] ?? normalized);
}

export function getPlayerItemImage(name: string) {
  return getPlayerItem(name)?.image ?? undefined;
}
