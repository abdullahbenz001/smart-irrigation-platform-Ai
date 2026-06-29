import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type IrrigationResult } from '@/lib/types'

interface SummaryTabProps {
  results?: IrrigationResult | null;
  loading?: boolean;
}

function SummaryTab({ results, loading }: SummaryTabProps) {
  if (loading) {
    return <div className="text-sm text-muted-foreground">Hesaplama yapılıyor...</div>
  }

  if (!results) {
    return <div className="text-sm text-muted-foreground">Özet verisi bekleniyor.</div>
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Genel Özet</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm">
            <li>Toplam ET₀: {results.summary.totalET0.toFixed(2)} mm</li>
            <li>Toplam ETc: {results.summary.totalETc.toFixed(2)} mm</li>
            <li>Toplam Yağış: {results.summary.totalRainfall.toFixed(2)} mm</li>
            <li>Toplam Etkili Yağış: {results.summary.totalEffectiveRainfall.toFixed(2)} mm</li>
            <li>Toplam Sulama Su Miktarı: {results.summary.totalWaterM3.toFixed(1)} m³</li>
            <li>TAW: {results.summary.TAW.toFixed(2)} mm</li>
            <li>RAW: {results.summary.RAW.toFixed(2)} mm</li>
            <li>Sulama Olayı Sayısı: {results.summary.irrigationEvents}</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div>Ortalama ET₀: {results.summary.avgET0.toFixed(2)} mm/gün</div>
            <div>Ortalama ETc: {results.summary.avgETc.toFixed(2)} mm/gün</div>
            <div>Alan: {results.summary.fieldArea.toFixed(2)} ha</div>
            <div>Toplam Su: {results.summary.totalWaterM3.toFixed(1)} m³</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SummaryTab
