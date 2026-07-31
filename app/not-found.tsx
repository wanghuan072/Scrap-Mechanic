import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container simple-page">
      <span className="eyebrow">Field signal lost / 404</span>
      <h1>That Scrap Mechanic page is not in the current index</h1>
      <p>
        The route may have changed, or the item has not been added to its category yet.
        Search the field guide or return to the Wiki category layer.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        <Link className="button" href="/search">Search the site</Link>
        <Link className="button button-secondary" href="/wiki">Browse Wiki</Link>
      </div>
    </main>
  );
}
