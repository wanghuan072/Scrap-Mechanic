import type { MapLocation, MapUiState } from "../domain/map-model";
import {
  PLAYER_MARKER_TYPES,
  type PlayerMarkerType
} from "../player-markers/player-marker";

const searchLabel = "Search Locations";
const filterHeading = "Category Filters";
const markerFilterHeading = "Player Marker Types";
const categoryNames: Record<string, string> = {
  boss: "Boss",
  guide: "Guide",
  poi: "Point of Interest",
  quest: "Quest",
  resource: "Resource"
};
const precisionNames: Record<MapLocation["precision"], string> = {
  exact: "Exact Location",
  "save-exact": "Exact Save Location",
  "area-reference": "Reference Area",
  unknown: "Unknown Location"
};
const playerMarkerTypeNames: Record<PlayerMarkerType, string> = {
  resource: "Resource",
  danger: "Danger",
  base: "Base",
  vehicle: "Vehicle",
  note: "Note"
};

export function getCategoryLabel(categoryId: string): string {
  return categoryNames[categoryId] ?? "Other";
}

export function getPrecisionLabel(precision: MapLocation["precision"]): string {
  return precisionNames[precision];
}

export interface LocationBrowserCallbacks {
  onQueryChange?(query: string): void;
  onCategoryChange?(categoryIds: string[]): void;
  onPlayerMarkerTypeChange?(typeIds: PlayerMarkerType[]): void;
}

export interface LocationBrowserRenderInput {
  locations: readonly MapLocation[];
  availableCategoryIds?: readonly string[];
  state?: MapUiState;
}

export interface LocationBrowser {
  render(input: LocationBrowserRenderInput): void;
  destroy(): void;
}

export function createLocationBrowser(
  root: HTMLElement,
  callbacks: LocationBrowserCallbacks
): LocationBrowser {
  const searchId = "location-search";
  const filterId = "location-category-filters";
  const markerFilterId = "player-marker-type-filters";
  root.innerHTML = `
    <div class="location-browser__search">
      <label for="${searchId}">${searchLabel}</label>
      <input id="${searchId}" type="search" inputmode="search" autocomplete="off"
        placeholder="${searchLabel}" />
    </div>
    <section class="location-browser__map-layers" data-map-layer-tree></section>
    <fieldset id="${filterId}" class="category-filters">
      <legend>${filterHeading}</legend>
      <div data-category-list></div>
    </fieldset>
    <fieldset id="${markerFilterId}" class="category-filters player-marker-type-filters">
      <legend>${markerFilterHeading}</legend>
      <div data-player-marker-type-list></div>
    </fieldset>
  `;

  const search = root.querySelector<HTMLInputElement>(`#${searchId}`)!;
  const categoryFieldset = root.querySelector<HTMLFieldSetElement>(`#${filterId}`)!;
  const categoryList = root.querySelector<HTMLElement>("[data-category-list]")!;
  const playerMarkerTypeList = root.querySelector<HTMLElement>(
    "[data-player-marker-type-list]"
  )!;

  const handleInput = () => callbacks.onQueryChange?.(search.value);
  const handleChange = (event: Event) => {
    if (!(event.target instanceof HTMLInputElement) || event.target.type !== "checkbox") {
      return;
    }
    const selected = Array.from(
      categoryList.querySelectorAll<HTMLInputElement>('input[type="checkbox"]:checked')
    ).map((input) => input.value);
    callbacks.onCategoryChange?.(selected);
  };
  const handlePlayerMarkerTypeChange = (event: Event) => {
    if (!(event.target instanceof HTMLInputElement) || event.target.type !== "checkbox") {
      return;
    }
    const selected = Array.from(
      playerMarkerTypeList.querySelectorAll<HTMLInputElement>(
        'input[type="checkbox"]:checked'
      )
    ).map((input) => input.value).sort() as PlayerMarkerType[];
    callbacks.onPlayerMarkerTypeChange?.(selected);
  };

  search.addEventListener("input", handleInput);
  categoryList.addEventListener("change", handleChange);
  playerMarkerTypeList.addEventListener("change", handlePlayerMarkerTypeChange);

  const render = ({
    locations,
    availableCategoryIds = locations.map((location) => location.category),
    state
  }: LocationBrowserRenderInput): void => {
    const activeElement = root.ownerDocument.activeElement;
    const focusedCategoryId =
      activeElement instanceof HTMLInputElement && categoryList.contains(activeElement)
        ? activeElement.value
        : undefined;
    const focusedPlayerMarkerTypeId =
      activeElement instanceof HTMLInputElement
      && playerMarkerTypeList.contains(activeElement)
        ? activeElement.value
        : undefined;

    if (state && search.value !== state.query) {
      search.value = state.query;
    }

    const categoryCatalog = new Set(availableCategoryIds);
    for (const categoryId of state?.categoryIds ?? []) {
      categoryCatalog.add(categoryId);
    }
    categoryFieldset.hidden = categoryCatalog.size === 0;
    const selectedCategories = new Set(state?.categoryIds ?? []);
    const categoryFragment = document.createDocumentFragment();
    for (const category of [...categoryCatalog].sort()) {
      const label = document.createElement("label");
      label.className = "category-filter";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = category;
      checkbox.checked = selectedCategories.has(category);
      const marker = document.createElement("span");
      marker.className = "category-filter__marker";
      marker.dataset.category = category;
      marker.setAttribute("aria-hidden", "true");
      const text = document.createElement("span");
      text.textContent = getCategoryLabel(category);
      label.append(checkbox, marker, text);
      categoryFragment.append(label);
    }
    categoryList.replaceChildren(categoryFragment);

    const selectedPlayerMarkerTypes = new Set(
      state?.playerMarkerTypeIds ?? PLAYER_MARKER_TYPES
    );
    const playerMarkerTypeFragment = document.createDocumentFragment();
    for (const typeId of PLAYER_MARKER_TYPES) {
      const label = document.createElement("label");
      label.className = "category-filter player-marker-type-filter";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = typeId;
      checkbox.checked = selectedPlayerMarkerTypes.has(typeId);
      const marker = document.createElement("span");
      marker.className = "category-filter__marker";
      marker.dataset.markerType = typeId;
      marker.setAttribute("aria-hidden", "true");
      const text = document.createElement("span");
      text.textContent = playerMarkerTypeNames[typeId];
      label.append(checkbox, marker, text);
      playerMarkerTypeFragment.append(label);
    }
    playerMarkerTypeList.replaceChildren(playerMarkerTypeFragment);

    if (focusedCategoryId) {
      Array.from(
        categoryList.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')
      ).find((input) => input.value === focusedCategoryId)
        ?.focus({ preventScroll: true });
    } else if (focusedPlayerMarkerTypeId) {
      Array.from(
        playerMarkerTypeList.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')
      ).find((input) => input.value === focusedPlayerMarkerTypeId)
        ?.focus({ preventScroll: true });
    }
  };

  return {
    render,
    destroy() {
      search.removeEventListener("input", handleInput);
      categoryList.removeEventListener("change", handleChange);
      playerMarkerTypeList.removeEventListener("change", handlePlayerMarkerTypeChange);
      root.replaceChildren();
    }
  };
}
