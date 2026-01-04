"use client";

import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Briefcase, Lock, ShieldCheck, Camera } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { fetchProfile, updateProfile, uploadAvatar, ProfileData } from "./services/profile.service";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [formData, setFormData] = useState<Partial<ProfileData>>({});
  const accessToken = "USER_ACCESS_TOKEN"; // Replace with auth token logic

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await fetchProfile(accessToken);
        setProfile(data);
        setFormData(data);
      } catch (err) {
        console.error(err);
      }
    }

    loadProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && profile) {
      try {
        const avatarUrl = await uploadAvatar(e.target.files[0], profile.name); // or user ID
        setFormData({ ...formData, avatar: avatarUrl });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    try {
      const updated = await updateProfile(accessToken, formData);
      setProfile(updated);
      setFormData(updated);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (!profile) return <DashboardLayout title="Profile Settings">Loading...</DashboardLayout>;

  return (
    <DashboardLayout title="Profile Settings">
      <div className="max-w-5xl mx-auto pb-12">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-10 p-8 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="relative group">
            <Avatar className="h-32 w-32 border-4 border-blue-50 shadow-md">
              <AvatarImage src={isEditing ? formData.avatar : profile.avatar} />
              <AvatarFallback className="bg-blue-100 text-blue-700 text-2xl font-bold">SM</AvatarFallback>
            </Avatar>
            {isEditing && (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="h-6 w-6 mb-1" />
                <span className="text-[10px] font-bold uppercase">Change</span>
              </button>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleAvatarChange} 
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{profile.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
              <Badge className="bg-blue-50 text-blue-700 border-blue-100 px-3 py-1">{profile.role}</Badge>
              <Badge variant="outline" className="border-slate-200 text-slate-500 px-3 py-1">Member since 2020</Badge>
            </div>
            {!isEditing && (
              <Button 
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 h-10 px-6 rounded-full"
              >
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Info Section */}
          <div className="lg:col-span-8 space-y-8">
            {/* Professional Bio & Credentials */}
            <Card className="border-slate-200/60 shadow-none bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  Professional Background
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Credentials</label>
                      <Input
                        type="text"
                        name="credentials"
                        value={formData.credentials}
                        onChange={handleChange}
                        className="border-slate-200 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Professional Bio</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="w-full border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        rows={4}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Education & Credentials</p>
                      <p className="text-slate-800 font-medium">{profile.credentials}</p>
                    </div>
                    <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">About</p>
                      <p className="text-slate-700 leading-relaxed">{profile.bio}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Details */}
            <Card className="border-slate-200/60 shadow-none bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  Contact Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Email Address</label>
                        <Input name="email" value={formData.email} onChange={handleChange} className="border-slate-200" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                        <Input name="phone" value={formData.phone} onChange={handleChange} className="border-slate-200" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Office Location</label>
                      <Input name="location" value={formData.location} onChange={handleChange} className="border-slate-200" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-xl">
                        <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                          <Mail className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Email</p>
                          <p className="text-sm text-slate-900 font-medium truncate">{profile.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-xl">
                        <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                          <Phone className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Phone</p>
                          <p className="text-sm text-slate-900 font-medium truncate">{profile.phone}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-xl">
                      <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                        <MapPin className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Office Location</p>
                        <p className="text-sm text-slate-900 font-medium truncate">{profile.location}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Security Column */}
          <div className="lg:col-span-4">
            <Card className="border-slate-200 shadow-sm bg-white sticky top-24">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-blue-600" />
                  Security
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Manage your password and security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pt-2">
                {/* Password Section */}
                <div className="space-y-3">
                  <span className="text-sm font-bold text-slate-800">Password</span>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <span className="text-xs text-slate-500 font-medium">Last changed 30 days ago</span>
                      <Button variant="outline" size="sm" className="bg-white text-blue-600 border-blue-100 hover:bg-blue-50 text-xs font-semibold h-8 shrink-0">
                        Change Password
                      </Button>
                    </div>
                  </div>
                </div>

                {/* 2FA Section */}
                <div className="space-y-3">
                  <span className="text-sm font-bold text-slate-800">Two-Factor Authentication</span>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span className="text-xs text-slate-500 font-medium">Add an extra layer of security</span>
                      </div>
                      <Button variant="outline" size="sm" className="bg-white text-blue-600 border-blue-100 hover:bg-blue-50 text-xs font-semibold h-8 shrink-0">
                        Enable 2FA
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="pt-4 border-t border-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account Status</span>
                    <Badge className="bg-emerald-100 text-emerald-700 border-0 hover:bg-emerald-100 px-3 py-0.5">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Bar (Sticky) */}
        {isEditing && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md border border-slate-200 px-8 py-4 rounded-full shadow-2xl flex gap-4 z-50">
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 px-8 rounded-full">
              Save Changes
            </Button>
            <Button 
              onClick={() => { setFormData(profile); setIsEditing(false); }}
              variant="ghost"
              className="px-6 rounded-full text-slate-500"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}


