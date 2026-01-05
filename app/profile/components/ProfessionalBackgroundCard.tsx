"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { ProfileData } from "@/services/profile.service";

interface Props {
	profile: ProfileData;
	formData: Partial<ProfileData>;
	isEditing: boolean;
	onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function ProfessionalBackgroundCard({ profile, formData, isEditing, onChange }: Props) {
	return (
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
							<label className="block text-sm font-semibold text-slate-700 mb-2">Education</label>
							<Input
								type="text"
								name="education"
								value={(formData.education as string) || ""}
								onChange={onChange}
								className="border-slate-200 focus:ring-blue-500"
							/>
						</div>
						<div>
							<label className="block text-sm font-semibold text-slate-700 mb-2">Professional Bio</label>
							<textarea
								name="bio"
								value={formData.bio as string}
								onChange={onChange}
								className="w-full border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
								rows={4}
							/>
						</div>
					</div>
				) : (
					<div className="grid gap-6">
						<div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
							<p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Education & Credentials</p>
							<p className="text-slate-800 font-medium">{profile.education}</p>
						</div>
						<div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
							<p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">About</p>
							<p className="text-slate-700 leading-relaxed">{profile.bio}</p>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

