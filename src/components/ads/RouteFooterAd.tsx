"use client";

import { usePathname } from "next/navigation";
import { GptAd } from "@/components/ads/GptAd";

function routeSlotId(pathname: string) {
  const routeName = pathname
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .toLowerCase();

  return `div-gpt-ad-route-footer-${routeName || "home"}`;
}

export function RouteFooterAd() {
  const pathname = usePathname();
  const slotId = routeSlotId(pathname);

  return (
    <GptAd
      key={slotId}
      slotId={slotId}
      unit={pathname === "/" ? "banner2" : "banner3"}
    />
  );
}

