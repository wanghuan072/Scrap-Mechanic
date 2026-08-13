import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const dataRoot = path.join(projectRoot, "src", "data");
const failures = [];
let jsonFilesChecked = 0;
let imageReferencesChecked = 0;

function readJson(relativePath) {
  const absolutePath = path.join(dataRoot, relativePath);
  try {
    jsonFilesChecked += 1;
    return JSON.parse(fs.readFileSync(absolutePath, "utf8"));
  } catch (error) {
    failures.push(`${relativePath}: invalid JSON (${error.message})`);
    return undefined;
  }
}

function duplicateValues(values) {
  const seen = new Set();
  const duplicates = new Set();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return [...duplicates];
}

function checkUnique(label, values) {
  for (const value of duplicateValues(values)) {
    failures.push(`${label}: duplicate value ${value}`);
  }
}

function checkCount(label, declared, actual) {
  if (declared !== actual) {
    failures.push(`${label}: declared ${declared}, actual ${actual}`);
  }
}

function collectImageReferences(value, source, references = []) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectImageReferences(item, source, references));
    return references;
  }
  if (!value || typeof value !== "object") return references;

  for (const [key, child] of Object.entries(value)) {
    if (
      typeof child === "string" &&
      (key === "image" || key === "src") &&
      child.startsWith("/images/")
    ) {
      references.push({ source, image: child });
    } else {
      collectImageReferences(child, source, references);
    }
  }
  return references;
}

const jsonFiles = fs
  .readdirSync(dataRoot, { recursive: true })
  .filter((file) => file.endsWith(".json"))
  .sort();
const documents = new Map();

for (const file of jsonFiles) {
  const document = readJson(file);
  if (document !== undefined) documents.set(file.replaceAll("\\", "/"), document);
}

const guides = documents.get("guides/guides.json") ?? [];
const builds = documents.get("builds/builds.json") ?? [];
const buildSpecs = documents.get("builds/specs.json") ?? {};
const updates = documents.get("updates/updates.json") ?? [];
const quests = documents.get("quests/quests.json") ?? [];
const locations = documents.get("locations/locations.json") ?? [];
const tools = documents.get("tools/tools.json") ?? [];
const categories = documents.get("wiki/categories.json") ?? [];
const modsDocument = documents.get("mods/mods.json") ?? { mods: [], workshopLeaderboard: [] };
const itemsDocument = documents.get("game/items.json") ?? { items: [] };
const objectDetails = documents.get("game/object-details.json") ?? { objects: [] };
const recipes = documents.get("game/recipes.json") ?? { stations: [], recipes: [] };
const trades = documents.get("game/trades.json") ?? { venues: [], trades: [] };
const aliases = documents.get("wiki/entry-aliases.json") ?? {};
const raidCalculator = documents.get("tools/raid-calculator.json") ?? {
  raidCrops: [],
  raidLevels: [],
  raidCropValueThresholds: [],
};

const wikiDocuments = [...documents.entries()].filter(
  ([file, value]) =>
    file.startsWith("wiki/") &&
    ![
      "wiki/categories.json",
      "wiki/entry-aliases.json",
      "wiki/bot-guide.json",
    ].includes(file) &&
    Array.isArray(value),
);
const wikiEntries = wikiDocuments.flatMap(([, entries]) => entries);
const wikiRouteList = wikiEntries.map(
  (entry) => `/wiki/${entry.category}/${entry.slug}`,
);
const wikiSlugList = wikiEntries.map((entry) => entry.slug);
const categorySlugList = categories.map((category) => category.slug);
const guideSlugList = guides.map((guide) => guide.slug);
const buildSlugList = builds.map((build) => build.slug);
const updateSlugList = updates.map((update) => update.slug);
const wikiRoutes = new Set(wikiRouteList);
const wikiSlugs = new Set(wikiSlugList);
const categorySlugs = new Set(categorySlugList);
const guideSlugs = new Set(guideSlugList);
const buildSlugs = new Set(buildSlugList);

if (guides.length !== 8) {
  failures.push(`guides/guides.json: expected 8 published guides, found ${guides.length}`);
}

checkUnique("guide slugs", guideSlugList);
checkUnique("build slugs", buildSlugList);
checkUnique("update slugs", updateSlugList);
checkUnique("quest slugs", quests.map((quest) => quest.slug));
checkUnique("location slugs", locations.map((location) => location.slug));
checkUnique("tool slugs", tools.map((tool) => tool.slug));
checkUnique("wiki category slugs", categorySlugList);
checkUnique("wiki routes", wikiRouteList);
checkUnique("wiki slugs", wikiSlugList);
checkUnique("recipe ids", recipes.recipes.map((recipe) => recipe.id));
checkUnique("trade ids", trades.trades.map((trade) => trade.id));
checkUnique("game item UUIDs", itemsDocument.items.map((item) => item.uuid));
checkUnique("mod slugs", modsDocument.mods.map((mod) => mod.slug));
checkUnique("mod Workshop ids", modsDocument.mods.map((mod) => mod.workshopId));

for (const entry of wikiEntries) {
  if (!categorySlugs.has(entry.category)) {
    failures.push(`wiki/${entry.category}/${entry.slug}: unknown category`);
  }
  for (const relatedSlug of entry.relatedSlugs ?? []) {
    if (!wikiSlugs.has(relatedSlug)) {
      failures.push(
        `wiki/${entry.category}/${entry.slug}: missing related wiki slug ${relatedSlug}`,
      );
    }
  }
}

for (const [route] of Object.entries(aliases)) {
  if (!wikiRoutes.has(`/wiki/${route}`)) {
    failures.push(`wiki/entry-aliases.json: unknown entry ${route}`);
  }
}

for (const guide of guides) {
  for (const relatedSlug of guide.relatedGuides ?? []) {
    if (!guideSlugs.has(relatedSlug)) {
      failures.push(`${guide.slug}: missing related guide ${relatedSlug}`);
    }
  }
  for (const relatedSlug of guide.relatedWiki ?? []) {
    if (!wikiSlugs.has(relatedSlug)) {
      failures.push(`${guide.slug}: missing related wiki slug ${relatedSlug}`);
    }
  }
}

for (const entry of [...builds, ...updates]) {
  for (const relatedSlug of entry.relatedWiki ?? []) {
    if (!wikiSlugs.has(relatedSlug)) {
      failures.push(`${entry.slug}: missing related wiki slug ${relatedSlug}`);
    }
  }
}

for (const quest of quests) {
  for (const reward of quest.rewards ?? []) {
    if (reward.wikiHref && !wikiRoutes.has(reward.wikiHref)) {
      failures.push(`${quest.slug}: missing reward route ${reward.wikiHref}`);
    }
  }
}

const gameItemUuids = new Set(itemsDocument.items.map((item) => item.uuid));
for (const entry of [...recipes.recipes, ...trades.trades]) {
  for (const item of [entry.output, ...entry.ingredients]) {
    if (!gameItemUuids.has(item.uuid)) {
      failures.push(`${entry.id}: missing game item UUID ${item.uuid}`);
    }
  }
}

checkUnique("build spec slugs", Object.keys(buildSpecs));
for (const slug of buildSlugs) {
  if (!buildSpecs[slug]) failures.push(`builds/specs.json: missing spec ${slug}`);
}
for (const [slug, spec] of Object.entries(buildSpecs)) {
  if (!buildSlugs.has(slug)) failures.push(`builds/specs.json: orphan spec ${slug}`);
  if (spec.slug !== slug) failures.push(`builds/specs.json: mismatched spec slug ${slug}`);
}

checkCount(
  "game/object-details.json objectCount",
  objectDetails.objectCount,
  objectDetails.objects.length,
);
checkCount("game/recipes.json recipeCount", recipes.recipeCount, recipes.recipes.length);
checkCount("game/trades.json tradeCount", trades.tradeCount, trades.trades.length);
checkCount(
  "game/recipes.json station recipe counts",
  recipes.stations.reduce((total, station) => total + station.recipeCount, 0),
  recipes.recipes.length,
);
checkCount(
  "game/trades.json venue trade counts",
  trades.venues.reduce((total, venue) => total + venue.tradeCount, 0),
  trades.trades.length,
);

if (raidCalculator.raidCropValueThresholds.length !== raidCalculator.raidLevels.length) {
  failures.push("tools/raid-calculator.json: threshold and level counts differ");
}
for (let index = 1; index < raidCalculator.raidLevels.length; index += 1) {
  if (
    raidCalculator.raidLevels[index].minimumPlantValue <=
    raidCalculator.raidLevels[index - 1].minimumPlantValue
  ) {
    failures.push("tools/raid-calculator.json: raid levels are not strictly increasing");
    break;
  }
}

for (const [file, document] of documents) {
  for (const reference of collectImageReferences(document, file)) {
    imageReferencesChecked += 1;
    const imagePath = path.join(projectRoot, "public", reference.image.slice(1));
    if (!fs.existsSync(imagePath)) {
      failures.push(`${reference.source}: missing image ${reference.image}`);
    }
  }
}

console.log(
  JSON.stringify(
    {
      jsonFilesChecked,
      imageReferencesChecked,
      publishedGuides: guides.length,
      wikiEntries: wikiEntries.length,
      recipes: recipes.recipes.length,
      failures: failures.length,
      records: [...new Set(failures)],
    },
    null,
    2,
  ),
);

if (failures.length > 0) process.exitCode = 1;
