export interface RecordItem {
  id: number;
  patient: number;
  created_by?: number;
  record_type: string;
  title: string;
  description?: string;
  diagnosis?: string;
  prescription?: string;
  notes?: string;
  visit_date?: string;
  follow_up_date?: string | null;
  attachments?: any[];
  created_at?: string;
  updated_at?: string;
}

export interface RecordCreateData {
  patient: number;
  record_type: string;
  title: string;
  description?: string;
  diagnosis?: string;
  prescription?: string;
  notes?: string;
  visit_date?: string;
  follow_up_date?: string;
  attachments?: any[];
}