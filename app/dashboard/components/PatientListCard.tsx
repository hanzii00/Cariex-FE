"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Patient as PatientType } from "@/types/patient.type";
import { ArrowRight } from "lucide-react";
import { calculateAge } from "@/lib/utils";

interface PatientListCardProps {
  patients: Partial<PatientType>[];
  isLoading: boolean;
}

export function PatientListCard({ patients, isLoading }: PatientListCardProps) {
  return (
    <Card className="border-slate-100 shadow-sm pb-0 overflow-hidden py-4">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-lg font-semibold text-slate-800">
          Recent Patients
        </CardTitle>

        <Link
          href="/patients"
          className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardHeader>

      <CardContent className="p-0">
        <div className="space-y-4 -mt-2">
          {isLoading ? (
            <div className="text-slate-400 text-sm text-center">
              Loading patients...
            </div>
          ) : (
            patients.slice(0, 5).map((patient) => {
              const name =
                (patient as any).name ||
                `${patient.first_name || ""} ${patient.last_name || ""}`.trim();

              const age = calculateAge((patient as any).date_of_birth || (patient as any).birthDate || null);

              const lastVisit =
                (patient as any).lastVisit ??
                (patient.last_visit as string | undefined) ??
                null;

              const riskProfile =
                (patient as any).riskProfile ??
                (age !== null && age >= 60 ? "High" : "Low");

              return (
                <Link href={`/patients/${patient.id}`} key={patient.id}>
                  <div className="flex items-center p-3 rounded-lg border border-white hover:border hover:border-slate-200 hover:bg-slate-50 transition-all cursor-pointer group mx-2 gap-2">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm
                        ${
                          riskProfile === "High"
                            ? "bg-red-100 text-red-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                    >
                      {name
                        .split(" ")
                        .map((n: any) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>

                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                        {name}
                      </p>
                      <p className="text-xs text-slate-500">
                        Last visit:{" "}
                        {lastVisit
                          ? new Date(lastVisit).toLocaleDateString()
                          : "—"}
                      </p>
                    </div>

                    {riskProfile === "High" && (
                      <div
                        className="h-2 w-2 rounded-full bg-red-500"
                        title="High Risk"
                      />
                    )}
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
