"use client";

import { Calendar, CheckCircle2, ChevronRight, Target, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Milestone, Phase, Task } from "@/lib/supabase";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils/dates";

interface NextAction {
  type: "task" | "milestone";
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  phaseName?: string;
  priority: "urgent" | "high" | "normal";
  daysUntilDue?: number;
}

interface TodayNextStepProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  milestones: Milestone[];
  phases: Phase[];
  onTaskComplete: (taskId: string) => void;
  onMilestoneComplete: (milestoneId: string) => void;
}

export function TodayNextStep({
  isOpen,
  onClose,
  tasks,
  milestones,
  phases,
  onTaskComplete,
  onMilestoneComplete,
}: TodayNextStepProps) {
  const [nextAction, setNextAction] = useState<NextAction | null>(null);

  useEffect(() => {
    if (isOpen) {
      const action = selectNextAction(tasks, milestones, phases);
      setNextAction(action);
    }
  }, [isOpen, tasks, milestones, phases]);

  const selectNextAction = (
    tasks: Task[],
    milestones: Milestone[],
    phases: Phase[],
  ): NextAction | null => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get incomplete tasks and milestones
    const incompleteTasks = tasks.filter((t) => !t.completed);
    const incompleteMilestones = milestones.filter((m) => !m.completed);

    // Create a map of phase IDs to phase names
    const phaseMap = new Map(phases.map((p) => [p.id, p.name]));

    // Score and sort tasks
    const scoredTasks = incompleteTasks.map((task) => {
      let score = 0;
      let daysUntilDue: number | undefined;
      let priority: "urgent" | "high" | "normal" = "normal";

      if (task.due_date) {
        const dueDate = new Date(task.due_date);
        dueDate.setHours(0, 0, 0, 0);
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        daysUntilDue = diffDays;

        // Urgent: overdue or due today
        if (diffDays <= 0) {
          score = 1000 - diffDays; // Higher score for more overdue
          priority = "urgent";
        }
        // High: due within 3 days
        else if (diffDays <= 3) {
          score = 500 + (3 - diffDays) * 100;
          priority = "high";
        }
        // Normal: due within a week
        else if (diffDays <= 7) {
          score = 300 + (7 - diffDays) * 10;
          priority = "high";
        }
        // Future tasks
        else {
          score = 100 - Math.min(diffDays, 100);
        }
      } else {
        // No due date - lower priority
        score = 50;
      }

      return {
        type: "task" as const,
        id: task.id,
        title: task.title,
        description: task.notes || undefined,
        dueDate: task.due_date || undefined,
        phaseName: task.phase_id ? phaseMap.get(task.phase_id) : undefined,
        priority,
        daysUntilDue,
        score,
      };
    });

    // Score and sort milestones
    const scoredMilestones = incompleteMilestones.map((milestone) => {
      const milestoneDate = new Date(milestone.date);
      milestoneDate.setHours(0, 0, 0, 0);
      const diffTime = milestoneDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let score = 0;
      let priority: "urgent" | "high" | "normal" = "normal";

      // Milestones are important - weight them higher
      if (diffDays <= 0) {
        score = 1100 - diffDays;
        priority = "urgent";
      } else if (diffDays <= 7) {
        score = 600 + (7 - diffDays) * 50;
        priority = "high";
      } else if (diffDays <= 14) {
        score = 400 + (14 - diffDays) * 10;
        priority = "high";
      } else {
        score = 200 - Math.min(diffDays, 100);
      }

      return {
        type: "milestone" as const,
        id: milestone.id,
        title: milestone.title,
        dueDate: milestone.date,
        phaseName: milestone.phase_id
          ? phaseMap.get(milestone.phase_id)
          : undefined,
        priority,
        daysUntilDue: diffDays,
        score,
      };
    });

    // Combine and sort by score
    const allActions = [...scoredTasks, ...scoredMilestones].sort(
      (a, b) => b.score - a.score,
    );

    return allActions.length > 0 ? allActions[0] : null;
  };

  const handleComplete = () => {
    if (!nextAction) return;

    if (nextAction.type === "task") {
      onTaskComplete(nextAction.id);
    } else {
      onMilestoneComplete(nextAction.id);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-4 min-h-11 min-w-11 touch-manipulation"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
          <CardTitle className="text-xl sm:text-2xl flex items-center gap-2 pr-12">
            <Target className="h-6 w-6 text-primary shrink-0" />
            Today → Next Step
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!nextAction ? (
            <div className="text-center py-8">
              <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-green-500" />
              <h3 className="text-xl font-semibold mb-2">All caught up!</h3>
              <p className="text-muted-foreground">
                You have no pending tasks or milestones. Great work!
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant={
                          nextAction.priority === "urgent"
                            ? "destructive"
                            : nextAction.priority === "high"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {nextAction.priority === "urgent"
                          ? "🔥 URGENT"
                          : nextAction.priority === "high"
                            ? "⚡ High Priority"
                            : "📌 Normal"}
                      </Badge>
                      <Badge variant="outline">
                        {nextAction.type === "task" ? "Task" : "Milestone"}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold mb-2">
                        {nextAction.title}
                      </h3>
                      {nextAction.description && (
                        <p className="text-muted-foreground">
                          {nextAction.description}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 text-sm">
                      {nextAction.phaseName && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <ChevronRight className="h-4 w-4" />
                          <span>Phase: {nextAction.phaseName}</span>
                        </div>
                      )}
                      {nextAction.dueDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            Due: {formatDate(nextAction.dueDate)}
                          </span>
                          {nextAction.daysUntilDue !== undefined && (
                            <span
                              className={
                                nextAction.daysUntilDue <= 0
                                  ? "text-destructive font-semibold"
                                  : nextAction.daysUntilDue <= 3
                                    ? "text-orange-500 font-semibold"
                                    : "text-muted-foreground"
                              }
                            >
                              {nextAction.daysUntilDue <= 0
                                ? nextAction.daysUntilDue === 0
                                  ? "(Today!)"
                                  : `(${Math.abs(
                                      nextAction.daysUntilDue,
                                    )} days overdue)`
                                : `(in ${nextAction.daysUntilDue} days)`}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t flex-col sm:flex-row">
                <Button
                  onClick={handleComplete}
                  className="flex-1 min-h-12 touch-manipulation"
                  size="lg"
                >
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Mark Complete
                </Button>
                <Button
                  onClick={onClose}
                  variant="outline"
                  size="lg"
                  className="min-h-12 touch-manipulation"
                >
                  View All
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
