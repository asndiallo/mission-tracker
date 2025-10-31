"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

interface Props {
  onComplete: () => void;
  userId: string;
}

export function SeedFinancialDataButton({ onComplete, userId }: Props) {
  const [loading, setLoading] = useState(false);

  async function seedData() {
    setLoading(true);

    // Your actual financial accounts
    const accounts = [
      // Checking
      {
        account_type: "checking",
        institution: "Capital One",
        account_name: "360 Checking",
        current_balance: 0, // Update with your actual balance
        user_id: userId,
      },
      // Savings
      {
        account_type: "savings",
        institution: "Capital One",
        account_name: "360 Savings",
        current_balance: 0, // Update with your actual balance
        interest_rate: 4.25, // Update with actual rate
        user_id: userId,
      },
      {
        account_type: "savings",
        institution: "Apple",
        account_name: "Apple Savings",
        current_balance: 0, // Update with your actual balance
        interest_rate: 4.5, // Update with actual rate
        user_id: userId,
      },
      // Investments
      {
        account_type: "roth_ira",
        institution: "Fidelity",
        account_name: "Roth IRA",
        current_balance: 0, // Update with your actual balance
        user_id: userId,
      },
      {
        account_type: "brokerage",
        institution: "Fidelity",
        account_name: "Brokerage Account",
        current_balance: 0, // Update with your actual balance
        notes: "Needs more funding",
        user_id: userId,
      },
      // Credit Cards
      {
        account_type: "credit_card",
        institution: "Amazon",
        account_name: "Amazon Visa",
        current_balance: 0, // Enter as negative if you have balance (e.g., -500)
        user_id: userId,
      },
      {
        account_type: "credit_card",
        institution: "Capital One",
        account_name: "Quicksilver #1",
        current_balance: 0,
        user_id: userId,
      },
      {
        account_type: "credit_card",
        institution: "Capital One",
        account_name: "Quicksilver #2",
        current_balance: 0,
        user_id: userId,
      },
      {
        account_type: "credit_card",
        institution: "Apple",
        account_name: "Apple Card",
        current_balance: 0,
        user_id: userId,
      },
      // Car Loan
      {
        account_type: "loan",
        institution: "Auto Lender",
        account_name: "Mazda 6 2015 Loan",
        current_balance: -4375.08, // Negative for debt
        interest_rate: 11.5,
        monthly_payment: 252.55,
        notes:
          "Daily interest: $1.38. Need to refinance to SCRA rate ASAP. 135k miles, rebuilt title, $4k down payment.",
        user_id: userId,
      },
    ];

    await supabase.from("financial_accounts").insert(accounts);

    // Your car asset
    const assets = [
      {
        asset_type: "vehicle",
        name: "2015 Mazda 6",
        purchase_price: 8375.08, // $4k down + $4375.08 principal
        current_value: 6000, // Estimated - update with actual value
        notes: "135k miles, rebuilt title, $4k down payment",
        user_id: userId,
      },
    ];

    await supabase.from("assets").insert(assets);

    setLoading(false);
    onComplete();
  }

  return (
    <div className="text-center mb-6">
      <Button onClick={seedData} disabled={loading} size="lg">
        {loading ? "Loading financial data..." : "Load My Financial Data"}
      </Button>
      <p className="text-sm text-slate-600 mt-2">
        This will load your accounts: Capital One checking/savings, Apple
        savings, Fidelity Roth IRA/brokerage, credit cards, and car loan
      </p>
    </div>
  );
}
