import type { NormalizedPlayerContentTransfer } from "./save-protocol";
import type { PlayerRows } from "./sqlite-records";

const BODY_TAG = 0;
const WELDED_BODY = 1;
const MOVING_BODY = 2;
const SHAPE_TAG = 1;
const BLOCK_SHAPE = 31;
const PART_SHAPE = 32;
const METERS_PER_BLOCK = 0.25;
const MAX_SHAPE_AXIS_BLOCKS = 4096;

interface Body {
  id: number;
  kind: number;
  position: [number, number, number];
  rotation: [number, number, number, number];
}

function float(view: DataView, offset: number): number {
  return view.getFloat32(offset, false);
}

function decodeBody(id: number, data: Uint8Array): Body | undefined {
  if (data.byteLength < 55 || data[0] !== BODY_TAG) return undefined;
  const kind = data[1]!;
  if (kind !== WELDED_BODY && kind !== MOVING_BODY) return undefined;
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  if (view.getUint32(3, false) !== id) return undefined;
  const raw = [float(view, 27), float(view, 31), float(view, 35), float(view, 39)] as const;
  let rotation: [number, number, number, number] = kind === MOVING_BODY
    ? [...raw]
    : [raw[3], raw[2], raw[1], raw[0]];
  const position: [number, number, number] = [float(view, 43), float(view, 47), float(view, 51)];
  if ([...rotation, ...position].some((value) => !Number.isFinite(value))) return undefined;
  const magnitude = Math.hypot(...rotation);
  if (magnitude < 1e-6) return undefined;
  rotation = rotation.map((value) => value / magnitude) as [number, number, number, number];
  return { id, kind, position, rotation };
}

function rotate(
  [x, y, z]: [number, number, number],
  [qx, qy, qz, qw]: [number, number, number, number]
): [number, number, number] {
  const tx = 2 * (qy * z - qz * y);
  const ty = 2 * (qz * x - qx * z);
  const tz = 2 * (qx * y - qy * x);
  return [
    x + qw * tx + (qy * tz - qz * ty),
    y + qw * ty + (qz * tx - qx * tz),
    z + qw * tz + (qx * ty - qy * tx)
  ];
}

function canonicalUuid(bytes: Uint8Array): string {
  const hex = Array.from(bytes).reverse()
    .map((value) => value.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function emptyPlayerContent(warnings: string[] = []): NormalizedPlayerContentTransfer {
  return {
    bodyIds: new Uint32Array(),
    bodyKinds: new Uint8Array(),
    shapeBodyIndexes: new Uint32Array(),
    shapeUuidIndexes: new Uint16Array(),
    positions: new Float32Array(),
    rotations: new Float32Array(),
    sizes: new Float32Array(),
    colors: new Uint8Array(),
    footprintBounds: new Float32Array(),
    footprintOrder: new Uint32Array(),
    maxFootprintSpan: 0,
    uuids: [],
    skippedRecords: 0,
    warnings: [...warnings]
  };
}

export function decodePlayerContent(
  rows: PlayerRows,
  overworldId: number
): NormalizedPlayerContentTransfer {
  const bodyIds: number[] = [];
  const bodyKinds: number[] = [];
  const bodyById = new Map<number, { body: Body; index: number }>();
  let skippedRecords = 0;
  for (const row of rows.bodies) {
    if (row.worldId !== overworldId) continue;
    const body = decodeBody(row.id, row.data);
    if (!body) {
      skippedRecords += 1;
      continue;
    }
    const index = bodyIds.length;
    bodyIds.push(body.id);
    bodyKinds.push(body.kind);
    bodyById.set(body.id, { body, index });
  }

  const shapeBodyIndexes: number[] = [];
  const shapeUuidIndexes: number[] = [];
  const positions: number[] = [];
  const rotations: number[] = [];
  const sizes: number[] = [];
  const colors: number[] = [];
  const footprintBounds: number[] = [];
  const uuids: string[] = [];
  const uuidIndexes = new Map<string, number>();
  for (const row of rows.shapes) {
    const owner = bodyById.get(row.bodyId);
    if (!owner) {
      skippedRecords += 1;
      continue;
    }
    const data = row.data;
    if (data.byteLength < 42 || data[0] !== SHAPE_TAG) {
      skippedRecords += 1;
      continue;
    }
    const shapeKind = data[1]!;
    if (shapeKind !== BLOCK_SHAPE && shapeKind !== PART_SHAPE) {
      skippedRecords += 1;
      continue;
    }
    const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    const local: [number, number, number] = [
      view.getInt16(31, false) * METERS_PER_BLOCK,
      view.getInt16(33, false) * METERS_PER_BLOCK,
      view.getInt16(35, false) * METERS_PER_BLOCK
    ];
    const blockSize: [number, number, number] = shapeKind === BLOCK_SHAPE
      ? data.byteLength >= 47
        ? [view.getInt16(41, false), view.getInt16(43, false), view.getInt16(45, false)]
        : [0, 0, 0]
      : [1, 1, 1];
    if (blockSize.some((value) => value <= 0 || value > MAX_SHAPE_AXIS_BLOCKS)) {
      skippedRecords += 1;
      continue;
    }
    const uuid = canonicalUuid(data.subarray(11, 27));
    let uuidIndex = uuidIndexes.get(uuid);
    if (uuidIndex === undefined) {
      if (uuids.length >= 65536) {
        skippedRecords += 1;
        continue;
      }
      uuidIndex = uuids.length;
      uuids.push(uuid);
      uuidIndexes.set(uuid, uuidIndex);
    }
    const offset = rotate(local, owner.body.rotation);
    const worldPosition: [number, number, number] = [
      owner.body.position[0] + offset[0],
      owner.body.position[1] + offset[1],
      owner.body.position[2] + offset[2]
    ];
    const worldSize = blockSize.map((value) => value * METERS_PER_BLOCK) as [number, number, number];
    const corners: Array<[number, number, number]> = [];
    for (const x of [0, worldSize[0]]) {
      for (const y of [0, worldSize[1]]) {
        for (const z of [0, worldSize[2]]) {
          const corner = rotate([x, y, z], owner.body.rotation);
          corners.push([
            worldPosition[0] + corner[0],
            worldPosition[1] + corner[1],
            worldPosition[2] + corner[2]
          ]);
        }
      }
    }
    const xs = corners.map((point) => point[0]);
    const ys = corners.map((point) => point[1]);
    const zs = corners.map((point) => point[2]);
    footprintBounds.push(
      Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys), Math.max(...zs)
    );
    shapeBodyIndexes.push(owner.index);
    shapeUuidIndexes.push(uuidIndex);
    positions.push(
      ...worldPosition
    );
    rotations.push(...owner.body.rotation);
    sizes.push(...worldSize);
    colors.push(data[40]!, data[39]!, data[38]!, 255);
  }
  const footprintCount = footprintBounds.length / 5;
  const footprintOrder = Array.from({ length: footprintCount }, (_, index) => index)
    .sort((left, right) => footprintBounds[left * 5]! - footprintBounds[right * 5]!);
  let maxFootprintSpan = 0;
  for (let index = 0; index < footprintCount; index += 1) {
    maxFootprintSpan = Math.max(
      maxFootprintSpan,
      footprintBounds[index * 5 + 2]! - footprintBounds[index * 5]!,
      footprintBounds[index * 5 + 3]! - footprintBounds[index * 5 + 1]!
    );
  }
  return {
    bodyIds: Uint32Array.from(bodyIds),
    bodyKinds: Uint8Array.from(bodyKinds),
    shapeBodyIndexes: Uint32Array.from(shapeBodyIndexes),
    shapeUuidIndexes: Uint16Array.from(shapeUuidIndexes),
    positions: Float32Array.from(positions),
    rotations: Float32Array.from(rotations),
    sizes: Float32Array.from(sizes),
    colors: Uint8Array.from(colors),
    footprintBounds: Float32Array.from(footprintBounds),
    footprintOrder: Uint32Array.from(footprintOrder),
    maxFootprintSpan,
    uuids,
    skippedRecords,
    warnings: [...rows.warnings]
  };
}

export function playerContentTransferables(
  content: NormalizedPlayerContentTransfer
): Transferable[] {
  return [
    content.bodyIds.buffer,
    content.bodyKinds.buffer,
    content.shapeBodyIndexes.buffer,
    content.shapeUuidIndexes.buffer,
    content.positions.buffer,
    content.rotations.buffer,
    content.sizes.buffer,
    content.colors.buffer,
    content.footprintBounds.buffer,
    content.footprintOrder.buffer
  ];
}
