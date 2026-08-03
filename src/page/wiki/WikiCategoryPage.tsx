import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { BotFieldGuide } from "@/page/wiki/components/BotFieldGuide";
import { SchematicUnlockDirectory } from "@/page/wiki/components/SchematicUnlockDirectory";
import { WikiCategoryPlanner } from "@/page/wiki/components/WikiCategoryPlanner";
import { PageJsonLd } from "@/seo/JsonLd";
import {
  recipeUnlockCollection,
  schematicUnlocks,
  tradeCollection,
} from "@/lib/game/player-data";
import { getWikiCategory, getWikiEntriesByCategory, quests, wikiCategories } from "@/lib/content/catalog";
import { createMetadata } from "@/seo/metadata";
import { wikiCategoryTdk } from "@/seo/tdk";
import styles from "@/style/page/wiki/category.module.css";

export function generateStaticParams() {
  return wikiCategories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getWikiCategory(slug);
  if (!category) return {};
  const seo = wikiCategoryTdk[slug];
  return seo ? createMetadata(seo, `/wiki/${slug}`) : {};
}

export default async function WikiCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = getWikiCategory(slug);
  if (!category) notFound();
  const entries = getWikiEntriesByCategory(slug);
  const isSchematics = slug === "schematics";
  const isBots = slug === "bots";
  const hasCategoryPlanner = slug === "tools" || slug === "resources";
  const seo = wikiCategoryTdk[slug] ?? wikiCategoryTdk.items;

  if (isSchematics) {
    return (
      <main>
        <PageJsonLd seo={seo} path={`/wiki/${slug}`} type="CollectionPage" />
        <section className={styles.schematicHero}>
          <div className={`container ${styles.schematicHeroInner}`}>
            <div className={styles.schematicHeroCopy}>
              <Breadcrumbs
                items={[
                  { label: "Home", href: "/" },
                  { label: "Wiki", href: "/wiki" },
                  { label: "Schematics" },
                ]}
              />
              <span className={styles.schematicKicker}>Wiki · Recipe unlocks</span>
              <h1>
                <span className={styles.schematicHeroBrand}>Scrap Mechanic Wiki</span>
                Schematics
              </h1>
              <p className={styles.schematicHeroDeck}>
                Match a locked recipe to the route that actually opens it. Craftbot
                and Saw Table hold{" "}
                {recipeUnlockCollection.counts.craftbotSawTableOutputs} outputs —{" "}
                {recipeUnlockCollection.counts.schematicbot} in the Schematicbot pool
                and {recipeUnlockCollection.counts.dedicated} on dedicated routes.
              </p>
              <div className={styles.schematicActions}>
                <Link href="/wiki/recipes?unlock=schematicbot#recipe-directory">
                  Browse scan recipes
                </Link>
                <Link href="#trader-schematic-offers">Check trader offers</Link>
              </div>
            </div>

            <aside className={styles.schematicHeroStage} aria-label="Schematic unlock overview">
              <div className={styles.schematicStagePlate}>
                <span className={styles.schematicStageTag}>Specimen / Box scan</span>
                <div className={styles.schematicStageOrb} aria-hidden="true" />
                <Image
                  src={category.image}
                  alt={category.imageAlt}
                  width={200}
                  height={200}
                  sizes="160px"
                  quality={75}
                  loading="eager"
                  fetchPriority="high"
                />
                <b>Schematic Box</b>
              </div>
              <div className={styles.schematicStageSide}>
                <dl className={styles.schematicFacts}>
                  <div>
                    <dt>Schematicbot pool</dt>
                    <dd>{recipeUnlockCollection.counts.schematicbot}</dd>
                  </div>
                  <div>
                    <dt>Dedicated routes</dt>
                    <dd>{recipeUnlockCollection.counts.dedicated}</dd>
                  </div>
                  <div>
                    <dt>Trader offers</dt>
                    <dd>{recipeUnlockCollection.counts.trader}</dd>
                  </div>
                </dl>
                <ol className={styles.schematicProcess}>
                  <li>
                    <span>01</span>
                    Find the route
                  </li>
                  <li>
                    <span>02</span>
                    Register recipe
                  </li>
                  <li>
                    <span>03</span>
                    Craft separately
                  </li>
                </ol>
              </div>
            </aside>
          </div>
        </section>

        <section className={styles.schematicHow}>
          <div className={`container ${styles.schematicHowInner}`}>
            <header>
              <h2>Six routes, one recipe list</h2>
              <p>
                A Schematicbot scan is only one route. Dedicated rewards bypass the
                station and unlock their listed recipe directly.
              </p>
            </header>
            <ol>
              <li>
                <span>01</span>
                <div>
                  <h3>
                    <Link href="/wiki/recipes?unlock=schematicbot#recipe-directory">
                      Schematicbot pool · 356
                    </Link>
                  </h3>
                  <p>
                    Scan a blue-icon part for its exact recipe without losing the
                    part, or consume one Schematic Box for a random remaining
                    recipe. The pool includes 30 Saw Table outputs.
                  </p>
                </div>
              </li>
              <li>
                <span>02</span>
                <div>
                  <h3>
                    <Link href="/wiki/recipes?unlock=trader#recipe-directory">
                      Trader offers · 42
                    </Link>
                  </h3>
                  <p>
                    Pay the exact Farmers Hideout or Mining Hub cost. The recipe
                    opens directly; no box scan or finished item is included.
                  </p>
                </div>
              </li>
              <li>
                <span>03</span>
                <div>
                  <h3>
                    <Link href="/wiki/recipes?unlock=quest#recipe-directory">
                      Quests and Farmer tasks · 65
                    </Link>
                  </h3>
                  <p>
                    Forty-seven story and side-quest rewards combine with eighteen
                    Farmer task-group unlocks. Each registers a fixed recipe.
                  </p>
                </div>
              </li>
              <li>
                <span>04</span>
                <div>
                  <h3>
                    <Link href="/wiki/recipes?unlock=growlab#recipe-directory">
                      Growlab rewards · 7
                    </Link>
                  </h3>
                  <p>
                    Each completed Growlab advances a fixed reward sequence,
                    including functional parts, storage, a weapon, and fireworks.
                  </p>
                </div>
              </li>
              <li>
                <span>05</span>
                <div>
                  <h3>
                    <Link href="/wiki/recipes?unlock=treasure#recipe-directory">
                      Refined treasures · 5
                    </Link>
                  </h3>
                  <p>
                    Coralium, Nimbolium, Lemonium, Sapphire, and Crystal recipes
                    open through their corresponding refined treasure progression.
                  </p>
                </div>
              </li>
              <li>
                <span>06</span>
                <div>
                  <h3>
                    <Link href="/wiki/recipes?unlock=special#recipe-directory">
                      Warehouse progression · 1
                    </Link>
                  </h3>
                  <p>
                    Plasma Drill Level 1 is tied to Warehouse progression and does
                    not enter the random Schematic Box pool.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        <section className={styles.schematicDirectorySection}>
          <div className="container">
            <SchematicUnlockDirectory
              unlocks={schematicUnlocks}
              venues={tradeCollection.venues}
            />
          </div>
        </section>

        <section className={styles.schematicHelp}>
          <div className={`container ${styles.schematicHelpInner}`}>
            <header>
              <h2>Choose the matching station guide</h2>
              <p>
                Use the box guide for supply routes and drop chances. Use the bot
                guide for exact scans, random scans, locations, and missing inputs.
              </p>
            </header>
            <div className={styles.schematicHelpLinks}>
              {entries.map((entry) => (
                <Link
                  href={`/wiki/${entry.category}/${entry.slug}`}
                  key={entry.slug}
                >
                  <span className={styles.schematicHelpImage}>
                    <Image
                      src={entry.image}
                      alt={entry.imageAlt}
                      fill
                      sizes="(max-width: 640px) 72px, 96px"
                    />
                  </span>
                  <span>
                    <strong>{entry.name}</strong>
                    <small>{entry.description}</small>
                  </span>
                  <b aria-hidden="true">↗</b>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <PageJsonLd seo={seo} path={`/wiki/${slug}`} type="CollectionPage" />
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Wiki", href: "/wiki" },
                { label: category.name },
              ]}
            />
            <span className={styles.heroIndex}>
              Database / {category.symbol} / {entries.length} entries
            </span>
            <h1>
              <span className={styles.heroBrand}>Scrap Mechanic Wiki</span>
              {category.name}
            </h1>
            <p>{category.description}</p>
            <dl className={styles.heroFacts}>
              <div>
                <dt>Category focus</dt>
                <dd>{category.focus}</dd>
              </div>
              <div>
                <dt>Page structure</dt>
                <dd>List → individual entry</dd>
              </div>
            </dl>
          </div>
          <div className={styles.heroVisual}>
            <span>Category {category.symbol}</span>
            <Image
              src={category.image}
              alt={category.imageAlt}
              width={200}
              height={200}
              sizes="168px"
              quality={75}
              loading="eager"
              fetchPriority="high"
            />
            <b>{category.name}</b>
          </div>
        </div>
      </section>

      <section className={styles.directory}>
        <div className={`container ${styles.directoryGrid}`}>
          <aside className={styles.categoryRail}>
            <header>
              <span>Wiki directory</span>
              <h2>Categories</h2>
            </header>
            <nav aria-label="Wiki categories">
              {wikiCategories.map((item, index) => {
                const count = getWikiEntriesByCategory(item.slug).length;
                return (
                  <Link
                    className={item.slug === slug ? styles.active : undefined}
                    href={`/wiki/${item.slug}`}
                    key={item.slug}
                    aria-current={item.slug === slug ? "page" : undefined}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <b>{item.name}</b>
                    <small>{count}</small>
                  </Link>
                );
              })}
              <Link href="/wiki/quests">
                <span>{String(wikiCategories.length + 1).padStart(2, "0")}</span>
                <b>Quests</b>
                <small>{quests.length}</small>
              </Link>
            </nav>
            <Link className={styles.allCategories} href="/wiki">
              Return to Wiki directory →
            </Link>
          </aside>

          <div className={styles.entryIndex}>
            <header className={styles.entryHeading}>
              <div>
                <span>{isBots ? "Behavior first / name second" : "Layer 02 / Select an entry"}</span>
                <h2>{isBots ? "All bot families and player routes" : `${category.name} field index`}</h2>
              </div>
              <p>
                {isBots
                  ? "Separate hostile enemies, non-aggressive carriers, passive creatures, and workshop stations before choosing a combat plan or farm route."
                  : "Open an entry only when it has unique numbers, recipes, drops, or progression routes. Shared category advice stays on this page."}
              </p>
            </header>

            {isBots && <BotFieldGuide />}

            {hasCategoryPlanner && <WikiCategoryPlanner category={slug} />}

            {!isBots && !hasCategoryPlanner && category.fieldGuide.length > 0 && (
              <div className={styles.fieldGuide}>
                {category.fieldGuide.map((section) => (
                  <article key={section.heading}>
                    <span>Category field guide</span>
                    <h3>{section.heading}</h3>
                    {section.paragraphs?.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                    {section.bullets && (
                      <ul>
                        {section.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </article>
                ))}
              </div>
            )}

            {entries.length ? (
              <>
                {isBots && (
                  <header className={styles.entryHeading}>
                    <div>
                      <span>Individual field files</span>
                      <h2>Health, attacks, drops, and counterplay</h2>
                    </div>
                    <p>
                      Open a bot when you need its exact behavior. The directory
                      above handles comparison; these pages handle one encounter
                      without repeating a generic combat script.
                    </p>
                  </header>
                )}
                <div className={styles.entryList}>
                  {entries.map((entry, index) => (
                    <Link
                      className={styles.entry}
                      href={`/wiki/${entry.category}/${entry.slug}`}
                      key={entry.slug}
                    >
                      <span className={styles.entryNumber}>{String(index + 1).padStart(2, "0")}</span>
                      <div className={styles.entryImage}>
                        <Image
                          src={entry.image}
                          alt={entry.imageAlt}
                          fill
                          sizes="(max-width: 768px) 92px, 150px"
                        />
                      </div>
                      <div className={styles.entryCopy}>
                        <span>Version {entry.gameVersion} · Checked {entry.lastTested}</span>
                        <h3>{entry.name}</h3>
                        <p>{entry.description}</p>
                        <dl>
                          {entry.facts.slice(0, 2).map((fact) => (
                            <div key={fact.label}>
                              <dt>{fact.label}</dt>
                              <dd>{fact.value}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                      <span className={styles.entryArrow} aria-hidden="true">↗</span>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <div className="empty-state">
                This category is visible and ready for confirmed entries.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
