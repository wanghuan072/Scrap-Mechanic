import {
  PLAYER_MARKER_TYPES,
  type PlayerMarker,
  type PlayerMarkerDraft,
  type PlayerMarkerType
} from "./player-marker";

export const PLAYER_MARKER_STORAGE_KEY = "sm-overview.player-markers";

export interface PlayerMarkerDocument {
  version: 1;
  markers: PlayerMarker[];
}

export interface PlayerMarkerStoreOptions {
  now?: () => string;
  createId?: () => string;
}

interface LoadedDocument {
  markers: PlayerMarker[];
  warning?: string;
}

const malformedDocumentWarning = "Saved player markers could not be read.";

export class PlayerMarkerStore {
  private readonly now: () => string;
  private readonly createId: () => string;

  constructor(
    private readonly storage: Storage,
    options: PlayerMarkerStoreOptions = {}
  ) {
    this.now = options.now ?? (() => new Date().toISOString());
    this.createId = options.createId ?? (() => crypto.randomUUID());
  }

  load(): LoadedDocument {
    try {
      const stored = this.storage.getItem(PLAYER_MARKER_STORAGE_KEY);
      if (stored === null) {
        return { markers: [] };
      }

      const parsed: unknown = JSON.parse(stored);
      if (!isDocumentEnvelope(parsed)) {
        return { markers: [], warning: malformedDocumentWarning };
      }

      const markers = parsed.markers.flatMap((value) => decodeStoredMarker(value));
      return markers.length === parsed.markers.length
        ? { markers }
        : { markers, warning: malformedDocumentWarning };
    } catch {
      return { markers: [], warning: malformedDocumentWarning };
    }
  }

  list(mapScopeId: string): PlayerMarker[] {
    return this.load().markers
      .filter((marker) => marker.mapScopeId === mapScopeId)
      .map(cloneMarker);
  }

  create(draft: PlayerMarkerDraft): PlayerMarker {
    const normalizedDraft = normalizeDraft(draft);
    const timestamp = this.now();
    const marker: PlayerMarker = {
      ...normalizedDraft,
      id: this.createId(),
      createdAt: timestamp,
      updatedAt: timestamp
    };
    const document = this.load();
    this.write({ version: 1, markers: [...document.markers, marker] });
    return cloneMarker(marker);
  }

  update(id: string, changes: Pick<PlayerMarker, "name" | "type" | "notes">): PlayerMarker {
    const document = this.load();
    const index = document.markers.findIndex((marker) => marker.id === id);
    if (index === -1) {
      throw new Error("Player marker was not found.");
    }

    const current = document.markers[index];
    if (!current) {
      throw new Error("Player marker was not found.");
    }
    const normalized = normalizeDraft({ ...current, ...changes });
    const marker: PlayerMarker = {
      ...current,
      ...normalized,
      updatedAt: this.now()
    };
    const markers = [...document.markers];
    markers[index] = marker;
    this.write({ version: 1, markers });
    return cloneMarker(marker);
  }

  delete(id: string): void {
    const document = this.load();
    const markers = document.markers.filter((marker) => marker.id !== id);
    if (markers.length !== document.markers.length) {
      this.write({ version: 1, markers });
    }
  }

  private write(document: PlayerMarkerDocument): void {
    try {
      this.storage.setItem(PLAYER_MARKER_STORAGE_KEY, JSON.stringify(document));
    } catch {
      throw new Error("Player marker could not be saved.");
    }
  }
}

function normalizeDraft(draft: PlayerMarkerDraft): PlayerMarkerDraft {
  const name = typeof draft.name === "string" ? draft.name.trim() : "";
  if (name.length === 0) {
    throw new Error("Player marker name is required.");
  }
  if (!isFinitePosition(draft.position)) {
    throw new Error("Player marker position must use finite coordinates.");
  }
  if (!isPlayerMarkerType(draft.type)) {
    throw new Error("Player marker type is invalid.");
  }
  if (
    !isNonEmptyString(draft.mapScopeId)
    || typeof draft.notes !== "string"
  ) {
    throw new Error("Player marker is invalid.");
  }
  return {
    mapScopeId: draft.mapScopeId,
    position: { x: draft.position.x, y: draft.position.y },
    name,
    type: draft.type,
    notes: draft.notes
  };
}

function isDocumentEnvelope(value: unknown): value is { version: 1; markers: unknown[] } {
  if (!isRecord(value)) {
    return false;
  }
  return value.version === 1 && Array.isArray(value.markers);
}

function decodeStoredMarker(value: unknown): PlayerMarker[] {
  if (!isRecord(value)) {
    return [];
  }
  if (value.regionId !== undefined && value.regionId !== "surface") {
    return [];
  }
  if (!(isNonEmptyString(value.id)
    && isNonEmptyString(value.mapScopeId)
    && isFinitePosition(value.position)
    && typeof value.name === "string"
    && value.name.trim().length > 0
    && isPlayerMarkerType(value.type)
    && typeof value.notes === "string"
    && isIsoTimestamp(value.createdAt)
    && isIsoTimestamp(value.updatedAt))) {
    return [];
  }
  const marker = Object.fromEntries(
    Object.entries(value).filter(([key]) => key !== "regionId")
  );
  return [cloneMarker(marker as unknown as PlayerMarker)];
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isIsoTimestamp(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }
  const timestamp = new Date(value);
  return !Number.isNaN(timestamp.getTime()) && timestamp.toISOString() === value;
}

function isPlayerMarkerType(value: unknown): value is PlayerMarkerType {
  return typeof value === "string" && (PLAYER_MARKER_TYPES as readonly string[]).includes(value);
}

function isFinitePosition(value: unknown): value is { x: number; y: number } {
  return isRecord(value) && typeof value.x === "number" && Number.isFinite(value.x)
    && typeof value.y === "number" && Number.isFinite(value.y);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function cloneMarker(marker: PlayerMarker): PlayerMarker {
  return { ...marker, position: { ...marker.position } };
}
