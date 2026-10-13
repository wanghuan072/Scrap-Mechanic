import { afterEach, describe, expect, it, vi } from "vitest";
import { mountBannerSlot } from "./banner-runtime";

function fixture(intersection = false) {
  vi.useFakeTimers();
  const changes = new Set<() => void>();
  const messages = new Set<(event: MessageEvent) => void>();
  const media = { matches: true, addEventListener: (_: string, callback: () => void) => changes.add(callback), removeEventListener: (_: string, callback: () => void) => changes.delete(callback) };
  const frames: Record<string, unknown>[] = [];
  let available = 1400;
  let visible: ((entries: { isIntersecting: boolean }[]) => void) | undefined;
  const host = { dataset: {} as Record<string, string>, hidden: false, parentElement: { getBoundingClientRect: () => ({ width: available }) }, append: (frame: Record<string, unknown>) => frames.push(frame) };
  vi.stubGlobal("window", { innerWidth: 1440, location: { origin: "https://scrapmechanic.org" }, matchMedia: () => media, addEventListener: (_: string, callback: (event: MessageEvent) => void) => messages.add(callback), removeEventListener: (_: string, callback: (event: MessageEvent) => void) => messages.delete(callback) });
  vi.stubGlobal("document", { createElement: () => ({ dataset: {}, style: {}, contentWindow: {}, setAttribute: vi.fn(), remove: vi.fn() }) });
  vi.stubGlobal("ResizeObserver", undefined);
  vi.stubGlobal("IntersectionObserver", intersection ? class { constructor(callback: typeof visible) { visible = callback; } observe() {} disconnect() {} } : undefined);
  const dispose = mountBannerSlot(host as unknown as HTMLElement);
  return { host, frames, dispose, messages, changes, enter: () => visible?.([{ isIntersecting: true }]), resize: (wide: boolean, width = 1400) => { media.matches = wide; available = width; changes.forEach((callback) => callback()); } };
}

afterEach(() => { vi.clearAllTimers(); vi.useRealTimers(); vi.unstubAllGlobals(); });

describe("banner lifecycle without external requests", () => {
  it("uses 728×90 on desktop and caches each format instead of refreshing", () => {
    const test = fixture();
    expect(test.frames).toHaveLength(1);
    expect(test.frames[0].width).toBe("728");
    expect(test.frames[0].height).toBe("90");
    test.resize(false, 375);
    expect(test.frames).toHaveLength(2);
    expect(test.frames[1].width).toBe("300");
    expect(test.frames[1].height).toBe("250");
    test.resize(true);
    test.resize(false, 375);
    expect(test.frames).toHaveLength(2);
    expect((test.frames[0].style as Record<string, string>).display).toBe("none");
    test.dispose();
  });
  it("does not load anything before visibility and chooses the current viewport at load time", () => {
    const test = fixture(true);
    expect(test.frames).toHaveLength(0);
    test.resize(false, 375);
    test.enter();
    expect(test.frames).toHaveLength(1);
    expect(test.frames[0].width).toBe("300");
    test.enter();
    expect(test.frames).toHaveLength(1);
    test.dispose();
  });
  it("does not put a desktop banner into a narrow content column", () => {
    const test = fixture(true);
    test.resize(true, 640);
    test.enter();
    expect(test.host.hidden).toBe(true);
    expect(test.frames).toHaveLength(0);
    test.dispose();
  });
  it("accepts only same-origin status messages from its own iframe", () => {
    const test = fixture();
    const message = { origin: "https://scrapmechanic.org", source: test.frames[0].contentWindow, data: { type: "affiliate-script", status: "loaded" } };
    test.messages.forEach((callback) => callback({ ...message, origin: "https://other.example" } as MessageEvent));
    expect(test.host.dataset.adStatus).toBe("loading");
    test.messages.forEach((callback) => callback(message as MessageEvent));
    expect(test.host.dataset.adStatus).toBe("script-loaded");
    vi.advanceTimersByTime(21000);
    expect(test.host.dataset.adStatus).toBe("script-loaded");
    test.dispose();
  });
  it("reports failure and timeout without retries or ad refreshes", () => {
    const test = fixture();
    vi.advanceTimersByTime(21000);
    expect(test.host.dataset.adStatus).toBe("timeout");
    expect(test.frames).toHaveLength(1);
    test.dispose();
  });
  it("releases timers, listeners and iframe nodes", () => {
    const test = fixture();
    test.dispose();
    expect(test.changes.size).toBe(0);
    expect(test.messages.size).toBe(0);
    expect(vi.getTimerCount()).toBe(0);
    expect(test.frames[0].remove).toHaveBeenCalledOnce();
  });
});
