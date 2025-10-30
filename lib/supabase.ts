import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export type Phase = {
  id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string;
  status: 'upcoming' | 'active' | 'complete';
  position: number;
  created_at: string;
  user_id: string;
};

export type Task = {
  id: string;
  phase_id: string;
  title: string;
  completed: boolean;
  due_date: string | null;
  notes: string | null;
  position: number;
  created_at: string;
  user_id: string;
};

export type Milestone = {
  id: string;
  phase_id: string | null;
  title: string;
  date: string;
  completed: boolean;
  created_at: string;
  user_id: string;
};
