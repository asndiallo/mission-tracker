import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export type Phase = {
  id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string;
  status: "upcoming" | "active" | "complete";
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

export type FinancialAccount = {
  id: string;
  user_id: string;
  account_type:
    | "checking"
    | "savings"
    | "roth_ira"
    | "brokerage"
    | "credit_card"
    | "loan";
  institution: string;
  account_name: string;
  current_balance: number;
  interest_rate: number | null;
  credit_limit: number | null;
  monthly_payment: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type FinancialSnapshot = {
  id: string;
  user_id: string;
  snapshot_date: string;
  total_assets: number;
  total_liabilities: number;
  net_worth: number;
  notes: string | null;
  created_at: string;
};

export type Asset = {
  id: string;
  user_id: string;
  asset_type: "vehicle" | "property" | "other";
  name: string;
  purchase_price: number;
  current_value: number;
  purchase_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};
