"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PatientToolbar } from "./components/PatientToolbar";
import { PatientTable } from "./components/PatientTable";
import { NewPatientDialog } from "./components/NewPatientDialog";
import { fetchPatients } from "@/services/patient.service";
import { Button } from "@/components/ui/button";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { PatientFilters } from "./components/PatientFilters";
import { Filter, Plus, Search, X } from "lucide-react";

export default function Patients() {
  const router = useRouter();
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [filterOpen, setFilterOpen] = useState(false);
  const [minAge, setMinAge] = useState<string | undefined>(undefined);
  const [maxAge, setMaxAge] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [order, setOrder] = useState<"asc" | "desc" | undefined>(undefined);

  const load = async (params?: {
    search?: string;
    min_age?: number;
    max_age?: number;
    sort_by?: string;
    order?: "asc" | "desc";
  }) => {
    setIsLoading(true);
    try {
      const data = await fetchPatients(params);
      setPatients(data || []);
    } catch (err: any) {
      console.error("Failed to load patients", err);
      const msg = err?.message || "Failed to load patients";
      if (
        msg.toLowerCase().includes("token") ||
        msg.toLowerCase().includes("please sign in")
      ) {
        toast.error("Session expired — please sign in again.");
        router.push("/authentication");
      } else {
        toast.error(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load({ search });
  }, [search]);

  useEffect(() => {
    load().catch((err: any) => {
      console.error("Failed to load patients ", err);
      const msg = err?.message || "Failed to load patients";
      if (
        msg.toLowerCase().includes("token") ||
        msg.toLowerCase().includes("please sign in")
      ) {
        toast.error("Session expired — please sign in again.");
        router.push("/authentication");
      } else {
        toast.error(msg);
      }
    });
  }, []);

  useEffect(() => {
    if (search === "") {
      load({});
    }
  }, [search]);

  return (
    <RequireAuth>
      <DashboardLayout title="Patient Records">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <div className="relative w-full md:w-100">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                placeholder="Search by name, email, or ID..."
                className="text-sm pl-10 bg-white border border-slate-200 h-10 rounded-lg w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              {search && (
                <X
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 cursor-pointer hover:text-slate-600"
                  onClick={() => {
                    setSearch("");
                  }}
                />
              )}
            </div>

            <div className="relative">
              <Button
                variant="outline"
                className="border-slate-200 rounded-lg bg-white text-slate-600 focus:bg-white transition-all ml-3 h-10 text-sm"
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <Filter className="mr-1 h-3 w-3" />
                Filters
              </Button>

              <PatientFilters
                open={filterOpen}
                onClose={() => setFilterOpen(false)}
                minAge={minAge}
                maxAge={maxAge}
                sortBy={sortBy}
                order={order}
                setMinAge={setMinAge}
                setMaxAge={setMaxAge}
                setSortBy={setSortBy}
                setOrder={setOrder}
                onClear={() => {
                  setMinAge(undefined);
                  setMaxAge(undefined);
                  setSortBy(undefined);
                  setOrder(undefined);
                  load({ search });
                }}
                onApply={() => {
                  load({
                    search,
                    min_age: minAge ? Number(minAge) : undefined,
                    max_age: maxAge ? Number(maxAge) : undefined,
                    sort_by: sortBy,
                    order,
                  });
                }}
              />
            </div>
          </div>

          <NewPatientDialog
            onCreate={() =>
              load({
                search,
                min_age: minAge ? Number(minAge) : undefined,
                max_age: maxAge ? Number(maxAge) : undefined,
                sort_by: sortBy,
                order,
              })
            }
          >
            <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 text-white hover:cursor-pointer">
              <Plus className="h-4 w-4 mr-2" />
              New Patient
            </Button>
          </NewPatientDialog>
        </div>

        <PatientTable patients={patients} isLoading={isLoading} />
      </DashboardLayout>
    </RequireAuth>
  );
}
