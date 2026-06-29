import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type IrrigationResult } from '@/lib/types'

interface ScheduleTabProps {
  results?: IrrigationResult | null;
}

function ScheduleTab({ results }: ScheduleTabProps) {
  if (!results) {
    return <div className="text-sm text-muted-foreground">Henüz sulama programı hesaplanmadı.</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sulama Programı</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Bu program, hesaplanan ETc, etkili yağış ve RAW değerleri üzerinden oluşturuldu. Sulama yalnızca Dr değeri RAW'ı aştığında planlanır.
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gün</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead>ETc (mm)</TableHead>
                <TableHead>Yağış (mm)</TableHead>
                <TableHead>Dr Önce (mm)</TableHead>
                <TableHead>Dr Şimdi (mm)</TableHead>
                <TableHead>Sulama (mm)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.schedule.map((item) => (
                <TableRow key={item.date}>
                  <TableCell>{item.day}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.ETc.toFixed(1)}</TableCell>
                  <TableCell>{item.precipitation.toFixed(1)}</TableCell>
                  <TableCell>{item.Dr_prev.toFixed(1)}</TableCell>
                  <TableCell>{item.Dr_now.toFixed(1)}</TableCell>
                  <TableCell>{item.irrigation.toFixed(1)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default ScheduleTab