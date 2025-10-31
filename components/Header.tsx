'use client';

import { ExportButton } from '@/components/ExportButton';

import { Button } from '@/components/ui/button';
import {
  type Milestone,
  type Phase,
  supabase,
  type Task,
} from '@/lib/supabase';

interface Props {
  onSignOut: () => void;
  phases: Phase[];
  tasks: Task[];
  milestones: Milestone[];
  activeTab: 'mission' | 'finances' | 'roadmap';
  user: { id: string; email?: string } | null;
}

export function Header({
  onSignOut,
  phases,
  tasks,
  milestones,
  activeTab,
  user,
}: Props) {
  async function handleSignOut() {
    await supabase.auth.signOut();
    onSignOut();
  }

  return (
    <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Mission Tracker
        </h1>
        <p className="text-slate-600">
          Assane Diallo - Air Force Aerospace Medic → Nurse Corps Officer → CRNA
        </p>
      </div>
      <div className="flex items-center gap-3">
        <ExportButton
          phases={phases}
          tasks={tasks}
          milestones={milestones}
          includeFinances={activeTab === 'finances'}
        />
        {user?.email && (
          <span className="text-sm text-slate-600">{user.email}</span>
        )}
        <Button onClick={() => handleSignOut()} variant="outline" size="sm">
          Sign Out
        </Button>
      </div>
    </div>
  );
}
