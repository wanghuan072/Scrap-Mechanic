import {
  createTerrainCoverage,
  type TerrainCoverage,
  type TerrainCoverageSummary
} from "./terrain-coverage";

const selectSave = "Select Save";
const dropSave = "Drop .db here";
const saveInputLabel = "Select a Scrap Mechanic .db save file";
const replaceSave = "Replace Save";
const privacyCopy =
  "Processed only in this browser. Never uploaded or stored.";

export interface SaveEntry {
  setPersonalized(personalized: boolean): void;
  setBusy(busy: boolean): void;
  setTerrainCoverage(summary?: TerrainCoverageSummary): void;
  destroy(): void;
}

export function createSaveEntry(
  root: HTMLElement,
  onSaveSelect?: (file: File) => void
): SaveEntry {
  const inputId = "save-file-input";
  root.innerHTML = `
    <div class="save-entry__heading">
      <span>Personal Map</span>
      <strong>Survival v28 <code>.db</code></strong>
    </div>
    <input class="visually-hidden" id="${inputId}" type="file" accept=".db"
      aria-label="${saveInputLabel}" />
    <div class="save-entry__actions">
      <button class="save-entry__button" type="button">${selectSave}</button>
      <div class="save-entry__drop-zone" data-save-drop-zone tabindex="0" role="button"
        aria-label="Drop a Scrap Mechanic .db save file or press Enter to browse">
        <span>${dropSave}</span>
      </div>
    </div>
    <p class="save-entry__privacy" data-save-privacy>${privacyCopy}</p>
    <section class="terrain-coverage" data-terrain-coverage
      aria-live="polite" aria-atomic="true"></section>
  `;

  const button = root.querySelector<HTMLButtonElement>(".save-entry__button")!;
  const input = root.querySelector<HTMLInputElement>("input")!;
  const dropZone = root.querySelector<HTMLElement>("[data-save-drop-zone]")!;
  const terrainCoverage: TerrainCoverage = createTerrainCoverage(
    root.querySelector<HTMLElement>("[data-terrain-coverage]")!
  );
  let busy = false;

  const emitIfDatabase = (file?: File) => {
    if (!busy && file?.name.toLocaleLowerCase().endsWith(".db")) {
      onSaveSelect?.(file);
    }
  };
  const handleButtonClick = () => {
    if (!busy) input.click();
  };
  const handleInputChange = () => {
    const selectedFile = input.files?.[0];
    input.value = "";
    emitIfDatabase(selectedFile);
  };
  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    if (busy) return;
    dropZone.dataset.dragActive = "true";
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "copy";
    }
  };
  const handleDragLeave = () => delete dropZone.dataset.dragActive;
  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    delete dropZone.dataset.dragActive;
    if (busy) return;
    emitIfDatabase(event.dataTransfer?.files[0]);
  };
  const handleDropZoneKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    if (!busy) input.click();
  };

  button.addEventListener("click", handleButtonClick);
  input.addEventListener("change", handleInputChange);
  dropZone.addEventListener("dragover", handleDragOver);
  dropZone.addEventListener("dragleave", handleDragLeave);
  dropZone.addEventListener("drop", handleDrop);
  dropZone.addEventListener("keydown", handleDropZoneKeyDown);

  return {
    setPersonalized(personalized) {
      button.textContent = personalized ? replaceSave : selectSave;
    },
    setBusy(nextBusy) {
      busy = nextBusy;
      button.disabled = nextBusy;
      input.disabled = nextBusy;
      dropZone.dataset.busy = String(nextBusy);
      dropZone.setAttribute("aria-disabled", String(nextBusy));
      dropZone.tabIndex = nextBusy ? -1 : 0;
    },
    setTerrainCoverage(summary) {
      terrainCoverage.setSummary(summary);
    },
    destroy() {
      button.removeEventListener("click", handleButtonClick);
      input.removeEventListener("change", handleInputChange);
      dropZone.removeEventListener("dragover", handleDragOver);
      dropZone.removeEventListener("dragleave", handleDragLeave);
      dropZone.removeEventListener("drop", handleDrop);
      dropZone.removeEventListener("keydown", handleDropZoneKeyDown);
      terrainCoverage.destroy();
      root.replaceChildren();
    }
  };
}
