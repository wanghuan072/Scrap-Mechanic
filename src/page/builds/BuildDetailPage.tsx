import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BuildGuidePage } from "@/page/builds/components/BuildGuidePage";
import { buildSpecs } from "@/lib/data/builds";
import { builds, getArticle } from "@/lib/content/catalog";
import { createMetadata } from "@/seo/metadata";

export function generateStaticParams() {
  return builds.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = getArticle("builds", slug);
  return entry ? createMetadata(entry.seo, `/builds/${entry.slug}`) : {};
}

export default async function BuildDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getArticle("builds", slug);
  const spec = buildSpecs[slug];
  if (!entry || !spec) notFound();

  return <BuildGuidePage entry={entry} spec={spec} />;
}
