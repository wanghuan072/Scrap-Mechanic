// 保留官方 atOptions + 同步 invoke.js；每个尺寸在一个广告位中最多加载一次。
// 尺寸切换只显示对应的缓存 iframe，不定时刷新，不自动重试失败请求。
export function mountBannerSlot(host: HTMLElement): () => void {
  const media = window.matchMedia("(min-width: 769px)");
  const frames = new Map<number, HTMLIFrameElement>();
  const timers = new Map<number, ReturnType<typeof setTimeout>>();
  let entered = false;

  const sync = () => {
    if (!entered) return;
    const width = media.matches ? 728 : 300;
    const available = host.parentElement?.getBoundingClientRect().width ?? window.innerWidth;
    host.hidden = available < width;
    if (host.hidden) return;
    for (const [size, frame] of frames) frame.style.display = size === width ? "block" : "none";
    let frame = frames.get(width);
    if (!frame) {
      frame = document.createElement("iframe");
      frame.title = `Advertisement ${width} by ${width === 728 ? 90 : 250}`;
      frame.width = String(width);
      frame.height = String(width === 728 ? 90 : 250);
      frame.src = `/affiliate-ads/banner-${width}.html`;
      frame.setAttribute("scrolling", "no");
      frame.dataset.adStatus = "loading";
      const current = frame;
      frame.onerror = () => {
        clearTimeout(timers.get(width));
        current.dataset.adStatus = "frame-error";
        sync();
      };
      frames.set(width, frame);
      timers.set(width, setTimeout(() => {
        current.dataset.adStatus = "timeout";
        sync();
      }, 20000));
      host.append(frame);
    }
    host.dataset.adStatus = frame.dataset.adStatus;
  };

  const receive = (event: MessageEvent) => {
    if (event.origin !== window.location.origin || event.data?.type !== "affiliate-script") return;
    if (!["loaded", "error"].includes(event.data.status)) return;
    for (const [width, frame] of frames) {
      if (event.source !== frame.contentWindow) continue;
      clearTimeout(timers.get(width));
      // script-loaded 仅说明脚本请求成功，不等同于素材填充、曝光或收益。
      frame.dataset.adStatus = event.data.status === "loaded" ? "script-loaded" : "script-error";
      sync();
      break;
    }
  };
  window.addEventListener("message", receive);
  media.addEventListener("change", sync);
  const observer = typeof IntersectionObserver !== "undefined" ? new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      entered = true;
      sync();
      observer?.disconnect();
    }
  }, { rootMargin: "200px" }) : null;
  if (observer) observer.observe(host);
  else { entered = true; sync(); }
  const resize = typeof ResizeObserver !== "undefined" ? new ResizeObserver(sync) : null;
  if (host.parentElement) resize?.observe(host.parentElement);

  return () => {
    observer?.disconnect();
    resize?.disconnect();
    media.removeEventListener("change", sync);
    window.removeEventListener("message", receive);
    timers.forEach((timer) => clearTimeout(timer));
    frames.forEach((frame) => { frame.onerror = null; frame.remove(); });
  };
}
