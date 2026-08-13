"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  raidCrops,
} from "@/lib/data/raid-calculator";
import {
  calculateRaid,
  normalizeWholeNumber,
  type CropCounts,
} from "@/lib/tools/raid-calculator";
import { RaidForecast } from "./RaidForecast";
import styles from "@/style/page/tools/raid-calculator.module.css";

export function RaidCalculator() {
  const [counts, setCounts] = useState<CropCounts>({});
  const [players, setPlayers] = useState(1);

  const result = useMemo(() => calculateRaid(counts, players), [counts, players]);

  const activeCrops = useMemo(
    () =>
      raidCrops
        .map((crop) => {
          const count = counts[crop.slug] ?? 0;
          return {
            ...crop,
            count,
            contribution: count * crop.value,
          };
        })
        .filter((crop) => crop.count > 0)
        .sort((left, right) => right.contribution - left.contribution),
    [counts],
  );

  const totalPlants = activeCrops.reduce((total, crop) => total + crop.count, 0);

  function setCropCount(slug: string, value: number) {
    const normalized = normalizeWholeNumber(value);
    setCounts((current) => {
      if (normalized === 0) {
        const next = { ...current };
        delete next[slug];
        return next;
      }
      return { ...current, [slug]: normalized };
    });
  }

  function changeCropCount(slug: string, amount: number) {
    setCropCount(slug, (counts[slug] ?? 0) + amount);
  }

  function resetCalculator() {
    setCounts({});
    setPlayers(1);
  }

  function loadBoundaryPreset(preset: "first" | "level-six-cap" | "super") {
    setPlayers(1);
    if (preset === "first") {
      setCounts({ tomato: 1 });
      return;
    }
    if (preset === "level-six-cap") {
      setCounts({ pineapple: 10 });
      return;
    }
    setCounts({ pineapple: 10, tomato: 1 });
  }

  return (
    <div className={`${styles.calculator} notranslate`} translate="no">
      <section className={styles.inputPanel}>
        <header className={styles.panelHeader}>
          <div>
            <span>01 / Planting cluster</span>
            <h2>Count the crops in one raid area</h2>
            <p>Enter whole planted crop counts. Harvested items and stored food do not count.</p>
          </div>
          <button type="button" onClick={resetCalculator}>
            Reset
          </button>
        </header>

        <div className={styles.cropGrid}>
          {raidCrops.map((crop) => {
            const count = counts[crop.slug] ?? 0;
            return (
              <article className={count > 0 ? styles.cropActive : undefined} key={crop.slug}>
                <label htmlFor={`raid-crop-${crop.slug}`}>
                  <span className={styles.cropImage}>
                    <Image src={crop.image} alt="" width={52} height={52} />
                  </span>
                  <span>
                    <strong>{crop.name}</strong>
                    <small>Value {crop.value.toLocaleString("en-US")}</small>
                  </span>
                </label>
                <div className={styles.stepper}>
                  <button
                    type="button"
                    aria-label={`Remove one ${crop.name}`}
                    disabled={count === 0}
                    onClick={() => changeCropCount(crop.slug, -1)}
                  >
                    −
                  </button>
                  <input
                    id={`raid-crop-${crop.slug}`}
                    type="number"
                    inputMode="numeric"
                    min="0"
                    max="9999"
                    step="1"
                    value={count}
                    aria-label={`${crop.name} plant count`}
                    onChange={(event) =>
                      setCropCount(crop.slug, Number(event.currentTarget.value))
                    }
                  />
                  <button
                    type="button"
                    aria-label={`Add one ${crop.name}`}
                    onClick={() => changeCropCount(crop.slug, 1)}
                  >
                    +
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <div className={styles.presets}>
          <div>
            <span>Boundary presets</span>
            <p>Load exact one-player inputs to verify the calculator&apos;s edge rules.</p>
          </div>
          <div>
            <button type="button" onClick={() => loadBoundaryPreset("first")}>
              1 Tomato / L1
            </button>
            <button type="button" onClick={() => loadBoundaryPreset("level-six-cap")}>
              10 Pineapples / 10,000
            </button>
            <button type="button" onClick={() => loadBoundaryPreset("super")}>
              +1 Tomato / 10,001
            </button>
          </div>
        </div>

        <div className={styles.playerControl}>
          <div>
            <span>02 / Multiplayer scaling</span>
            <h3>Players counted by the raid</h3>
            <p>
              Each extra player adds 50% of the level minimum budget. The modifier
              reaches its ×2 cap at three players.
            </p>
          </div>
          <label>
            <span>Players</span>
            <select
              value={players}
              onChange={(event) =>
                setPlayers(normalizeWholeNumber(Number(event.target.value), 1, 4))
              }
            >
              <option value="1">1 player</option>
              <option value="2">2 players</option>
              <option value="3">3 players</option>
              <option value="4">4 players</option>
            </select>
          </label>
        </div>
      </section>

      <aside className={styles.resultPanel} aria-live="polite">
        <header>
          <div>
            <span>03 / Raid result</span>
            <h2>Exact raid result</h2>
            <p>Farm value, level, reinforcement budget, and the next threshold.</p>
          </div>
          <strong>
            {result.level
              ? result.level.level === 7
                ? "SUPER RAID"
                : `LEVEL ${result.level.level}`
              : "NO ACTIVE RAID"}
          </strong>
        </header>

        {result.level ? (
          <>
            <dl className={styles.resultMetrics}>
              <div>
                <dt>Plant value</dt>
                <dd>{result.plantValue.toLocaleString("en-US")} pts</dd>
              </div>
              <div>
                <dt>Reinforcement budget</dt>
                <dd>{result.budget.toLocaleString("en-US")} pts</dd>
              </div>
              <div>
                <dt>Planted crops</dt>
                <dd>{totalPlants.toLocaleString("en-US")}</dd>
              </div>
              <div>
                <dt>Crop types</dt>
                <dd>{activeCrops.length}</dd>
              </div>
              <div>
                <dt>Player modifier</dt>
                <dd>×{result.playerModifier.toFixed(1)}</dd>
              </div>
              <div>
                <dt>Next level</dt>
                <dd>
                  {result.nextThreshold
                    ? `${(result.nextThreshold - result.plantValue).toLocaleString("en-US")} pts`
                    : "MAX"}
                </dd>
              </div>
            </dl>

            <div className={styles.raidContext}>
              <div className={styles.contribution}>
                <span>Crop contribution</span>
                <ul>
                  {activeCrops.map((crop) => (
                    <li key={crop.slug}>
                      <span>
                        {crop.count.toLocaleString("en-US")}× {crop.name}
                      </span>
                      <b>{crop.contribution.toLocaleString("en-US")} pts</b>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.levelProgress}>
                <div>
                  <span>Level progress</span>
                  <strong>{Math.round(result.fraction * 100)}%</strong>
                </div>
                <div className={styles.levelProgressTrack} aria-hidden="true">
                  <i style={{ width: `${Math.max(2, result.fraction * 100)}%` }} />
                </div>
                <p>
                  {result.nextThreshold
                    ? `${(result.nextThreshold - result.plantValue).toLocaleString("en-US")} pts to Level ${result.level.level + 1}.`
                    : "Super active; more value raises the reinforcement budget."}
                </p>
              </div>
            </div>

          </>
        ) : (
          <div className={styles.emptyResult}>
            <span aria-hidden="true">!</span>
            <h3>No crops entered</h3>
            <p>
              In Scrap Mechanic 1.0, even one crop with a positive value starts raid
              pressure. Add a crop to calculate the level and bot budget.
            </p>
          </div>
        )}
      </aside>

      {result.level ? (
        <RaidForecast
          plantValue={result.plantValue}
          level={result.level.level}
          budget={result.budget}
          players={players}
        />
      ) : null}
    </div>
  );
}
