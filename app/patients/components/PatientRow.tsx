"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { RiskBadge } from "./RiskBadge";
import { Patient } from "@/types/patient.type";

export function PatientRow({ patient }: { patient: Partial<Patient> }) {
  return (
    <TableRow className="hover:bg-slate-50/50 transition-colors">
      <TableCell>
        <div className="flex items-center">
          <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs mr-3">
            { (patient.full_name || `${patient.first_name || ""} ${patient.last_name || ""}`).trim()
              .split(" ")
              .map((n) => n[0])
              .join("") }
          </div>

          <div>
            <div className="font-medium text-slate-900">{(patient.full_name || `${patient.first_name || ""} ${patient.last_name || ""}`).trim()}</div>
            <div className="text-xs text-slate-500">
              {patient.age ?? "—"} yrs • {patient.gender}
            </div>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <div className="text-sm font-medium text-slate-900">
          #{patient.id.toString().padStart(4, "0")}
        </div>
      </TableCell>

      <TableCell className="text-slate-600 text-sm">
        {patient.lastVisit
          ? new Date(patient.lastVisit).toLocaleDateString()
          : "—"}
      </TableCell>

      <TableCell>
        {patient.riskProfile && <RiskBadge risk={patient?.riskProfile} />}
      </TableCell>

      <TableCell>
        <Badge
          variant="outline"
          className="text-xs font-normal bg-green-50 text-green-700 border-green-200"
        >
          Active
        </Badge>
      </TableCell>

      <TableCell className="text-center">
        <Link href={`/patients/${patient.id}`}>
          <Button
            variant="outline"
            size="sm"
            className="bg-white border-slate-200 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            View Details
          </Button>
        </Link>
      </TableCell>
    </TableRow>
  );
}
