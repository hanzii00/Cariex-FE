// shortened api url
export const API_URL = process.env.NEXT_PUBLIC_API_URL;


// helper functions for making API requests
export async function handleResponse(response: Response) {
  const contentType = response.headers.get("content-type");
  const data = contentType && contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    let message = "An error occurred";

    if (!data) {
      message = response.statusText || message;
    } else if (typeof data === "string") {
      message = data;
    } else if (data.error) {
      message = data.error;
    } else if (data.detail) {
      message = data.detail;
    } else if (typeof data === "object") {
      const messages = Object.values(data)
        .flat()
        .map((v: any) => (Array.isArray(v) ? v.join(" ") : String(v)))
        .join(" ");
      message = messages || message;
    }

    const err = { message, fields: data };
    throw err;
  }

  return data;
}

export function getAuthHeaders() {
  const access = typeof window !== "undefined" ? localStorage.getItem("access") : null;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (access) headers["Authorization"] = `Bearer ${access}`;
  return headers;
}

export function buildQueryString(params?: Record<string, any>) {
  if (!params) return "";
  const esc = encodeURIComponent;
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${esc(k)}=${esc(String(v))}`)
    .join("&");
  return query ? `?${query}` : "";
}