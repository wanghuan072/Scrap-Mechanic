import { describe, expect, it } from "vitest";
import { guides } from "@/lib/data/guides";
import { createRaidLevelsGuideEntry } from "@/lib/data/raid-levels-guide";

describe("raid levels guide data", () => {
  const source = guides.find((guide) => guide.slug === "raid-levels")!;
  const guide = createRaidLevelsGuideEntry(source);
  const cropTable = guide.tables!.find(
    (table) => table.caption === "Scrap Mechanic 1.0 raid crop values",
  )!;
  const levelTable = guide.tables!.find(
    (table) => table.caption === "Scrap Mechanic raid level table",
  )!;
  const multiplayerTable = guide.tables!.find(
    (table) => table.caption === "Multiplayer raid budget modifier",
  )!;

  it("lists all twelve crops and identifies both zero-value crops", () => {
    expect(cropTable.rows).toHaveLength(12);
    expect(cropTable.rows.slice(0, 2)).toEqual([
      ["Cotton", "0", "Adds no raid pressure"],
      ["Pigment Flower", "0", "Adds no raid pressure"],
    ]);
  });

  it("builds all seven raid rows from the calculator data", () => {
    expect(levelTable.rows).toHaveLength(7);
    expect(levelTable.rows.map((row) => row[1])).toEqual([
      "1–49",
      "50–99",
      "100–549",
      "550–999",
      "1,000–5,499",
      "5,500–10,000",
      "10,001+",
    ]);
  });

  it("keeps zero outside Level 1 and exposes all Level 4 opening options", () => {
    expect(levelTable.note).toContain("zero means no active raid");
    expect(levelTable.rows[3][3]).toContain("Option 3");
  });

  it("documents the multiplayer cap without duplicating calculator math", () => {
    expect(multiplayerTable.rows.map((row) => row[1])).toEqual([
      "1.00×",
      "1.50×",
      "2.00×",
      "2.00×",
    ]);
  });
});
