import { startApp, type AppController, type MapIntegrationCallbacks } from "./app/app-controller";
import { referenceMapRepository } from "./data/reference-repository";
import { loadVendorMarkerCatalog } from "./data/vendor-marker-catalog";

const vendorManifestUrl = "/map-assets/sm-map-generator/manifest.json";

export function mountNativeMap(
  root: HTMLElement,
  integration: MapIntegrationCallbacks = {},
): Promise<AppController> {
  return startApp(root, referenceMapRepository, {
    integration,
    loadVendorMarkerCatalog: () => loadVendorMarkerCatalog(vendorManifestUrl),
  });
}

export type {
  AppController,
  MapIntegrationCallbacks,
  MapProgressSummary,
} from "./app/app-controller";
