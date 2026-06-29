'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DataEntryTab from '@/components/tabs/DataEntryTab';
import ResultsTab from '@/components/tabs/ResultsTab';
import ScheduleTab from '@/components/tabs/ScheduleTab';
import SummaryTab from '@/components/tabs/SummaryTab';
import ModelTab from '@/components/tabs/ModelTab';
import MapTab from '@/components/tabs/MapTab';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('girdi');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6">
      <TabsList className="grid grid-cols-6 gap-2 bg-gray-100 p-1 rounded-xl">
        <TabsTrigger value="girdi">Veri Girişi</TabsTrigger>
        <TabsTrigger value="hesap">Ara Hesaplar</TabsTrigger>
        <TabsTrigger value="program">Sulama Programı</TabsTrigger>
        <TabsTrigger value="ozet">Özet & Grafik</TabsTrigger>
        <TabsTrigger value="model">Matematiksel Model</TabsTrigger>
        <TabsTrigger value="harita">Harita & Tarla</TabsTrigger>
      </TabsList>

      <TabsContent value="girdi">
        <DataEntryTab />
      </TabsContent>
      {/* ... diğer tab içerikleri */}
    </Tabs>
  );
}