import { API_URL, getAuthHeaders, handleResponse, buildQueryString } from './helper.service';

export interface Patient {
  id: number;
  full_name: string;
}

export interface DiagnosisResult {
  id: number;
  patientName: string;
  patientId: number;
  uploadedAt: string;
  status: 'pending' | 'processing' | 'completed';
  imageUrl?: string;
}

// Fetch all patients
export async function fetchPatients(): Promise<Patient[]> {
  const res = await fetch(`${API_URL}/dashboard/patients/`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

// Upload a dental image for a patient
export async function uploadScan(file: File, patientId: number): Promise<DiagnosisResult> {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('patient_id', patientId.toString());

  const res = await fetch(`${API_URL}/ai/upload/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access')}`,
    },
    body: formData,
  });

  return handleResponse(res);
}

// Fetch recent scans / diagnosis results
export async function fetchRecentScans(): Promise<DiagnosisResult[]> {
  const res = await fetch(`${API_URL}/ai/diagnosis/all/`, {
    headers: getAuthHeaders(),
  });
  const data = await handleResponse(res);

  const raw = Array.isArray(data) ? data : (data?.results ?? data?.data ?? []);

  return raw.map((d: any) => ({
    id: d.id,
    patientName: d.patient_name ?? d.patientName ?? null,
    patientId: d.patient_id ?? d.patientId ?? d.patient_id ?? null,
    uploadedAt: d.uploaded_at ?? d.uploadedAt ?? null,
    status: d.status ?? 'pending',
    imageUrl: d.image_url ?? d.imageUrl ?? null,
  }));
}


// scan.service.ts
export async function getDiagnosis(diagnosisId: number) {
  const res = await fetch(`${API_URL}/ai/diagnosis/${diagnosisId}/`, {
    headers: getAuthHeaders(),
  });
  const data = await handleResponse(res);
  // Backend returns { success: true, data: { ... } } for single diagnosis
  return data?.data ?? data;
}
