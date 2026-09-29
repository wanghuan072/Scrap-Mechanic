import lz4 from "lz4js";
import { SaveParseError } from "./save-errors";

const UID_BYTES = 16;
const KEY_SIZE_OFFSET = UID_BYTES;
const KEY_OFFSET = KEY_SIZE_OFFSET + 2;
const TRAILER_BYTES = 2 + 1 + 4;
const MAX_KEY_BYTES = 256;
const COMPRESSED_FLAG = 0x02;

export const MAX_STORED_BLOB_BYTES = 2 * 1024 * 1024;
export const MAX_DECODED_STORED_BLOB_BYTES = 1024 * 1024;

export interface StoredBlob {
  worldId: number;
  flags: number;
  key: Uint8Array;
  data: Uint8Array;
}

export interface StoredBlobDecodeOptions {
  expectedWorldId?: number;
  maxStoredBytes?: number;
  maxDecodedBytes?: number;
  stage?: string;
}

function decodeError(stage: string, message: string, offset?: number): never {
  throw new SaveParseError("DECODE_FAILED", { stage, message, offset });
}

function decompressionError(stage: string, message: string, offset?: number): never {
  throw new SaveParseError("DECOMPRESSION_FAILED", { stage, message, offset });
}

function validateUuid(bytes: Uint8Array, stage: string): void {
  let nonZero = false;
  for (let index = 0; index < UID_BYTES; index += 1) {
    if (bytes[index] !== 0) {
      nonZero = true;
      break;
    }
  }
  if (!nonZero) decodeError(stage, "Stored blob UID must not be nil.", 0);
  const version = bytes[6]! >>> 4;
  if (version !== 4 && version !== 5) {
    decodeError(stage, `Stored blob UID has unsupported UUID version ${version}.`, 6);
  }
  if ((bytes[8]! & 0xc0) !== 0x80) {
    decodeError(stage, "Stored blob UID has an invalid RFC 4122 variant.", 8);
  }
}

function validateRawLz4(bytes: Uint8Array, maxDecodedBytes: number, stage: string): number {
  if (bytes.length === 0) decompressionError(stage, "Empty LZ4 payload.");
  let source = 0;
  let target = 0;
  while (source < bytes.length) {
    const tokenOffset = source;
    const token = bytes[source++]!;
    let literals = token >>> 4;
    if (literals === 15) {
      let extension: number;
      do {
        if (source >= bytes.length) {
          decompressionError(stage, "Truncated LZ4 literal length.", tokenOffset);
        }
        extension = bytes[source++]!;
        literals += extension;
      } while (extension === 255);
    }
    if (source + literals > bytes.length) {
      decompressionError(stage, "LZ4 literal overruns its payload.", source);
    }
    if (target + literals > maxDecodedBytes) {
      decompressionError(stage, "Stored blob exceeds the decoded-byte limit.", source);
    }
    source += literals;
    target += literals;
    if (source === bytes.length) {
      if (target === 0) decompressionError(stage, "Empty LZ4 output.");
      return target;
    }

    if (source + 2 > bytes.length) {
      decompressionError(stage, "Truncated LZ4 match offset.", source);
    }
    const matchOffset = bytes[source]! | (bytes[source + 1]! << 8);
    source += 2;
    if (matchOffset === 0 || matchOffset > target) {
      decompressionError(stage, "Invalid LZ4 match offset.", source - 2);
    }
    let matchLength = token & 15;
    if (matchLength === 15) {
      let extension: number;
      do {
        if (source >= bytes.length) {
          decompressionError(stage, "Truncated LZ4 match length.", source);
        }
        extension = bytes[source++]!;
        matchLength += extension;
      } while (extension === 255);
    }
    matchLength += 4;
    if (target + matchLength > maxDecodedBytes) {
      decompressionError(stage, "Stored blob exceeds the decoded-byte limit.", source);
    }
    target += matchLength;
  }
  return decompressionError(stage, "Empty LZ4 payload.");
}

function decompressStrict(
  payload: Uint8Array,
  maxDecodedBytes: number,
  stage: string
): Uint8Array {
  const expectedLength = validateRawLz4(payload, maxDecodedBytes, stage);
  const output = new Uint8Array(expectedLength);
  let written: number;
  try {
    written = lz4.decompressBlock(payload, output, 0, payload.length, 0);
  } catch {
    return decompressionError(stage, "Unable to decompress the stored LZ4 block.");
  }
  if (written !== expectedLength) {
    return decompressionError(stage, "LZ4 output length does not match the validated block.");
  }
  return output;
}

export function decodeStoredBlob(
  blob: Uint8Array,
  options: StoredBlobDecodeOptions = {}
): StoredBlob {
  const stage = options.stage ?? "stored-blob";
  const maxStoredBytes = options.maxStoredBytes ?? MAX_STORED_BLOB_BYTES;
  const maxDecodedBytes = options.maxDecodedBytes ?? MAX_DECODED_STORED_BLOB_BYTES;
  if (blob.byteLength < KEY_OFFSET + TRAILER_BYTES) {
    return decodeError(stage, "Stored blob wrapper is truncated.", blob.byteLength);
  }
  validateUuid(blob, stage);
  const view = new DataView(blob.buffer, blob.byteOffset, blob.byteLength);
  const keySize = view.getUint16(KEY_SIZE_OFFSET, false);
  if (keySize === 0 || keySize > MAX_KEY_BYTES) {
    return decodeError(stage, `Unsupported stored blob key size ${keySize}.`, KEY_SIZE_OFFSET);
  }
  const headerBytes = KEY_OFFSET + keySize + TRAILER_BYTES;
  if (headerBytes > blob.byteLength) {
    return decodeError(stage, "Stored blob wrapper key is truncated.", KEY_SIZE_OFFSET);
  }
  const worldIdOffset = KEY_OFFSET + keySize;
  const worldId = view.getUint16(worldIdOffset, false);
  if (options.expectedWorldId !== undefined && worldId !== options.expectedWorldId) {
    return decodeError(
      stage,
      `Stored blob world ID ${worldId} does not match database world ID ${options.expectedWorldId}.`,
      worldIdOffset
    );
  }
  const flags = blob[worldIdOffset + 2]!;
  const storedSizeOffset = worldIdOffset + 3;
  const storedSize = view.getUint32(storedSizeOffset, false);
  if (storedSize > maxStoredBytes) {
    return decodeError(stage, "Stored blob exceeds the stored-byte limit.", storedSizeOffset);
  }
  if (storedSize !== blob.byteLength - headerBytes) {
    return decodeError(stage, "Stored blob size does not match its payload.", storedSizeOffset);
  }
  const payload = blob.subarray(headerBytes);
  const data = (flags & COMPRESSED_FLAG) !== 0
    ? decompressStrict(payload, maxDecodedBytes, stage)
    : (() => {
      if (payload.byteLength > maxDecodedBytes) {
        return decodeError(stage, "Stored blob exceeds the decoded-byte limit.", headerBytes);
      }
      return payload.slice();
    })();
  return {
    worldId,
    flags,
    key: blob.slice(KEY_OFFSET, KEY_OFFSET + keySize),
    data
  };
}
