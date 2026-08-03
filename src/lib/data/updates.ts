import updatesJson from "@/data/updates/updates.json";
import comparisonJson from "@/data/updates/version-comparison.json";
import type { ArticleEntry } from "@/types/content";

export const updates = updatesJson as ArticleEntry[];
export const versionComparisons = comparisonJson.versionComparisons;
export const releaseSystems = comparisonJson.releaseSystems;
export const compatibilityDecisions = comparisonJson.compatibilityDecisions;
export const releaseFacts = comparisonJson.releaseFacts;
export const updateVisuals = comparisonJson.updateVisuals;
