import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";

function sitemapDates() {
  return new Map(
    sitemap().map((entry) => [
      new URL(entry.url).pathname,
      typeof entry.lastModified === "string"
        ? entry.lastModified
        : entry.lastModified?.toISOString().slice(0, 10),
    ]),
  );
}

describe("sitemap last-modified dates", () => {
  it("uses the current date only for pages changed in this release", () => {
    const dates = sitemapDates();

    expect(dates.get("/tools/wheel-angle-calculator")).toBe("2026-09-02");
    expect(dates.get("/guides/first-vehicle")).toBe("2026-09-02");
    expect(dates.get("/builds/starter-car")).toBe("2026-09-02");
    expect(dates.get("/wiki/parts/bearing")).toBe("2026-09-02");
    expect(dates.get("/wiki/parts/drivers-seat")).toBe("2026-09-02");
    expect(dates.get("/wiki/tools/connect-tool")).toBe("2026-09-02");
  });

  it("preserves dates for unchanged tool and wiki pages", () => {
    const dates = sitemapDates();

    expect(dates.get("/tools/raid-calculator")).toBe("2026-07-30");
    expect(dates.get("/tools/crafting-planner")).toBe("2026-07-30");
    expect(dates.get("/wiki/parts/controller")).toBe("2026-07-31");
  });
});
