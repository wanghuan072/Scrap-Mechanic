import { describe, expect, it } from "vitest";
import {
  SUPPORTED_GAME_VERSION,
  assertSupportedGameVersion,
} from "./game-version";

describe("game version", () => {
  it("identifies the installed Steam 1.0 build", () => {
    expect(SUPPORTED_GAME_VERSION).toBe("1.0.1.869");
  });

  it("rejects mixed generated bundles", () => {
    expect(() => assertSupportedGameVersion("1.0.0")).toThrow(/1\.0\.1\.869/);
  });
});
