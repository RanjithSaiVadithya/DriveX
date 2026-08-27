"use client";

import { useMemo, useState } from "react";
import { DataState } from "@/components/shared/data-state";
import { useEarnings } from "@/hooks/use-earnings";
import { formatCurrency } from "@/services/domain/booking.service";
import {
  filterEarningsByPeriod,
  sumNetEarnings,
  type EarningPeriod,
} from "@/services/domain/earning.service";
import { cn } from "@/lib/utils";

const PERIODS: { id: EarningPeriod; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
  { id: "all", label: "All" },
];

export default function DriverEarningsPage() {
  const earningsQuery = useEarnings();
  const [period, setPeriod] = useState<EarningPeriod>("today");
  const all = useMemo(
    () => earningsQuery.data ?? [],
    [earningsQuery.data],
  );

  const filtered = useMemo(
    () => filterEarningsByPeriod(all, period),
    [all, period],
  );
  const today = sumNetEarnings(filterEarningsByPeriod(all, "today"));
  const week = sumNetEarnings(filterEarningsByPeriod(all, "week"));
  const month = sumNetEarnings(filterEarningsByPeriod(all, "month"));
  const periodTotal = sumNetEarnings(filtered);

  const maxNet = Math.max(1, ...filtered.map((e) => e.netAmount));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1">Earnings</h1>
        <p className="mt-2 text-muted-foreground">
          Earnings from driving service — not vehicle rental.
        </p>
      </div>

      <section className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Today's Earnings", value: today },
          { label: "This Week", value: week },
          { label: "This Month", value: month },
        ].map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-border bg-warm-white p-4 shadow-soft"
          >
            <p className="text-sm text-muted-foreground">{c.label}</p>
            <p className="mt-2 text-2xl font-semibold text-deep-navy">
              {formatCurrency(c.value)}
            </p>
          </div>
        ))}
      </section>

      <div className="flex gap-2 overflow-x-auto" role="tablist" aria-label="Earnings period">
        {PERIODS.map((p) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={period === p.id}
            onClick={() => setPeriod(p.id)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap",
              period === p.id
                ? "bg-olive text-warm-white"
                : "border border-border bg-warm-white text-muted-foreground",
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        Period total:{" "}
        <span className="font-semibold text-deep-navy">
          {formatCurrency(periodTotal)}
        </span>
      </p>

      {filtered.length > 0 ? (
        <section className="rounded-2xl border border-border bg-warm-white p-4 shadow-soft">
          <h2 className="text-h3">Earnings trend</h2>
          <ul className="mt-4 space-y-2" aria-label="Earnings bars">
            {filtered.slice(0, 8).map((e) => (
              <li key={e.id} className="flex items-center gap-3 text-sm">
                <span className="w-24 shrink-0 text-muted-foreground">
                  {new Date(e.earnedAt).toLocaleDateString()}
                </span>
                <div className="h-2 flex-1 rounded-full bg-cream">
                  <div
                    className="h-2 rounded-full bg-olive"
                    style={{ width: `${(e.netAmount / maxNet) * 100}%` }}
                  />
                </div>
                <span className="w-20 text-right font-medium text-deep-navy">
                  {formatCurrency(e.netAmount)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <DataState
        isLoading={earningsQuery.isLoading}
        isError={earningsQuery.isError}
        errorMessage="Unable to load earnings"
        onRetry={() => void earningsQuery.refetch()}
        isEmpty={filtered.length === 0}
        emptyTitle="No earnings yet"
        emptyDescription="Completed trips will credit your driving-service earnings here."
      >
        <ul className="space-y-3">
          {filtered.map((e) => (
            <li
              key={e.id}
              className="rounded-xl border border-border bg-warm-white p-4 shadow-soft"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-deep-navy">Trip {e.tripId}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(e.earnedAt).toLocaleString()}
                  </p>
                </div>
                <p className="text-lg font-semibold text-olive">
                  {formatCurrency(e.netAmount, e.currency)}
                </p>
              </div>
              <dl className="mt-3 grid gap-1 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-muted-foreground">Trip fare</dt>
                  <dd>{formatCurrency(e.grossAmount, e.currency)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Platform fee</dt>
                  <dd>{formatCurrency(e.commission, e.currency)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Driver earning</dt>
                  <dd className="font-medium">{formatCurrency(e.netAmount, e.currency)}</dd>
                </div>
              </dl>
              <p className="mt-2 text-caption text-muted-foreground">Status: {e.status}</p>
            </li>
          ))}
        </ul>
      </DataState>
    </div>
  );
}
