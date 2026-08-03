import objectDetailsJson from "@/data/game/object-details.json";
import { getPlayerItem } from "@/lib/game/player-data";

import type { GameObjectDetails, ObjectDetailCollection } from "@/types/game";

export type { GameObjectDetails } from "@/types/game";

export const objectDetailCollection =
  objectDetailsJson as ObjectDetailCollection;

const detailByUuid = new Map(
  objectDetailCollection.objects.map((item) => [item.uuid, item] as const),
);

const detailAliases: Record<string, string> = {
  "plasma drill": "Plasma Drill Level 1",
  "plasma saw": "Plasma Saw 1",
  "gas engine": "Gas Engine Level 1",
  "electric engine": "Electric Engine Level 1",
  thruster: "Thruster Level 1",
  controller: "Controller Level 1",
  piston: "Piston Level 1",
  sensor: "Sensor Level 1",
  "driver's seat": "Driver's Seat Level 1",
  spudgun: "Spud Gun",
  "mountable spudgun": "Mountable Spud Gun",
  claygun: "Clay Gun",
};

export function getGameObjectDetails(name: string) {
  const item = getPlayerItem(detailAliases[name.toLowerCase()] ?? name);
  return item ? detailByUuid.get(item.uuid) : undefined;
}

export function formatObjectDimensions(details: GameObjectDetails) {
  if (details.box) {
    return `${details.box.x} × ${details.box.y} × ${details.box.z} blocks`;
  }
  if (details.cylinder) {
    return `${details.cylinder.diameter}-block diameter × ${details.cylinder.depth}-block depth (${details.cylinder.axis}-axis)`;
  }
  if (
    details.bounds &&
    typeof details.bounds.x === "number" &&
    typeof details.bounds.y === "number" &&
    typeof details.bounds.z === "number"
  ) {
    return `${details.bounds.x} × ${details.bounds.y} × ${details.bounds.z} blocks`;
  }
  return undefined;
}
