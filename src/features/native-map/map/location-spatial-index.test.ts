import { describe, expect, it } from "vitest";
import { LocationSpatialIndex } from "./location-spatial-index";
import type { LocationNameInstance } from "./location-name-inventory";

const point = (id: string, typeId: string, x: number, y: number): LocationNameInstance => ({
  id, typeId, label: id, position: { x, y }, source: "generated",
});

describe("location spatial index", () => {
  it("includes edge and negative coordinates while excluding offscreen and other types", () => {
    const index = new LocationSpatialIndex([
      point("edge", "generated:major", -16, -16),
      point("inside", "generated:major", 0, 0),
      point("far", "generated:major", 30, 30),
      point("other", "generated:warehouse", 0, 0),
    ]);
    expect(index.query({ west: -1024, east: 64, south: -1024, north: 64 }, new Set(["generated:major"]))
      .map((item) => item.instance.id)).toEqual(["edge", "inside"]);
  });

  it("deduplicates the same label and coordinate without merging distinct types", () => {
    const a = point("same", "generated:major", 0, 0);
    const index = new LocationSpatialIndex([a, a, { ...a, typeId: "generated:warehouse" }]);
    const bounds = { west: -1, east: 1, south: -1, north: 1 };
    expect(index.query(bounds, new Set(["generated:major", "generated:warehouse"]))).toHaveLength(2);
    expect(index.query(bounds, new Set())).toEqual([]);
  });
});
