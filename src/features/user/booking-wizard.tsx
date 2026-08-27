"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { mockLocations } from "@/config/locations";
import {
  driverServiceCatalog,
  getDriverServiceLabel,
} from "@/config/driver-services";
import { calculateFareEstimate } from "@/services/domain/fare.service";
import { formatCurrency } from "@/services/domain/booking.service";
import { useBookings } from "@/hooks/use-bookings";
import { useSavedPlaces } from "@/hooks/use-saved-places";
import { useUserVehicles } from "@/hooks/use-user-vehicles";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VehicleCard } from "@/components/shared/domain-cards";
import { userRoutes } from "@/config/routes";
import type { Address } from "@/types/address";
import type { DriverServiceType } from "@/types/driver-service";
import { cn } from "@/lib/utils";
import { isAppError } from "@/services/domain/errors";

const STEPS = [
  "Pickup",
  "Destination",
  "When",
  "Your vehicle",
  "Service",
  "Estimate",
  "Confirm",
] as const;

function LocationPicker({
  label,
  value,
  onChange,
  saved,
}: {
  label: string;
  value: Address | null;
  onChange: (loc: Address) => void;
  saved: Address[];
}) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = [
      ...saved.map((s) => ({ ...s, id: `saved-${s.label}` })),
      ...mockLocations,
    ];
    if (!q) return pool;
    return pool.filter(
      (l) =>
        l.label.toLowerCase().includes(q) ||
        l.address.toLowerCase().includes(q),
    );
  }, [query, saved]);

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search location"
        className="h-12"
        aria-label={`Search ${label.toLowerCase()}`}
      />
      {value ? (
        <p className="rounded-md bg-olive/10 px-3 py-2 text-sm text-deep-navy">
          Selected: <strong>{value.label}</strong> — {value.address}
        </p>
      ) : null}
      <ul className="max-h-56 space-y-2 overflow-y-auto">
        {filtered.map((loc) => (
          <li key={`${loc.label}-${loc.address}`}>
            <button
              type="button"
              onClick={() =>
                onChange({
                  label: loc.label,
                  address: loc.address,
                  latitude: loc.latitude,
                  longitude: loc.longitude,
                })
              }
              className={cn(
                "w-full rounded-lg border border-border bg-warm-white px-3 py-3 text-left text-sm hover:border-olive",
                value?.address === loc.address && "border-olive bg-olive/5",
              )}
            >
              <span className="font-semibold text-deep-navy">{loc.label}</span>
              <span className="mt-0.5 block text-muted-foreground">{loc.address}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BookingWizard() {
  const router = useRouter();
  const { createBooking, dispatchBooking } = useBookings();
  const { listQuery: savedQuery } = useSavedPlaces();
  const { listQuery: vehiclesQuery } = useUserVehicles();
  const [step, setStep] = useState(0);
  const [pickup, setPickup] = useState<Address | null>(null);
  const [destination, setDestination] = useState<Address | null>(null);
  const [whenMode, setWhenMode] = useState<"now" | "later">("now");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [userVehicleId, setUserVehicleId] = useState<string | null>(null);
  const [serviceType, setServiceType] =
    useState<DriverServiceType>("POINT_TO_POINT");
  const [error, setError] = useState<string | null>(null);

  const vehicles = vehiclesQuery.data ?? [];
  const selectedVehicle = vehicles.find((v) => v.id === userVehicleId) ?? null;

  const savedAsAddresses: Address[] = (savedQuery.data ?? []).map((p) => ({
    label: p.label,
    address: p.address,
    latitude: p.latitude,
    longitude: p.longitude,
  }));

  function scheduledAtIso(): string | null {
    if (whenMode === "now") return null;
    if (!date || !time) return null;
    return new Date(`${date}T${time}:00`).toISOString();
  }

  const estimate =
    pickup && destination
      ? calculateFareEstimate({
          pickup,
          destination,
          serviceType,
          scheduledAt: scheduledAtIso(),
        })
      : null;

  function canContinue(): boolean {
    if (step === 0) return Boolean(pickup);
    if (step === 1) return Boolean(destination && destination.address !== pickup?.address);
    if (step === 2) {
      if (whenMode === "now") return true;
      return Boolean(date && time);
    }
    if (step === 3) return Boolean(userVehicleId);
    if (step === 4) return Boolean(serviceType);
    return true;
  }

  function goNext() {
    if (step === 2 && whenMode === "later") {
      if (!date || !time) {
        setError("Choose a valid date and time");
        return;
      }
      if (new Date(`${date}T${time}:00`).getTime() <= Date.now()) {
        setError("Schedule time must be in the future");
        return;
      }
    }
    setError(null);
    setStep((s) => s + 1);
  }

  async function confirm() {
    if (!pickup || !destination || !estimate || !userVehicleId) return;
    setError(null);
    try {
      const res = await createBooking.mutateAsync({
        pickup,
        destination,
        userVehicleId,
        serviceType,
        scheduledAt: scheduledAtIso(),
      });
      if (whenMode === "now") {
        await dispatchBooking.mutateAsync(res.data.id);
      }
      toast.success("Driver booking created");
      router.push(userRoutes.bookingDetail(res.data.id));
    } catch (err) {
      setError(isAppError(err) ? err.message : "Unable to create booking");
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <ol className="mb-6 flex flex-wrap gap-2" aria-label="Booking steps">
        {STEPS.map((name, index) => (
          <li
            key={name}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold",
              index === step
                ? "bg-olive text-warm-white"
                : index < step
                  ? "bg-olive/15 text-olive"
                  : "bg-muted text-muted-foreground",
            )}
          >
            {index + 1}. {name}
          </li>
        ))}
      </ol>

      <div className="rounded-2xl border border-border bg-warm-white p-5 shadow-soft sm:p-6">
        {step === 0 ? (
          <LocationPicker
            label="Pickup location"
            value={pickup}
            onChange={setPickup}
            saved={savedAsAddresses}
          />
        ) : null}

        {step === 1 ? (
          <LocationPicker
            label="Destination"
            value={destination}
            onChange={setDestination}
            saved={savedAsAddresses}
          />
        ) : null}

        {step === 2 ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-deep-navy">
              When do you need a driver?
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                className={cn(
                  "rounded-xl border p-4 text-left",
                  whenMode === "now" ? "border-olive bg-olive/10" : "border-border",
                )}
                onClick={() => setWhenMode("now")}
              >
                <span className="font-semibold text-deep-navy">Now</span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  Request immediately
                </span>
              </button>
              <button
                type="button"
                className={cn(
                  "rounded-xl border p-4 text-left",
                  whenMode === "later" ? "border-olive bg-olive/10" : "border-border",
                )}
                onClick={() => setWhenMode("later")}
              >
                <span className="font-semibold text-deep-navy">Schedule for later</span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  Pick a date and time
                </span>
              </button>
            </div>
            {whenMode === "later" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-deep-navy">
              Which vehicle will you use?
            </h2>
            <p className="text-sm text-muted-foreground">
              Select one of your registered vehicles. The driver will drive this
              vehicle.
            </p>
            {vehiclesQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">Loading your vehicles…</p>
            ) : null}
            {vehicles.length === 0 && !vehiclesQuery.isLoading ? (
              <div className="rounded-xl border border-dashed border-border p-4">
                <p className="text-sm text-muted-foreground">
                  Add a vehicle before booking a driver.
                </p>
                <Link
                  href={userRoutes.vehicles}
                  className={cn(buttonVariants({ variant: "navy" }), "mt-3")}
                >
                  My Vehicles
                </Link>
              </div>
            ) : null}
            <ul className="space-y-3">
              {vehicles.map((v) => (
                <li key={v.id}>
                  <button
                    type="button"
                    onClick={() => setUserVehicleId(v.id)}
                    className={cn(
                      "w-full rounded-xl border p-1 text-left",
                      userVehicleId === v.id
                        ? "border-olive bg-olive/10"
                        : "border-border",
                    )}
                  >
                    <VehicleCard
                      name={`${v.make} ${v.model}`}
                      detail={`${v.registrationNumber} · ${v.color}`}
                      className="border-0 shadow-none"
                    />
                    <span className="block px-4 pb-3 text-sm font-semibold text-olive">
                      {userVehicleId === v.id ? "Selected" : "Select"}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {step === 4 ? (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-deep-navy">
              Choose the driving service you need
            </h2>
            {(Object.keys(driverServiceCatalog) as DriverServiceType[]).map(
              (type) => {
                const item = driverServiceCatalog[type];
                const est =
                  pickup && destination
                    ? calculateFareEstimate({
                        pickup,
                        destination,
                        serviceType: type,
                        scheduledAt: scheduledAtIso(),
                      })
                    : null;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setServiceType(type)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl border p-4 text-left",
                      serviceType === type
                        ? "border-olive bg-olive/10"
                        : "border-border",
                    )}
                  >
                    <span>
                      <span className="block font-semibold text-deep-navy">
                        {item.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {item.description}
                      </span>
                    </span>
                    <span className="text-sm font-semibold text-olive">
                      {est ? formatCurrency(est.estimatedTotal) : "—"}
                    </span>
                  </button>
                );
              },
            )}
          </div>
        ) : null}

        {step === 5 && estimate ? (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-deep-navy">
              Estimated driver fare
            </h2>
            <p className="text-sm text-muted-foreground">
              Mock estimate for the driving service — not a vehicle rental or
              final payment.
            </p>
            <dl className="space-y-2 rounded-xl border border-border bg-cream/50 p-4 text-sm">
              <div className="flex justify-between">
                <dt>Base fare</dt>
                <dd>{formatCurrency(estimate.baseFare)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Distance ({estimate.distanceKm} km)</dt>
                <dd>{formatCurrency(estimate.distanceFare)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Service fee</dt>
                <dd>{formatCurrency(estimate.serviceFee)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-base font-semibold text-deep-navy">
                <dt>Estimated total</dt>
                <dd>{formatCurrency(estimate.estimatedTotal)}</dd>
              </div>
            </dl>
          </div>
        ) : null}

        {step === 6 && pickup && destination && estimate ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-deep-navy">
              Confirm driver booking
            </h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Pickup</dt>
                <dd className="font-medium text-deep-navy">{pickup.address}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Destination</dt>
                <dd className="font-medium text-deep-navy">{destination.address}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">When</dt>
                <dd className="font-medium text-deep-navy">
                  {whenMode === "now" ? "Now" : `${date} ${time}`}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Your vehicle</dt>
                <dd className="font-medium text-deep-navy">
                  {selectedVehicle
                    ? `${selectedVehicle.make} ${selectedVehicle.model} · ${selectedVehicle.registrationNumber}`
                    : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Driver service</dt>
                <dd className="font-medium text-deep-navy">
                  {getDriverServiceLabel(serviceType)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Estimated fare</dt>
                <dd className="font-medium text-deep-navy">
                  {formatCurrency(estimate.estimatedTotal)}
                </dd>
              </div>
            </dl>
          </div>
        ) : null}

        {error ? (
          <p className="mt-4 text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="outline"
            disabled={step === 0 || createBooking.isPending}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button type="button" disabled={!canContinue()} onClick={goNext}>
              Continue
            </Button>
          ) : (
            <Button
              type="button"
              disabled={createBooking.isPending || dispatchBooking.isPending}
              onClick={() => void confirm()}
            >
              {createBooking.isPending || dispatchBooking.isPending
                ? "Confirming…"
                : "Confirm Driver Booking"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
