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
  const res = await fetch(`${API_URL}/api/patients/`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

// Upload a dental image for a patient
export async function uploadScan(file: File, patientId: number): Promise<DiagnosisResult> {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('patient_id', patientId.toString());

  const res = await fetch(`${API_URL}/api/ai/upload/`, {
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
  const res = await fetch(`${API_URL}/api/ai/diagnosis/all/`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}
