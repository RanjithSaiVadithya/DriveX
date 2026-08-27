"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useBookings } from "@/hooks/use-bookings";
import { DataState } from "@/components/shared/data-state";
import { RideCard } from "@/components/shared/domain-cards";
import { buttonVariants } from "@/components/ui/button";
import { userRoutes } from "@/config/routes";
import {
  formatCurrency,
  isActiveBooking,
  isUpcomingBooking,
} from "@/services/domain/booking.service";
import type { Booking } from "@/types/booking";
import { cn } from "@/lib/utils";

type Tab = "upcoming" | "active" | "completed" | "cancelled";

function tabFor(booking: Booking): Tab {
  if (booking.status === "CANCELLED" || booking.status === "EXPIRED") return "cancelled";
  if (booking.status === "CONFIRMED" && booking.finalFare != null) return "completed";
  if (isActiveBooking(booking)) return "active";
  if (isUpcomingBooking(booking)) return "upcoming";
  return "upcoming";
}

function BookingsInner() {
  const params = useSearchParams();
  const initial = (params.get("tab") as Tab) || "upcoming";
  const [tab, setTab] = useState<Tab>(
    ["upcoming", "active", "completed", "cancelled"].includes(initial)
      ? initial
      : "upcoming",
  );
  const { listQuery } = useBookings();

  const filtered = useMemo(() => {
    const items = listQuery.data ?? [];
    return items
      .filter((b) => tabFor(b) === tab)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [listQuery.data, tab]);

  const tabs: { id: Tab; label: string }[] = [
    { id: "upcoming", label: "Upcoming" },
    { id: "active", label: "Active" },
    { id: "completed", label: "Completed" },
    { id: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-h1">My trips</h1>
          <p className="mt-2 text-muted-foreground">Driver bookings loaded from the API.</p>
        </div>
        <Link href={userRoutes.book} className={cn(buttonVariants())}>
          Book a Driver
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto" role="tablist" aria-label="Trip filters">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap",
              tab === t.id
                ? "bg-olive text-warm-white"
                : "bg-warm-white text-muted-foreground border border-border",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <DataState
        isLoading={listQuery.isLoading}
        isError={listQuery.isError}
        errorMessage="Unable to load bookings"
        onRetry={() => void listQuery.refetch()}
        isEmpty={filtered.length === 0}
        emptyTitle={
          tab === "completed"
            ? "No completed trips yet."
            : tab === "cancelled"
              ? "No cancelled bookings."
              : "No upcoming trips"
        }
        emptyDescription={
          tab === "upcoming" || tab === "active"
            ? "Your next driver booking will appear here."
            : undefined
        }
      >
        <ul className="space-y-3">
          {filtered.map((booking) => (
            <li key={booking.id}>
              <Link href={userRoutes.bookingDetail(booking.id)} className="block">
                <RideCard
                  title={`${booking.pickup.label} → ${booking.destination.label}`}
                  subtitle={`${booking.pickup.address}`}
                  status={booking.status}
                  meta={`${formatCurrency(booking.finalFare ?? booking.estimatedFare)} · ${new Date(booking.createdAt).toLocaleString()}`}
                />
              </Link>
            </li>
          ))}
        </ul>
      </DataState>
    </div>
  );
}

export default function BookingsPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading rides…</p>}>
      <BookingsInner />
    </Suspense>
  );
}
