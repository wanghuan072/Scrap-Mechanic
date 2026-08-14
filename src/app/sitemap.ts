import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { allWikiEntries, articleCollections, tools, wikiCategories } from "@/lib/content/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentContentDate = "2026-07-30";
  const latestContentDate = "2026-07-31";
  const legalRouteDate = "2026-08-03";
  const legalRoutes = [
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms-of-service",
    "/copyright",
  ];
  const fixedRoutes = [
    "",
    "/guides",
    "/wiki",
    "/wiki/quests",
    "/wiki/recipes",
    "/wiki/trades",
    "/builds",
    "/mods",
    "/updates",
    "/tools",
    ...legalRoutes,
  ].map((path) => ({
    path,
    lastModified:
      legalRoutes.includes(path)
        ? legalRouteDate
        : path === "" || path === "/wiki/quests"
        ? latestContentDate
        : currentContentDate,
    priority:
      path === ""
        ? 1
        : ["/guides", "/wiki", "/builds", "/tools"].includes(path)
          ? 0.9
          : legalRoutes.includes(path)
            ? 0.3
            : 0.8,
  }));
  fixedRoutes.push({
    path: "/map",
    lastModified: "2026-08-14",
    priority: 0.7,
  });
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
    return currentContentDate;
  };
  const articleRoutes = Object.entries(articleCollections).flatMap(([collection, entries]) =>
    entries.map((entry) => ({
      path: `/${collection}/${entry.slug}`,
      lastModified: entry.updated,
      priority: collection === "guides" || collection === "builds" ? 0.7 : 0.6,
    })),
  );
  const wikiCategoryRoutes = wikiCategories.map((category) => {
    const categoryEntries = allWikiEntries.filter(
      (entry) => entry.category === category.slug,
    );
    const lastModified = categoryEntries
      .map((entry) => toIsoDate(entry.lastTested))
      .sort()
      .at(-1) ?? currentContentDate;
    return {
      path: `/wiki/${category.slug}`,
      lastModified:
        category.slug === "tools" ? latestContentDate : lastModified,
      priority: 0.8,
    };
  });
  const wikiEntryRoutes = allWikiEntries.map((entry) => ({
    path: `/wiki/${entry.category}/${entry.slug}`,
    lastModified: latestContentDate,
    priority: 0.6,
  }));
  const toolRoutes = tools
    .filter((tool) => tool.status === "available")
    .map((tool) => ({
      path: `/tools/${tool.slug}`,
      lastModified: currentContentDate,
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
