"use client";

import { Bell, Search } from "lucide-react";
import { Input } from "../ui/input";
import { usePathname } from "next/navigation";

export function Header({ title }: { title: string }) {
  const pathname = usePathname();
  const showSearch = !pathname?.startsWith("/patients");

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40 ml-64">
      <h1 className="text-xl font-bold text-slate-900">{title}</h1>

      <div className="flex items-center space-x-6">
        {showSearch && (
          <div className="relative w-64 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search patients..."
              className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-full"
            />
          </div>
        )}
        
        <button className="relative p-2 rounded-full hover:bg-slate-200/50 transition-all hover:cursor-pointer">
          <Bell className="h-5 w-5 text-slate-900" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
        </button>
      </div>
    </header>
  );
}
