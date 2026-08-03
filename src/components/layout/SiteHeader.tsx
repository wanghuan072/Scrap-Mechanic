"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteNavigation } from "@/config/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-rivet header-rivet-left" aria-hidden="true" />
      <div className="header-rivet header-rivet-right" aria-hidden="true" />
      <div className="container header-content">
        <Link
          className="site-logo"
          href="/"
          aria-label="Scrap Mechanic home"
          onClick={() => setMenuOpen(false)}
        >
          <Image
            className="site-logo-image"
            src="/images/logo.svg"
            alt=""
            width={817}
            height={790}
            sizes="54px"
            unoptimized
          />
          <span className="site-logo-copy">
            <strong>SCRAP MECHANIC</strong>
            <small>FIELD GUIDE</small>
          </span>
        </Link>

        <nav className="desktop-navigation" aria-label="Primary navigation">
          {siteNavigation.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : item.href === "/wiki"
                  ? pathname.startsWith("/wiki")
                  : pathname.startsWith(item.href);
            return (
              <Link className={active ? "active" : ""} href={item.href} key={item.href}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <form className="header-search" action="/search" role="search">
          <label className="sr-only" htmlFor="header-search-input">
            Search Scrap Mechanic guides and wiki entries
          </label>
          <input
            id="header-search-input"
            name="q"
            type="search"
            placeholder="Search builds, bots, parts..."
          />
          <button type="submit" aria-label="Search">
            <span aria-hidden="true">⌕</span>
          </button>
        </form>

        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span className="menu-toggle-lines" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="menu-toggle-label">{menuOpen ? "Close" : "Menu"}</span>
        </button>
      </div>

      <div
        className={`mobile-navigation-panel ${menuOpen ? "open" : ""}`}
        id="mobile-navigation"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div className="container mobile-navigation-content">
          <form className="mobile-search" action="/search" role="search">
            <label className="sr-only" htmlFor="mobile-search-input">
              Search Scrap Mechanic guides and wiki entries
            </label>
            <input
              id="mobile-search-input"
              name="q"
              type="search"
              placeholder="Search the field guide..."
            />
            <button type="submit">Search</button>
          </form>
          <nav aria-label="Mobile navigation">
            {siteNavigation.map((item, index) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : item.href === "/wiki"
                    ? pathname.startsWith("/wiki")
                    : pathname.startsWith(item.href);
              return (
                <Link
                  className={active ? "active" : ""}
                  href={item.href}
                  key={item.href}
                  onClick={() => setMenuOpen(false)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
