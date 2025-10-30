'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Phase, Task, supabase } from '@/lib/supabase';

import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils/dates';

interface Props {
  tasks: Task[];
  phases: Phase[];
  onUpdate: () => void;
}

export function TaskList({ tasks, phases, onUpdate }: Props) {
  async function toggleTask(taskId: string, completed: boolean) {
    await supabase
      .from('tasks')
      .update({ completed: !completed })
      .eq('id', taskId);

    onUpdate();
  }

  const getPhaseColor = (phaseId: string) => {
    const phase = phases.find((p) => p.id === phaseId);
    switch (phase?.status) {
      case 'complete':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-slate-500">
          No tasks yet. Add your first task to get started.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => {
        const phase = phases.find((p) => p.id === task.phase_id);

        return (
          <Card
            key={task.id}
            className={cn('transition-opacity', task.completed && 'opacity-60')}
          >
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id, task.completed)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <p
                    className={cn(
                      'font-medium',
                      task.completed && 'line-through text-slate-500'
                    )}
                  >
                    {task.title}
                  </p>
                  {task.notes && (
                    <p className="text-sm text-slate-600 mt-1">{task.notes}</p>
                  )}
                  <div className="flex gap-2 mt-2">
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
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
