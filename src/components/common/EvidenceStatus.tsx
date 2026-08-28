import styles from "@/style/components/evidence-status.module.css";

type EvidenceStatusFact = {
  label: string;
  value: string;
};

export function EvidenceStatus({
  label,
  status,
  title,
  summary,
  facts,
  source,
  tone = "review",
}: {
  label: string;
  status: string;
  title: string;
  summary: string;
  facts: EvidenceStatusFact[];
  source?: {
    label: string;
    href: string;
  };
  tone?: "confirmed" | "review" | "alert";
}) {
  return (
    <section
      className={`${styles.section} ${styles[tone]}`}
      aria-label={label}
    >
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <span className={styles.status}>{status}</span>
          <strong>{title}</strong>
          <p>{summary}</p>
        </div>
        <dl className={styles.facts}>
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
        {source ? (
          <a
            className={styles.source}
            href={source.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {source.label} <span aria-hidden="true">↗</span>
          </a>
        ) : null}
      </div>
    </section>
  );
}
