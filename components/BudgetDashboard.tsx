"use client";

import { Plus, Upload } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Envelope, Transaction } from "@/lib/supabase";
import { supabase } from "@/lib/supabase";
import { formatCurrency, getCurrentPeriod } from "@/lib/utils/envelopes";
import { EnvelopeDialog } from "./EnvelopeDialog";
import { EnvelopeList } from "./EnvelopeList";
import { SpendingCharts } from "./SpendingCharts";
import { TransactionImport } from "./TransactionImport";
import { TransactionTable } from "./TransactionTable";

interface Props {
  userId: string;
}

export function BudgetDashboard({ userId }: Props) {
  const [envelopes, setEnvelopes] = useState<Envelope[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [envelopeDialogOpen, setEnvelopeDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [activeView, setActiveView] = useState<"overview" | "transactions">(
    "overview",
  );

  const loadData = useCallback(async () => {
    setLoading(true);

    const [envelopesRes, transactionsRes] = await Promise.all([
      supabase.from("envelopes").select("*").order("position"),
      supabase
        .from("transactions")
        .select("*")
        .order("transaction_date", { ascending: false }),
    ]);

    if (envelopesRes.data) setEnvelopes(envelopesRes.data);
    if (transactionsRes.data) setTransactions(transactionsRes.data);

    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Calculate summary statistics
  const currentMonthStart = new Date();
  currentMonthStart.setDate(1);
  currentMonthStart.setHours(0, 0, 0, 0);

  const currentMonthEnd = new Date();
  currentMonthEnd.setMonth(currentMonthEnd.getMonth() + 1);
  currentMonthEnd.setDate(0);
  currentMonthEnd.setHours(23, 59, 59, 999);

  const currentMonthTransactions = transactions.filter((t) => {
    const date = new Date(t.transaction_date);
    return date >= currentMonthStart && date <= currentMonthEnd;
  });

  const totalBudgeted = envelopes.reduce((sum, e) => {
    // Calculate monthly equivalent for comparison
    const period = getCurrentPeriod(e);
    const periodDays =
      (period.end.getTime() - period.start.getTime()) / (1000 * 60 * 60 * 24);
    const monthlyEquivalent = (e.allocation_amount / periodDays) * 30;
    return sum + monthlyEquivalent;
  }, 0);

  const totalSpent = currentMonthTransactions
    .filter((t) => t.transaction_type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = currentMonthTransactions
    .filter((t) => t.transaction_type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const unassignedTransactions = transactions.filter((t) => !t.envelope_id);

  if (loading) {
    return <div className="text-center py-8">Loading budget data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Budgeted (Monthly)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalBudgeted)}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Across {envelopes.length} envelopes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Spent This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalSpent)}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {currentMonthTransactions.filter((t) => t.amount > 0).length}{" "}
              transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Income This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalIncome)}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {currentMonthTransactions.filter((t) => t.amount < 0).length}{" "}
              deposits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Remaining Budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                totalBudgeted - totalSpent >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {formatCurrency(totalBudgeted - totalSpent)}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {totalSpent > 0
                ? `${Math.round((totalSpent / totalBudgeted) * 100)}% used`
                : "No spending yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center">
        <div className="flex gap-2">
          <Button
            onClick={() => setActiveView("overview")}
            variant={activeView === "overview" ? "default" : "outline"}
          >
            Overview
          </Button>
          <Button
            onClick={() => setActiveView("transactions")}
            variant={activeView === "transactions" ? "default" : "outline"}
          >
            Transactions ({transactions.length})
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setImportDialogOpen(true)}
            variant="outline"
            size="sm"
          >
            <Upload className="h-4 w-4 mr-1" />
            Import CSV
          </Button>
          <Button onClick={() => setEnvelopeDialogOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            New Envelope
          </Button>
        </div>
      </div>

      {/* Unassigned Transactions Alert */}
      {unassignedTransactions.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm font-medium text-amber-900">
            {unassignedTransactions.length} unassigned transaction
            {unassignedTransactions.length !== 1 ? "s" : ""}
          </p>
          <p className="text-xs text-amber-700 mt-1">
            Assign transactions to envelopes for accurate budget tracking.
          </p>
        </div>
      )}

      {/* Overview View */}
      {activeView === "overview" && (
        <>
          {/* Envelopes Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Budget Envelopes</h2>
            {envelopes.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-slate-600 mb-4">
                  No budget envelopes yet. Create your first envelope to start
                  tracking spending.
                </p>
                <Button onClick={() => setEnvelopeDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Envelope
                </Button>
              </Card>
            ) : (
              <EnvelopeList
                envelopes={envelopes}
                transactions={transactions}
                onUpdate={loadData}
                userId={userId}
              />
            )}
          </div>

          {/* Charts Section */}
          {envelopes.length > 0 && transactions.length > 0 && (
            <SpendingCharts envelopes={envelopes} transactions={transactions} />
          )}
        </>
      )}

      {/* Transactions View */}
      {activeView === "transactions" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Transaction History</h2>
          <TransactionTable
            transactions={transactions}
            envelopes={envelopes}
            onUpdate={loadData}
            userId={userId}
          />
        </div>
      )}

      {/* Dialogs */}
      <EnvelopeDialog
        open={envelopeDialogOpen}
        onOpenChange={setEnvelopeDialogOpen}
        onSuccess={loadData}
        userId={userId}
        existingEnvelopes={envelopes}
      />

      <TransactionImport
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onSuccess={loadData}
        userId={userId}
        envelopes={envelopes}
      />
    </div>
  );
}
