"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/components/ui/sonner";

export function EditRecordDialog({ record, onSaved, onDeleted }: { record: any; onSaved?: () => void; onDeleted?: () => void }) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState(record.notes || "");
  const [date, setDate] = useState(record.visit_date ? (record.visit_date as string).slice(0, 10) : "");
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { updateRecord } = await import("@/services/record.service");
      await updateRecord(record.id, { notes, visit_date: date });
      toast.success("Record updated.");
      setOpen(false);
      if (onSaved) onSaved();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update record.");
    } finally {
      setIsLoading(false);
    }
  };

  const performDelete = async () => {
    setIsLoading(true);
    try {
      const { deleteRecord } = await import("@/services/record.service");
      await deleteRecord(record.id);
      toast.success("Record deleted.");
      setOpen(false);
      setConfirmDelete(false);
      if (onDeleted) onDeleted();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete record.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">Edit</Button>
      </DialogTrigger>

      <DialogContent>
        <form onSubmit={handleSave}>
          <DialogHeader>
            <DialogTitle>Edit Record</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Date</Label>
              <Input type="date" className="col-span-3" value={date} onChange={(e)=>setDate(e.target.value)} />
            </div>


            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right">Notes</Label>
              <textarea className="col-span-3 border rounded p-2" value={notes} onChange={(e)=>setNotes(e.target.value)} />
            </div>
          </div>

          <DialogFooter>
            <div className="flex gap-2 w-full justify-end">
              <Button type="submit" className="bg-blue-600" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save'}</Button>

              {!confirmDelete ? (
                <Button variant="destructive" onClick={() => setConfirmDelete(true)}>Delete</Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setConfirmDelete(false)} disabled={isLoading}>Cancel</Button>
                  <Button variant="destructive" onClick={performDelete} disabled={isLoading}>{isLoading ? 'Deleting...' : 'Confirm Delete'}</Button>
                </div>
              )}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
