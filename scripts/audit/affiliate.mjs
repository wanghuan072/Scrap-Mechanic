// 联盟广告静态配置审计：不触发真实曝光，不固定 ads.txt 中经常变动的内容。
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");
const layout = read("src/app/layout.tsx");
assert(!/adsbygoogle|google-adsense-account|googletagservices|ADSENSE_PUBLISHER_ID/.test(layout));
assert(layout.includes("<AffiliatePopunder />"));
assert(layout.includes("G-NRMF3E7FTM"));
assert(layout.includes('src="/collect-data.js"'));
for (const [width, key] of [[300, "e013e0c686012c68b30a1c0e7a8ec429"], [728, "13e6c880082449c7ed15ec25a351d4f1"]]) {
  const html = read(`public/affiliate-ads/banner-${width}.html`);
  assert(html.includes(`'key':'${key}'`));
  assert(html.includes(`https://www.highrevenueformat.com/${key}/invoke.js`));
  assert(html.includes('content="noindex"'));
}
const ad = read("src/components/common/AffiliateAd.tsx");
const runtime = read("src/lib/advertising/banner-runtime.ts");
assert(ad.includes("58a292568aff8833fd01e8930036700a.js"));
assert(ad.includes("container-364282502b312437550490176eb230b8"));
assert(runtime.includes('window.matchMedia("(min-width: 769px)")'));
assert(!ad.includes("<small>"));
assert(!layout.includes('<AffiliateAd placement="top" />'));
assert(layout.indexOf('<AffiliateAd placement="bottom" />') > layout.indexOf("{children}"));
assert(layout.indexOf('<AffiliateAd placement="bottom" />') < layout.indexOf("<SiteFooter />"));
assert(runtime.includes("observer?.disconnect()"));
console.log("联盟广告配置检查通过：Google 广告已移除，GA 与公司脚本保留。");
