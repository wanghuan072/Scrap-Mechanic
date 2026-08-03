"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import type {
  CraftingRecipe,
  RecipeUnlockRoute,
} from "@/lib/game/player-data";
import type { CraftingStation } from "@/types/game";
import styles from "@/style/page/wiki/recipe-directory.module.css";

type RecipeDirectoryProps = {
  recipes: CraftingRecipe[];
  stations: CraftingStation[];
  wikiLinks: Record<string, string>;
  unlockRoutes: Record<string, RecipeUnlockRoute>;
};

const pageSize = 48;
type UnlockFilter =
  | "all"
  | "base"
  | "schematicbot"
  | "trader"
  | "quest"
  | "growlab"
  | "treasure"
  | "special";

const unlockOptions: { value: UnlockFilter; label: string }[] = [
  { value: "all", label: "All routes" },
  { value: "schematicbot", label: "Schematicbot" },
  { value: "trader", label: "Trader" },
  { value: "quest", label: "Quests & tasks" },
  { value: "growlab", label: "Growlabs" },
  { value: "treasure", label: "Refined treasure" },
  { value: "special", label: "Warehouse" },
  { value: "base", label: "Base / core" },
];

const routeLabels: Record<RecipeUnlockRoute | "station", string> = {
  schematicbot: "Scan a part or Schematic Box",
  trader: "Buy the listed trader recipe offer",
  quest: "Complete its quest or Farmer task",
  growlab: "Claim the matching Growlab reward",
  treasure: "Refine the matching treasure",
  special: "Complete Warehouse progression",
  default: "Available from the start",
  core: "Craftbot core recipe",
  station: "Available with its crafting station",
};

function ItemName({
  name,
  wikiLinks,
}: {
  name: string;
  wikiLinks: Record<string, string>;
}) {
  const href = wikiLinks[name.toLowerCase()];
  return href ? <Link href={href}>{name}</Link> : <>{name}</>;
}

export function RecipeDirectory({
  recipes,
  stations,
  wikiLinks,
  unlockRoutes,
}: RecipeDirectoryProps) {
  const searchParams = useSearchParams();
  const requestedUnlock = searchParams.get("unlock");
  const initialUnlock: UnlockFilter = unlockOptions.some(
    (option) => option.value === requestedUnlock,
  )
    ? (requestedUnlock as UnlockFilter)
    : "all";
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [station, setStation] = useState("all");
  const [unlock, setUnlock] = useState<UnlockFilter>(initialUnlock);
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const routeCounts = useMemo(
    () =>
      recipes.reduce<Record<UnlockFilter, number>>(
        (counts, recipe) => {
          const route = unlockRoutes[recipe.output.uuid];
          const group =
            !route || route === "default" || route === "core" ? "base" : route;
          counts[group] += 1;
          counts.all += 1;
          return counts;
        },
        {
          all: 0,
          base: 0,
          schematicbot: 0,
          trader: 0,
          quest: 0,
          growlab: 0,
          treasure: 0,
          special: 0,
        },
      ),
    [recipes, unlockRoutes],
  );

  const filteredRecipes = useMemo(() => {
    const terms = query
      .toLowerCase()
      .split(/\s+/)
      .map((term) => term.trim())
      .filter(Boolean);

    return recipes.filter((recipe) => {
      if (station !== "all" && recipe.stationSlug !== station) return false;
      const route = unlockRoutes[recipe.output.uuid];
      const routeGroup =
        !route || route === "default" || route === "core" ? "base" : route;
      if (unlock !== "all" && unlock !== routeGroup) return false;
      if (!terms.length) return true;

      const searchable = [
        recipe.output.name,
        recipe.stationName,
        recipe.group,
        ...recipe.ingredients.map((ingredient) => ingredient.name),
      ]
        .join(" ")
        .toLowerCase();
      return terms.every((term) => searchable.includes(term));
    });
  }, [query, recipes, station, unlock, unlockRoutes]);

  const visibleRecipes = filteredRecipes.slice(0, visibleCount);

  function chooseStation(nextStation: string) {
    setStation(nextStation);
    setVisibleCount(pageSize);
  }

  return (
    <div className={styles.directory}>
      <div className={styles.controls}>
        <div className={styles.searchField}>
          <label htmlFor="recipe-search">Find an item or ingredient</label>
          <input
            id="recipe-search"
            type="search"
            value={query}
            placeholder="Try Component Kit, bearing, pizza..."
            onChange={(event) => {
              setQuery(event.currentTarget.value);
              setVisibleCount(pageSize);
            }}
          />
          <span>{filteredRecipes.length.toLocaleString("en-US")} matches</span>
        </div>

        <div className={styles.unlockFilters} aria-label="Filter by unlock route">
          <span>Unlock route</span>
          <div>
            {unlockOptions.map((option) => (
              <button
                className={unlock === option.value ? styles.active : undefined}
                type="button"
                aria-pressed={unlock === option.value}
                onClick={() => {
                  setUnlock(option.value);
                  setVisibleCount(pageSize);
                }}
                key={option.value}
              >
                {option.label}
                <small>{routeCounts[option.value]}</small>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.stationFilters} aria-label="Filter by crafting station">
          <button
            className={station === "all" ? styles.active : undefined}
            type="button"
            aria-pressed={station === "all"}
            onClick={() => chooseStation("all")}
          >
            <strong>All stations</strong>
            <small>{recipes.length}</small>
          </button>
          {stations.map((item) => (
            <button
              className={station === item.slug ? styles.active : undefined}
              type="button"
              aria-pressed={station === item.slug}
              onClick={() => chooseStation(item.slug)}
              key={item.slug}
            >
              <strong>{item.name}</strong>
              <small>{item.recipeCount}</small>
            </button>
          ))}
        </div>
      </div>

      {visibleRecipes.length ? (
        <>
          <div className={styles.recipeList}>
            {visibleRecipes.map((recipe, index) => {
              const route = unlockRoutes[recipe.output.uuid];
              return (
              <article className={styles.recipe} key={recipe.id}>
                <span className={styles.recipeNumber}>
                  {String(index + 1).padStart(3, "0")}
                </span>
                <div className={styles.outputIcon}>
                  {recipe.output.image ? (
                    <Image
                      src={recipe.output.image}
                      alt=""
                      width={72}
                      height={72}
                    />
                  ) : (
                    <span aria-hidden="true">◇</span>
                  )}
                </div>
                <div className={styles.output}>
                  <span>
                    {recipe.stationName} / {recipe.group}
                  </span>
                  <h3>
                    <ItemName name={recipe.output.name} wikiLinks={wikiLinks} />
                  </h3>
                  <p>
                    Makes <strong>{recipe.output.quantity}</strong>
                    {recipe.craftTime > 0 && (
                      <>
                        {" "}
                        in <strong>{recipe.craftTime} seconds</strong>
                      </>
                    )}
                    .
                  </p>
                  <small
                    className={styles.routeState}
                    data-route={route ?? "station"}
                  >
                    {routeLabels[route ?? "station"]}
                  </small>
                </div>
                <div className={styles.ingredients}>
                  <span>Required</span>
                  <ul>
                    {recipe.ingredients.map((ingredient) => (
                      <li key={`${recipe.id}-${ingredient.uuid}`}>
                        {ingredient.image && (
                          <Image src={ingredient.image} alt="" width={32} height={32} />
                        )}
                        <strong>{ingredient.quantity.toLocaleString("en-US")}×</strong>
                        <ItemName name={ingredient.name} wikiLinks={wikiLinks} />
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
              );
            })}
          </div>

          {visibleCount < filteredRecipes.length && (
            <button
              className={styles.loadMore}
              type="button"
              onClick={() => setVisibleCount((current) => current + pageSize)}
            >
              Show {Math.min(pageSize, filteredRecipes.length - visibleCount)} more
              recipes
            </button>
          )}
        </>
      ) : (
        <div className={styles.emptyState}>
          <strong>No recipe matches those filters.</strong>
          <p>Try an ingredient name, choose another station, or clear the search.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              chooseStation("all");
            }}
          >
            Clear recipe filters
          </button>
        </div>
      )}
    </div>
  );
}
