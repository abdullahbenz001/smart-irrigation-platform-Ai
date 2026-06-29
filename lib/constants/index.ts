// lib/constants/index.ts

export const KC_TABLE = {
  Bugday: [0.3, 1.15, 0.25, 1.0],
  "Misir (Tahil)": [0.3, 1.2, 0.6, 2.0],
  "Misir (Tatli)": [0.3, 1.15, 1.05, 1.5],
  Domates: [0.6, 1.15, 0.7, 0.6],
  Patates: [0.5, 1.15, 0.75, 0.6],
  Pamuk: [0.35, 1.2, 0.7, 1.5],
  "Seker pancari": [0.35, 1.2, 0.7, 0.5],
  "Soya fasulyesi": [0.4, 1.15, 0.5, 0.5],
  "Uzum (sofralik)": [0.3, 0.85, 0.45, 2.0],
  "Yonca (kuru ot)": [0.4, 1.2, 1.15, 0.7],
  "Sogan (kuru)": [0.5, 1.05, 0.75, 0.4],
  Havuc: [0.7, 1.05, 0.95, 0.3],
  Marul: [0.7, 1.0, 0.95, 0.3],
  "Biber (dolmalik)": [0.6, 1.05, 0.9, 0.7],
  Yerfistigi: [0.4, 1.15, 0.6, 0.6],
  Cilek: [0.4, 0.85, 0.75, 0.2],
  "Cim (soguk mevsim)": [0.9, 1.0, 0.95, 0.1],
} as const;

export const TOPRAK_TABLE = {
  "Kum (Sand)": [0.11, 0.04],
  "Kumlu tin (Sandy Loam)": [0.18, 0.08],
  "Tin (Loam)": [0.31, 0.12],
  "Siltli tin (Silt Loam)": [0.36, 0.13],
  "Killi tin (Clay Loam)": [0.39, 0.19],
  "Kil (Clay)": [0.49, 0.23],
} as const;

export const CROP_LIST = Object.keys(KC_TABLE);
export const SOIL_LIST = Object.keys(TOPRAK_TABLE);
export const GROWTH_STAGES = ["Baslangic", "Gelisme", "Orta Sezon", "Son Sezon"] as const;

export type CropType = keyof typeof KC_TABLE;
export type SoilType = keyof typeof TOPRAK_TABLE;
export type GrowthStage = typeof GROWTH_STAGES[number];