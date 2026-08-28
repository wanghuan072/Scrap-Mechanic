"use client";

import { useEffect, useState } from "react";
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
  const [renderState, setRenderState] = useState<"loading" | "filled" | "empty">(
    "loading",
  );

  useEffect(() => {
    const googletag = getGoogletag();
    let cancelled = false;
    let slot: GptSlot | null = null;
    let pubads: GptPubAdsService | null = null;
    let onSlotRenderEnded: ((event: GptSlotRenderEndedEvent) => void) | null = null;
    const blockedAdTimeout = window.setTimeout(() => {
      if (!cancelled) setRenderState("empty");
    }, 5000);

    googletag.cmd.push(() => {
      if (cancelled || !document.getElementById(slotId)) return;

      const mapping = googletag
        .sizeMapping()
        .addSize([1024, 0], [[970, 250], [728, 90], [300, 250], "fluid"])
        .addSize([768, 0], [[728, 90], [300, 250], "fluid"])
        .addSize([0, 0], [[320, 50], [300, 250], "fluid"])
        .build();

      pubads = googletag.pubads();
      slot = googletag
        .defineSlot(GPT_UNITS[unit], GPT_BANNER_SIZES[unit], slotId)
        ?.defineSizeMapping(mapping)
        .addService(pubads) ?? null;

      if (!slot) {
        window.clearTimeout(blockedAdTimeout);
        setRenderState("empty");
        return;
      }

      const mountedSlot = slot;
      onSlotRenderEnded = (event) => {
        if (event.slot !== mountedSlot || cancelled) return;
        window.clearTimeout(blockedAdTimeout);
        setRenderState(event.isEmpty ? "empty" : "filled");
      };
      pubads.addEventListener("slotRenderEnded", onSlotRenderEnded);

      googletag.display(slotId);
      pubads.refresh([slot]);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(blockedAdTimeout);
      if (pubads && onSlotRenderEnded) {
        pubads.removeEventListener("slotRenderEnded", onSlotRenderEnded);
      }
      if (!slot) return;

      const mountedSlot = slot;
      googletag.cmd.push(() => {
        googletag.destroySlots([mountedSlot]);
      });
    };
  }, [slotId, unit]);

  return (
    <aside
      className="gpt-ad-section"
      aria-label="Advertisement"
      aria-hidden={renderState === "empty" ? true : undefined}
      data-ad-status={renderState}
    >
      <span className="gpt-ad-label">Advertisement</span>
      <div className="gpt-ad-shell">
        <div className="gpt-ad-slot" id={slotId} />
      </div>
    </aside>
  );
}
