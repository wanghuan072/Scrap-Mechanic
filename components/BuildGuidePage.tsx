import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { WikiLinkedText } from "@/components/WikiLinkedText";
import {
  formatCraftTime,
  getBuildPartCosts,
  getDirectMaterialTotals,
} from "@/data/builds/buildCalculations";
import type { BuildSpec } from "@/data/builds/specs";
import { getPlayerItemImage } from "@/data/game/playerData";
import { site } from "@/data/site";
import type { ArticleEntry } from "@/data/types";
import { builds, getWikiEntryByName } from "@/lib/content";
import styles from "./build-guide.module.css";

function wikiHref(name: string) {
  const entry = getWikiEntryByName(name);
  return entry
    ? `/wiki/${entry.category}/${entry.slug}`
    : `/wiki/recipes?q=${encodeURIComponent(name)}#recipe-directory`;
}

function ItemImage({
  name,
  size = 62,
}: {
  name: string;
  size?: number;
}) {
  const image = getPlayerItemImage(name);
  if (!image) return <span className={styles.itemFallback}>{name.charAt(0)}</span>;

  return (
    <Image
      src={image}
      alt={`${name} item icon`}
      width={size}
      height={size}
    />
  );
}

export function BuildGuidePage({
  entry,
  spec,
}: {
  entry: ArticleEntry;
  spec: BuildSpec;
}) {
  const currentHref = `/builds/${entry.slug}`;
  const partCosts = getBuildPartCosts(spec);
  const directMaterials = getDirectMaterialTotals(partCosts);
  const craftSeconds = partCosts.reduce(
    (total, item) => total + item.craftSeconds,
    0,
  );
  const craftableParts = partCosts.filter((item) => item.recipe).length;
  const relatedBuilds = builds
    .filter(
      (candidate) =>
        candidate.slug !== entry.slug &&
        (candidate.category === entry.category ||
          spec.variants.some((variant) =>
            candidate.title
              .toLowerCase()
              .includes(variant.situation.toLowerCase().split(" ")[0]),
          )),
    )
    .slice(0, 3);
  const fallbackRelated = builds
    .filter(
      (candidate) =>
        candidate.slug !== entry.slug &&
        !relatedBuilds.some((related) => related.slug === candidate.slug),
    )
    .slice(0, 3 - relatedBuilds.length);
  const finalRelated = [...relatedBuilds, ...fallbackRelated];

  return (
    <main className={styles.page}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: entry.title,
          description: spec.purpose,
          image: `${site.url}${entry.image}`,
          url: `${site.url}${currentHref}`,
          dateModified: entry.updated,
          author: { "@type": "Organization", name: site.publisherName, url: site.url },
          publisher: { "@type": "Organization", name: site.publisherName, url: site.url },
          tool: spec.toolkit.map((tool) => ({
            "@type": "HowToTool",
            name: tool.name,
          })),
          supply: spec.parts.map((part) => ({
            "@type": "HowToSupply",
            name: `${part.quantity} × ${part.name}`,
          })),
          step: spec.stages.map((stage) => ({
            "@type": "HowToSection",
            name: stage.title,
            itemListElement: stage.steps.map((step, index) => ({
              "@type": "HowToStep",
              position: index + 1,
              text: step,
            })),
          })),
        }}
      />

      <section className={styles.hero}>
        <Image
          className={styles.heroImage}
          src={entry.image}
          alt=""
          fill
          sizes="100vw"
          priority
        />
        <div className={styles.heroShade} />
        <div className={`container ${styles.heroInner}`}>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Builds", href: "/builds" },
              { label: entry.title },
            ]}
          />
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <span className={styles.eyebrow}>
                Workshop blueprint / {spec.blueprintId}
              </span>
              <h1>{entry.title}</h1>
              <p>{spec.purpose}</p>
              <div className={styles.heroMeta}>
                <span>{spec.difficulty}</span>
                <span>{spec.buildTime}</span>
                <span>{spec.crew}</span>
                <span>Version {entry.gameVersion}</span>
              </div>
            </div>
            <aside className={styles.heroDocket}>
              <span>Build decision</span>
              <strong>{spec.blueprintId}</strong>
              <dl>
                <div>
                  <dt>Parts placed</dt>
                  <dd>
                    {spec.parts.reduce(
                      (total, part) => total + part.quantity,
                      0,
                    )}
                  </dd>
                </div>
                <div>
                  <dt>Part types</dt>
                  <dd>{spec.parts.length}</dd>
                </div>
                <div>
                  <dt>Build stages</dt>
                  <dd>{spec.stages.length}</dd>
                </div>
                <div>
                  <dt>Tests</dt>
                  <dd>{spec.tests.length}</dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>
      </section>

      <nav className={styles.jumpBar} aria-label="Build page sections">
        <div className="container">
          <a href="#choose">Use case</a>
          <a href="#baseline">Baseline</a>
          <a href="#parts">Parts</a>
          <a href="#cost">Crafting cost</a>
          <a href="#stages">Build stages</a>
          <a href="#connections">Connections</a>
          <a href="#tests">Tests</a>
        </div>
      </nav>

      <section className={styles.decisionSection} id="choose">
        <div className={`container ${styles.decisionGrid}`}>
          <article className={styles.decisionYes}>
            <span>Choose this build when</span>
            <ul>
              {spec.bestFor.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className={styles.decisionNo}>
            <span>Choose another approach when</span>
            <ul>
              {spec.avoidWhen.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className={styles.blueprintSection} id="baseline">
        <div className={`container ${styles.blueprintGrid}`}>
          <header className={styles.sectionIntro}>
            <span>01 / Size the job</span>
            <h2>Workshop baseline</h2>
            <p>
              Use these dimensions and targets for the first working version. They
              are a practical starting layout, not a fixed in-game preset; adjust
              them only after the baseline passes its tests.
            </p>
            <Link href="/tools/crafting-planner">Plan the craftable parts →</Link>
          </header>
          <dl className={styles.baselineSheet}>
            {spec.baseline.map((item, index) => (
              <div key={item.label}>
                <dt>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {item.label}
                </dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className={styles.partsSection} id="parts">
        <div className="container">
          <header className={styles.wideHeading}>
            <div>
              <span>02 / Prepare the bench</span>
              <h2>Part manifest</h2>
            </div>
            <p>
              The quantities below describe one baseline build. Optional parts are
              marked so you can prove the working system before spending on
              lighting, storage, or automation.
            </p>
          </header>
          <div className={styles.partTable}>
            <div className={styles.partHead}>
              <span>Part</span>
              <span>Qty</span>
              <span>Job in this build</span>
              <span>Priority</span>
            </div>
            {spec.parts.map((part) => (
              <div className={styles.partRow} key={part.name}>
                <Link className={styles.partIdentity} href={wikiHref(part.name)}>
                  <ItemImage name={part.name} />
                  <strong>{part.name}</strong>
                </Link>
                <b className={styles.partQuantity}>× {part.quantity}</b>
                <p>
                  <WikiLinkedText
                    text={part.role}
                    currentHref={currentHref}
                    maxLinks={2}
                  />
                </p>
                <span
                  className={
                    part.essential ? styles.essential : styles.optional
                  }
                >
                  {part.essential ? "Required" : "Optional"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.costSection} id="cost">
        <div className={`container ${styles.costGrid}`}>
          <header className={styles.sectionIntro}>
            <span>03 / Count before crafting</span>
            <h2>Direct crafting cost</h2>
            <p>
              This total multiplies each listed part by its preferred Craftbot or
              Mechanic Station recipe. Processed materials and block recipes are
              shown as direct inputs instead of being expanded into every earlier
              production step.
            </p>
            <dl className={styles.costSummary}>
              <div>
                <dt>Craftable part types</dt>
                <dd>
                  {craftableParts}/{spec.parts.length}
                </dd>
              </div>
              <div>
                <dt>Station time</dt>
                <dd>{formatCraftTime(craftSeconds)}</dd>
              </div>
              <div>
                <dt>Input types</dt>
                <dd>{directMaterials.length}</dd>
              </div>
            </dl>
            <Link href="/tools/crafting-planner">
              Recalculate in the Crafting Planner →
            </Link>
          </header>
          <div className={styles.materialPanel}>
            <div className={styles.materialTitle}>
              <strong>Combined direct inputs</strong>
              <span>{spec.blueprintId}</span>
            </div>
            <div className={styles.materialGrid}>
              {directMaterials.map((material) => (
                <Link
                  href={wikiHref(material.name)}
                  className={styles.material}
                  key={material.uuid}
                >
                  {material.image ? (
                    <Image
                      src={material.image}
                      alt={`${material.name} item icon`}
                      width={50}
                      height={50}
                    />
                  ) : (
                    <ItemImage name={material.name} size={50} />
                  )}
                  <span>{material.name}</span>
                  <strong>× {material.quantity}</strong>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className={`container ${styles.recipeRows}`}>
          {partCosts.map(({ part, recipe, batches, ingredients, unlock }) => (
            <article className={styles.recipeRow} key={part.name}>
              <div className={styles.recipeOutput}>
                <ItemImage name={part.name} size={52} />
                <div>
                  <span>{part.quantity} needed</span>
                  <strong>{part.name}</strong>
                </div>
              </div>
              {recipe ? (
                <>
                  <div className={styles.recipeStation}>
                    <span>{recipe.stationName}</span>
                    <strong>
                      {batches} {batches === 1 ? "batch" : "batches"} ·{" "}
                      {formatCraftTime(recipe.craftTime * batches)}
                    </strong>
                    <small>{unlock}</small>
                  </div>
                  <div className={styles.recipeInputs}>
                    {ingredients.map((ingredient) => (
                      <span key={ingredient.uuid}>
                        {ingredient.name} <b>× {ingredient.total}</b>
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <div className={styles.recipeUnavailable}>
                  No station recipe is listed for this part. Collect, trade, or
                  obtain it through progression before starting.
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className={styles.stagesSection} id="stages">
        <div className="container">
          <header className={styles.wideHeading}>
            <div>
              <span>04 / Build in testable systems</span>
              <h2>Construction sequence</h2>
            </div>
            <p>
              Do not place the next system until the checkpoint under the current
              stage is true. That keeps steering, motion, power, and storage
              failures separate.
            </p>
          </header>
          <div className={styles.stageList}>
            {spec.stages.map((stage) => (
              <article className={styles.stage} key={stage.number}>
                <div className={styles.stageNumber}>{stage.number}</div>
                <header>
                  <span>Stage goal</span>
                  <h3>{stage.title}</h3>
                  <p>{stage.goal}</p>
                </header>
                <ol>
                  {stage.steps.map((step) => (
                    <li key={step}>
                      <WikiLinkedText
                        text={step}
                        currentHref={currentHref}
                        maxLinks={2}
                      />
                    </li>
                  ))}
                </ol>
                <aside>
                  <span>Release checkpoint</span>
                  <p>{stage.checkpoint}</p>
                </aside>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.systemSection} id="connections">
        <div className={`container ${styles.systemGrid}`}>
          <div>
            <header className={styles.sectionIntro}>
              <span>05 / Use the right tool at the right moment</span>
              <h2>Workshop tools</h2>
              <p>
                Each tool below has a specific job in this build. Finish that job,
                then move to the next stage instead of wiring and tuning everything
                at once.
              </p>
            </header>
            <div className={styles.toolList}>
              {spec.toolkit.map((tool) => (
                <Link
                  className={styles.toolRow}
                  href={wikiHref(tool.name)}
                  key={tool.name}
                >
                  <ItemImage name={tool.name} size={58} />
                  <div>
                    <span>{tool.moment}</span>
                    <h3>{tool.name}</h3>
                    <p>{tool.use}</p>
                  </div>
                  <b aria-hidden="true">↗</b>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <header className={styles.sectionIntro}>
              <span>06 / Check every signal</span>
              <h2>Connection map</h2>
              <p>
                Read each row from input to output. Name or color the physical
                controls to match this map before closing the bodywork.
              </p>
            </header>
            <div className={styles.connectionList}>
              {spec.connections.map((connection, index) => (
                <article
                  className={styles.connection}
                  key={`${connection.from}-${connection.to}`}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{connection.from}</strong>
                    <small>{connection.purpose}</small>
                  </div>
                  <b aria-hidden="true">→</b>
                  <div>
                    <strong>{connection.to}</strong>
                    <small>{connection.setting}</small>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.testSection} id="tests">
        <div className="container">
          <header className={styles.wideHeading}>
            <div>
              <span>07 / Commission the build</span>
              <h2>Test bench</h2>
            </div>
            <p>
              Run these checks with the normal load fitted. If one fails, make the
              listed physical change and repeat that same test before changing
              another variable.
            </p>
          </header>
          <div className={styles.testTable}>
            <div className={styles.testHead}>
              <span>Test</span>
              <span>Pass condition</span>
              <span>If it fails</span>
            </div>
            {spec.tests.map((test) => (
              <div className={styles.testRow} key={test.test}>
                <strong>{test.test}</strong>
                <p>{test.pass}</p>
                <p>{test.ifItFails}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.variantsSection}>
        <div className={`container ${styles.variantsGrid}`}>
          <header className={styles.sectionIntro}>
            <span>08 / Adapt after it works</span>
            <h2>Scenario variants</h2>
            <p>
              Change the proven baseline for the route or job you actually have.
              Every upgrade adds a tradeoff, so repeat the test bench afterward.
            </p>
          </header>
          <div className={styles.variantList}>
            {spec.variants.map((variant) => (
              <article key={variant.situation}>
                <span>{variant.situation}</span>
                <h3>{variant.change}</h3>
                <p>{variant.tradeoff}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.relatedSection}>
        <div className="container">
          <header className={styles.relatedHeading}>
            <div>
              <span>Next workshop file</span>
              <h2>Compare another build</h2>
            </div>
            <Link href="/builds">View all 11 blueprints →</Link>
          </header>
          <div className={styles.relatedGrid}>
            {finalRelated.map((build) => (
              <Link href={`/builds/${build.slug}`} key={build.slug}>
                <Image
                  src={build.image}
                  alt={build.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div>
                  <span>{build.category}</span>
                  <h3>{build.title}</h3>
                  <p>{build.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
