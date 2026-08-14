"use client";

import { useEffect } from "react";
import {
  GPT_BANNER_SIZES,
  GPT_UNITS,
  type GptBannerUnit,
} from "@/config/gpt";

function getGoogletag() {
  if (!window.googletag) {
    window.googletag = { cmd: [] } as unknown as GooglePublisherTag;
  }

  return window.googletag;
}

export function GptAd({
  slotId,
  unit,
}: {
  slotId: string;
  unit: GptBannerUnit;
}) {
  useEffect(() => {
    const googletag = getGoogletag();
    let cancelled = false;
    let slot: GptSlot | null = null;

    googletag.cmd.push(() => {
      if (cancelled || !document.getElementById(slotId)) return;

      const mapping = googletag
        .sizeMapping()
        .addSize([1024, 0], [[970, 250], [728, 90], [300, 250], "fluid"])
        .addSize([768, 0], [[728, 90], [300, 250], "fluid"])
        .addSize([0, 0], [[320, 50], [300, 250], "fluid"])
        .build();

      slot = googletag
        .defineSlot(GPT_UNITS[unit], GPT_BANNER_SIZES[unit], slotId)
        ?.defineSizeMapping(mapping)
        .addService(googletag.pubads()) ?? null;

      if (!slot) return;

      googletag.display(slotId);
      googletag.pubads().refresh([slot]);
    });

    return () => {
      cancelled = true;
      if (!slot) return;

      const mountedSlot = slot;
      googletag.cmd.push(() => {
        googletag.destroySlots([mountedSlot]);
      });
    };
  }, [slotId, unit]);

  return (
    <aside className="gpt-ad-section" aria-label="Advertisement">
      <span className="gpt-ad-label">Advertisement</span>
      <div className="gpt-ad-shell">
        <div className="gpt-ad-slot" id={slotId} />
      </div>
    </aside>
  );
}

