// app/api/nominatim/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.toString();
  const url = `https://nominatim.openstreetmap.org/search?${query}`;

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'SmartIrrigationCalculator/2.0' },
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}