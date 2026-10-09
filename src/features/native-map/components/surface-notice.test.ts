import { afterEach, expect, it, vi } from "vitest";
import { createSurfaceNotice } from "./surface-notice";

class ElementStub extends EventTarget {
  hidden = false;
  disabled = false;
  textContent = "";
  className = "";
  type = "";
  children: ElementStub[] = [];
  setAttribute = vi.fn();
  remove = vi.fn();
  append(...children: ElementStub[]) { this.children.push(...children); }
}

afterEach(() => vi.unstubAllGlobals());

it("shows a recoverable error, prevents repeat retries, hides on success and cleans up", () => {
  vi.stubGlobal("document", { createElement: () => new ElementStub() });
  const root = new ElementStub();
  const retry = vi.fn();
  const controller = createSurfaceNotice(root as unknown as HTMLElement, retry);
  const notice = root.children[0];
  const [message, button] = notice.children;
  expect(notice.hidden).toBe(true);
  root.dispatchEvent(new Event("surface-error"));
  expect(notice.hidden).toBe(false);
  expect(message.textContent).toContain("current map is still available");
  button.dispatchEvent(new Event("click"));
  button.dispatchEvent(new Event("click"));
  expect(retry).toHaveBeenCalledOnce();
  expect(button.disabled).toBe(true);
  expect(message.textContent).toContain("Retrying");
  root.dispatchEvent(new Event("surface-error"));
  expect(button.disabled).toBe(false);
  button.dispatchEvent(new Event("click"));
  expect(retry).toHaveBeenCalledTimes(2);
  root.dispatchEvent(new Event("surface-ready"));
  expect(notice.hidden).toBe(true);
  controller.destroy();
  expect(notice.remove).toHaveBeenCalledOnce();
  root.dispatchEvent(new Event("surface-error"));
  expect(notice.hidden).toBe(true);
});
