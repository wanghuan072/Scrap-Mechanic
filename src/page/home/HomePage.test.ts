import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Home, { metadata } from "./HomePage";
import { guides, builds, tools, wikiCategories } from "@/lib/content/catalog";

describe("homepage industrial layout", () => {
  const html = renderToStaticMarkup(createElement(Home));

  it("preserves the single H1 and original metadata", () => {
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    const heading = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1]
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();
    expect(heading).toBe("Scrap Mechanic - Survival Field Guide");
    expect(metadata.title).toBeTruthy();
  });

  it("keeps all original sections in the intended reading order", () => {
    const headings = ["Ops brief", "Start path", "Survival map and landmarks", "Working tools", "Field manual", "Reference desk", "Blueprints", "Situation report", "Workshop", "FAQ"];
    const positions = headings.map((title) => html.indexOf(`>${title}</h2>`));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it("uses the real catalog for every tool, category and featured build", () => {
    for (const tool of tools.filter((item) => item.status === "available")) {
      expect(html).toContain(`href="/tools/${tool.slug}"`);
    }
    for (const category of wikiCategories) {
      expect(html).toContain(`href="/wiki/${category.slug}"`);
    }
    for (const build of builds.filter((item) => item.featured).slice(0, 6)) {
      expect(html).toContain(`href="/builds/${build.slug}"`);
    }
    expect(html).toContain(`All ${guides.length} guides`);
  });

  it("keeps map navigation, version information and accessible FAQ controls", () => {
    expect(html).toContain('href="/map#interactive-map"');
    expect(html).toContain("reference-overview-61a4ead9b0ea2721.webp");
    expect(html.match(/<details\b/g)).toHaveLength(17);
    expect(html).toContain("Official patch note");
    expect(html).not.toContain("<iframe");
  });
});
