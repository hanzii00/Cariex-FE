"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { fetchPatients } from "@/services/patient.service";
import { Input } from "@/components/ui/input";
import { calculateAge } from "@/lib/utils";

export function PatientSearch() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(0);

  const ref = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    if (debounceRef.current) window.clearTimeout(debounceRef.current);

    debounceRef.current = window.setTimeout(async () => {
      try {
        const res = await fetchPatients({ search: query });
        setResults(res || []);
        setOpen(true);
        setSelected(0);
      } catch {
        setResults([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [query]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = results[selected] || results[0];
      if (item) {
        router.push(`/patients/${item.id}`);
        setQuery("");
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={ref} className="relative w-72 hidden md:block">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Search patients..."
        className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-full"
      />

      {open && (
        <div className="absolute left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg z-50 max-h-72 overflow-auto">
          {loading ? (
            <div className="px-4 py-3 text-sm text-slate-500">Searching...</div>
          ) : results.length ? (
            results.map((r, i) => (
              <div
                key={r.id}
                onClick={() => {
                  router.push(`/patients/${r.id}`);
                  setQuery("");
                  setOpen(false);
                }}
                className={`px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between ${
                  i === selected ? "bg-slate-50" : ""
                }`}
              >
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm bg-blue-100 text-blue-600">
                    {r.first_name
                      .split(" ")
                      .map((n: any) => n[0])
                      .join("")
                      .toUpperCase() +
                      (r.last_name
                        ? r.last_name
                            .split(" ")
                            .map((n: any) => n[0])
                            .join("")
                            .toUpperCase()
                        : "")}
                  </div>

                  <div>
                    <div className="text-sm font-medium text-slate-900">
                      {r.full_name ||
                        `${r.first_name || ""} ${r.last_name || ""}`.trim()}
                    </div>
                    <div className="text-xs text-slate-500">
                      {(() => {
                        const age = calculateAge(r.date_of_birth || r.birthDate) ?? r.age ?? null;
                        return age ?? "—";
                      })()} yrs • {r.gender}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-500">
                  {(r.last_visit &&
                    new Date(r.last_visit).toLocaleDateString()) ||
                    "—"}
                </div>
              </div>
            ))
          ) : (
            <div className="p-2 text-sm text-slate-500">No patients found.</div>
          )}
        </div>
      )}
    </div>
  );
}
