import type { WorldMap } from "../domain/map-model";
import { assertGeneratedSelfHash, type GeneratedEnvelope } from "../data/reference-repository";
import type { PreparedSurfaceChunk, SurfaceRenderDiagnostics } from "./surface-render-protocol";

const HASH_PATTERN = /^[a-f0-9]{64}$/;
const MAX_OVERVIEW_BYTES = 512 * 1024;

interface ReferenceOverviewDescriptor extends GeneratedEnvelope {
  worldContentHash: string;
  asset: {
    path: string;
    contentHash: string;
    bytes: number;
    width: number;
    height: number;
  };
  diagnostics: SurfaceRenderDiagnostics;
}

export interface ReferenceOverviewResult {
  overview: PreparedSurfaceChunk;
  diagnostics: SurfaceRenderDiagnostics;
}

export interface ReferenceOverviewRepository {
  load(world: WorldMap): Promise<ReferenceOverviewResult>;
}

async function sha256(bytes: Uint8Array): Promise<string> {
  const owned = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(owned).set(bytes);
  const digest = await crypto.subtle.digest("SHA-256", owned);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function validateDescriptor(value: ReferenceOverviewDescriptor, world: WorldMap): void {
  const { asset, diagnostics } = value;
  if (
    world.source !== "reference"
    || !world.sourceContentHash
    || value.worldContentHash !== world.sourceContentHash
    || value.gameVersion !== world.gameVersion
    || !asset.path.startsWith("reference-overview-")
    || !asset.path.endsWith(".webp")
    || !HASH_PATTERN.test(asset.contentHash)
    || !Number.isSafeInteger(asset.bytes)
    || asset.bytes < 1
    || asset.bytes > MAX_OVERVIEW_BYTES
    || asset.width !== (world.bounds.maxX - world.bounds.minX + 1) * 4
    || asset.height !== (world.bounds.maxY - world.bounds.minY + 1) * 4
    || !Number.isSafeInteger(diagnostics.missingFragments)
    || !Array.isArray(diagnostics.missingUuids)
  ) {
    throw new Error("The reference overview descriptor does not match the current world data.");
  }
}

export class BrowserReferenceOverviewRepository implements ReferenceOverviewRepository {
  constructor(private readonly basePath = "/map-assets/generated") {}

  async load(world: WorldMap): Promise<ReferenceOverviewResult> {
    const descriptorResponse = await fetch(`${this.basePath}/reference-overview.json`);
    if (!descriptorResponse.ok) throw new Error("The reference overview descriptor is unavailable.");
    const descriptor = JSON.parse(await descriptorResponse.text()) as ReferenceOverviewDescriptor;
    await assertGeneratedSelfHash(descriptor, "reference-overview.json");
    validateDescriptor(descriptor, world);

    const imageResponse = await fetch(`${this.basePath}/${descriptor.asset.path}`);
    if (!imageResponse.ok) throw new Error("The reference overview image is unavailable.");
    const contentLength = Number(imageResponse.headers.get("content-length") ?? 0);
    if (contentLength > descriptor.asset.bytes || contentLength > MAX_OVERVIEW_BYTES) {
      throw new Error("The reference overview image exceeds its verified size.");
    }
    const bytes = new Uint8Array(await imageResponse.arrayBuffer());
    if (
      bytes.byteLength !== descriptor.asset.bytes
      || await sha256(bytes) !== descriptor.asset.contentHash
    ) {
      throw new Error("The reference overview image failed its integrity check.");
    }
    const bitmap = await createImageBitmap(new Blob([bytes], { type: "image/webp" }));
    if (bitmap.width !== descriptor.asset.width || bitmap.height !== descriptor.asset.height) {
      bitmap.close();
      throw new Error("The reference overview image dimensions are invalid.");
    }
    return {
      overview: { id: "overview", bounds: world.bounds, bitmap },
      diagnostics: descriptor.diagnostics
    };
  }
}
