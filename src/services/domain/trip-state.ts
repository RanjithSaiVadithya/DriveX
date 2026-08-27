import type { TripStatus } from "@/types/trip";

const tripTransitions: Record<TripStatus, TripStatus[]> = {
  ASSIGNED: ["DRIVER_ARRIVING", "CANCELLED"],
  DRIVER_ARRIVING: ["DRIVER_ARRIVED", "CANCELLED"],
  DRIVER_ARRIVED: ["STARTED", "CANCELLED"],
  STARTED: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
};

export function canTransitionTrip(from: TripStatus, to: TripStatus): boolean {
  return tripTransitions[from].includes(to);
}

export function assertTripTransition(from: TripStatus, to: TripStatus): void {
  if (!canTransitionTrip(from, to)) {
    throw new Error(`Invalid trip transition: ${from} → ${to}`);
  }
}

export function canAcceptTrip(status: TripStatus): boolean {
  return status === "ASSIGNED";
}

export function canRejectTrip(status: TripStatus): boolean {
  return status === "ASSIGNED";
}

export function canStartTrip(status: TripStatus): boolean {
  return canTransitionTrip(status, "STARTED");
}

export function canCompleteTrip(status: TripStatus): boolean {
  return canTransitionTrip(status, "COMPLETED");
}

export function canCancelTrip(status: TripStatus): boolean {
  return canTransitionTrip(status, "CANCELLED");
}

export function canMarkArriving(status: TripStatus): boolean {
  return canTransitionTrip(status, "DRIVER_ARRIVING");
}

export function canMarkArrived(status: TripStatus): boolean {
  return canTransitionTrip(status, "DRIVER_ARRIVED");
}

export function getAllowedTripTransitions(status: TripStatus): TripStatus[] {
  return [...tripTransitions[status]];
}
