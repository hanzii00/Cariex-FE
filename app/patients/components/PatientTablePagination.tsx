"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PatientTablePaginationProps {
  page: number;
  pageSize: number;
  total: number;

  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function PatientTablePagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: PatientTablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;

  return (
    <div className="flex items-center justify-between -mt-6 py-3 px-5 border-t bg-white">
      <div className="flex items-center gap-3">
        <div className="text-xs text-slate-600">Rows per page</div>
        <Select
          value={String(pageSize)}
          onValueChange={(v) => onPageSizeChange(Number(v))}
        >
          <SelectTrigger className="w-20 bg-white border-slate-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent >
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="15">15</SelectItem>
            <SelectItem value="20">20</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-xs text-slate-600">
          {Math.min(start + 1, total)}–
          {Math.min(start + pageSize, total)} of {total}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
        >
          <ChevronLeft />
        </Button>

        <div className="text-xs font-medium text-slate-700">
          Page {page} / {totalPages}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}