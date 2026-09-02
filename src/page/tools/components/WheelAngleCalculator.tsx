"use client";

import { useMemo, useState } from "react";
import {
  calculateAckermannGeometry,
  calculateWheelAngles,
  formatAngle,
  formatBearingSettings,
  formatNumber,
  MAX_STEERING_ANGLE_DEG,
  validateWheelAngleInput,
  type WheelAngleResult,
} from "@/lib/tools/wheel-angle-calculator";
import { calculateWheelAngleDiagramLayout } from "@/lib/tools/wheel-angle-diagram";
import styles from "@/style/page/tools/wheel-angle-calculator.module.css";

const presets = {
  compact: { label: "Compact", wheelbase: 6, pivotTrack: 4 },
  utility: { label: "Utility", wheelbase: 10, pivotTrack: 6 },
  hauler: { label: "Heavy hauler", wheelbase: 16, pivotTrack: 8 },
} as const;

type PresetKey = keyof typeof presets | "custom";

type ActualEvaluation =
  | { status: "idle" }
  | { status: "error"; message: string }
  | {
      status: "ready";
      percentage: number;
      classification: "under" | "ideal" | "over";
    };

export function WheelAngleCalculator() {
  const [preset, setPreset] = useState<PresetKey>("compact");
  const [wheelbase, setWheelbase] = useState("6");
  const [pivotTrack, setPivotTrack] = useState("4");
  const [innerAngle, setInnerAngle] = useState("27");
  const [actualInner, setActualInner] = useState("");
  const [actualOuter, setActualOuter] = useState("");
  const [copyStatus, setCopyStatus] = useState("");

  const input = useMemo(
    () => ({
      wheelbase: toNumber(wheelbase),
      pivotTrack: toNumber(pivotTrack),
      innerAngleDeg: toNumber(innerAngle),
    }),
    [innerAngle, pivotTrack, wheelbase],
  );
  const errors = useMemo(() => validateWheelAngleInput(input), [input]);
  const result = useMemo(
    () => (errors.length === 0 ? calculateWheelAngles(input) : null),
    [errors, input],
  );
  const actualEvaluation = useMemo<ActualEvaluation>(() => {
    if (actualInner.trim() === "" && actualOuter.trim() === "") {
      return { status: "idle" };
    }
    if (actualInner.trim() === "" || actualOuter.trim() === "") {
      return { status: "error", message: "Enter both measured wheel angles." };
    }

    try {
      const evaluation = calculateAckermannGeometry({
        wheelbase: input.wheelbase,
        pivotTrack: input.pivotTrack,
        actualInnerAngleDeg: toNumber(actualInner),
        actualOuterAngleDeg: toNumber(actualOuter),
      });
      return { status: "ready", ...evaluation };
    } catch (error) {
      return {
        status: "error",
        message: error instanceof Error ? error.message : "Check the measured angles.",
      };
    }
  }, [actualInner, actualOuter, input.pivotTrack, input.wheelbase]);

  function applyPreset(nextPreset: PresetKey) {
    setPreset(nextPreset);
    setCopyStatus("");
    if (nextPreset === "custom") return;
    setWheelbase(String(presets[nextPreset].wheelbase));
    setPivotTrack(String(presets[nextPreset].pivotTrack));
  }

  function updateDimension(
    setter: (value: string) => void,
    value: string,
  ) {
    setter(value);
    setPreset("custom");
    setCopyStatus("");
  }

  async function copySettings() {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(formatBearingSettings(result));
      setCopyStatus("Bearing settings copied.");
    } catch {
      setCopyStatus("Copy failed. Select the values from the table instead.");
    }
  }

  return (
    <div className={styles.calculator}>
      <section className={styles.inputPanel} aria-labelledby="wheel-angle-inputs">
        <header className={styles.panelHeader}>
          <span>01</span>
          <div>
            <h2 id="wheel-angle-inputs">Vehicle measurements</h2>
            <p>Use axle and steering-bearing centers, measured in blocks.</p>
          </div>
        </header>

        <label className={styles.field}>
          <span>Vehicle preset</span>
          <select
            value={preset}
            onChange={(event) => applyPreset(event.target.value as PresetKey)}
          >
            {Object.entries(presets).map(([key, value]) => (
              <option key={key} value={key}>
                {value.label} · {value.wheelbase} × {value.pivotTrack}
              </option>
            ))}
            <option value="custom">Custom measurements</option>
          </select>
        </label>

        <div className={styles.dimensionGrid}>
          <label className={styles.field}>
            <span>Wheelbase</span>
            <span className={styles.unitInput}>
              <input
                type="number"
                min="0.25"
                step="0.25"
                inputMode="decimal"
                value={wheelbase}
                aria-invalid={input.wheelbase <= 0}
                onChange={(event) =>
                  updateDimension(setWheelbase, event.target.value)
                }
              />
              <b>blocks</b>
            </span>
            <small>Front axle centerline to rear axle centerline.</small>
          </label>

          <label className={styles.field}>
            <span>Steering pivot track</span>
            <span className={styles.unitInput}>
              <input
                type="number"
                min="0.25"
                step="0.25"
                inputMode="decimal"
                value={pivotTrack}
                aria-invalid={input.pivotTrack <= 0}
                onChange={(event) =>
                  updateDimension(setPivotTrack, event.target.value)
                }
              />
              <b>blocks</b>
            </span>
            <small>Center of the left bearing to the center of the right.</small>
          </label>
        </div>

        <label className={styles.field}>
          <span>Maximum inner wheel angle</span>
          <span className={styles.unitInput}>
            <input
              type="number"
              min="1"
              max={MAX_STEERING_ANGLE_DEG}
              step="0.1"
              inputMode="decimal"
              value={innerAngle}
              aria-invalid={
                input.innerAngleDeg < 1 ||
                input.innerAngleDeg > MAX_STEERING_ANGLE_DEG
              }
              aria-describedby={errors.length > 0 ? "wheel-angle-errors" : undefined}
              onChange={(event) => {
                setInnerAngle(event.target.value);
                setCopyStatus("");
              }}
            />
            <b>degrees</b>
          </span>
          <small>
            The limit you want on the wheel closest to the center of the turn.
          </small>
        </label>

        {errors.length > 0 ? (
          <div className={styles.errors} id="wheel-angle-errors" role="alert">
            <strong>Check the measurements</strong>
            <ul>
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className={styles.measurementNote}>
          <span>Measurement rule</span>
          <p>
            Do not use the outside edges of wide tires. Wheel offset and spacers can
            place the tire center away from the steering pivot.
          </p>
        </div>
      </section>

      <section className={styles.diagramPanel} aria-labelledby="wheel-angle-diagram">
        <header className={styles.panelHeader}>
          <span>02</span>
          <div>
            <h2 id="wheel-angle-diagram">Steering geometry</h2>
            <p>The inside front wheel turns farther than the outside wheel.</p>
          </div>
        </header>
        {result ? (
          <WheelAngleDiagram
            wheelbase={input.wheelbase}
            pivotTrack={input.pivotTrack}
            result={result}
          />
        ) : (
          <div className={styles.diagramPlaceholder}>
            Enter valid measurements to restore the geometry diagram.
          </div>
        )}
        <div className={styles.diagramLegend} aria-hidden="true">
          <span><i className={styles.innerKey} /> Inner wheel</span>
          <span><i className={styles.outerKey} /> Outer wheel</span>
          <span><i className={styles.rearKey} /> Fixed rear axle</span>
        </div>
        <p className={styles.diagramNote}>
          Diagram uses bearing centers. Tire width, suspension movement, and body
          clearance are not included.
        </p>
      </section>

      <section className={styles.resultPanel} aria-labelledby="wheel-angle-results">
        <header className={styles.panelHeader}>
          <span>03</span>
          <div>
            <h2 id="wheel-angle-results">Calculated settings</h2>
            <p>Enter these limits on the two front steering bearings.</p>
          </div>
        </header>

        {result ? (
          <>
            <div className={styles.primaryResult}>
              <span>Outside wheel target</span>
              <strong>{formatAngle(result.outerAngleDeg)}</strong>
              <p>
                Keep the inside wheel at {formatAngle(result.innerAngleDeg)} for a
                difference of {formatAngle(result.angleDifferenceDeg)}.
              </p>
            </div>

            <dl className={styles.resultGrid}>
              <div>
                <dt>Inner wheel</dt>
                <dd>{formatAngle(result.innerAngleDeg)}</dd>
              </div>
              <div>
                <dt>Outer wheel</dt>
                <dd>{formatAngle(result.outerAngleDeg)}</dd>
              </div>
              <div>
                <dt>Rear-center radius</dt>
                <dd>{formatNumber(result.rearAxleCenterRadius)} blocks</dd>
              </div>
              <div>
                <dt>Outer pivot path</dt>
                <dd>{formatNumber(result.outerFrontPivotPath)} blocks</dd>
              </div>
            </dl>

            <div className={styles.bearingTableWrap}>
              <table>
                <caption>Level 5 Driver&apos;s Seat bearing limits</caption>
                <thead>
                  <tr>
                    <th scope="col">Physical wheel</th>
                    <th scope="col">Left turn</th>
                    <th scope="col">Right turn</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Left wheel</th>
                    <td>{formatAngle(result.bearingSettings.leftBearing.leftTurnDeg)}</td>
                    <td>{formatAngle(result.bearingSettings.leftBearing.rightTurnDeg)}</td>
                  </tr>
                  <tr>
                    <th scope="row">Right wheel</th>
                    <td>{formatAngle(result.bearingSettings.rightBearing.leftTurnDeg)}</td>
                    <td>{formatAngle(result.bearingSettings.rightBearing.rightTurnDeg)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={styles.copyRow}>
              <button type="button" onClick={copySettings}>
                Copy bearing settings
              </button>
              <span aria-live="polite">{copyStatus}</span>
            </div>

            <p className={styles.directionWarning}>
              <strong>Direction check:</strong> If a wheel turns the wrong way, reverse
              that bearing connection with the Connect Tool before increasing speed.
            </p>
          </>
        ) : (
          <div className={styles.resultPlaceholder} aria-live="polite">
            Results appear when all three measurements are valid.
          </div>
        )}
      </section>

      <section className={styles.actualPanel} aria-labelledby="actual-geometry-title">
        <div className={styles.actualCopy}>
          <span>Optional build check</span>
          <h2 id="actual-geometry-title">Compare a finished vehicle</h2>
          <p>
            Measure both front wheels at full lock. This checks steering geometry only,
            not grip or handling quality.
          </p>
          <ul>
            <li><b>100%</b> · ideal angle difference</li>
            <li><b>Below 100%</b> · difference is too small</li>
            <li><b>Above 100%</b> · difference is too large</li>
          </ul>
        </div>
        <div className={styles.actualControls}>
          <div>
            <label className={styles.field}>
              <span>Actual inner angle</span>
              <span className={styles.unitInput}>
                <input
                  type="number"
                  min="1"
                  max={MAX_STEERING_ANGLE_DEG}
                  step="0.1"
                  inputMode="decimal"
                  value={actualInner}
                  onChange={(event) => setActualInner(event.target.value)}
                />
                <b>degrees</b>
              </span>
            </label>
            <label className={styles.field}>
              <span>Actual outer angle</span>
              <span className={styles.unitInput}>
                <input
                  type="number"
                  min="1"
                  max={MAX_STEERING_ANGLE_DEG}
                  step="0.1"
                  inputMode="decimal"
                  value={actualOuter}
                  onChange={(event) => setActualOuter(event.target.value)}
                />
                <b>degrees</b>
              </span>
            </label>
          </div>
          <ActualGeometryOutput evaluation={actualEvaluation} />
        </div>
      </section>
    </div>
  );
}

function WheelAngleDiagram({
  wheelbase,
  pivotTrack,
  result,
}: {
  wheelbase: number;
  pivotTrack: number;
  result: WheelAngleResult;
}) {
  const layout = calculateWheelAngleDiagramLayout(wheelbase, pivotTrack);
  const screenScale = (layout.rightX - layout.leftX) / pivotTrack;
  const actualTurnCenterX = 160 - result.rearAxleCenterRadius * screenScale;
  const turnCenterX = Math.max(18, actualTurnCenterX);
  const turnCenterIsOffScale = actualTurnCenterX < 18;
  const frameX = layout.leftX + layout.wheelWidth * 0.8;
  const frameWidth =
    layout.rightX - layout.leftX - layout.wheelWidth * 1.6;
  const frameY = layout.frontY + 8;
  const frameHeight = layout.rearY - layout.frontY - 16;

  return (
    <svg
      className={styles.diagram}
      viewBox="0 0 320 284"
      role="img"
      aria-labelledby="wheel-diagram-title wheel-diagram-description"
    >
      <title id="wheel-diagram-title">Ackermann steering geometry</title>
      <desc id="wheel-diagram-description">
        Top view of a four-wheel vehicle turning left. The inner front wheel is angled
        more than the outer wheel and both point toward a shared turn center.
      </desc>
      <defs>
        <pattern id="wheel-angle-grid" width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M16 0H0V16" className={styles.gridLine} />
        </pattern>
      </defs>
      <rect width="320" height="284" className={styles.diagramBackground} />
      <rect x="0" y="0" width="320" height="284" fill="url(#wheel-angle-grid)" />

      <line
        x1={turnCenterX}
        y1={layout.rearY}
        x2={layout.leftX}
        y2={layout.frontY}
        className={styles.turnRay}
      />
      <line
        x1={turnCenterX}
        y1={layout.rearY}
        x2={layout.rightX}
        y2={layout.frontY}
        className={styles.turnRay}
      />
      <circle
        cx={turnCenterX}
        cy={layout.rearY}
        r="4"
        className={styles.turnCenter}
      />
      <text x={turnCenterX + 7} y={layout.rearY - 7} className={styles.diagramText}>
        {turnCenterIsOffScale ? "center off scale" : "shared turn center"}
      </text>

      <rect
        x={frameX}
        y={frameY}
        width={frameWidth}
        height={frameHeight}
        rx="8"
        className={styles.vehicleFrame}
      />
      <line
        x1={layout.leftX}
        y1={layout.frontY}
        x2={layout.rightX}
        y2={layout.frontY}
        className={styles.frontAxle}
      />
      <line
        x1={layout.leftX}
        y1={layout.rearY}
        x2={layout.rightX}
        y2={layout.rearY}
        className={styles.rearAxle}
      />
      <Wheel
        x={layout.leftX}
        y={layout.frontY}
        width={layout.wheelWidth}
        length={layout.wheelLength}
        angle={-result.innerAngleDeg}
        className={styles.innerWheel}
      />
      <Wheel
        x={layout.rightX}
        y={layout.frontY}
        width={layout.wheelWidth}
        length={layout.wheelLength}
        angle={-result.outerAngleDeg}
        className={styles.outerWheel}
      />
      <Wheel
        x={layout.leftX}
        y={layout.rearY}
        width={layout.wheelWidth}
        length={layout.wheelLength}
        angle={0}
        className={styles.rearWheel}
      />
      <Wheel
        x={layout.rightX}
        y={layout.rearY}
        width={layout.wheelWidth}
        length={layout.wheelLength}
        angle={0}
        className={styles.rearWheel}
      />
      <circle cx={layout.leftX} cy={layout.frontY} r="3" className={styles.pivot} />
      <circle cx={layout.rightX} cy={layout.frontY} r="3" className={styles.pivot} />
      <text x="160" y="18" textAnchor="middle" className={styles.frontLabel}>FRONT</text>
    </svg>
  );
}

function Wheel({
  x,
  y,
  width,
  length,
  angle,
  className,
}: {
  x: number;
  y: number;
  width: number;
  length: number;
  angle: number;
  className: string;
}) {
  return (
    <rect
      x={x - width / 2}
      y={y - length / 2}
      width={width}
      height={length}
      rx="4"
      className={className}
      transform={`rotate(${angle} ${x} ${y})`}
    />
  );
}

function ActualGeometryOutput({
  evaluation,
}: {
  evaluation: ActualEvaluation;
}) {
  if (evaluation.status === "idle") {
    return (
      <output className={styles.actualOutput}>
        Enter both measured angles to compare your build.
      </output>
    );
  }

  if (evaluation.status === "error") {
    return (
      <output className={`${styles.actualOutput} ${styles.actualError}`}>
        {evaluation.message}
      </output>
    );
  }

  const labels = {
    under: "Angle difference is too small",
    ideal: "Ideal Ackermann geometry",
    over: "Angle difference is too large",
  } as const;

  return (
    <output
      className={`${styles.actualOutput} ${styles[evaluation.classification]}`}
      aria-live="polite"
    >
      <strong>{evaluation.percentage.toFixed(1)}%</strong>
      <span>{labels[evaluation.classification]}</span>
    </output>
  );
}

function toNumber(value: string): number {
  return value.trim() === "" ? Number.NaN : Number(value);
}
