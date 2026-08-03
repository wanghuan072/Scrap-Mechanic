import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WikiEntryPage } from "@/page/wiki/components/WikiEntryPage";
import { allWikiEntries, getWikiEntry } from "@/lib/content/catalog";
import { createMetadata } from "@/seo/metadata";

export function generateStaticParams() {
  return allWikiEntries.map((entry) => ({
    category: entry.category,
    slug: entry.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const entry = getWikiEntry(category, slug);
  return entry
    ? createMetadata(entry.seo, `/wiki/${category}/${slug}`)
    : {};
}

export default async function WikiDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const entry = getWikiEntry(category, slug);
  if (!entry) notFound();
  return <WikiEntryPage entry={entry} />;
}
