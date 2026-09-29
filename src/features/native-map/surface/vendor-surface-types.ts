export type VendorSurfaceImageRole =
  | "single-cell"
  | "multi-cell"
  | "excavation-composite";

export interface VendorSurfaceImage {
  readonly uuid?: string;
  readonly role: VendorSurfaceImageRole;
  readonly url: string;
  readonly contentHash: string;
  readonly bytes: number;
  readonly width: number;
  readonly height: number;
  readonly cellsWide: number;
  readonly cellsHigh: number;
}

export interface VendorSurfaceBundle {
  readonly imagesByUuid: ReadonlyMap<string, VendorSurfaceImage>;
  readonly excavationComposite: VendorSurfaceImage;
  readonly manifestHash: string;
}

export interface VendorSurfaceRepository {
  load(): Promise<VendorSurfaceBundle>;
}
