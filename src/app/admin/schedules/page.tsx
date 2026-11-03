import React from 'react';
import { getAllSchedules } from '@/features/schedules/queries/schedule-queries';
import SchedulesManager from '@/features/schedules/components/schedules-manager';

export const metadata = {
  title: 'Kelola Jadwal Dokter | Admin Klinik Aisyiyah',
};

export default async function AdminSchedulesPage() {
  let schedules: Awaited<ReturnType<typeof getAllSchedules>> = [];

  try {
    schedules = await getAllSchedules();
  } catch (error) {
    console.error('Error fetching schedules for admin:', error);
  }

  return (
    <div className="max-w-7xl mx-auto">
      <SchedulesManager initialSchedules={schedules} />
    </div>
  );
}
