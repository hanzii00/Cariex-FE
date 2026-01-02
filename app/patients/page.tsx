"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { usePatients } from "@/hooks/use-patients";
import { PatientToolbar } from "./components/PatientToolbar";
import { PatientTable } from "./components/PatientTable";

export default function Patients() {
  const { data: patients = [], isLoading } = usePatients();

  return (
    <DashboardLayout title="Patient Records">
      <PatientToolbar />
      <PatientTable patients={patients} isLoading={isLoading} />
    </DashboardLayout>
  );
}