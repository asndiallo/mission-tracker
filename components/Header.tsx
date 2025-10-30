'use client';

import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

interface Props {
  userEmail: string | undefined;
  onSignOut: () => void;
}

export function Header({ userEmail, onSignOut }: Props) {
  async function handleSignOut() {
    await supabase.auth.signOut();
    onSignOut();
  }

  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Mission Tracker
        </h1>
        <p className="text-slate-600">
          Assane Diallo - Air Force Aerospace Medic → Nurse Corps Officer → CRNA
        </p>
      </div>
      <div className="flex items-center gap-4">
        {userEmail && (
          <span className="text-sm text-slate-600">{userEmail}</span>
        )}
        <Button onClick={handleSignOut} variant="outline" size="sm">
          Sign Out
        </Button>
      </div>
    </div>
  );
}
