import { DashboardStats } from "@/types/dashboard.type";
import { API_URL, getAuthHeaders, handleResponse } from "./helper.service";

export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await fetch(`${API_URL}/dashboard/stats/`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function getScansActivity(days: number = 7): Promise<any> {
  const res = await fetch(`${API_URL}/dashboard/scans-activity/?days=${days}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}