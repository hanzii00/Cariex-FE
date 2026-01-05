"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";

interface ActivityGraphCardProps {
  data: { name: string; scans: number }[];
}

export function ActivityGraphCard({ data }: ActivityGraphCardProps) {
  return (
    <Card className="lg:col-span-2 border-slate-100 shadow-sm py-4 flex justify-center">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-lg font-semibold text-slate-800">
          Scan Activity
        </CardTitle>

        <Link href="/upload">
          <Button variant="outline" className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:bg-blue-50 hover:border-blue-600 transition-all hover:cursor-pointer">
            <UploadCloud className="h-4 w-4 mr-1" />
            Analyze Now
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} className="-ml-5">
            <defs>
              <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              itemStyle={{
                color: "#1e293b",
                fontWeight: 600,
              }}
            />

            <Area
              type="monotone"
              dataKey="scans"
              stroke="#2563eb"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorScans)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
