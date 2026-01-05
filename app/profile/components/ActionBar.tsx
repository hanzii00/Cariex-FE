"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface Props {
	onSave: () => void;
	onCancel: () => void;
}

export function ProfileActionBar({ onSave, onCancel }: Props) {
	return (
		<div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md border border-slate-200 px-8 py-4 rounded-full shadow-2xl flex gap-4 z-50">
			<Button onClick={onSave} className="bg-blue-600 hover:bg-blue-700 px-8 rounded-full">Save Changes</Button>
			<Button onClick={onCancel} variant="ghost" className="px-6 rounded-full text-slate-500">Cancel</Button>
		</div>
	);
}

