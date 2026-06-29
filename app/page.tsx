'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DataEntryTab from '@/components/tabs/DataEntryTab'
import ResultsTab from '@/components/tabs/ResultsTab'
import ScheduleTab from '@/components/tabs/ScheduleTab'
import SummaryTab from '@/components/tabs/SummaryTab'
import ModelTab from '@/components/tabs/ModelTab'
import MapTab from '@/components/tabs/MapTab'
import { useIrrigation } from '@/lib/hooks/useIrrigation'
import { extractFieldGeometry } from '@/lib/utils'

export default function Home() {
  const [activeTab, setActiveTab] = useState('girdi')
  const [geoJson, setGeoJson] = useState<any>(null)
  const [fieldReady, setFieldReady] = useState(false)
  const [fieldArea, setFieldArea] = useState<number | undefined>(undefined)
  const [fieldLocation, setFieldLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [fieldError, setFieldError] = useState<string | null>(null)

  const { loading, results, error, weatherData, forecastData, calculate, reset } = useIrrigation()

  const handleGeoJsonUpload = (data: any) => {
    try {
      const { centroid, area_ha } = extractFieldGeometry(data)
      setGeoJson(data)
      setFieldReady(true)
      setFieldArea(area_ha)
      setFieldLocation(centroid)
      setFieldError(null)
    } catch (err: any) {
      setFieldError('GeoJSON dosyası geçerli değil veya gerekli geometri içeriklerine sahip değil.')
      setFieldReady(false)
      setFieldArea(undefined)
      setFieldLocation(null)
      setGeoJson(null)
    }
  }

  const handleCalculate = async (params: any) => {
    if (!fieldReady || !fieldLocation) {
      setFieldError('Tarla geometrisi yüklenmeden hesaplama yapılamaz.')
      return
    }

    await calculate({
      ...params,
      location: {
        lat: fieldLocation.lat,
        lon: fieldLocation.lon,
        area_ha: fieldArea,
      },
    })
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-green-50 p-4">
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6">
          <TabsList className="grid grid-cols-6 gap-2 bg-gray-100 p-1 rounded-xl">
            <TabsTrigger value="girdi">Veri Girişi</TabsTrigger>
            <TabsTrigger value="hesap">Ara Hesaplar</TabsTrigger>
            <TabsTrigger value="program">Sulama Programı</TabsTrigger>
            <TabsTrigger value="ozet">Özet & Grafik</TabsTrigger>
            <TabsTrigger value="model">Matematiksel Model</TabsTrigger>
            <TabsTrigger value="harita">Harita & Tarla</TabsTrigger>
          </TabsList>

          {fieldError && (
            <div className="m-6 rounded-3xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive-foreground">
              {fieldError}
            </div>
          )}

          <div className="mt-6 space-y-6">
            <TabsContent value="girdi">
              <DataEntryTab onCalculate={handleCalculate} loading={loading} fieldReady={fieldReady} fieldArea={fieldArea} />
            </TabsContent>
            <TabsContent value="hesap">
              <ResultsTab weatherData={weatherData} forecastData={forecastData} />
            </TabsContent>
            <TabsContent value="program">
              <ScheduleTab results={results} />
            </TabsContent>
            <TabsContent value="ozet">
              <SummaryTab results={results} loading={loading} />
            </TabsContent>
            <TabsContent value="model">
              <ModelTab />
            </TabsContent>
            <TabsContent value="harita">
              <MapTab geoJson={geoJson} fieldReady={fieldReady} fieldArea={fieldArea} onGeoJsonUpload={handleGeoJsonUpload} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
