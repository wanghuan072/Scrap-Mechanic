import {
  loadVerifiedSmMapGeneratorManifest,
  resolveSmMapGeneratorAssetUrl
} from "../vendor/sm-map-generator-assets";
import type {
  VendorSurfaceBundle,
  VendorSurfaceImage,
  VendorSurfaceRepository
} from "./vendor-surface-types";

const DEFAULT_MANIFEST_URL = "/map-assets/sm-map-generator/manifest.json";

export interface VendorSurfaceRepositoryOptions {
  manifestUrl?: string;
  fetcher?: typeof fetch;
}

class NormalizedReadonlyImageMap implements ReadonlyMap<string, VendorSurfaceImage> {
  readonly #values: Map<string, VendorSurfaceImage>;

  constructor(entries: Iterable<readonly [string, VendorSurfaceImage]>) {
    this.#values = new Map(entries);
    Object.freeze(this);
  }

  get size(): number { return this.#values.size; }
  get(key: string): VendorSurfaceImage | undefined {
    return this.#values.get(key.toLowerCase());
  }
  has(key: string): boolean { return this.#values.has(key.toLowerCase()); }
  entries(): MapIterator<[string, VendorSurfaceImage]> { return this.#values.entries(); }
  keys(): MapIterator<string> { return this.#values.keys(); }
  values(): MapIterator<VendorSurfaceImage> { return this.#values.values(); }
  forEach(
    callbackfn: (value: VendorSurfaceImage, key: string, map: ReadonlyMap<string, VendorSurfaceImage>) => void,
    thisArg?: unknown
  ): void {
    for (const [key, value] of this.#values) callbackfn.call(thisArg, value, key, this);
  }
  [Symbol.iterator](): MapIterator<[string, VendorSurfaceImage]> {
    return this.entries();
  }
}

export function createVendorSurfaceRepository(
  options: VendorSurfaceRepositoryOptions = {}
): VendorSurfaceRepository {
  const manifestUrl = options.manifestUrl ?? DEFAULT_MANIFEST_URL;
  const fetcher = options.fetcher ?? fetch;
  let cached: VendorSurfaceBundle | undefined;
  let loading: Promise<VendorSurfaceBundle> | undefined;

  const loadBundle = async (): Promise<VendorSurfaceBundle> => {
    const manifest = await loadVerifiedSmMapGeneratorManifest(manifestUrl, fetcher);
    if (!manifest) throw new Error("SM Map Generator surface manifest was not found.");
    const images: Array<readonly [string, VendorSurfaceImage]> = [];
    let excavationComposite: VendorSurfaceImage | undefined;
    for (const record of manifest.images) {
      const image = Object.freeze({
        ...(record.uuid ? { uuid: record.uuid } : {}),
        role: record.role,
        url: resolveSmMapGeneratorAssetUrl(manifestUrl, record.path),
        contentHash: record.contentHash,
        bytes: record.bytes,
        width: record.width,
        height: record.height,
        cellsWide: record.cellsWide,
        cellsHigh: record.cellsHigh
      }) satisfies VendorSurfaceImage;
      if (record.role === "excavation-composite") {
        excavationComposite = image;
      } else {
        images.push([record.uuid!, image]);
      }
    }
    if (!excavationComposite) {
      throw new Error("SM Map Generator excavation composite is missing.");
    }
    return Object.freeze({
      imagesByUuid: new NormalizedReadonlyImageMap(images),
      excavationComposite,
      manifestHash: manifest.contentHash
    });
  };

  return Object.freeze({
    load(): Promise<VendorSurfaceBundle> {
      if (cached) return Promise.resolve(cached);
      if (loading) return loading;
      loading = loadBundle()
        .then((bundle) => {
          cached = bundle;
          return bundle;
        })
        .finally(() => {
          loading = undefined;
        });
      return loading;
    }
  });
}
