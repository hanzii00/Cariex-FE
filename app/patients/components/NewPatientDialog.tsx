"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ReactNode, useState } from "react";
import { toast } from "@/components/ui/sonner";
import { useRouter } from "next/navigation";

interface Props {
  children: ReactNode;
  onCreate?: () => void;
}

export function NewPatientDialog({ children, onCreate }: Props) {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("O");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const missing: string[] = [];
    if (!firstName.trim()) missing.push("First Name");
    if (!lastName.trim()) missing.push("Last Name");
    if (!dateOfBirth.trim()) missing.push("Date of Birth");
    if (!phone.trim()) missing.push("Phone");
    if (missing.length) {
      toast.error(`Please fill required fields: ${missing.join(", ")}`);
      return;
    }

    setIsLoading(true);
    try {
      const { createPatient } = await import("@/services/patient.service");
      await createPatient({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        date_of_birth: dateOfBirth,
        gender,
        email: email?.trim() || undefined,
        phone: phone.trim(),
      });
      toast.success("Patient created successfully.");
      if (onCreate) onCreate();
    } catch (err: any) {
      if (err?.fields && typeof err.fields === 'object') {
        const messages = Object.entries(err.fields)
          .map(([k, v]) => {
            if (Array.isArray(v)) return `${k}: ${v.join(', ')}`;
            return `${k}: ${String(v)}`;
          })
          .join(' — ');
        toast.error(messages || err?.message || "Failed to create patient.");
      } else {
        const msg = err?.message || "Failed to create patient.";
        toast.error(msg);
        if (msg.toLowerCase().includes("token") || msg.toLowerCase().includes("please sign in")) {
          router.push('/authentication');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-106.25">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Patient</DialogTitle>
            <DialogDescription>
              Enter the patient&apos;s details to create a new record.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                First Name
              </Label>
              <Input id="firstName" placeholder="John" className="col-span-3" value={firstName} onChange={(e)=>setFirstName(e.target.value)} />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Last Name
              </Label>
              <Input id="lastName" placeholder="Doe" className="col-span-3" value={lastName} onChange={(e)=>setLastName(e.target.value)} />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                placeholder="john@example.com"
                className="col-span-3"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                placeholder="0917-123-4567"
                className="col-span-3"
                value={phone}
                onChange={(e)=>setPhone(e.target.value)}
                type="tel"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dob" className="text-right">
                Date of Birth
              </Label>
              <Input
                id="dob"
                type="date"
                className="col-span-3"
                value={dateOfBirth}
                onChange={(e)=>setDateOfBirth(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gender" className="text-right">
                Gender
              </Label>
              <select id="gender" value={gender} onChange={(e)=>setGender(e.target.value)} className="col-span-3 border rounded px-2 py-2">
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" className="bg-blue-600" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Record"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}