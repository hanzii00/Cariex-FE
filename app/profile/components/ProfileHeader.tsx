"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ProfileData } from "@/services/profile.service";

interface Props {
	profile: ProfileData;
	formData: Partial<ProfileData>;
	isEditing: boolean;
	onEdit: () => void;
	onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	fileInputRef: React.RefObject<HTMLInputElement | null>;
	getInitials: () => string;
}

export function ProfileHeader({
	profile,
	formData,
	isEditing,
	onEdit,
	onChange,
	onAvatarChange,
	fileInputRef,
	getInitials,
}: Props) {
	return (
		<div className="flex flex-col md:flex-row items-center gap-8 mb-10 p-8 bg-white rounded-2xl border border-slate-100 shadow-sm">
			<div className="relative group">
				<Avatar className="h-32 w-32 border-4 border-blue-50 shadow-md">
					{(isEditing ? (formData.avatar_url as string) : profile.avatar_url) ? (
						<AvatarImage src={isEditing ? (formData.avatar_url as string) : profile.avatar_url} />
					) : null}
					<AvatarFallback className="bg-blue-50 text-blue-700 flex items-center justify-center text-2xl font-bold">
						{getInitials()}
					</AvatarFallback>
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
					onChange={onAvatarChange}
				/>
			</div>

			<div className="flex-1 text-center md:text-left">
				{isEditing ? (
					<div className="space-y-3">
						<div className="flex gap-2 justify-center md:justify-start mb-2">
							<Input
								name="first_name"
								value={(formData.first_name as string) || ""}
								onChange={onChange}
								placeholder="First name"
								className="border-slate-200"
							/>
							<Input
								name="last_name"
								value={(formData.last_name as string) || ""}
								onChange={onChange}
								placeholder="Last name"
								className="border-slate-200"
							/>
						</div>
						<div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
							<Badge className="bg-blue-50 text-blue-700 border-blue-100 px-3 py-1">Dentist</Badge>
							<Badge variant="outline" className="border-slate-200 text-slate-500 px-3 py-1">Member since {profile?.member_since ?? "—"}</Badge>
						</div>
					</div>
				) : (
					<>
						<h1 className="text-3xl font-bold text-slate-900 mb-2">{`Doctor ${(profile.first_name ?? "") + " " + (profile.last_name ?? "")}`.trim()}</h1>
						<div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
							<Badge className="bg-blue-50 text-blue-700 border-blue-100 px-3 py-1">Dentist</Badge>
							<Badge variant="outline" className="border-slate-200 text-slate-500 px-3 py-1">Member since {profile?.member_since ?? "—"}</Badge>
						</div>
						{!isEditing && (
							<Button
								onClick={onEdit}
								className="bg-blue-600 hover:bg-blue-700 h-10 px-6 rounded-full"
							>
								Edit Profile
							</Button>
						)}
					</>
				)}
			</div>
		</div>
	);
}

