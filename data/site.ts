export const site = {
  name: "Scrap Mechanic",
  shortName: "SM Field Guide",
  publisherName: "Scrap Mechanic Field Guide",
  description:
    "Practical Scrap Mechanic guides, current 1.0 wiki entries, quests, builds, mods, updates, and player tools.",
  url: "https://scrapmechanic.org",
  email: "wyong@scrapmechanic.org",
  ogImage: "/images/og-image.png",
  currentVersion: "1.0.3",
  lastChecked: "July 29, 2026",
  steamUrl: "https://store.steampowered.com/app/387990/Scrap_Mechanic/",
  officialUrl: "https://www.scrapmechanic.com/",
};

export const siteNavigation = [
  { href: "/", label: "Home" },
  { href: "/guides", label: "Guides" },
  { href: "/wiki", label: "Wiki" },
  { href: "/builds", label: "Builds" },
  { href: "/map", label: "Map" },
  { href: "/mods", label: "Mods" },
  { href: "/updates", label: "Updates" },
  { href: "/tools", label: "Tools" },
] as const;
