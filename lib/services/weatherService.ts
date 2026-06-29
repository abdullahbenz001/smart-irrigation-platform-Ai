import { CacheItem, Coordinates, ForecastResponse, HistoricalWeatherData } from "../types/index";
export class WeatherService {
  private cache = new Map<string, CacheItem<any>>();
  private readonly cacheTimeout = 30 * 60 * 1000;

  private readonly defaultLat = 38.6743;
  private readonly defaultLon = 39.2232;

  private getLocationCoordinates(): Coordinates {
    const selectedLocation =
      (window as any).locationService?.getSelectedLocation?.() ??
      (window as any).locationManager?.getSelectedLocation?.();

    if (selectedLocation?.lat && selectedLocation?.lon) {
      return {
        lat: selectedLocation.lat,
        lon: selectedLocation.lon,
      };
    }

    return {
      lat: this.defaultLat,
      lon: this.defaultLon,
    };
  }

  async fetchHistoricalWeatherData(
    startDate: string,
    endDate: string,
    lat?: number,
    lon?: number
  ): Promise<HistoricalWeatherData> {   

    if (lat == null || lon == null) {
      const loc = this.getLocationCoordinates();
      lat = loc.lat;
      lon = loc.lon;
    }

    const cacheKey = `historical_${lat}_${lon}_${startDate}_${endDate}`;

    const cached = this.cache.get(cacheKey);

    if (
      cached &&
      Date.now() - cached.timestamp < this.cacheTimeout
    ) {
      return cached.data;
    }

    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      start_date: startDate,
      end_date: endDate,
      daily: [
        "temperature_2m_max",
        "temperature_2m_min",
        "relative_humidity_2m_mean",
        "wind_speed_10m_max",
        "shortwave_radiation_sum",
        "precipitation_sum",
      ].join(","),
      timezone: "auto",
    });

    const response = await fetch(
      `https://archive-api.open-meteo.com/v1/archive?${params}`
    );

    if (!response.ok) {
      throw new Error(
        `Archive API returned ${response.status}`
      );
    }

    const data = await response.json();

    const result: HistoricalWeatherData = {
      dates: data.daily.time ?? [],
      tmax: data.daily.temperature_2m_max ?? [],
      tmin: data.daily.temperature_2m_min ?? [],
      rh_mean: data.daily.relative_humidity_2m_mean ?? [],
      wind_speed_10m: data.daily.wind_speed_10m_max ?? [],
      solar_radiation: data.daily.shortwave_radiation_sum ?? [],
      precipitation: data.daily.precipitation_sum ?? [],
    };

    this.cache.set(cacheKey, {
      data: result,
      timestamp: Date.now(),
    });

    return result;
  }

  async loadForecastData(
    lat?: number,
    lon?: number
  ): Promise<ForecastResponse> {
    
    if (lat == null || lon == null) {
      const loc = this.getLocationCoordinates();
      lat = loc.lat;
      lon = loc.lon;
    }

    const cacheKey = `forecast_${lat}_${lon}`;

    const cached = this.cache.get(cacheKey);

    if (
      cached &&
      Date.now() - cached.timestamp < this.cacheTimeout
    ) {
      return cached.data;
    }

    const url =
      `https://api.open-meteo.com/v1/forecast?` +
      `latitude=${lat}` +
      `&longitude=${lon}` +
      `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max` +
      `&timezone=auto`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Forecast API Error");
    }

    const data: ForecastResponse = await response.json();

    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });

    return data;
  }

  calculateHargreavesET0(
    tmax: number,
    tmin: number
  ): number {

    const tavg = (tmax + tmin) / 2;

    return (
      0.0023 *
      (tavg + 17.8) *
      Math.sqrt(Math.max(0, tmax - tmin)) *
      0.408
    );
  }

  calculateEffectiveRainfall(
    precipitation: number | null | undefined
  ): number {

    const rain = Number(precipitation ?? 0);

    if (rain <= 5) return rain * 0.9;
    if (rain <= 20) return rain * 0.75;

    return rain * 0.6;
  }

  renderForecast(data: ForecastResponse): void {

    if (!data?.daily) {
      console.error("Invalid forecast data");
      return;
    }

    // Kodunuz burada aynı şekilde devam eder.
    // Tek fark değişkenlerin tiplerinin belirtilmesidir.
  }

  clearCache(): void {
    this.cache.clear();
  }
}