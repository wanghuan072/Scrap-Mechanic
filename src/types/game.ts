export type PlayerItem = {
  uuid: string;
  name: string;
  description: string;
  image: string | null;
};

export type RecipeIngredient = {
  uuid: string;
  name: string;
  quantity: number;
  image: string | null;
};

export type CraftingRecipe = {
  id: string;
  output: RecipeIngredient;
  ingredients: RecipeIngredient[];
  craftTime: number;
  schematic: boolean;
  stationSlug: string;
  stationName: string;
  group: string;
};

export type CraftingStation = {
  slug: string;
  name: string;
  description: string;
  recipeCount: number;
};

export type TraderOffer = {
  id: string;
  output: RecipeIngredient;
  ingredients: RecipeIngredient[];
  craftTime: number;
  schematic: boolean;
  venueSlug: string;
};

export type TradingVenue = {
  slug: string;
  name: string;
  currency: string;
  description: string;
  tradeCount: number;
};

export type SchematicUnlock = {
  offer: TraderOffer;
  recipes: CraftingRecipe[];
};

export type RecipeUnlockRoute =
  | "schematicbot"
  | "trader"
  | "quest"
  | "growlab"
  | "treasure"
  | "special"
  | "default"
  | "core";

export type RecipeUnlockCounts = {
  craftbotSawTableOutputs: number;
  schematicbot: number;
  dedicated: number;
  default: number;
  core: number;
  trader: number;
  traderQuest: number;
  storyQuest: number;
  quest: number;
  growlab: number;
  treasure: number;
  special: number;
  sawTableInSchematicbotPool: number;
};

export type RecipeCollection = {
  checkedVersion: string;
  recipeCount: number;
  stations: CraftingStation[];
  recipes: CraftingRecipe[];
};

export type TradeCollection = {
  checkedVersion: string;
  tradeCount: number;
  venues: TradingVenue[];
  trades: TraderOffer[];
};

export type ItemCollection = {
  checkedVersion: string;
  items: PlayerItem[];
};

export type RecipeUnlockCollection = {
  checkedVersion: string;
  counts: RecipeUnlockCounts;
  routeByOutput: Record<string, RecipeUnlockRoute>;
};

export type ObjectRatings = {
  durability?: number;
  density?: number;
  friction?: number;
  buoyancy?: number;
};

export type GameObjectDetails = {
  uuid: string;
  name: string;
  stackSize?: number;
  flammable?: boolean;
  physicsMaterial?: string;
  ratings?: ObjectRatings;
  box?: { x: number; y: number; z: number };
  cylinder?: { axis: string; depth: number; diameter: number };
  bounds?: { x?: number; y?: number; z?: number };
};

export type ObjectDetailCollection = {
  checkedVersion: string;
  objectCount: number;
  objects: GameObjectDetails[];
};
