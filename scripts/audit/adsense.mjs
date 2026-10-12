// 检查服务端 HTML 中的 AdSense 接入，避免仅在页面脚本运行后才能识别。
const origin = (process.env.AUDIT_ORIGIN ?? "http://localhost:3100").replace(/\/$/, "");
const publisherId = "ca-pub-3939531187802459";
const loaderUrl = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + publisherId;
const failures = [];
const get = (path) => fetch(new URL(path, origin), { signal: AbortSignal.timeout(15000) });
const attribute = (tag, name) =>
  tag.match(new RegExp("\\b" + name + "=[\"']([^\"']*)[\"']", "i"))?.[1];

const sitemapResponse = await get("/sitemap.xml");
if (!sitemapResponse.ok) throw new Error("无法读取 sitemap.xml");
const xml = await sitemapResponse.text();
const paths = [...new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((match) => new URL(match[1]).pathname))];
if (!paths.length) throw new Error("站点地图没有公开页面");

for (let index = 0; index < paths.length; index += 10) {
  await Promise.all(paths.slice(index, index + 10).map(async (path) => {
    try {
      const response = await get(path);
      const html = await response.text();
      const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? "";
      const allLoaders = (html.match(/<script\b[^>]*>/gi) ?? [])
        .filter((tag) => attribute(tag, "src")?.includes("/pagead/js/adsbygoogle.js"));
      const headLoaders = (head.match(/<script\b[^>]*>/gi) ?? [])
        .filter((tag) => attribute(tag, "src") === loaderUrl);
      const accountTags = (head.match(/<meta\b[^>]*>/gi) ?? [])
        .filter((tag) => attribute(tag, "name") === "google-adsense-account");
      if (!response.ok) failures.push({ path, issue: "HTTP " + response.status });
      if (allLoaders.length !== 1 || headLoaders.length !== 1) {
        failures.push({ path, issue: "必须在原始 head 中恰好包含一个正确的广告加载器" });
      }
      if (!/\sasync(?:[\s=>])/i.test(headLoaders[0] ?? "") ||
          attribute(headLoaders[0] ?? "", "crossorigin") !== "anonymous") {
        failures.push({ path, issue: "广告加载器必须为 async 且 crossorigin=anonymous" });
      }
      if (accountTags.length !== 1 || attribute(accountTags[0] ?? "", "content") !== publisherId) {
        failures.push({ path, issue: "缺少或重复的账号验证 meta" });
      }
    } catch (error) {
      failures.push({ path, issue: error.message });
    }
  }));
}

// ads.txt 经常调整，只检查访问状态，不在代码中固定授权记录。
try {
  const adsResponse = await get("/ads.txt");
  const adsText = await adsResponse.text();
  const isHtml = /text\/html/i.test(adsResponse.headers.get("content-type") ?? "") ||
    /^\s*(?:<!doctype\s+html|<html\b)/i.test(adsText);
  if (adsResponse.status !== 200 || isHtml) {
    failures.push({ path: "/ads.txt", issue: "文件无法正常访问或返回了 HTML 页面" });
  }
} catch (error) {
  failures.push({ path: "/ads.txt", issue: error.message });
}
console.log(JSON.stringify({ origin, pagesChecked: paths.length, failures: failures.length, records: failures }, null, 2));
if (failures.length) process.exitCode = 1;
