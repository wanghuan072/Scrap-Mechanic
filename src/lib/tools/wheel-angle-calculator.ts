export const MAX_STEERING_ANGLE_DEG = 89;

export type WheelAngleInput = {
  wheelbase: number;
  pivotTrack: number;
  innerAngleDeg: number;
};

export type BearingTurnSettings = {
  leftTurnDeg: number;
  rightTurnDeg: number;
};

export type WheelAngleResult = {
  innerAngleDeg: number;
  outerAngleDeg: number;
  angleDifferenceDeg: number;
  rearAxleCenterRadius: number;
  outerFrontPivotPath: number;
  bearingSettings: {
    leftBearing: BearingTurnSettings;
    rightBearing: BearingTurnSettings;
  };
};

export type ActualGeometryInput = {
  wheelbase: number;
  pivotTrack: number;
  actualInnerAngleDeg: number;
  actualOuterAngleDeg: number;
};

export type ActualGeometryResult = {
  percentage: number;
  classification: "under" | "ideal" | "over";
};

export function validateWheelAngleInput(input: WheelAngleInput): string[] {
  const errors: string[] = [];

  if (!Number.isFinite(input.wheelbase) || input.wheelbase <= 0) {
    errors.push("Wheelbase must be greater than 0 blocks.");
  }
  if (!Number.isFinite(input.pivotTrack) || input.pivotTrack <= 0) {
    errors.push("Steering pivot track must be greater than 0 blocks.");
  }
  if (
    !Number.isFinite(input.innerAngleDeg) ||
    input.innerAngleDeg < 1 ||
    input.innerAngleDeg > MAX_STEERING_ANGLE_DEG
  ) {
    errors.push(
      `Maximum inner wheel angle must be between 1° and ${MAX_STEERING_ANGLE_DEG}°.`,
    );
  }

  return errors;
}

export function calculateWheelAngles(input: WheelAngleInput): WheelAngleResult {
  const errors = validateWheelAngleInput(input);
  if (errors.length > 0) {
    throw new RangeError(errors.join(" "));
  }

  const innerAngleRad = degreesToRadians(input.innerAngleDeg);
  const rearAxleCenterRadius =
    input.pivotTrack / 2 + input.wheelbase / Math.tan(innerAngleRad);
  const outerAngleDeg = radiansToDegrees(
    Math.atan(input.wheelbase / (rearAxleCenterRadius + input.pivotTrack / 2)),
  );
  const outerFrontPivotPath = Math.hypot(
    rearAxleCenterRadius + input.pivotTrack / 2,
    input.wheelbase,
  );

  return {
    innerAngleDeg: input.innerAngleDeg,
    outerAngleDeg,
    angleDifferenceDeg: input.innerAngleDeg - outerAngleDeg,
    rearAxleCenterRadius,
    outerFrontPivotPath,
    bearingSettings: {
      leftBearing: {
        leftTurnDeg: input.innerAngleDeg,
        rightTurnDeg: outerAngleDeg,
      },
      rightBearing: {
        leftTurnDeg: outerAngleDeg,
        rightTurnDeg: input.innerAngleDeg,
      },
    },
  };
}

export function calculateAckermannGeometry(
  input: ActualGeometryInput,
): ActualGeometryResult {
  const errors = validateWheelAngleInput({
    wheelbase: input.wheelbase,
    pivotTrack: input.pivotTrack,
    innerAngleDeg: input.actualInnerAngleDeg,
  });

  if (
    !Number.isFinite(input.actualOuterAngleDeg) ||
    input.actualOuterAngleDeg < 1 ||
    input.actualOuterAngleDeg > MAX_STEERING_ANGLE_DEG
  ) {
    errors.push(
      `Actual outer wheel angle must be between 1° and ${MAX_STEERING_ANGLE_DEG}°.`,
    );
  } else if (
    Number.isFinite(input.actualInnerAngleDeg) &&
    input.actualOuterAngleDeg >= input.actualInnerAngleDeg
  ) {
    errors.push("Actual outer wheel angle must be smaller than the inner wheel angle.");
  }

  if (errors.length > 0) {
    throw new RangeError(errors.join(" "));
  }

  const actualDifference =
    cotangent(degreesToRadians(input.actualOuterAngleDeg)) -
    cotangent(degreesToRadians(input.actualInnerAngleDeg));
  const percentage =
    (actualDifference / (input.pivotTrack / input.wheelbase)) * 100;
  const tolerance = 0.5;
  const classification =
    percentage < 100 - tolerance
      ? "under"
      : percentage > 100 + tolerance
        ? "over"
        : "ideal";

  return { percentage, classification };
}

export function formatBearingSettings(result: WheelAngleResult): string {
  return [
    "Scrap Mechanic Ackermann bearing settings",
    `Left wheel bearing — Left turn: ${formatAngle(result.bearingSettings.leftBearing.leftTurnDeg)}, Right turn: ${formatAngle(result.bearingSettings.leftBearing.rightTurnDeg)}`,
    `Right wheel bearing — Left turn: ${formatAngle(result.bearingSettings.rightBearing.leftTurnDeg)}, Right turn: ${formatAngle(result.bearingSettings.rightBearing.rightTurnDeg)}`,
  ].join("\n");
}

export function formatAngle(value: number): string {
  return `${value.toFixed(2)}°`;
}

export function formatNumber(value: number): string {
  return value.toFixed(2);
}

function cotangent(value: number): number {
  return 1 / Math.tan(value);
}

function degreesToRadians(value: number): number {
  return (value * Math.PI) / 180;
}

function radiansToDegrees(value: number): number {
  return (value * 180) / Math.PI;
}
