import { Patient } from "./patient.type";

export interface DashboardStats {
  total_patients: number;
  total_records: number;
  patients_this_month: number;
  records_this_month: number;
  recent_patients: Patient[];
  recent_visits: Patient[];
}