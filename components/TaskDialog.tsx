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
import { type Phase, supabase, type Task } from "@/lib/supabase";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  phases: Phase[];
  userId: string;
  editTask?: Task | null;
}

export function TaskDialog({
  open,
  onOpenChange,
  onSuccess,
  phases,
  userId,
  editTask,
}: Props) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [phaseId, setPhaseId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setNotes(editTask.notes || "");
      setPhaseId(editTask.phase_id);
      setDueDate(editTask.due_date || "");
    } else {
      // Reset form when creating new
      setTitle("");
      setNotes("");
      setPhaseId(phases[0]?.id || "");
      setDueDate("");
    }
  }, [editTask, phases]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (editTask) {
        // Update existing task
        const { error } = await supabase
          .from("tasks")
          .update({
            title,
            notes: notes || null,
            phase_id: phaseId,
            due_date: dueDate || null,
          })
          .eq("id", editTask.id);

        if (error) throw error;
      } else {
        // Create new task
        // Get max position for this phase
        const { data: existingTasks } = await supabase
          .from("tasks")
          .select("position")
          .eq("phase_id", phaseId)
          .order("position", { ascending: false })
          .limit(1);

        const maxPosition = existingTasks?.[0]?.position ?? -1;

        const { error } = await supabase.from("tasks").insert({
          title,
          notes: notes || null,
          phase_id: phaseId,
          due_date: dueDate || null,
          position: maxPosition + 1,
          completed: false,
          user_id: userId,
        });

        if (error) throw error;
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving task:", error);
      alert("Failed to save task");
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
              {editTask ? "Edit Task" : "Create New Task"}
            </DialogTitle>
            <DialogDescription>
              {editTask
                ? "Update the task details below."
                : "Add a new task to my mission plan."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Complete Anatomy & Physiology I"
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="phase">Phase *</Label>
              <Select
                value={phaseId}
                onValueChange={setPhaseId}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a phase" />
                </SelectTrigger>
                <SelectContent>
                  {phases.map((phase) => (
                    <SelectItem key={phase.id} value={phase.id}>
                      {phase.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dueDate">Due Date (Optional)</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional details..."
                rows={3}
                disabled={loading}
              />
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
              {loading ? "Saving..." : editTask ? "Update Task" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
