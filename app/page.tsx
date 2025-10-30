'use client';

import { DollarSign, Plus, Target } from 'lucide-react';
import { Milestone, Phase, Task, supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

import { AuthForm } from '@/components/AuthForm';
import { Button } from '@/components/ui/button';
import { FinancialDashboard } from '@/components/FinancialDashboard';
import { Header } from '@/components/Header';
import { KeyMetrics } from '@/components/KeyMetrics';
import { MilestoneList } from '@/components/MilestoneList';
import { PhaseDialog } from '@/components/PhaseDialog';
import { PhaseTimeline } from '@/components/PhaseTimeline';
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
  const [phaseDialogOpen, setPhaseDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'mission' | 'finances'>('mission');

  useEffect(() => {
    checkUser();

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

  if (!user && !loading) {
    return <AuthForm onAuthSuccess={loadData} />;
  }

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
      <Header userEmail={user?.email} onSignOut={() => setUser(null)} />

      {/* Tab Navigation */}
      <div className="mb-6 flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('mission')}
          className={`px-4 py-2 font-medium flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'mission'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Target className="h-4 w-4" />
          Mission Plan
        </button>
        <button
          onClick={() => setActiveTab('finances')}
          className={`px-4 py-2 font-medium flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'finances'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <DollarSign className="h-4 w-4" />
          Finances
        </button>
      </div>

      {/* Mission Plan Tab */}
      {activeTab === 'mission' && (
        <>
          <ShipDateCountdown shipDate="2026-02-03" />
          <KeyMetrics tasks={tasks} />

          {phases.length === 0 && (
            <div className="mb-6">
              <SeedDataButton onComplete={loadData} userId={user?.id} />
            </div>
          )}

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Mission Phases</h2>
              <Button onClick={() => setPhaseDialogOpen(true)} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Phase
              </Button>
            </div>
            <PhaseTimeline
              phases={phases}
              selectedPhaseId={selectedPhaseId}
              onSelectPhase={setSelectedPhaseId}
              userId={user?.id}
              onUpdate={loadData}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

            <div>
              <h2 className="text-2xl font-semibold mb-4">Key Milestones</h2>
              <MilestoneList
                milestones={milestones}
                phases={phases}
                onUpdate={loadData}
              />
            </div>
          </div>

          <TaskDialog
            open={taskDialogOpen}
            onOpenChange={setTaskDialogOpen}
            onSuccess={loadData}
            phases={phases}
            userId={user?.id}
          />

          <PhaseDialog
            open={phaseDialogOpen}
            onOpenChange={setPhaseDialogOpen}
            onSuccess={loadData}
            userId={user?.id}
          />
        </>
      )}

      {/* Finances Tab */}
      {activeTab === 'finances' && <FinancialDashboard userId={user?.id} />}
    </main>
  );
}
