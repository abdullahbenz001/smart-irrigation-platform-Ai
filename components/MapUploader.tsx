import { useState } from 'react'

interface MapUploaderProps {
  onSelect: (coords: { lat: number; lon: number }) => void;
}

export function MapUploader({ onSelect }: MapUploaderProps) {
  const [lat, setLat] = useState('38.6743')
  const [lon, setLon] = useState('39.2232')

  return (
    <div className="space-y-2 rounded-3xl border border-border bg-background p-4">
      <div className="text-sm font-medium text-foreground">Harita Yükleyici</div>
      <div className="grid grid-cols-2 gap-3">
        <label className="space-y-1 text-xs text-muted-foreground">
          Enlem
          <input
            type="number"
            step="0.0001"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            className="w-full rounded-2xl border border-border bg-input/50 px-3 py-2 text-sm outline-none"
          />
        </label>
        <label className="space-y-1 text-xs text-muted-foreground">
          Boylam
          <input
            type="number"
            step="0.0001"
            value={lon}
            onChange={(e) => setLon(e.target.value)}
            className="w-full rounded-2xl border border-border bg-input/50 px-3 py-2 text-sm outline-none"
          />
        </label>
      </div>
      <button
        type="button"
        onClick={() => onSelect({ lat: Number(lat), lon: Number(lon) })}
        className="rounded-3xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        Konumu Kaydet
      </button>
    </div>
  )
}
