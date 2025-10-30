'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Progress } from '@/components/ui/progress';
import { Task } from '@/lib/supabase';

interface Props {
  tasks: Task[];
}

export function KeyMetrics({ tasks }: Props) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const completionRate =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Key milestones
  const keyAchievements = [
    { name: 'Prerequisites Complete', target: 31, current: 0, unit: 'credits' },
    { name: 'Properties Owned', target: 4, current: 0, unit: 'properties' },
    { name: 'Years of Service', target: 9, current: 0, unit: 'years' },
    { name: 'Net Worth', target: 500000, current: 0, unit: 'USD' },
  ];

  return (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Overall Progress */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-slate-600">
            Overall Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-2">
            {Math.round(completionRate)}%
          </div>
          <Progress value={completionRate} className="h-2 mb-2" />
          <p className="text-xs text-slate-600">
            {completedTasks} of {totalTasks} tasks complete
          </p>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      {keyAchievements.slice(0, 3).map((achievement, index) => (
        <Card key={index}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">
              {achievement.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {achievement.current}
              <span className="text-lg text-slate-500">
                /{achievement.target}
              </span>
            </div>
            <Progress
              value={(achievement.current / achievement.target) * 100}
              className="h-2 mb-2"
            />
            <p className="text-xs text-slate-600">{achievement.unit}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
