import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import { DelayedGoogleAnalytics } from "@/components/analytics/DelayedGoogleAnalytics";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { JsonLd } from "@/seo/JsonLd";
import { site } from "@/config/site";
import { pageTdk } from "@/seo/tdk";
import "@/style/globals.css";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: pageTdk.home.title,
    template: "%s",
  },
  description: pageTdk.home.description,
  keywords: pageTdk.home.keywords,
  applicationName: site.shortName,
  icons: {
    icon: [{ url: "/images/ico.ico", type: "image/x-icon" }],
    shortcut: "/images/ico.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${barlow.variable} ${barlowCondensed.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: site.name,
            url: site.url,
            description: site.description,
            inLanguage: "en-US",
            publisher: {
              "@type": "Organization",
              name: site.publisherName,
              url: site.url,
            },
            potentialAction: {
              "@type": "SearchAction",
              target: `${site.url}/search?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          }}
        />
        <SiteHeader />
        {children}
        <SiteFooter />
        <DelayedGoogleAnalytics measurementId="G-NRMF3E7FTM" delay={3000} />
      </body>
    </html>
  );
}
