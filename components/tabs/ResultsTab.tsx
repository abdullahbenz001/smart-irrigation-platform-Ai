import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ResultsTabProps {
  weatherData?: {
    dates: string[];
    tmax: number[];
    tmin: number[];
    rh_mean: number[];
    wind_speed_10m: number[];
    solar_radiation: number[];
    precipitation: number[];
  } | null;
  forecastData?: {
    daily: {
      time: string[];
      temperature_2m_max: number[];
      temperature_2m_min: number[];
      precipitation_sum: number[];
      wind_speed_10m_max: number[];
    };
  } | null;
}

function ResultsTab({ weatherData, forecastData }: ResultsTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hava Verileri</CardTitle>
        </CardHeader>
        <CardContent>
          {weatherData ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tarih</TableHead>
                  <TableHead>T Maks</TableHead>
                  <TableHead>T Min</TableHead>
                  <TableHead>RH %</TableHead>
                  <TableHead>Rüzgar</TableHead>
                  <TableHead>Güneş Radyasyonu</TableHead>
                  <TableHead>Yağış</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {weatherData.dates.map((date, index) => (
                  <TableRow key={date + index}>
                    <TableCell>{date}</TableCell>
                    <TableCell>{weatherData.tmax[index]?.toFixed(1)}</TableCell>
                    <TableCell>{weatherData.tmin[index]?.toFixed(1)}</TableCell>
                    <TableCell>{weatherData.rh_mean[index]?.toFixed(0)}</TableCell>
                    <TableCell>{weatherData.wind_speed_10m[index]?.toFixed(1)}</TableCell>
                    <TableCell>{weatherData.solar_radiation[index]?.toFixed(0)}</TableCell>
                    <TableCell>{weatherData.precipitation[index]?.toFixed(1)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-sm text-muted-foreground">Hava verisi yüklenmedi.</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hava Tahmini</CardTitle>
        </CardHeader>
        <CardContent>
          {forecastData ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tarih</TableHead>
                  <TableHead>T Maks</TableHead>
                  <TableHead>T Min</TableHead>
                  <TableHead>Yağış</TableHead>
                  <TableHead>Rüzgar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {forecastData.daily.time.map((date, index) => (
                  <TableRow key={date + index}>
                    <TableCell>{date}</TableCell>
                    <TableCell>{forecastData.daily.temperature_2m_max[index]?.toFixed(1)}</TableCell>
                    <TableCell>{forecastData.daily.temperature_2m_min[index]?.toFixed(1)}</TableCell>
                    <TableCell>{forecastData.daily.precipitation_sum[index]?.toFixed(1)}</TableCell>
                    <TableCell>{forecastData.daily.wind_speed_10m_max[index]?.toFixed(1)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-sm text-muted-foreground">Hava tahmini bulunamadı.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ResultsTab
