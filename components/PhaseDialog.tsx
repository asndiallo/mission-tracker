"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { type Phase, supabase } from "@/lib/supabase";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  userId: string;
  editPhase?: Phase | null;
}

export function PhaseDialog({
  open,
  onOpenChange,
  onSuccess,
  userId,
  editPhase,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<"upcoming" | "active" | "complete">(
    "upcoming",
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editPhase) {
      setName(editPhase.name);
      setDescription(editPhase.description || "");
      setStartDate(editPhase.start_date);
      setEndDate(editPhase.end_date);
      setStatus(editPhase.status);
    } else {
      setName("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      setStatus("upcoming");
    }
  }, [editPhase, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (editPhase) {
        const { error } = await supabase
          .from("phases")
          .update({
            name,
            description: description || null,
            start_date: startDate,
            end_date: endDate,
            status,
          })
          .eq("id", editPhase.id);

        if (error) throw error;
      } else {
        // Get max position
        const { data: existingPhases } = await supabase
          .from("phases")
          .select("position")
          .order("position", { ascending: false })
          .limit(1);

        const maxPosition = existingPhases?.[0]?.position ?? -1;

        const { error } = await supabase.from("phases").insert({
          name,
          description: description || null,
          start_date: startDate,
          end_date: endDate,
          status,
          position: maxPosition + 1,
          user_id: userId,
        });

        if (error) throw error;
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving phase:", error);
      alert("Failed to save phase");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {editPhase ? "Edit Phase" : "Create New Phase"}
            </DialogTitle>
            <DialogDescription>
              {editPhase
                ? "Update the phase details below."
                : "Add a new phase to your mission plan."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Phase Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Phase 1: BMT"
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this phase..."
                rows={2}
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="status">Status *</Label>
              <Select
                value={status}
                onValueChange={(val: any) => setStatus(val)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="complete">Complete</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : editPhase
                  ? "Update Phase"
                  : "Create Phase"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
