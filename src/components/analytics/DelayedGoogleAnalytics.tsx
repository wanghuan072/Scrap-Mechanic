"use client";

import { useEffect } from "react";

type DelayedGoogleAnalyticsProps = {
  measurementId: string;
  delay?: number;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function DelayedGoogleAnalytics({
  measurementId,
  delay = 3000,
}: DelayedGoogleAnalyticsProps) {
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (document.getElementById("google-analytics-script")) return;

      window.dataLayer = window.dataLayer ?? [];
      window.gtag = (...args: unknown[]) => {
        window.dataLayer?.push(args);
      };
      window.gtag("js", new Date());
      window.gtag("config", measurementId);

      const script = document.createElement("script");
      script.id = "google-analytics-script";
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
      document.head.appendChild(script);
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [delay, measurementId]);

  return null;
}
