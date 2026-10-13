export const MIN_CONTENT_GAP = 640;

// 坐标只表示正文累计高度，不含广告自身高度；优先满足间距，再接近等分点。
export function chooseAdBoundaries(length: number, boundaries: number[], home: boolean): number[] {
  const points = [...new Set(boundaries)].filter((point) => point >= MIN_CONTENT_GAP && length - point >= MIN_CONTENT_GAP).sort((a, b) => a - b);
  const limit = home ? 4 : length >= 2400 ? 2 : length >= 1280 ? 1 : 0;
  for (let count = Math.min(limit, Math.floor(length / MIN_CONTENT_GAP) - 1); count > 0; count--) {
    let states = points.map((point, index) => ({ cost: Math.abs(point - length / (count + 1)), path: [index] }));
    for (let stage = 2; stage <= count; stage++) {
      states = points.map((point, index) => {
        let best = { cost: Infinity, path: [] as number[] };
        for (let previous = 0; previous < index; previous++) {
          if (point - points[previous] < MIN_CONTENT_GAP || !Number.isFinite(states[previous].cost)) continue;
          const cost = states[previous].cost + Math.abs(point - length * stage / (count + 1));
          if (cost < best.cost) best = { cost, path: [...states[previous].path, index] };
        }
        return best;
      });
    }
    const best = states.reduce((result, state) => state.cost < result.cost ? state : result, { cost: Infinity, path: [] as number[] });
    if (Number.isFinite(best.cost)) return best.path.map((index) => points[index]);
  }
  return [];
}
