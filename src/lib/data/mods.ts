import modsJson from "@/data/mods/mods.json";
import type { WorkshopLeaderboardEntry, WorkshopMod } from "@/types/content";

export const mods = modsJson.mods as WorkshopMod[];
export const workshopLeaderboard = modsJson.workshopLeaderboard as WorkshopLeaderboardEntry[];
