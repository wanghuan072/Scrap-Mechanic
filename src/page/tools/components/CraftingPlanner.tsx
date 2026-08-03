"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type {
  CraftingRecipe,
  RecipeUnlockRoute,
} from "@/lib/game/player-data";
import styles from "@/style/page/tools/crafting-planner.module.css";

type CraftingPlannerProps = {
  recipes: CraftingRecipe[];
  unlockRoutes: Record<string, RecipeUnlockRoute>;
};

const unlockLabels: Record<RecipeUnlockRoute, string> = {
  schematicbot: "Schematicbot scan",
  trader: "Trader recipe offer",
  quest: "Quest or Farmer task",
  growlab: "Growlab reward",
  treasure: "Refined treasure",
  special: "Warehouse progression",
  default: "Available from the start",
  core: "Craftbot core set",
};

function normalizeQuantity(value: number) {
  if (!Number.isFinite(value)) return 1;
  return Math.max(1, Math.min(9999, Math.floor(value)));
}

export function CraftingPlanner({
  recipes,
  unlockRoutes,
}: CraftingPlannerProps) {
  const stations = useMemo(
    () =>
      [...new Map(
        recipes.map((recipe) => [
          recipe.stationSlug,
          { slug: recipe.stationSlug, name: recipe.stationName },
        ]),
      ).values()].sort((left, right) => left.name.localeCompare(right.name)),
    [recipes],
  );

  const outputs = useMemo(() => {
    const byUuid = new Map<string, CraftingRecipe>();
    recipes.forEach((recipe) => {
      if (!byUuid.has(recipe.output.uuid)) byUuid.set(recipe.output.uuid, recipe);
    });
    return [...byUuid.values()].sort((left, right) =>
      left.output.name.localeCompare(right.output.name),
    );
  }, [recipes]);

  const [query, setQuery] = useState("Bearing");
  const [stationFilter, setStationFilter] = useState("all");
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | undefined>(
    () =>
      outputs.find((recipe) => recipe.output.name === "Bearing")?.id ??
      outputs[0]?.id,
  );
  const [quantity, setQuantity] = useState(10);

  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const stationOutputs =
      stationFilter === "all"
        ? outputs
        : [
            ...new Map(
              recipes
                .filter((recipe) => recipe.stationSlug === stationFilter)
                .map((recipe) => [recipe.output.uuid, recipe]),
            ).values(),
          ].sort((left, right) => left.output.name.localeCompare(right.output.name));
    if (!normalized) return stationOutputs.slice(0, 10);
    return stationOutputs
      .filter((recipe) => recipe.output.name.toLowerCase().includes(normalized))
      .slice(0, 10);
  }, [outputs, query, recipes, stationFilter]);

  const recipe =
    recipes.find((option) => option.id === selectedRecipeId) ?? outputs[0];
  const selectedUuid = recipe?.output.uuid;
  const recipeOptions = recipes.filter(
    (option) => option.output.uuid === selectedUuid,
  );
  const batches = recipe
    ? Math.ceil(quantity / Math.max(1, recipe.output.quantity))
    : 0;
  const produced = recipe ? batches * recipe.output.quantity : 0;
  const totalSeconds = recipe ? batches * recipe.craftTime : 0;
  const craftableUuids = useMemo(
    () => new Set(recipes.map((item) => item.output.uuid)),
    [recipes],
  );

  function selectRecipe(nextRecipe: CraftingRecipe) {
    const stationRecipe =
      stationFilter === "all"
        ? nextRecipe
        : recipes.find(
            (option) =>
              option.output.uuid === nextRecipe.output.uuid &&
              option.stationSlug === stationFilter,
          ) ?? nextRecipe;
    setSelectedRecipeId(stationRecipe.id);
    setQuery(nextRecipe.output.name);
  }

  function changeStationFilter(nextStation: string) {
    setStationFilter(nextStation);
    if (nextStation === "all") return;

    const currentOutputAtStation = recipes.find(
      (option) =>
        option.output.uuid === selectedUuid && option.stationSlug === nextStation,
    );
    const nextRecipe =
      currentOutputAtStation ??
      recipes.find((option) => option.stationSlug === nextStation);
    if (nextRecipe) {
      setSelectedRecipeId(nextRecipe.id);
      setQuery(nextRecipe.output.name);
    }
  }

  return (
    <div className={`${styles.planner} notranslate`} translate="no">
      <section className={styles.orderPanel}>
        <header>
          <span>01 / Choose the finished item</span>
          <h2>Workshop order</h2>
          <p>Search by the item name shown in the crafting menu.</p>
        </header>

        <div className={styles.databaseFacts}>
          <span>
            <b>{recipes.length}</b> recipes
          </span>
          <span>
            <b>{outputs.length}</b> outputs
          </span>
          <span>
            <b>{stations.length}</b> stations
          </span>
        </div>

        <label className={styles.stationFilter}>
          <span>Filter by crafting station</span>
          <select
            value={stationFilter}
            onChange={(event) => changeStationFilter(event.currentTarget.value)}
          >
            <option value="all">All stations</option>
            {stations.map((station) => (
              <option value={station.slug} key={station.slug}>
                {station.name}
              </option>
            ))}
          </select>
        </label>

        <div className={styles.search}>
          <label htmlFor="planner-item-search">Item name</label>
          <input
            id="planner-item-search"
            type="search"
            value={query}
            autoComplete="off"
            onChange={(event) => setQuery(event.currentTarget.value)}
          />
          <div className={styles.matchList} aria-label="Matching craftable items">
            {matches.map((match) => (
              <button
                className={
                  match.output.uuid === selectedUuid ? styles.selected : undefined
                }
                type="button"
                aria-pressed={match.output.uuid === selectedUuid}
                onClick={() => selectRecipe(match)}
                key={match.output.uuid}
              >
                {match.output.image && (
                  <Image src={match.output.image} alt="" width={40} height={40} />
                )}
                <span>{match.output.name}</span>
                <small>{match.stationName}</small>
              </button>
            ))}
            {matches.length === 0 ? (
              <p className={styles.noMatches}>
                No recipe output matches this name and station filter.
              </p>
            ) : null}
          </div>
        </div>

        <div
          className={styles.recipeOptionSlot}
          hidden={recipeOptions.length <= 1}
        >
          <label className={styles.recipeOption}>
            <span>Recipe option</span>
            <select
              value={recipe?.id ?? ""}
              onChange={(event) => setSelectedRecipeId(event.currentTarget.value)}
            >
              {recipeOptions.map((option) => (
                <option value={option.id} key={option.id}>
                  {option.stationName} / {option.group} — {option.output.quantity} per
                  batch
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className={styles.quantity}>
          <span>How many do you need?</span>
          <input
            type="number"
            min="1"
            max="9999"
            step="1"
            value={quantity}
            onChange={(event) =>
              setQuantity(normalizeQuantity(Number(event.currentTarget.value)))
            }
          />
        </label>
      </section>

      <section className={styles.resultPanel} aria-live="polite">
        {recipe ? (
          <>
            <header>
              <span>02 / Take this to {recipe.stationName}</span>
              <div className={styles.resultTitle}>
                {recipe.output.image && (
                  <Image src={recipe.output.image} alt="" width={88} height={88} />
                )}
                <div>
                  <h3>{recipe.output.name}</h3>
                  <p>
                    {batches.toLocaleString("en-US")} batch
                    {batches === 1 ? "" : "es"} makes{" "}
                    {produced.toLocaleString("en-US")}
                    {produced > quantity
                      ? `, leaving ${produced - quantity} extra`
                      : ""}.
                  </p>
                </div>
              </div>
            </header>

            <dl className={styles.metrics}>
              <div>
                <dt>Station</dt>
                <dd>{recipe.stationName}</dd>
              </div>
              <div>
                <dt>Recipe group</dt>
                <dd>{recipe.group}</dd>
              </div>
              <div>
                <dt>Batch size</dt>
                <dd>{recipe.output.quantity}</dd>
              </div>
              <div>
                <dt>Batches required</dt>
                <dd>{batches.toLocaleString("en-US")}</dd>
              </div>
              <div>
                <dt>Total time</dt>
                <dd>
                  {totalSeconds > 0
                    ? `${Math.floor(totalSeconds / 60)}m ${totalSeconds % 60}s`
                    : "Immediate"}
                </dd>
              </div>
              <div>
                <dt>Unlock</dt>
                <dd>
                  {unlockLabels[unlockRoutes[recipe.output.uuid]] ??
                    "Available with its crafting station"}
                </dd>
              </div>
            </dl>

            <div className={styles.materials}>
              <span>03 / Bring these materials</span>
              <ul>
                {recipe.ingredients.map((ingredient) => (
                  <li key={ingredient.uuid}>
                    <div>
                      {ingredient.image ? (
                        <Image
                          src={ingredient.image}
                          alt=""
                          width={56}
                          height={56}
                        />
                      ) : (
                        <span className={styles.fallbackIcon} aria-hidden="true">
                          ◇
                        </span>
                      )}
                    </div>
                    <strong>
                      {(ingredient.quantity * batches).toLocaleString("en-US")}×
                    </strong>
                    <span>{ingredient.name}</span>
                    <small>
                      {craftableUuids.has(ingredient.uuid)
                        ? "Can be crafted"
                        : "Gather, loot, or trade"}
                    </small>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <div className={styles.empty}>
            <strong>Choose a craftable item.</strong>
            <p>The material order will appear here.</p>
          </div>
        )}
      </section>
    </div>
  );
}
