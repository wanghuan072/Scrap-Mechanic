import type { ReactNode } from "react";

export function SimplePage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <main>
      <section
        className="page-hero"
        style={{
          "--hero-image": "url(/images/scrap-mechanic/screenshot-09.jpg)",
        } as React.CSSProperties}
      >
        <div className="container page-hero-content">
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{intro}</p>
        </div>
      </section>
      <article className="container simple-page">{children}</article>
    </main>
  );
}
