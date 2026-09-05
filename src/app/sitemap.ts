import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import {
  allWikiEntries,
  articleCollections,
  tools,
  wikiCategories,
} from "@/lib/content/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const legacyContentDate = "2026-07-30";
  const legacyWikiEntryDate = "2026-07-31";
  const fixedRoutes = [
    { path: "", lastModified: "2026-09-05", priority: 1 },
    { path: "/guides", lastModified: "2026-09-05", priority: 0.9 },
    { path: "/wiki", lastModified: "2026-07-30", priority: 0.9 },
    { path: "/wiki/quests", lastModified: "2026-07-31", priority: 0.8 },
    { path: "/wiki/recipes", lastModified: "2026-07-30", priority: 0.8 },
    { path: "/wiki/trades", lastModified: "2026-07-30", priority: 0.8 },
    { path: "/builds", lastModified: "2026-07-30", priority: 0.9 },
    { path: "/mods", lastModified: "2026-07-30", priority: 0.8 },
    { path: "/updates", lastModified: "2026-07-30", priority: 0.8 },
    { path: "/tools", lastModified: "2026-09-05", priority: 0.9 },
    { path: "/about", lastModified: "2026-08-03", priority: 0.3 },
    { path: "/contact", lastModified: "2026-08-03", priority: 0.3 },
    { path: "/privacy-policy", lastModified: "2026-09-02", priority: 0.3 },
    { path: "/terms-of-service", lastModified: "2026-08-03", priority: 0.3 },
    { path: "/copyright", lastModified: "2026-08-03", priority: 0.3 },
    { path: "/map", lastModified: "2026-08-14", priority: 0.7 },
  ];
  const toIsoDate = (value: string) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const monthYear = value.match(/^([A-Za-z]+)\s+(\d{4})$/);
    if (monthYear) {
      const monthIndex = [
        "january",
        "february",
        "march",
        "april",
        "may",
        "june",
        "july",
        "august",
        "september",
        "october",
        "november",
        "december",
      ].indexOf(monthYear[1].toLowerCase());
      if (monthIndex >= 0) {
        return `${monthYear[2]}-${String(monthIndex + 1).padStart(2, "0")}-01`;
      }
    }
    return legacyContentDate;
  };
  const articleRoutes = Object.entries(articleCollections).flatMap(
    ([collection, entries]) =>
      entries.map((entry) => ({
        path: `/${collection}/${entry.slug}`,
        lastModified: entry.updated,
        priority:
          collection === "guides" || collection === "builds" ? 0.7 : 0.6,
      })),
  );
  const wikiCategoryRoutes = wikiCategories.map((category) => {
    const categoryEntries = allWikiEntries.filter(
      (entry) => entry.category === category.slug,
    );
    const lastModified =
      categoryEntries
        .map((entry) => toIsoDate(entry.lastTested))
        .sort()
        .at(-1) ?? legacyContentDate;
    return {
      path: `/wiki/${category.slug}`,
      lastModified:
        category.slug === "tools" ? legacyWikiEntryDate : lastModified,
      priority: 0.8,
    };
  });
  const wikiEntryRoutes = allWikiEntries.map((entry) => ({
    path: `/wiki/${entry.category}/${entry.slug}`,
    lastModified: entry.updated ?? legacyWikiEntryDate,
    priority: 0.6,
  }));
  const toolRoutes = tools
    .filter((tool) => tool.status === "available")
    .map((tool) => ({
      path: `/tools/${tool.slug}`,
      lastModified: tool.updated,
      priority: 0.8,
    }));

  return [
    ...fixedRoutes,
    ...articleRoutes,
    ...wikiCategoryRoutes,
    ...wikiEntryRoutes,
    ...toolRoutes,
  ].map(({ path, lastModified, priority }) => ({
    url: `${site.url}${path}`,
    lastModified,
    priority,
  }));
}
