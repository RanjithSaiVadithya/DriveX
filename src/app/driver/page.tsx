"use client";

import Link from "next/link";
import { toast } from "sonner";
import { DataState } from "@/components/shared/data-state";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useDriver } from "@/hooks/use-driver";
import { useDriverTrips } from "@/hooks/use-driver-trips";
import { useEarnings } from "@/hooks/use-earnings";
import { driverRoutes } from "@/config/routes";
import { getDriverServiceLabel } from "@/config/driver-services";
import {
  canGoOffline,
  canGoOnline,
  getDriverAvailabilityLabel,
  getDriverTripStatusLabel,
} from "@/services/domain/driver.service";
import {
  filterEarningsByPeriod,
  sumNetEarnings,
} from "@/services/domain/earning.service";
import { formatCurrency, greetingForNow } from "@/services/domain/booking.service";
import { isAppError } from "@/services/domain/errors";
import {
  getActiveDriverTrip,
  getPendingDriverRequests,
} from "@/features/driver/trip-tabs";
import { cn } from "@/lib/utils";

export default function DriverDashboardPage() {
  const { user } = useAuth();
  const { data: driver, isLoading: driverLoading, setStatus } = useDriver();
  const { listQuery } = useDriverTrips();
  const earningsQuery = useEarnings();

  const trips = listQuery.data ?? [];
  const activeTrip = getActiveDriverTrip(trips);
  const requests = getPendingDriverRequests(trips);
  const firstRequest = requests[0] ?? null;

  const todayEarnings = filterEarningsByPeriod(
    earningsQuery.data ?? [],
    "today",
  );
  const todayNet = sumNetEarnings(todayEarnings);
  const todayTrips = todayEarnings.length;

  const offlineCheck = canGoOffline(
    driver?.availability ?? "OFFLINE",
    activeTrip?.status,
  );

  async function goOnline() {
    try {
      await setStatus.mutateAsync("ONLINE");
      toast.success("You are online");
    } catch (err) {
      toast.error(isAppError(err) ? err.message : "Unable to go online");
    }
  }

  async function goOffline() {
    if (!offlineCheck.allowed) {
      toast.error(offlineCheck.reason ?? "Unable to go offline");
      return;
    }
    try {
      await setStatus.mutateAsync("OFFLINE");
      toast.success("You are offline");
    } catch (err) {
      toast.error(isAppError(err) ? err.message : "Unable to go offline");
    }
  }

  const firstName = user?.name?.split(" ")[0] ?? "Driver";

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-h1">
          {greetingForNow()}, {firstName}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Drive customers&apos; vehicles — operational dashboard.
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-warm-white p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="mt-1 flex items-center gap-2 text-lg font-semibold text-deep-navy">
              <span
                className={cn(
                  "inline-block size-2.5 rounded-full",
                  driver?.availability === "ONLINE"
                    ? "bg-olive"
                    : driver?.availability === "BUSY"
                      ? "bg-orange"
                      : "bg-muted-foreground",
                )}
                aria-hidden
              />
              <span>
                {driver
                  ? getDriverAvailabilityLabel(driver.availability)
                  : "—"}
              </span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {canGoOnline(driver?.availability ?? "OFFLINE") ? (
              <Button
                type="button"
                disabled={setStatus.isPending || driverLoading}
                onClick={() => void goOnline()}
              >
                {setStatus.isPending ? "Updating…" : "Go Online"}
              </Button>
            ) : null}
            {driver?.availability === "ONLINE" ||
            driver?.availability === "BUSY" ? (
              <Button
                type="button"
                variant="outline"
                disabled={setStatus.isPending || !offlineCheck.allowed}
                onClick={() => void goOffline()}
              >
                Go Offline
              </Button>
            ) : null}
          </div>
        </div>
        {!offlineCheck.allowed && offlineCheck.reason ? (
          <p className="mt-3 text-sm text-muted-foreground">{offlineCheck.reason}</p>
        ) : null}
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Today's Earnings", value: formatCurrency(todayNet) },
          { label: "Today's Trips", value: String(todayTrips) },
          {
            label: "Rating",
            value: driver?.rating != null ? `★ ${driver.rating.toFixed(1)}` : "—",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-border bg-warm-white p-4 shadow-soft"
          >
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold text-deep-navy">{card.value}</p>
          </div>
        ))}
      </section>

      {activeTrip ? (
        <section className="rounded-2xl border border-olive/30 bg-olive/5 p-5 shadow-soft">
          <p className="text-caption uppercase tracking-wide text-olive">
            Current trip
          </p>
          <h2 className="mt-1 text-h3 text-deep-navy">
            {getDriverTripStatusLabel(activeTrip.status)}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {activeTrip.pickup.label} → {activeTrip.destination.label}
          </p>
          {activeTrip.userVehicle ? (
            <p className="mt-2 text-sm text-deep-navy">
              Customer vehicle: {activeTrip.userVehicle.make}{" "}
              {activeTrip.userVehicle.model} ·{" "}
              {activeTrip.userVehicle.registrationNumber}
            </p>
          ) : null}
          <Link
            href={driverRoutes.tripDetail(activeTrip.id)}
            className={cn(buttonVariants(), "mt-4 inline-flex")}
          >
            Open trip
          </Link>
        </section>
      ) : firstRequest ? (
        <section className="rounded-2xl border border-orange/30 bg-orange/5 p-5 shadow-soft">
          <p className="text-caption uppercase tracking-wide text-orange">
            New driver request
          </p>
          <h2 className="mt-1 text-h3 text-deep-navy">
            {firstRequest.pickup.label} → {firstRequest.destination.label}
          </h2>
          {firstRequest.userVehicle ? (
            <p className="mt-2 text-sm">
              Customer vehicle: {firstRequest.userVehicle.make}{" "}
              {firstRequest.userVehicle.model} ·{" "}
              {firstRequest.userVehicle.registrationNumber}
            </p>
          ) : null}
          {firstRequest.booking ? (
            <p className="mt-1 text-sm text-muted-foreground">
              {getDriverServiceLabel(firstRequest.booking.serviceType)} · Est.{" "}
              {formatCurrency(firstRequest.booking.estimatedFare)}
            </p>
          ) : null}
          <Link
            href={driverRoutes.tripDetail(firstRequest.id)}
            className={cn(buttonVariants(), "mt-4 inline-flex")}
          >
            Review request
          </Link>
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed border-border bg-warm-white p-5">
          <h2 className="text-h3">No active trip</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {driver?.availability === "ONLINE"
              ? "You're online. New driver bookings will appear here."
              : "Go online to receive driver booking requests."}
          </p>
          <Link
            href={driverRoutes.trips}
            className={cn(buttonVariants({ variant: "outline" }), "mt-4 inline-flex")}
          >
            View trips
          </Link>
        </section>
      )}

      <DataState
        isLoading={listQuery.isLoading && !listQuery.data}
        isError={listQuery.isError}
        errorMessage="Unable to load trips"
        onRetry={() => void listQuery.refetch()}
        isEmpty={false}
      >
        {null}
      </DataState>
    </div>
  );
}
