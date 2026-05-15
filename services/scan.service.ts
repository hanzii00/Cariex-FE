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

type ScanPayload = Record<string, unknown>;

function asRecord(source: unknown): ScanPayload {
  return source && typeof source === "object" ? (source as ScanPayload) : {};
}

function normalizePatientName(source: unknown): string | null {
  const record = asRecord(source);
  const patient = asRecord(record.patient ?? record.patient_info ?? record.patientDetail);
  const fullName =
    record.patient_name ??
    record.patientName ??
    patient.full_name ??
    patient.name ??
    [patient.first_name, patient.last_name].filter(Boolean).join(" ");

  const trimmed = typeof fullName === "string" ? fullName.trim() : "";
  return trimmed || null;
}

function normalizePatientId(source: unknown): number | null {
  const record = asRecord(source);
  const patient = asRecord(record.patient ?? record.patient_info ?? record.patientDetail);
  const rawId =
    record.patient_id ??
    record.patientId ??
    patient.id ??
    patient.patient_id ??
    patient.patientId;

  const parsed = Number(rawId);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeScanRow(source: unknown): DiagnosisResult {
  const record = asRecord(source);
  const patientName = normalizePatientName(source);
  const patientId = normalizePatientId(source);
  const id = Number(record.id ?? record.diagnosis_id ?? record.diagnosisId ?? record.scan_id ?? record.scanId);

  return {
    id: Number.isFinite(id) ? id : Number(record.id),
    patientName,
    patientId,
    uploadedAt: (record.uploaded_at as string | null | undefined) ?? (record.uploadedAt as string | null | undefined) ?? null,
    status: (record.status as string | undefined) ?? "pending",
    imageUrl: (record.image_url as string | null | undefined) ?? (record.imageUrl as string | null | undefined) ?? null,
  };
}

function normalizeDiagnosisPayload(source: unknown) {
  const record = asRecord(source);
  const normalized = normalizeScanRow(source);

  return {
    ...record,
    ...normalized,
    image_url: (record.image_url as string | null | undefined) ?? (record.imageUrl as string | null | undefined) ?? normalized.imageUrl,
    imageUrl: (record.imageUrl as string | null | undefined) ?? (record.image_url as string | null | undefined) ?? normalized.imageUrl,
    uploaded_at: (record.uploaded_at as string | null | undefined) ?? (record.uploadedAt as string | null | undefined) ?? normalized.uploadedAt,
    uploadedAt: (record.uploadedAt as string | null | undefined) ?? (record.uploaded_at as string | null | undefined) ?? normalized.uploadedAt,
    patient_name: (record.patient_name as string | null | undefined) ?? (record.patientName as string | null | undefined) ?? normalized.patientName,
    patientName: (record.patientName as string | null | undefined) ?? (record.patient_name as string | null | undefined) ?? normalized.patientName,
    patient_id: (record.patient_id as number | string | null | undefined) ?? (record.patientId as number | string | null | undefined) ?? normalized.patientId,
    patientId: (record.patientId as number | string | null | undefined) ?? (record.patient_id as number | string | null | undefined) ?? normalized.patientId,
  };
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

  const data = await handleResponse(res);
  const d = data?.data ?? data?.result ?? data?.scan ?? data;

  return {
    ...normalizeScanRow(d),
    patientId: normalizePatientId(d) ?? patientId,
  };
}

// Fetch recent scans / diagnosis results for the upload page
export async function fetchRecentScans(): Promise<DiagnosisResult[]> {
  const res = await fetch(`${API_URL}/ai/diagnosis/all/`, {
    headers: getAuthHeaders(),
  });
  const data = await handleResponse(res);

  const raw = Array.isArray(data) ? data : data?.results ?? data?.data ?? [];

  return raw.map((d: unknown) => normalizeScanRow(d));
}

// Get a single diagnosis by id (used on analysis page)
export async function getDiagnosis(diagnosisId: number) {
  const res = await fetch(`${API_URL}/ai/diagnosis/${diagnosisId}/`, {
    headers: getAuthHeaders(),
  });
  const data = await handleResponse(res);
  // Backend returns { success: true, data: { ... } } for single diagnosis
  return normalizeDiagnosisPayload(data?.data ?? data);
}

// Generic diagnoses list used in other parts of the app (e.g. dashboard)
export async function fetchDiagnoses(): Promise<DiagnosisItem[]> {
  const res = await fetch(`${API_URL}/ai/diagnosis/all/`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await handleResponse(res);

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

export function mapDiagnosisToScan(d: DiagnosisItem | ScanItem | Record<string, unknown>): ScanItem {
  const record = d as Record<string, unknown>;
  const imageUrl = String(record.image_url ?? record.imageUrl ?? record.image ?? record.preview_url ?? "");
  const status = String(record.status ?? ((record.has_caries as boolean | undefined) ? "analyzed" : "pending"));

  return {
    id: Number(record.id),
    imageUrl,
    type: "Diagnosis",
    date: String(record.uploaded_at ?? record.uploadedAt ?? ""),
    status,
    __diagnosis: d,
  } as ScanItem;
}
