export interface TerrainCoverageSummary {
  totalCells: number;
  vendorImageCells: number;
  missingImageCells: number;
  distinctMissingUuids: number;
}

export interface TerrainCoverage {
  setSummary(summary?: TerrainCoverageSummary): void;
  destroy(): void;
}

const savePrompt =
  "Select a Scrap Mechanic 1.0 Survival save to build the map from its actual terrain layout.";
const number = new Intl.NumberFormat("en-US");

function summaryMarkup(summary: TerrainCoverageSummary): string {
  return `
    <p class="terrain-coverage__heading">
      Terrain Coverage · ${number.format(summary.totalCells)} cells
    </p>
    <ul class="terrain-coverage__items">
      <li><span>sm_map_generator artwork </span><strong>${number.format(summary.vendorImageCells)} cells</strong></li>
      <li><span>Missing images </span><strong>${number.format(summary.missingImageCells)} cells</strong></li>
    </ul>
    <p class="terrain-coverage__note">
      ${summary.missingImageCells === 0
        ? "Every terrain cell has verified vendor artwork; the layout comes from the current save."
        : `Missing images affect ${number.format(summary.distinctMissingUuids)} terrain types; the layout comes from the current save.`}
    </p>
  `;
}

export function createTerrainCoverage(root: HTMLElement): TerrainCoverage {
  const setSummary = (summary?: TerrainCoverageSummary) => {
    root.dataset.personal = String(Boolean(summary));
    root.innerHTML = summary
      ? summaryMarkup(summary)
      : `<p class="terrain-coverage__prompt">${savePrompt}</p>`;
  };

  setSummary();

  return {
    setSummary,
    destroy() {
      root.replaceChildren();
    }
  };
}
