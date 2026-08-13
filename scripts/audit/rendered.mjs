const origin = process.env.AUDIT_ORIGIN ?? "http://localhost:3100";
const productionOrigin = "https://scrapmechanic.org";

const decode = (value = "") =>
  value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");

const textContent = (value = "") =>
  decode(
    value
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );

const getTagContent = (html, tag) => {
  const match = html.match(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? textContent(match[1]) : "";
};

const getMeta = (html, key, value) => {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  const tag = tags.find((candidate) =>
    new RegExp(`${key}=["']${value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`, "i").test(
      candidate,
    ),
  );
  return decode(tag?.match(/content=["']([^"']*)["']/i)?.[1] ?? "");
};

const getLink = (html, rel) => {
  const tags = html.match(/<link\b[^>]*>/gi) ?? [];
  const tag = tags.find((candidate) =>
    new RegExp(`rel=["'][^"']*\\b${rel}\\b[^"']*["']`, "i").test(candidate),
  );
  return decode(tag?.match(/href=["']([^"']*)["']/i)?.[1] ?? "");
};

const sitemapResponse = await fetch(`${origin}/sitemap.xml`);
const sitemapXml = await sitemapResponse.text();
const productionUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (match) => match[1],
);
const lastModifiedValues = [
  ...sitemapXml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g),
].map((match) => match[1]);
const priorityValues = [
  ...sitemapXml.matchAll(/<priority>([^<]+)<\/priority>/g),
].map((match) => Number(match[1]));
const sitemapPaths = new Set(
  productionUrls.map((url) => new URL(url).pathname.replace(/\/$/, "") || "/"),
);
const allowedInternalPaths = new Set([...sitemapPaths, "/search"]);
const failures = [];
let checkedLinks = 0;

if (!sitemapResponse.ok) failures.push(`sitemap status ${sitemapResponse.status}`);
if (productionUrls.length < 200) failures.push(`sitemap has only ${productionUrls.length} URLs`);
if (lastModifiedValues.length !== productionUrls.length) {
  failures.push("sitemap lastmod count does not match URL count");
}
if (priorityValues.length !== productionUrls.length) {
  failures.push("sitemap priority count does not match URL count");
}
if (priorityValues.some((priority) => !Number.isFinite(priority) || priority < 0 || priority > 1)) {
  failures.push("sitemap contains an invalid priority value");
}
if (new Set(lastModifiedValues).size < 2) {
  failures.push("sitemap lastmod values do not preserve page-level dates");
}
if (/<changefreq>|sitemapindex|sitemap-0/gi.test(sitemapXml)) {
  failures.push("sitemap contains unwanted index or changefreq markup");
}

for (let index = 0; index < productionUrls.length; index += 12) {
  const batch = productionUrls.slice(index, index + 12);
  const results = await Promise.all(
    batch.map(async (productionUrl) => {
      const path = new URL(productionUrl).pathname;
      const response = await fetch(`${origin}${path}`);
      return { productionUrl, path, response, html: await response.text() };
    }),
  );

  for (const { productionUrl, path, response, html } of results) {
    if (response.status !== 200) failures.push(`${path}: status ${response.status}`);

    const title = getTagContent(html, "title");
    const description = getMeta(html, "name", "description");
    const canonical = getLink(html, "canonical");
    const ogImage = getMeta(html, "property", "og:image");
    const twitterImage = getMeta(html, "name", "twitter:image");
    const h1Count = (html.match(/<h1\b/gi) ?? []).length;
    const headingRanks = [...html.matchAll(/<h([1-4])\b/gi)].map((match) =>
      Number(match[1]),
    );
    const jsonLdCount = (html.match(/type=["']application\/ld\+json["']/gi) ?? []).length;

    if ([...title].length < 40 || [...title].length > 60) {
      failures.push(`${path}: title length ${[...title].length}`);
    }
    if ([...description].length < 140 || [...description].length > 160) {
      failures.push(`${path}: description length ${[...description].length}`);
    }
    if (canonical !== productionUrl) {
      failures.push(`${path}: canonical ${canonical || "missing"}`);
    }
    if (ogImage !== `${productionOrigin}/images/og-image.png`) {
      failures.push(`${path}: unexpected og:image ${ogImage || "missing"}`);
    }
    if (twitterImage !== `${productionOrigin}/images/og-image.png`) {
      failures.push(`${path}: unexpected twitter:image ${twitterImage || "missing"}`);
    }
    if (h1Count !== 1) failures.push(`${path}: ${h1Count} H1 elements`);
    if (headingRanks[0] !== 1) failures.push(`${path}: first heading is not H1`);
    for (let headingIndex = 1; headingIndex < headingRanks.length; headingIndex += 1) {
      if (headingRanks[headingIndex] - headingRanks[headingIndex - 1] > 1) {
        failures.push(
          `${path}: heading jumps H${headingRanks[headingIndex - 1]} to H${
            headingRanks[headingIndex]
          }`,
        );
      }
    }
    if (jsonLdCount === 0) failures.push(`${path}: JSON-LD missing`);

    for (const imageTag of html.match(/<img\b[^>]*>/gi) ?? []) {
      if (!/\balt=["'][^"']*["']/i.test(imageTag)) {
        failures.push(`${path}: image missing alt attribute`);
      }
    }

    const visibleText = textContent(html);
    if (/\bsummary\b|\bquick answer\b|\bprimary source\b/i.test(visibleText)) {
      failures.push(`${path}: internal editorial label is visible`);
    }

    const footer = html.match(/<footer\b[\s\S]*?<\/footer>/i)?.[0] ?? "";
    const footerAnchors = footer.match(/<a\b[^>]*>/gi) ?? [];
    for (const anchor of footerAnchors) {
      const href = decode(anchor.match(/href=["']([^"']*)["']/i)?.[1] ?? "");
      const opensNewContext = /target=["']_blank["']/i.test(anchor);
      const isExternal = /^https?:\/\//i.test(href);
      if (!opensNewContext && !isExternal) continue;

      const rel = anchor.match(/rel=["']([^"']*)["']/i)?.[1] ?? "";
      for (const token of ["noopener", "noreferrer"]) {
        if (!rel.split(/\s+/).includes(token)) {
          failures.push(`${path}: external footer link missing ${token}`);
        }
      }
    }

    for (const match of html.matchAll(/<a\b[^>]*href=["'](\/[^"'#?]*)[^"']*["'][^>]*>/gi)) {
      checkedLinks += 1;
      const target = match[1].replace(/\/$/, "") || "/";
      if (!allowedInternalPaths.has(target)) {
        failures.push(`${path}: unlisted internal route ${target}`);
      }
    }
  }
}

const searchResponse = await fetch(`${origin}/search`);
const searchHtml = await searchResponse.text();
const searchRobots = getMeta(searchHtml, "name", "robots");
if (!/noindex/i.test(searchRobots)) failures.push("/search: noindex missing");

console.log(
  JSON.stringify(
    {
      sitemapUrls: productionUrls.length,
      lastModifiedDates: [...new Set(lastModifiedValues)].sort(),
      priorityValues: [...new Set(priorityValues)].sort((a, b) => b - a),
      checkedLinks,
      failures: failures.length,
      records: [...new Set(failures)],
    },
    null,
    2,
  ),
);

if (failures.length > 0) process.exitCode = 1;
