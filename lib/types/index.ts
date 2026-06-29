export interface HistoricalWeatherData {
  dates: string[];
  tmax: number[];
  tmin: number[];
  rh_mean: number[];
  wind_speed_10m: number[];
  solar_radiation: number[];
  precipitation: number[];
}

export interface ForecastDailyData {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  wind_speed_10m_max: number[];
}

export interface ForecastResponse {
  daily: ForecastDailyData;
}

export interface CacheItem<T> {
  data: T;
  timestamp: number;
}

export interface Coordinates {
  lat: number;
  lon: number;
}
// lib/types/index.ts

export interface WeatherData {
  dates: string[];
  tmax: number[];
  tmin: number[];
  rh_mean: number[];
  wind_speed_10m: number[];
  solar_radiation: number[];
  precipitation: number[];
}

export interface DailyResult {
  date: string;
  tmax: number;
  tmin: number;
  rh_mean: number;
  wind_speed_10m: number;
  solar_radiation: number;
  precipitation: number;
  ET0: number;
  ETc: number;
  effective_rainfall: number;
}

export interface IrrigationResult {
  daily: DailyResult[];
  summary: {
    totalET0: number;
    totalETc: number;
    totalRainfall: number;
    totalEffectiveRainfall: number;
    avgET0: number;
    avgETc: number;
    IN_mm: number;
    totalWaterM3: number;
    TAW: number;
    RAW: number;
    fieldArea: number;
    irrigationEvents: number;
  };
  schedule: {
    day: number;
    date: string;
    ET0: number;
    ETc: number;
    precipitation: number;
    Pe: number;
    Dr_prev: number;
    Dr_now: number;
    RAW: number;
    irrigation: number;
    needsIrrigation: boolean;
  }[];
}

export interface LocationData {
  lat: number;
  lon: number;
  area_m2?: number;
  area_ha?: number;
  area_donum?: number;
  properties?: Record<string, any>;
  source?: string;
}

export interface FieldData {
  area_m2: number;
  area_ha: number;
  area_donum?: number;
  center: {
    lat: number;
    lon: number;
  };
  properties?: Record<string, any>;
}