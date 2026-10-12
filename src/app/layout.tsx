import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import Script from "next/script";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { JsonLd } from "@/seo/JsonLd";
import { site } from "@/config/site";
import { pageTdk } from "@/seo/tdk";
import "@/style/globals.css";

// Google Analytics 4 衡量 ID，用于网站流量统计。
const GA_MEASUREMENT_ID = "G-NRMF3E7FTM";
// Google AdSense 发布商编号，与 public/ads.txt 中的编号保持一致。
const ADSENSE_PUBLISHER_ID = "ca-pub-3939531187802459";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["700", "900"],
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
  // 将账号验证标记输出到原始 HTML，抓取工具无需执行页面脚本即可识别。
  other: {
    "google-adsense-account": ADSENSE_PUBLISHER_ID,
  },
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
      <head>
        {/* Google AdSense：在原始 HTML 中异步加载，避免依赖页面激活后动态插入。 */}
        <script
          id="google-adsense"
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`}
          crossOrigin="anonymous"
        />
      </head>
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
        {/* Google Analytics 4：在浏览器空闲时加载，避免影响页面首屏内容。 */}
        <Script
          id="google-analytics-library"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
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
