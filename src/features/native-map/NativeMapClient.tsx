"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import "leaflet/dist/leaflet.css";
import "./styles/native-map.css";
import type {
  AppController,
  MapIntegrationCallbacks,
} from "./runtime";

export interface NativeMapHandle {
  focusLocation(locationId: string): Promise<boolean>;
}

interface NativeMapClientProps extends MapIntegrationCallbacks {
  className?: string;
}

type LoadState = "waiting" | "loading" | "ready" | "error";

export const NativeMapClient = forwardRef<NativeMapHandle, NativeMapClientProps>(
  function NativeMapClient(
    {
      className,
      onLocationChange,
      onModeChange,
      onProgressChange,
    },
    forwardedRef,
  ) {
    const boundaryRef = useRef<HTMLDivElement>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    const controllerRef = useRef<AppController | undefined>(undefined);
    const [loadState, setLoadState] = useState<LoadState>("waiting");
    const [attempt, setAttempt] = useState(0);
    const [visible, setVisible] = useState(false);

    useImperativeHandle(
      forwardedRef,
      () => ({
        focusLocation(locationId) {
          return controllerRef.current?.focusLocation(locationId) ?? Promise.resolve(false);
        },
      }),
      [],
    );

    useEffect(() => {
      const boundary = boundaryRef.current;
      if (!boundary || visible) return;
      if (!("IntersectionObserver" in window)) {
        setVisible(true);
        return;
      }
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          setVisible(true);
          observer.disconnect();
        },
        { rootMargin: "200px 0px" },
      );
      observer.observe(boundary);
      return () => observer.disconnect();
    }, [visible]);

    useEffect(() => {
      const root = rootRef.current;
      if (!root || !visible) return;
      let cancelled = false;
      let controller: AppController | undefined;
      setLoadState("loading");
      root.replaceChildren();

      void import("./runtime")
        .then(({ mountNativeMap }) =>
          mountNativeMap(root, {
            onLocationChange,
            onModeChange,
            onProgressChange,
          }),
        )
        .then((mountedController) => {
          if (cancelled) {
            mountedController.destroy();
            return;
          }
          controller = mountedController;
          controllerRef.current = mountedController;
          setLoadState("ready");
        })
        .catch(() => {
          if (!cancelled) setLoadState("error");
        });

      return () => {
        cancelled = true;
        if (controllerRef.current === controller) controllerRef.current = undefined;
        controller?.destroy();
        root.replaceChildren();
      };
    }, [attempt, onLocationChange, onModeChange, onProgressChange, visible]);

    return (
      <div className={["native-map-boundary", className].filter(Boolean).join(" ")} ref={boundaryRef}>
        <div className="native-map-root" ref={rootRef} />
        {loadState !== "ready" ? (
          <div className="native-map-load-state" role={loadState === "error" ? "alert" : "status"}>
            {loadState === "error" ? (
              <>
                <strong>The interactive map could not be opened.</strong>
                <span>The field guide remains available below. Try loading the map again.</span>
                <button type="button" onClick={() => setAttempt((value) => value + 1)}>
                  Retry map
                </button>
              </>
            ) : (
              <>
                <div className="native-map-loader" aria-hidden="true">
                  <span className="native-map-loader__orbit" />
                  <span className="native-map-loader__core" />
                </div>
                <span className="native-map-load-state__eyebrow">
                  WORLD VIEWER / INITIALIZING
                </span>
                <strong>Preparing the interactive surface map</strong>
                <span>Loading verified terrain, locations, and browser tools…</span>
                <span className="native-map-load-state__track" aria-hidden="true">
                  <span />
                </span>
              </>
            )}
          </div>
        ) : null}
      </div>
    );
  },
);
