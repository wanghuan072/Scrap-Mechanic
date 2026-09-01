import { describe, expect, it } from "vitest";
import {
  guides,
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
    expect(getWikiEntryByName("Big Wheel")?.slug).toBe("big-wheel");
    expect(
      getWikiEntryAliases({ category: "blocks", slug: "structural-blocks" }),
    ).toContain("Scrap Metal Block");
  });

  it("includes the high-frequency materials used by generated recipe links", () => {
    expect(getWikiEntryByName("Glass Block")?.slug).toBe("glass-block");
    expect(getWikiEntryByName("Glue")?.slug).toBe("glue");
    expect(getWikiEntryByName("Ember")?.slug).toBe("ember");
    expect(getWikiEntryByName("Water")?.slug).toBe("water");
    expect(getWikiEntryByName("Quartz")?.slug).toBe("quartz");
  });

  it("cross-links the four acquisition guides from their body sections", () => {
    const acquisitionSlugs = [
      "how-to-get-oil",
      "how-to-get-water",
      "how-to-get-battery",
      "how-to-get-schematics",
    ];

    acquisitionSlugs.forEach((slug) => {
      const guide = guides.find((entry) => entry.slug === slug);
      const relatedSection = guide?.sections.find(
        (section) => section.heading === "Related guides",
      ) as
        | {
            links?: Array<{ href: string }>;
          }
        | undefined;
      const expectedHrefs = [
        ...acquisitionSlugs
          .filter((relatedSlug) => relatedSlug !== slug)
          .map((relatedSlug) => `/guides/${relatedSlug}`),
        "/guides",
      ];

      expect(relatedSection?.links?.map((link) => link.href)).toEqual(
        expectedHrefs,
      );
    });
  });
});
