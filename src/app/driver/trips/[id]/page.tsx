"use client";

import { use, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { MapPreview } from "@/components/public/map-preview";
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
import { useDriverTripDetails, useDriverTrips } from "@/hooks/use-driver-trips";
import { driverRoutes } from "@/config/routes";
import { getDriverServiceLabel } from "@/config/driver-services";
import { getDriverTripStatusLabel } from "@/services/domain/driver.service";
import {
  canAcceptTrip,
  canCompleteTrip,
  canMarkArrived,
  canMarkArriving,
  canStartTrip,
} from "@/services/domain/trip-state";
import { formatCurrency } from "@/services/domain/booking.service";
import { calculateDriverEarning } from "@/services/domain/earning.service";
import { isAppError } from "@/services/domain/errors";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { cn } from "@/lib/utils";

export default function DriverTripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const details = useDriverTripDetails(id);
  const { accept, arriving, reject, arrived, start, complete } = useDriverTrips();
  const { isOffline } = useOnlineStatus();
  const [rejectOpen, setRejectOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);

  const trip = details.data?.trip;
  const booking = details.data?.booking;
  const userVehicle = details.data?.userVehicle;
  const customer = details.data?.customer;
  const fare = booking?.estimatedFare ?? trip?.fare ?? 0;
  const earning = calculateDriverEarning(fare);

  async function run(action: () => Promise<unknown>, success: string) {
    if (isOffline) {
      toast.error("You're offline. Reconnect to continue.");
      return;
    }
    try {
      await action();
      toast.success(success);
      void details.refetch();
    } catch (err) {
      toast.error(
        isAppError(err)
          ? err.message
          : "This trip is no longer available.",
      );
      void details.refetch();
    }
  }

  const primaryActions = trip ? (
    <div className="flex flex-wrap gap-2">
      {canAcceptTrip(trip.status) && booking?.status !== "CONFIRMED" ? (
        <>
          <Button
            type="button"
            className="min-h-11"
            disabled={accept.isPending || isOffline}
            onClick={() =>
              void run(() => accept.mutateAsync(id), "Booking accepted")
            }
          >
            {accept.isPending ? "Accepting…" : "Accept"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="min-h-11"
            disabled={isOffline}
            onClick={() => setRejectOpen(true)}
          >
            Reject
          </Button>
        </>
      ) : null}
      {canMarkArriving(trip.status) && booking?.status === "CONFIRMED" ? (
        <Button
          type="button"
          className="min-h-11 flex-1 sm:flex-none"
          disabled={arriving.isPending || isOffline}
          onClick={() =>
            void run(() => arriving.mutateAsync(id), "Marked as arriving")
          }
        >
          {arriving.isPending ? "Updating…" : "I'm Arriving"}
        </Button>
      ) : null}
      {trip.status === "ASSIGNED" && booking?.status === "CONFIRMED" ? (
        <Button type="button" variant="outline" className="min-h-11" disabled>
          Start Navigation (mock)
        </Button>
      ) : null}
      {canMarkArrived(trip.status) ? (
        <Button
          type="button"
          className="min-h-11 flex-1 sm:flex-none"
          disabled={arrived.isPending || isOffline}
          onClick={() =>
            void run(() => arrived.mutateAsync(id), "Marked arrived")
          }
        >
          {arrived.isPending ? "Updating…" : "I've Arrived"}
        </Button>
      ) : null}
      {canStartTrip(trip.status) ? (
        <Button
          type="button"
          className="min-h-11 flex-1 sm:flex-none"
          disabled={start.isPending || isOffline}
          onClick={() => void run(() => start.mutateAsync(id), "Trip started")}
        >
          {start.isPending ? "Starting…" : "Start Trip"}
        </Button>
      ) : null}
      {canCompleteTrip(trip.status) ? (
        <Button
          type="button"
          className="min-h-11 flex-1 sm:flex-none"
          disabled={isOffline}
          onClick={() => setCompleteOpen(true)}
        >
          Complete Trip
        </Button>
      ) : null}
    </div>
  ) : null;

  return (
    <div className="space-y-6 pb-28 md:pb-0">
      {isOffline ? (
        <p
          role="status"
          className="rounded-xl border border-orange/30 bg-orange/10 px-4 py-2 text-sm text-deep-navy"
        >
          Connection lost. Trip actions stay disabled until you reconnect.
        </p>
      ) : null}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-caption text-muted-foreground">Trip</p>
          <h1 className="text-h1">{id}</h1>
        </div>
        <Link
          href={driverRoutes.trips}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Back to trips
        </Link>
      </div>

      <DataState
        isLoading={details.isLoading}
        isError={details.isError}
        errorMessage="Unable to load trip"
        onRetry={() => void details.refetch()}
        isEmpty={!trip}
        emptyTitle="Trip is no longer available."
      >
        {trip ? (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <div className="overflow-hidden rounded-2xl border border-border bg-warm-white shadow-soft">
                <div className="border-b border-border bg-deep-navy px-4 py-3 text-warm-white">
                  <p className="text-caption uppercase tracking-wide text-orange">
                    Trip status
                  </p>
                  <h2 className="text-xl font-semibold">
                    {getDriverTripStatusLabel(trip.status)}
                  </h2>
                </div>
                <MapPreview className="min-h-[12rem] rounded-none border-0" />
                <p className="px-4 py-2 text-caption text-muted-foreground">
                  Mock map preview — not live GPS navigation.
                </p>
              </div>

              <div className="hidden flex-wrap gap-2 md:flex">{primaryActions}</div>
            </div>

            <aside className="space-y-4 rounded-2xl border border-border bg-warm-white p-5 shadow-soft">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-h3">Details</h2>
                <StatusBadge status={trip.status} />
              </div>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Customer</dt>
                  <dd className="font-medium text-deep-navy">
                    {customer?.name ?? "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Customer Vehicle</dt>
                  <dd className="font-medium text-deep-navy">
                    {userVehicle
                      ? `${userVehicle.make} ${userVehicle.model}`
                      : "—"}
                  </dd>
                  {userVehicle ? (
                    <dd className="text-muted-foreground">
                      {userVehicle.registrationNumber}
                      {userVehicle.color ? ` · ${userVehicle.color}` : ""}
                    </dd>
                  ) : null}
                </div>
                <div>
                  <dt className="text-muted-foreground">Pickup</dt>
                  <dd className="font-medium text-deep-navy">
                    {trip.pickup.address}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Destination</dt>
                  <dd className="font-medium text-deep-navy">
                    {trip.destination.address}
                  </dd>
                </div>
                {booking ? (
                  <div>
                    <dt className="text-muted-foreground">Driving Service</dt>
                    <dd className="font-medium text-deep-navy">
                      {getDriverServiceLabel(booking.serviceType)} driver
                    </dd>
                  </div>
                ) : null}
                <div>
                  <dt className="text-muted-foreground">Fare</dt>
                  <dd className="font-medium text-deep-navy">
                    {formatCurrency(fare)}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Estimated Driver Earning</dt>
                  <dd className="font-medium text-deep-navy">
                    {formatCurrency(earning.netAmount)}
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        ) : null}
      </DataState>

      {trip && primaryActions ? (
        <div className="fixed inset-x-0 bottom-[calc(3.75rem+env(safe-area-inset-bottom))] z-40 border-t border-border bg-warm-white/95 p-3 shadow-medium backdrop-blur md:hidden">
          {isOffline ? (
            <p className="mb-2 text-center text-sm text-muted-foreground" role="status">
              Connection lost — reconnect to update this trip.
            </p>
          ) : null}
          {primaryActions}
        </div>
      ) : null}

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject this driver booking?</DialogTitle>
            <DialogDescription>
              The booking will return to searching for another driver.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setRejectOpen(false)}>
              Keep request
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={reject.isPending}
              onClick={() =>
                void run(async () => {
                  await reject.mutateAsync(id);
                  setRejectOpen(false);
                }, "Request rejected")
              }
            >
              {reject.isPending ? "Rejecting…" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={completeOpen} onOpenChange={setCompleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete this trip?</DialogTitle>
            <DialogDescription>
              This records payment for the user and your driving-service earning.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setCompleteOpen(false)}>
              Keep trip
            </Button>
            <Button
              type="button"
              disabled={complete.isPending}
              onClick={() =>
                void run(async () => {
                  await complete.mutateAsync(id);
                  setCompleteOpen(false);
                }, "Trip completed")
              }
            >
              {complete.isPending ? "Completing…" : "Complete Trip"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
