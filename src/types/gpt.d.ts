type GptFixedSize = readonly [number, number];
type GptSize = GptFixedSize | "fluid";

interface GptSlot {
  addService(service: GptPubAdsService): GptSlot;
  defineSizeMapping(mapping: readonly unknown[]): GptSlot;
}

interface GptPubAdsService {
  refresh(slots: GptSlot[]): void;
}

interface GptSizeMappingBuilder {
  addSize(
    viewport: GptFixedSize,
    sizes: GptSize | readonly GptSize[],
  ): GptSizeMappingBuilder;
  build(): readonly unknown[];
}

interface GooglePublisherTag {
  cmd: {
    push(callback: () => void): number;
  };
  defineSlot(
    adUnitPath: string,
    sizes: readonly GptSize[],
    elementId: string,
  ): GptSlot | null;
  defineOutOfPageSlot(
    adUnitPath: string,
    format: string,
  ): GptSlot | null;
  destroySlots(slots?: GptSlot[]): boolean;
  display(elementIdOrSlot: string | GptSlot): void;
  enableServices(): void;
  enums: {
    OutOfPageFormat: {
      BOTTOM_ANCHOR: string;
      INTERSTITIAL: string;
      LEFT_SIDE_RAIL: string;
      RIGHT_SIDE_RAIL: string;
    };
  };
  pubads(): GptPubAdsService;
  setConfig(config: {
    centering?: boolean;
    disableInitialLoad?: boolean;
    singleRequest?: boolean;
  }): void;
  sizeMapping(): GptSizeMappingBuilder;
}

interface Window {
  googletag?: GooglePublisherTag;
  __scrapMechanicGptInitialized?: boolean;
}
