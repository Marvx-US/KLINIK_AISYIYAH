import React from 'react';
import { db } from '@/lib/db';
import SchedulesManager from './SchedulesManager';

export const metadata = {
  title: 'Kelola Jadwal Dokter | Admin Klinik Aisyiyah',
};

export default async function AdminSchedulesPage() {
  const schedules = await (db as any).doctorSchedule.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-7xl mx-auto">
      <SchedulesManager initialSchedules={schedules} />
    </div>
  );
}
