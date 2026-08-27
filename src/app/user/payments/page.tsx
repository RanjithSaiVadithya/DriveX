"use client";

import { DataState } from "@/components/shared/data-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { usePayments } from "@/hooks/use-payments";
import { formatCurrency } from "@/services/domain/booking.service";

export default function PaymentsPage() {
  const payments = usePayments();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1">Payments</h1>
        <p className="mt-2 text-muted-foreground">
          Mock payment history only — no real payment gateway.
        </p>
      </div>

      <DataState
        isLoading={payments.isLoading}
        isError={payments.isError}
        errorMessage="Unable to load payment"
        onRetry={() => void payments.refetch()}
        isEmpty={(payments.data ?? []).length === 0}
        emptyTitle="No payments yet"
        emptyDescription="Completed trips will show receipts here."
      >
        <ul className="space-y-3">
          {(payments.data ?? [])
            .slice()
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
            .map((payment) => (
              <li
                key={payment.id}
                className="rounded-xl border border-border bg-warm-white p-4 shadow-soft"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-deep-navy">
                      Ride {payment.bookingId}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {payment.method} · {payment.transactionReference}
                    </p>
                    <p className="mt-1 text-caption text-muted-foreground">
                      {new Date(payment.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-deep-navy">
                      {formatCurrency(payment.amount, payment.currency)}
                    </p>
                    <StatusBadge status={payment.status} className="mt-2" />
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </DataState>
    </div>
  );
}
