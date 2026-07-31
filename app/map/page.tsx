import type { Metadata } from "next";
import { PageJsonLd } from "@/components/JsonLd";
import { createMetadata } from "@/seo/metadata";
import { pageTdk } from "@/seo/tdk";

export const metadata: Metadata = createMetadata(pageTdk.map, "/map");

export default function MapPage() {
  return (
    <main className="container simple-page">
      <PageJsonLd seo={pageTdk.map} path="/map" />
      <h1>Scrap Mechanic Map is under development. Please check back soon.</h1>
    </main>
  );
}
