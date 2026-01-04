"use client";

import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { PatientRow } from "./PatientRow";
import { Patient } from "@/types/patient.type";

interface Props {
  patients: Partial<Patient>[];
  isLoading: boolean;
}

export function PatientTable({ patients, isLoading }: Props) {
  return (
    <Card className="border-slate-100 shadow-sm overflow-hidden py-0">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="font-semibold text-slate-600">
              Patient Name
            </TableHead>
            <TableHead className="font-semibold text-slate-600">
              Patient ID
            </TableHead>
            <TableHead className="font-semibold text-slate-600">
              Last Visit
            </TableHead>
            <TableHead className="font-semibold text-slate-600">
              Risk Profile
            </TableHead>
            <TableHead className="font-semibold text-slate-600">
              Status
            </TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-32 text-center text-slate-400"
              >
                Loading patient records...
              </TableCell>
            </TableRow>
          ) : (
            patients.map((patient) => (
              <PatientRow key={patient.id} patient={patient} />
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}