"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { RiskBadge } from "./RiskBadge";
import { calculateAge } from "@/lib/utils";
import { useState } from "react";
import { createPortal } from "react-dom";

export function PatientRow({ patient }: { patient: any }) {
  const router = useRouter();

  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [hovered, setHovered] = useState(false);

  const name = (
    (patient.full_name as string) ||
    `${patient.first_name || ""} ${patient.last_name || ""}`
  ).trim();

  const initials = name
    ? name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  const lastVisit =
    (patient.lastVisit as string | undefined) ||
    (patient.last_visit as string | undefined) ||
    null;

  const risk =
    (patient.riskProfile as string | undefined) ||
    (patient.risk_profile as string | undefined) ||
    undefined;

  const age =
    calculateAge(patient.date_of_birth || (patient as any).birthDate) ?? patient.age ?? null;

  const go = () => {
    if (patient?.id) router.push(`/patients/${patient.id}`);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLTableRowElement>) => {
    setTooltipPos({ x: e.clientX, y: e.clientY });
  };

  const onMouseEnter = () => setHovered(true);
  const onMouseLeave = () => setHovered(false);

  return (
    <>
      <TableRow
        onClick={go}
        tabIndex={0}
        role="button"
        className="hover:bg-slate-50 transition-colors cursor-pointer relative border-b border-b-slate-200/50"
        onMouseMove={onMouseMove}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <TableCell>
          <div className="text-sm font-medium text-slate-900 text-center">
            {patient.id ?? "—"}
          </div>
        </TableCell>

        <TableCell>
          <div className="flex items-center">
            <div className="h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs mr-4 bg-blue-100 text-blue-600">
              {initials}
            </div>

            <div>
              <div className="font-medium text-slate-900">{name || "—"}</div>
              <div className="text-xs text-slate-500">
                {age ?? "—"} yrs • {patient.gender ?? "—"}
              </div>
            </div>
          </div>
        </TableCell>

        <TableCell className="text-slate-600 text-sm">
          {lastVisit ? (
            new Date(lastVisit).toLocaleDateString()
          ) : (
            <Badge className="text-xs font-normal bg-amber-50 text-amber-700 border-amber-200">
              No last visit
            </Badge>
          )}
        </TableCell>

        <TableCell>
          {risk ? (
            <RiskBadge risk={risk as any} />
          ) : (
            <Badge className="text-xs font-normal bg-green-50 text-green-700 border-green-200">
              Risk-free
            </Badge>
          )}
        </TableCell>

        <TableCell>
          <Badge
            variant="outline"
            className="text-xs font-normal bg-green-50 text-green-700 border-green-200"
          >
            Active
          </Badge>
        </TableCell>
      </TableRow>

      {hovered && tooltipPos && typeof document !== "undefined"
        ? createPortal(
            <div
              style={{
                position: "fixed",
                top: tooltipPos.y + 15,
                left: tooltipPos.x + 10,
                background: "#111827",
                color: "white",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "0.75rem",
                pointerEvents: "none",
                zIndex: 9999,
                whiteSpace: "nowrap",
              }}
            >
              View details
            </div>,
            document.body
          )
        : null}
    </>
  );
}
