"use client";

import { useEffect, useRef, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  fetchProfile,
  updateProfile,
  uploadAvatar,
  ProfileData,
} from "@/services/profile.service";

import { ProfileHeader } from "./components/ProfileHeader";
import { ProfessionalBackgroundCard } from "./components/ProfessionalBackgroundCard";
import { ContactDetailsCard } from "./components/ContactDetailsCard";
import { SecuritySettingsCard } from "./components/SecuritySettingsCard";
import { ProfileActionBar } from "./components/ActionBar";

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [formData, setFormData] = useState<Partial<ProfileData>>({});
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile().then((data) => {
      setProfile(data);
      setFormData(data);
    });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files?.[0] || !profile) return;
    const url = await uploadAvatar(
      e.target.files[0],
      profile.email ?? Date.now().toString()
    );
    setFormData({ ...formData, avatar_url: url });
  };

  const handleSave = async () => {
    if (!profile) return;
    const updated = await updateProfile(formData);
    setProfile(updated);
    setFormData(updated);
    setIsEditing(false);
  };

  const getInitials = () => {
    const src = isEditing ? formData : profile;
    return `${src?.first_name?.[0] ?? ""}${src?.last_name?.[0] ?? ""}`
      .toUpperCase()
      .slice(0, 2) || "U";
  };

  if (!profile)
    return <DashboardLayout title="Profile Settings">Loading…</DashboardLayout>;

  return (
    <DashboardLayout title="Profile Settings">
      <div className="max-w-5xl mx-auto pb-16 space-y-10">
        <ProfileHeader
          profile={profile}
          formData={formData}
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          onChange={handleChange}
          onAvatarChange={handleAvatarChange}
          fileInputRef={fileInputRef}
          getInitials={getInitials}
        />

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <ProfessionalBackgroundCard
              profile={profile}
              formData={formData}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <ContactDetailsCard
              profile={profile}
              formData={formData}
              isEditing={isEditing}
              onChange={handleChange}
            />
          </div>

          <div className="lg:col-span-4">
            <SecuritySettingsCard />
          </div>
        </div>

        {isEditing && (
          <ProfileActionBar
            onSave={handleSave}
            onCancel={() => {
              setFormData(profile);
              setIsEditing(false);
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
}


