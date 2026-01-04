"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter } from "lucide-react";
import { NewPatientDialog } from "./NewPatientDialog";

export function PatientToolbar() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div className="flex items-center space-x-2 w-full md:w-auto">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by name, email, or ID..."
            className="pl-10 bg-white border-slate-200"
          />
        </div>

        <Button
          variant="outline"
          className="border-slate-200 bg-white text-slate-600"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <NewPatientDialog>
        <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 text-white">
          <Plus className="h-4 w-4 mr-2" />
          New Patient
        </Button>
      </NewPatientDialog>
    </div>
  );
}