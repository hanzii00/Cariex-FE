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
import { calculateAge } from "@/lib/utils";
import { RequireAuth } from "@/components/auth/RequireAuth";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [activityData, setActivityData] = useState<{ name: string; scans: number }[]>([]);
  const [highRiskCount, setHighRiskCount] = useState(0);
  const [scansToday, setScansToday] = useState(0);
  const [pendingReviews, setPendingReviews] = useState(0);

  const [totalPatientsTrendPercent, setTotalPatientsTrendPercent] = useState<number | undefined>(undefined);
  const [highRiskTrendPercent, setHighRiskTrendPercent] = useState<number | undefined>(undefined);
  const [scansTodayTrendPercent, setScansTodayTrendPercent] = useState<number | undefined>(undefined);
  const [pendingReviewsTrendPercent, setPendingReviewsTrendPercent] = useState<number | undefined>(undefined);

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

        const recent = (s.recent_patients || []).map((p: any) => ({
          id: p.id,
          name: p.full_name,
          lastVisit: p.last_visit,
          riskProfile: ((): string => {
            const age = calculateAge(p.date_of_birth || (p as any).birthDate) ?? (p.age ?? 0);
            return age >= 60 ? "High" : "Low";
          })(),
        }));

        setPatients(recent);

        const highRisk = (allPatients || []).filter((p: any) => {
          const age = calculateAge(p.date_of_birth || (p as any).birthDate) ?? (p.age ?? 0);
          return age >= 60;
        }).length;
        setHighRiskCount(highRisk);

        const todayStr = new Date().toISOString().slice(0, 10);
        const scansTodayCount = (records || []).filter((r: any) => (r.visit_date || "").startsWith(todayStr)).length;
        setScansToday(scansTodayCount);

        const pending = (records || []).filter((r: any) => !r.diagnosis).length;
        setPendingReviews(pending);

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

        const toISODate = (d: Date) => d.toISOString().slice(0, 10);
        const today = new Date();
        const lastMonthStart = new Date();
        lastMonthStart.setDate(today.getDate() - 30);
        const prevMonthStart = new Date();
        prevMonthStart.setDate(today.getDate() - 60);

        const countInRange = (items: any[], dateKey: string, start: Date, end: Date) => {
          const s = toISODate(start);
          const e = toISODate(end);
          return (items || []).filter((it: any) => {
            const d = (it[dateKey] || it.created_at || it.visit_date || "").slice(0, 10);
            return d >= s && d <= e;
          }).length;
        };

        const lastMonthEnd = today;
        const prevMonthEnd = new Date();
        prevMonthEnd.setDate(prevMonthStart.getDate() + 29);

        const patientsPrevMonth = (allPatients || []).filter((p: any) => {
          const d = (p.created_at || "").slice(0, 10);
          return d >= toISODate(prevMonthStart) && d <= toISODate(prevMonthEnd);
        }).length;

        const patientsThisMonth = s.patients_this_month || 0;

        const calcPercent = (curr: number, prev: number) => {
          if (prev === 0) {
            if (curr === 0) return 0;
            return 100;
          }
          return Math.round(((curr - prev) / prev) * 100);
        };

        const totalPatientsTrendPercent = calcPercent(patientsThisMonth, patientsPrevMonth);

        const highRiskPrev = (allPatients || []).filter((p: any) => {
          const d = (p.created_at || "").slice(0, 10);
          return (d >= toISODate(prevMonthStart) && d <= toISODate(prevMonthEnd) && ((p.age ?? 0) >= 60));
        }).length;
        const highRiskTrendPercent = calcPercent(highRisk, highRiskPrev);

        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        const scansYesterday = (records || []).filter((r: any) => (r.visit_date || "").startsWith(toISODate(yesterday))).length;
        const scansTodayTrendPercent = calcPercent(scansTodayCount, scansYesterday);

        const pendingPrev = (records || []).filter((r: any) => {
          const d = (r.created_at || "").slice(0, 10);
          return (d >= toISODate(prevMonthStart) && d <= toISODate(prevMonthEnd) && !r.diagnosis);
        }).length;
        const pendingReviewsTrendPercent = calcPercent(pending, pendingPrev);

        setHighRiskCount(highRisk);
        setScansToday(scansTodayCount);
        setPendingReviews(pending);
        setActivityData(days);

        (window as any).__dashboard_trends = {
          totalPatientsTrendPercent,
          highRiskTrendPercent,
          scansTodayTrendPercent,
          pendingReviewsTrendPercent,
        };

        setTotalPatientsTrendPercent(totalPatientsTrendPercent);
        setHighRiskTrendPercent(highRiskTrendPercent);
        setScansTodayTrendPercent(scansTodayTrendPercent);
        setPendingReviewsTrendPercent(pendingReviewsTrendPercent);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  return (
    <RequireAuth>
      <DashboardLayout title="Overview">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Patients"
          value={isLoading ? "..." : String(stats?.total_patients ?? "...")}
          icon={Users}
          trendValue={isLoading ? undefined : totalPatientsTrendPercent}
          color="blue"
        />
        <StatsCard
          title="High Risk Cases"
          value={isLoading ? "..." : String(highRiskCount)}
          icon={AlertCircle}
          trendValue={isLoading || highRiskTrendPercent == null ? undefined : `${highRiskTrendPercent}% Requires attention`}
          color="red"
          alert={highRiskCount > 0}
        />
        <StatsCard
          title="Scans Today"
          value={isLoading ? "..." : String(scansToday)}
          icon={Activity}
          trendValue={isLoading ? undefined : scansTodayTrendPercent}
          color="green"
        />
        <StatsCard
          title="Pending Reviews"
          value={isLoading ? "..." : String(pendingReviews)}
          icon={CheckCircle}
          trendValue={isLoading ? undefined : pendingReviewsTrendPercent}
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
    </RequireAuth>
  );
}