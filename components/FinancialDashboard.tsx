"use client";

import {
  CreditCard,
  DollarSign,
  Plus,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Asset, FinancialAccount } from "@/lib/supabase";
import { supabase } from "@/lib/supabase";
import { AccountDialog } from "./AccountDialog";
import { AccountList } from "./AccountList";
import { AssetDialog } from "./AssetDialog";
import { AssetList } from "./AssetList";
import { SeedFinancialDataButton } from "./SeedFinancialDataButton";

interface Props {
  userId: string;
}

export function FinancialDashboard({ userId }: Props) {
  const [accounts, setAccounts] = useState<FinancialAccount[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [assetDialogOpen, setAssetDialogOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);

    const [accountsRes, assetsRes] = await Promise.all([
      supabase.from("financial_accounts").select("*").order("account_type"),
      supabase.from("assets").select("*").order("asset_type"),
    ]);

    if (accountsRes.data) setAccounts(accountsRes.data);
    if (assetsRes.data) setAssets(assetsRes.data);

    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Calculate totals
  const checking = accounts
    .filter((a) => a.account_type === "checking")
    .reduce((sum, a) => sum + Number(a.current_balance), 0);

  const savings = accounts
    .filter((a) => a.account_type === "savings")
    .reduce((sum, a) => sum + Number(a.current_balance), 0);

  const investments = accounts
    .filter((a) => ["roth_ira", "brokerage"].includes(a.account_type))
    .reduce((sum, a) => sum + Number(a.current_balance), 0);

  const creditCardDebt = accounts
    .filter((a) => a.account_type === "credit_card")
    .reduce((sum, a) => sum + Math.abs(Number(a.current_balance)), 0);

  const loans = accounts
    .filter((a) => a.account_type === "loan")
    .reduce((sum, a) => sum + Math.abs(Number(a.current_balance)), 0);

  const assetValue = assets.reduce(
    (sum, a) => sum + Number(a.current_value),
    0,
  );

  const totalAssets = checking + savings + investments + assetValue;
  const totalLiabilities = creditCardDebt + loans;
  const netWorth = totalAssets - totalLiabilities;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (loading) {
    return <div className="text-center py-8">Loading financial data...</div>;
  }

  if (accounts.length === 0 && assets.length === 0) {
    return (
      <div>
        <SeedFinancialDataButton onComplete={loadData} userId={userId} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Net Worth
            </CardTitle>
            <DollarSign className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                netWorth >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatCurrency(netWorth)}
            </div>
            <p className="text-xs text-slate-600 mt-1">Assets - Liabilities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Assets
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalAssets)}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Cash + Investments + Assets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Liabilities
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalLiabilities)}
            </div>
            <p className="text-xs text-slate-600 mt-1">Credit Cards + Loans</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Liquid Cash
            </CardTitle>
            <CreditCard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(checking + savings)}
            </div>
            <p className="text-xs text-slate-600 mt-1">Checking + Savings</p>
          </CardContent>
        </Card>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cash Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Checking</span>
              <span className="font-semibold">{formatCurrency(checking)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Savings</span>
              <span className="font-semibold">{formatCurrency(savings)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="text-sm font-semibold">Total Cash</span>
              <span className="font-bold">
                {formatCurrency(checking + savings)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Investments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Roth IRA</span>
              <span className="font-semibold">
                {formatCurrency(
                  accounts
                    .filter((a) => a.account_type === "roth_ira")
                    .reduce((sum, a) => sum + Number(a.current_balance), 0),
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Brokerage</span>
              <span className="font-semibold">
                {formatCurrency(
                  accounts
                    .filter((a) => a.account_type === "brokerage")
                    .reduce((sum, a) => sum + Number(a.current_balance), 0),
                )}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="text-sm font-semibold">Total Investments</span>
              <span className="font-bold">{formatCurrency(investments)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Debt</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Credit Cards</span>
              <span className="font-semibold text-red-600">
                {formatCurrency(creditCardDebt)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Loans</span>
              <span className="font-semibold text-red-600">
                {formatCurrency(loans)}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="text-sm font-semibold">Total Debt</span>
              <span className="font-bold text-red-600">
                {formatCurrency(totalLiabilities)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accounts Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Accounts</h2>
          <Button onClick={() => setAccountDialogOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Account
          </Button>
        </div>
        <AccountList accounts={accounts} onUpdate={loadData} userId={userId} />
      </div>

      {/* Assets Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Assets</h2>
          <Button onClick={() => setAssetDialogOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Asset
          </Button>
        </div>
        <AssetList assets={assets} onUpdate={loadData} userId={userId} />
      </div>

      {/* Dialogs */}
      <AccountDialog
        open={accountDialogOpen}
        onOpenChange={setAccountDialogOpen}
        onSuccess={loadData}
        userId={userId}
      />

      <AssetDialog
        open={assetDialogOpen}
        onOpenChange={setAssetDialogOpen}
        onSuccess={loadData}
        userId={userId}
      />
    </div>
  );
}
