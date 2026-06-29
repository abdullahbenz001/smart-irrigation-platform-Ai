import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { WeatherService } from "./services/weatherService";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const EARTH_RADIUS_METERS = 6371000;

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

function getPolygonAreaMeters(coords: number[][]) {
  let area = 0;

  for (let i = 0; i < coords.length - 1; i++) {
    const [lon1, lat1] = coords[i];
    const [lon2, lat2] = coords[i + 1];
    const meanLat = toRadians((lat1 + lat2) / 2);
    const x1 = toRadians(lon1) * EARTH_RADIUS_METERS * Math.cos(meanLat);
    const y1 = toRadians(lat1) * EARTH_RADIUS_METERS;
    const x2 = toRadians(lon2) * EARTH_RADIUS_METERS * Math.cos(meanLat);
    const y2 = toRadians(lat2) * EARTH_RADIUS_METERS;
    area += x1 * y2 - x2 * y1;
  }

  return Math.abs(area) / 2;
}

function collectPolygons(geoJson: any): number[][][] {
  const polygons: number[][][] = [];

  function addGeometry(geometry: any) {
    if (!geometry) return;

    switch (geometry.type) {
      case 'Polygon':
        polygons.push(...geometry.coordinates.map((ring: number[][]) => ring));
        break;
      case 'MultiPolygon':
        geometry.coordinates.forEach((polygon: number[][][]) => {
          polygons.push(...polygon.map((ring) => ring));
        });
        break;
      case 'GeometryCollection':
        geometry.geometries?.forEach(addGeometry);
        break;
      default:
        break;
    }
  }

  if (!geoJson) {
    return polygons;
  }

  if (geoJson.type === 'FeatureCollection') {
    geoJson.features?.forEach((feature: any) => addGeometry(feature.geometry));
  } else if (geoJson.type === 'Feature') {
    addGeometry(geoJson.geometry);
  } else {
    addGeometry(geoJson);
  }

  return polygons;
}

export function calculateGeoJsonAreaHa(geoJson: any) {
  const polygons = collectPolygons(geoJson);
  const areaMeters = polygons.reduce((sum, ring) => sum + getPolygonAreaMeters(ring), 0);
  return Math.round((areaMeters / 10000) * 100) / 100;
}

export function getGeoJsonCentroid(geoJson: any) {
  const polygons = collectPolygons(geoJson);
  const points: Array<[number, number]> = [];

  polygons.forEach((ring) => {
    ring.forEach(([lon, lat]) => {
      points.push([lat, lon]);
    });
  });

  if (!points.length) {
    return { lat: 39.0, lon: 35.0 };
  }

  const total = points.reduce((acc, [lat, lon]) => {
    return { lat: acc.lat + lat, lon: acc.lon + lon };
  }, { lat: 0, lon: 0 });

  return {
    lat: total.lat / points.length,
    lon: total.lon / points.length,
  };
}

export function extractFieldGeometry(geoJson: any) {
  return {
    centroid: getGeoJsonCentroid(geoJson),
    area_ha: calculateGeoJsonAreaHa(geoJson),
  };
}

declare global {
  interface Window {
    weatherService: WeatherService;

    locationService?: {
      getSelectedLocation(): {
        lat: number;
        lon: number;
      };
    };

    locationManager?: {
      getSelectedLocation(): {
        lat: number;
        lon: number;
      };
    };
  }
}

export {};