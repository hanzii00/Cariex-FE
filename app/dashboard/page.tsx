"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Users, AlertCircle, CheckCircle, Activity } from "lucide-react";
import { StatsCard } from "./components/StatCard";
import { ActivityGraphCard } from "./components/ActivityGraphCard";
import { PatientListCard } from "./components/PatientListCard";
import { getDashboardStats } from "@/services/dashboard.service";
import { fetchPatients } from "@/services/patient.service";
import { fetchRecords } from "@/services/record.service";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [activityData, setActivityData] = useState<{ name: string; scans: number }[]>([]);
  const [highRiskCount, setHighRiskCount] = useState(0);
  const [scansToday, setScansToday] = useState(0);
  const [pendingReviews, setPendingReviews] = useState(0);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [s, allPatients, records] = await Promise.all([
          getDashboardStats(),
          fetchPatients(),
          fetchRecords(),
        ]);

        setStats(s);

        // Map recent patients to UI shape expected by PatientListCard
        const recent = (s.recent_patients || []).map((p: any) => ({
          id: p.id,
          name: p.full_name,
          lastVisit: p.last_visit,
          riskProfile: (p.age ?? 0) >= 60 ? "High" : "Low",
        }));

        setPatients(recent);

        // High risk count from all patients (example rule: age >= 60)
        const highRisk = (allPatients || []).filter((p: any) => (p.age ?? 0) >= 60).length;
        setHighRiskCount(highRisk);

        // scans today: count records whose visit_date is today
        const todayStr = new Date().toISOString().slice(0, 10);
        const scansTodayCount = (records || []).filter((r: any) => (r.visit_date || "").startsWith(todayStr)).length;
        setScansToday(scansTodayCount);

        // pending reviews: records without diagnosis
        const pending = (records || []).filter((r: any) => !r.diagnosis).length;
        setPendingReviews(pending);

        // Build activity data for last 7 days
        const days: { name: string; scans: number }[] = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dayKey = d.toISOString().slice(0, 10);
          const name = d.toLocaleDateString(undefined, { weekday: "short" });
          const scans = (records || []).filter((r: any) => (r.visit_date || "").startsWith(dayKey)).length;
          days.push({ name, scans });
        }
        setActivityData(days);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  return (
    <DashboardLayout title="Overview">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Patients"
          value={isLoading ? "..." : String(stats?.total_patients ?? "...")}
          icon={Users}
          trend="+12% from last month"
          color="blue"
        />
        <StatsCard
          title="High Risk Cases"
          value={isLoading ? "..." : String(highRiskCount)}
          icon={AlertCircle}
          trend="Requires attention"
          color="red"
          alert
        />
        <StatsCard
          title="Scans Today"
          value={isLoading ? "..." : String(scansToday)}
          icon={Activity}
          trend="Recent activity"
          color="green"
        />
        <StatsCard
          title="Pending Reviews"
          value={isLoading ? "..." : String(pendingReviews)}
          icon={CheckCircle}
          trend="Needs review"
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ActivityGraphCard
          data={activityData}
        />
        
        <PatientListCard
          patients={patients}
          isLoading={isLoading}
          />
      </div>
    </DashboardLayout>
  );
}