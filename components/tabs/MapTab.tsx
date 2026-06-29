'use client';

import { useState, type ChangeEvent } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

const LeafletMap = dynamic(() => import('@/components/map/LeafletMap'), {
  ssr: false,
  loading: () => <div className="h-[500px] bg-gray-200 animate-pulse rounded-xl" />,
});

interface MapTabProps {
  geoJson?: any;
  fieldReady: boolean;
  fieldArea?: number;
  onGeoJsonUpload: (geoJson: any) => void;
}

export default function MapTab({ geoJson, fieldReady, fieldArea, onGeoJsonUpload }: MapTabProps) {
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.json')) {
      setFileError('Lütfen GeoJSON formatında bir dosya seçin (.json)');
      return;
    }

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      onGeoJsonUpload(parsed);
    } catch (error) {
      setFileError('GeoJSON dosyası okunamadı veya geçersiz.');
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
      <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Tarla GeoJSON Yükle</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Lütfen yalnızca TGKM tarafından verilen GeoJSON formatındaki tarla sınırınızı yükleyin. Harita sadece bu alanı gösterecektir.
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="geojsonFile">GeoJSON Dosyası</Label>
            <input
              id="geojsonFile"
              type="file"
              accept=".json,application/geo+json"
              onChange={handleFileChange}
              className="w-full rounded-3xl border border-border bg-input/50 px-3 py-2 text-sm outline-none"
            />
          </div>

          <div className="rounded-3xl border border-dashed border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900">
            <p>Durum: {fieldReady ? 'Tarla yüklendi' : 'Tarla bekleniyor'}</p>
            {fieldArea !== undefined && <p>Alan: {fieldArea.toFixed(2)} ha</p>}
          </div>

          {fileError && (
            <Alert>
              <AlertDescription>{fileError}</AlertDescription>
            </Alert>
          )}

          <Button type="button" onClick={() => onGeoJsonUpload(geoJson ?? {})}>
            Yüklenen Tarayı Yeniden İşle
          </Button>
        </div>
      </div>

      <div className="h-[500px] rounded-3xl border border-border bg-white shadow-sm">
        <LeafletMap geoJson={geoJson} />
      </div>
    </div>
  );
}