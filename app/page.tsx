'use client';

import { Milestone, Phase, Task, supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

import { AuthForm } from '@/components/AuthForm';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { KeyMetrics } from '@/components/KeyMetrics';
import { MilestoneList } from '@/components/MilestoneList';
import { PhaseTimeline } from '@/components/PhaseTimeline';
import { Plus } from 'lucide-react';
import { SeedDataButton } from '@/components/SeedDataButton';
import { ShipDateCountdown } from '@/components/ShipDateCountdown';
import { TaskDialog } from '@/components/TaskDialog';
import { TaskList } from '@/components/TaskList';

export default function Home() {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);

  useEffect(() => {
    checkUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadData();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function checkUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      loadData();
    } else {
      setLoading(false);
    }
  }

  async function loadData() {
    setLoading(true);

    const [phasesRes, tasksRes, milestonesRes] = await Promise.all([
      supabase.from('phases').select('*').order('position'),
      supabase.from('tasks').select('*').order('position'),
      supabase.from('milestones').select('*').order('date'),
    ]);

    if (phasesRes.data) setPhases(phasesRes.data);
    if (tasksRes.data) setTasks(tasksRes.data);
    if (milestonesRes.data) setMilestones(milestonesRes.data);

    setLoading(false);
  }

  // Show auth form if not logged in
  if (!user && !loading) {
    return <AuthForm onAuthSuccess={loadData} />;
  }

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const selectedPhaseTasks = selectedPhaseId
    ? tasks.filter((t) => t.phase_id === selectedPhaseId)
    : tasks;

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header with Sign Out */}
      <Header userEmail={user?.email} onSignOut={() => setUser(null)} />

      {/* Ship Date Countdown */}
      <ShipDateCountdown shipDate="2026-02-03" />

      {/* Key Metrics */}
      <KeyMetrics tasks={tasks} />

      {/* Seed Data Button (only show if no phases) */}
      {phases.length === 0 && (
        <div className="mb-6">
          <SeedDataButton onComplete={loadData} userId={user?.id} />
        </div>
      )}

      {/* Phase Timeline */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Mission Phases</h2>
        <PhaseTimeline
          phases={phases}
          selectedPhaseId={selectedPhaseId}
          onSelectPhase={setSelectedPhaseId}
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">
              {selectedPhaseId
                ? `Tasks - ${
                    phases.find((p) => p.id === selectedPhaseId)?.name
                  }`
                : 'All Tasks'}
            </h2>
            <Button onClick={() => setTaskDialogOpen(true)} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Task
            </Button>
          </div>
          <TaskList
            tasks={selectedPhaseTasks}
            phases={phases}
            onUpdate={loadData}
            userId={user?.id}
          />
        </div>

        {/* Milestones */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Key Milestones</h2>
          <MilestoneList
            milestones={milestones}
            phases={phases}
            onUpdate={loadData}
          />
        </div>
      </div>

      {/* Task Creation Dialog */}
      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        onSuccess={loadData}
        phases={phases}
        userId={user?.id}
      />
    </main>
  );
}
