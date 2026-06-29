// app/api/weather/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const lat = searchParams.get('latitude');
  const lon = searchParams.get('longitude');
  const startDate = searchParams.get('start_date');
  const endDate = searchParams.get('end_date');

  if (!lat || !lon || !startDate || !endDate) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    start_date: startDate,
    end_date: endDate,
    daily: [
      'temperature_2m_max',
      'temperature_2m_min',
      'relative_humidity_2m_mean',
      'wind_speed_10m_max',
      'shortwave_radiation_sum',
      'precipitation_sum',
    ].join(','),
    timezone: 'auto',
  });

  const url = `https://archive-api.open-meteo.com/v1/archive?${params}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return NextResponse.json(
        { error: `Weather API error: ${response.status}` },
        { status: response.status }
      );
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch weather data' }, { status: 500 });
  }
}