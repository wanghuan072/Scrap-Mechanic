import type { SaveProgress } from "../save/save-protocol";

export interface ProgressSummaryRenderInput {
  readonly progress: SaveProgress;
  readonly locationIdsByProgressId: ReadonlyMap<string, readonly string[]>;
  readonly onSelectProgress: (progressId: string, locationId?: string) => void;
}

export interface ProgressSummary {
  render(input?: ProgressSummaryRenderInput): void;
  destroy(): void;
}

function fact(label: string, value: string | number): HTMLLIElement {
  const item = document.createElement("li");
  const name = document.createElement("span");
  name.textContent = `${label} `;
  const output = document.createElement("strong");
  output.textContent = String(value);
  item.append(name, output);
  return item;
}

function titleCase(value: string): string {
  return value.length > 0 ? `${value[0]!.toUpperCase()}${value.slice(1)}` : value;
}

function progressItem(
  progressId: string,
  label: string,
  input: ProgressSummaryRenderInput,
  forceAction = false
): HTMLLIElement {
  const item = document.createElement("li");
  item.className = "progress-summary__record";
  const locationId = input.locationIdsByProgressId.get(progressId)?.[0];
  const actionable = forceAction || locationId !== undefined;
  const content = actionable ? document.createElement("button") : document.createElement("span");
  content.textContent = label;
  content.dataset.progressId = progressId;
  content.className = "progress-summary__record-content";
  if (content instanceof HTMLButtonElement) {
    content.type = "button";
    content.addEventListener("click", () => input.onSelectProgress(progressId, locationId));
  }
  item.append(content);
  return item;
}

export function createProgressSummary(root: HTMLElement): ProgressSummary {
  return {
    render(input) {
      root.replaceChildren();
      root.hidden = !input;
      root.dataset.hasProgress = String(Boolean(input));
      if (!input) return;

      const { progress } = input;
      const heading = document.createElement("h2");
      heading.textContent = "Save Progress";
      const facts = document.createElement("ul");
      facts.className = "progress-summary__facts";
      const count = (state: SaveProgress["quests"][number]["state"]) =>
        progress.quests.filter((quest) => quest.state === state).length;
      facts.append(
        fact("Active Quests", count("active")),
        fact("Tracked Quests", count("tracked")),
        fact("Completed Quests", count("completed")),
        fact("Completed Grow Labs", progress.completedGrowLabs.length),
        fact("Seed Tier", progress.seedTier),
        fact("Vault Total", progress.vaultTotal),
        fact("Warehouse Console", progress.warehouseConsoleUnlocked ? "Unlocked" : "Locked"),
        fact("Crafted Beacon", progress.hasCraftedBeacon ? "Yes" : "No"),
        fact("Collected Logs", progress.collectedLogIds.length),
        fact(
          "Reached Depths",
          progress.reachedUndergroundDepths.length > 0
            ? progress.reachedUndergroundDepths.join(", ")
            : "None"
        )
      );

      const recordsHeading = document.createElement("h3");
      recordsHeading.textContent = "Saved Records";
      const records = document.createElement("ul");
      records.className = "progress-summary__records";
      for (const quest of progress.quests) {
        records.append(progressItem(
          quest.id,
          `${quest.id} · ${titleCase(quest.state)}`,
          input
        ));
      }
      for (const growLab of progress.completedGrowLabs) {
        records.append(progressItem(growLab, `Grow Lab ${growLab} · Completed`, input));
      }
      if (progress.scannerbot) {
        const scanner = progress.scannerbot;
        const finite = Number.isFinite(scanner.x) && Number.isFinite(scanner.y);
        records.append(progressItem(
          "scannerbot",
          `Scannerbot ${titleCase(scanner.mode)} · X ${scanner.x} · Y ${scanner.y}`,
          input,
          finite
        ));
      }

      const children: HTMLElement[] = [heading, facts];
      if (records.childElementCount > 0) children.push(recordsHeading, records);
      if (progress.warnings.length > 0) {
        const warnings = document.createElement("ul");
        warnings.className = "progress-summary__warnings";
        warnings.setAttribute("aria-label", "Save progress warnings");
        for (const warning of progress.warnings) {
          const item = document.createElement("li");
          item.textContent = warning;
          warnings.append(item);
        }
        children.push(warnings);
      }
      root.append(...children);
    },
    destroy() {
      root.replaceChildren();
      root.hidden = true;
      delete root.dataset.hasProgress;
    }
  };
}
