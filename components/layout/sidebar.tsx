import { Link, useLocation } from 'wouter';
import Image from 'next/image';
import { LayoutDashboard, Users, UploadCloud, LogOut, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/patients', label: 'Patient Records', icon: Users },
    { href: '/upload', label: 'AI Analysis', icon: UploadCloud },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col fixed inset-y-0 z-50">
      <div className="h-16 flex items-center px-6 border-b border-slate-50">
        <Image
          src="/logo/cariex-logo-exp.svg"
          alt="cariex.ai logo"
          width={120}
          height={32}
          className="object-contain"
        />
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
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
                    isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                  )}
                />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-50">
        <Link href="/profile">
          <div className="flex items-center p-3 rounded-lg bg-slate-50 border border-slate-100 mb-3 cursor-pointer hover:bg-blue-50/50 hover:border-blue-100 transition-all group">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs group-hover:bg-blue-600 group-hover:text-white transition-colors">
              DR
            </div>
            <div className="ml-3">
              <p className="text-sm font-semibold text-slate-900">Dr. Reynolds</p>
              <p className="text-xs text-slate-500">Lead Dentist</p>
            </div>
          </div>
        </Link>
        <Link href="/login">
          <div className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors">
            <LogOut className="mr-3 h-4 w-4" />
            Sign Out
          </div>
        </Link>
      </div>
    </aside>
  );
}
