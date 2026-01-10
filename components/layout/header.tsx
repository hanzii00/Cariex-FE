"use client";

import { PatientSearch } from "@/app/dashboard/components/PatientSearch";
import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";

export function Header({ title }: { title: string }) {
  const pathname = usePathname();
  const showSearch = !pathname?.startsWith("/patients");

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40 ml-64">
      <h1 className="text-xl font-bold text-slate-900">{title}</h1>

      <div className="flex items-center space-x-6">
        {showSearch && <PatientSearch />}

        <button className="relative p-2 rounded-full hover:bg-slate-200/50 transition-all">
          <Bell className="h-5 w-5 text-slate-900" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border border-white" />
        </button>
      </div>
    </header>
  );
}