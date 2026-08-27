"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { DataState } from "@/components/shared/data-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDriverTrips } from "@/hooks/use-driver-trips";
import { driverRoutes } from "@/config/routes";
import { getDriverServiceLabel } from "@/config/driver-services";
import { getDriverTripStatusLabel } from "@/services/domain/driver.service";
import { formatCurrency } from "@/services/domain/booking.service";
import { calculateDriverEarning } from "@/services/domain/earning.service";
import { isAppError } from "@/services/domain/errors";
import {
  classifyDriverTrip,
  type DriverTripTab,
} from "@/features/driver/trip-tabs";
import type { DriverTripSummary } from "@/services/api/drivers.api";
import { cn } from "@/lib/utils";

const TABS: { id: DriverTripTab; label: string }[] = [
  { id: "requests", label: "Requests" },
  { id: "upcoming", label: "Upcoming" },
  { id: "active", label: "Active" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

export default function DriverTripsPage() {
  const { listQuery, accept, reject } = useDriverTrips();
  const [tab, setTab] = useState<DriverTripTab>("requests");
  const [rejectId, setRejectId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const items = listQuery.data ?? [];
    return items
      .filter((t) => classifyDriverTrip(t) === tab)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [listQuery.data, tab]);

  async function onAccept(id: string) {
    try {
      await accept.mutateAsync(id);
      toast.success("Booking accepted");
    } catch (err) {
      toast.error(isAppError(err) ? err.message : "Unable to accept");
    }
  }

  async function onReject() {
    if (!rejectId) return;
    try {
      await reject.mutateAsync(rejectId);
      toast.success("Request rejected");
      setRejectId(null);
    } catch (err) {
      toast.error(isAppError(err) ? err.message : "Unable to reject");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1">Trips</h1>
        <p className="mt-2 text-muted-foreground">
          Driver bookings and trips — you drive the customer&apos;s vehicle.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto" role="tablist" aria-label="Trip filters">
        {TABS.map((t) => (
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
                : "border border-border bg-warm-white text-muted-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <DataState
        isLoading={listQuery.isLoading}
        isError={listQuery.isError}
        errorMessage="Unable to load your trips."
        onRetry={() => void listQuery.refetch()}
        isEmpty={filtered.length === 0}
        emptyTitle={
          tab === "requests"
            ? "No new driver bookings"
            : tab === "completed"
              ? "No completed trips yet"
              : tab === "cancelled"
                ? "No cancelled trips"
                : tab === "active"
                  ? "No active trip"
                  : "No upcoming trips"
        }
        emptyDescription={
          tab === "requests"
            ? "You're ready — new requests will appear here when assigned."
            : undefined
        }
      >
        <ul className="space-y-3">
          {filtered.map((trip) => (
            <TripListCard
              key={trip.id}
              trip={trip}
              tab={tab}
              accepting={accept.isPending}
              onAccept={() => void onAccept(trip.id)}
              onReject={() => setRejectId(trip.id)}
            />
          ))}
        </ul>
      </DataState>

      <Dialog open={Boolean(rejectId)} onOpenChange={(o) => !o && setRejectId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject this driver booking?</DialogTitle>
            <DialogDescription>
              The booking will return to searching for another driver.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setRejectId(null)}>
              Keep request
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={reject.isPending}
              onClick={() => void onReject()}
            >
              {reject.isPending ? "Rejecting…" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TripListCard({
  trip,
  tab,
  accepting,
  onAccept,
  onReject,
}: {
  trip: DriverTripSummary;
  tab: DriverTripTab;
  accepting: boolean;
  onAccept: () => void;
  onReject: () => void;
}) {
  const fare = trip.booking?.estimatedFare ?? trip.fare ?? 0;
  const earning = calculateDriverEarning(fare);

  return (
    <li className="rounded-2xl border border-border bg-warm-white p-4 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-deep-navy">
            {trip.pickup.label} → {trip.destination.label}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {trip.customer?.name ?? "Customer"} ·{" "}
            {new Date(trip.createdAt).toLocaleString()}
          </p>
        </div>
        <StatusBadge status={trip.status} />
      </div>
      {trip.userVehicle ? (
        <div className="mt-3 text-sm">
          <p className="text-muted-foreground">Customer Vehicle</p>
          <p className="font-medium text-deep-navy">
            {trip.userVehicle.make} {trip.userVehicle.model}
          </p>
          <p className="text-muted-foreground">
            {trip.userVehicle.registrationNumber}
            {trip.userVehicle.color ? ` · ${trip.userVehicle.color}` : ""}
          </p>
        </div>
      ) : null}
      {trip.booking ? (
        <p className="mt-2 text-sm text-muted-foreground">
          {getDriverServiceLabel(trip.booking.serviceType)} · Est. earning{" "}
          {formatCurrency(earning.netAmount)}
        </p>
      ) : null}
      <p className="mt-1 text-caption text-muted-foreground">
        {getDriverTripStatusLabel(trip.status)}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tab === "requests" ? (
          <>
            <Button type="button" size="sm" disabled={accepting} onClick={onAccept}>
              {accepting ? "Accepting…" : "Accept"}
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={onReject}>
              Reject
            </Button>
            <Link
              href={driverRoutes.tripDetail(trip.id)}
              className={cn(buttonVariants({ size: "sm", variant: "secondary" }))}
            >
              Review request
            </Link>
          </>
        ) : (
          <Link
            href={driverRoutes.tripDetail(trip.id)}
            className={cn(buttonVariants({ size: "sm" }))}
          >
            View Trip
          </Link>
        )}
      </div>
    </li>
  );
}
