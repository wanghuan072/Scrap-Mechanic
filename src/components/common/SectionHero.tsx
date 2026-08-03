import Image from "next/image";

type HeroMetric = {
  label: string;
  value: string;
};

export function SectionHero({
  eyebrow,
  title,
  accent,
  intro,
  image,
  imageAlt,
  metrics,
  tone,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  intro: string;
  image: string;
  imageAlt: string;
  metrics: HeroMetric[];
  tone: "orange" | "cyan" | "green";
}) {
  return (
    <section className={`section-hero section-hero-${tone}`}>
      <Image
        className="section-hero-image"
        src={image}
        alt={imageAlt}
        fill
        sizes="100vw"
        quality={60}
        loading="eager"
        fetchPriority="high"
      />
      <div className="section-hero-shade" />
      <div className="container section-hero-inner">
        <div className="section-hero-copy">
          <span className="section-hero-eyebrow">{eyebrow}</span>
          <h1>
            {title} <span>- {accent}</span>
          </h1>
          <p>{intro}</p>
        </div>
        <dl className="section-hero-metrics">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <dt>{metric.label}</dt>
              <dd>{metric.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
