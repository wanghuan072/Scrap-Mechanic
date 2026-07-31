"use client";

import { useMemo, useState } from "react";
import {
  createRaidForecastSeed,
  createRaidTimeline,
  getOpeningRaidGroups,
  getRaidForecastSimulationCount,
  raidBotOrder,
  raidBots,
  raidForecastSource,
  simulateRaidForecast,
  type RaidBotCounts,
} from "@/data/tools/raidForecast";
import styles from "./raid-calculator.module.css";

type RaidForecastProps = {
  plantValue: number;
  level: number;
  budget: number;
  players: number;
};

function BotLine({ bots }: { bots: RaidBotCounts }) {
  return (
    <div className={styles.botLine}>
      {raidBotOrder.map((id) => {
        const count = bots[id];
        if (!count) return null;

        return (
          <span key={id}>
            <i aria-hidden="true" style={{ backgroundColor: raidBots[id].color }} />
            <b>{count}×</b> {raidBots[id].name}
          </span>
        );
      })}
    </div>
  );
}

function formatAverage(value: number) {
  return value < 0.05 ? "<0.1" : value.toFixed(1);
}

function formatChance(value: number) {
  if (value > 99.5 && value < 100) return ">99%";
  return `${Math.round(value)}%`;
}

export function RaidForecast({ plantValue, level, budget, players }: RaidForecastProps) {
  const [sampleRevision, setSampleRevision] = useState(0);
  const [showFullTimeline, setShowFullTimeline] = useState(false);
  const simulations = getRaidForecastSimulationCount(plantValue);

  const forecast = useMemo(
    () =>
      simulateRaidForecast(
        level,
        budget,
        simulations,
        createRaidForecastSeed(plantValue, players),
      ),
    [budget, level, plantValue, players, simulations],
  );

  const timeline = useMemo(
    () =>
      createRaidTimeline(
        level,
        budget,
        createRaidForecastSeed(plantValue, players, sampleRevision + 1),
      ),
    [budget, level, plantValue, players, sampleRevision],
  );

  const openingGroups = getOpeningRaidGroups(level);
  const visibleTimeline = showFullTimeline ? timeline : timeline.slice(0, 6);

  return (
    <section className={styles.forecastPanel} aria-labelledby="raid-forecast-title">
      <header className={styles.forecastHeader}>
        <div>
          <span>04 / Simulated forecast</span>
          <h2 id="raid-forecast-title">Expected enemy force</h2>
          <p>
            The opening drop is added to budget-funded reinforcements. A live raid can
            roll differently from the averages below.
          </p>
        </div>
        <div className={styles.forecastMeta}>
          <strong>{simulations.toLocaleString("en-US")} simulations</strong>
          <small>{raidForecastSource.checkedVersion} group table</small>
        </div>
      </header>

      <dl className={styles.forecastSummary}>
        <div>
          <dt>Expected whole raid</dt>
          <dd>{forecast.averageTotal.toFixed(1)} bots</dd>
        </div>
        <div>
          <dt>Observed range</dt>
          <dd>
            {forecast.minimumTotal.toLocaleString("en-US")}–
            {forecast.maximumTotal.toLocaleString("en-US")} bots
          </dd>
        </div>
        <div>
          <dt>Simulation runs</dt>
          <dd>{forecast.simulations.toLocaleString("en-US")}</dd>
        </div>
        <div>
          <dt>Players</dt>
          <dd>{players}</dd>
        </div>
      </dl>

      <div className={styles.forecastGrid}>
        <section className={styles.openingPool}>
          <div className={styles.forecastSectionTitle}>
            <span>Opening drop</span>
            <b>
              {openingGroups.length === 1
                ? "Guaranteed group"
                : `1 of ${openingGroups.length} equal options`}
            </b>
          </div>
          <div className={styles.openingOptions}>
            {openingGroups.map((group, index) => (
              <article key={`${level}-${index}`}>
                <small>Option {String(index + 1).padStart(2, "0")}</small>
                <BotLine bots={group.list} />
              </article>
            ))}
          </div>
          <p>
            One opening group arrives before the reinforcement budget is spent.
          </p>
        </section>

        <section className={styles.expectedPanel}>
          <div className={styles.forecastSectionTitle}>
            <span>Whole-raid enemy mix</span>
            <b>Opening + reinforcements</b>
          </div>
          <div className={styles.forecastTableWrap}>
            <table>
              <colgroup>
                <col className={styles.botColumn} />
                <col className={styles.averageColumn} />
                <col className={styles.chanceColumn} />
                <col className={styles.maximumColumn} />
              </colgroup>
              <thead>
                <tr>
                  <th>Bot</th>
                  <th>Average per raid</th>
                  <th>Appearance chance</th>
                  <th>Max seen</th>
                </tr>
              </thead>
              <tbody>
                {forecast.rows.map((row) => (
                  <tr key={row.id}>
                    <th scope="row">
                      <i
                        aria-hidden="true"
                        style={{ backgroundColor: raidBots[row.id].color }}
                      />
                      {raidBots[row.id].name}
                    </th>
                    <td>{formatAverage(row.average)}</td>
                    <td>{formatChance(row.chance)}</td>
                    <td>{row.maximum.toLocaleString("en-US")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <details className={styles.timelineDetails}>
        <summary>
          <span>Sample dispatch timeline</span>
          <b>
            Sample {String(sampleRevision + 1).padStart(2, "0")} · {timeline.length} drops
          </b>
          <i>View</i>
        </summary>
        <div className={styles.timelinePanel} aria-live="polite">
          <div className={styles.timelineActions}>
            <small>One possible weighted result</small>
            <button
              type="button"
              onClick={() => {
                setSampleRevision((current) => current + 1);
                setShowFullTimeline(false);
              }}
            >
              Reroll sample
            </button>
          </div>

          <ol className={styles.timeline}>
            {visibleTimeline.map((wave, index) => (
              <li key={`${sampleRevision}-${index}-${wave.at}`}>
                <time>T+{wave.at}s</time>
                <BotLine bots={wave.bots} />
              </li>
            ))}
          </ol>

          {timeline.length > 6 ? (
            <button
              className={styles.timelineToggle}
              type="button"
              onClick={() => setShowFullTimeline((current) => !current)}
            >
              {showFullTimeline ? "Show first 6 drops" : `Show all ${timeline.length} drops`}
            </button>
          ) : null}
        </div>
      </details>
    </section>
  );
}
