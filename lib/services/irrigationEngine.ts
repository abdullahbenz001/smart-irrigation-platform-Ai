// lib/irrigationEngine.ts

import { WeatherData, DailyResult, IrrigationResult } from '@/lib/types';
import { KC_TABLE, TOPRAK_TABLE } from '@/lib/constants';

export function calculateET0(params: {
  tmax: number;
  tmin: number;
  rh_mean: number;
  wind_speed_10m: number;
  solar_radiation: number;
  elevation?: number;
}) {
  const { tmax, tmin, rh_mean, wind_speed_10m, solar_radiation, elevation = 1067 } = params;
  const T = (tmax + tmin) / 2;
  const u2 = wind_speed_10m * 0.748;
  const es_tmax = 0.6108 * Math.exp((17.27 * tmax) / (tmax + 237.3));
  const es_tmin = 0.6108 * Math.exp((17.27 * tmin) / (tmin + 237.3));
  const es = (es_tmax + es_tmin) / 2;
  const ea = es * (rh_mean / 100);
  const vpd = es - ea;
  const P = 101.3 * Math.pow((293 - 0.0065 * elevation) / 293, 5.26);
  const gamma = 0.000665 * P;
  const delta = (4098 * (0.6108 * Math.exp((17.27 * T) / (T + 237.3)))) / Math.pow(T + 237.3, 2);
  const Rn = solar_radiation * 0.77;
  const G = 0;
  const ET0 = (0.408 * delta * (Rn - G) + gamma * (900 / (T + 273)) * u2 * vpd) / (delta + gamma * (1 + 0.34 * u2));
  return Math.max(0, ET0);
}

export function calculateEffectiveRainfall(precipitation: number): number {
  const rain = precipitation ?? 0;
  if (rain <= 5) return rain * 0.9;
  if (rain <= 20) return rain * 0.75;
  return rain * 0.6;
}

export function getKcFromTable(crop: string, stage: string): number {
  const row = KC_TABLE[crop as keyof typeof KC_TABLE];
  if (!row) return 1.0;
  if (stage === "Baslangic") return row[0];
  if (stage === "Gelisme") return (row[0] + row[1]) / 2;
  if (stage === "Orta Sezon") return row[1];
  return row[2];
}

export function getSoilParams(soilType: string): { fc: number; wp: number } {
  const row = TOPRAK_TABLE[soilType as keyof typeof TOPRAK_TABLE];
  if (!row) return { fc: 0.31, wp: 0.12 };
  return { fc: row[0], wp: row[1] };
}

export function calculateSchedule(params: {
  weather: WeatherData;
  crop: string;
  stage: string;
  kc: number;
  soilType: string;
  fc: number;
  wp: number;
  zr: number;
  pf: number;
  fieldArea: number;
  elevation?: number;
}): IrrigationResult {
  const {
    weather,
    crop,
    stage,
    kc: manualKc,
    soilType,
    fc: manualFc,
    wp: manualWp,
    zr,
    pf,
    fieldArea = 1,
    elevation = 1067,
  } = params;

  // Determine Kc from crop/stage if not manually specified
  let kc = manualKc;
  if (kc === 0 || !kc) {
    kc = getKcFromTable(crop, stage);
  }

  // Determine soil params
  let fc = manualFc;
  let wp = manualWp;
  if ((fc === 0 || !fc) && (wp === 0 || !wp)) {
    const soil = getSoilParams(soilType);
    fc = soil.fc;
    wp = soil.wp;
  }

  const TAW = Math.max(0, 1000 * (fc - wp) * zr);
  const RAW = Math.max(0, pf * TAW);

  const dailyResults: DailyResult[] = [];
  const schedule: IrrigationResult['schedule'] = [];
  let totalET0 = 0,
    totalETc = 0,
    totalRainfall = 0,
    totalEffectiveRainfall = 0;
  let Dr = 0;
  let irrigationEvents = 0;

  const days = Math.min(weather.dates.length, 30);

  for (let i = 0; i < days; i++) {
    const tmax = Number(weather.tmax[i] || 0);
    const tmin = Number(weather.tmin[i] || 0);
    const rh = Number(weather.rh_mean[i] || 50);
    const wind = Number(weather.wind_speed_10m[i] || 0);
    const sr = Number(weather.solar_radiation[i] || 0);
    const prec = Number(weather.precipitation[i] || 0);

    const ET0 = calculateET0({ tmax, tmin, rh_mean: rh, wind_speed_10m: wind, solar_radiation: sr, elevation });
    const ETc = ET0 * kc;
    const Pe = calculateEffectiveRainfall(prec);

    const Dr_prev = Dr;
    let irrigation = 0;
    const needsIrrigation = Dr_prev > RAW;

    if (needsIrrigation) {
      irrigation = Dr_prev;
      irrigationEvents++;
    }

    Dr = Math.max(0, Math.min(TAW, Dr_prev + ETc - Pe - irrigation));

    dailyResults.push({
      date: weather.dates[i],
      tmax,
      tmin,
      rh_mean: rh,
      wind_speed_10m: wind,
      solar_radiation: sr,
      precipitation: prec,
      ET0,
      ETc,
      effective_rainfall: Pe,
    });

    schedule.push({
      day: i + 1,
      date: weather.dates[i],
      ET0,
      ETc,
      precipitation: prec,
      Pe,
      Dr_prev,
      Dr_now: Dr,
      RAW,
      irrigation,
      needsIrrigation,
    });

    totalET0 += ET0;
    totalETc += ETc;
    totalRainfall += prec;
    totalEffectiveRainfall += Pe;
  }

  const IN_mm = totalETc - totalEffectiveRainfall;
  const totalWaterM3 = (IN_mm / 1000) * 10000 * fieldArea;

  return {
    daily: dailyResults,
    schedule,
    summary: {
      totalET0,
      totalETc,
      totalRainfall,
      totalEffectiveRainfall,
      avgET0: totalET0 / days,
      avgETc: totalETc / days,
      IN_mm,
      totalWaterM3,
      TAW,
      RAW,
      fieldArea,
      irrigationEvents,
    },
  };
}