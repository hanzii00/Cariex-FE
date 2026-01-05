"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { ProfileData } from "@/services/profile.service";

interface Props {
	profile: ProfileData;
	formData: Partial<ProfileData>;
	isEditing: boolean;
	onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function ContactDetailsCard({ profile, formData, isEditing, onChange }: Props) {
	return (
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
								<Input name="email" value={(formData.email as string) || ""} onChange={onChange} className="border-slate-200" />
							</div>
							<div className="space-y-2">
								<label className="text-sm font-semibold text-slate-700">Phone Number</label>
								<Input name="phone" value={(formData.phone as string) || ""} onChange={onChange} className="border-slate-200" />
							</div>
						</div>
						<div className="space-y-2">
							<label className="text-sm font-semibold text-slate-700">Office Location</label>
							<Input name="office_location" value={(formData.office_location as string) || ""} onChange={onChange} className="border-slate-200" />
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
								<p className="text-sm text-slate-900 font-medium truncate">{profile.office_location}</p>
							</div>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

