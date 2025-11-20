import type { Envelope, Transaction } from "../supabase";

export interface EnvelopePeriod {
  start: Date;
  end: Date;
  allocated: number;
  spent: number;
  remaining: number;
  carriedOver: number;
}

// Calculate the next period end date based on envelope settings
export function calculatePeriodEnd(
  startDate: Date,
  period: Envelope["allocation_period"],
  customDays?: number,
): Date {
  const end = new Date(startDate);

  switch (period) {
    case "weekly":
      end.setDate(end.getDate() + 7);
      break;
    case "biweekly":
      end.setDate(end.getDate() + 14);
      break;
    case "monthly":
      end.setMonth(end.getMonth() + 1);
      break;
    case "yearly":
      end.setFullYear(end.getFullYear() + 1);
      break;
    case "custom":
      if (customDays) {
        end.setDate(end.getDate() + customDays);
      }
      break;
  }

  // Set to end of day
  end.setHours(23, 59, 59, 999);
  return end;
}

// Get the current period for an envelope
export function getCurrentPeriod(envelope: Envelope): {
  start: Date;
  end: Date;
} {
  const allocationStart = new Date(envelope.allocation_start_date);
  const now = new Date();

  let periodStart = new Date(allocationStart);
  let periodEnd = calculatePeriodEnd(
    periodStart,
    envelope.allocation_period,
    envelope.allocation_days ?? undefined,
  );

  // Find the current period by iterating forward
  while (periodEnd < now) {
    periodStart = new Date(periodEnd);
    periodStart.setDate(periodStart.getDate() + 1); // Start of next period
    periodEnd = calculatePeriodEnd(
      periodStart,
      envelope.allocation_period,
      envelope.allocation_days ?? undefined,
    );
  }

  return { start: periodStart, end: periodEnd };
}

// Calculate spending for an envelope in a specific period
export function calculateSpending(
  transactions: Transaction[],
  envelopeId: string,
  periodStart: Date,
  periodEnd: Date,
): number {
  return transactions
    .filter((t) => {
      if (t.envelope_id !== envelopeId) return false;
      if (t.transaction_type !== "expense") return false; // Only count expenses, not payments or income
      const txDate = new Date(t.transaction_date);
      return txDate >= periodStart && txDate <= periodEnd;
    })
    .reduce((sum, t) => sum + t.amount, 0);
}

// Get envelope period with spending details
export function getEnvelopePeriodDetails(
  envelope: Envelope,
  transactions: Transaction[],
  carriedOver = 0,
): EnvelopePeriod {
  const { start, end } = getCurrentPeriod(envelope);
  const spent = calculateSpending(transactions, envelope.id, start, end);
  const allocated = envelope.allocation_amount + carriedOver;
  const remaining = allocated - spent;

  return {
    start,
    end,
    allocated,
    spent,
    remaining,
    carriedOver,
  };
}

// Calculate all historical periods for an envelope
export function getAllPeriods(
  envelope: Envelope,
  endDate?: Date,
): Array<{ start: Date; end: Date }> {
  const periods: Array<{ start: Date; end: Date }> = [];
  const allocationStart = new Date(envelope.allocation_start_date);
  const maxDate = endDate || new Date();

  let periodStart = new Date(allocationStart);
  let periodEnd = calculatePeriodEnd(
    periodStart,
    envelope.allocation_period,
    envelope.allocation_days ?? undefined,
  );

  while (periodStart <= maxDate) {
    periods.push({
      start: new Date(periodStart),
      end: new Date(periodEnd),
    });

    periodStart = new Date(periodEnd);
    periodStart.setDate(periodStart.getDate() + 1);
    periodEnd = calculatePeriodEnd(
      periodStart,
      envelope.allocation_period,
      envelope.allocation_days ?? undefined,
    );
  }

  return periods;
}

// Format currency consistently
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

// Calculate budget health percentage (0-100)
export function getBudgetHealthPercentage(
  spent: number,
  allocated: number,
): number {
  if (allocated === 0) return 100;
  const percentage = (spent / allocated) * 100;
  return Math.min(percentage, 100);
}

// Get budget health status
export function getBudgetHealthStatus(
  spent: number,
  allocated: number,
): "healthy" | "warning" | "over" {
  const percentage = getBudgetHealthPercentage(spent, allocated);
  if (percentage < 80) return "healthy";
  if (percentage < 100) return "warning";
  return "over";
}

// Sort envelopes by position
export function sortEnvelopesByPosition(envelopes: Envelope[]): Envelope[] {
  return [...envelopes].sort((a, b) => a.position - b.position);
}

// Get default envelope colors (for UI selection)
export const ENVELOPE_COLORS = [
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f97316", // orange
  "#84cc16", // lime
  "#6366f1", // indigo
];

// Get next available position for new envelope
export function getNextEnvelopePosition(envelopes: Envelope[]): number {
  if (envelopes.length === 0) return 0;
  return Math.max(...envelopes.map((e) => e.position)) + 1;
}
