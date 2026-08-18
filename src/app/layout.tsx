import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import Script from "next/script";
import { RouteFooterAd } from "@/components/ads/RouteFooterAd";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { GPT_SCRIPT_URL, GPT_UNITS } from "@/config/gpt";
import { JsonLd } from "@/seo/JsonLd";
import { site } from "@/config/site";
import { pageTdk } from "@/seo/tdk";
import "@/style/globals.css";

const GA_MEASUREMENT_ID = "G-NRMF3E7FTM";

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
        <RouteFooterAd />
        <SiteFooter />
        <Script
          id="google-publisher-tag"
          src={GPT_SCRIPT_URL}
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
        <Script id="google-publisher-tag-config" strategy="beforeInteractive">
          {`
            window.googletag = window.googletag || { cmd: [] };
            window.googletag.cmd.push(function () {
              if (window.__scrapMechanicGptInitialized) return;
              window.__scrapMechanicGptInitialized = true;

              var bottomAnchorSlot = googletag.defineOutOfPageSlot(
                '${GPT_UNITS.anchor}',
                googletag.enums.OutOfPageFormat.BOTTOM_ANCHOR
              );
              var leftSideRailSlot = googletag.defineOutOfPageSlot(
                '${GPT_UNITS.anchor}',
                googletag.enums.OutOfPageFormat.LEFT_SIDE_RAIL
              );
              var rightSideRailSlot = googletag.defineOutOfPageSlot(
                '${GPT_UNITS.anchor}',
                googletag.enums.OutOfPageFormat.RIGHT_SIDE_RAIL
              );
              var interstitialSlot = googletag.defineOutOfPageSlot(
                '${GPT_UNITS.interstitial}',
                googletag.enums.OutOfPageFormat.INTERSTITIAL
              );

              if (bottomAnchorSlot) bottomAnchorSlot.addService(googletag.pubads());
              if (leftSideRailSlot) leftSideRailSlot.addService(googletag.pubads());
              if (rightSideRailSlot) rightSideRailSlot.addService(googletag.pubads());
              if (interstitialSlot) interstitialSlot.addService(googletag.pubads());

              googletag.setConfig({
                centering: true,
                disableInitialLoad: true,
                singleRequest: true
              });
              googletag.enableServices();

              var outOfPageSlots = [];
              if (bottomAnchorSlot) {
                googletag.display(bottomAnchorSlot);
                outOfPageSlots.push(bottomAnchorSlot);
              }
              if (leftSideRailSlot) {
                googletag.display(leftSideRailSlot);
                outOfPageSlots.push(leftSideRailSlot);
              }
              if (rightSideRailSlot) {
                googletag.display(rightSideRailSlot);
                outOfPageSlots.push(rightSideRailSlot);
              }
              if (interstitialSlot) {
                googletag.display(interstitialSlot);
                outOfPageSlots.push(interstitialSlot);
              }
              if (outOfPageSlots.length) {
                googletag.pubads().refresh(outOfPageSlots);
              }
            });
          `}
        </Script>
        <Script
          id="google-analytics-library"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>


        <Script id="clear-lsv" strategy="afterInteractive">
          {`window.localStorage.removeItem('**lsv**');`}
        </Script>
        <Script src="/collect-data.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
