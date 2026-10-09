import { cellToMapPoint, type MapPoint } from "./coordinate-system";
import type { LocationNameInstance } from "./location-name-inventory";

export interface IndexedLocationName {
  key: string;
  instance: LocationNameInstance;
  point: MapPoint;
}

const bucketSize = 1024;

/** 按类型和空间分桶，平移时只读取视口附近的地点。 */
export class LocationSpatialIndex {
  private readonly types = new Map<string, Map<string, IndexedLocationName[]>>();

  constructor(instances: readonly LocationNameInstance[]) {
    const seen = new Set<string>();
    for (const instance of instances) {
      const point = cellToMapPoint(instance.position);
      const duplicate = `${instance.typeId}\u0000${instance.label}\u0000${point.x}\u0000${point.y}`;
      if (seen.has(duplicate)) continue;
      seen.add(duplicate);
      const key = `${Math.floor(point.x / bucketSize)}:${Math.floor(point.y / bucketSize)}`;
      let buckets = this.types.get(instance.typeId);
      if (!buckets) this.types.set(instance.typeId, buckets = new Map());
      let bucket = buckets.get(key);
      if (!bucket) buckets.set(key, bucket = []);
      bucket.push({ key: `${instance.id}\u0000${duplicate}`, instance, point });
    }
  }

  query(bounds: { west: number; east: number; south: number; north: number }, typeIds: ReadonlySet<string>): IndexedLocationName[] {
    const result: IndexedLocationName[] = [];
    for (const typeId of typeIds) {
      const buckets = this.types.get(typeId);
      if (!buckets) continue;
      for (let y = Math.floor(bounds.south / bucketSize); y <= Math.floor(bounds.north / bucketSize); y++) {
        for (let x = Math.floor(bounds.west / bucketSize); x <= Math.floor(bounds.east / bucketSize); x++) {
          for (const item of buckets.get(`${x}:${y}`) ?? []) {
            if (item.point.x >= bounds.west && item.point.x <= bounds.east
              && item.point.y >= bounds.south && item.point.y <= bounds.north) result.push(item);
          }
        }
      }
    }
    return result;
  }
}
