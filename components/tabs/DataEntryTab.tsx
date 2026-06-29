// components/tabs/DataEntryTab.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CROP_LIST, SOIL_LIST, GROWTH_STAGES, KC_TABLE, TOPRAK_TABLE } from '@/lib/constants';
import { getKcFromTable, getSoilParams } from '@/lib/services/irrigationEngine';

interface DataEntryFields {
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
}

interface DataEntryTabProps {
  onCalculate?: (params: DataEntryFields) => void;
  loading?: boolean;
  fieldReady?: boolean;
  fieldArea?: number;
}

export function DataEntryTab({ onCalculate = () => {}, loading, fieldReady = false, fieldArea }: DataEntryTabProps) {
  const [crop, setCrop] = useState('Domates');
  const [stage, setStage] = useState('Orta Sezon');
  const [kc, setKc] = useState(1.15);
  const [soilType, setSoilType] = useState('Tin (Loam)');
  const [fc, setFc] = useState(0.31);
  const [wp, setWp] = useState(0.12);
  const [zr, setZr] = useState(0.6);
  const [pf, setPf] = useState(0.4);
  const [startDate, setStartDate] = useState('2026-03-01');
  const [endDate, setEndDate] = useState('2026-03-07');

  // Auto-update Kc when crop or stage changes
  useEffect(() => {
    const autoKc = getKcFromTable(crop, stage);
    setKc(autoKc);
  }, [crop, stage]);

  // Auto-update FC/WP when soil type changes
  useEffect(() => {
    const params = getSoilParams(soilType);
    setFc(params.fc);
    setWp(params.wp);
  }, [soilType]);

  const handleSubmit = () => {
    onCalculate({
      crop,
      stage,
      kc,
      soilType,
      fc,
      wp,
      zr,
      pf,
      startDate,
      endDate,
    });
  };

  return (
    <div className="space-y-6">
      {/* Tarih */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Başlangıç Tarihi</Label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Bitiş Tarihi</Label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Bitki Bilgileri */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-green-700">🌱 Bitki Bilgileri</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Bitki Türü</Label>
            <Select value={crop} onValueChange={(value) => setCrop(value ?? 'Domates')}>
              <SelectTrigger>
                <SelectValue placeholder="Seçiniz" />
              </SelectTrigger>
              <SelectContent>
                {CROP_LIST.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Büyüme Evresi</Label>
            <Select value={stage} onValueChange={(value) => setStage(value ?? 'Orta Sezon')}>
              <SelectTrigger>
                <SelectValue placeholder="Seçiniz" />
              </SelectTrigger>
              <SelectContent>
                {GROWTH_STAGES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Kc (Bitki Katsayısı)</Label>
            <Input
              type="number"
              step="0.01"
              value={kc}
              onChange={(e) => setKc(parseFloat(e.target.value) || 0)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Toprak Bilgileri */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-amber-700">🏔️ Toprak Bilgileri</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Toprak Sınıfı</Label>
            <Select value={soilType} onValueChange={(value) => setSoilType(value ?? 'Tin (Loam)')}>
              <SelectTrigger>
                <SelectValue placeholder="Seçiniz" />
              </SelectTrigger>
              <SelectContent>
                {SOIL_LIST.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>FC (Tarla Kapasitesi) m³/m³</Label>
            <Input
              type="number"
              step="0.01"
              value={fc}
              onChange={(e) => setFc(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label>WP (Solma Noktası) m³/m³</Label>
            <Input
              type="number"
              step="0.01"
              value={wp}
              onChange={(e) => setWp(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label>Kök Derinliği (Zr) m</Label>
            <Input
              type="number"
              step="0.1"
              value={zr}
              onChange={(e) => setZr(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label>Tüketilebilir Fraksiyon (p)</Label>
            <Input
              type="number"
              step="0.05"
              value={pf}
              onChange={(e) => setPf(parseFloat(e.target.value) || 0)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-blue-700">📍 Tarla Bilgisi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Tarla geometrisi harita sekmesinden GeoJSON dosyası olarak yüklenecektir. Sadece çiftçinin tarlası görüntülenecektir.
          </p>
          <div className="rounded-3xl border border-border bg-slate-50 p-4 text-sm">
            <div>Tarla yükleme durumu: {fieldReady ? 'Yüklendi' : 'Bekleniyor'}</div>
            {fieldArea !== undefined && (
              <div>Tarla alanı: {fieldArea.toFixed(2)} ha</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Butonlar */}
      <div className="flex flex-wrap gap-4">
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700"
        >
          {loading ? 'Hesaplanıyor...' : '💧 Hesapla'}
        </Button>
        <Button variant="outline" onClick={() => {}}>
          📡 Tahmin Yükle
        </Button>
        <Button variant="destructive" onClick={() => {}}>
          🗑️ Sonuçları Sıfırla
        </Button>
      </div>

      {loading && (
        <Alert>
          <AlertDescription>Veri yükleniyor, lütfen bekleyin...</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default DataEntryTab