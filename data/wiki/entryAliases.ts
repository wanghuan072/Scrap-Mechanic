import type { WikiEntry } from "@/data/types";

const entryAliases: Record<string, string[]> = {
  "blocks/structural-blocks": [
    "Scrap Wood Block",
    "Scrap Metal Block",
    "Scrap Stone Block",
    "Wood Block Level 1",
    "Metal Block Level 1",
    "Concrete Block Level 1",
  ],
  "blocks/wood-blocks": [
    "Wood Block Level 1",
    "Wood Block Level 2",
    "Wood Block Level 3",
  ],
  "blocks/metal-blocks": [
    "Metal Block Level 1",
    "Metal Block Level 2",
    "Metal Block Level 3",
  ],
  "blocks/concrete-blocks": [
    "Concrete Block Level 1",
    "Concrete Block Level 2",
    "Concrete Block Level 3",
  ],
  "parts/switch": ["Switch", "Button"],
  "parts/suspension": [
    "Sport Suspension Level 1",
    "Off-Road Suspension Level 1",
    "Sport Suspension With Bearing Level 1",
    "Off-Road Suspension With Bearing Level 1",
  ],
  "parts/water-system": ["Water Cannon", "Water Container"],
  "parts/crafting-bots": ["Craftbot", "Refinebot", "Cookbot", "Dressbot"],
  "resources/stone": ["Scrap Stone"],
  "resources/oil": ["Crude Oil"],
};

export function getWikiEntryAliases(entry: Pick<WikiEntry, "category" | "slug">) {
  return entryAliases[`${entry.category}/${entry.slug}`] ?? [];
}
