'use client';

import { Card, CardContent } from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import { Phase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils/dates';

interface Props {
  phases: Phase[];
  selectedPhaseId: string | null;
  onSelectPhase: (id: string | null) => void;
}

export function PhaseTimeline({
  phases,
  selectedPhaseId,
  onSelectPhase,
}: Props) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'bg-green-500';
      case 'active':
        return 'bg-blue-500';
      default:
        return 'bg-slate-300';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'complete':
        return <Badge className="bg-green-600">Complete</Badge>;
      case 'active':
        return <Badge className="bg-blue-600">Active</Badge>;
      default:
        return <Badge variant="secondary">Upcoming</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {phases.map((phase, index) => (
        <Card
          key={phase.id}
          className={cn(
            'cursor-pointer transition-all hover:shadow-md',
            selectedPhaseId === phase.id && 'ring-2 ring-blue-500'
          )}
          onClick={() =>
            onSelectPhase(selectedPhaseId === phase.id ? null : phase.id)
          }
        >
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              {/* Phase Number */}
              <div
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0',
                  getStatusColor(phase.status)
                )}
              >
                {index}
              </div>

              {/* Phase Info */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold">{phase.name}</h3>
                  {getStatusBadge(phase.status)}
                </div>
                <p className="text-slate-600 mb-2">{phase.description}</p>
                <p className="text-sm text-slate-500">
                  {formatDate(phase.start_date)} → {formatDate(phase.end_date)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
