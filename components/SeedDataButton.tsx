'use client';

import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';

interface Props {
  onComplete: () => void;
  userId: string;
}

export function SeedDataButton({ onComplete, userId }: Props) {
  const [loading, setLoading] = useState(false);

  async function seedData() {
    setLoading(true);

    // Your actual mission plan data
    const phases = [
      {
        name: 'Phase 0: Preparation',
        description: 'Ship mentally, physically, and administratively ready',
        start_date: '2024-11-01',
        end_date: '2026-02-02',
        status: 'active',
        position: 0,
        user_id: userId,
      },
      {
        name: 'Phase 1: BMT',
        description: 'Graduate BMT, start citizenship process',
        start_date: '2026-02-03',
        end_date: '2026-03-31',
        status: 'upcoming',
        position: 1,
        user_id: userId,
      },
      {
        name: 'Phase 2: Tech School',
        description: 'Excel in 4N0 tech school, earn college credits',
        start_date: '2026-04-01',
        end_date: '2026-08-31',
        status: 'upcoming',
        position: 2,
        user_id: userId,
      },
      {
        name: 'Phase 3: First Duty Station',
        description:
          'Build stability, start degree, marry, begin wealth foundation',
        start_date: '2026-09-01',
        end_date: '2028-12-31',
        status: 'upcoming',
        position: 3,
        user_id: userId,
      },
      {
        name: 'Phase 4: Growth & Positioning',
        description: 'Finish degree, build real estate, prepare for OTS',
        start_date: '2029-01-01',
        end_date: '2030-12-31',
        status: 'upcoming',
        position: 4,
        user_id: userId,
      },
      {
        name: 'Phase 5: Commissioning & Wealth Expansion',
        description: 'Commission as officer, expand real estate portfolio',
        start_date: '2031-01-01',
        end_date: '2035-12-31',
        status: 'upcoming',
        position: 5,
        user_id: userId,
      },
      {
        name: 'Phase 6: Family & Legacy',
        description: 'Secure family, financial independence, flexibility',
        start_date: '2036-01-01',
        end_date: '2040-12-31',
        status: 'upcoming',
        position: 6,
        user_id: userId,
      },
    ];

    const { data: insertedPhases } = await supabase
      .from('phases')
      .insert(phases)
      .select();

    if (!insertedPhases) return;

    const phase0 = insertedPhases[0];
    const phase1 = insertedPhases[1];
    const phase3 = insertedPhases[3];
    const phase4 = insertedPhases[4];

    // Sample tasks
    const tasks = [
      {
        phase_id: phase0.id,
        title: 'Maintain peak fitness - arrive at BMT in top condition',
        completed: false,
        due_date: '2026-02-02',
        position: 0,
        user_id: userId,
      },
      {
        phase_id: phase0.id,
        title: 'Gather documents (passport, green card) for citizenship',
        completed: false,
        position: 1,
        user_id: userId,
      },
      {
        phase_id: phase0.id,
        title: 'Set expectations with fiancé for next 24 months',
        completed: false,
        position: 2,
        user_id: userId,
      },
      {
        phase_id: phase1.id,
        title: 'Apply for U.S. Citizenship (Form N-400 and N-426)',
        completed: false,
        notes: 'Inform TI and USCIS liaison in first week',
        position: 0,
        user_id: userId,
      },
      {
        phase_id: phase1.id,
        title: 'Graduate BMT with strong evaluations',
        completed: false,
        position: 1,
        user_id: userId,
      },
      {
        phase_id: phase3.id,
        title: 'Get married',
        completed: false,
        due_date: '2026-12-15',
        position: 0,
        user_id: userId,
      },
      {
        phase_id: phase3.id,
        title: "Start Bachelor's in HIM (WGU/UMGC)",
        completed: false,
        notes: 'Use Tuition Assistance - $4,500/year',
        position: 1,
        user_id: userId,
      },
      {
        phase_id: phase3.id,
        title: 'Buy first property with VA loan',
        completed: false,
        due_date: '2028-06-01',
        notes: 'Target duplex/triplex near base',
        position: 2,
        user_id: userId,
      },
      {
        phase_id: phase4.id,
        title: "Complete Bachelor's degree",
        completed: false,
        due_date: '2029-12-31',
        position: 0,
        user_id: userId,
      },
      {
        phase_id: phase4.id,
        title: 'Apply for OTS',
        completed: false,
        notes: 'Target Health Services Officer or Biomedical Admin',
        position: 1,
        user_id: userId,
      },
    ];

    await supabase.from('tasks').insert(tasks);

    // Key milestones
    const milestones = [
      {
        title: 'Ship Date - BMT Begins',
        date: '2026-02-03',
        completed: false,
        phase_id: phase1.id,
        user_id: userId,
      },
      {
        title: 'Wedding Day',
        date: '2026-12-06',
        completed: false,
        phase_id: phase3.id,
        user_id: userId,
      },
      {
        title: '27th Birthday',
        date: '2025-12-06',
        completed: false,
        user_id: userId,
      },
    ];

    await supabase.from('milestones').insert(milestones);
    console.log('🚀 ~ seedData ~ supabase:', supabase);

    setLoading(false);
    onComplete();
  }

  return (
    <Button onClick={seedData} disabled={loading} size="lg">
      {loading ? 'Loading your mission plan...' : 'Load Mission Plan'}
    </Button>
  );
}
