import * as L from "leaflet";
import type { NormalizedPlayerContentTransfer } from "../save/save-protocol";

export interface PlayerFootprint {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  maxZ: number;
  color: string;
}

export interface PlayerFootprintResult {
  footprints: PlayerFootprint[];
  skippedShapes: number;
}

const MAX_DRAWN_FOOTPRINTS = 20_000;

function hex(value: number): string {
  return value.toString(16).padStart(2, "0");
}

function colorAt(content: NormalizedPlayerContentTransfer, index: number): string {
  const offset = index * 4;
  return `#${hex(content.colors[offset]!)}${hex(content.colors[offset + 1]!)}${hex(content.colors[offset + 2]!)}`;
}

function footprintAt(content: NormalizedPlayerContentTransfer, index: number): PlayerFootprint | undefined {
  const offset = index * 5;
  if (offset + 4 >= content.footprintBounds.length || index * 4 + 2 >= content.colors.length) {
    return undefined;
  }
  const values = content.footprintBounds.subarray(offset, offset + 5);
  if ([...values].some((value) => !Number.isFinite(value))) return undefined;
  return {
    minX: values[0]!, minY: values[1]!, maxX: values[2]!, maxY: values[3]!,
    maxZ: values[4]!, color: colorAt(content, index)
  };
}

export function buildPlayerFootprints(
  content: NormalizedPlayerContentTransfer
): PlayerFootprintResult {
  const footprints: PlayerFootprint[] = [];
  let skippedShapes = 0;
  for (let index = 0; index < content.shapeBodyIndexes.length; index += 1) {
    const footprint = footprintAt(content, index);
    if (footprint) footprints.push(footprint);
    else skippedShapes += 1;
  }
  footprints.sort((left, right) => left.maxZ - right.maxZ);
  return { footprints, skippedShapes };
}

export interface PlayerContentLayer {
  setContent(content?: NormalizedPlayerContentTransfer): void;
  setVisible(visible: boolean): void;
  destroy(): void;
}

type CanvasFactory = () => {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
};

function defaultCanvasFactory(): ReturnType<CanvasFactory> {
  const canvas = document.createElement("canvas");
  const context = navigator.userAgent.includes("jsdom") ? null : canvas.getContext("2d");
  if (context) return { canvas, context };
  return {
    canvas,
    context: {
      clearRect() {}, beginPath() {}, rect() {}, fill() {}, stroke() {}
    } as unknown as CanvasRenderingContext2D
  };
}

function lowerBoundByMinX(content: NormalizedPlayerContentTransfer, value: number): number {
  let low = 0;
  let high = content.footprintOrder.length;
  while (low < high) {
    const middle = (low + high) >>> 1;
    const shapeIndex = content.footprintOrder[middle]!;
    if (content.footprintBounds[shapeIndex * 5]! < value) low = middle + 1;
    else high = middle;
  }
  return low;
}

export function createPlayerContentLayer(
  map: L.Map,
  canvasFactory: CanvasFactory = defaultCanvasFactory
): PlayerContentLayer {
  const { canvas, context } = canvasFactory();
  canvas.className = "player-content-layer leaflet-zoom-hide";
  canvas.dataset.playerContent = "";
  canvas.style.position = "absolute";
  canvas.style.pointerEvents = "none";
  map.getPanes().overlayPane.append(canvas);
  let content: NormalizedPlayerContentTransfer | undefined;

  const draw = () => {
    const size = map.getSize();
    canvas.width = Math.max(1, Math.round(size.x));
    canvas.height = Math.max(1, Math.round(size.y));
    L.DomUtil.setPosition(canvas, map.containerPointToLayerPoint([0, 0]));
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (!content || content.footprintOrder.length === 0) return;
    const bounds = map.getBounds();
    const start = lowerBoundByMinX(content, bounds.getWest() - content.maxFootprintSpan);
    const visible: number[] = [];
    for (let orderIndex = start; orderIndex < content.footprintOrder.length; orderIndex += 1) {
      const shapeIndex = content.footprintOrder[orderIndex]!;
      const offset = shapeIndex * 5;
      const minX = content.footprintBounds[offset]!;
      if (minX > bounds.getEast()) break;
      const minY = content.footprintBounds[offset + 1]!;
      const maxX = content.footprintBounds[offset + 2]!;
      const maxY = content.footprintBounds[offset + 3]!;
      if (maxX >= bounds.getWest() && minY <= bounds.getNorth() && maxY >= bounds.getSouth()) {
        visible.push(shapeIndex);
      }
    }
    visible.sort((left, right) =>
      content!.footprintBounds[left * 5 + 4]! - content!.footprintBounds[right * 5 + 4]!
    );
    const stride = Math.max(1, Math.ceil(visible.length / MAX_DRAWN_FOOTPRINTS));
    for (let visibleIndex = 0; visibleIndex < visible.length; visibleIndex += stride) {
      const shapeIndex = visible[visibleIndex]!;
      const offset = shapeIndex * 5;
      const first = map.latLngToContainerPoint([
        content.footprintBounds[offset + 1]!, content.footprintBounds[offset]!
      ]);
      const second = map.latLngToContainerPoint([
        content.footprintBounds[offset + 3]!, content.footprintBounds[offset + 2]!
      ]);
      context.beginPath();
      context.rect(
        Math.min(first.x, second.x),
        Math.min(first.y, second.y),
        Math.max(1, Math.abs(second.x - first.x)),
        Math.max(1, Math.abs(second.y - first.y))
      );
      context.fillStyle = colorAt(content, shapeIndex);
      context.fill();
      context.strokeStyle = "rgba(15, 18, 18, 0.85)";
      context.lineWidth = 1;
      context.stroke();
    }
  };
  map.on("move zoom resize", draw);
  return {
    setContent(nextContent) {
      content = nextContent;
      draw();
    },
    setVisible(visible) { canvas.hidden = !visible; },
    destroy() {
      map.off("move zoom resize", draw);
      canvas.remove();
      content = undefined;
    }
  };
}
