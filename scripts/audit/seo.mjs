import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const projectRoot = process.cwd();
const roots = ["src/seo/tdk.ts", "src/data"];
const files = [];

function collectFiles(target) {
  const absolute = path.join(projectRoot, target);
  const stats = fs.statSync(absolute);

  if (stats.isDirectory()) {
    for (const entry of fs.readdirSync(absolute)) {
      collectFiles(path.join(target, entry));
    }
    return;
  }

  if (target.endsWith(".ts") || target.endsWith(".json")) {
    files.push(target);
  }
}

for (const root of roots) {
  collectFiles(root);
}

const records = [];

function propertyName(property, sourceFile) {
  return property.name
    .getText(sourceFile)
    .replace(/^["'`]|["'`]$/g, "");
}

function stringValue(property) {
  if (!property) return undefined;
  const { initializer } = property;
  return ts.isStringLiteralLike(initializer) ? initializer.text : undefined;
}

function addRecord(file, line, value) {
  if (
    typeof value?.title !== "string" ||
    typeof value?.description !== "string" ||
    !Array.isArray(value?.keywords)
  ) {
    return;
  }

  records.push({
    file: file.replaceAll("\\", "/"),
    line,
    title: value.title,
    titleLength: [...value.title].length,
    description: value.description,
    descriptionLength: [...value.description].length,
  });
}

function visitJson(file, value) {
  if (!value || typeof value !== "object") return;
  addRecord(file, 1, value);
  for (const child of Object.values(value)) {
    visitJson(file, child);
  }
}

for (const file of files) {
  const absolute = path.join(projectRoot, file);
  const sourceText = fs.readFileSync(absolute, "utf8");

  if (file.endsWith(".json")) {
    visitJson(file, JSON.parse(sourceText));
    continue;
  }

  const sourceFile = ts.createSourceFile(
    file,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
  );

  function visit(node) {
    if (ts.isObjectLiteralExpression(node)) {
      const properties = new Map(
        node.properties
          .filter(ts.isPropertyAssignment)
          .map((property) => [
            propertyName(property, sourceFile),
            property,
          ]),
      );

      if (
        properties.has("title") &&
        properties.has("description") &&
        properties.has("keywords")
      ) {
        const title = stringValue(properties.get("title"));
        const description = stringValue(properties.get("description"));

        if (title && description) {
          const position = sourceFile.getLineAndCharacterOfPosition(
            node.getStart(sourceFile),
          );
          addRecord(file, position.line + 1, {
            title,
            description,
            keywords: [],
          });
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
}

const failures = records.filter(
  ({ title, titleLength, description, descriptionLength }) =>
    titleLength < 40 ||
    titleLength > 60 ||
    descriptionLength < 140 ||
    descriptionLength > 160 ||
    !title.toLowerCase().includes("scrap mechanic") ||
    !description.toLowerCase().includes("scrap mechanic") ||
    (description.match(/scrap mechanic/gi) ?? []).length > 2,
);

const duplicateValues = (key) =>
  [...new Set(records.map((record) => record[key]))].filter(
    (value) => records.filter((record) => record[key] === value).length > 1,
  );
const duplicateTitles = duplicateValues("title");
const duplicateDescriptions = duplicateValues("description");

console.log(
  JSON.stringify(
    {
      checked: records.length,
      failures:
        failures.length + duplicateTitles.length + duplicateDescriptions.length,
      duplicateTitles,
      duplicateDescriptions,
      records: failures,
    },
    null,
    2,
  ),
);

if (
  failures.length > 0 ||
  duplicateTitles.length > 0 ||
  duplicateDescriptions.length > 0
) {
  process.exitCode = 1;
}
