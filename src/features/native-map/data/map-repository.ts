import type { MapLocation, MapRepository, WorldMap } from "../domain/map-model";

type FetchJson = <T>(path: string) => Promise<T>;

function createFetchJson(basePath: string): FetchJson {
  return async <T>(path: string): Promise<T> => {
    const response = await fetch(`${basePath}/${path}`);
    if (!response.ok) {
      throw new Error(`Unable to load map data: ${path}`);
    }

    return (await response.json()) as T;
  };
}

export class JsonMapRepository implements MapRepository {
  private readonly fetchJson: FetchJson;

  constructor(basePath = "/data") {
    this.fetchJson = createFetchJson(basePath);
  }

  loadLocations(): Promise<MapLocation[]> {
    return this.fetchJson<MapLocation[]>("locations.json");
  }

  async loadSurface(): Promise<WorldMap> {
    const [referenceWorld, locations] = await Promise.all([
      this.fetchJson<WorldMap>("reference-world.json"),
      this.loadLocations(),
    ]);

    return { ...referenceWorld, id: "surface", locations };
  }
}
