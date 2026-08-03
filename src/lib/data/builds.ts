import buildsJson from "@/data/builds/builds.json";
import fundamentalsJson from "@/data/builds/fundamentals.json";
import specsJson from "@/data/builds/specs.json";
import type { ArticleEntry } from "@/types/content";
import type { BuildSpec } from "@/types/builds";

export const builds = buildsJson as ArticleEntry[];
export const buildingFundamentals = fundamentalsJson.buildingFundamentals;
export const buildFailureChecks = fundamentalsJson.buildFailureChecks;
export const buildSpecs = specsJson as Record<string, BuildSpec>;
export const buildSpecList = Object.values(buildSpecs);
