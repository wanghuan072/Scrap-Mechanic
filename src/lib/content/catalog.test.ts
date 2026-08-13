import { describe, expect, it } from "vitest";
import {
  getWikiEntryByName,
  searchContent,
} from "@/lib/content/catalog";
import { getWikiEntryAliases } from "@/lib/wiki/entry-aliases";

describe("content catalog", () => {
  it("returns no results for an empty query", () => {
    expect(searchContent("   ")).toEqual([]);
  });

  it("ranks the exact Bearing entry first", () => {
    const results = searchContent("bearing");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toBe("Bearing");
    expect(results[0].href).toBe("/wiki/parts/bearing");
  });

  it("resolves player-facing aliases and object-detail aliases", () => {
    expect(getWikiEntryByName("Spud Gun")?.slug).toBe("spudgun");
    expect(
      getWikiEntryAliases({ category: "blocks", slug: "structural-blocks" }),
    ).toContain("Scrap Metal Block");
  });
});
