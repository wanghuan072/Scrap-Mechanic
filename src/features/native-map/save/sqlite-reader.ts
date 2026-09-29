import initSqlJs from "sql.js";
import { SaveParseError } from "./save-errors";
import { readSaveRecordsWithSql, type SaveRecords, type SqlDatabaseConstructor } from "./sqlite-records";

export type { SaveRecords } from "./sqlite-records";

interface SqlJs {
  Database: SqlDatabaseConstructor;
}

let sqlPromise: Promise<SqlJs> | undefined;

const wasmUrl = "/map-assets/sql-wasm.wasm";

function getSql(): Promise<SqlJs> {
  sqlPromise ??= initSqlJs({ locateFile: () => wasmUrl }) as unknown as Promise<SqlJs>;
  return sqlPromise;
}

function notSurvival(message: string): SaveParseError {
  return new SaveParseError("NOT_SURVIVAL_SAVE", { message });
}

export async function readSaveRecords(bytes: Uint8Array): Promise<SaveRecords> {
  try {
    const SQL = await getSql();
    return readSaveRecordsWithSql(SQL.Database, bytes);
  } catch (error) {
    if (error instanceof SaveParseError) {
      throw error;
    }
    throw notSurvival("Unable to read this Survival save.");
  }
}
