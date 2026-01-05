import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";
import {
  ChevronRight,
  ChevronLeft,
  MoreHorizontal,
  Trash2Icon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./PatientHelpers";
import { EditRecordDialog } from "./EditRecordDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";

export function ScansGrid({
  scans,
  loading,
  onRefresh,
}: {
  scans: any[];
  loading: boolean;
  onRefresh?: () => void;
}) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const totalPages = Math.ceil(scans.length / rowsPerPage);

  const paginatedScans = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return scans.slice(start, start + rowsPerPage);
  }, [scans, page, rowsPerPage]);

  if (loading) return <p className="text-slate-500">Loading scans...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800">Imaging History</h3>
        <Link href="/upload">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            Upload New Scan
          </Button>
        </Link>
      </div>

      {paginatedScans.length === 0 ? (
        <div className="text-center text-slate-500 py-8 bg-slate-50 rounded-lg border border-dashed">
          No scans recorded yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {paginatedScans.map((scan) => (
            <ScanCard key={scan.id} scan={scan} onRefresh={onRefresh} />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setPage(1);
            }}
            className="border rounded-md px-2 py-1 text-sm"
          >
            {[5, 10, 15, 20].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500 mr-5">
              Page {page} of {totalPages}
            </span>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Button
                size="sm"
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ScanCard({ scan, onRefresh }: { scan: any; onRefresh?: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all overflow-hidden relative">
      <div className="absolute top-3 right-3 z-30">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setMenuOpen((prev) => !prev);
          }}
          className="p-1.5 rounded-md hover:bg-white/50 hover:cursor-pointer text-slate-500"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>

        {menuOpen && (
          <div
            className="absolute right-0 mt-1 w-24 rounded-md overflow-hidden border bg-white shadow-lg z-40"
            onClick={(e) => e.stopPropagation()}
          >
            {scan.type !== "Diagnosis" && (
              <div className="px-2 py-1">
                <EditRecordDialog
                  record={scan}
                  onSaved={() => onRefresh && onRefresh()}
                  onDeleted={() => onRefresh && onRefresh()}
                />
              </div>
            )}

            <button
              className="w-full text-left px-3 py-2 text-xs flex items-center text-red-600 hover:bg-red-50 hover:cursor-pointer transition-colors"
              onClick={() => {
                setMenuOpen(false);
                setDeleteOpen(true);
              }}
            >
              <Trash2Icon className="mr-2 h-3 w-3" />
              Delete
            </button>
          </div>
        )}
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete patient record</DialogTitle>
            <p className="text-sm text-slate-500">
              Are you sure you want to delete this diagnostic scan? This action
              cannot be undone.
            </p>
          </DialogHeader>

          <DialogFooter>
            <div className="flex gap-2 w-full justify-end">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>

              <Button
                variant="destructive"
                onClick={async () => {
                  try {
                    if (scan.type === "Diagnosis") {
                      const { deleteDiagnosis } = await import(
                        "@/services/scan.service"
                      );
                      await deleteDiagnosis(scan.id);
                    } else {
                      const { deleteRecord } = await import(
                        "@/services/record.service"
                      );
                      await deleteRecord(scan.id);
                    }

                    toast.success("Deleted successfully");
                    onRefresh?.();
                    setDeleteOpen(false);
                  } catch (err: any) {
                    console.error(err);
                    toast.error(
                      err?.message || "Failed to delete patient record"
                    );
                  }
                }}
              >
                Delete
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="relative h-48 bg-slate-100">
        <Image
          src={scan.imageUrl}
          alt={scan.type}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />
        <div className="absolute top-3 left-3">
          <Badge className="bg-white shadow backdrop-blur-sm text-gray-400">
            {scan.type}
          </Badge>
        </div>
      </div>

      <Link
        href={scan.status === "analyzed" ? `/analysis/${scan.id}` : "#"}
        className="block"
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500">
              {new Date(scan.date!).toLocaleDateString()}
            </span>
            <StatusBadge status={scan.status} />
          </div>
          <h4 className="font-semibold text-slate-900 flex items-center group-hover:text-blue-600 transition-colors">
            Scan #{scan.id}
            <ChevronRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100" />
          </h4>
        </div>
      </Link>
    </div>
  );
}
