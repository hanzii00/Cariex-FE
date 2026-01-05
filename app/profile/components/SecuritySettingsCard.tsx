"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function SecuritySettingsCard() {
	return (
		<Card className="border-slate-200 shadow-sm bg-white sticky top-24">
			<CardHeader>
				<CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
					<Lock className="h-5 w-5 text-blue-600" />
					Security
				</CardTitle>
				<CardDescription className="text-slate-500">Manage your password and security settings</CardDescription>
			</CardHeader>
			<CardContent className="space-y-8 pt-2">
				<div className="space-y-3">
					<span className="text-sm font-bold text-slate-800">Password</span>
					<div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
							<span className="text-xs text-slate-500 font-medium">Last changed xx days ago</span>
							<Button variant="outline" size="sm" className="bg-white text-blue-600 border-blue-100 hover:bg-blue-50 text-xs font-semibold h-8 shrink-0">Change Password</Button>
						</div>
					</div>
				</div>

				<div className="space-y-3">
					<span className="text-sm font-bold text-slate-800">Two-Factor Authentication</span>
					<div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
							<div className="flex items-center gap-2">
								<ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
								<span className="text-xs text-slate-500 font-medium">Add an extra layer of security</span>
							</div>
							<Button variant="outline" size="sm" className="bg-white text-blue-600 border-blue-100 hover:bg-blue-50 text-xs font-semibold h-8 shrink-0">Enable 2FA</Button>
						</div>
					</div>
				</div>

				<div className="pt-4 border-t border-slate-50">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account Status</span>
						<Badge className="bg-emerald-100 text-emerald-700 border-0 hover:bg-emerald-100 px-3 py-0.5">Active</Badge>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

