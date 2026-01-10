"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { LayoutDashboard, Users, UploadCloud, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchProfile, ProfileData } from "@/services/profile.service";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const location = usePathname() || "/";
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await fetchProfile();
        if (mounted) setProfile(data);
      } catch (e) {
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const getInitials = () => {
    const first = profile?.first_name?.trim().charAt(0) ?? "";
    const last = profile?.last_name?.trim().charAt(0) ?? "";
    const initials = (first + last).toUpperCase();
    if (initials) return initials;
    const fallback = (profile?.email || "").toString().trim().slice(0, 2).toUpperCase();
    return fallback || "U";
  };

  const displayName = () => {
    if (!profile) return "Dr. Reynolds";
    const first = profile.first_name ?? "";
    const last = profile.last_name ?? "";
    const full = `${first} ${last}`.trim();
    return full ? `Dr. ${full}` : (profile.email ?? "");
  };

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/patients", label: "Patient Records", icon: Users },
    { href: "/upload", label: "AI Analysis", icon: UploadCloud },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 z-50">
      <div className="items-center px-6 pt-6 pb-3">
        <Image
          src="/logo/cariex-logo-exp.svg"
          alt="cariex.ai logo"
          width={120}
          height={32}
          className="object-contain"
        />
      </div>

      <nav className="h-full py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href} className="block">
              <div
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer group",
                  isActive
                    ? "bg-blue-50 text-blue-700 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 transition-colors",
                    isActive
                      ? "text-blue-700"
                      : "text-slate-600 group-hover:text-slate-900"
                  )}
                />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4">
        <Link href="/profile">
          <div className="flex items-center p-3 rounded-lg bg-slate-50 border border-slate-100 mb-3 cursor-pointer hover:bg-blue-50/50 hover:border-blue-100 transition-all group">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs group-hover:bg-blue-600 group-hover:text-white transition-colors">
              {getInitials()}
            </div>
            <div className="ml-3">
              <p className="text-sm font-semibold text-slate-900">
                {displayName()}
              </p>
              <p className="text-xs text-slate-500">Dentist</p>
            </div>
          </div>
        </Link>

        <Dialog>
          <DialogTrigger asChild>
            <button className="w-full text-left flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors">
              <LogOut className="mr-3 h-4 w-4" />
              Sign Out
            </button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sign out</DialogTitle>
              <p className="text-sm text-slate-500">Are you sure you want to sign out?</p>
            </DialogHeader>

            <DialogFooter>
              <div className="flex gap-2 w-full justify-end">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>

                <Button variant="destructive" onClick={async () => {
                  const { logout } = await import("@/services/auth.service");
                  await logout();
                  router.push("/authentication");
                }}>
                  Sign Out
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </aside>
  );
}