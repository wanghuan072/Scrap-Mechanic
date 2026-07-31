import type { DataTable } from "@/data/types";

/** Confirmed community / wiki combat baselines used across bot and weapon pages. */
export const botCombatSummary: DataTable = {
  caption: "Hostile bot combat baseline (Normal difficulty)",
  headers: ["Bot", "Health", "Key attack damage", "Guaranteed or high-value drop"],
  rows: [
    ["Totebot", "40", "15 melee", "Circuit Board (always)"],
    ["Haybot", "100", "Poke 20 / Swing 30", "Scrap Metal (always)"],
    ["Tapebot (Blue)", "40", "55 projectile", "Battery ~35.7% / Component Kit ~14.3%"],
    ["Tapebot (Red)", "40", "62 projectile", "Battery ~35.7% / Component Kit ~14.3%"],
    ["Farmbot", "1500", "Kick 10 / Swipe 35 / Pesticide DoT", "Warehouse Key (always)"],
  ],
  note: "Classic attack values are paired with the current 1.0 unit health values. New bot families have individual pages because their movement, immunity, and loot rules do not fit one flat table.",
};

export const potatoWeaponSummary: DataTable = {
  caption: "Potato weapon damage and Farmbot ammo estimate",
  headers: ["Weapon", "Damage", "Ammo per shot", "Shots to drop Farmbot (1500 HP)"],
  rows: [
    ["Spud Gun", "28", "1 Potato", "54"],
    ["Spud Shotgun", "64 (16 × 4 fries)", "2 Potatoes", "24 at full damage"],
    ["Spudling Gun", "20 per chunk", "1 Potato / chunk", "75"],
    ["Mountable Spudgun", "28", "1 Potato from container", "54"],
  ],
  note: "Spud Shotgun has falloff at long range. Close-range full hits are the most ammo-efficient Farmbot kill.",
};

export const haybotBreakChances: DataTable = {
  caption: "Haybot block destruction chance by durability level",
  headers: ["Durability level", "Break chance"],
  rows: [
    ["1", "100%"],
    ["2", "60%"],
    ["3", "35%"],
    ["4", "25%"],
    ["5", "12.5%"],
    ["6", "2%"],
    ["7", "1%"],
    ["8+", "0% (Haybot cannot break)"],
  ],
  note: "Durability describes break probability per hit, not a separate hit-point bar.",
};

export const farmbotBreakChances: DataTable = {
  caption: "Farmbot melee break chance by durability level",
  headers: ["Durability level", "Break chance"],
  rows: [
    ["1–3", "100%"],
    ["4", "50%"],
    ["5", "18%"],
    ["6", "10%"],
    ["7", "2%"],
    ["8–9", "1%"],
  ],
  note: "Farmbots can destroy low-durability blocks simply by walking over them. Metal Block 3 is the practical defense ceiling.",
};

export const classicCropValues: DataTable = {
  caption: "Pre-1.0 / classic crop raid values (community tables)",
  headers: ["Crop", "Raid value", "High-value?"],
  rows: [
    ["Tomato / Carrot / Redbeet", "1", "No"],
    ["Potato", "1.5", "No"],
    ["Banana / Blueberry / Orange", "2", "No"],
    ["Broccoli / Pineapple", "3", "Yes (≥3)"],
  ],
  note: "Classic raids needed total value ≥10. Levels 7+ also required enough high-value crops. The on-site Raid Calculator uses the current 1.0 plant-value curve instead.",
};

export const cropGrowTimes: DataTable = {
  caption: "Crop grow time and harvest yield",
  headers: ["Crop", "Grow time", "Fertilized", "Harvest amount", "Extra watering"],
  rows: [
    ["Carrot", "21 min", "10.5 min", "1", "No"],
    ["Redbeet", "21 min", "10.5 min", "1", "No"],
    ["Tomato", "21 min", "10.5 min", "1", "No"],
    ["Potato", "21 min", "10.5 min", "5", "No"],
    ["Blueberry", "21 min", "10.5 min", "1", "No"],
    ["Banana", "21 min", "10.5 min", "1", "No"],
    ["Orange", "21 min", "10.5 min", "1", "No"],
    ["Cotton", "21 min", "10.5 min", "1", "No"],
    ["Broccoli", "42 min", "21 min", "1", "Yes unless fertilized"],
    ["Pineapple", "42 min", "21 min", "1", "Yes unless fertilized"],
  ],
  note: "Real-time minutes; 1 real minute ≈ 1 in-game hour. Chili is a 1.0 crop—confirm grow timing in the live client.",
};

export const craftbotUpgrades: DataTable = {
  caption: "Craftbot upgrade costs and slots",
  headers: ["Level", "Component Kits", "Crafting slots", "Speed"],
  rows: [
    ["1", "—", "2", "1×"],
    ["2", "5", "4", "1×"],
    ["3", "5", "6", "1×"],
    ["4", "5", "8", "1×"],
    ["5", "20", "8", "~2× (≈50% faster)"],
  ],
  note: "Levels 2–4 cost 5 Component Kits each. Level 5 costs 20 and halves crafting time with engine rounding quirks on very short recipes.",
};

export const classicRaidWaveSample: DataTable = {
  caption: "Classic raid composition sample (Night 1)",
  headers: ["Raid level", "Crop value band", "Night 1 enemies"],
  rows: [
    ["1", "10–19", "3 Totebots"],
    ["2", "20–29", "4 Totebots + 1 Haybot"],
    ["3", "30–39", "4 Totebots + 2 Haybots"],
    ["5", "50–59", "4 Totebots + 4 Haybots"],
    ["7", "80–109 + 5 high-value", "3 Totebots + 6 Haybots + 1 Tapebot"],
    ["10", "300+ + 50 high-value", "Adds Farmbot pressure on later waves"],
  ],
  note: "Classic wave tables help explain why Tapebots and Farmbots appear after high-value farms. 1.0 redesigned raid budgets—use the Raid Calculator for current plant-value thresholds.",
};
