import Image from "next/image";
import Link from "next/link";
import type { ArticleEntry } from "@/data/types";
import { getWikiEntryBySlug } from "@/lib/content";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { site } from "@/data/site";

export function ArticlePage({
  entry,
  basePath,
  collectionLabel,
}: {
  entry: ArticleEntry;
  basePath: string;
  collectionLabel: string;
}) {
  const relatedWiki = (entry.relatedWiki ?? [])
    .map(getWikiEntryBySlug)
    .filter((item) => item !== undefined);

  return (
    <main className="content-page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: entry.title,
          description: entry.description,
          datePublished: entry.published,
          dateModified: entry.updated,
          image: `${site.url}${entry.image}`,
          mainEntityOfPage: `${site.url}${basePath}/${entry.slug}`,
          author: { "@type": "Organization", name: site.publisherName, url: site.url },
          publisher: { "@type": "Organization", name: site.publisherName, url: site.url },
        }}
      />
      <section className="article-hero-section">
        <Image
          className="article-hero-backdrop"
          src={entry.image}
          alt=""
          fill
          sizes="100vw"
          priority
        />
        <div className="article-hero-overlay" />
        <div className="container article-hero-content">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: collectionLabel, href: basePath },
              { label: entry.title },
            ]}
          />
          <div className="article-heading-grid">
            <div className="article-heading-copy">
              <span className="article-file-label">
                {collectionLabel} / {entry.category}
              </span>
              <h1>{entry.title}</h1>
              <p className="article-lead">{entry.description}</p>
              <div className="article-meta-strip">
                <span>Version {entry.gameVersion}</span>
                <span>Updated {entry.updated}</span>
                <span>{entry.readingTime}</span>
              </div>
            </div>
            <aside className="article-hero-docket">
              <span>FIELD FILE</span>
              <b>v{entry.gameVersion}</b>
              <dl>
                <div>
                  <dt>Route</dt>
                  <dd>{collectionLabel}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>Current</dd>
                </div>
                <div>
                  <dt>Use</dt>
                  <dd>{entry.category}</dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>
      </section>

      <section className="article-body-section">
        <div className="container article-body-content">
          <article className="article-copy">
            <aside className="quick-answer">
              <span>IN BRIEF</span>
              <p>{entry.quickAnswer}</p>
            </aside>
            {entry.tables?.map((table) => (
              <section key={table.caption} className="article-data-table">
                <h2>{table.caption}</h2>
                <div className="article-data-scroll">
                  <table>
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
                            <td key={`${row[0]}-${index}`}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {table.note ? <p className="article-data-note">{table.note}</p> : null}
              </section>
            ))}
            {entry.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.bullets && (
                  <ul>
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
                {section.steps && (
                  <ol>
                    {section.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                )}
              </section>
            ))}
          </article>
          <aside className="article-sidebar">
            <div className="sidebar-panel">
              <span className="sidebar-label">FIELD STATUS</span>
              <dl>
                <div>
                  <dt>Game version</dt>
                  <dd>{entry.gameVersion}</dd>
                </div>
                <div>
                  <dt>Last updated</dt>
                  <dd>{entry.updated}</dd>
                </div>
                <div>
                  <dt>Reading time</dt>
                  <dd>{entry.readingTime}</dd>
                </div>
              </dl>
            </div>
            {relatedWiki.length > 0 && (
              <div className="sidebar-panel">
                <span className="sidebar-label">RELATED WIKI</span>
                <ul className="sidebar-links">
                  {relatedWiki.map((wiki) => (
                    <li key={wiki.slug}>
                      <Link href={`/wiki/${wiki.category}/${wiki.slug}`}>
                        {wiki.name} <span aria-hidden="true">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="sidebar-panel sidebar-panel-accent">
              <span className="sidebar-label">NEED ANOTHER ANSWER?</span>
              <p>Search every current guide, build, quest, and wiki entry.</p>
              <Link className="button button-secondary" href="/search">
                Search the site
              </Link>
            </div>
            {entry.sourceUrl ? (
              <div className="sidebar-panel">
                <span className="sidebar-label">OFFICIAL NOTE</span>
                <p>Read the developer&apos;s original announcement for the complete release context.</p>
                <a
                  href={entry.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  Open official Steam note ↗
                </a>
              </div>
            ) : null}
          </aside>
        </div>
      </section>
    </main>
  );
}
