import { Patient, PatientCreateData } from "@/types/dashboard.type";
import { API_URL, buildQueryString, getAuthHeaders, handleResponse } from "./helper.service";

export async function fetchPatients(params?: {
  search?: string;
  min_age?: number;
  max_age?: number;
  sort_by?: string;
  order?: "asc" | "desc";
}): Promise<Patient[]> {
  const qs = buildQueryString(params as any);

  const res = await fetch(`${API_URL}/dashboard/patients/${qs}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  
  return handleResponse(res);
}

export async function createPatient(data: PatientCreateData): Promise<Patient> {
  const res = await fetch(`${API_URL}/dashboard/patients/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}

export async function getPatient(id: number): Promise<Patient> {
  const res = await fetch(`${API_URL}/dashboard/patients/${id}/`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
}

export async function updatePatient(id: number, data: Partial<PatientCreateData>, partial = true): Promise<Patient> {
  const res = await fetch(`${API_URL}/dashboard/patients/${id}/`, {
    method: partial ? "PATCH" : "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}

export async function deletePatient(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/dashboard/patients/${id}/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  await handleResponse(res);
}