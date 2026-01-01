"use client";

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter } from 'lucide-react';
import { usePatients } from '@/hooks/use-patients';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function Patients() {
  const { data: patients, isLoading } = usePatients();

  return (
    <DashboardLayout title="Patient Records">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search by name, email, or ID..." 
              className="pl-10 bg-white border-slate-200"
            />
          </div>
          <Button variant="outline" className="border-slate-200 bg-white text-slate-600">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Patient
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-106.25">
            <DialogHeader>
              <DialogTitle>Add New Patient</DialogTitle>
              <DialogDescription>
                Enter the patient&apos;s details to create a new record.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" placeholder="John Doe" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" placeholder="john@example.com" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="age" className="text-right">Age</Label>
                <Input id="age" type="number" placeholder="30" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-blue-600">Create Record</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-slate-100 shadow-sm overflow-hidden py-0">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-semibold text-slate-600">Patient Name</TableHead>
              <TableHead className="font-semibold text-slate-600">Patient ID</TableHead>
              <TableHead className="font-semibold text-slate-600">Last Visit</TableHead>
              <TableHead className="font-semibold text-slate-600">Risk Profile</TableHead>
              <TableHead className="font-semibold text-slate-600">Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-slate-400">
                  Loading patient records...
                </TableCell>
              </TableRow>
            ) : (
              patients.map((patient) => (
                <TableRow key={patient.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell>
                    <div className="flex items-center">
                      <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs mr-3">
                        {patient.name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{patient.name}</div>
                        <div className="text-xs text-slate-500">{patient.age} yrs • {patient.gender}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium text-slate-900">#{patient.id.toString().padStart(4, '0')}</div>
                  </TableCell>
                  <TableCell className="text-slate-600 text-sm">
                    {new Date(patient.lastVisit!).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <RiskBadge risk={patient.riskProfile} />
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs font-normal bg-green-50 text-green-700 border-green-200">
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Link href={`/patients/${patient.id}`}>
                      <Button variant="outline" size="sm" className="bg-white border-slate-200 text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer">
                        View Details
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </DashboardLayout>
  );
}

function RiskBadge({ risk }: { risk: string | null }) {
  if (!risk) return null;
  
  const styles: any = {
    High: "bg-red-50 text-red-700 border-red-200",
    Moderate: "bg-amber-50 text-amber-700 border-amber-200",
    Low: "bg-blue-50 text-blue-700 border-blue-200",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[risk] || styles.Low}`}>
      {risk} Risk
    </span>
  );
}
