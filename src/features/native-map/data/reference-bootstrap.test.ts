import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ReferenceMapRepository } from "./reference-repository";

const directory = "public/map-assets/generated/";

afterEach(() => vi.unstubAllGlobals());

describe("verified reference bootstrap", () => {
  it("loads the overview world without requesting the full terrain", async () => {
    const fetcher = vi.fn(async (url: string) => new Response(readFileSync(directory + url.split("/").pop(), "utf8")));
    vi.stubGlobal("fetch", fetcher);
    const world = await new ReferenceMapRepository().loadInitialSurface();
    expect(world.isOverviewOnly).toBe(true);
    expect(world.cells.length).toBeGreaterThan(0);
    expect(fetcher.mock.calls.some(([url]) => url.endsWith("reference-world.json"))).toBe(false);
  });

  it.each(["missing", "tampered"])("falls back to verified full terrain when bootstrap is %s", async (failure) => {
    vi.stubGlobal("fetch", vi.fn(async (url: string) => {
      if (url.endsWith("reference-bootstrap.json")) {
        return failure === "missing"
          ? new Response("", { status: 404 })
          : new Response(readFileSync(directory + "reference-bootstrap.json", "utf8").replace('"schemaVersion":1', '"schemaVersion":99'));
      }
      return new Response(readFileSync(directory + url.split("/").pop(), "utf8"));
    }));
    const world = await new ReferenceMapRepository().loadInitialSurface();
    expect(world.isOverviewOnly).not.toBe(true);
    expect(world.cells.length).toBeGreaterThan(1749);
    expect(world.source).toBe("reference");
  });
});
