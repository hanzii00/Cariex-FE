export interface ScanItem {
  id: number;
  imageUrl: string;
  type?: string;
  date?: string;
  status?: string;
  [key: string]: any;
}

export interface DiagnosisItem {
  id: number;
  user: number | null;
  image_url: string;
  uploaded_at: string;
  has_caries: boolean;
  severity?: string;
  confidence_score?: number;
  lesion_boxes?: any;
  status?: string;
}
