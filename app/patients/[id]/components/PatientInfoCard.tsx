"use client";

import { Mail, Phone, Calendar, MoreHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { calculateAge } from "@/lib/utils";
import { InfoRow, RiskBadge } from "./PatientHelpers";
import { EditPatientDialog } from "./EditPatientDialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export function PatientInfoCard({
  patient,
  onUpdate,
}: {
  patient: any;
  onUpdate?: () => void;
}) {
  const router = useRouter();
  const fullName =
    patient.full_name || `${patient.first_name} ${patient.last_name}`;
  const age =
    calculateAge(patient.date_of_birth || patient.birthDate) ??
    patient.age ??
    0;

  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDeleteConfirmed = async () => {
    try {
      const { deletePatient } = await import("@/services/patient.service");
      await deletePatient(patient.id);
      toast.success("Patient deleted.");
      setConfirmOpen(false);
      router.push("/patients");
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete patient.");
    }
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <Card className="border-slate-100 shadow-sm overflow-hidden py-0 relative">
      <div className="h-24 bg-gradient-to-r from-blue-600 to-blue-400 relative">
        <div className="absolute top-3 right-3">
          <div className="relative">
            <Button
              size="sm"
              variant="outline"
              className="p-1 rounded-full hover:cursor-pointer"
              onClick={toggleMenu}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md z-50 flex flex-col">
                <EditPatientDialog
                  patient={patient}
                  onUpdate={onUpdate}
                  onDialogOpen={() => setMenuOpen(true)}
                />

                <Button
                  variant="ghost"
                  className="justify-start w-full text-left text-sm text-red-600 hover:text-red-900 hover:cursor-pointer"
                  onClick={() => {
                    setConfirmOpen(true);
                    setMenuOpen(false);
                  }}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete patient</DialogTitle>
            <DialogDescription>
              Delete this patient? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <div className="flex gap-2 w-full justify-end">
              <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteConfirmed}>
                Delete
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="px-6 pb-6">
        <div className="relative -mt-12 mb-4">
          <div className="h-24 w-24 rounded-full border-4 border-white bg-white shadow-md flex items-center justify-center text-2xl font-bold text-slate-800">
            {fullName
              .trim()
              .split(" ")
              .map((n: any) => n[0])
              .join("")}
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-900">{fullName}</h2>
        <p className="text-sm text-slate-500 mb-4">
          Patient ID: #{patient.id ?? "—"}
        </p>

        <div className="space-y-3 pt-4 border-t border-slate-100">
          <InfoRow icon={<Mail />} value={patient.email || undefined} />
          <InfoRow icon={<Phone />} value={patient.phone || undefined} />
          <InfoRow
            icon={<Calendar />}
            value={
              patient.last_visit
                ? `Last Visit: ${new Date(
                    patient.last_visit
                  ).toLocaleDateString()}`
                : undefined
            }
          />
          <div>
            <RiskBadge risk={age >= 60 ? "High" : "Low"} />
          </div>
        </div>
      </div>
    </Card>
  );
}
