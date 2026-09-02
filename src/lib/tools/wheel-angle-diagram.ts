export type WheelAngleDiagramLayout = {
  leftX: number;
  rightX: number;
  frontY: number;
  rearY: number;
  wheelWidth: number;
  wheelLength: number;
};

export function calculateWheelAngleDiagramLayout(
  wheelbase: number,
  pivotTrack: number,
): WheelAngleDiagramLayout {
  if (!Number.isFinite(wheelbase) || wheelbase <= 0) {
    throw new RangeError("Wheelbase must be greater than 0 blocks.");
  }
  if (!Number.isFinite(pivotTrack) || pivotTrack <= 0) {
    throw new RangeError("Steering pivot track must be greater than 0 blocks.");
  }

  const maximumTrackSpan = 150;
  const maximumWheelbaseSpan = 146;
  const scale = Math.min(
    maximumTrackSpan / pivotTrack,
    maximumWheelbaseSpan / wheelbase,
  );
  const trackSpan = pivotTrack * scale;
  const wheelbaseSpan = wheelbase * scale;
  const centerX = 160;
  const centerY = 142;

  return {
    leftX: centerX - trackSpan / 2,
    rightX: centerX + trackSpan / 2,
    frontY: centerY - wheelbaseSpan / 2,
    rearY: centerY + wheelbaseSpan / 2,
    wheelWidth: clamp(trackSpan * 0.12, 14, 22),
    wheelLength: clamp(wheelbaseSpan * 0.28, 32, 46),
  };
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}
