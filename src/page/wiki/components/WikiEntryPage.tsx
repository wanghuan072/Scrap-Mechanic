import Link from "next/link";
import { GptAd } from "@/components/ads/GptAd";
import { EvidenceStatus } from "@/components/common/EvidenceStatus";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { WikiLinkedText } from "@/page/wiki/components/WikiLinkedText";
import {
  AssetDossier,
  MetalProgressionPanel,
  WikiPropertyGrid,
  WikiRecipeFlow,
} from "@/page/wiki/components/WikiDataVisuals";
import { JsonLd } from "@/seo/JsonLd";
import {
  formatObjectDimensions,
  getGameObjectDetails,
} from "@/lib/game/object-details";
import {
  getPlayerItem,
  getRecipeUnlockLabel,
  recipeCollection,
  tradeCollection,
} from "@/lib/game/player-data";
import { site } from "@/config/site";
import { wikiAcquisitionGuides } from "@/lib/data/wiki";
import { getWikiEntryAliases } from "@/lib/wiki/entry-aliases";
import type { WikiEntry } from "@/types/content";
import {
  allWikiEntries,
  getQuestsForWikiEntry,
  getWikiCategory,
  getWikiEntryByName,
  getWikiEntryBySlug,
} from "@/lib/content/catalog";
import styles from "@/style/page/wiki/wiki-entry.module.css";

function valueFor(
  values: Array<{ label: string; value: string }> | undefined,
  label: string,
) {
  return values?.find((item) => item.label === label)?.value;
}

function garmentSlot(name: string) {
  return (
    ["Backpack", "Gloves", "Hat", "Jacket", "Pants", "Shoes", "T-Shirt"].find(
      (slot) => name.endsWith(slot),
    ) ?? "outfit"
  );
}

function garmentFamily(name: string) {
  if (name.startsWith("Duckie ")) return "Duckie";
  if (name.startsWith("Scrapper ")) return "Scrapper";
  if (name.endsWith("T-Shirt")) return "T-Shirt";
  return name;
}

const relationStopWords = new Set([
  "scrap",
  "mechanic",
  "survival",
  "current",
  "entry",
  "used",
  "with",
  "from",
  "into",
  "this",
  "that",
  "through",
  "reward",
  "recipe",
]);

function relationTerms(entry: WikiEntry) {
  return new Set(
    [entry.name, entry.description, ...entry.seo.keywords]
      .join(" ")
      .toLowerCase()
      .match(/[a-z0-9]+/g)
      ?.filter((term) => term.length >= 4 && !relationStopWords.has(term)) ??
      [],
  );
}

function entrySimilarityScore(entry: WikiEntry, candidate: WikiEntry) {
  const terms = relationTerms(entry);
  const candidateTerms = relationTerms(candidate);
  const sharedTerms = [...terms].filter((term) =>
    candidateTerms.has(term),
  ).length;
  const entryType = valueFor(entry.facts, "Entry type");
  const candidateType = valueFor(candidate.facts, "Entry type");

  return (
    sharedTerms +
    (entry.category === candidate.category ? 2 : 0) +
    (entryType && entryType === candidateType ? 6 : 0)
  );
}

export function WikiEntryPage({ entry }: { entry: WikiEntry }) {
  const currentHref = `/wiki/${entry.category}/${entry.slug}`;
  const category = getWikiCategory(entry.category);
  const related = entry.relatedSlugs
    .map(getWikiEntryBySlug)
    .filter((item) => item !== undefined);
  const acquisition = wikiAcquisitionGuides[entry.slug];
  const relatedQuests = getQuestsForWikiEntry(entry.category, entry.slug);
  const hasUnlockRoute = Boolean(acquisition) || relatedQuests.length > 0;
  const entryAliases = getWikiEntryAliases(entry);
  const relatedPlayerItems = [entry.name, ...entryAliases]
    .map(getPlayerItem)
    .filter((item) => item !== undefined)
    .filter(
      (item, index, items) =>
        items.findIndex((candidate) => candidate.uuid === item.uuid) === index,
    );
  const playerItem =
    getPlayerItem(entry.name) ??
    (entryAliases.length === 1 ? relatedPlayerItems[0] : undefined);
  const objectDetails =
    getGameObjectDetails(entry.name) ??
    (entryAliases.length === 1
      ? getGameObjectDetails(entryAliases[0])
      : undefined);
  const matchingNames = new Set(
    [
      entry.name,
      ...entryAliases,
      ...relatedPlayerItems.map((item) => item.name),
    ]
      .filter((name): name is string => Boolean(name))
      .map((name) => name.toLowerCase()),
  );
  const variantObjects = entryAliases
    .map((name) => ({ name, details: getGameObjectDetails(name) }))
    .filter(
      (
        item,
      ): item is {
        name: string;
        details: NonNullable<ReturnType<typeof getGameObjectDetails>>;
      } => item.details !== undefined,
    );
  const craftingOptions = recipeCollection.recipes.filter((recipe) =>
    matchingNames.has(recipe.output.name.toLowerCase()),
  );
  const outputOrder = new Map(
    entryAliases.map((name, index) => [name.toLowerCase(), index]),
  );
  const displayedCraftingOptions = [...craftingOptions].sort((left, right) => {
    const outputDifference =
      (outputOrder.get(left.output.name.toLowerCase()) ??
        Number.MAX_SAFE_INTEGER) -
      (outputOrder.get(right.output.name.toLowerCase()) ??
        Number.MAX_SAFE_INTEGER);
    if (outputDifference !== 0) return outputDifference;
    return left.stationName.localeCompare(right.stationName);
  });
  const usedInRecipes = recipeCollection.recipes.filter((recipe) =>
    recipe.ingredients.some((ingredient) =>
      matchingNames.has(ingredient.name.toLowerCase()),
    ),
  );
  const traderRewards = tradeCollection.trades.filter((trade) =>
    matchingNames.has(trade.output.name.toLowerCase()),
  );
  const traderCosts = tradeCollection.trades.filter((trade) =>
    trade.ingredients.some((ingredient) =>
      matchingNames.has(ingredient.name.toLowerCase()),
    ),
  );
  const hasPlayerRelations =
    craftingOptions.length > 0 ||
    usedInRecipes.length > 0 ||
    traderRewards.length > 0 ||
    traderCosts.length > 0;
  const propertyValues = entry.properties ?? [];
  const entryType = valueFor(entry.facts, "Entry type");
  const unlockValue = valueFor(entry.facts, "Unlock");
  const dimensions =
    valueFor(propertyValues, "Dimensions") ??
    valueFor(entry.facts, "Dimensions");
  const durability =
    valueFor(propertyValues, "Durability") ??
    valueFor(entry.facts, "Durability");
  const friction = valueFor(propertyValues, "Friction");
  const buoyancy = valueFor(propertyValues, "Buoyancy");
  const density = valueFor(propertyValues, "Density");
  const hasGeneratedRewardCopy = entry.sections.some((section) =>
    [...(section.paragraphs ?? []), ...(section.bullets ?? [])].some((line) =>
      line.includes(
        "Confirm the reward has registered in the quest log or customization interface",
      ),
    ),
  );
  const isRewardProfile =
    entry.category === "quest-rewards" ||
    entry.category === "garments" ||
    hasGeneratedRewardCopy;
  const slot =
    entry.category === "garments" ? garmentSlot(entry.name) : undefined;
  const family =
    entry.category === "garments" ? garmentFamily(entry.name) : undefined;
  const primaryQuest = relatedQuests[0];
  const playerDescription =
    entry.category === "garments"
      ? `${entry.name} is a ${slot?.toLowerCase()}-slot cosmetic in the ${family} group${
          primaryQuest ? `, unlocked through ${primaryQuest.quest.title}` : ""
        }. It changes the mechanic's appearance; the current object data lists no armor, durability, or machine-stat bonus.`
      : isRewardProfile && primaryQuest
        ? `${entry.name} is a ${primaryQuest.reward.type.toLowerCase()} from ${
            primaryQuest.quest.title
          }. That quest contains ${primaryQuest.quest.objectiveCount} objective${
            primaryQuest.quest.objectiveCount === 1 ? "" : "s"
          } and ${primaryQuest.quest.rewardCount} reward${
            primaryQuest.quest.rewardCount === 1 ? "" : "s"
          }; the exact objective order and full reward bundle are listed below.`
        : isRewardProfile
          ? `${entry.name} is a ${
              entryType?.toLowerCase() ?? "Survival progression reward"
            }. ${unlockValue ?? "No single named quest is mapped to this entry."}${
              dimensions ? ` Its collision footprint is ${dimensions}.` : ""
            }${durability ? ` Durability is ${durability}.` : ""}`
          : entry.description;
  const isRepresentativeImage =
    /representing|reference image|artwork showing|scene used|statue/i.test(
      entry.imageAlt,
    );
  const isOfficialPreview = /official.+preview|devblog/i.test(entry.imageAlt);
  const imageLabel = isRepresentativeImage
    ? "Associated game asset"
    : isOfficialPreview
      ? "Official preview"
      : "In-game asset";
  const assetFacts: Array<{ label: string; value: string }> = [
    { label: "Category", value: category?.name ?? entry.category },
  ];
  const objectSize = objectDetails
    ? formatObjectDimensions(objectDetails)
    : undefined;
  if (objectSize) assetFacts.push({ label: "Size", value: objectSize });
  if (objectDetails?.stackSize) {
    assetFacts.push({
      label: "Max stack",
      value: `${objectDetails.stackSize}`,
    });
  }
  if (typeof objectDetails?.flammable === "boolean") {
    assetFacts.push({
      label: "Flammable",
      value: objectDetails.flammable ? "Yes" : "No",
    });
  }
  const assetFactLabels = new Set(
    assetFacts.map((fact) => fact.label.toLowerCase()),
  );
  for (const fact of entry.facts) {
    if (assetFacts.length >= 4) break;
    if (assetFactLabels.has(fact.label.toLowerCase())) continue;
    assetFacts.push(fact);
    assetFactLabels.add(fact.label.toLowerCase());
  }
  const garmentSiblings =
    family && family !== entry.name
      ? allWikiEntries.filter(
          (item) =>
            item.category === "garments" &&
            item.slug !== entry.slug &&
            garmentFamily(item.name) === family,
        )
      : [];
  const relationNames = [
    ...craftingOptions.flatMap((recipe) =>
      recipe.ingredients.map((ingredient) => ingredient.name),
    ),
    ...usedInRecipes.map((recipe) => recipe.output.name),
    ...traderRewards.flatMap((trade) =>
      trade.ingredients.map((ingredient) => ingredient.name),
    ),
    ...traderCosts.map((trade) => trade.output.name),
  ];
  const similarPages = allWikiEntries
    .filter((item) => item.slug !== entry.slug)
    .map((item) => ({
      item,
      score: entrySimilarityScore(entry, item),
    }))
    .filter(({ score }) => score >= 3)
    .sort(
      (left, right) =>
        right.score - left.score ||
        left.item.name.localeCompare(right.item.name),
    )
    .slice(0, 6)
    .map(({ item }) => item);
  const connectedPages = [
    ...related,
    ...garmentSiblings,
    ...relationNames
      .map(getWikiEntryByName)
      .filter((item) => item !== undefined),
    ...similarPages,
  ].filter(
    (item, index, items) =>
      item.slug !== entry.slug &&
      items.findIndex(
        (candidate) =>
          candidate.category === item.category && candidate.slug === item.slug,
      ) === index,
  );
  const usedAtStations = [
    ...new Set(usedInRecipes.map((recipe) => recipe.stationName)),
  ];
  const madeAtStations = [
    ...new Set(craftingOptions.map((recipe) => recipe.stationName)),
  ];
  const inputAmounts = usedInRecipes
    .map(
      (recipe) =>
        recipe.ingredients.find((ingredient) =>
          matchingNames.has(ingredient.name.toLowerCase()),
        )?.quantity,
    )
    .filter((amount): amount is number => amount !== undefined);
  const overviewFacts = [...entry.facts];
  const overviewLabels = new Set(
    overviewFacts.map((fact) => fact.label.toLowerCase()),
  );
  const addOverviewFact = (label: string, value: string) => {
    if (overviewLabels.has(label.toLowerCase())) return;
    overviewFacts.push({ label, value });
    overviewLabels.add(label.toLowerCase());
  };

  if (craftingOptions.length > 0) {
    addOverviewFact("Crafted at", madeAtStations.join(", "));
    addOverviewFact(
      "Recipe unlock",
      getRecipeUnlockLabel(craftingOptions[0].output.uuid),
    );
  }
  if (usedInRecipes.length > 0) {
    addOverviewFact(
      "Used by recipes",
      `${usedInRecipes.length} across ${usedAtStations.join(", ")}`,
    );
  }
  if (traderRewards.length > 0 || traderCosts.length > 0) {
    addOverviewFact(
      "Trader role",
      [
        traderRewards.length > 0
          ? `${traderRewards.length} offer${traderRewards.length === 1 ? "" : "s"} to obtain`
          : "",
        traderCosts.length > 0
          ? `${traderCosts.length} offer${traderCosts.length === 1 ? "" : "s"} as payment`
          : "",
      ]
        .filter(Boolean)
        .join("; "),
    );
  }

  const recipeSearchHref = `/wiki/recipes?q=${encodeURIComponent(entry.name)}`;
  const tradeSearchHref = `/wiki/trades?q=${encodeURIComponent(entry.name)}`;
  const venueName = (venueSlug: string) =>
    tradeCollection.venues.find((venue) => venue.slug === venueSlug)?.name ??
    venueSlug;

  return (
    <main className="content-page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: entry.name,
          description: playerDescription,
          dateModified: entry.lastTested,
          image: `${site.url}${entry.image}`,
          mainEntityOfPage: `${site.url}/wiki/${entry.category}/${entry.slug}`,
          author: {
            "@type": "Organization",
            name: site.publisherName,
            url: site.url,
          },
          publisher: {
            "@type": "Organization",
            name: site.publisherName,
            url: site.url,
          },
        }}
      />
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Wiki", href: "/wiki" },
                {
                  label: category?.name ?? entry.category,
                  href: `/wiki/${entry.category}`,
                },
                { label: entry.name },
              ]}
            />
            <span className={styles.fileLabel}>
              {category?.name ?? entry.category} / Version {entry.gameVersion}
            </span>
            <div className={styles.titleRow}>
              <span>{category?.symbol ?? "DB"}</span>
              <h1>{entry.name}</h1>
            </div>
            <p className={styles.lead}>
              <WikiLinkedText
                text={playerDescription}
                currentHref={currentHref}
              />
            </p>
            <div className={styles.meta}>
              <span>Version {entry.gameVersion}</span>
              <span>Checked {entry.lastTested}</span>
              <span>{category?.focus}</span>
              {hasUnlockRoute && (
                <Link href="#where-to-get-it">How to get it ↓</Link>
              )}
              {(craftingOptions.length > 0 ||
                (entry.recipes?.length ?? 0) > 0) && (
                <Link href="#current-recipes">Current recipe ↓</Link>
              )}
              {relatedQuests.length > 0 && (
                <Link href="#related-quests">Related quest ↓</Link>
              )}
              {hasPlayerRelations && (
                <Link href="#workshop-uses">Crafting & trade ↓</Link>
              )}
            </div>
          </div>
          <AssetDossier
            category={entry.category}
            facts={assetFacts}
            image={entry.image}
            imageAlt={entry.imageAlt}
            imageLabel={imageLabel}
            name={entry.name}
            pixelated={entry.category === "garments"}
          />
        </div>
      </section>
      <EvidenceStatus
        label={`${entry.name} verification status`}
        status="Entry version boundary"
        title={`${entry.name} is checked for ${entry.gameVersion}`}
        summary="The live game version is shown separately from this article's own test label. Structured recipe, trade, object, and quest relationships can also carry older source versions and are not automatically promoted by a site-wide release update."
        facts={[
          { label: "Live game", value: site.currentVersion },
          { label: "Entry version", value: entry.gameVersion },
          { label: "Entry checked", value: entry.lastTested },
        ]}
        tone={
          entry.gameVersion === site.currentVersion ? "confirmed" : "review"
        }
      />
      <GptAd
        slotId={`div-gpt-ad-wiki-entry-${entry.category}-${entry.slug}-1`}
        unit="banner1"
      />
      <section className="article-body-section">
        <div className="container article-body-content">
          <article className="article-copy">
            <dl className="fact-grid">
              {overviewFacts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>
                    <WikiLinkedText
                      text={fact.value}
                      currentHref={currentHref}
                    />
                  </dd>
                </div>
              ))}
            </dl>
            {isRewardProfile && (
              <section className={styles.entryProfile}>
                <div className={styles.sectionKicker}>
                  {entry.category === "garments"
                    ? "Outfit unlock"
                    : "Quest reward"}
                </div>
                <h2>{entry.name}: quest, use, and game values</h2>
                <div className={styles.profileGrid}>
                  <article>
                    <span>Where it unlocks</span>
                    <h3>
                      {relatedQuests.length > 0
                        ? "Quest reward"
                        : "Progression state"}
                    </h3>
                    <p>
                      <WikiLinkedText
                        text={
                          unlockValue ??
                          "No fixed quest assignment is listed for this entry."
                        }
                        currentHref={currentHref}
                      />
                    </p>
                    {relatedQuests.map(({ quest, reward }) => (
                      <Link
                        href={`/wiki/quests#${quest.slug}`}
                        key={quest.slug}
                      >
                        {quest.title} · {reward.type}
                      </Link>
                    ))}
                  </article>

                  {entry.category === "garments" ? (
                    <article>
                      <span>Outfit slot</span>
                      <h3>{slot} slot</h3>
                      <p>
                        {entry.name} belongs to the {family} group and changes
                        the {slot?.toLowerCase()} appearance. No armor,
                        durability, or machine-performance value is listed for
                        this wearable.
                      </p>
                      {garmentSiblings.length > 0 && (
                        <p>
                          Matching group:{" "}
                          {garmentSiblings.map((item, index) => (
                            <span key={item.slug}>
                              {index > 0 ? ", " : ""}
                              <Link
                                href={`/wiki/${item.category}/${item.slug}`}
                              >
                                {item.name}
                              </Link>
                            </span>
                          ))}
                          .
                        </p>
                      )}
                    </article>
                  ) : (
                    <article>
                      <span>Crafting status</span>
                      <h3>
                        {(entry.recipes?.length ?? 0) > 0
                          ? `${entry.recipes?.length} current method${
                              entry.recipes?.length === 1 ? "" : "s"
                            }`
                          : "No current recipe"}
                      </h3>
                      {(entry.recipes?.length ?? 0) > 0 ? (
                        entry.recipes?.map((recipe, index) => (
                          <p key={`${recipe.station}-${index}`}>
                            <strong>{recipe.station}</strong> ·{" "}
                            {recipe.duration}:{" "}
                            <WikiLinkedText
                              text={recipe.ingredients}
                              currentHref={currentHref}
                            />{" "}
                            → {recipe.output}
                          </p>
                        ))
                      ) : (
                        <p>
                          {entry.name} is registered through progression; the
                          current crafting list does not contain a finished-item
                          recipe with {entry.name} as its output.
                        </p>
                      )}
                    </article>
                  )}

                  <article>
                    <span>
                      {entry.category === "garments"
                        ? "Matching pieces"
                        : "Build properties"}
                    </span>
                    {entry.category === "garments" ? (
                      <>
                        <h3>{family} collection</h3>
                        <p>
                          {family === "Scrapper"
                            ? `Track the six eligible builder jobs and use the matching outfit entries to check the Scrapper ${slot?.toLowerCase()} slot.`
                            : `Use the linked quest and matching outfit entries to check the exact unlock path for this ${slot?.toLowerCase()}.`}
                        </p>
                      </>
                    ) : (
                      <>
                        <h3>{entryType ?? "Placeable reward"}</h3>
                        <dl>
                          {dimensions && (
                            <div>
                              <dt>Dimensions</dt>
                              <dd>{dimensions}</dd>
                            </div>
                          )}
                          {durability && (
                            <div>
                              <dt>Durability</dt>
                              <dd>{durability}</dd>
                            </div>
                          )}
                          {density && (
                            <div>
                              <dt>Density</dt>
                              <dd>{density}</dd>
                            </div>
                          )}
                          {friction && (
                            <div>
                              <dt>Friction</dt>
                              <dd>{friction}</dd>
                            </div>
                          )}
                          {buoyancy && (
                            <div>
                              <dt>Buoyancy</dt>
                              <dd>{buoyancy}</dd>
                            </div>
                          )}
                        </dl>
                      </>
                    )}
                  </article>
                </div>
              </section>
            )}
            {isRewardProfile && relatedQuests.length > 0 && (
              <section className={styles.questRecord} id="related-quests">
                <div className={styles.sectionKicker}>Quest requirements</div>
                <h2>The exact objective and reward bundle</h2>
                <div className={styles.questRecordGrid}>
                  {relatedQuests.map(({ quest, reward }) => (
                    <article key={quest.slug}>
                      <header>
                        <div>
                          <span>{quest.phase}</span>
                          <h3>{quest.title}</h3>
                        </div>
                        <Link href={`/wiki/quests#${quest.slug}`}>
                          Open quest →
                        </Link>
                      </header>
                      <p className={styles.questSummary}>{quest.summary}</p>
                      <dl>
                        <div>
                          <dt>Quest type</dt>
                          <dd>
                            {quest.kind === "main"
                              ? "Main story"
                              : `${quest.kind} task`}
                          </dd>
                        </div>
                        <div>
                          <dt>Objectives</dt>
                          <dd>{quest.objectiveCount}</dd>
                        </div>
                        <div>
                          <dt>Rewards</dt>
                          <dd>{quest.rewardCount}</dd>
                        </div>
                        <div>
                          <dt>This unlock</dt>
                          <dd>{reward.type}</dd>
                        </div>
                      </dl>
                      {(quest.objectiveHighlights?.length ?? 0) > 0 && (
                        <div className={styles.questSteps}>
                          <strong>Objective sequence</strong>
                          <ol>
                            {quest.objectiveHighlights?.map((objective) => (
                              <li key={objective}>
                                <WikiLinkedText
                                  text={objective}
                                  currentHref={currentHref}
                                />
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                      {(quest.rewards?.length ?? 0) > 0 && (
                        <div className={styles.rewardBundle}>
                          <strong>Complete reward bundle</strong>
                          <ul>
                            {quest.rewards?.map((questReward) => (
                              <li
                                key={`${questReward.type}-${questReward.name}`}
                              >
                                <span>{questReward.type}</span>
                                {questReward.wikiHref ? (
                                  <Link href={questReward.wikiHref}>
                                    {questReward.name}
                                  </Link>
                                ) : (
                                  <b>{questReward.name}</b>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            )}
            {entry.category === "garments" &&
              garmentSiblings.length > 0 &&
              family !== "T-Shirt" && (
                <section className={styles.outfitRecord}>
                  <div className={styles.sectionKicker}>Matching outfit</div>
                  <h2>{family} set unlock map</h2>
                  <p>
                    {family === "Scrapper"
                      ? "Scrapper pieces are awarded by completion position across the six eligible builder jobs. They are not permanently assigned to individual quest names."
                      : "Each piece is a separate quest reward. Completing one quest does not grant the rest of the set."}
                  </p>
                  <div className={styles.dataTableScroll}>
                    <table className={styles.dataTable}>
                      <thead>
                        <tr>
                          <th>Piece</th>
                          <th>Slot</th>
                          {family !== "Scrapper" && <th>Quest</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {[entry, ...garmentSiblings]
                          .sort((left, right) =>
                            left.name.localeCompare(right.name),
                          )
                          .map((item) => {
                            const questLink = getQuestsForWikiEntry(
                              item.category,
                              item.slug,
                            )[0];
                            return (
                              <tr key={item.slug}>
                                <td>
                                  <Link
                                    href={`/wiki/${item.category}/${item.slug}`}
                                  >
                                    {item.name}
                                  </Link>
                                </td>
                                <td>{garmentSlot(item.name)}</td>
                                {family !== "Scrapper" && (
                                  <td>
                                    {questLink ? (
                                      <Link
                                        href={`/wiki/quests#${questLink.quest.slug}`}
                                      >
                                        {questLink.quest.title}
                                      </Link>
                                    ) : (
                                      "Progression reward"
                                    )}
                                  </td>
                                )}
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}
            {hasPlayerRelations && (
              <section className={styles.relationPanel} id="workshop-uses">
                <div className={styles.sectionKicker}>Crafting and trade</div>
                <h2>Where {entry.name} fits</h2>
                <p>
                  {craftingOptions.length > 0 && (
                    <>
                      {entry.name} has {craftingOptions.length} production route
                      {craftingOptions.length === 1 ? "" : "s"} at{" "}
                      {madeAtStations.join(", ")}.{" "}
                    </>
                  )}
                  {usedInRecipes.length > 0 && (
                    <>
                      It is consumed by {usedInRecipes.length} recipe
                      {usedInRecipes.length === 1 ? "" : "s"} across{" "}
                      {usedAtStations.join(", ")}
                      {inputAmounts.length > 0
                        ? `, using ${Math.min(...inputAmounts)}–${Math.max(
                            ...inputAmounts,
                          )} per batch`
                        : ""}
                      .{" "}
                    </>
                  )}
                  {traderRewards.length + traderCosts.length > 0 && (
                    <>
                      It also appears in{" "}
                      {traderRewards.length + traderCosts.length} trader offer
                      {traderRewards.length + traderCosts.length === 1
                        ? ""
                        : "s"}
                      .
                    </>
                  )}
                </p>
                <div className={styles.relationGrid}>
                  {craftingOptions.length > 0 && (
                    <article>
                      <header>
                        <span>How to make it</span>
                        <b>
                          {craftingOptions.length} option
                          {craftingOptions.length === 1 ? "" : "s"}
                        </b>
                      </header>
                      <ul>
                        {displayedCraftingOptions.slice(0, 8).map((recipe) => (
                          <li key={recipe.id}>
                            <strong>{recipe.stationName}</strong>
                            <span>
                              <WikiLinkedText
                                text={recipe.ingredients
                                  .map(
                                    (ingredient) =>
                                      `${ingredient.quantity}× ${ingredient.name}`,
                                  )
                                  .join(" + ")}
                                currentHref={currentHref}
                              />
                            </span>
                            <small>
                              {recipe.output.quantity}× {recipe.output.name}
                              {recipe.craftTime > 0
                                ? ` / ${recipe.craftTime} seconds`
                                : ""}
                              {" / "}
                              {getRecipeUnlockLabel(recipe.output.uuid)}
                            </small>
                          </li>
                        ))}
                      </ul>
                      <Link href={recipeSearchHref}>
                        Compare every matching recipe →
                      </Link>
                    </article>
                  )}

                  {usedInRecipes.length > 0 && (
                    <article>
                      <header>
                        <span>What it can make</span>
                        <b>
                          {usedInRecipes.length} recipe
                          {usedInRecipes.length === 1 ? "" : "s"}
                        </b>
                      </header>
                      <ul>
                        {usedInRecipes.slice(0, 12).map((recipe) => {
                          const matchedIngredient = recipe.ingredients.find(
                            (ingredient) =>
                              matchingNames.has(ingredient.name.toLowerCase()),
                          );
                          return (
                            <li key={recipe.id}>
                              <strong>
                                <WikiLinkedText
                                  text={recipe.output.name}
                                  currentHref={currentHref}
                                />
                              </strong>
                              <span>
                                Uses {matchedIngredient?.quantity}×{" "}
                                {matchedIngredient?.name} at{" "}
                                {recipe.stationName}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                      {usedInRecipes.length > 12 && (
                        <small>
                          Plus {usedInRecipes.length - 12} more matches in the
                          recipe directory.
                        </small>
                      )}
                      <Link href={recipeSearchHref}>Search every use →</Link>
                    </article>
                  )}

                  {(traderRewards.length > 0 || traderCosts.length > 0) && (
                    <article>
                      <header>
                        <span>Trader connection</span>
                        <b>
                          {traderRewards.length + traderCosts.length} offer
                          {traderRewards.length + traderCosts.length === 1
                            ? ""
                            : "s"}
                        </b>
                      </header>
                      <ul>
                        {traderRewards.slice(0, 6).map((trade) => (
                          <li key={`reward-${trade.id}`}>
                            <strong>
                              {venueName(trade.venueSlug)} · receive{" "}
                              {trade.output.quantity}× {entry.name}
                            </strong>
                            <span>
                              Trade{" "}
                              <WikiLinkedText
                                text={trade.ingredients
                                  .map(
                                    (ingredient) =>
                                      `${ingredient.quantity}× ${ingredient.name}`,
                                  )
                                  .join(" + ")}
                                currentHref={currentHref}
                              />
                            </span>
                          </li>
                        ))}
                        {traderCosts.slice(0, 6).map((trade) => {
                          const amount = trade.ingredients.find((ingredient) =>
                            matchingNames.has(ingredient.name.toLowerCase()),
                          )?.quantity;
                          return (
                            <li key={`cost-${trade.id}`}>
                              <strong>
                                {venueName(trade.venueSlug)} · receive{" "}
                                {trade.output.quantity}×{" "}
                                <WikiLinkedText
                                  text={trade.output.name}
                                  currentHref={currentHref}
                                />
                              </strong>
                              <span>
                                Trade {amount}× {entry.name}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                      <Link href={tradeSearchHref}>
                        Compare every matching offer →
                      </Link>
                    </article>
                  )}
                </div>
                <p className={styles.relationCheck}>
                  Recipe and trader connections checked for version{" "}
                  {recipeCollection.checkedVersion}.
                </p>
              </section>
            )}
            {acquisition && (
              <section className={styles.acquisition} id="where-to-get-it">
                <div className={styles.sectionKicker}>How to get it</div>
                <h2>Routes and locations</h2>
                <p>
                  <WikiLinkedText
                    text={acquisition.summary}
                    currentHref={currentHref}
                  />
                </p>
                <div className={styles.sourceGrid}>
                  {acquisition.locations.map((location) => (
                    <article key={location.name}>
                      <span>Method / location</span>
                      <h3>{location.name}</h3>
                      <p>
                        <WikiLinkedText
                          text={location.detail}
                          currentHref={currentHref}
                        />
                      </p>
                      {location.href && (
                        <Link href={location.href}>Open related entry →</Link>
                      )}
                    </article>
                  ))}
                </div>
                <div className={styles.fieldChecklist}>
                  <strong>Before you leave</strong>
                  <ul>
                    {acquisition.fieldNotes.map((note) => (
                      <li key={note}>
                        <WikiLinkedText text={note} currentHref={currentHref} />
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}
            {!isRewardProfile && !acquisition && relatedQuests.length > 0 && (
              <section className={styles.acquisition} id="where-to-get-it">
                <div className={styles.sectionKicker}>How to get it</div>
                <h2>Unlock it through the quest line</h2>
                <p>
                  This entry is tied to a confirmed quest reward. Finish the
                  listed objective chain, let the reward register, then check
                  the Craftbot or customization interface according to the
                  reward type.
                </p>
                <div className={styles.sourceGrid}>
                  {relatedQuests.map(({ quest, reward }) => (
                    <article key={quest.slug}>
                      <span>{reward.type} reward</span>
                      <h3>{quest.title}</h3>
                      <p>
                        Complete this{" "}
                        {quest.kind === "main" ? "main-story" : "side"} quest
                        during {quest.phase.toLowerCase()}.
                      </p>
                      <Link href={`/wiki/quests#${quest.slug}`}>
                        Open quest objectives →
                      </Link>
                    </article>
                  ))}
                </div>
                <div className={styles.fieldChecklist}>
                  <strong>After completion</strong>
                  <ul>
                    <li>
                      Wait for the quest tracker and reward state to update.
                    </li>
                    <li>
                      A schematic unlock enables a recipe; it is not the same as
                      receiving a finished placeable part.
                    </li>
                    <li>
                      Customization rewards appear through the character outfit
                      interface.
                    </li>
                  </ul>
                </div>
              </section>
            )}
            {(craftingOptions.length > 0 ||
              (entry.recipes?.length ?? 0) > 0 ||
              (entry.properties?.length ?? 0) > 0 ||
              (entry.tables?.length ?? 0) > 0 ||
              Boolean(playerItem?.description) ||
              variantObjects.length > 1) && (
              <section className={styles.databasePanel}>
                <div className={styles.sectionKicker}>Game data</div>
                <h2 id="current-recipes">
                  {entry.name} recipes and properties
                </h2>
                {playerItem?.description && (
                  <div className={styles.inventoryNote}>
                    <strong>Inventory description</strong>
                    <p>{playerItem.description}</p>
                  </div>
                )}
                {craftingOptions.length > 0 ? (
                  <div className={styles.recipeFlowList}>
                    {entry.slug === "metal-blocks" && (
                      <MetalProgressionPanel recipes={craftingOptions} />
                    )}
                    {displayedCraftingOptions.slice(0, 8).map((recipe) => (
                      <WikiRecipeFlow
                        currentHref={currentHref}
                        key={recipe.id}
                        recipe={recipe}
                      />
                    ))}
                  </div>
                ) : (entry.recipes?.length ?? 0) > 0 ? (
                  <div className={styles.recipeStack}>
                    {entry.recipes?.map((recipe, index) => (
                      <article
                        key={`${recipe.station}-${recipe.output}-${index}`}
                      >
                        <header>
                          <span>{recipe.station}</span>
                          <b>{recipe.duration}</b>
                        </header>
                        <div>
                          <p>
                            <WikiLinkedText
                              text={recipe.ingredients}
                              currentHref={currentHref}
                            />
                          </p>
                          <span aria-hidden="true">→</span>
                          <strong>
                            <WikiLinkedText
                              text={recipe.output}
                              currentHref={currentHref}
                            />
                          </strong>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : null}
                {(entry.properties?.length ?? 0) > 0 && (
                  <WikiPropertyGrid
                    currentHref={currentHref}
                    properties={entry.properties ?? []}
                  />
                )}
                {variantObjects.length > 1 && (
                  <div className={styles.dataTableWrap}>
                    <h3>Variant object values</h3>
                    <div className={styles.dataTableScroll}>
                      <table className={styles.dataTable}>
                        <thead>
                          <tr>
                            <th>Variant</th>
                            <th>Stack</th>
                            <th>Collision size</th>
                            <th>Material</th>
                            <th>Durability</th>
                            <th>Density</th>
                            <th>Friction</th>
                            <th>Buoyancy</th>
                          </tr>
                        </thead>
                        <tbody>
                          {variantObjects.map(({ name, details }) => (
                            <tr key={details.uuid}>
                              <td>{name}</td>
                              <td>{details.stackSize ?? "—"}</td>
                              <td>{formatObjectDimensions(details) ?? "—"}</td>
                              <td>{details.physicsMaterial ?? "—"}</td>
                              <td>
                                {details.ratings?.durability !== undefined
                                  ? `${details.ratings.durability} / 10`
                                  : "—"}
                              </td>
                              <td>
                                {details.ratings?.density !== undefined
                                  ? `${details.ratings.density} / 10`
                                  : "—"}
                              </td>
                              <td>
                                {details.ratings?.friction !== undefined
                                  ? `${details.ratings.friction} / 10`
                                  : "—"}
                              </td>
                              <td>
                                {details.ratings?.buoyancy !== undefined
                                  ? `${details.ratings.buoyancy} / 10`
                                  : "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                {entry.tables?.map((table) => (
                  <div
                    className={`${styles.dataTableWrap} ${
                      /upgrade|level/i.test(table.caption)
                        ? styles.upgradeTableWrap
                        : ""
                    }`}
                    key={table.caption}
                  >
                    <h3>{table.caption}</h3>
                    <div className={styles.dataTableScroll}>
                      <table className={styles.dataTable}>
                        <thead>
                          <tr>
                            {table.headers.map((header) => (
                              <th key={header}>{header}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {table.rows.map((row) => (
                            <tr key={row.join("|")}>
                              {row.map((cell, index) => (
                                <td key={`${row[0]}-${index}`}>
                                  <WikiLinkedText
                                    text={cell}
                                    currentHref={currentHref}
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {table.note ? (
                      <p className={styles.dataTableNote}>
                        <WikiLinkedText
                          text={table.note}
                          currentHref={currentHref}
                        />
                      </p>
                    ) : null}
                  </div>
                ))}
              </section>
            )}
            {!isRewardProfile &&
              entry.sections.map((section) => (
                <section key={section.heading}>
                  <h2>{section.heading}</h2>
                  {section.paragraphs?.map((paragraph) => (
                    <p key={paragraph}>
                      <WikiLinkedText
                        text={paragraph}
                        currentHref={currentHref}
                      />
                    </p>
                  ))}
                  {section.bullets && (
                    <ul>
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>
                          <WikiLinkedText
                            text={bullet}
                            currentHref={currentHref}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.steps && (
                    <ol>
                      {section.steps.map((step) => (
                        <li key={step}>
                          <WikiLinkedText
                            text={step}
                            currentHref={currentHref}
                          />
                        </li>
                      ))}
                    </ol>
                  )}
                </section>
              ))}
            {!isRewardProfile && relatedQuests.length > 0 && (
              <section className={styles.questConnections} id="related-quests">
                <div className={styles.sectionKicker}>Quest connection</div>
                <h2>Quest that awards {entry.name}</h2>
                <p>
                  Finish the linked objective chain and allow the Logbook reward
                  state to update before checking the Craftbot or outfit menu.
                </p>
                <div>
                  {relatedQuests.map(({ quest, reward }) => (
                    <Link href={`/wiki/quests#${quest.slug}`} key={quest.slug}>
                      <span>{quest.phase}</span>
                      <h3>{quest.title}</h3>
                      <p>Reward: {reward.name}</p>
                      <b>View quest →</b>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </article>
          <aside className="article-sidebar">
            <div className="sidebar-panel">
              <span className="sidebar-label">KEEP EXPLORING</span>
              <p>
                Wiki / {entry.category} / {entry.name}
              </p>
              <Link
                className="button button-secondary"
                href={`/wiki/${entry.category}`}
              >
                View {entry.category}
              </Link>
            </div>
            {connectedPages.length > 0 && (
              <div className="sidebar-panel">
                <span className="sidebar-label">CONNECTED PAGES</span>
                <ul className="sidebar-links">
                  {connectedPages.slice(0, 12).map((item) => (
                    <li key={`${item.category}-${item.slug}`}>
                      <Link href={`/wiki/${item.category}/${item.slug}`}>
                        {item.name} <span aria-hidden="true">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
