import type { DriverAvailability } from "@/types/driver";
import type { TripStatus } from "@/types/trip";
import {
  canGoOffline as canTransitionOffline,
  canGoOnline as canTransitionOnline,
} from "@/services/domain/driver-state";

const ACTIVE_TRIP: TripStatus[] = [
  "ASSIGNED",
  "DRIVER_ARRIVING",
  "DRIVER_ARRIVED",
  "STARTED",
];

export function isActiveDriverTripStatus(status: TripStatus): boolean {
  return ACTIVE_TRIP.includes(status);
}

export function canGoOnline(availability: DriverAvailability): boolean {
  return canTransitionOnline(availability);
}

/** Offline is blocked while the driver has an active trip. */
export function canGoOffline(
  availability: DriverAvailability,
  activeTripStatus?: TripStatus | null,
): { allowed: boolean; reason?: string } {
  if (activeTripStatus && isActiveDriverTripStatus(activeTripStatus)) {
    return {
      allowed: false,
      reason: "You can't go offline while a trip is active.",
    };
  }
  if (!canTransitionOffline(availability)) {
    return { allowed: false, reason: "You are already offline." };
  }
  return { allowed: true };
}

export function getDriverTripStatusLabel(status: TripStatus): string {
  const labels: Record<TripStatus, string> = {
    ASSIGNED: "Assigned",
    DRIVER_ARRIVING: "You're on the way",
    DRIVER_ARRIVED: "You've arrived",
    STARTED: "Trip in progress",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  };
  return labels[status];
}

export function getDriverAvailabilityLabel(
  availability: DriverAvailability,
): string {
  const labels: Record<DriverAvailability, string> = {
    OFFLINE: "Offline",
    ONLINE: "Online",
    BUSY: "Busy",
  };
  return labels[availability];
}
