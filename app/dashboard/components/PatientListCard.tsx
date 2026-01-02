"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Patient } from "@/lib/mockData";
import { ArrowRight } from "lucide-react";

interface PatientListCardProps {
  patients: Patient[];
  isLoading: boolean;
}

export function PatientListCard({ patients, isLoading }: PatientListCardProps) {
  return (
    <Card className="border-slate-100 shadow-sm pb-0 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800">
          Recent Patients
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-slate-400 text-sm">Loading patients...</div>
          ) : (
            patients.slice(0, 4).map((patient) => (
              <Link href={`/patients/${patient.id}`} key={patient.id}>
                <div className="flex items-center p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group mx-2 gap-2">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm
                    ${
                      patient.riskProfile === "High"
                        ? "bg-red-100 text-red-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {patient.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>

                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                      {patient.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      Last visit:{" "}
                      {patient.lastVisit
                        ? new Date(patient.lastVisit).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>

                  {patient.riskProfile === "High" && (
                    <div
                      className="h-2 w-2 rounded-full bg-red-500"
                      title="High Risk"
                    />
                  )}
                </div>
              </Link>
            ))
          )}
        </div>

        <Link href="/patients">
          <div className="mt-4 w-full py-2 text-center text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer border-t border-slate-100 pt-4 hover:bg-slate-50 transition-all">
            View All Patients
            <ArrowRight className="inline-block ml-1 h-4 w-4" />
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
