export interface DoctorSchedule {
  id: number;
  poli: string;
  doctorName: string;
  scheduleInfo: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
