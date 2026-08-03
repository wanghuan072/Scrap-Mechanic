import type { Metadata } from "next";
import type { SeoData } from "@/types/content";
import { site } from "@/config/site";

export function createMetadata(
  seo: SeoData,
  path: string,
  options?: { noIndex?: boolean },
): Metadata {
  const url = `${site.url}${path}`;
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical: path },
    authors: [{ name: site.publisherName, url: site.url }],
    creator: site.publisherName,
    publisher: site.publisherName,
    robots: options?.noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "website",
      title: seo.title,
      description: seo.description,
      url,
      siteName: site.name,
      locale: "en_US",
      images: [{ url: site.ogImage, width: 1200, height: 630, alt: seo.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [site.ogImage],
    },
  };
}
