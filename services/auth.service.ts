import { LoginData, RegisterData } from "@/types/auth.type";
import { API_URL, handleResponse } from "./helper.service";

export async function login({ email, password }: LoginData) {
  const res = await fetch(`${API_URL}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await handleResponse(res);

  if (data?.access && data?.refresh) {
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
  }

  return data;
}

export async function register({ username, email, password, password2 }: RegisterData) {
  const res = await fetch(`${API_URL}/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, password2 }),
  });

  const data = await handleResponse(res);
  return data;
}

export async function requestPasswordReset(email: string) {
  const res = await fetch(`${API_URL}/auth/password-reset/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await handleResponse(res);
  return data;
}

export async function confirmPasswordReset(token: string, password: string, password2: string) {
  const res = await fetch(`${API_URL}/auth/password-reset/${token}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password, password2 }),
  });

  const data = await handleResponse(res);
  return data;
}

export function logout() {
  const refresh = localStorage.getItem("refresh");

  if (refresh) {
    fetch(`${API_URL}/auth/logout/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    }).catch(() => {});
  }

  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
}
