'use client';

import { Milestone, Phase, Task, supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { MilestoneList } from '@/components/MilestoneList';
import { PhaseTimeline } from '@/components/PhaseTimeline';
import { SeedDataButton } from '@/components/SeedDataButton';
import { ShipDateCountdown } from '@/components/ShipDateCountdown';
import { TaskList } from '@/components/TaskList';

export default function Home() {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      // Sign up with a test account (only runs once)
      const { data, error } = await supabase.auth.signUp({
        email: 'assane@missiontracker.dev',
        password: 'MySecurePassword123!',
      });

      if (error && error.message.includes('already registered')) {
        // Account exists, sign in instead
        const { data: signInData } = await supabase.auth.signInWithPassword({
          email: 'assane@missiontracker.dev',
          password: 'MySecurePassword123!',
        });
        setUser(signInData.user);
      } else {
        setUser(data.user);
      }
    } else {
      setUser(user);
    }

    loadData();
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

  const selectedPhaseTasks = selectedPhaseId
    ? tasks.filter((t) => t.phase_id === selectedPhaseId)
    : tasks;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Mission Tracker
        </h1>
        <p className="text-slate-600">
          Assane Diallo - Air Force Aerospace Medic
        </p>
      </div>

      {/* Ship Date Countdown */}
      <ShipDateCountdown shipDate="2026-02-03" />

      {/* Seed Data Button (remove after first use) */}
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
          <h2 className="text-2xl font-semibold mb-4">
            {selectedPhaseId
              ? `Tasks - ${phases.find((p) => p.id === selectedPhaseId)?.name}`
              : 'All Tasks'}
          </h2>
          <TaskList
            tasks={selectedPhaseTasks}
            phases={phases}
            onUpdate={loadData}
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
    </main>
  );
}
