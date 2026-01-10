import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

export function InfoRow({ icon, value }: { icon: ReactNode; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-center text-sm text-slate-600">
      <span className="mr-3 text-slate-400">{icon}</span>
      {value}
    </div>
  );
}

export function RiskBadge({ risk }: { risk?: string | null }) {
  if (!risk) return null;

  const styles: Record<string, string> = {
    High: "bg-red-100 text-red-700",
    Moderate: "bg-amber-100 text-amber-700",
    Low: "bg-blue-100 text-blue-700",
  };

  return <Badge className={`${styles[risk] || styles.Low} border-0`}>{risk} Risk</Badge>;
}

export function StatusBadge({ status }: { status: string }) {
  return status === "analyzed" ? (
    <span className="text-xs font-bold text-emerald-600 flex items-center">
      <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full mr-1.5" />
      Analyzed
    </span>
  ) : (
    <span className="text-xs font-bold text-amber-600 flex items-center">
      <span className="h-1.5 w-1.5 bg-amber-500 rounded-full mr-1.5 animate-pulse" />
      Processing
    </span>
  );
}