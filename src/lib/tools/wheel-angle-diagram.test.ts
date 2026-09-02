import { describe, expect, it } from "vitest";
import { calculateWheelAngleDiagramLayout } from "@/lib/tools/wheel-angle-diagram";

describe("wheel angle diagram layout", () => {
  it("keeps longer wheelbases visually longer than the pivot track", () => {
    const layout = calculateWheelAngleDiagramLayout(10, 6);

    expect(layout.rearY - layout.frontY).toBeGreaterThan(
      layout.rightX - layout.leftX,
    );
  });

  it("fits extreme positive dimensions without collapsing the wheels", () => {
    const layout = calculateWheelAngleDiagramLayout(100, 1);

    expect(layout.frontY).toBeGreaterThanOrEqual(60);
    expect(layout.rearY).toBeLessThanOrEqual(224);
    expect(layout.wheelWidth).toBeGreaterThanOrEqual(14);
  });

  it("rejects invalid dimensions", () => {
    expect(() => calculateWheelAngleDiagramLayout(0, 4)).toThrow(RangeError);
    expect(() => calculateWheelAngleDiagramLayout(6, -1)).toThrow(RangeError);
  });
});
