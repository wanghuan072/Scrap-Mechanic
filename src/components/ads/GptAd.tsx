"use client";

import { useEffect, useRef, useState } from "react";
import {
  GPT_BANNER_SIZES,
  GPT_SCRIPT_URL,
  GPT_UNITS,
  type GptBannerUnit,
} from "@/config/gpt";

let gptRuntimePromise: Promise<void> | null = null;

function getGoogletag() {
  if (!window.googletag) {
    window.googletag = { cmd: [] } as unknown as GooglePublisherTag;
  }

  return window.googletag;
}

function configureOutOfPageSlots(googletag: GooglePublisherTag) {
  googletag.cmd.push(() => {
    if (window.__scrapMechanicGptInitialized) return;
    window.__scrapMechanicGptInitialized = true;

    const outOfPageSlots = [
      googletag.defineOutOfPageSlot(
        GPT_UNITS.anchor,
        googletag.enums.OutOfPageFormat.BOTTOM_ANCHOR,
      ),
      googletag.defineOutOfPageSlot(
        GPT_UNITS.anchor,
        googletag.enums.OutOfPageFormat.LEFT_SIDE_RAIL,
      ),
      googletag.defineOutOfPageSlot(
        GPT_UNITS.anchor,
        googletag.enums.OutOfPageFormat.RIGHT_SIDE_RAIL,
      ),
      googletag.defineOutOfPageSlot(
        GPT_UNITS.interstitial,
        googletag.enums.OutOfPageFormat.INTERSTITIAL,
      ),
    ].filter((slot): slot is GptSlot => Boolean(slot));

    outOfPageSlots.forEach((slot) => slot.addService(googletag.pubads()));
    googletag.setConfig({
      centering: true,
      disableInitialLoad: true,
      singleRequest: true,
    });
    googletag.enableServices();
    outOfPageSlots.forEach((slot) => googletag.display(slot));
    if (outOfPageSlots.length) googletag.pubads().refresh(outOfPageSlots);
  });
}

function loadGptRuntime() {
  if (gptRuntimePromise) return gptRuntimePromise;

  const googletag = getGoogletag();
  configureOutOfPageSlots(googletag);
  gptRuntimePromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = GPT_SCRIPT_URL;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Google Publisher Tag failed to load."));
    document.head.append(script);
  });

  return gptRuntimePromise;
}

export function GptAd({
  slotId,
  unit,
}: {
  slotId: string;
  unit: GptBannerUnit;
}) {
  const [renderState, setRenderState] = useState<"idle" | "loading" | "filled" | "empty">("idle");
  const [isNearViewport, setIsNearViewport] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsNearViewport(true);
        observer.disconnect();
      },
      { rootMargin: "0px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isNearViewport) return;

    let cancelled = false;
    let slot: GptSlot | null = null;
    let pubads: GptPubAdsService | null = null;
    let onSlotRenderEnded: ((event: GptSlotRenderEndedEvent) => void) | null = null;
    setRenderState("loading");
    const blockedAdTimeout = window.setTimeout(() => {
      if (!cancelled) setRenderState("empty");
    }, 5000);

    loadGptRuntime().then(() => {
      if (cancelled) return;
      const googletag = getGoogletag();
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
    }).catch(() => {
      window.clearTimeout(blockedAdTimeout);
      if (!cancelled) setRenderState("empty");
    });

    return () => {
      cancelled = true;
      window.clearTimeout(blockedAdTimeout);
      if (pubads && onSlotRenderEnded) {
        pubads.removeEventListener("slotRenderEnded", onSlotRenderEnded);
      }
      if (!slot) return;

      const mountedSlot = slot;
      const googletag = getGoogletag();
      googletag.cmd.push(() => {
        googletag.destroySlots([mountedSlot]);
      });
    };
  }, [slotId, unit]);

  return (
    <aside
      ref={sectionRef}
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
