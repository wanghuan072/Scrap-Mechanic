export type BotDirectoryRow = {
  name: string;
  href?: string;
  behavior: string;
  encounter: string;
  output: string;
  response: string;
};

export type BotDirectoryGroup = {
  id: string;
  label: string;
  title: string;
  description: string;
  rows: BotDirectoryRow[];
};

export type CropBotRoute = {
  crop: string;
  slug?: string;
  seedbot: string;
  lootbot: string;
  cookbot: string;
  fieldPlan: string;
};

export type WikiAcquisitionGuide = {
  summary: string;
  locations: Array<{ name: string; detail: string; href?: string }>;
  fieldNotes: string[];
};
