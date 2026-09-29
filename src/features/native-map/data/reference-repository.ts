import type { MapLocation, MapRepository, WorldMap } from "../domain/map-model";

export interface GeneratedEnvelope { schemaVersion: number; gameVersion: string; contentHash: string }
interface LocationsBundle extends GeneratedEnvelope { locations: MapLocation[] }
interface ReferenceWorldBundle extends GeneratedEnvelope { world: WorldMap }
export interface BuildInfoBundle extends GeneratedEnvelope { files: Array<{ name: string; contentHash: string; bytes: number }> }

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") return Object.fromEntries(Object.keys(value as Record<string, unknown>).sort().map((key) => [key, canonicalize((value as Record<string, unknown>)[key])]));
  return value;
}

async function sha256(value: string): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function assertGeneratedSelfHash(bundle: GeneratedEnvelope, name: string): Promise<void> {
  if (bundle.schemaVersion !== 1) throw new Error(`Generated ${name} uses an unsupported schema. Run data:build for Scrap Mechanic 1.0.`);
  const withoutSelfHash = Object.fromEntries(
    Object.entries(bundle).filter(([key]) => key !== "contentHash")
  );
  if (bundle.contentHash !== await sha256(JSON.stringify(canonicalize(withoutSelfHash)))) throw new Error(`Generated ${name} failed its integrity check. Run data:build again.`);
}

export async function parseVerifiedGeneratedBundle<T extends GeneratedEnvelope>(
  text: string,
  name: string,
  expected?: BuildInfoBundle
): Promise<T> {
  let bundle: T;
  try { bundle = JSON.parse(text) as T; } catch { throw new Error(`Generated ${name} is not valid JSON. Run data:build again.`); }
  await assertGeneratedSelfHash(bundle, name);
  if (expected) {
    if (bundle.gameVersion !== expected.gameVersion) throw new Error(`Generated ${name} has a mismatched game version. Run data:build again.`);
    const listed = expected.files.find((file) => file.name === name);
    if (!listed) throw new Error(`Generated ${name} is absent from build-info. Run data:build again.`);
    if (listed.contentHash !== bundle.contentHash) throw new Error(`Generated ${name} does not match build-info. Run data:build again.`);
    const portableText = text.replace(/\r\n/g, "\n");
    if (listed.bytes !== new TextEncoder().encode(portableText).byteLength) throw new Error(`Generated ${name} byte size does not match build-info. Run data:build again.`);
  }
  return bundle;
}

/** Reads and validates only public generated data; game roots and saves are never fetched. */
export class ReferenceMapRepository implements MapRepository {
  private buildInfo?: Promise<BuildInfoBundle>;
  private locationsBundle?: Promise<LocationsBundle>;
  private surfaceBundle?: Promise<ReferenceWorldBundle>;

  constructor(private readonly basePath = "/map-assets/generated") {}

  private cached<T>(key: "buildInfo" | "locationsBundle" | "surfaceBundle", loader: () => Promise<T>): Promise<T> {
    const current = this[key] as Promise<T> | undefined;
    if (current) return current;
    const pending = loader().catch((error: unknown) => { this[key] = undefined as never; throw error; });
    this[key] = pending as never;
    return pending;
  }

  private async fetchBundle<T extends GeneratedEnvelope>(name: string, expected?: BuildInfoBundle): Promise<T> {
    const response = await fetch(`${this.basePath}/${name}`);
    if (!response.ok) throw new Error(`Unable to load generated map data '${name}'. Rebuild the local data bundle and try again.`);
    const text = await response.text();
    return parseVerifiedGeneratedBundle<T>(text, name, expected);
  }

  private ensureBuildInfo(): Promise<BuildInfoBundle> {
    return this.cached("buildInfo", () => this.fetchBundle<BuildInfoBundle>("build-info.json"));
  }
  private loadLocationsBundle(): Promise<LocationsBundle> {
    return this.cached("locationsBundle", async () => this.fetchBundle<LocationsBundle>("locations.json", await this.ensureBuildInfo()));
  }
  private loadSurfaceBundle(): Promise<ReferenceWorldBundle> {
    return this.cached("surfaceBundle", async () => this.fetchBundle<ReferenceWorldBundle>("reference-world.json", await this.ensureBuildInfo()));
  }

  async loadLocations(): Promise<MapLocation[]> { return (await this.loadLocationsBundle()).locations; }

  async loadSurface(): Promise<WorldMap> {
    try {
      const [bundle, locations, buildInfo] = await Promise.all([
        this.loadSurfaceBundle(),
        this.loadLocations(),
        this.ensureBuildInfo()
      ]);
      if (bundle.gameVersion !== buildInfo.gameVersion) {
        throw new Error("Generated reference surface has a mismatched game version.");
      }
      return { ...bundle.world, id: "surface", locations };
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown data loading error";
      throw new Error(`Could not open the surface map. Rebuild map data and try again. ${message}`);
    }
  }
}

export const referenceMapRepository = new ReferenceMapRepository();
