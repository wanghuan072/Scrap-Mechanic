export type RaidCrop = {
  slug: string;
  name: string;
  value: number;
  image: string;
};

export type RaidLevel = {
  level: number;
  minimumPlantValue: number;
  budget: { minimum: number; maximum: number };
};

export type RaidBotId = "tg" | "tb" | "tr" | "ty" | "hb" | "pg" | "py" | "pr" | "fb";
export type RaidBotCounts = Partial<Record<RaidBotId, number>>;
export type RaidEnemyGroup = {
  list: RaidBotCounts;
  cost?: number;
  weight?: number;
  delay?: number;
};
export type RaidForecastRow = {
  id: RaidBotId;
  average: number;
  chance: number;
  maximum: number;
};
export type RaidForecastResult = {
  simulations: number;
  rows: RaidForecastRow[];
  averageTotal: number;
  minimumTotal: number;
  maximumTotal: number;
};
export type RaidTimelineWave = { at: number; bots: RaidBotCounts };
