"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import type { TraderOffer, TradingVenue } from "@/lib/game/player-data";
import styles from "@/style/page/wiki/trade-directory.module.css";

type TradeDirectoryProps = {
  trades: TraderOffer[];
  venues: TradingVenue[];
  wikiLinks: Record<string, string>;
};

type ResultFilter = "all" | "item" | "schematic";

function WikiName({
  name,
  wikiLinks,
}: {
  name: string;
  wikiLinks: Record<string, string>;
}) {
  const href = wikiLinks[name.toLowerCase()];
  return href ? (
    <Link href={href} prefetch={false}>
      {name}
    </Link>
  ) : (
    <>{name}</>
  );
}

export function TradeDirectory({
  trades,
  venues,
  wikiLinks,
}: TradeDirectoryProps) {
  const searchParams = useSearchParams();
  const requestedType = searchParams.get("type");
  const initialResult: ResultFilter =
    requestedType === "item" || requestedType === "schematic"
      ? requestedType
      : "all";
  const [venue, setVenue] = useState(venues[0]?.slug ?? "all");
  const [result, setResult] = useState<ResultFilter>(initialResult);
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  const visibleTrades = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return trades.filter((trade) => {
      if (venue !== "all" && trade.venueSlug !== venue) return false;
      if (result === "schematic" && !trade.schematic) return false;
      if (result === "item" && trade.schematic) return false;
      if (!normalized) return true;
      return [trade.output.name, ...trade.ingredients.map((item) => item.name)]
        .join(" ")
        .toLowerCase()
        .includes(normalized);
    });
  }, [query, result, trades, venue]);

  const currentVenue = venues.find((item) => item.slug === venue);
  const schematicCount = trades.filter((trade) => trade.schematic).length;

  return (
    <div className={styles.directory}>
      <div className={styles.venueRail}>
        <span>Choose a trader</span>
        <div>
          {venues.map((item) => (
            <button
              className={item.slug === venue ? styles.active : undefined}
              type="button"
              aria-pressed={item.slug === venue}
              onClick={() => setVenue(item.slug)}
              key={item.slug}
            >
              <strong>{item.name}</strong>
              <small>{item.tradeCount} offers</small>
            </button>
          ))}
          <button
            className={venue === "all" ? styles.active : undefined}
            type="button"
            aria-pressed={venue === "all"}
            onClick={() => setVenue("all")}
          >
            <strong>Both traders</strong>
            <small>{trades.length} offers</small>
          </button>
        </div>
        <span>Choose an outcome</span>
        <div className={styles.resultFilters}>
          <button
            className={result === "all" ? styles.active : undefined}
            type="button"
            aria-pressed={result === "all"}
            onClick={() => setResult("all")}
          >
            <strong>Every outcome</strong>
            <small>{trades.length} offers</small>
          </button>
          <button
            className={result === "item" ? styles.active : undefined}
            type="button"
            aria-pressed={result === "item"}
            onClick={() => setResult("item")}
          >
            <strong>Receive an item</strong>
            <small>{trades.length - schematicCount} offers</small>
          </button>
          <button
            className={result === "schematic" ? styles.active : undefined}
            type="button"
            aria-pressed={result === "schematic"}
            onClick={() => setResult("schematic")}
          >
            <strong>Unlock a recipe</strong>
            <small>{schematicCount} offers</small>
          </button>
        </div>
      </div>

      <div className={styles.tradeBoard}>
        <header>
          <div>
            <span>{currentVenue?.currency ?? "All available exchanges"}</span>
            <h2>{currentVenue?.name ?? "Every trader offer"}</h2>
            <p>
              {currentVenue?.description ??
                "Compare Farmers Hideout and Mining Hub prices in one list."}
            </p>
          </div>
          <label>
            <span>Find an offer</span>
            <input
              type="search"
              value={query}
              placeholder="Search reward or cost..."
              onChange={(event) => setQuery(event.currentTarget.value)}
            />
          </label>
        </header>

        <div className={styles.table}>
          <div className={styles.tableHead}>
            <span>Outcome</span>
            <span>Trade in</span>
            <span>Follow up</span>
          </div>
          {visibleTrades.map((trade) => {
            const venueName =
              venues.find((item) => item.slug === trade.venueSlug)?.name ?? "";
            const recipeHref = `/wiki/recipes?q=${encodeURIComponent(
              trade.output.name,
            )}&unlock=trader#recipe-directory`;
            const wikiHref = wikiLinks[trade.output.name.toLowerCase()];
            return (
              <article key={trade.id}>
                <div className={styles.reward}>
                  <span className={styles.icon}>
                    {trade.output.image ? (
                      <Image
                        src={trade.output.image}
                        alt=""
                        width={58}
                        height={58}
                      />
                    ) : (
                      <b aria-hidden="true">◇</b>
                    )}
                  </span>
                  <span>
                    <small>
                      {trade.schematic ? "Unlock recipe" : "Receive item"} ·{" "}
                      {venueName}
                    </small>
                    <strong>
                      {trade.output.quantity > 1 &&
                        `${trade.output.quantity.toLocaleString("en-US")}× `}
                      {trade.schematic ? (
                        <Link href={recipeHref} prefetch={false}>
                          {trade.output.name}
                        </Link>
                      ) : (
                        <WikiName name={trade.output.name} wikiLinks={wikiLinks} />
                      )}
                    </strong>
                  </span>
                </div>
                <ul className={styles.cost}>
                  {trade.ingredients.map((ingredient) => (
                    <li key={`${trade.id}-${ingredient.uuid}`}>
                      {ingredient.image && (
                        <Image src={ingredient.image} alt="" width={38} height={38} />
                      )}
                      <strong>{ingredient.quantity.toLocaleString("en-US")}×</strong>
                      <span>
                        <WikiName name={ingredient.name} wikiLinks={wikiLinks} />
                      </span>
                    </li>
                  ))}
                </ul>
                <div className={styles.unlock}>
                  {trade.schematic ? (
                    <Link href={recipeHref} prefetch={false}>
                      View recipe
                    </Link>
                  ) : wikiHref ? (
                    <Link href={wikiHref} prefetch={false}>
                      Open Wiki
                    </Link>
                  ) : (
                    <span>Finished item</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {!visibleTrades.length && (
          <div className={styles.empty}>
            <strong>No offer matches that search.</strong>
            <button type="button" onClick={() => setQuery("")}>
              Clear offer search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
