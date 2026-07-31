import Image from "next/image";
import Link from "next/link";
import { site, siteNavigation } from "@/data/site";

const footerGroups = [
  {
    title: "Navigate",
    links: siteNavigation.map(({ href, label }) => [href, label] as const),
  },
  {
    title: "Legal",
    links: [
      ["/legal/privacy-policy", "Privacy Policy"],
      ["/legal/terms-of-service", "Terms of Service"],
      ["/legal/copyright", "Copyright"],
      ["/legal/about-us", "About Us"],
      ["/legal/contact-us", "Contact Us"],
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-stripe" aria-hidden="true" />
      <div className="container footer-content">
        <div className="footer-brand">
          <Link
            className="site-logo"
            href="/"
            rel="noopener noreferrer nofollow"
            aria-label="Scrap Mechanic home"
          >
            <Image
              className="site-logo-image"
              src="/images/logo.svg"
              alt=""
              width={817}
              height={790}
              sizes="80px"
              unoptimized
            />
            <span className="site-logo-copy">
              <strong>SCRAP MECHANIC</strong>
              <small>FIELD GUIDE</small>
            </span>
          </Link>
          <p>
            Practical 1.0 help for mechanics who want a working answer before the
            next raid, build test, or story run.
          </p>
          <span className="version-chip">Checked for {site.currentVersion}</span>
        </div>
        {footerGroups.map((group) => (
          <div className="footer-group" key={group.title}>
            <h2>{group.title}</h2>
            <ul>
              {group.links.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} rel="noopener noreferrer nofollow">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container footer-bottom">
        <p>
          Copyright © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
