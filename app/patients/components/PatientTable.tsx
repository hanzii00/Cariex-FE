"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PatientRow } from "./PatientRow";
import { Patient } from "@/types/patient.type";
import { PatientTablePagination } from "./PatientTablePagination";

interface Props {
  patients: Partial<Patient>[];
  isLoading: boolean;
}

export function PatientTable({ patients, isLoading }: Props) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const sorted = useMemo(() => {
    return (patients || []).slice().sort((a, b) => {
      const ai = Number(a?.id ?? 0);
      const bi = Number(b?.id ?? 0);
      return ai - bi;
    });
  }, [patients]);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (page > totalPages) setPage(totalPages);

  const start = (page - 1) * pageSize;
  const pageItems = sorted.slice(start, start + pageSize);

  return (
    <Card className="border-slate-100 shadow-sm overflow-hidden py-0 rounded-lg">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="font-semibold text-slate-600 text-center w-[7%]">
              ID
            </TableHead>
            <TableHead className="font-semibold text-slate-600">
              Patient Name
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
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-32 text-center text-slate-400"
              >
                Loading patient records...
              </TableCell>
            </TableRow>
          ) : !pageItems.length ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-32  text-center text-slate-500"
              >
                No patient records.
              </TableCell>
            </TableRow>
          ) : (
            pageItems.map((patient) => (
              <PatientRow
                key={patient.id ?? `row-${Math.random()}`}
                patient={patient}
              />
            ))
          )}
        </TableBody>
      </Table>

      <PatientTablePagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />
    </Card>
  );
}