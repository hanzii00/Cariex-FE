import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ClinicalNotesCard({ patient, scans }: { patient: any; scans: any[] }) {
  const notes = scans?.[0]?.notes || "No clinical notes available.";

  return (
    <Card className="border-slate-100 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Clinical Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-sm text-amber-900 flex items-start">
          <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
          {notes}
        </div>
      </CardContent>
    </Card>
  );
}