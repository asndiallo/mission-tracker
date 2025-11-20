-- Envelope Budgeting System Migration
-- Creates tables for envelope-based budget tracking with CSV import support

-- Create envelopes table
CREATE TABLE IF NOT EXISTS envelopes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3b82f6',
  allocation_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  allocation_period TEXT NOT NULL DEFAULT 'monthly' CHECK (allocation_period IN ('monthly', 'biweekly', 'weekly', 'yearly', 'custom')),
  allocation_start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  allocation_days INTEGER CHECK (allocation_days > 0),
  carryover_enabled BOOLEAN DEFAULT false,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for user queries
CREATE INDEX idx_envelopes_user_id ON envelopes(user_id);
CREATE INDEX idx_envelopes_position ON envelopes(user_id, position);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_date DATE NOT NULL,
  clearing_date DATE,
  description TEXT NOT NULL,
  merchant TEXT,
  category TEXT,
  transaction_type TEXT NOT NULL DEFAULT 'expense' CHECK (transaction_type IN ('expense', 'income', 'payment', 'transfer')),
  amount DECIMAL(12, 2) NOT NULL,
  envelope_id UUID REFERENCES envelopes(id) ON DELETE SET NULL,
  account_id UUID REFERENCES financial_accounts(id) ON DELETE SET NULL,
  imported_from TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(user_id, transaction_date DESC);
CREATE INDEX idx_transactions_envelope ON transactions(envelope_id, transaction_date);
CREATE INDEX idx_transactions_account ON transactions(account_id, transaction_date);
CREATE INDEX idx_transactions_clearing_date ON transactions(clearing_date);

-- Create CSV import templates table
CREATE TABLE IF NOT EXISTS csv_import_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bank_name TEXT NOT NULL,
  template_name TEXT NOT NULL,
  column_mapping JSONB NOT NULL,
  date_format TEXT DEFAULT 'MM/DD/YYYY',
  amount_multiplier DECIMAL(3, 2) DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, bank_name, template_name)
);

-- Create index for template lookups
CREATE INDEX idx_csv_templates_user_bank ON csv_import_templates(user_id, bank_name);

-- Create budget periods table for historical tracking
CREATE TABLE IF NOT EXISTS budget_periods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  envelope_id UUID NOT NULL REFERENCES envelopes(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  allocated_amount DECIMAL(12, 2) NOT NULL,
  spent_amount DECIMAL(12, 2) DEFAULT 0,
  carried_over DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(envelope_id, period_start)
);

-- Create indexes for period queries
CREATE INDEX idx_budget_periods_envelope ON budget_periods(envelope_id, period_start DESC);
CREATE INDEX idx_budget_periods_user_date ON budget_periods(user_id, period_start DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_envelopes_updated_at
  BEFORE UPDATE ON envelopes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE envelopes ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE csv_import_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_periods ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for envelopes
CREATE POLICY "Users can view their own envelopes"
  ON envelopes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own envelopes"
  ON envelopes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own envelopes"
  ON envelopes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own envelopes"
  ON envelopes FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS policies for transactions
CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions"
  ON transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions"
  ON transactions FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS policies for csv_import_templates
CREATE POLICY "Users can view their own templates"
  ON csv_import_templates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own templates"
  ON csv_import_templates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates"
  ON csv_import_templates FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own templates"
  ON csv_import_templates FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS policies for budget_periods
CREATE POLICY "Users can view their own budget periods"
  ON budget_periods FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own budget periods"
  ON budget_periods FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budget periods"
  ON budget_periods FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own budget periods"
  ON budget_periods FOR DELETE
  USING (auth.uid() = user_id);
