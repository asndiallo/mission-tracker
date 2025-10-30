'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Milestone, Phase, supabase } from '@/lib/supabase';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  phases: Phase[];
  userId: string;
  editMilestone?: Milestone | null;
}

export function MilestoneDialog({
  open,
  onOpenChange,
  onSuccess,
  phases,
  userId,
  editMilestone,
}: Props) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [phaseId, setPhaseId] = useState<string>('none'); // Changed from '' to 'none'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editMilestone) {
      setTitle(editMilestone.title);
      setDate(editMilestone.date);
      setPhaseId(editMilestone.phase_id || 'none'); // Changed from '' to 'none'
    } else {
      setTitle('');
      setDate('');
      setPhaseId('none'); // Changed from '' to 'none'
    }
  }, [editMilestone, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        title,
        date,
        phase_id: phaseId === 'none' ? null : phaseId, // Convert 'none' back to null
        completed: editMilestone?.completed || false,
      };

      if (editMilestone) {
        const { error } = await supabase
          .from('milestones')
          .update(data)
          .eq('id', editMilestone.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('milestones').insert({
          ...data,
          user_id: userId,
        });

        if (error) throw error;
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving milestone:', error);
      alert('Failed to save milestone');
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
              {editMilestone ? 'Edit Milestone' : 'Create New Milestone'}
            </DialogTitle>
            <DialogDescription>
              {editMilestone
                ? 'Update the milestone details below.'
                : 'Add a key milestone to your mission plan.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="title">Milestone Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Commission as O-1, Buy First Property"
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="phase">Associated Phase (Optional)</Label>
              <Select
                value={phaseId}
                onValueChange={setPhaseId}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="None (standalone milestone)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    None (standalone milestone)
                  </SelectItem>
                  {phases.map((phase) => (
                    <SelectItem key={phase.id} value={phase.id}>
                      {phase.name}
                    </SelectItem>
                  ))}
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
                ? 'Saving...'
                : editMilestone
                ? 'Update Milestone'
                : 'Create Milestone'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
