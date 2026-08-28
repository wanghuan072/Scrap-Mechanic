const baselineOrigin = (
  process.env.SEO_BASELINE_ORIGIN ?? "https://scrapmechanic.org"
).replace(/\/$/, "");
const candidateOrigin = (
  process.env.SEO_CANDIDATE_ORIGIN ?? "http://127.0.0.1:3000"
).replace(/\/$/, "");

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

const attribute = (tag, name) =>
  decode(
    tag.match(new RegExp(`${name}=["']([^"']*)["']`, "i"))?.[1] ?? "",
  );

function extractContract(html) {
  const title = textContent(
    html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "",
  );
  const metaTags = html.match(/<meta\b[^>]*>/gi) ?? [];
  const linkTags = html.match(/<link\b[^>]*>/gi) ?? [];
  const meta = (name) =>
    attribute(
      metaTags.find(
        (tag) => attribute(tag, "name").toLowerCase() === name.toLowerCase(),
      ) ?? "",
      "content",
    );
  const canonical = attribute(
    linkTags.find((tag) =>
      attribute(tag, "rel")
        .toLowerCase()
        .split(/\s+/)
        .includes("canonical"),
    ) ?? "",
    "href",
  );
  const headings = [...html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map(
    (match) => `H${match[1]} ${textContent(match[2])}`,
  );

  return {
    title,
    description: meta("description"),
    keywords: meta("keywords"),
    canonical,
    headings,
  };
}

function keepsHeadingSequence(baseline, candidate) {
  let candidateIndex = 0;
  for (const heading of baseline) {
    while (
      candidateIndex < candidate.length &&
      candidate[candidateIndex] !== heading
    ) {
      candidateIndex += 1;
    }
    if (candidateIndex === candidate.length) return false;
    candidateIndex += 1;
  }
  return true;
}

async function sitemapPaths(origin) {
  const response = await fetch(`${origin}/sitemap.xml`);
  if (!response.ok) {
    throw new Error(`${origin}/sitemap.xml returned ${response.status}`);
  }
  const xml = await response.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => new URL(decode(match[1])).pathname,
  );
}

const [baselinePaths, candidatePaths] = await Promise.all([
  sitemapPaths(baselineOrigin),
  sitemapPaths(candidateOrigin),
]);
const candidatePathSet = new Set(candidatePaths);
const failures = [];
let checked = 0;

for (const path of baselinePaths) {
  if (!candidatePathSet.has(path)) {
    failures.push(`${path}: existing sitemap URL is missing`);
  }
}

for (let index = 0; index < baselinePaths.length; index += 10) {
  const batch = baselinePaths.slice(index, index + 10);
  const comparisons = await Promise.all(
    batch.map(async (path) => {
      const [baselineResponse, candidateResponse] = await Promise.all([
        fetch(`${baselineOrigin}${path}`),
        fetch(`${candidateOrigin}${path}`),
      ]);
      return {
        path,
        baselineResponse,
        candidateResponse,
        baselineHtml: await baselineResponse.text(),
        candidateHtml: await candidateResponse.text(),
      };
    }),
  );

  for (const comparison of comparisons) {
    checked += 1;
    const {
      path,
      baselineResponse,
      candidateResponse,
      baselineHtml,
      candidateHtml,
    } = comparison;

    if (baselineResponse.status !== 200) {
      failures.push(`${path}: baseline status ${baselineResponse.status}`);
      continue;
    }
    if (candidateResponse.status !== 200) {
      failures.push(`${path}: candidate status ${candidateResponse.status}`);
      continue;
    }

    const baseline = extractContract(baselineHtml);
    const candidate = extractContract(candidateHtml);
    for (const field of ["title", "description", "keywords", "canonical"]) {
      if (baseline[field] !== candidate[field]) {
        failures.push(`${path}: ${field} changed`);
      }
    }
    if (!keepsHeadingSequence(baseline.headings, candidate.headings)) {
      failures.push(`${path}: an existing H1-H6 heading changed, moved, or disappeared`);
    }
  }
}

console.log(
  JSON.stringify(
    {
      baselineOrigin,
      candidateOrigin,
      existingRoutesChecked: checked,
      newRoutesAllowed: candidatePaths.length - baselinePaths.length,
      failures: failures.length,
      records: failures,
    },
    null,
    2,
  ),
);

if (failures.length > 0) process.exitCode = 1;
