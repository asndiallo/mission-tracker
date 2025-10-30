'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Milestone, Phase, supabase } from '@/lib/supabase';
import { Pencil, Trash2 } from 'lucide-react';
import { daysUntil, formatDate } from '@/lib/utils/dates';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { MilestoneDialog } from './MilestoneDialog';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface Props {
  milestones: Milestone[];
  phases: Phase[];
  onUpdate: () => void;
  userId: string;
}

export function MilestoneList({ milestones, phases, onUpdate, userId }: Props) {
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  async function toggleMilestone(milestoneId: string, completed: boolean) {
    await supabase
      .from('milestones')
      .update({ completed: !completed })
      .eq('id', milestoneId);

    onUpdate();
  }

  async function deleteMilestone(milestoneId: string) {
    if (!confirm('Are you sure you want to delete this milestone?')) return;

    await supabase.from('milestones').delete().eq('id', milestoneId);
    onUpdate();
  }

  function handleEdit(milestone: Milestone) {
    setEditingMilestone(milestone);
    setDialogOpen(true);
  }

  if (milestones.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-slate-500">
          No milestones yet. Create your first milestone to track important
          dates.
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {milestones.map((milestone) => {
          const days = daysUntil(milestone.date);
          const isPast = days < 0;
          const isToday = days === 0;
          const phase = milestone.phase_id
            ? phases.find((p) => p.id === milestone.phase_id)
            : null;

          return (
            <Card
              key={milestone.id}
              className={cn(
                'transition-opacity',
                milestone.completed && 'opacity-60'
              )}
            >
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={milestone.completed}
                    onCheckedChange={() =>
                      toggleMilestone(milestone.id, milestone.completed)
                    }
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        'font-medium wrap-break-word',
                        milestone.completed && 'line-through text-slate-500'
                      )}
                    >
                      {milestone.title}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline">
                        {formatDate(milestone.date)}
                      </Badge>
                      {isToday && (
                        <Badge className="bg-orange-600">Today</Badge>
                      )}
                      {!isPast && !isToday && (
                        <Badge variant="secondary">{days} days away</Badge>
                      )}
                      {isPast && !milestone.completed && (
                        <Badge variant="destructive">Overdue</Badge>
                      )}
                      {phase && (
                        <Badge variant="outline" className="text-xs">
                          {phase.name}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-1 shrink-0">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEdit(milestone)}
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => deleteMilestone(milestone.id)}
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

      <MilestoneDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingMilestone(null);
        }}
        onSuccess={() => {
          onUpdate();
          setDialogOpen(false);
          setEditingMilestone(null);
        }}
        phases={phases}
        userId={userId}
        editMilestone={editingMilestone}
      />
    </>
  );
}
