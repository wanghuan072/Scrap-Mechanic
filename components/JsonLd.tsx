import type { SeoData } from "@/data/types";
import { site } from "@/data/site";

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
}: {
  seo: SeoData;
  path: string;
  type?: "WebPage" | "CollectionPage" | "AboutPage" | "ContactPage";
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": type,
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
