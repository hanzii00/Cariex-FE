"use client";

export type RiskLevel = "High" | "Moderate" | "Low";

export function RiskBadge({ risk }: { risk: RiskLevel | null }) {
  if (!risk) return null;

  const styles: Record<RiskLevel, string> = {
    High: "bg-red-50 text-red-700 border-red-200",
    Moderate: "bg-amber-50 text-amber-700 border-amber-200",
    Low: "bg-blue-50 text-blue-700 border-blue-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[risk]}`}
    >
      {risk} Risk
    </span>
  );
}
