import { DiagnosisItem, ScanItem } from "@/types/scan.type";
import { API_URL, getAuthHeaders, handleResponse } from "./helper.service";

export interface Patient {
  id: number;
  full_name: string;
}

export interface DiagnosisResult {
  id: number;
  patientName: string | null;
  patientId: number | null;
  uploadedAt: string | null;
  status: "pending" | "processing" | "completed" | string;
  imageUrl?: string | null;
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
  formData.append("image", file);
  formData.append("patient_id", patientId.toString());

  const res = await fetch(`${API_URL}/ai/upload/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
    },
    body: formData,
  });

  const data: any = await handleResponse(res);
  const d = data?.data ?? data;

  return {
    id: d.id,
    patientName: d.patient_name ?? d.patientName ?? null,
    patientId: d.patient_id ?? d.patientId ?? null,
    uploadedAt: d.uploaded_at ?? d.uploadedAt ?? null,
    status: d.status ?? "pending",
    imageUrl: d.image_url ?? d.imageUrl ?? null,
  };
}

// Fetch recent scans / diagnosis results for the upload page
export async function fetchRecentScans(): Promise<DiagnosisResult[]> {
  const res = await fetch(`${API_URL}/ai/diagnosis/all/`, {
    headers: getAuthHeaders(),
  });
  const data: any = await handleResponse(res);

  const raw = Array.isArray(data) ? data : data?.results ?? data?.data ?? [];

  return raw.map((d: any) => ({
    id: d.id,
    patientName: d.patient_name ?? d.patientName ?? null,
    patientId: d.patient_id ?? d.patientId ?? null,
    uploadedAt: d.uploaded_at ?? d.uploadedAt ?? null,
    status: d.status ?? "pending",
    imageUrl: d.image_url ?? d.imageUrl ?? null,
  }));
}

// Get a single diagnosis by id (used on analysis page)
export async function getDiagnosis(diagnosisId: number) {
  const res = await fetch(`${API_URL}/ai/diagnosis/${diagnosisId}/`, {
    headers: getAuthHeaders(),
  });
  const data: any = await handleResponse(res);
  // Backend returns { success: true, data: { ... } } for single diagnosis
  return data?.data ?? data;
}

// Generic diagnoses list used in other parts of the app (e.g. dashboard)
export async function fetchDiagnoses(): Promise<DiagnosisItem[]> {
  const res = await fetch(`${API_URL}/ai/diagnosis/all/`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data: any = await handleResponse(res);

  if (Array.isArray(data)) return data as DiagnosisItem[];
  if (data && Array.isArray(data.results)) return data.results as DiagnosisItem[];

  return [];
}

export async function deleteDiagnosis(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/ai/diagnosis/${id}/delete/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  await handleResponse(res);
}

export function mapDiagnosisToScan(d: DiagnosisItem | any): ScanItem {
  const imageUrl = (d.image_url || d.image || d.preview_url || "") as string;
  return {
    id: d.id,
    imageUrl,
    type: "Diagnosis",
    date: d.uploaded_at,
    status: d.status || (d.has_caries ? "analyzed" : "pending"),
    __diagnosis: d,
  } as ScanItem;
}
