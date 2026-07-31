"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type {
  SchematicUnlock,
  TradingVenue,
} from "@/data/game/playerData";
import styles from "./schematic-unlock-directory.module.css";

type SchematicUnlockDirectoryProps = {
  unlocks: SchematicUnlock[];
  venues: TradingVenue[];
};

export function SchematicUnlockDirectory({
  unlocks,
  venues,
}: SchematicUnlockDirectoryProps) {
  const [query, setQuery] = useState("");
  const [venue, setVenue] = useState("all");

  const visibleUnlocks = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return unlocks.filter(({ offer, recipes }) => {
      if (venue !== "all" && offer.venueSlug !== venue) return false;
      if (!normalized) return true;

      return [
        offer.output.name,
        ...offer.ingredients.map((ingredient) => ingredient.name),
        ...recipes.flatMap((recipe) => [
          recipe.stationName,
          ...recipe.ingredients.map((ingredient) => ingredient.name),
        ]),
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalized);
    });
  }, [query, unlocks, venue]);

  return (
    <section
      className={styles.directory}
      id="trader-schematic-offers"
      aria-labelledby="trader-schematic-heading"
    >
      <header className={styles.heading}>
        <div>
          <h2 id="trader-schematic-heading">Trader recipe offers</h2>
          <p>
            These 42 offers unlock the pictured recipe immediately. They do not
            use a Schematic Box or the Schematicbot.
          </p>
        </div>
        <div className={styles.resultCount}>
          <strong>{visibleUnlocks.length}</strong>
          <span>shown</span>
        </div>
      </header>

      <div className={styles.controls}>
        <label>
          <span>Find an unlock, cost, or ingredient</span>
          <input
            type="search"
            value={query}
            placeholder="Try Logic Gate, Wonk, glass..."
            onChange={(event) => setQuery(event.currentTarget.value)}
          />
        </label>
        <div className={styles.venueFilters} aria-label="Filter schematic unlocks by trader">
          <button
            className={venue === "all" ? styles.active : undefined}
            type="button"
            aria-pressed={venue === "all"}
            onClick={() => setVenue("all")}
          >
            All trading locations
            <small>{unlocks.length}</small>
          </button>
          {venues.map((item) => {
            const count = unlocks.filter(
              ({ offer }) => offer.venueSlug === item.slug,
            ).length;
            return (
              <button
                className={venue === item.slug ? styles.active : undefined}
                type="button"
                aria-pressed={venue === item.slug}
                onClick={() => setVenue(item.slug)}
                key={item.slug}
              >
                {item.name}
                <small>{count}</small>
              </button>
            );
          })}
        </div>
      </div>

      {visibleUnlocks.length ? (
        <div className={styles.list}>
          <div className={styles.listHead}>
            <span>Recipe unlocked</span>
            <span>Trader cost</span>
            <span>Craft after unlocking</span>
          </div>
          {visibleUnlocks.map(({ offer, recipes }) => {
            const venueName =
              venues.find((item) => item.slug === offer.venueSlug)?.name ?? "";
            const primaryRecipe = recipes[0];
            const recipeHref = `/wiki/recipes?q=${encodeURIComponent(
              offer.output.name,
            )}&unlock=trader#recipe-directory`;

            return (
              <article key={offer.id}>
                <div className={styles.output}>
                  <span className={styles.icon}>
                    {offer.output.image ? (
                      <Image
                        src={offer.output.image}
                        alt=""
                        width={58}
                        height={58}
                      />
                    ) : (
                      <b aria-hidden="true">◇</b>
                    )}
                  </span>
                  <div>
                    <small>{venueName}</small>
                    <h3>{offer.output.name}</h3>
                  </div>
                </div>

                <ul className={styles.cost}>
                  {offer.ingredients.map((ingredient) => (
                    <li key={`${offer.id}-${ingredient.uuid}`}>
                      {ingredient.image && (
                        <Image
                          src={ingredient.image}
                          alt=""
                          width={34}
                          height={34}
                        />
                      )}
                      <strong>{ingredient.quantity.toLocaleString("en-US")}×</strong>
                      <span>{ingredient.name}</span>
                    </li>
                  ))}
                </ul>

                <div className={styles.recipe}>
                  {primaryRecipe ? (
                    <>
                      <span>
                        {primaryRecipe.stationName} ·{" "}
                        {primaryRecipe.craftTime > 0
                          ? `${primaryRecipe.craftTime} seconds`
                          : "instant"}
                      </span>
                      <strong>
                        {primaryRecipe.ingredients.length} material
                        {primaryRecipe.ingredients.length === 1 ? "" : " types"} →{" "}
                        {primaryRecipe.output.quantity} output
                      </strong>
                      <Link href={recipeHref}>View exact recipe →</Link>
                    </>
                  ) : (
                    <span>Recipe record unavailable</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className={styles.empty}>
          <strong>No trader recipe offer matches those filters.</strong>
          <p>Search another output or material, or show all trading locations.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setVenue("all");
            }}
          >
            Show every trader offer
          </button>
        </div>
      )}
    </section>
  );
}
