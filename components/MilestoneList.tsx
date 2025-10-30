'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Milestone, Phase, supabase } from '@/lib/supabase';
import { daysUntil, formatDate } from '@/lib/utils/dates';

import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface Props {
  milestones: Milestone[];
  phases: Phase[];
  onUpdate: () => void;
}

export function MilestoneList({ milestones, phases, onUpdate }: Props) {
  async function toggleMilestone(milestoneId: string, completed: boolean) {
    await supabase
      .from('milestones')
      .update({ completed: !completed })
      .eq('id', milestoneId);

    onUpdate();
  }

  if (milestones.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-slate-500">
          No milestones yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {milestones.map((milestone) => {
        const days = daysUntil(milestone.date);
        const isPast = days < 0;
        const isToday = days === 0;

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
                <div className="flex-1">
                  <p
                    className={cn(
                      'font-medium',
                      milestone.completed && 'line-through text-slate-500'
                    )}
                  >
                    {milestone.title}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">
                      {formatDate(milestone.date)}
                    </Badge>
                    {isToday && <Badge className="bg-orange-600">Today</Badge>}
                    {!isPast && !isToday && (
                      <Badge variant="secondary">{days} days away</Badge>
                    )}
                    {isPast && !milestone.completed && (
                      <Badge variant="destructive">Overdue</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
