import type { Metadata } from "next";
import Image from "next/image";
import { PageJsonLd } from "@/components/JsonLd";
import { createMetadata } from "@/seo/metadata";
import { pageTdk } from "@/seo/tdk";
import styles from "./map.module.css";

export const metadata: Metadata = createMetadata(pageTdk.map, "/map");

export default function MapPage() {
  return (
    <main className={styles.mapPage}>
      <PageJsonLd seo={pageTdk.map} path="/map" />
      <Image
        className={styles.backdrop}
        src="/images/scrap-mechanic/screenshot-01.jpg"
        alt="Mechanics exploring an industrial area in Scrap Mechanic"
        fill
        priority
        sizes="100vw"
      />
      <div className={styles.shade} />

      <section className={`container ${styles.content}`}>
        <span className={styles.eyebrow}>World navigation / map preview</span>
        <h1>
          Scrap Mechanic Map <span>- Interactive Map</span>
        </h1>
        <p className={styles.intro}>
          A dedicated navigation space for the Scrap Mechanic world.
        </p>

        <div className={styles.status} role="status">
          <span className={styles.statusLight} aria-hidden="true" />
          <div>
            <span className={styles.statusLabel}>Map status</span>
            <p>
              <strong>Currently in development.</strong> The interactive map will be
              available here in a future update.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
