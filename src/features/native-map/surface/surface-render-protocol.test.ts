import { describe, expect, it } from "vitest";
import { shouldRenderSurfaceDetails, surfaceDetailPixelsPerCell } from "./surface-render-protocol";

describe("shouldRenderSurfaceDetails", () => {
  it("keeps low zoom levels on the static overview", () => {
    expect(shouldRenderSurfaceDetails(-5)).toBe(false);
    expect(shouldRenderSurfaceDetails(-4)).toBe(false);
  });

  it("enables progressive detail rendering from zoom -3", () => {
    expect(shouldRenderSurfaceDetails(-3)).toBe(true);
    expect(shouldRenderSurfaceDetails(0)).toBe(true);
  });
});

describe("surface detail resolution", () => {
  it("matches zoom and display density without exceeding source resolution", () => {
    expect(surfaceDetailPixelsPerCell(-3, 1)).toBe(16);
    expect(surfaceDetailPixelsPerCell(-2, 2)).toBe(32);
    expect(surfaceDetailPixelsPerCell(-1, 2)).toBe(64);
    expect(surfaceDetailPixelsPerCell(0, 1)).toBe(64);
    expect(surfaceDetailPixelsPerCell(0, 2)).toBe(100);
    expect(surfaceDetailPixelsPerCell(0, 3)).toBe(100);
  });

  it("normalizes invalid density and zoom", () => {
    expect(surfaceDetailPixelsPerCell(NaN, NaN)).toBe(16);
    expect(surfaceDetailPixelsPerCell(5, -1)).toBe(64);
  });
});
