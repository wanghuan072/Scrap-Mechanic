import { assertSupportedGameVersion } from "../domain/game-version";
import {
  MAX_VENDOR_IMAGE_BYTES,
  MAX_VENDOR_IMAGE_COUNT,
  MAX_VENDOR_IMAGE_DIMENSION,
  MAX_VENDOR_MANIFEST_BYTES,
  MAX_VENDOR_RESOURCE_BYTES,
  VENDOR_IMAGE_CELL_PIXELS
} from "./vendor-limits";

const SOURCE_REPOSITORY = "https://github.com/xKoldx/sm_map_generator";
const EXPECTED_LICENSE_HASH = "83da68bc67cf206ab292f2ee6cf9109016c89c53cc9673bb66ece8df7abd6c9a";
const EXPECTED_ARCHIVE_HASH = "c3c5a62317e187ca7738dae015ab493ecf093c11bb8f0294bb94dbcfaa8004a89";
const EXPECTED_UPSTREAM_VERSION = "1.7.0";
const HASH_PATTERN = /^[0-9a-f]{64}$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

export interface VendorDataRecord {
  bytes: number;
  contentHash: string;
  path: string;
  sourcePath: string;
}

export interface VendorImageManifestRecord extends VendorDataRecord {
  uuid?: string;
  role: "single-cell" | "multi-cell" | "excavation-composite";
  width: number;
  height: number;
  cellsWide: number;
  cellsHigh: number;
}

export interface VerifiedSmMapGeneratorManifest {
  schemaVersion: 3;
  gameVersion: string;
  generator: "tools/vendor/cli.ts";
  sourceRepository: typeof SOURCE_REPOSITORY;
  upstreamVersion: typeof EXPECTED_UPSTREAM_VERSION;
  sourceArchiveHash: typeof EXPECTED_ARCHIVE_HASH;
  license: VendorDataRecord & { spdx: "MIT" };
  resourceLocations: VendorDataRecord;
  images: VendorImageManifestRecord[];
  contentHash: string;
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, entry]) => entry !== undefined)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, entry]) => [key, canonicalize(entry)])
    );
  }
  return value;
}

async function sha256(value: string | Uint8Array): Promise<string> {
  const source = typeof value === "string" ? new TextEncoder().encode(value) : value;
  const digest = await crypto.subtle.digest("SHA-256", Uint8Array.from(source));
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function readBoundedVendorResponse(
  response: Response,
  maximumBytes: number,
  label: string
): Promise<Uint8Array> {
  const contentLength = response.headers.get("content-length");
  if (contentLength !== null) {
    const parsedLength = Number(contentLength);
    if (!Number.isSafeInteger(parsedLength) || parsedLength < 0 || parsedLength > maximumBytes) {
      throw new Error(`${label} exceeds its size limit.`);
    }
  }
  if (!response.body) {
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.byteLength > maximumBytes) throw new Error(`${label} exceeds its size limit.`);
    return bytes;
  }
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maximumBytes) {
      await reader.cancel();
      throw new Error(`${label} exceeds its size limit.`);
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isSafeRelativePath(path: string): boolean {
  return path.length > 0
    && !path.includes("\\")
    && !path.startsWith("/")
    && !/^[A-Za-z]:/.test(path)
    && path.split("/").every((part) => part !== "" && part !== "." && part !== "..");
}

function assertDataRecord(value: unknown): asserts value is VendorDataRecord {
  if (
    !isRecord(value)
    || !Number.isSafeInteger(value.bytes)
    || (value.bytes as number) <= 0
    || !HASH_PATTERN.test(String(value.contentHash ?? ""))
    || typeof value.path !== "string"
    || typeof value.sourcePath !== "string"
    || !isSafeRelativePath(value.path)
    || !isSafeRelativePath(value.sourcePath)
  ) {
    throw new Error("SM Map Generator manifest data record is malformed.");
  }
}

function assertImageRecord(value: unknown): asserts value is VendorImageManifestRecord {
  assertDataRecord(value);
  if (
    !isRecord(value)
    || !["single-cell", "multi-cell", "excavation-composite"].includes(String(value.role))
    || !Number.isSafeInteger(value.width)
    || !Number.isSafeInteger(value.height)
    || !Number.isSafeInteger(value.cellsWide)
    || !Number.isSafeInteger(value.cellsHigh)
    || (value.width as number) <= 0
    || (value.height as number) <= 0
    || (value.width as number) > MAX_VENDOR_IMAGE_DIMENSION
    || (value.height as number) > MAX_VENDOR_IMAGE_DIMENSION
    || (value.cellsWide as number) <= 0
    || (value.cellsHigh as number) <= 0
    || value.width !== (value.cellsWide as number) * VENDOR_IMAGE_CELL_PIXELS
    || value.height !== (value.cellsHigh as number) * VENDOR_IMAGE_CELL_PIXELS
    || (value.bytes as number) > MAX_VENDOR_IMAGE_BYTES
    || !String(value.path).endsWith(".webp")
  ) {
    throw new Error("SM Map Generator image role or dimensions are malformed.");
  }
  if (value.role === "excavation-composite") {
    if (
      "uuid" in value
      || value.path !== "assets/excavation_island_special.webp"
      || value.sourcePath !== "public/assets/excavation_island_special.webp"
      || value.width !== 3_200
      || value.height !== 3_200
      || value.cellsWide !== 32
      || value.cellsHigh !== 32
    ) throw new Error("SM Map Generator excavation composite is malformed.");
    return;
  }
  if (typeof value.uuid !== "string" || !UUID_PATTERN.test(value.uuid)) {
    throw new Error("SM Map Generator image UUID is malformed.");
  }
  const expectedPath = value.role === "single-cell"
    ? `assets/tiles/${value.uuid}.webp`
    : `assets/${value.uuid}.webp`;
  if (
    value.path !== expectedPath
    || value.sourcePath !== `public/${expectedPath}`
    || (value.role === "single-cell"
      && (value.width !== 100 || value.height !== 100 || value.cellsWide !== 1 || value.cellsHigh !== 1))
    || (value.role === "multi-cell"
      && (value.cellsWide as number) < 2
      && (value.cellsHigh as number) < 2)
  ) throw new Error("SM Map Generator image path or dimensions are malformed.");
}

function assertManifestShape(value: unknown): asserts value is VerifiedSmMapGeneratorManifest {
  if (!isRecord(value)) throw new Error("SM Map Generator manifest is malformed.");
  if (
    value.schemaVersion !== 3
    || value.generator !== "tools/vendor/cli.ts"
    || value.sourceRepository !== SOURCE_REPOSITORY
    || value.upstreamVersion !== EXPECTED_UPSTREAM_VERSION
    || value.sourceArchiveHash !== EXPECTED_ARCHIVE_HASH
    || typeof value.gameVersion !== "string"
    || !HASH_PATTERN.test(String(value.contentHash ?? ""))
    || !Array.isArray(value.images)
    || value.images.length !== MAX_VENDOR_IMAGE_COUNT
  ) throw new Error("SM Map Generator manifest schema is malformed.");
  assertDataRecord(value.license);
  assertDataRecord(value.resourceLocations);
  if (
    (value.license as VendorDataRecord & { spdx?: unknown }).spdx !== "MIT"
    || value.license.path !== "LICENSE"
    || value.license.sourcePath !== "LICENSE"
    || value.license.contentHash !== EXPECTED_LICENSE_HASH
    || value.resourceLocations.path !== "resource-locations.json"
    || value.resourceLocations.sourcePath !== "public/runtime/data/all_resource_locations.json"
    || value.resourceLocations.bytes > MAX_VENDOR_RESOURCE_BYTES
  ) throw new Error("SM Map Generator license or marker record is malformed.");
  const uuids = new Set<string>();
  const paths = new Set<string>();
  let excavationCount = 0;
  for (const image of value.images) {
    assertImageRecord(image);
    if (paths.has(image.path)) throw new Error(`Duplicate vendor image path: ${image.path}`);
    paths.add(image.path);
    if (image.uuid) {
      if (uuids.has(image.uuid)) throw new Error(`Duplicate vendor image UUID: ${image.uuid}`);
      uuids.add(image.uuid);
    }
    if (image.role === "excavation-composite") excavationCount += 1;
  }
  if (excavationCount !== 1) throw new Error("SM Map Generator excavation composite is missing.");
}

export function resolveSmMapGeneratorAssetUrl(
  manifestUrl: string,
  path: string
): string {
  if (!isSafeRelativePath(path)) throw new Error("SM Map Generator asset path is unsafe.");
  const syntheticOrigin = "https://sm-map-generator.invalid";
  const manifest = new URL(manifestUrl, syntheticOrigin);
  const directory = new URL(".", manifest);
  const asset = new URL(path, directory);
  if (asset.origin !== directory.origin || !asset.pathname.startsWith(directory.pathname)) {
    throw new Error("SM Map Generator asset path escapes its manifest directory.");
  }
  return manifestUrl.startsWith("http://") || manifestUrl.startsWith("https://")
    ? asset.href
    : `${asset.pathname}${asset.search}`;
}

export async function loadVerifiedSmMapGeneratorManifest(
  manifestUrl: string,
  fetcher: typeof fetch = fetch
): Promise<VerifiedSmMapGeneratorManifest | undefined> {
  const response = await fetcher(manifestUrl);
  if (response.status === 404) return undefined;
  if (!response.ok) throw new Error(`Unable to load SM Map Generator manifest: ${response.status}.`);
  const bytes = await readBoundedVendorResponse(
    response,
    MAX_VENDOR_MANIFEST_BYTES,
    "SM Map Generator manifest"
  );
  let manifest: unknown;
  try {
    manifest = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch (error) {
    throw new Error("SM Map Generator manifest is malformed.", { cause: error });
  }
  assertManifestShape(manifest);
  assertSupportedGameVersion(manifest.gameVersion);
  const { contentHash, ...unsigned } = manifest;
  const actualHash = await sha256(`${JSON.stringify(canonicalize(unsigned), null, 2)}\n`);
  if (actualHash !== contentHash) {
    throw new Error("SM Map Generator manifest failed its integrity check.");
  }
  return manifest;
}

export async function loadSmMapGeneratorResourceDocument(
  manifestUrl: string,
  fetcher: typeof fetch = fetch
): Promise<string | undefined> {
  const manifest = await loadVerifiedSmMapGeneratorManifest(manifestUrl, fetcher);
  if (!manifest) return undefined;
  const descriptor = manifest.resourceLocations;
  const response = await fetcher(resolveSmMapGeneratorAssetUrl(manifestUrl, descriptor.path));
  if (!response.ok) throw new Error(`Unable to load marker catalog: ${response.status}.`);
  const bytes = await readBoundedVendorResponse(
    response,
    MAX_VENDOR_RESOURCE_BYTES,
    "Marker catalog"
  );
  if (bytes.byteLength !== descriptor.bytes || await sha256(bytes) !== descriptor.contentHash) {
    throw new Error("Resource marker catalog failed its integrity check.");
  }
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch (error) {
    throw new Error("Marker catalog is malformed.", { cause: error });
  }
}
