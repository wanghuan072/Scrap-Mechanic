export type BuildPart = {
  name: string;
  quantity: number;
  role: string;
  essential?: boolean;
};

export type BuildTool = {
  name: string;
  use: string;
  moment: string;
};

export type BuildStage = {
  number: string;
  title: string;
  goal: string;
  steps: string[];
  checkpoint: string;
};

export type BuildConnection = {
  from: string;
  to: string;
  setting: string;
  purpose: string;
};

export type BuildTest = {
  test: string;
  pass: string;
  ifItFails: string;
};

export type BuildVariant = {
  situation: string;
  change: string;
  tradeoff: string;
};

export type BuildSpec = {
  slug: string;
  blueprintId: string;
  difficulty: "First build" | "Intermediate" | "Advanced";
  buildTime: string;
  crew: string;
  purpose: string;
  bestFor: string[];
  avoidWhen: string[];
  baseline: Array<{ label: string; value: string }>;
  parts: BuildPart[];
  toolkit: BuildTool[];
  stages: BuildStage[];
  connections: BuildConnection[];
  tests: BuildTest[];
  variants: BuildVariant[];
};
