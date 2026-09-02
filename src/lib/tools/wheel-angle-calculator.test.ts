import { describe, expect, it } from "vitest";
import {
  calculateAckermannGeometry,
  calculateWheelAngles,
  formatBearingSettings,
  validateWheelAngleInput,
} from "@/lib/tools/wheel-angle-calculator";

describe("wheel angle calculator", () => {
  it("calculates the compact 6 by 4 preset", () => {
    const result = calculateWheelAngles({
      wheelbase: 6,
      pivotTrack: 4,
      innerAngleDeg: 27,
    });

    expect(result.outerAngleDeg).toBeCloseTo(20.82, 2);
    expect(result.angleDifferenceDeg).toBeCloseTo(6.18, 2);
    expect(result.rearAxleCenterRadius).toBeCloseTo(13.78, 2);
    expect(result.outerFrontPivotPath).toBeCloseTo(16.88, 2);
  });

  it("maps the inner and outer angles to physical left and right bearings", () => {
    const result = calculateWheelAngles({
      wheelbase: 6,
      pivotTrack: 4,
      innerAngleDeg: 27,
    });

    expect(result.bearingSettings.leftBearing).toEqual({
      leftTurnDeg: 27,
      rightTurnDeg: result.outerAngleDeg,
    });
    expect(result.bearingSettings.rightBearing).toEqual({
      leftTurnDeg: result.outerAngleDeg,
      rightTurnDeg: 27,
    });
    expect(formatBearingSettings(result)).toContain("Left wheel bearing");
  });

  it("accepts 89 degrees but rejects angles outside the conventional steering model", () => {
    expect(
      validateWheelAngleInput({ wheelbase: 6, pivotTrack: 4, innerAngleDeg: 89 }),
    ).toEqual([]);
    expect(
      validateWheelAngleInput({ wheelbase: 6, pivotTrack: 4, innerAngleDeg: 90 }),
    ).toContain("Maximum inner wheel angle must be between 1° and 89°.");
    expect(() =>
      calculateWheelAngles({ wheelbase: 6, pivotTrack: 4, innerAngleDeg: 120 }),
    ).toThrow(RangeError);
  });

  it("reports ideal Ackermann geometry for the calculated outer angle", () => {
    const ideal = calculateWheelAngles({
      wheelbase: 10,
      pivotTrack: 6,
      innerAngleDeg: 27,
    });
    const result = calculateAckermannGeometry({
      wheelbase: 10,
      pivotTrack: 6,
      actualInnerAngleDeg: 27,
      actualOuterAngleDeg: ideal.outerAngleDeg,
    });

    expect(result.percentage).toBeCloseTo(100, 8);
    expect(result.classification).toBe("ideal");
  });

  it("rejects an actual outer angle that is not smaller than the inner angle", () => {
    expect(() =>
      calculateAckermannGeometry({
        wheelbase: 6,
        pivotTrack: 4,
        actualInnerAngleDeg: 20,
        actualOuterAngleDeg: 20,
      }),
    ).toThrow("Actual outer wheel angle must be smaller than the inner wheel angle.");
  });
});
