import Image from "next/image";
import Link from "next/link";
import {
  botDirectoryGroups,
  botQuestions,
  cropBotRoutes,
} from "@/data/wiki/botGuide";
import { getPlayerItemImage } from "@/data/game/playerData";
import styles from "./bot-field-guide.module.css";

function BotName({
  name,
  href,
}: {
  name: string;
  href?: string;
}) {
  return href ? <Link href={href}>{name}</Link> : name;
}

export function BotFieldGuide() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: botQuestions.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div className={styles.guide}>
      <nav className={styles.jumpBar} aria-label="Bot guide sections">
        <span>Find an answer</span>
        <a href="#bot-types">Bot types</a>
        <a href="#crop-bot-routes">Crops and bots</a>
        <a href="#bot-questions">Player questions</a>
        <Link href="/tools/raid-calculator">Raid calculator</Link>
      </nav>

      <section className={styles.intro} id="bot-types">
        <header>
          <span>Bot field index</span>
          <h2>First decide what kind of “bot” you mean</h2>
        </header>
        <p>
          Enemy robots, non-aggressive resource carriers, passive creatures, and
          workshop stations follow different rules. Start with behavior and
          location, then open the matching file for health, drops, or operating
          steps.
        </p>
      </section>

      <div className={styles.groupList}>
        {botDirectoryGroups.map((group, groupIndex) => (
          <section className={styles.group} id={group.id} key={group.id}>
            <header className={styles.groupHeader}>
              <span>{String(groupIndex + 1).padStart(2, "0")}</span>
              <div>
                <small>{group.label}</small>
                <h3>{group.title}</h3>
                <p>{group.description}</p>
              </div>
            </header>
            <div className={styles.table}>
              <div className={styles.tableHead}>
                <span>Name</span>
                <span>Behavior</span>
                <span>Where it matters</span>
                <span>Drop or output</span>
                <span>Player response</span>
              </div>
              {group.rows.map((row) => (
                <article className={styles.tableRow} key={row.name}>
                  <strong>
                    <BotName name={row.name} href={row.href} />
                  </strong>
                  <p data-label="Behavior">{row.behavior}</p>
                  <p data-label="Where it matters">{row.encounter}</p>
                  <p data-label="Drop or output">{row.output}</p>
                  <p data-label="Player response">{row.response}</p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className={styles.cropSection} id="crop-bot-routes">
        <header className={styles.sectionHeading}>
          <div>
            <span>Crops and robots</span>
            <h2>Which bot gives, uses, or moves each crop?</h2>
          </div>
          <p>
            Seedbot is an acquisition route, Lootbot is a conditional produce
            route, and Cookbot is a processing station. None of them replaces a
            field: soil, water, growth time, harvesting, and raid defense still
            belong to the farm.
          </p>
        </header>

        <div className={styles.cropTable}>
          <div className={styles.cropHead}>
            <span>Crop</span>
            <span>Seedbot route</span>
            <span>Lootbot route</span>
            <span>Cookbot use</span>
            <span>Storage decision</span>
          </div>
          {cropBotRoutes.map((route) => {
            const image = getPlayerItemImage(route.crop);
            return (
              <article className={styles.cropRow} key={route.crop}>
                <div className={styles.cropIdentity}>
                  {image && (
                    <Image
                      src={image}
                      alt={`${route.crop} item icon`}
                      width={52}
                      height={52}
                    />
                  )}
                  <strong>
                    {route.slug ? (
                      <Link href={`/wiki/crops/${route.slug}`}>{route.crop}</Link>
                    ) : (
                      route.crop
                    )}
                  </strong>
                </div>
                <p data-label="Seedbot route">{route.seedbot}</p>
                <p data-label="Lootbot route">{route.lootbot}</p>
                <p data-label="Cookbot use">{route.cookbot}</p>
                <p data-label="Storage decision">{route.fieldPlan}</p>
              </article>
            );
          })}
        </div>

        <div className={styles.cropActions}>
          <Link href="/wiki/crops">Open every crop profile →</Link>
          <Link href="/wiki/recipes?station=cookbot#recipe-directory">
            Check the three Cookbot recipes →
          </Link>
          <Link href="/builds/vacuum-harvester">
            Build a separated harvest route →
          </Link>
        </div>
      </section>

      <section className={styles.questions} id="bot-questions">
        <header className={styles.sectionHeading}>
          <div>
            <span>Direct answers</span>
            <h2>Questions players ask about Scrap Mechanic bots</h2>
          </div>
          <p>
            These answers separate current 1.0 behavior from older raid charts and
            from community shorthand that uses several names for the same
            encounter.
          </p>
        </header>
        <div className={styles.questionList}>
          {botQuestions.map((item, index) => (
            <details open={index === 0} key={item.question}>
              <summary>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {item.question}
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </div>
  );
}
