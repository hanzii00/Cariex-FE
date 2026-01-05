import { DiagnosisItem, ScanItem } from "@/types/scan.type";
import { API_URL, getAuthHeaders, handleResponse } from "./helper.service";

export async function fetchDiagnoses(): Promise<DiagnosisItem[]> {
  const res = await fetch(`${API_URL}/ai/diagnosis/all/`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data: any = await handleResponse(res);

  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;

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
    date: d.uploaded_at || d.uploaded_at,
    status: d.status || (d.has_caries ? "analyzed" : "pending"),
    __diagnosis: d,
  } as ScanItem;
}
