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

export default function Patients() {
  const router = useRouter();
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [filterOpen, setFilterOpen] = useState(false);
  const [minAge, setMinAge] = useState<string | undefined>(undefined);
  const [maxAge, setMaxAge] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [order, setOrder] = useState<'asc' | 'desc' | undefined>(undefined);

  const load = async (params?: {
    search?: string;
    min_age?: number;
    max_age?: number;
    sort_by?: string;
    order?: 'asc' | 'desc';
  }) => {
    setIsLoading(true);
    try {
      const data = await fetchPatients(params);
      setPatients(data || []);
    } catch (err: any) {
      console.error("Failed to load patients", err);
      const msg = err?.message || "Failed to load patients";
      if (msg.toLowerCase().includes("token") || msg.toLowerCase().includes("please sign in")) {
        toast.error("Session expired — please sign in again.");
        router.push('/authentication');
      } else {
        toast.error(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load().catch((err: any) => {
      console.error("Failed to load patients ", err);
      const msg = err?.message || "Failed to load patients";
      if (msg.toLowerCase().includes("token") || msg.toLowerCase().includes("please sign in")) {
        toast.error("Session expired — please sign in again.");
        router.push('/authentication');
      } else {
        toast.error(msg);
      }
    });
  }, []);

  return (
    <DashboardLayout title="Patient Records">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <input
              placeholder="Search by name, email, or ID..."
              className="pl-10 bg-white border-slate-200 h-10 rounded w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  load({ search });
                }
              }}
            />
          </div>

          <Button
            variant="outline"
            className="border-slate-200 bg-white text-slate-600"
            onClick={() => load({ search })}
          >
            Search
          </Button>

          <div className="relative">
            <Button
              variant="outline"
              className="border-slate-200 bg-white text-slate-600 ml-2"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              Filters
            </Button>

            {filterOpen && (
              <div className="absolute z-20 mt-2 right-0 w-72 bg-white border rounded shadow p-4">
                <div className="mb-2">
                  <label className="block text-sm mb-1">Min Age</label>
                  <input
                    type="number"
                    min={0}
                    className="w-full border rounded px-2 py-1"
                    value={minAge ?? ""}
                    onChange={(e) => setMinAge(e.target.value ? String(e.target.value) : undefined)}
                  />
                </div>

                <div className="mb-2">
                  <label className="block text-sm mb-1">Max Age</label>
                  <input
                    type="number"
                    min={0}
                    className="w-full border rounded px-2 py-1"
                    value={maxAge ?? ""}
                    onChange={(e) => setMaxAge(e.target.value ? String(e.target.value) : undefined)}
                  />
                </div>

                <div className="mb-2">
                  <label className="block text-sm mb-1">Sort By</label>
                  <select className="w-full border rounded px-2 py-1" value={sortBy ?? ""} onChange={(e) => setSortBy(e.target.value || undefined)}>
                    <option value="">(none)</option>
                    <option value="first_name">First name</option>
                    <option value="last_name">Last name</option>
                    <option value="date_of_birth">Date of birth</option>
                    <option value="last_visit">Last visit</option>
                  </select>
                </div>

                <div className="mb-2">
                  <label className="block text-sm mb-1">Order</label>
                  <select className="w-full border rounded px-2 py-1" value={order ?? ""} onChange={(e) => setOrder((e.target.value as 'asc' | 'desc') || undefined)}>
                    <option value="">(default)</option>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 mt-3">
                  <Button variant="ghost" onClick={() => {
                    setMinAge(undefined);
                    setMaxAge(undefined);
                    setSortBy(undefined);
                    setOrder(undefined);
                    load({ search });
                    setFilterOpen(false);
                  }}>Clear</Button>

                  <Button onClick={() => {
                    load({
                      search,
                      min_age: minAge ? Number(minAge) : undefined,
                      max_age: maxAge ? Number(maxAge) : undefined,
                      sort_by: sortBy,
                      order: order,
                    });
                    setFilterOpen(false);
                  }}>Apply</Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <NewPatientDialog onCreate={() => load({ search, min_age: minAge ? Number(minAge) : undefined, max_age: maxAge ? Number(maxAge) : undefined, sort_by: sortBy, order })}>
          <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 text-white">
            New Patient
          </Button>
        </NewPatientDialog>
      </div>

      <PatientTable patients={patients} isLoading={isLoading} />
    </DashboardLayout>
  );
}