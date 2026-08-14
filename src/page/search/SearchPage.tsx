import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { GptAd } from "@/components/ads/GptAd";
import { PageJsonLd } from "@/seo/JsonLd";
import { searchContent, wikiCategories } from "@/lib/content/catalog";
import { createMetadata } from "@/seo/metadata";
import { pageTdk } from "@/seo/tdk";

export const metadata: Metadata = createMetadata(
  pageTdk.search,
  "/search",
  { noIndex: true },
);

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const rawQuery = (await searchParams).q;
  const query = Array.isArray(rawQuery) ? rawQuery[0] : rawQuery ?? "";
  const results = searchContent(query);

  return (
    <main>
      <PageJsonLd seo={pageTdk.search} path="/search" />
      <section
        className="page-hero"
        style={{
          "--hero-image": "url(/images/scrap-mechanic/screenshot-04.jpg)",
        } as React.CSSProperties}
      >
        <div className="container page-hero-content">
          <span className="eyebrow">Site-wide field index</span>
          <h1>
            Scrap Mechanic Search <span>- Find an Answer</span>
          </h1>
          <p>
            Search the same wiki entries, guides, builds, quests, updates, mods, and
            player tools used across the rest of the site.
          </p>
        </div>
      </section>
      <GptAd slotId="div-gpt-ad-search-1" unit="banner1" />
      <section className="page-section">
        <div className="container">
          <div className="search-panel">
            <form className="search-form" action="/search" role="search">
              <label className="sr-only" htmlFor="site-search">Search site content</label>
              <input
                defaultValue={query}
                id="site-search"
                name="q"
                placeholder="Search bearing, farming, 1.0.2, mods..."
                type="search"
              />
              <button type="submit">Search</button>
            </form>
          </div>
          {query ? (
            <>
              <div className="section-heading">
                <div>
                  <span className="section-kicker">{results.length} matches</span>
                  <h2>Results for “{query}”</h2>
                </div>
              </div>
              {results.length > 0 ? (
                <div className="search-results">
                  {results.map((result) => (
                    <Link className="search-result" href={result.href} key={result.href}>
                      <div className="search-result-image">
                        <Image
                          src={result.image}
                          alt=""
                          fill
                          sizes="(max-width: 768px) 100px, 180px"
                        />
                      </div>
                      <div className="search-result-body">
                        <span>{result.type}</span>
                        <h3>{result.title}</h3>
                        <p>{result.description}</p>
                      </div>
                      <span className="search-result-arrow" aria-hidden="true">→</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  No current entry matches that phrase. Try a shorter part, bot,
                  mechanic, or task name.
                </div>
              )}
            </>
          ) : (
            <>
              <div className="section-heading">
                <div>
                  <span className="section-kicker">Browse instead</span>
                  <h2>Popular database paths</h2>
                </div>
              </div>
              <div className="wiki-grid">
                {wikiCategories.slice(0, 6).map((category) => (
                  <Link
                    className="wiki-category-card"
                    href={`/wiki/${category.slug}`}
                    key={category.slug}
                  >
                    <div className="wiki-category-body">
                      <span className="wiki-category-symbol">{category.symbol}</span>
                      <h3>{category.name}</h3>
                      <p>{category.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
