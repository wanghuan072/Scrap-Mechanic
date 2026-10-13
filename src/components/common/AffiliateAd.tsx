"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import Script from "next/script";
import styles from "@/style/components/affiliate-ad.module.css";
import { chooseAdBoundaries } from "@/lib/advertising/placements";
import { mountBannerSlot } from "@/lib/advertising/banner-runtime";

type Placement = "top" | "bottom" | "middle" | "native";

// 弹出广告使用 Next.js 标准 Script 生命周期，只记录请求状态，不自动重试或模拟点击。
export function AffiliatePopunder() {
  return <Script
    id="affiliate-popunder"
    src="https://pl31789975.profitableratecpmnetwork.com/58/a2/92/58a292568aff8833fd01e8930036700a.js"
    strategy="lazyOnload"
    onLoad={() => { document.documentElement.dataset.affiliatePopunder = "script-loaded"; }}
    onError={() => { document.documentElement.dataset.affiliatePopunder = "script-error"; }}
  />;
}

// 根据真实排版高度选完整板块的结束点，不拆分标题、表单、地图控件或卡片行。
export function AffiliateMiddleAds() {
  const pathname = usePathname();
  return <MiddleAds key={pathname} />;
}

function MiddleAds() {
  const [targets, setTargets] = useState<HTMLElement[]>([]);
  useEffect(() => {
    let cancelled = false;
    let frame = 0;
    const hosts: HTMLElement[] = [];
    const plan = () => {
      if (cancelled) return;
      const main = document.querySelector("main");
      const top = document.querySelector('[data-affiliate-placement="top"]');
      const bottom = document.querySelector('[data-affiliate-placement="bottom"]');
      if (!main || !top || !bottom) return;
      const start = top.getBoundingClientRect().bottom;
      const length = bottom.getBoundingClientRect().top - start;
      const width = window.matchMedia("(min-width: 769px)").matches ? 728 : 300;
      const candidates = [...main.querySelectorAll("section, main > div > div, .simple-page > p")].filter((element) => {
        if (element.closest('form, aside, details, [role="dialog"], [role="tabpanel"], #interactive-map, [data-affiliate-placement]')) return false;
        if (element.querySelector("input, select, textarea") && element.parentElement?.closest("section")) return false;
        if (!element.querySelector("h2, h3") && !(element.matches(".simple-page > p") && element.nextElementSibling?.matches("h2, h3"))) return false;
        const parent = element.parentElement;
        if (!parent) return false;
        const layout = getComputedStyle(parent);
        // 多列网格只允许整行容器，不在其中某一张卡片后塞广告。
        if (layout.display === "grid" && layout.gridTemplateColumns.split(" ").length > 1) return false;
        const box = element.getBoundingClientRect();
        return box.width >= width && box.bottom > start && box.bottom < start + length;
      });
      const boundaries = candidates.map((element) => element.getBoundingClientRect().bottom - start);
      const chosen = chooseAdBoundaries(length, boundaries, window.location.pathname === "/");
      for (const boundary of chosen) {
        const anchor = candidates[boundaries.indexOf(boundary)];
        const host = document.createElement("div");
        host.dataset.affiliateBoundary = String(Math.round(boundary));
        anchor.after(host);
        hosts.push(host);
      }
      main.setAttribute("data-affiliate-content-height", String(Math.round(length)));
      main.setAttribute("data-affiliate-slot-count", String(chosen.length + 2));
      // 极短页面仍保留用户指定的首尾两个位置，不制造空白或编造正文补足 640px。
      main.setAttribute("data-affiliate-spacing-status", length < 640 ? "short-content" : "ok");
      setTargets([...hosts]);
    };
    // 等字体布局稳定后只规划一次；不随滚动、筛选或地图状态重复生成曝光。
    void document.fonts.ready.then(() => {
      if (!cancelled) frame = requestAnimationFrame(plan);
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      hosts.forEach((host) => host.remove());
    };
  }, []);
  // Native 每个文档只使用一个容器；有中间位置时放在第一个位置，不与 Banner 叠放。
  return targets.map((host, index) => createPortal(<AdSlot placement={index === 0 ? "native" : "middle"} />, host, `middle-${index}`));
}

// 每个广告位按设备加载唯一尺寸，不叠放两套代码。重复 key 仍有联盟统计风险，独立 iframe 不会消除该风险。
export function AffiliateAd({ placement }: { placement: Placement }) {
  const pathname = usePathname();
  return <AdSlot key={`${pathname}:${placement}`} placement={placement} />;
}

function AdSlot({ placement }: { placement: Placement }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    if (placement !== "native") return mountBannerSlot(element);
    element.hidden = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let loaded = false;
    const load = () => {
      if (loaded) return;
      loaded = true;
      if (placement === "native") {
        const container = document.createElement("div");
        container.id = "container-364282502b312437550490176eb230b8";
        const script = document.createElement("script");
        script.async = true;
        script.dataset.cfasync = "false";
        script.src = "https://pl31789976.profitableratecpmnetwork.com/364282502b312437550490176eb230b8/invoke.js";
        element.dataset.adStatus = "loading";
        timeout = setTimeout(() => { element.dataset.adStatus = "timeout"; }, 20000);
        script.onload = () => { clearTimeout(timeout); element.dataset.adStatus = "script-loaded"; };
        script.onerror = () => { clearTimeout(timeout); element.dataset.adStatus = "script-error"; };
        element.append(container, script);
      }
    };
    // 接近视口后只加载一次，不自动刷新，不监听缩放重新生成曝光。
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        load();
        observer.disconnect();
      }
    }, { rootMargin: "200px" });
    observer.observe(element);
    return () => {
      observer.disconnect();
      clearTimeout(timeout);
      element.querySelectorAll("script").forEach((script) => { script.onload = null; script.onerror = null; });
      element.querySelectorAll("iframe, script, div").forEach((node) => node.remove());
    };
  }, [placement]);

  // 不输出可见标题；iframe 的 title 仅供辅助技术识别。
  return <div ref={host} className={`${styles.slot} ${placement === "native" ? styles.native : styles.banner}`} data-affiliate-placement={placement} />;
}
