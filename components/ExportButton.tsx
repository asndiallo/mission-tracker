'use client';

import {
  Asset,
  FinancialAccount,
  Milestone,
  Phase,
  Task,
  supabase,
} from '@/lib/supabase';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { generateMissionPlanPDF } from '@/lib/pdf-export';
import { useState } from 'react';

interface Props {
  phases: Phase[];
  tasks: Task[];
  milestones: Milestone[];
  includeFinances?: boolean;
}

export function ExportButton({
  phases,
  tasks,
  milestones,
  includeFinances = false,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);

    try {
      let accounts: FinancialAccount[] | undefined;
      let assets: Asset[] | undefined;

      if (includeFinances) {
        const [accountsRes, assetsRes] = await Promise.all([
          supabase.from('financial_accounts').select('*'),
          supabase.from('assets').select('*'),
        ]);

        accounts = accountsRes.data || undefined;
        assets = assetsRes.data || undefined;
      }

      await generateMissionPlanPDF(phases, tasks, milestones, accounts, assets);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleExport}
      disabled={loading}
      variant="outline"
      size="sm"
    >
      <Download className="h-4 w-4 mr-1" />
      {loading ? 'Generating...' : 'Export to PDF'}
    </Button>
  );
}
