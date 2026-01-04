"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { ReactNode } from 'react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { getPatient } from "@/services/patient.service";
import { getPatientRecords } from "@/services/record.service";

import {
  ArrowLeft,
  Phone,
  Mail,
  Calendar,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";

export default function PatientDetailsPage() {
  const params = useParams();
  const id = Number(params.id);

  const [patient, setPatient] = useState<any | null>(null);
  const [scans, setScans] = useState<any[]>([]);
  const [loadingPatient, setLoadingPatient] = useState(true);
  const [loadingScans, setLoadingScans] = useState(true);

  useEffect(() => {
    const load = async () => {
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

    load();
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
    <DashboardLayout title={patient.name}>
      {/* Back */}
      <div className="mb-6">
        <Link
          href="/patients"
          className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Patients
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN — PATIENT INFO */}
        <div className="space-y-6">
          <Card className="border-slate-100 shadow-sm overflow-hidden py-0">
            <div className="h-24 bg-gradient-to-r from-blue-600 to-blue-400" />

            <div className="px-6 pb-6">
              <div className="relative -mt-12 mb-4">
                <div className="h-24 w-24 rounded-full border-4 border-white bg-white shadow-md flex items-center justify-center text-2xl font-bold text-slate-800">
                  {(patient.full_name || `${patient.first_name || ""} ${patient.last_name || ""}`).trim()
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
              </div>

              <h2 className="text-xl font-bold text-slate-900">
                {(patient.full_name || `${patient.first_name || ""} ${patient.last_name || ""}`).trim()}
              </h2>
              <p className="text-sm text-slate-500 mb-4">
                Patient ID: #{String(patient.id).padStart(4, "0")}
              </p>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <InfoRow icon={<Mail />} value={patient.email || undefined} />
                <InfoRow icon={<Phone />} value={patient.phone || undefined} />
                <InfoRow
                  icon={<Calendar />}
                  value={patient.last_visit ? `Last Visit: ${new Date(patient.last_visit).toLocaleDateString()}` : undefined}
                />
              </div>
            </div>
          </Card>

          {/* CLINICAL NOTES */}
          <Card className="border-slate-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Clinical Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-sm text-amber-900 flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                {scans && scans.length > 0 && scans[0].notes ? scans[0].notes : "No clinical notes available."}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="text-xs font-medium text-slate-500 uppercase mb-2">
                  Risk Profile
                </div>
                <RiskBadge risk={(patient.age ?? 0) >= 60 ? "High" : "Low"} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN — SCANS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">
              Imaging History
            </h3>
            <Link href="/upload">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Upload New Scan
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loadingScans ? (
              <p className="text-slate-500">Loading scans...</p>
            ) : scans.length === 0 ? (
              <div className="col-span-2 text-center text-slate-500 py-8 bg-slate-50 rounded-lg border border-dashed">
                No scans recorded yet.
              </div>
            ) : (
              scans.map((scan) => (
                <Link
                  href={
                    scan.status === "analyzed"
                      ? `/analysis/${scan.id}`
                      : "#"
                  }
                  key={scan.id}
                >
                  <div className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer overflow-hidden">
                    <div className="relative h-48 bg-slate-100">
                      <Image
                        src={scan.imageUrl}
                        alt={scan.type}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-white/90 backdrop-blur-sm">
                          {scan.type}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-500">
                          {new Date(scan.date!).toLocaleDateString()}
                        </span>
                        <StatusBadge status={scan.status} />
                      </div>

                      <h4 className="font-semibold text-slate-900 flex items-center group-hover:text-blue-600 transition-colors">
                        Scan #{scan.id}
                        <ChevronRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100" />
                      </h4>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

/* ---------------- HELPER COMPONENTS ---------------- */

function InfoRow({ icon, value }: { icon: ReactNode; value?: string }) {
  if (!value) return null;

  return (
    <div className="flex items-center text-sm text-slate-600">
      <span className="mr-3 text-slate-400">{icon}</span>
      {value}
    </div>
  );
}

function RiskBadge({ risk }: { risk?: string | null }) {
  if (!risk) return null;

  const styles: Record<string, string> = {
    High: "bg-red-100 text-red-700",
    Moderate: "bg-amber-100 text-amber-700",
    Low: "bg-blue-100 text-blue-700",
  };

  return (
    <Badge className={`${styles[risk] || styles.Low} border-0`}>
      {risk} Risk
    </Badge>
  );
}

function StatusBadge({ status }: { status: string }) {
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
