import { supabase } from "../lib/supabase";
import { getAuthHeaders } from "../services/helper.service";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ProfileData {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  office_location?: string;
  role?: string;
  education?: string;
  bio?: string;
  avatar_url?: string;
  member_since?: number;
  is_active?: boolean;
}

export async function fetchProfile(): Promise<ProfileData> {
  const res = await fetch(`${API_URL}/accounts/profile/`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch profile");

  return res.json();
}

export async function updateProfile(data: Partial<ProfileData>): Promise<ProfileData> {
  const res = await fetch(`${API_URL}/accounts/profile/`, {
    method: "PATCH",
    headers: {
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(JSON.stringify(errorData));
  }

  return res.json();
}

export async function uploadAvatar(file: File, userId: string): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const filePath = `${userId}/${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, { upsert: true });

  if (error) throw error;

  const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

  return data.publicUrl;
}