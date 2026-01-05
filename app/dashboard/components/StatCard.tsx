import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export function StatsCard({ title, value, icon: Icon, trend, trendValue, color, alert, }: any) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600",
    red: "bg-red-50 text-red-600",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  };

  const valueStr = String(value ?? "");
  const shouldShowTrend =
    valueStr !== "0" &&
    valueStr !== "..." &&
    valueStr.trim() !== "" &&
    (trend !== undefined || trendValue !== undefined);
  const trendLabel =
    typeof trend === "string"
      ? trend
      : trendValue !== undefined
      ? `${trendValue > 0 ? "+" : ""}${trendValue}%`
      : undefined;

  return (
    <Card
      className={`border-slate-100 flex items-center justify-center shadow-sm transition-all duration-200 hover:shadow-md ${
        alert ? "border-t-10 border-red-500" : ""
      }`}
    >
      <CardContent className="flex flex-col justify-center w-full">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
          </div>

          <div className={`p-3 rounded-xl ${colors[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>

        <div
          className="mt-2 flex items-center text-xs"
          hidden={!shouldShowTrend}
        >
          <TrendingUp
            className={`h-3 w-3 mr-1 ${
              trendValue && trendValue < 0 ? "text-red-500" : "text-emerald-600"
            }`}
          />

          <span
            className={`font-medium ${
              trendValue && trendValue < 0 ? "text-red-500" : "text-emerald-600"
            }`}
          >
            {trendLabel}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
