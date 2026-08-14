export const GPT_SCRIPT_URL =
  "https://securepubads.g.doubleclick.net/tag/js/gpt.js";

const GPT_BASE = "/23355878051/scrapmechanic.org_0813_all";

export const GPT_UNITS = {
  anchor: `${GPT_BASE}/home_scrapmechanic.org_0813_anchor_1`,
  banner1: `${GPT_BASE}/home_scrapmechanic.org_0813_banner_1`,
  banner2: `${GPT_BASE}/home_scrapmechanic.org_0813_banner_2`,
  banner3: `${GPT_BASE}/home_scrapmechanic.org_0813_banner_3`,
  interstitial: `${GPT_BASE}/home_scrapmechanic.org_0813_inter_1`,
} as const;

export type GptBannerUnit = "banner1" | "banner2" | "banner3";

export const GPT_BANNER_SIZES = {
  banner1: [[320, 50], "fluid", [970, 250], [728, 90], [300, 250]],
  banner2: [[300, 250], [728, 90], "fluid", [320, 50], [970, 250]],
  banner3: [[300, 250], [728, 90], [320, 50], "fluid", [970, 250]],
} as const satisfies Record<GptBannerUnit, readonly GptSize[]>;

