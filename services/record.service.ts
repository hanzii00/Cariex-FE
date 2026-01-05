import { RecordCreateData, RecordItem } from "@/types/record.type";
import { API_URL, buildQueryString, getAuthHeaders, handleResponse } from "./helper.service";

export async function fetchRecords(params?: {
  patient_id?: number;
  record_type?: string;
  search?: string;
  sort_by?: string;
  order?: "asc" | "desc";
}): Promise<RecordItem[]> {
  const qs = buildQueryString(params as any);
  const res = await fetch(`${API_URL}/dashboard/records/${qs}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function createRecord(data: RecordCreateData): Promise<RecordItem> {
  const res = await fetch(`${API_URL}/dashboard/records/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function getRecord(id: number): Promise<RecordItem> {
  const res = await fetch(`${API_URL}/dashboard/records/${id}/`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function updateRecord(id: number, data: Partial<RecordCreateData>, partial = true): Promise<RecordItem> {
  const res = await fetch(`${API_URL}/dashboard/records/${id}/`, {
    method: partial ? "PATCH" : "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteRecord(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/dashboard/records/${id}/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  await handleResponse(res);
}

export async function getPatientRecords(patientId: number, params?: { record_type?: string }): Promise<RecordItem[]> {
  const qs = buildQueryString(params as any);
  const res = await fetch(`${API_URL}/dashboard/patients/${patientId}/records/${qs}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}