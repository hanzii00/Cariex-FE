import { supabase } from "../../../lib/supabase";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ProfileData {
  name: string;
  email: string;
  phone: string;
  location: string;
  role: string;
  credentials: string;
  bio: string;
  avatar: string;
}

export async function fetchProfile(accessToken: string): Promise<ProfileData> {
  const res = await fetch(`${API_URL}/accounts/profile/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch profile");

  return res.json();
}

export async function updateProfile(
  accessToken: string,
  data: Partial<ProfileData>
): Promise<ProfileData> {
  const res = await fetch(`${API_URL}/accounts/profile/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
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