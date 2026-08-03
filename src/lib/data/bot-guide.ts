import botGuideJson from "@/data/wiki/bot-guide.json";
import type { BotDirectoryGroup, CropBotRoute } from "@/types/wiki";

export const botDirectoryGroups = botGuideJson.botDirectoryGroups as BotDirectoryGroup[];
export const cropBotRoutes = botGuideJson.cropBotRoutes as CropBotRoute[];
export const botBuildRoutes = botGuideJson.botBuildRoutes;
export const botQuestions = botGuideJson.botQuestions;
