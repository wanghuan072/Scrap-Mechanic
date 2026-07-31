import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd, PageJsonLd } from "@/components/JsonLd";
import { TradeDirectory } from "@/components/TradeDirectory";
import {
  getPlayerItemImage,
  schematicUnlocks,
  tradeCollection,
} from "@/data/game/playerData";
import { site } from "@/data/site";
import { getWikiEntryByName } from "@/lib/content";
import { createMetadata } from "@/seo/metadata";
import { pageTdk } from "@/seo/tdk";
import styles from "./trades.module.css";

export const metadata: Metadata = createMetadata(pageTdk.trades, "/wiki/trades");

const faqs = [
  {
    question: "What can I trade at the Farmers Hideout?",
    answer:
      "The Hideout accepts packed crop crates and rescued Farmers for seeds, supplies, parts, weapons, and progression items.",
  },
  {
    question: "What currency does the Mining Hub use?",
    answer:
      "The Mining Hub trader uses Wonk Stacks. Prices range from smaller supply exchanges to expensive equipment, schematics, blocks, and outfit pieces.",
  },
  {
    question: "Does receiving a schematic give me the finished item?",
    answer:
      "No. Forty-two current offers unlock a matching recipe rather than delivering the pictured item. Open the linked recipe to check its materials, batch size, and station.",
  },
];

export default function TradesPage() {
  const wonkIcon = getPlayerItemImage("Wonk Stack");
  const tradeNames = [
    ...new Set(
      tradeCollection.trades.flatMap((trade) => [
        trade.output.name,
        ...trade.ingredients.map((ingredient) => ingredient.name),
      ]),
    ),
  ];
  const wikiLinks = Object.fromEntries(
    tradeNames.flatMap((name) => {
      const entry = getWikiEntryByName(name);
      return entry
        ? [[name.toLowerCase(), `/wiki/${entry.category}/${entry.slug}`] as const]
        : [];
    }),
  );
  const itemOfferCount = tradeCollection.tradeCount - schematicUnlocks.length;

  return (
    <main>
      <PageJsonLd seo={pageTdk.trades} path="/wiki/trades" type="CollectionPage" />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              name: "Scrap Mechanic Trader Prices",
              description:
                "Farmers Hideout and Mining Hub offers with exact exchange quantities.",
              url: `${site.url}/wiki/trades`,
              numberOfItems: tradeCollection.tradeCount,
              dateModified: "2026-07-30",
            },
            {
              "@type": "FAQPage",
              mainEntity: faqs.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
              })),
            },
          ],
        }}
      />

      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Wiki", href: "/wiki" },
                { label: "Trader Prices" },
              ]}
            />
            <span className={styles.eyebrow}>Hideout crates / Mining Hub Wonks</span>
            <h1>
              Scrap Mechanic Trader Prices <span>- Every Current Offer</span>
            </h1>
            <p>
              Compare exact costs across two trading locations. Every offer now says
              whether you receive a finished item or unlock a recipe that must still
              be crafted.
            </p>
            <div className={styles.heroLinks}>
              <Link href="/guides/trading-and-packing">Plan a packing route</Link>
              <Link href="/wiki/recipes">Browse crafting recipes</Link>
            </div>
          </div>
          <aside className={styles.pricePlate}>
            {wonkIcon && (
              <Image
                src={wonkIcon}
                alt="Wonk Stack item icon in Scrap Mechanic"
                width={160}
                height={160}
                priority
              />
            )}
            <strong>{tradeCollection.tradeCount}</strong>
            <span>current offers</span>
            <small>
              {itemOfferCount} items · {schematicUnlocks.length} recipe unlocks
            </small>
          </aside>
        </div>
      </section>

      <section className={styles.routeSection}>
        <div className="container">
          <header className={styles.routeHeading}>
            <div>
              <span>Two trader venues</span>
              <h2>Pick the currency route</h2>
            </div>
            <p>
              Farmers Hideout runs on packed crops and rescued Farmers. Mining Hub
              spends Wonk Stacks on a larger mixed catalog.
            </p>
          </header>
          <div className={styles.routeGrid}>
          <article>
            <span>Farmers Hideout</span>
            <h3>Pack crops, rescue Farmers</h3>
            <p>
              The Farmers Hideout contains 44 offers. Packing Stations supply crop
              crates, while rescued Farmers pay for a separate group of items and
              schematic unlocks.
            </p>
            <ul>
              <li>Confirm the crate type before loading the vehicle.</li>
              <li>Keep seed stock at home instead of packing the full harvest.</li>
              <li>Plan cargo space for the reward and the return trip.</li>
            </ul>
          </article>
          <article>
            <span>Mining Hub</span>
            <h3>Spend Wonks with a target</h3>
            <p>
              The Mining Hub contains 83 offers paid with Wonk Stacks. Its list mixes
              finished equipment, blocks, outfit pieces, supplies, and recipe
              unlocks, so filter by outcome before spending a large reserve.
            </p>
            <ul>
              <li>Write down the target price before leaving storage.</li>
              <li>Separate equipment purchases from cosmetic purchases.</li>
              <li>Remember that schematics still require later crafting.</li>
            </ul>
          </article>
          </div>
        </div>
      </section>

      <section className={styles.directorySection}>
        <div className="container">
          <Suspense fallback={<div className="empty-state">Preparing trader filters…</div>}>
            <TradeDirectory
              trades={tradeCollection.trades}
              venues={tradeCollection.venues}
              wikiLinks={wikiLinks}
            />
          </Suspense>
        </div>
      </section>

      <section className={styles.faqSection}>
        <div className={`container ${styles.faqGrid}`}>
          <header>
            <span>Trade planning</span>
            <h2>Before loading the hauler</h2>
            <p>
              Checked July 30, 2026 for version {tradeCollection.checkedVersion}.
              Recheck the visible offer after a game update.
            </p>
          </header>
          <div>
            {faqs.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
