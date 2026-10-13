import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Breadcrumbs } from "./Breadcrumbs";
import { siteNavigation } from "@/config/site";

vi.mock("next/navigation", () => ({ usePathname: () => "/wiki" }));

function sources(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? sources(path) : /\.(tsx?|jsx?)$/.test(path) && !path.includes(".test.") ? [readFileSync(path, "utf8")] : [];
  });
}

describe("native document navigation", () => {
  it("uses native links in desktop and mobile navigation with the original destinations", () => {
    const html = renderToStaticMarkup(createElement(SiteHeader));
    for (const item of siteNavigation) {
      const matches = html.match(new RegExp(`href="${item.href}"`, "g")) ?? [];
      expect(matches.length).toBeGreaterThanOrEqual(2);
    }
    expect(html).toContain('aria-label="Primary navigation"');
    expect(html).toContain('aria-label="Mobile navigation"');
    expect(html).toContain('action="/search"');
  });
  it("preserves Footer and breadcrumb hrefs", () => {
    const footer = renderToStaticMarkup(createElement(SiteFooter));
    for (const route of ["/privacy-policy", "/terms-of-service", "/copyright", "/about", "/contact"]) expect(footer).toContain(`href="${route}"`);
    const breadcrumb = renderToStaticMarkup(createElement(Breadcrumbs, { items: [{ label: "Home", href: "/" }, { label: "Wiki", href: "/wiki" }, { label: "Item" }] }));
    expect(breadcrumb).toContain('href="/wiki"');
    expect(breadcrumb).toContain("<span>Item</span>");
  });
  it("does not reintroduce client-side page routing or a global link interceptor", () => {
    const code = sources("src").join("\n");
    expect(code).not.toMatch(/from\s+["']next\/link["']/);
    expect(code).not.toMatch(/\brouter\.(push|replace)\s*\(/);
    expect(code).not.toContain("AffiliateNavigation");
  });
  it("keeps map URL updates local and does not add ad reloads to history restoration", () => {
    const map = readFileSync("src/features/native-map/app/app-controller.ts", "utf8");
    expect(map).toContain("window.history.replaceState");
    const ad = readFileSync("src/components/common/AffiliateAd.tsx", "utf8");
    expect(ad).not.toMatch(/addEventListener\(["'](?:pageshow|popstate)["']/);
  });
});
