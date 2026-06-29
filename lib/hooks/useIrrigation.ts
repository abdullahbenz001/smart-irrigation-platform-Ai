// lib/hooks/useIrrigation.ts
import { useState, useCallback } from 'react';
import { WeatherData, IrrigationResult, LocationData } from '@/lib/types';
import { calculateSchedule } from '@/lib/services/irrigationEngine';
import { WeatherService } from '@/lib/services/weatherService';

interface UseIrrigationProps {
  crop: string;
  stage: string;
  kc: number;
  soilType: string;
  fc: number;
  wp: number;
  zr: number;
  pf: number;
  startDate: string;
  endDate: string;
  location: LocationData | null;
  elevation?: number;
}

export function useIrrigation() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<IrrigationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<any | null>(null);

  const calculate = useCallback(
    async (params: UseIrrigationProps) => {
      setLoading(true);
      setError(null);

      try {
        const { crop, stage, kc, soilType, fc, wp, zr, pf, startDate, endDate, location, elevation } = params;

        if (!location) {
          throw new Error('Lütfen önce konum seçiniz');
        }

        const weather = await new WeatherService().fetchHistoricalWeatherData(
          startDate,
          endDate,
          location.lat,
          location.lon
        );

        setWeatherData(weather);

        // also load forecast data for the location
        try {
          const forecast = await new WeatherService().loadForecastData(location.lat, location.lon);
          setForecastData(forecast);
        } catch (e) {
          setForecastData(null);
        }

        const result = calculateSchedule({
          weather,
          crop,
          stage,
          kc,
          soilType,
          fc,
          wp,
          zr,
          pf,
          fieldArea: location.area_ha || 1,
          elevation: elevation || 1067,
        });

        setResults(result);
        return result;
      } catch (err: any) {
        setError(err.message || 'Hesaplama hatası');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setResults(null);
    setError(null);
    setWeatherData(null);
  }, []);

  return {
    loading,
    results,
    error,
    weatherData,
    forecastData,
    calculate,
    reset,
  };
}