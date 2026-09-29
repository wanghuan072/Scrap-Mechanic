export const SUPPORTED_GAME_VERSION = "1.0.1.869" as const;

export function assertSupportedGameVersion(
  value: string,
): asserts value is typeof SUPPORTED_GAME_VERSION {
  if (value !== SUPPORTED_GAME_VERSION) {
    throw new Error(
      `Expected Scrap Mechanic ${SUPPORTED_GAME_VERSION}, received ${value}`,
    );
  }
}
