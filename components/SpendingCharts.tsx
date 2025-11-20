"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Envelope, Transaction } from "@/lib/supabase";
import {
  formatCurrency,
  getEnvelopePeriodDetails,
} from "@/lib/utils/envelopes";

interface Props {
  envelopes: Envelope[];
  transactions: Transaction[];
}

export function SpendingCharts({ envelopes, transactions }: Props) {
  const [trendsMode, setTrendsMode] = useState<
    "total" | "envelope" | "category"
  >("total");
  const [_selectedEnvelope, _setSelectedEnvelope] = useState<string>("all");

  // Calculate monthly spending for the last 6 months
  const getMonthlySpending = () => {
    const months: Array<{ month: string; spent: number; income: number }> = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth(),
        1,
      );
      const monthEnd = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth() + 1,
        0,
        23,
        59,
        59,
      );

      const monthTransactions = transactions.filter((t) => {
        const date = new Date(t.transaction_date);
        return date >= monthStart && date <= monthEnd;
      });

      const spent = monthTransactions
        .filter((t) => t.transaction_type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      const income = monthTransactions
        .filter((t) => t.transaction_type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

      months.push({
        month: monthDate.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        spent,
        income,
      });
    }

    return months;
  };

  // Calculate category breakdown
  const getCategoryBreakdown = () => {
    const categoryTotals: Record<string, number> = {};

    transactions
      .filter((t) => t.transaction_type === "expense") // Only expenses
      .forEach((t) => {
        const category = t.category || "Uncategorized";
        categoryTotals[category] = (categoryTotals[category] || 0) + t.amount;
      });

    return Object.entries(categoryTotals)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 8); // Top 8 categories
  };

  const monthlyData = getMonthlySpending();
  const categoryData = getCategoryBreakdown();
  const totalSpent = categoryData.reduce((sum, c) => sum + c.amount, 0);

  // Generate colors for pie chart
  const pieColors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#84cc16",
  ];

  return (
    <div className="space-y-6">
      {/* Spending Trends Chart */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Spending Trends</CardTitle>
            <Select
              value={trendsMode}
              onValueChange={(v) =>
                setTrendsMode(v as "total" | "envelope" | "category")
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="total">Total Monthly</SelectItem>
                <SelectItem value="envelope">Income vs Spending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {/* Simple Line Chart */}
          <div className="space-y-4">
            {monthlyData.map((month, _idx) => (
              <div key={month.month}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">{month.month}</span>
                  {trendsMode === "total" ? (
                    <span className="font-semibold text-red-600">
                      {formatCurrency(month.spent)}
                    </span>
                  ) : (
                    <div className="flex gap-4 text-xs">
                      <span className="text-green-600">
                        Income: {formatCurrency(month.income)}
                      </span>
                      <span className="text-red-600">
                        Spent: {formatCurrency(month.spent)}
                      </span>
                    </div>
                  )}
                </div>

                {trendsMode === "total" ? (
                  // Single bar for spending
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-red-500 transition-all"
                      style={{
                        width: `${Math.min(
                          (month.spent /
                            Math.max(...monthlyData.map((m) => m.spent))) *
                            100,
                          100,
                        )}%`,
                      }}
                    />
                  </div>
                ) : (
                  // Stacked bars for income vs spending
                  <div className="space-y-1">
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all"
                        style={{
                          width: `${Math.min(
                            (month.income /
                              Math.max(
                                ...monthlyData.map((m) =>
                                  Math.max(m.income, m.spent),
                                ),
                              )) *
                              100,
                            100,
                          )}%`,
                        }}
                      />
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-red-500 transition-all"
                        style={{
                          width: `${Math.min(
                            (month.spent /
                              Math.max(
                                ...monthlyData.map((m) =>
                                  Math.max(m.income, m.spent),
                                ),
                              )) *
                              100,
                            100,
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown - Simple Pie */}
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Simple donut chart using CSS */}
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-48 h-48">
                  {categoryData.map((category, idx) => {
                    const percentage = (category.amount / totalSpent) * 100;
                    const rotation = categoryData
                      .slice(0, idx)
                      .reduce(
                        (sum, c) => sum + (c.amount / totalSpent) * 360,
                        0,
                      );

                    return (
                      <div
                        key={category.name}
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: `conic-gradient(${
                            pieColors[idx]
                          } ${rotation}deg ${
                            rotation + percentage * 3.6
                          }deg, transparent 0deg)`,
                          clipPath: "circle(50% at 50% 50%)",
                        }}
                      />
                    );
                  })}
                  {/* Center hole for donut effect */}
                  <div className="absolute inset-8 bg-white rounded-full flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-xs text-slate-600">Total</p>
                      <p className="text-lg font-bold">
                        {formatCurrency(totalSpent)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-2">
                {categoryData.map((category, idx) => {
                  const percentage = (category.amount / totalSpent) * 100;
                  return (
                    <div
                      key={category.name}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <div
                          className="w-3 h-3 rounded-sm shrink-0"
                          style={{ backgroundColor: pieColors[idx] }}
                        />
                        <span className="text-slate-700 truncate">
                          {category.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500 text-xs">
                          {percentage.toFixed(0)}%
                        </span>
                        <span className="font-semibold text-slate-900 min-w-20 text-right">
                          {formatCurrency(category.amount)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Envelope Health Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Envelope Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {envelopes.slice(0, 8).map((envelope) => {
                const details = getEnvelopePeriodDetails(
                  envelope,
                  transactions,
                );
                const percentage =
                  details.allocated > 0
                    ? (details.spent / details.allocated) * 100
                    : 0;

                const healthColor =
                  percentage < 80
                    ? "text-green-600"
                    : percentage < 100
                      ? "text-amber-600"
                      : "text-red-600";

                const barColor =
                  percentage < 80
                    ? "bg-green-500"
                    : percentage < 100
                      ? "bg-amber-500"
                      : "bg-red-500";

                return (
                  <div key={envelope.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: envelope.color }}
                        />
                        <span className="text-slate-700">{envelope.name}</span>
                      </div>
                      <span className={`font-semibold ${healthColor}`}>
                        {formatCurrency(details.remaining)}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all ${barColor}`}
                        style={{
                          width: `${Math.min(percentage, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
