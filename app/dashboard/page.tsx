"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Users, AlertCircle, CheckCircle, Activity, } from "lucide-react";
import { usePatients } from "@/hooks/use-patients";
import { StatsCard } from "./components/StatCard";
import { ActivityGraphCard } from "./components/ActivityGraphCard";
import { PatientListCard } from "./components/PatientListCard";

const data = [
  { name: "Mon", scans: 4 },
  { name: "Tue", scans: 7 },
  { name: "Wed", scans: 5 },
  { name: "Thu", scans: 12 },
  { name: "Fri", scans: 8 },
  { name: "Sat", scans: 3 },
  { name: "Sun", scans: 0 },
];

export default function Dashboard() {
  const { data: patients, isLoading } = usePatients();

  // Simple Mock Stats
  const totalPatients = patients.length;
  const highRisk = patients.filter((p) => p.riskProfile === "High").length;
  const scansToday = 8;
  const pendingReviews = 3;

  return (
    <DashboardLayout title="Overview">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Patients"
          value={isLoading ? "..." : totalPatients.toString()}
          icon={Users}
          trend="+12% from last month"
          color="blue"
        />
        <StatsCard
          title="High Risk Cases"
          value={isLoading ? "..." : highRisk.toString()}
          icon={AlertCircle}
          trend="Requires attention"
          color="red"
          alert
        />
        <StatsCard
          title="Scans Today"
          value={scansToday.toString()}
          icon={Activity}
          trend="4 more than avg"
          color="green"
        />
        <StatsCard
          title="Pending Reviews"
          value={pendingReviews.toString()}
          icon={CheckCircle}
          trend="Cleared 5 today"
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ActivityGraphCard
          data={data}
        />
        
        <PatientListCard
          patients={patients}
          isLoading={isLoading}
          />
      </div>
    </DashboardLayout>
  );
}