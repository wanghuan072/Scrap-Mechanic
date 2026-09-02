export type SeoData = {
  title: string;
  description: string;
  keywords: string[];
};

export type ContentSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  steps?: string[];
  links?: Array<{
    label: string;
    href: string;
    description?: string;
  }>;
};

export type DataTable = {
  caption: string;
  headers: string[];
  rows: string[][];
  note?: string;
};

export type WikiCategory = {
  slug: string;
  name: string;
  description: string;
  focus: string;
  symbol: string;
  image: string;
  imageAlt: string;
  fieldGuide: ContentSection[];
};

export type WikiEntry = {
  slug: string;
  category: string;
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  gameVersion: string;
  lastTested: string;
  updated?: string;
  featured?: boolean;
  facts: Array<{ label: string; value: string }>;
  recipes?: Array<{
    station: string;
    duration: string;
    ingredients: string;
    output: string;
  }>;
  properties?: Array<{ label: string; value: string }>;
  tables?: DataTable[];
  sections: ContentSection[];
  relatedSlugs: string[];
  seo: SeoData;
};

export type ArticleEntry = {
  slug: string;
  title: string;
  description: string;
  category: string;
  image: string;
  imageAlt: string;
  gameVersion: string;
  published: string;
  updated: string;
  readingTime: string;
  featured?: boolean;
  sourceUrl?: string;
  quickAnswer: string;
  media?: Array<{
    src: string;
    alt: string;
    caption: string;
    width?: number;
    height?: number;
  }>;
  tables?: DataTable[];
  sections: ContentSection[];
  relatedWiki?: string[];
  relatedGuides?: string[];
  relatedRoutes?: Array<{
    label: string;
    href: string;
  }>;
  seo: SeoData;
};

export type QuestEntry = {
  slug: string;
  title: string;
  kind: "main" | "builder" | "farmer";
  phase: string;
  summary: string;
  objectiveCount: number;
  rewardCount: number;
  rewards?: Array<{
    type: "Schematic" | "Customization" | "Item" | "Log entry";
    name: string;
    wikiHref?: string;
  }>;
  rewardNote?: string;
  objectiveHighlights?: string[];
};

export type WorkshopMod = {
  slug: string;
  workshopId: string;
  title: string;
  summary: string;
  bestFor: string;
  whyRecommended: string;
  installMethod: string;
  compatibility: "recent-1-0-candidate" | "legacy-check";
  workshopStatus?: "available" | "removed-incompatible" | "legacy-incompatible";
  statusCheckedAt?: string;
  statusNote?: string;
  subscriptions: number;
  lifetimeSubscriptions: number;
  views: number;
  favorites: number;
  lifetimeFavorites: number;
  updated: string;
  image: string;
  imageAlt: string;
  features: string[];
  caution: string;
  workshopUrl: string;
};

export type WorkshopLeaderboardEntry = {
  rank: number;
  workshopId: string;
  title: string;
  purpose: string;
  subscriptions: number;
  lifetimeSubscriptions: number;
  updated: string;
  status: "core-pick" | "ranking-context";
  note: string;
  workshopUrl: string;
};

export type ToolEntry = {
  slug: string;
  name: string;
  description: string;
  status: "available" | "in-development";
  symbol: string;
  image: string;
  imageAlt: string;
  updated: string;
  seo: SeoData;
};

export type LocationEntry = {
  slug: string;
  name: string;
  aliases?: string[];
  group: "starting-route" | "story" | "exploration" | "region-hazard";
  kind: "landmark" | "location-group" | "region" | "dynamic-hazard";
  type: string;
  danger: "Low" | "Moderate" | "High" | "Variable";
  description: string;
  navigation: string;
  preparation: string[];
  relatedHref?: string;
  relatedLabel?: string;
  keywords: string[];
};
