"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { PatientInfoCard } from "./components/PatientInfoCard";
import { ClinicalNotesCard } from "./components/ClinicalNotesCard";
import { ScansGrid } from "./components/ScansGrid";

import { getPatient } from "@/services/patient.service";
import { getPatientRecords } from "@/services/record.service";

export default function PatientDetailsPage() {
  const params = useParams();
  const id = Number(params.id);

  const [patient, setPatient] = useState<any | null>(null);
  const [scans, setScans] = useState<any[]>([]);
  const [loadingPatient, setLoadingPatient] = useState(true);
  const [loadingScans, setLoadingScans] = useState(true);

  const loadData = async () => {
    setLoadingPatient(true);
    setLoadingScans(true);

    try {
      const p = await getPatient(id);
      setPatient(p);
    } catch (err) {
      console.error("Failed to load patient", err);
    } finally {
      setLoadingPatient(false);
    }

    try {
      const s = await getPatientRecords(id);
      setScans(s || []);
    } catch (err) {
      console.error("Failed to load scans", err);
    } finally {
      setLoadingScans(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (loadingPatient) {
    return (
      <DashboardLayout title="Loading patient...">
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-64 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (!patient) {
    return (
      <DashboardLayout title="Patient not found">
        <p className="text-slate-500">The patient record does not exist.</p>
        <Link href="/patients">
          <Button variant="outline" className="mt-4">
            Back to Patients
          </Button>
        </Link>
      </DashboardLayout>
    );
  }

  return (
    <RequireAuth>
      <DashboardLayout title={patient.name}>
        <div className="mb-6">
          <Link
            href="/patients"
            className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-3" />
            Back to Patients
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <PatientInfoCard patient={patient} onUpdate={() => loadData()} />
            <ClinicalNotesCard patient={patient} scans={scans} />
          </div>

          <div className="lg:col-span-2">
            <ScansGrid scans={scans} loading={loadingScans} onRefresh={() => loadData()} />
          </div>
        </div>
      </DashboardLayout>
    </RequireAuth>
  );
}