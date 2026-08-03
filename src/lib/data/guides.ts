import guidesJson from "@/data/guides/guides.json";
import type { ArticleEntry } from "@/types/content";

const guideOrder = [
  "beginner-first-hours",
  "returning-to-1-0",
  "farming-basics",
  "warehouse-key-and-farmbot",
  "first-vehicle",
  "controller-and-logic",
  "scrap-city-garage-blueprints",
  "achievements",
];

const guideCollection = guidesJson as ArticleEntry[];

export const guides = guideOrder.map((slug) => {
  const guide = guideCollection.find((entry) => entry.slug === slug);
  if (!guide) throw new Error(`Missing curated guide: ${slug}`);
  return guide;
});
