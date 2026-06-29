import { useState } from 'react'

interface LocationSelectorProps {
  onSelect: (location: { lat: number; lon: number; area_ha?: number }) => void;
}

export function LocationSelector({ onSelect }: LocationSelectorProps) {
  const [address, setAddress] = useState('')

  return (
    <div className="space-y-2 rounded-3xl border border-border bg-background p-4">
      <div className="text-sm font-medium text-foreground">Konum Seçici</div>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Adres veya koordinat girin"
        className="w-full rounded-2xl border border-border bg-input/50 px-3 py-2 text-sm outline-none"
      />
      <button
        type="button"
        onClick={() => onSelect({ lat: 38.6743, lon: 39.2232, area_ha: 1 })}
        className="rounded-3xl bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground"
      >
        Konumu Seç
      </button>
    </div>
  )
}
