import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/ArticlePage";
import { getArticle, guides } from "@/lib/content";
import { createMetadata } from "@/seo/metadata";

export function generateStaticParams() {
  return guides.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getArticle("guides", slug);
  return entry
    ? createMetadata(entry.seo, `/guides/${entry.slug}`)
    : {};
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getArticle("guides", slug);
  if (!entry) notFound();
  return (
    <ArticlePage
      basePath="/guides"
      collectionLabel="Guides"
      entry={entry}
    />
  );
}
