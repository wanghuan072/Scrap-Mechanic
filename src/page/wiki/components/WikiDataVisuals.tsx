import Image from "next/image";
import type { CraftingRecipe } from "@/lib/game/player-data";
import { getPlayerItemImage } from "@/lib/game/player-data";
import { WikiLinkedText } from "@/page/wiki/components/WikiLinkedText";
import styles from "@/style/page/wiki/wiki-entry.module.css";

type AssetFact = {
  label: string;
  value: string;
};

export function AssetDossier({
  category,
  facts,
  image,
  imageAlt,
  imageLabel,
  name,
  pixelated = false,
}: {
  category: string;
  facts: AssetFact[];
  image: string;
  imageAlt: string;
  imageLabel: string;
  name: string;
  pixelated?: boolean;
}) {
  return (
    <div className={styles.itemPlate}>
      <span>
        {imageLabel} / {category}
      </span>
      <div className={styles.itemVisual}>
        <Image
          src={image}
          alt={imageAlt}
          width={200}
          height={200}
          sizes="(max-width: 768px) 112px, 144px"
          quality={75}
          preload
          style={pixelated ? { imageRendering: "pixelated" } : undefined}
        />
      </div>
      <dl className={styles.assetFacts}>
        {facts.slice(0, 4).map((fact) => (
          <div key={fact.label}>
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>
      <b>{name}</b>
    </div>
  );
}

function formatCraftTime(seconds: number) {
  if (seconds <= 0) return "Immediate";
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  if (!minutes) return `${remainder}s`;
  return remainder ? `${minutes}m ${remainder}s` : `${minutes}m`;
}

function recipeLabel(recipe: CraftingRecipe) {
  const levelMatch = recipe.output.name.match(/Level\s+(\d+)$/i);
  const level = levelMatch ? Number(levelMatch[1]) : undefined;

  if (level === 1) {
    return recipe.stationSlug === "refinebot"
      ? "Alternative Level 1 source"
      : "Create Level 1";
  }

  if (level && level > 1) return `Upgrade to Level ${level}`;
  if (recipe.stationSlug === "refinebot") return "Refinebot conversion";
  return `${recipe.stationName} recipe`;
}

export function WikiRecipeFlow({
  currentHref,
  recipe,
}: {
  currentHref: string;
  recipe: CraftingRecipe;
}) {
  const stationImage = getPlayerItemImage(recipe.stationName);

  return (
    <article className={styles.recipeFlow}>
      <header>
        <span>{recipeLabel(recipe)}</span>
        <b>{formatCraftTime(recipe.craftTime)}</b>
      </header>
      <div className={styles.recipeFlowTrack}>
        <div
          className={styles.recipeIngredients}
          aria-label="Required materials"
        >
          {recipe.ingredients.map((ingredient) => (
            <div className={styles.recipeItem} key={ingredient.uuid}>
              <div className={styles.recipeItemImage}>
                {ingredient.image ? (
                  <Image
                    src={ingredient.image}
                    alt=""
                    width={64}
                    height={64}
                    sizes="64px"
                  />
                ) : (
                  <span aria-hidden="true" />
                )}
              </div>
              <strong>{ingredient.quantity}×</strong>
              <span>
                <WikiLinkedText
                  text={ingredient.name}
                  currentHref={currentHref}
                />
              </span>
            </div>
          ))}
        </div>

        <span className={styles.recipeConnector} aria-hidden="true">
          <i />
        </span>

        <div className={styles.recipeStation}>
          <div>
            {stationImage ? (
              <Image
                src={stationImage}
                alt=""
                width={70}
                height={70}
                sizes="70px"
              />
            ) : (
              <span aria-hidden="true" />
            )}
          </div>
          <small>Crafted at</small>
          <strong>{recipe.stationName}</strong>
          <span>{formatCraftTime(recipe.craftTime)}</span>
        </div>

        <span className={styles.recipeConnector} aria-hidden="true">
          <i />
        </span>

        <div className={`${styles.recipeItem} ${styles.recipeOutput}`}>
          <div className={styles.recipeItemImage}>
            {recipe.output.image ? (
              <Image
                src={recipe.output.image}
                alt=""
                width={78}
                height={78}
                sizes="78px"
              />
            ) : (
              <span aria-hidden="true" />
            )}
          </div>
          <strong>{recipe.output.quantity}×</strong>
          <span>
            <WikiLinkedText
              text={recipe.output.name}
              currentHref={currentHref}
            />
          </span>
        </div>
      </div>
      <p className="sr-only">
        Combine{" "}
        {recipe.ingredients
          .map((ingredient) => `${ingredient.quantity} ${ingredient.name}`)
          .join(", ")}{" "}
        at {recipe.stationName} for {formatCraftTime(recipe.craftTime)}
        to make {recipe.output.quantity} {recipe.output.name}.
      </p>
    </article>
  );
}

function ingredientQuantity(recipe: CraftingRecipe, name: string) {
  return (
    recipe.ingredients.find(
      (ingredient) => ingredient.name.toLowerCase() === name.toLowerCase(),
    )?.quantity ?? 0
  );
}

function multipliedIngredients(recipe: CraftingRecipe, runs: number) {
  return recipe.ingredients.map((ingredient) => ({
    name: ingredient.name,
    quantity: ingredient.quantity * runs,
  }));
}

function formatMaterials(materials: Array<{ name: string; quantity: number }>) {
  return materials
    .map((material) => `${material.quantity}× ${material.name}`)
    .join(" + ");
}

export function MetalProgressionPanel({
  recipes,
}: {
  recipes: CraftingRecipe[];
}) {
  const levelOneRecipes = recipes.filter(
    (recipe) => recipe.output.name === "Metal Block Level 1",
  );
  const craftLevelOne = levelOneRecipes.find(
    (recipe) => recipe.stationSlug === "craftbot",
  );
  const refineLevelOne = levelOneRecipes.find(
    (recipe) => recipe.stationSlug === "refinebot",
  );
  const levelTwo = recipes.find(
    (recipe) => recipe.output.name === "Metal Block Level 2",
  );
  const levelThree = recipes.find(
    (recipe) => recipe.output.name === "Metal Block Level 3",
  );

  if (!craftLevelOne || !refineLevelOne || !levelTwo || !levelThree)
    return null;

  const levelTwoNeeded = ingredientQuantity(levelThree, "Metal Block Level 2");
  const levelTwoRuns = Math.ceil(levelTwoNeeded / levelTwo.output.quantity);
  const levelOneNeeded =
    ingredientQuantity(levelTwo, "Metal Block Level 1") * levelTwoRuns;
  const craftLevelOneRuns = Math.ceil(
    levelOneNeeded / craftLevelOne.output.quantity,
  );
  const refineLevelOneRuns = Math.ceil(
    levelOneNeeded / refineLevelOne.output.quantity,
  );
  const levelTwoMaterials = multipliedIngredients(levelTwo, levelTwoRuns);
  const levelThreeMaterials = multipliedIngredients(levelThree, 1);
  const externalMaterials = new Map<string, number>();

  [...levelTwoMaterials, ...levelThreeMaterials].forEach((material) => {
    if (/Metal Block Level [12]/i.test(material.name)) return;
    externalMaterials.set(
      material.name,
      (externalMaterials.get(material.name) ?? 0) + material.quantity,
    );
  });

  const upgradeTime = levelTwo.craftTime * levelTwoRuns + levelThree.craftTime;

  return (
    <aside
      className={styles.progressionPanel}
      aria-label="Metal Block upgrade route"
    >
      <div className={styles.progressionIntro}>
        <div>
          <span>Batch-aware upgrade route</span>
          <strong>10× Metal Block Level 3</strong>
        </div>
        <p>
          Level 2 must run {levelTwoRuns} times. Totals below are for the full
          Level 3 batch, not one click of each recipe.
        </p>
      </div>

      <div className={styles.progressionTrack}>
        <div
          className={`${styles.progressionStage} ${styles.progressionSource}`}
        >
          <span>01 / Make {levelOneNeeded}× Level 1</span>
          <strong>Choose one source</strong>
          <div>
            <p>
              <b>
                {formatMaterials(
                  multipliedIngredients(craftLevelOne, craftLevelOneRuns),
                )}
              </b>
              <small>
                Craftbot · {craftLevelOneRuns} batches ·{" "}
                {formatCraftTime(craftLevelOne.craftTime * craftLevelOneRuns)}
              </small>
            </p>
            <em>or</em>
            <p>
              <b>
                {formatMaterials(
                  multipliedIngredients(refineLevelOne, refineLevelOneRuns),
                )}
              </b>
              <small>
                Refinebot · {refineLevelOneRuns} batches ·{" "}
                {formatCraftTime(refineLevelOne.craftTime * refineLevelOneRuns)}
              </small>
            </p>
          </div>
          <output>{levelOneNeeded}× Metal Block Level 1</output>
        </div>

        <span className={styles.progressionArrow} aria-hidden="true">
          →
        </span>

        <div className={styles.progressionStage}>
          <span>02 / Upgrade twice</span>
          <strong>{formatMaterials(levelTwoMaterials)}</strong>
          <small>
            Craftbot · {levelTwoRuns} batches ·{" "}
            {formatCraftTime(levelTwo.craftTime * levelTwoRuns)}
          </small>
          <output>{levelTwoNeeded}× Metal Block Level 2</output>
        </div>

        <span className={styles.progressionArrow} aria-hidden="true">
          →
        </span>

        <div
          className={`${styles.progressionStage} ${styles.progressionResult}`}
        >
          <span>03 / Final upgrade</span>
          <strong>{formatMaterials(levelThreeMaterials)}</strong>
          <small>
            Craftbot · 1 batch · {formatCraftTime(levelThree.craftTime)}
          </small>
          <output>{levelThree.output.quantity}× Metal Block Level 3</output>
        </div>
      </div>

      <div className={styles.progressionTotals}>
        <span>
          Upgrade-only inputs: <b>{levelOneNeeded}× Level 1</b>
          {[...externalMaterials].map(([name, quantity]) => (
            <b key={name}>
              {" "}
              + {quantity}× {name}
            </b>
          ))}
        </span>
        <span>
          Upgrade time: <b>{formatCraftTime(upgradeTime)}</b>
        </span>
        <span>
          Full route:{" "}
          <b>
            {formatCraftTime(
              upgradeTime + craftLevelOne.craftTime * craftLevelOneRuns,
            )}{" "}
            from Scrap Metal Block
          </b>{" "}
          /{" "}
          <b>
            {formatCraftTime(
              upgradeTime + refineLevelOne.craftTime * refineLevelOneRuns,
            )}{" "}
            from Metal
          </b>
        </span>
      </div>
    </aside>
  );
}

const propertyLabels: Record<string, string> = {
  "Collision size": "Size",
  "Inventory stack": "Max stack",
  "Object durability": "Durability",
  Density: "Weight",
  "Physics material": "Material",
};

function ratingValue(value: string) {
  const match = value.match(/^(\d+(?:\.\d+)?)\s*\/\s*10$/);
  if (!match) return undefined;
  const score = Number(match[1]);
  return Number.isFinite(score) ? Math.max(0, Math.min(10, score)) : undefined;
}

export function WikiPropertyGrid({
  currentHref,
  properties,
}: {
  currentHref: string;
  properties: Array<{ label: string; value: string }>;
}) {
  return (
    <dl className={styles.propertyGrid}>
      {properties.map((property) => {
        const label = propertyLabels[property.label] ?? property.label;
        const score = ratingValue(property.value);
        const isBoolean = property.label === "Flammable";

        return (
          <div
            className={score !== undefined ? styles.propertyRating : undefined}
            key={property.label}
          >
            <dt>{label}</dt>
            <dd>
              {score !== undefined ? (
                <>
                  <span
                    className={styles.ratingTrack}
                    aria-label={`${label}: ${score} out of 10`}
                  >
                    {Array.from({ length: 10 }, (_, index) => (
                      <i
                        aria-hidden="true"
                        data-active={index < score ? "true" : "false"}
                        key={index}
                      />
                    ))}
                  </span>
                  <b>{score}/10</b>
                </>
              ) : isBoolean ? (
                <span
                  className={styles.booleanValue}
                  data-value={property.value.toLowerCase()}
                >
                  {property.value}
                </span>
              ) : (
                <WikiLinkedText
                  text={property.value}
                  currentHref={currentHref}
                />
              )}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
