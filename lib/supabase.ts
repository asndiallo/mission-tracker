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

export type Envelope = {
  id: string;
  user_id: string;
  name: string;
  color: string;
  allocation_amount: number;
  allocation_period: "monthly" | "biweekly" | "weekly" | "yearly" | "custom";
  allocation_start_date: string;
  allocation_days: number | null;
  carryover_enabled: boolean;
  position: number;
  created_at: string;
  updated_at: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  transaction_date: string;
  clearing_date: string | null;
  description: string;
  merchant: string | null;
  category: string | null;
  transaction_type: "expense" | "income" | "payment" | "transfer";
  amount: number;
  envelope_id: string | null;
  account_id: string | null;
  imported_from: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type CSVImportTemplate = {
  id: string;
  user_id: string;
  bank_name: string;
  template_name: string;
  column_mapping: {
    transaction_date: number;
    clearing_date?: number;
    description: number;
    merchant?: number;
    category?: number;
    amount: number;
    purchaser?: number;
  };
  date_format: string;
  amount_multiplier: number;
  created_at: string;
};

export type BudgetPeriod = {
  id: string;
  user_id: string;
  envelope_id: string;
  period_start: string;
  period_end: string;
  allocated_amount: number;
  spent_amount: number;
  carried_over: number;
  created_at: string;
};
