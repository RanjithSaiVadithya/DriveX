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
import { useBookings } from "@/hooks/use-bookings";
import { useBookingDetails, useTrip } from "@/hooks/use-trips";
import { userRoutes } from "@/config/routes";
import {
  formatCurrency,
  getAvailableUserBookingActions,
  getBookingStatusLabel,
  getTripStatusLabel,
} from "@/services/domain/booking.service";
import { isAppError } from "@/services/domain/errors";
import { cn } from "@/lib/utils";

export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const details = useBookingDetails(id);
  const { cancelBooking, dispatchBooking } = useBookings();
  const tripId = details.data?.trip?.id;
  const { advance } = useTrip(tripId ?? "");
  const [cancelOpen, setCancelOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const booking = details.data?.booking;
  const trip = details.data?.trip;
  const driver = details.data?.driver;
  const driverUser = details.data?.driverUser;
  const vehicle = details.data?.userVehicle;
  const payment = details.data?.payment;
  const actions = booking ? getAvailableUserBookingActions(booking) : null;
  const activeTrip =
    trip &&
    ["ASSIGNED", "DRIVER_ARRIVING", "DRIVER_ARRIVED", "STARTED"].includes(trip.status);

  async function onCancel() {
    setActionError(null);
    try {
      await cancelBooking.mutateAsync(id);
      toast.success("Booking cancelled");
      setCancelOpen(false);
      void details.refetch();
    } catch (err) {
      setActionError(isAppError(err) ? err.message : "Unable to cancel booking");
    }
  }

  async function onDispatch() {
    setActionError(null);
    try {
      await dispatchBooking.mutateAsync(id);
      toast.success("Driver assigned");
      void details.refetch();
    } catch (err) {
      setActionError(isAppError(err) ? err.message : "Unable to assign driver");
    }
  }

  async function onAdvance() {
    if (!tripId) return;
    setActionError(null);
    try {
      await advance.mutateAsync();
      toast.success("Trip status updated");
      void details.refetch();
    } catch (err) {
      setActionError(isAppError(err) ? err.message : "Unable to advance trip");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-caption text-muted-foreground">Booking</p>
          <h1 className="text-h1">{id}</h1>
        </div>
        <Link href={userRoutes.bookings} className={cn(buttonVariants({ variant: "outline" }))}>
          Back to trips
        </Link>
      </div>

      <DataState
        isLoading={details.isLoading}
        isError={details.isError}
        errorMessage="Unable to load booking details"
        onRetry={() => void details.refetch()}
        isEmpty={!booking}
        emptyTitle="Booking no longer exists"
      >
        {booking ? (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="space-y-4">
              {activeTrip ? (
                <div className="overflow-hidden rounded-2xl border border-border bg-warm-white shadow-soft">
                  <div className="border-b border-border bg-deep-navy px-4 py-3 text-warm-white">
                    <p className="text-caption uppercase tracking-wide text-orange">
                      Live trip
                    </p>
                    <h2 className="text-xl font-semibold">
                      {trip ? getTripStatusLabel(trip.status) : "Driver assigned"}
                    </h2>
                  </div>
                  <MapPreview className="min-h-[14rem] rounded-none border-0" />
                  <div className="space-y-3 p-4">
                    {driverUser ? (
                      <div>
                        <p className="text-caption text-muted-foreground">Your Driver</p>
                        <p className="font-semibold text-deep-navy">{driverUser.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ★ {driver?.rating?.toFixed(1) ?? "—"}
                        </p>
                      </div>
                    ) : null}
                    {vehicle ? (
                      <div>
                        <p className="text-caption text-muted-foreground">
                          Driving your vehicle
                        </p>
                        <p className="font-medium text-deep-navy">
                          {vehicle.make} {vehicle.model}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {vehicle.registrationNumber}
                          {vehicle.color ? ` · ${vehicle.color}` : ""}
                        </p>
                      </div>
                    ) : null}
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" variant="outline" disabled>
                        Contact
                      </Button>
                      <Button type="button" variant="outline" disabled>
                        Support
                      </Button>
                      {trip && trip.status !== "COMPLETED" && trip.status !== "CANCELLED" ? (
                        <Button
                          type="button"
                          variant="navy"
                          disabled={advance.isPending}
                          onClick={() => void onAdvance()}
                        >
                          {advance.isPending ? "Updating…" : "Advance trip (mock)"}
                        </Button>
                      ) : null}
                    </div>
                    <p className="text-caption text-muted-foreground">
                      Contact/Support are UI placeholders. Advance trip simulates the
                      shared lifecycle for Phase 3–4.
                    </p>
                  </div>
                </div>
              ) : null}

              <div className="rounded-2xl border border-border bg-warm-white p-5 shadow-soft">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-h3">Status</h2>
                  <StatusBadge status={booking.status} />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {getBookingStatusLabel(booking.status)}
                  {trip ? ` · ${getTripStatusLabel(trip.status)}` : ""}
                </p>

                <dl className="mt-5 space-y-3 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Pickup</dt>
                    <dd className="font-medium text-deep-navy">{booking.pickup.address}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Destination</dt>
                    <dd className="font-medium text-deep-navy">
                      {booking.destination.address}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">When</dt>
                    <dd className="font-medium text-deep-navy">
                      {booking.scheduledAt
                        ? new Date(booking.scheduledAt).toLocaleString()
                        : "As soon as possible"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Your vehicle</dt>
                    <dd className="font-medium text-deep-navy">
                      {vehicle
                        ? `${vehicle.make} ${vehicle.model} · ${vehicle.registrationNumber}`
                        : booking.userVehicleId}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Driver service</dt>
                    <dd className="font-medium text-deep-navy">{booking.serviceType}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Fare</dt>
                    <dd className="font-medium text-deep-navy">
                      {formatCurrency(booking.finalFare ?? booking.estimatedFare)}
                      {booking.finalFare == null ? " (estimate)" : ""}
                    </dd>
                  </div>
                </dl>
              </div>
            </section>

            <aside className="space-y-4">
              {driverUser || vehicle ? (
                <div className="rounded-2xl border border-border bg-warm-white p-5 shadow-soft">
                  <h2 className="text-h3">Driver</h2>
                  {driverUser ? (
                    <>
                      <p className="mt-3 font-semibold text-deep-navy">{driverUser.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Rating ★ {driver?.rating?.toFixed(1)}
                      </p>
                    </>
                  ) : (
                    <p className="mt-3 text-sm text-muted-foreground">Awaiting assignment</p>
                  )}
                  {vehicle ? (
                    <div className="mt-4 border-t border-border pt-4 text-sm">
                      <p className="text-caption text-muted-foreground">Your vehicle</p>
                      <p className="font-medium text-deep-navy">
                        {vehicle.make} {vehicle.model} · {vehicle.color}
                      </p>
                      <p className="text-muted-foreground">{vehicle.registrationNumber}</p>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {payment ? (
                <div className="rounded-2xl border border-border bg-warm-white p-5 shadow-soft">
                  <h2 className="text-h3">Payment</h2>
                  <p className="mt-3 text-lg font-semibold text-deep-navy">
                    {formatCurrency(payment.amount, payment.currency)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {payment.status} · {payment.method} · {payment.transactionReference}
                  </p>
                  <Link
                    href={userRoutes.payments}
                    className={cn(buttonVariants({ variant: "link" }), "mt-2 px-0")}
                  >
                    View payment history
                  </Link>
                </div>
              ) : null}

              <div className="rounded-2xl border border-border bg-warm-white p-5 shadow-soft space-y-3">
                <h2 className="text-h3">Actions</h2>
                {actions?.canSimulateDispatch ? (
                  <Button
                    type="button"
                    className="w-full"
                    disabled={dispatchBooking.isPending}
                    onClick={() => void onDispatch()}
                  >
                    {dispatchBooking.isPending
                      ? "Finding driver…"
                      : "Find driver (mock dispatch)"}
                  </Button>
                ) : null}
                {actions?.canCancel ? (
                  <Button
                    type="button"
                    variant="destructive"
                    className="w-full"
                    onClick={() => setCancelOpen(true)}
                  >
                    Cancel booking
                  </Button>
                ) : null}
                {actionError ? (
                  <p className="text-sm text-destructive" role="alert">
                    {actionError}
                  </p>
                ) : null}
              </div>
            </aside>
          </div>
        ) : null}
      </DataState>

      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel this booking?</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel? This updates the booking in the mock API.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setCancelOpen(false)}>
              Keep booking
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={cancelBooking.isPending}
              onClick={() => void onCancel()}
            >
              {cancelBooking.isPending ? "Cancelling…" : "Cancel booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
