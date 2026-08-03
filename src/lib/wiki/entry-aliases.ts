import entryAliasesJson from "@/data/wiki/entry-aliases.json";
import type { WikiEntry } from "@/types/content";

const entryAliases = entryAliasesJson as Record<string, string[]>;

export function getWikiEntryAliases(entry: Pick<WikiEntry, "category" | "slug">) {
  return entryAliases[`${entry.category}/${entry.slug}`] ?? [];
}
