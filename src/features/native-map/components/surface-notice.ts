/** 高清失败提示只影响当前地图，不刷新页面或丢失本地存档。 */
export function createSurfaceNotice(root: HTMLElement, onRetry: () => void): { destroy(): void } {
  const notice = document.createElement("div");
  notice.className = "surface-notice";
  notice.hidden = true;
  notice.setAttribute("aria-live", "polite");
  notice.setAttribute("aria-atomic", "true");
  const message = document.createElement("span");
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Retry map details";
  notice.append(message, button);
  root.append(notice);

  const handleError = () => {
    message.textContent = "Map details could not be loaded. The current map is still available. Check your connection and retry.";
    button.disabled = false;
    notice.hidden = false;
  };
  const handleReady = () => {
    notice.hidden = true;
    button.disabled = false;
  };
  const handleRetry = (event: Event) => {
    event.stopPropagation();
    if (button.disabled) return;
    button.disabled = true;
    message.textContent = "Retrying map details… You can continue using the map.";
    onRetry();
  };
  const stopMapClick = (event: Event) => event.stopPropagation();
  root.addEventListener("surface-error", handleError);
  root.addEventListener("surface-ready", handleReady);
  button.addEventListener("click", handleRetry);
  notice.addEventListener("click", stopMapClick);

  return { destroy() {
    root.removeEventListener("surface-error", handleError);
    root.removeEventListener("surface-ready", handleReady);
    button.removeEventListener("click", handleRetry);
    notice.removeEventListener("click", stopMapClick);
    notice.remove();
  } };
}
