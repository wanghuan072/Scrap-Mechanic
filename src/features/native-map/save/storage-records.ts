export const SUPPORTED_STORAGE_CHANNELS = Object.freeze([44, 58, 60, 79] as const);

export interface StorageRecord {
  readonly table: "ScriptData" | "ScriptDataUuid";
  readonly uid: Uint8Array;
  readonly key: Uint8Array;
  readonly worldId?: number;
  readonly flags: number;
  readonly data: Uint8Array;
}

export interface ScriptableObjectRecord {
  readonly id: number;
  readonly worldId: number;
  readonly data: Uint8Array;
}

export interface SaveStorageRecords {
  readonly globalByChannel: ReadonlyMap<number, readonly StorageRecord[]>;
  readonly scriptableObjectsById: ReadonlyMap<number, ScriptableObjectRecord>;
  readonly objectStorage: readonly StorageRecord[];
  readonly warnings: readonly string[];
}

function bytesKey(value: Uint8Array): string {
  return [...value].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function decodeStorageChannelKey(value: Uint8Array): number | undefined {
  if (
    value.byteLength !== 9
    || value[0] !== 0x4c || value[1] !== 0x55 || value[2] !== 0x41
    || value[3] !== 0 || value[4] !== 0 || value[5] !== 0 || value[6] !== 1
    || value[7] !== 8
  ) return undefined;
  const channel = value[8]!;
  return (SUPPORTED_STORAGE_CHANNELS as readonly number[]).includes(channel)
    ? channel
    : undefined;
}

export function storageChannelKey(channel: number): Uint8Array {
  if (!Number.isInteger(channel) || channel < 0 || channel > 127) {
    throw new RangeError("Storage channel must fit the reviewed Lua int8 key shape.");
  }
  return new Uint8Array([0x4c, 0x55, 0x41, 0, 0, 0, 1, 8, channel]);
}

export function storageObjectKey(id: number): Uint8Array {
  if (!Number.isInteger(id) || id < 0 || id > 0xffff_ffff) {
    throw new RangeError("Storage object ID must be an unsigned 32-bit integer.");
  }
  const value = new Uint8Array(4);
  new DataView(value.buffer).setUint32(0, id, true);
  return value;
}

export function createSaveStorageRecords(
  records: readonly StorageRecord[],
  scriptableObjects: readonly ScriptableObjectRecord[],
  warnings: readonly string[]
): SaveStorageRecords {
  const identities = new Set<string>();
  const globalByChannel = new Map<number, StorageRecord[]>();
  const objectStorage: StorageRecord[] = [];
  const sortedRecords = [...records].sort((left, right) =>
    left.table.localeCompare(right.table)
      || (left.worldId ?? -1) - (right.worldId ?? -1)
      || bytesKey(left.uid).localeCompare(bytesKey(right.uid))
      || bytesKey(left.key).localeCompare(bytesKey(right.key))
  );
  for (const record of sortedRecords) {
    const identity = `${record.table}:${record.worldId ?? "global"}:${bytesKey(record.uid)}:${bytesKey(record.key)}`;
    if (identities.has(identity)) throw new Error(`Duplicate storage identity: ${identity}`);
    identities.add(identity);
    const channel = decodeStorageChannelKey(record.key);
    if (record.table === "ScriptDataUuid" || (channel === undefined && record.key.byteLength === 4)) {
      objectStorage.push(record);
    }
    if (channel !== undefined) {
      const entries = globalByChannel.get(channel) ?? [];
      entries.push(record);
      globalByChannel.set(channel, entries);
    }
  }

  const scriptableObjectsById = new Map<number, ScriptableObjectRecord>();
  for (const record of [...scriptableObjects].sort((left, right) => left.id - right.id)) {
    if (scriptableObjectsById.has(record.id)) {
      throw new Error(`Duplicate scriptable object ID: ${record.id}`);
    }
    scriptableObjectsById.set(record.id, record);
  }
  return {
    globalByChannel: new Map([...globalByChannel].sort(([left], [right]) => left - right)),
    scriptableObjectsById,
    objectStorage: Object.freeze(objectStorage),
    warnings: Object.freeze([...warnings])
  };
}
