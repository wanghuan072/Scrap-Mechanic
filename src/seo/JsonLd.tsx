import type { SeoData } from "@/types/content";
import { site } from "@/config/site";

type JsonLdProps = {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export function PageJsonLd({
  seo,
  path,
  type = "WebPage",
  additionalProperties,
}: {
  seo: SeoData;
  path: string;
  type?: "WebPage" | "CollectionPage" | "AboutPage" | "ContactPage";
  additionalProperties?: Record<string, unknown>;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": type,
        ...additionalProperties,
        name: seo.title,
        description: seo.description,
        url: `${site.url}${path}`,
        inLanguage: "en-US",
        isPartOf: {
          "@type": "WebSite",
          name: site.name,
          url: site.url,
        },
        publisher: {
          "@type": "Organization",
          name: site.publisherName,
          url: site.url,
        },
      }}
    />
  );
}
