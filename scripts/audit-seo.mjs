import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const projectRoot = process.cwd();
const roots = ["seo/tdk.ts", "data"];
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

  if (target.endsWith(".ts")) {
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

for (const file of files) {
  const absolute = path.join(projectRoot, file);
  const sourceText = fs.readFileSync(absolute, "utf8");
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
          records.push({
            file: file.replaceAll("\\", "/"),
            line: position.line + 1,
            title,
            titleLength: [...title].length,
            description,
            descriptionLength: [...description].length,
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
