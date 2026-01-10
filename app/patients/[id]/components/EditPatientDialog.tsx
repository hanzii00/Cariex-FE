"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/components/ui/sonner";

export function EditPatientDialog({
  patient,
  onUpdate,
  onDialogOpen,
}: {
  patient: any;
  onUpdate?: () => void;
  onDialogOpen?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState(patient.first_name || "");
  const [lastName, setLastName] = useState(patient.last_name || "");
  const [email, setEmail] = useState(patient.email || "");
  const [phone, setPhone] = useState(patient.phone || "");
  const [dateOfBirth, setDateOfBirth] = useState(patient.date_of_birth || "");
  const [gender, setGender] = useState(patient.gender || "O");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { updatePatient } = await import("@/services/patient.service");
      await updatePatient(patient.id, {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        date_of_birth: dateOfBirth,
        gender,
        email: email?.trim() || undefined,
        phone: phone?.trim() || undefined,
      });

      toast.success("Patient updated.");
      setOpen(false);
      if (onUpdate) onUpdate();
    } catch (err: any) {
      const msg = err?.message || "Failed to update patient.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen && onDialogOpen) {
      onDialogOpen();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="justify-start w-full text-left text-sm hover:cursor-pointer"
        >
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Patient</DialogTitle>
            <DialogDescription>
              Update the patient's information.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4 my-2">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-left">First Name</Label>
              <Input
                className="col-span-3"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-left">Last Name</Label>
              <Input
                className="col-span-3"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-left">Email</Label>
              <Input
                className="col-span-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-left">Phone</Label>
              <Input
                className="col-span-3"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-left">Date of Birth</Label>
              <Input
                className="col-span-3 hover:cursor-pointer"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-left">Gender</Label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="col-span-3 border rounded-md p-2 text-sm hover:cursor-pointer"
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" className="bg-blue-600 w-full hover:cursor-pointer hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
