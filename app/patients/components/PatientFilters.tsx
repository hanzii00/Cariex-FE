"use client";

import { Button } from "@/components/ui/button";

interface PatientFiltersProps {
  open: boolean;
  onClose: () => void;

  minAge?: string;
  maxAge?: string;
  sortBy?: string;
  order?: "asc" | "desc";

  setMinAge: (v: string | undefined) => void;
  setMaxAge: (v: string | undefined) => void;
  setSortBy: (v: string | undefined) => void;
  setOrder: (v: "asc" | "desc" | undefined) => void;

  onApply: () => void;
  onClear: () => void;
}

export function PatientFilters({
  open,
  onClose,
  minAge,
  maxAge,
  sortBy,
  order,
  setMinAge,
  setMaxAge,
  setSortBy,
  setOrder,
  onApply,
  onClear,
}: PatientFiltersProps) {
  if (!open) return null;

  const labelClass = "block text-xs mb-1 text-gray-500";

  return (
    <div className="absolute z-20 mt-2 right-0 w-72 bg-white border rounded-lg shadow p-4">
      <div className="flex gap-5">
        <div className="mb-2">
          <label className={labelClass}>Min Age</label>
          <input
            type="number"
            min={0}
            className="w-full border rounded-md px-3 py-2 text-xs"
            placeholder="e.g. 15"
            value={minAge ?? ""}
            onChange={(e) =>
              setMinAge(e.target.value ? e.target.value : undefined)
            }
          />
        </div>

        <div className="mb-2">
          <label className={labelClass}>Max Age</label>
          <input
            type="number"
            min={0}
            className="w-full border rounded-md px-3 py-2 text-xs"
            placeholder="e.g. 15"
            value={maxAge ?? ""}
            onChange={(e) =>
              setMaxAge(e.target.value ? e.target.value : undefined)
            }
          />
        </div>
      </div>

      <div className="mb-2">
        <label className={labelClass}>Sort By</label>
        <select
          className="w-full border rounded-md px-2 py-2 text-xs"
          value={sortBy ?? ""}
          onChange={(e) => setSortBy(e.target.value || undefined)}
        >
          <option value="">(none)</option>
          <option value="first_name">First name</option>
          <option value="last_name">Last name</option>
          <option value="date_of_birth">Date of birth</option>
          <option value="last_visit">Last visit</option>
        </select>
      </div>

      <div className="mb-2">
        <label className={labelClass}>Order</label>
        <select
          className="w-full border rounded-md px-2 py-2 text-xs"
          value={order ?? ""}
          onChange={(e) =>
            setOrder((e.target.value as "asc" | "desc") || undefined)
          }
        >
          <option value="">(default)</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <div className="flex justify-end gap-2 mt-3">
        <Button
          variant="ghost"
          className="text-xs"
          onClick={() => {
            onClear();
            onClose();
          }}
        >
          Clear
        </Button>

        <Button
          className="text-xs"
          onClick={() => {
            onApply();
            onClose();
          }}
        >
          Apply
        </Button>
      </div>
    </div>
  );
}
