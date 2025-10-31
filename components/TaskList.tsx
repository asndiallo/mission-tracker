"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { type Phase, supabase, type Task } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/dates";
import { TaskDialog } from "./TaskDialog";

interface Props {
  tasks: Task[];
  phases: Phase[];
  onUpdate: () => void;
  userId: string;
}

export function TaskList({ tasks, phases, onUpdate, userId }: Props) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  async function toggleTask(taskId: string, completed: boolean) {
    await supabase
      .from("tasks")
      .update({ completed: !completed })
      .eq("id", taskId);

    onUpdate();
  }

  async function deleteTask(taskId: string) {
    if (!confirm("Are I sure I want to delete this task?")) return;

    await supabase.from("tasks").delete().eq("id", taskId);

    onUpdate();
  }

  function handleEdit(task: Task) {
    setEditingTask(task);
    setDialogOpen(true);
  }

  function handleDialogClose() {
    setDialogOpen(false);
    setEditingTask(null);
  }

  const getPhaseColor = (phaseId: string) => {
    const phase = phases.find((p) => p.id === phaseId);
    switch (phase?.status) {
      case "complete":
        return "bg-green-100 text-green-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-slate-500">
          No tasks yet. Create my first task to get started.
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {tasks.map((task) => {
          const phase = phases.find((p) => p.id === task.phase_id);

          return (
            <Card
              key={task.id}
              className={cn(
                "transition-opacity",
                task.completed && "opacity-60",
              )}
            >
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id, task.completed)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "font-medium wrap-break-word",
                        task.completed && "line-through text-slate-500",
                      )}
                    >
                      {task.title}
                    </p>
                    {task.notes && (
                      <p className="text-sm text-slate-600 mt-1 wrap-break-word">
                        {task.notes}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {phase && (
                        <Badge
                          className={getPhaseColor(task.phase_id)}
                          variant="secondary"
                        >
                          {phase.name}
                        </Badge>
                      )}
                      {task.due_date && (
                        <Badge variant="outline">
                          Due: {formatDate(task.due_date)}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEdit(task)}
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => deleteTask(task.id)}
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingTask(null);
        }}
        onSuccess={() => {
          onUpdate();
          handleDialogClose();
        }}
        phases={phases}
        userId={userId}
        editTask={editingTask}
      />
    </>
  );
}
