"use client";

import { usePathname } from "next/navigation";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";

function routeSlotId(pathname: string) {
  const routeName = pathname
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .toLowerCase();

  return `div-ad-placeholder-route-footer-${routeName || "home"}`;
}

export function RouteFooterAd() {
  const pathname = usePathname();
  const slotId = routeSlotId(pathname);

  return (
    <AdPlaceholder
      key={slotId}
      slotId={slotId}
      unit={pathname === "/" ? "banner2" : "banner3"}
    />
  );
}

