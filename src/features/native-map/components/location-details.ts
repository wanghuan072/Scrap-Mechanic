import type { MapLocation } from "../domain/map-model";
import { getCategoryLabel, getPrecisionLabel } from "./location-browser";

const detailsHeading = "Location Details";
const emptyDetails = "Select a map marker to view details.";
const categoryLabel = "Category";
const precisionLabel = "Location Accuracy";
const coordinatesLabel = "Coordinates";
const questsLabel = "Quests";
const resourcesLabel = "Resources";
const enemiesLabel = "Enemies";
const savedStateLabel = "Saved State";
const evidenceSourceLabel = "Evidence Source";
const recordIdLabel = "Record ID";

export interface LocationDetails {
  render(location?: MapLocation): void;
  destroy(): void;
}
export function createLocationDetails(root: HTMLElement): LocationDetails {
  return {
    render(location) {
      root.dataset.hasSelection = String(Boolean(location));
      root.scrollTop = 0;
      if (!location) {
        const heading = document.createElement("h2");
        heading.textContent = detailsHeading;
        const empty = document.createElement("p");
        empty.className = "detail-panel__empty";
        empty.textContent = emptyDetails;
        root.replaceChildren(heading, empty);
        return;
      }

      const eyebrow = document.createElement("p");
      eyebrow.className = "detail-panel__eyebrow";
      eyebrow.textContent = detailsHeading;
      const heading = document.createElement("h2");
      heading.textContent = location.name;
      const dataList = document.createElement("dl");
      dataList.className = "detail-list";

      const category = appendDetail(
        dataList,
        categoryLabel,
        getCategoryLabel(location.category)
      );
      category.dataset.category = location.category;
      const precision = appendDetail(
        dataList,
        precisionLabel,
        getPrecisionLabel(location.precision)
      );
      precision.dataset.precision = location.precision;
      if (location.position) {
        appendDetail(
          dataList,
          coordinatesLabel,
          `${location.position.x}, ${location.position.y}${location.position.z === undefined ? "" : `, ${location.position.z}`}`
        );
      }
      appendIds(dataList, questsLabel, location.questIds);
      appendIds(dataList, resourcesLabel, location.resourceIds);
      appendIds(dataList, enemiesLabel, location.enemyIds);
      if (location.progressEvidence) {
        appendDetail(dataList, savedStateLabel, titleCase(location.progressEvidence.state));
        appendDetail(
          dataList,
          evidenceSourceLabel,
          location.progressEvidence.source === "quest-manager"
            ? "Quest Manager"
            : "Progression Manager"
        );
        appendDetail(dataList, recordIdLabel, location.progressEvidence.recordId);
      }

      root.replaceChildren(eyebrow, heading, dataList);
    },
    destroy() {
      root.replaceChildren();
      delete root.dataset.hasSelection;
    }
  };
}

function titleCase(value: string): string {
  return value.length > 0 ? `${value[0]!.toUpperCase()}${value.slice(1)}` : value;
}

function appendIds(
  list: HTMLDListElement,
  label: string,
  ids: readonly string[]
): void {
  if (ids.length > 0) {
    appendDetail(list, label, ids.join(", "));
  }
}

function appendDetail(
  list: HTMLDListElement,
  term: string,
  description: string
): HTMLElement {
  const termElement = document.createElement("dt");
  termElement.textContent = term;
  const descriptionElement = document.createElement("dd");
  descriptionElement.textContent = description;
  list.append(termElement, descriptionElement);
  return descriptionElement;
}

