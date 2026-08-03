import raidCalculatorJson from "@/data/tools/raid-calculator.json";
import type { RaidCrop, RaidLevel } from "@/types/tools";

export const raidCropValueThresholds = raidCalculatorJson.raidCropValueThresholds;
export const maximumRaidPlantValue = raidCalculatorJson.maximumRaidPlantValue;
export const raidCrops = raidCalculatorJson.raidCrops as RaidCrop[];
export const raidLevels = raidCalculatorJson.raidLevels as RaidLevel[];
export const raidTimingRules = raidCalculatorJson.raidTimingRules;
