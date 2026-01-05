import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./PatientHelpers";
import { EditRecordDialog } from "./EditRecordDialog";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";

export function ScansGrid({ scans, loading, onRefresh }: { scans: any[]; loading: boolean; onRefresh?: () => void }) {
  if (loading) return <p className="text-slate-500">Loading scans...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800">Imaging History</h3>
        <Link href="/upload">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 hover:cursor-pointer">
            Upload New Scan
          </Button>
        </Link>
      </div>

      {(!scans || scans.length === 0) ? (
        <div className="text-center text-slate-500 py-8 bg-slate-50 rounded-lg border border-dashed">
          No scans recorded yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scans.map((scan) => (
            <div key={scan.id} className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all overflow-hidden relative">
              <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
                <EditRecordDialog record={scan} onSaved={() => onRefresh && onRefresh()} onDeleted={() => onRefresh && onRefresh()} />

                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="ghost">Delete</Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete record</DialogTitle>
                    </DialogHeader>

                    <DialogFooter>
                      <div className="flex gap-2 w-full justify-end">
                        <Button variant="outline">Cancel</Button>
                        <Button variant="destructive" onClick={async (e) => {
                          e?.preventDefault();
                          e?.stopPropagation();
                          try {
                            const { deleteRecord } = await import('@/services/record.service');
                            await deleteRecord(scan.id);
                            if (onRefresh) onRefresh();
                          } catch (err) {
                            console.error(err);
                            toast.error('Failed to delete record');
                          }
                        }}>Delete</Button>
                      </div>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

              </div>

              <div className="relative h-48 bg-slate-100">
                <Image
                  src={scan.imageUrl}
                  alt={scan.type}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-white/90 backdrop-blur-sm">{scan.type}</Badge>
                </div>
              </div>

              <Link href={scan.status === "analyzed" ? `/analysis/${scan.id}` : `#`} className="block">
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
          ))}
        </div>
      )}
    </div>
  );
}