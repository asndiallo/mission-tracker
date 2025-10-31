"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { type FinancialAccount, supabase } from "@/lib/supabase";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  userId: string;
  editAccount?: FinancialAccount | null;
}

export function AccountDialog({
  open,
  onOpenChange,
  onSuccess,
  userId,
  editAccount,
}: Props) {
  const [accountType, setAccountType] = useState<string>("checking");
  const [institution, setInstitution] = useState("");
  const [accountName, setAccountName] = useState("");
  const [currentBalance, setCurrentBalance] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [creditLimit, setCreditLimit] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editAccount) {
      setAccountType(editAccount.account_type);
      setInstitution(editAccount.institution);
      setAccountName(editAccount.account_name);
      setCurrentBalance(editAccount.current_balance.toString());
      setInterestRate(editAccount.interest_rate?.toString() || "");
      setCreditLimit(editAccount.credit_limit?.toString() || "");
      setMonthlyPayment(editAccount.monthly_payment?.toString() || "");
      setNotes(editAccount.notes || "");
    } else {
      setAccountType("checking");
      setInstitution("");
      setAccountName("");
      setCurrentBalance("");
      setInterestRate("");
      setCreditLimit("");
      setMonthlyPayment("");
      setNotes("");
    }
  }, [editAccount, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        account_type: accountType,
        institution,
        account_name: accountName,
        current_balance: parseFloat(currentBalance) || 0,
        interest_rate: interestRate ? parseFloat(interestRate) : null,
        credit_limit: creditLimit ? parseFloat(creditLimit) : null,
        monthly_payment: monthlyPayment ? parseFloat(monthlyPayment) : null,
        notes: notes || null,
      };

      if (editAccount) {
        const { error } = await supabase
          .from("financial_accounts")
          .update(data)
          .eq("id", editAccount.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("financial_accounts").insert({
          ...data,
          user_id: userId,
        });

        if (error) throw error;
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving account:", error);
      alert("Failed to save account");
    } finally {
      setLoading(false);
    }
  }

  const showInterestRate = ["savings", "loan"].includes(accountType);
  const showCreditLimit = accountType === "credit_card";
  const showMonthlyPayment = ["loan", "credit_card"].includes(accountType);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {editAccount ? "Edit Account" : "Add New Account"}
            </DialogTitle>
            <DialogDescription>
              {editAccount
                ? "Update your account details."
                : "Add a financial account to track."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="accountType">Account Type *</Label>
              <Select
                value={accountType}
                onValueChange={setAccountType}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checking">Checking</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                  <SelectItem value="roth_ira">Roth IRA</SelectItem>
                  <SelectItem value="brokerage">Brokerage</SelectItem>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="loan">Loan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="institution">Institution *</Label>
              <Input
                id="institution"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="e.g., Capital One, Fidelity"
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="accountName">Account Name *</Label>
              <Input
                id="accountName"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="e.g., 360 Checking, Quicksilver Card"
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="currentBalance">
                Current Balance *{" "}
                {accountType === "credit_card" || accountType === "loan"
                  ? "(enter as negative)"
                  : ""}
              </Label>
              <Input
                id="currentBalance"
                type="number"
                step="0.01"
                value={currentBalance}
                onChange={(e) => setCurrentBalance(e.target.value)}
                placeholder="0.00"
                required
                disabled={loading}
              />
            </div>

            {showInterestRate && (
              <div>
                <Label htmlFor="interestRate">Interest Rate (%) </Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.01"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="0.00"
                  disabled={loading}
                />
              </div>
            )}

            {showCreditLimit && (
              <div>
                <Label htmlFor="creditLimit">Credit Limit</Label>
                <Input
                  id="creditLimit"
                  type="number"
                  step="0.01"
                  value={creditLimit}
                  onChange={(e) => setCreditLimit(e.target.value)}
                  placeholder="0.00"
                  disabled={loading}
                />
              </div>
            )}

            {showMonthlyPayment && (
              <div>
                <Label htmlFor="monthlyPayment">Monthly Payment</Label>
                <Input
                  id="monthlyPayment"
                  type="number"
                  step="0.01"
                  value={monthlyPayment}
                  onChange={(e) => setMonthlyPayment(e.target.value)}
                  placeholder="0.00"
                  disabled={loading}
                />
              </div>
            )}

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional details..."
                rows={2}
                disabled={loading}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : editAccount ? "Update" : "Add Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
