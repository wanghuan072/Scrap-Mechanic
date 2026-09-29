import { loadSmMapGeneratorResourceDocument } from "../vendor/sm-map-generator-assets";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const MAX_DIAGNOSTICS = 25;
const MAX_LOCAL_COORDINATE = 16 * 64;

const resourceNames = {
  beehive: "Wild Beehive",
  corn: "Wild Corn",
  cotton: "Wild Cotton",
  epicLootCrate: "Epic/Legendary Loot Crate",
  lootCrate: "Standard Loot Crate",
  metalRock: "Stone Node",
  oil: "Oil Geyser",
  pigment: "Pigment Flower"
} as const;

type ResourceCategory = keyof typeof resourceNames;

export interface VendorMarkerDefinition {
  id: string;
  tileUuid: string;
  category: string;
  name: string;
  localX: number;
  localY: number;
}

export interface VendorMarkerCatalog {
  definitions: VendorMarkerDefinition[];
  diagnostics: string[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isResourceCategory(value: string): value is ResourceCategory {
  return Object.hasOwn(resourceNames, value);
}

class BoundedDiagnostics {
  readonly messages: string[] = [];
  private total = 0;

  add(message: string): void {
    this.total += 1;
    if (this.messages.length < MAX_DIAGNOSTICS - 1) {
      this.messages.push(message);
    }
  }

  finish(): string[] {
    const omitted = this.total - this.messages.length;
    if (omitted > 0) {
      this.messages.push(
        `${omitted} additional malformed or unsupported resource row(s) were ignored (${this.total} total).`
      );
    }
    return this.messages;
  }
}

export function parseVendorMarkerCatalog(value: unknown): VendorMarkerCatalog {
  const diagnostics = new BoundedDiagnostics();
  const definitions = new Map<string, VendorMarkerDefinition>();
  if (!isRecord(value)) {
    diagnostics.add("The resource marker document is malformed and was ignored.");
    return { definitions: [], diagnostics: diagnostics.finish() };
  }

  for (const [rawUuid, rawCategories] of Object.entries(value)) {
    const tileUuid = rawUuid.toLowerCase();
    if (!UUID_PATTERN.test(tileUuid) || !isRecord(rawCategories)) {
      diagnostics.add(`Malformed resource tile '${rawUuid}' was ignored.`);
      continue;
    }
    for (const [category, rawCoordinates] of Object.entries(rawCategories)) {
      if (!isResourceCategory(category)) {
        diagnostics.add(
          `Unsupported resource category '${category}' on tile ${tileUuid} was ignored.`
        );
        continue;
      }
      if (!Array.isArray(rawCoordinates)) {
        diagnostics.add(
          `Malformed coordinates for ${tileUuid}/${category} were ignored.`
        );
        continue;
      }
      for (const coordinate of rawCoordinates) {
        if (
          !Array.isArray(coordinate)
          || coordinate.length !== 2
          || coordinate.some(
            (part) =>
              typeof part !== "number"
              || !Number.isFinite(part)
              || part < 0
              || part > MAX_LOCAL_COORDINATE
          )
        ) {
          diagnostics.add(
            `Malformed coordinate for ${tileUuid}/${category} was ignored.`
          );
          continue;
        }
        const [localX, localY] = coordinate as [number, number];
        const id = `vendor:${tileUuid}:${category}:${localX}:${localY}`;
        if (definitions.has(id)) {
          diagnostics.add(`Duplicate resource marker '${id}' was ignored.`);
          continue;
        }
        definitions.set(id, {
          id,
          tileUuid,
          category,
          name: resourceNames[category],
          localX,
          localY
        });
      }
    }
  }

  return {
    definitions: [...definitions.values()].sort((left, right) =>
      left.id < right.id ? -1 : left.id > right.id ? 1 : 0
    ),
    diagnostics: diagnostics.finish()
  };
}

export async function loadVendorMarkerCatalog(
  manifestUrl: string,
  fetcher: typeof fetch = fetch
): Promise<VendorMarkerCatalog> {
  const text = await loadSmMapGeneratorResourceDocument(manifestUrl, fetcher);
  if (text === undefined) return { definitions: [], diagnostics: [] };
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    return {
      definitions: [],
      diagnostics: ["The resource marker document is malformed and was ignored."]
    };
  }
  return parseVendorMarkerCatalog(value);
}
