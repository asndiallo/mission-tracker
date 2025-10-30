'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Pencil, Trash2 } from 'lucide-react';
import { Phase, supabase } from '@/lib/supabase';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PhaseDialog } from './PhaseDialog';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils/dates';
import { useState } from 'react';

interface Props {
  phases: Phase[];
  selectedPhaseId: string | null;
  onSelectPhase: (id: string | null) => void;
  userId: string;
  onUpdate: () => void;
}

export function PhaseTimeline({
  phases,
  selectedPhaseId,
  onSelectPhase,
  userId,
  onUpdate,
}: Props) {
  const [editingPhase, setEditingPhase] = useState<Phase | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

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

  async function deletePhase(phaseId: string) {
    if (
      !confirm('Are you sure? This will also delete all tasks in this phase.')
    )
      return;

    await supabase.from('phases').delete().eq('id', phaseId);
    onUpdate();
  }

  function handleEdit(phase: Phase, e: React.MouseEvent) {
    e.stopPropagation();
    setEditingPhase(phase);
    setDialogOpen(true);
  }

  return (
    <>
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
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold">{phase.name}</h3>
                    {getStatusBadge(phase.status)}
                  </div>
                  {phase.description && (
                    <p className="text-slate-600 mb-2">{phase.description}</p>
                  )}
                  <p className="text-sm text-slate-500">
                    {formatDate(phase.start_date)} →{' '}
                    {formatDate(phase.end_date)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-1 shrink-0">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => handleEdit(phase, e)}
                    className="h-8 w-8"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePhase(phase.id);
                    }}
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <PhaseDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingPhase(null);
        }}
        onSuccess={() => {
          onUpdate();
          setDialogOpen(false);
          setEditingPhase(null);
        }}
        userId={userId}
        editPhase={editingPhase}
      />
    </>
  );
}
