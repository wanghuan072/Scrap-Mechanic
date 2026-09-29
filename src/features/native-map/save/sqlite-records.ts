import { SaveParseError } from "./save-errors";
import { isTerrainScriptData } from "./script-data-decoder";
import { decodeWorldDescriptors } from "./world-descriptor-decoder";
import {
  createSaveStorageRecords,
  type SaveStorageRecords,
  type ScriptableObjectRecord,
  type StorageRecord
} from "./storage-records";

export const MAX_PLAYER_BODIES = 4_096;
export const MAX_PLAYER_SHAPES = 100_000;
export const MAX_PLAYER_ROW_BYTES = 2 * 1024 * 1024;
export const MAX_PLAYER_TOTAL_BYTES = 64 * 1024 * 1024;
export const MAX_STORAGE_ROWS = 4_096;
export const MAX_STORAGE_IDENTIFIER_BYTES = 64;
export const MAX_STORAGE_ROW_BYTES = 2 * 1024 * 1024;
export const MAX_STORAGE_TOTAL_BYTES = 16 * 1024 * 1024;
export const MAX_SCRIPTABLE_OBJECTS = 4_096;

export interface PlayerBodyRow {
  id: number;
  worldId: number;
  data: Uint8Array;
}

export interface PlayerBoundsRow {
  id: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface PlayerShapeRow {
  id: number;
  bodyId: number;
  data: Uint8Array;
}

export interface PlayerRows {
  bodies: PlayerBodyRow[];
  bounds: PlayerBoundsRow[];
  shapes: PlayerShapeRow[];
  warnings: string[];
}

export interface SaveRecords {
  saveVersion: number;
  seed: number;
  terrainCandidates: ReadonlyMap<number, Uint8Array[]>;
  worldDescriptors: Uint8Array[];
  playerRows: PlayerRows;
  storage: SaveStorageRecords;
}

export interface SqlDatabaseConstructor {
  new (data?: Uint8Array): {
    close(): void;
    exec(sql: string, params?: unknown[]): Array<{
      columns: string[];
      values: unknown[][];
    }>;
    prepare(sql: string): {
      bind(values?: unknown[]): boolean;
      free(): boolean;
      get(): unknown[];
      step(): boolean;
    };
  };
}

type SqlDatabase = InstanceType<SqlDatabaseConstructor>;

const MAX_TERRAIN_WORLDS = 32;
const MAX_CANDIDATES_PER_WORLD = 8;
const MAX_TERRAIN_CANDIDATES = 64;
const MAX_SCRIPT_ROWS_PER_WORLD = 256;
const MAX_SCRIPT_ROWS = 1024;
const SCRIPT_ROW_QUERY_LIMIT = MAX_SCRIPT_ROWS_PER_WORLD;
const MAX_TERRAIN_BLOB_BYTES = 2 * 1024 * 1024;
const MAX_TERRAIN_TOTAL_BYTES = 12 * 1024 * 1024;
const MAX_WORLD_DESCRIPTORS = 64;
const MAX_DESCRIPTOR_BLOB_BYTES = 256 * 1024;
const MAX_DESCRIPTOR_TOTAL_BYTES = 1024 * 1024;

function notSurvival(message: string): SaveParseError {
  return new SaveParseError("NOT_SURVIVAL_SAVE", { message });
}

function isInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value);
}

function readSingleGameRow(database: SqlDatabase): { saveVersion: number; seed: number } {
  const results = database.exec("SELECT savegameversion, seed FROM Game");
  const rows = results[0]?.values ?? [];
  if (results.length !== 1 || rows.length !== 1) {
    throw notSurvival("Expected exactly one Game row.");
  }
  const [saveVersion, seed] = rows[0] ?? [];
  if (!isInteger(saveVersion) || !isInteger(seed)) {
    throw notSurvival("Game version and seed must be integers.");
  }
  if (saveVersion !== 28) {
    throw new SaveParseError("UNSUPPORTED_SAVE_VERSION", {
      message: "This save version is not supported."
    });
  }
  return { saveVersion, seed };
}

function requireTables(database: SqlDatabase): Set<unknown> {
  const results = database.exec(
    "SELECT name FROM sqlite_master WHERE type = 'table'"
  );
  const names = new Set((results[0]?.values ?? []).map((row) => row[0]));
  if (!names.has("Game") || !names.has("ScriptData") || !names.has("GenericData")) {
    throw notSurvival("Expected Game, ScriptData, and GenericData tables.");
  }
  return names;
}

function numeric(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function playerLimit(message: string): never {
  throw notSurvival(message);
}

function readPlayerRows(
  database: SqlDatabase,
  tables: Set<unknown>,
  worldDescriptors: Uint8Array[]
): PlayerRows {
  const warnings: string[] = [];
  if (!tables.has("RigidBody") || !tables.has("ChildShape")) {
    return {
      bodies: [], bounds: [], shapes: [],
      warnings: ["Player-content tables are not present in this save."]
    };
  }
  const overworldId = decodeWorldDescriptors(worldDescriptors)
    .find((record) => record.kind === "surface")?.worldId ?? 1;
  const readRows = (
    sql: string,
    parameters: unknown[],
    maxRows: number,
    countMessage: string
  ): unknown[][] => {
    const statement = database.prepare(sql);
    const rows: unknown[][] = [];
    try {
      statement.bind(parameters);
      while (statement.step()) {
        if (rows.length >= maxRows) playerLimit(countMessage);
        rows.push(statement.get());
      }
    } finally {
      statement.free();
    }
    return rows;
  };

  const bodyLengths = readRows(
    `SELECT id, worldId, length(data) FROM RigidBody
      WHERE worldId = ? AND data IS NOT NULL ORDER BY id LIMIT ?`,
    [overworldId, MAX_PLAYER_BODIES + 1],
    MAX_PLAYER_BODIES,
    "RigidBody exceeds the body-count limit."
  );
  const shapeLengths = readRows(
    `SELECT c.id, c.bodyId, length(c.data) FROM ChildShape c
      JOIN RigidBody b ON b.id = c.bodyId
      WHERE b.worldId = ? AND c.data IS NOT NULL ORDER BY c.id LIMIT ?`,
    [overworldId, MAX_PLAYER_SHAPES + 1],
    MAX_PLAYER_SHAPES,
    "ChildShape exceeds the shape-count limit."
  );
  let totalBytes = 0;
  for (const row of [...bodyLengths, ...shapeLengths]) {
    const length = row[2];
    if (!isInteger(length) || length <= 0 || length > MAX_PLAYER_ROW_BYTES) {
      playerLimit("Player content exceeds the per-row byte limit.");
    }
    totalBytes += length;
    if (totalBytes > MAX_PLAYER_TOTAL_BYTES) {
      playerLimit("ChildShape bytes exceed the shape-byte limit.");
    }
  }

  const bodyData = readRows(
    `SELECT id, worldId, data FROM RigidBody
      WHERE worldId = ? AND data IS NOT NULL ORDER BY id LIMIT ?`,
    [overworldId, MAX_PLAYER_BODIES + 1],
    MAX_PLAYER_BODIES,
    "RigidBody exceeds the body-count limit."
  );
  const shapeData = readRows(
    `SELECT c.id, c.bodyId, c.data FROM ChildShape c
      JOIN RigidBody b ON b.id = c.bodyId
      WHERE b.worldId = ? AND c.data IS NOT NULL ORDER BY c.id LIMIT ?`,
    [overworldId, MAX_PLAYER_SHAPES + 1],
    MAX_PLAYER_SHAPES,
    "ChildShape exceeds the shape-count limit."
  );
  const toBlob = (row: unknown[], expected: unknown[], label: string): Uint8Array => {
    const value = row[2];
    if (!(value instanceof Uint8Array) || value.byteLength !== expected[2]) {
      playerLimit(`${label} length changed during the read.`);
    }
    return value;
  };
  if (bodyData.length !== bodyLengths.length || shapeData.length !== shapeLengths.length) {
    playerLimit("Player-content rows changed during the read.");
  }
  const bodies = bodyData.map((row, index): PlayerBodyRow => {
    if (!isInteger(row[0]) || !isInteger(row[1])) playerLimit("RigidBody IDs must be integers.");
    return { id: row[0], worldId: row[1], data: toBlob(row, bodyLengths[index]!, "RigidBody") };
  });
  const shapes = shapeData.map((row, index): PlayerShapeRow => {
    if (!isInteger(row[0]) || !isInteger(row[1])) playerLimit("ChildShape IDs must be integers.");
    return { id: row[0], bodyId: row[1], data: toBlob(row, shapeLengths[index]!, "ChildShape") };
  });
  const bounds: PlayerBoundsRow[] = [];
  if (tables.has("RigidBodyBounds")) {
    try {
      const rows = readRows(
        `SELECT r.id, r.minX, r.maxX, r.minY, r.maxY FROM RigidBodyBounds r
          JOIN RigidBody b ON b.id = r.id WHERE b.worldId = ? ORDER BY r.id LIMIT ?`,
        [overworldId, MAX_PLAYER_BODIES + 1],
        MAX_PLAYER_BODIES,
        "RigidBodyBounds exceeds the body-count limit."
      );
      for (const row of rows) {
        if (!isInteger(row[0]) || !row.slice(1).every(numeric)) continue;
        bounds.push({
          id: row[0], minX: row[1] as number, maxX: row[2] as number,
          minY: row[3] as number, maxY: row[4] as number
        });
      }
    } catch {
      warnings.push("RigidBodyBounds could not be read; body transforms remain available.");
    }
  }
  return { bodies, bounds, shapes, warnings };
}

function readOptionalPlayerRows(
  database: SqlDatabase,
  tables: Set<unknown>,
  worldDescriptors: Uint8Array[]
): PlayerRows {
  try {
    return readPlayerRows(database, tables, worldDescriptors);
  } catch (error) {
    return {
      bodies: [],
      bounds: [],
      shapes: [],
      warnings: [
        `Player content was ignored: ${error instanceof Error ? error.message : String(error)}`
      ]
    };
  }
}

function tableColumns(database: SqlDatabase, table: string): Set<string> {
  const safeTable = table.replaceAll('"', '""');
  const rows = database.exec(`PRAGMA table_info("${safeTable}")`)[0]?.values ?? [];
  return new Set(rows.map((row) => row[1]).filter((value): value is string => typeof value === "string"));
}

interface StorageBudget {
  rows: number;
  bytes: number;
}

function assertStorageLength(value: unknown, maximum: number, label: string): asserts value is number {
  if (!isInteger(value) || value <= 0 || value > maximum) {
    throw new Error(`${label} exceeds the safe limit.`);
  }
}

function addStorageBudget(budget: StorageBudget, bytes: number): void {
  if (budget.rows >= MAX_STORAGE_ROWS) throw new Error("Storage exceeds the row-count limit.");
  if (bytes > MAX_STORAGE_TOTAL_BYTES - budget.bytes) {
    throw new Error("Storage exceeds the aggregate byte limit.");
  }
  budget.rows += 1;
  budget.bytes += bytes;
}

function readStorageTable(
  database: SqlDatabase,
  table: StorageRecord["table"],
  budget: StorageBudget
): StorageRecord[] {
  const hasWorldId = table === "ScriptData";
  const where = hasWorldId
    ? ` WHERE upper(hex(key)) IN ${STORAGE_CHANNEL_SQL} OR length(key) = 4`
    : "";
  const lengthColumns = hasWorldId
    ? "rowid, length(uid), length(key), worldId, flags, length(data)"
    : "rowid, length(uid), length(key), length(data)";
  const dataColumns = hasWorldId
    ? "rowid, uid, key, worldId, flags, data"
    : "rowid, uid, key, data";
  const readRows = (sql: string): unknown[][] => {
    const statement = database.prepare(sql);
    const rows: unknown[][] = [];
    try {
      statement.bind([MAX_STORAGE_ROWS + 1]);
      while (statement.step()) {
        if (rows.length >= MAX_STORAGE_ROWS) throw new Error(`${table} exceeds the row-count limit.`);
        rows.push(statement.get());
      }
    } finally {
      statement.free();
    }
    return rows;
  };
  const lengths = readRows(
    `SELECT ${lengthColumns} FROM ${table}${where} ORDER BY rowid LIMIT ?`
  );
  for (const row of lengths) {
    const uidLength = row[1];
    const keyLength = row[2];
    const dataLength = row[hasWorldId ? 5 : 3];
    assertStorageLength(uidLength, MAX_STORAGE_IDENTIFIER_BYTES, `${table} UID`);
    assertStorageLength(keyLength, MAX_STORAGE_IDENTIFIER_BYTES, `${table} key`);
    assertStorageLength(dataLength, MAX_STORAGE_ROW_BYTES, `${table} data`);
    addStorageBudget(budget, uidLength + keyLength + dataLength);
  }

  const dataRows = readRows(
    `SELECT ${dataColumns} FROM ${table}${where} ORDER BY rowid LIMIT ?`
  );
  if (dataRows.length !== lengths.length) throw new Error(`${table} rows changed during the read.`);
  return dataRows.map((row, index): StorageRecord => {
    const expected = lengths[index]!;
    if (!isInteger(row[0]) || row[0] !== expected[0]) {
      throw new Error(`${table} identity changed during the read.`);
    }
    const uid = row[1];
    const key = row[2];
    const dataIndex = hasWorldId ? 5 : 3;
    const data = row[dataIndex];
    if (!(uid instanceof Uint8Array) || uid.byteLength !== expected[1]) {
      throw new Error(`${table} UID length changed during the read.`);
    }
    if (!(key instanceof Uint8Array) || key.byteLength !== expected[2]) {
      throw new Error(`${table} key length changed during the read.`);
    }
    if (!(data instanceof Uint8Array) || data.byteLength !== expected[hasWorldId ? 5 : 3]) {
      throw new Error(`${table} data length changed during the read.`);
    }
    if (hasWorldId) {
      if (!isInteger(row[3]) || row[3] < 0 || row[3] > 65535) {
        throw new Error("ScriptData worldId must be an unsigned 16-bit integer.");
      }
      if (!isInteger(row[4])) throw new Error("ScriptData flags must be an integer.");
      return {
        table,
        uid: Uint8Array.from(uid),
        key: Uint8Array.from(key),
        worldId: row[3],
        flags: row[4],
        data: Uint8Array.from(data)
      };
    }
    return {
      table,
      uid: Uint8Array.from(uid),
      key: Uint8Array.from(key),
      flags: 0,
      data: Uint8Array.from(data)
    };
  });
}

function readScriptableObjects(
  database: SqlDatabase,
  budget: StorageBudget
): ScriptableObjectRecord[] {
  const readRows = (columns: string): unknown[][] => {
    const statement = database.prepare(
      `SELECT ${columns} FROM ScriptableObject ORDER BY id LIMIT ?`
    );
    const rows: unknown[][] = [];
    try {
      statement.bind([MAX_SCRIPTABLE_OBJECTS + 1]);
      while (statement.step()) {
        if (rows.length >= MAX_SCRIPTABLE_OBJECTS) {
          throw new Error("ScriptableObject exceeds the row-count limit.");
        }
        rows.push(statement.get());
      }
    } finally {
      statement.free();
    }
    return rows;
  };
  const lengths = readRows("id, worldId, length(data)");
  for (const row of lengths) {
    assertStorageLength(row[2], MAX_STORAGE_ROW_BYTES, "ScriptableObject data");
    addStorageBudget(budget, row[2]);
  }
  const dataRows = readRows("id, worldId, data");
  if (dataRows.length !== lengths.length) throw new Error("ScriptableObject rows changed during the read.");
  return dataRows.map((row, index) => {
    const expected = lengths[index]!;
    if (!isInteger(row[0]) || !isInteger(row[1])) {
      throw new Error("ScriptableObject IDs must be integers.");
    }
    if (row[0] !== expected[0] || row[1] !== expected[1]) {
      throw new Error("ScriptableObject identity changed during the read.");
    }
    const data = row[2];
    if (!(data instanceof Uint8Array) || data.byteLength !== expected[2]) {
      throw new Error("ScriptableObject data length changed during the read.");
    }
    return { id: row[0], worldId: row[1], data: Uint8Array.from(data) };
  });
}

function readOptionalStorage(database: SqlDatabase, tables: Set<unknown>): SaveStorageRecords {
  const warnings: string[] = [];
  const records: StorageRecord[] = [];
  const scriptableObjects: ScriptableObjectRecord[] = [];
  const budget: StorageBudget = { rows: 0, bytes: 0 };
  const readTable = (table: StorageRecord["table"], requiredColumns: string[]): void => {
    if (!tables.has(table)) return;
    const columns = tableColumns(database, table);
    if (!requiredColumns.every((column) => columns.has(column))) return;
    try {
      records.push(...readStorageTable(database, table, budget));
    } catch (error) {
      warnings.push(`${table} progress was ignored: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  readTable("ScriptData", ["uid", "key", "worldId", "flags", "data"]);
  readTable("ScriptDataUuid", ["uid", "key", "data"]);
  if (tables.has("ScriptableObject")) {
    const columns = tableColumns(database, "ScriptableObject");
    if (["id", "worldId", "data"].every((column) => columns.has(column))) {
      try {
        scriptableObjects.push(...readScriptableObjects(database, budget));
      } catch (error) {
        warnings.push(`ScriptableObject progress was ignored: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }
  try {
    return createSaveStorageRecords(records, scriptableObjects, warnings);
  } catch (error) {
    return createSaveStorageRecords([], [], [
      ...warnings,
      `Storage progress was ignored: ${error instanceof Error ? error.message : String(error)}`
    ]);
  }
}

const STORAGE_CHANNEL_SQL = "('4C554100000001082C','4C554100000001083A','4C554100000001083C','4C554100000001084F')";
const NON_TERRAIN_STORAGE_SQL = `upper(hex(key)) IN ${STORAGE_CHANNEL_SQL}`;

function readTerrainWorldIds(database: SqlDatabase, hasStorageKey: boolean): number[] {
  const statement = database.prepare(
    `SELECT DISTINCT worldId
       FROM ScriptData
      WHERE length(data) > 0${hasStorageKey ? ` AND NOT ${NON_TERRAIN_STORAGE_SQL}` : ""}
      ORDER BY worldId
      LIMIT ?`
  );
  const worldIds: number[] = [];
  try {
    statement.bind([MAX_TERRAIN_WORLDS + 1]);
    while (statement.step()) {
      const value = statement.get()[0];
      if (!isInteger(value) || value < 0 || value > 65535) {
        throw notSurvival("ScriptData world IDs must be unsigned 16-bit integers.");
      }
      if (worldIds.length >= MAX_TERRAIN_WORLDS) {
        throw notSurvival("ScriptData exceeds the safe world-count limit.");
      }
      worldIds.push(value);
    }
  } finally {
    statement.free();
  }
  return worldIds;
}

function readTerrainCandidates(
  database: SqlDatabase,
  hasStorageKey: boolean
): ReadonlyMap<number, Uint8Array[]> {
  const worldIds = readTerrainWorldIds(database, hasStorageKey);
  if (worldIds.length === 0) {
    throw new SaveParseError("MISSING_SURFACE_DATA", {
      message: "No terrain data was found in this save."
    });
  }
  const terrainCandidates = new Map<number, Uint8Array[]>();
  let totalRows = 0;
  let totalCandidates = 0;
  let totalBytes = 0;

  for (const worldId of worldIds) {
    const lengthsStatement = database.prepare(
      `SELECT length(data)
       FROM ScriptData
        WHERE worldId = ? AND length(data) > 0${hasStorageKey ? ` AND NOT ${NON_TERRAIN_STORAGE_SQL}` : ""}
        ORDER BY length(data) DESC
        LIMIT ?`
    );
    const lengths: number[] = [];
    try {
      lengthsStatement.bind([worldId, SCRIPT_ROW_QUERY_LIMIT]);
      while (lengthsStatement.step()) {
        const value = lengthsStatement.get()[0];
        if (!isInteger(value) || value <= 0) {
          throw notSurvival("ScriptData length must be a positive integer.");
        }
        if (lengths.length >= MAX_SCRIPT_ROWS_PER_WORLD) {
          throw notSurvival("ScriptData exceeds the safe per-world row count.");
        }
        if (value > MAX_TERRAIN_BLOB_BYTES) {
          throw notSurvival("ScriptData exceeds the safe per-blob byte limit.");
        }
        if (
          totalRows >= MAX_SCRIPT_ROWS
          || value > MAX_TERRAIN_TOTAL_BYTES - totalBytes
        ) {
          throw notSurvival("ScriptData exceeds the safe row budget.");
        }
        lengths.push(value);
        totalRows += 1;
        totalBytes += value;
      }
    } finally {
      lengthsStatement.free();
    }

    const statement = database.prepare(
      `SELECT data
       FROM ScriptData
        WHERE worldId = ? AND length(data) > 0${hasStorageKey ? ` AND NOT ${NON_TERRAIN_STORAGE_SQL}` : ""}
        ORDER BY length(data) DESC
        LIMIT ?`
    );
    const rows: Uint8Array[] = [];
    try {
      statement.bind([worldId, SCRIPT_ROW_QUERY_LIMIT]);
      while (statement.step()) {
        if (rows.length >= lengths.length) {
          throw notSurvival("ScriptData exceeds the safe row count.");
        }
        const value = statement.get()[0];
        if (!(value instanceof Uint8Array)) {
          throw notSurvival("ScriptData must be stored as a blob.");
        }
        if (value.byteLength !== lengths[rows.length]) {
          throw notSurvival("ScriptData length changed during the read.");
        }
        rows.push(value);
      }
    } finally {
      statement.free();
    }
    if (rows.length !== lengths.length) {
      throw notSurvival("ScriptData rows changed during the read.");
    }

    const candidates: Uint8Array[] = [];
    const fallbackRows: Uint8Array[] = [];
    for (const row of rows) {
      if (isTerrainScriptData(row, worldId)) {
        if (candidates.length >= MAX_CANDIDATES_PER_WORLD) {
          throw notSurvival("ScriptData exceeds the safe per-world candidate count.");
        }
        if (totalCandidates >= MAX_TERRAIN_CANDIDATES) {
          throw notSurvival("ScriptData exceeds the safe total candidate count.");
        }
        candidates.push(row);
        totalCandidates += 1;
      } else if (fallbackRows.length < MAX_CANDIDATES_PER_WORLD) {
        fallbackRows.push(row);
      }
    }
    candidates.push(...fallbackRows.slice(0, MAX_CANDIDATES_PER_WORLD - candidates.length));
    if (candidates.length > 0) terrainCandidates.set(worldId, candidates);
  }
  return terrainCandidates;
}

function readWorldDescriptors(database: SqlDatabase): Uint8Array[] {
  const lengthsStatement = database.prepare(
    `SELECT length(data)
       FROM GenericData
      WHERE length(data) > 0
      ORDER BY rowid
      LIMIT ?`
  );
  const lengths: number[] = [];
  let totalBytes = 0;
  try {
    lengthsStatement.bind([MAX_WORLD_DESCRIPTORS + 1]);
    while (lengthsStatement.step()) {
      const value = lengthsStatement.get()[0];
      if (!isInteger(value) || value <= 0) {
        throw notSurvival("GenericData length must be a positive integer.");
      }
      if (lengths.length >= MAX_WORLD_DESCRIPTORS) {
        throw notSurvival("GenericData exceeds the safe descriptor-count limit.");
      }
      if (value > MAX_DESCRIPTOR_BLOB_BYTES) {
        throw notSurvival("GenericData exceeds the safe per-blob byte limit.");
      }
      if (value > MAX_DESCRIPTOR_TOTAL_BYTES - totalBytes) {
        throw notSurvival("GenericData exceeds the safe total-byte limit.");
      }
      lengths.push(value);
      totalBytes += value;
    }
  } finally {
    lengthsStatement.free();
  }

  const statement = database.prepare(
    `SELECT data
       FROM GenericData
      WHERE length(data) > 0
      ORDER BY rowid
      LIMIT ?`
  );
  const descriptors: Uint8Array[] = [];
  try {
    statement.bind([MAX_WORLD_DESCRIPTORS + 1]);
    while (statement.step()) {
      if (descriptors.length >= lengths.length) {
        throw notSurvival("GenericData exceeds the safe descriptor count.");
      }
      const value = statement.get()[0];
      if (!(value instanceof Uint8Array)) {
        throw notSurvival("GenericData must be stored as a blob.");
      }
      if (value.byteLength !== lengths[descriptors.length]) {
        throw notSurvival("GenericData length changed during the read.");
      }
      descriptors.push(value);
    }
  } finally {
    statement.free();
  }
  if (descriptors.length !== lengths.length) {
    throw notSurvival("GenericData rows changed during the read.");
  }
  return descriptors;
}

export function readSaveRecordsWithSql(
  Database: SqlDatabaseConstructor,
  bytes: Uint8Array
): SaveRecords {
  const database = new Database(bytes);
  try {
    const tables = requireTables(database);
    const scriptDataColumns = tableColumns(database, "ScriptData");
    const { saveVersion, seed } = readSingleGameRow(database);
    const worldDescriptors = readWorldDescriptors(database);
    return {
      saveVersion,
      seed,
      terrainCandidates: readTerrainCandidates(database, scriptDataColumns.has("key")),
      worldDescriptors,
      playerRows: readOptionalPlayerRows(database, tables, worldDescriptors),
      storage: readOptionalStorage(database, tables)
    };
  } finally {
    database.close();
  }
}
