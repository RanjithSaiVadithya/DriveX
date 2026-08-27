import type { Earning } from "@/types/earning";

/** Platform commission rate for driving-service earnings (mock). */
export const DRIVER_COMMISSION_RATE = 0.2;

export function calculateDriverEarning(grossFare: number): {
  grossAmount: number;
  commission: number;
  netAmount: number;
} {
  const grossAmount = Math.max(0, Math.round(grossFare));
  const commission = Math.round(grossAmount * DRIVER_COMMISSION_RATE);
  return {
    grossAmount,
    commission,
    netAmount: grossAmount - commission,
  };
}

export type EarningPeriod = "today" | "week" | "month" | "all";

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function filterEarningsByPeriod(
  earnings: Earning[],
  period: EarningPeriod,
  now = new Date(),
): Earning[] {
  if (period === "all") return earnings;
  const start = startOfDay(now);
  if (period === "week") {
    start.setDate(start.getDate() - start.getDay());
  } else if (period === "month") {
    start.setDate(1);
  }
  return earnings.filter((e) => new Date(e.earnedAt) >= start);
}

export function sumNetEarnings(earnings: Earning[]): number {
  return earnings.reduce((sum, e) => sum + e.netAmount, 0);
}

export function countTripsInPeriod(
  earnings: Earning[],
  period: EarningPeriod,
  now = new Date(),
): number {
  return filterEarningsByPeriod(earnings, period, now).length;
}
