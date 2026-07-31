import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/ArticlePage";
import { getArticle, updates } from "@/lib/content";
import { createMetadata } from "@/seo/metadata";

export function generateStaticParams() {
  return updates.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = getArticle("updates", slug);
  return entry ? createMetadata(entry.seo, `/updates/${entry.slug}`) : {};
}

export default async function UpdateDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getArticle("updates", slug);
  if (!entry) notFound();
  return <ArticlePage basePath="/updates" collectionLabel="Updates" entry={entry} />;
}
