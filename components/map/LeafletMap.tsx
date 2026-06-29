'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LeafletMapProps {
  geoJson?: any;
}

export default function LeafletMap({ geoJson }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const geoJsonLayer = useRef<L.Layer | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    mapInstance.current = L.map(mapRef.current, {
      center: [39.0, 35.0],
      zoom: 6,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(mapInstance.current);

    return () => {
      // properly remove map and clear ref to avoid later access to removed internals
      try {
        mapInstance.current?.remove();
      } catch (e) {
        // ignore
      }
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;

    // remove previous geojson layer safely
    if (geoJsonLayer.current) {
      try {
        // Layer may be a group or geojson layer; call remove() to detach from map
        // @ts-ignore
        geoJsonLayer.current.remove();
      } catch (e) {
        try {
          mapInstance.current?.removeLayer(geoJsonLayer.current as any);
        } catch (e2) {}
      }
      geoJsonLayer.current = null;
    }

    if (geoJson) {
      const layer = L.geoJSON(geoJson, {
        style: {
          color: '#10b981',
          weight: 4,
          fillOpacity: 0.25,
        },
      });

      // add layer and keep reference to it
      layer.addTo(mapInstance.current as L.Map);
      geoJsonLayer.current = layer;

      const bounds = layer.getBounds();
      if (bounds.isValid()) {
        mapInstance.current?.fitBounds(bounds, { padding: [20, 20] });
      }
    } else {
      mapInstance.current?.setView([39.0, 35.0], 6);
    }
  }, [geoJson]);

  return <div ref={mapRef} className="h-full w-full" />;
}