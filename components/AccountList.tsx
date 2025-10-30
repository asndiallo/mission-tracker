'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  CreditCard,
  DollarSign,
  Pencil,
  Trash2,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { FinancialAccount, supabase } from '@/lib/supabase';

import { AccountDialog } from './AccountDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface Props {
  accounts: FinancialAccount[];
  onUpdate: () => void;
  userId: string;
}

export function AccountList({ accounts, onUpdate, userId }: Props) {
  const [editingAccount, setEditingAccount] = useState<FinancialAccount | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  async function deleteAccount(accountId: string) {
    if (!confirm('Are you sure you want to delete this account?')) return;

    await supabase.from('financial_accounts').delete().eq('id', accountId);
    onUpdate();
  }

  function handleEdit(account: FinancialAccount) {
    setEditingAccount(account);
    setDialogOpen(true);
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking':
      case 'savings':
        return <Wallet className="h-5 w-5 text-blue-600" />;
      case 'roth_ira':
      case 'brokerage':
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'credit_card':
        return <CreditCard className="h-5 w-5 text-purple-600" />;
      case 'loan':
        return <DollarSign className="h-5 w-5 text-red-600" />;
      default:
        return <Wallet className="h-5 w-5 text-slate-600" />;
    }
  };

  const getAccountTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      checking: 'Checking',
      savings: 'Savings',
      roth_ira: 'Roth IRA',
      brokerage: 'Brokerage',
      credit_card: 'Credit Card',
      loan: 'Loan',
    };
    return labels[type] || type;
  };

  if (accounts.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-slate-500">
          No accounts yet. Add your first account to start tracking.
        </CardContent>
      </Card>
    );
  }

  // Group accounts by type
  const groupedAccounts = accounts.reduce((acc, account) => {
    if (!acc[account.account_type]) {
      acc[account.account_type] = [];
    }
    acc[account.account_type].push(account);
    return acc;
  }, {} as Record<string, FinancialAccount[]>);

  return (
    <>
      <div className="space-y-4">
        {Object.entries(groupedAccounts).map(([type, typeAccounts]) => (
          <div key={type}>
            <h3 className="text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">
              {getAccountTypeLabel(type)}
            </h3>
            <div className="space-y-2">
              {typeAccounts.map((account) => (
                <Card key={account.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      {getAccountIcon(account.account_type)}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold">
                            {account.account_name}
                          </h4>
                          <span
                            className={`text-lg font-bold ${
                              account.current_balance >= 0
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {formatCurrency(account.current_balance)}
                          </span>
                        </div>

                        <p className="text-sm text-slate-600 mb-2">
                          {account.institution}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {account.interest_rate && (
                            <Badge variant="outline" className="text-xs">
                              {account.interest_rate}% APR
                            </Badge>
                          )}
                          {account.credit_limit && (
                            <Badge variant="outline" className="text-xs">
                              Limit: {formatCurrency(account.credit_limit)}
                            </Badge>
                          )}
                          {account.monthly_payment && (
                            <Badge variant="outline" className="text-xs">
                              Payment: {formatCurrency(account.monthly_payment)}
                              /mo
                            </Badge>
                          )}
                        </div>

                        {account.notes && (
                          <p className="text-xs text-slate-500 mt-2">
                            {account.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-1 shrink-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(account)}
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => deleteAccount(account.id)}
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      <AccountDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingAccount(null);
        }}
        onSuccess={() => {
          onUpdate();
          setDialogOpen(false);
          setEditingAccount(null);
        }}
        userId={userId}
        editAccount={editingAccount}
      />
    </>
  );
}
