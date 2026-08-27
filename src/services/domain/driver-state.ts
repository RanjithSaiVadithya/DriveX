import type { DriverAvailability } from "@/types/driver";

const availabilityTransitions: Record<
  DriverAvailability,
  DriverAvailability[]
> = {
  OFFLINE: ["ONLINE"],
  ONLINE: ["OFFLINE", "BUSY"],
  BUSY: ["ONLINE", "OFFLINE"],
};

export function canTransitionAvailability(
  from: DriverAvailability,
  to: DriverAvailability,
): boolean {
  return availabilityTransitions[from].includes(to);
}

export function assertAvailabilityTransition(
  from: DriverAvailability,
  to: DriverAvailability,
): void {
  if (!canTransitionAvailability(from, to)) {
    throw new Error(`Invalid availability transition: ${from} → ${to}`);
  }
}

export function canGoOnline(status: DriverAvailability): boolean {
  return canTransitionAvailability(status, "ONLINE");
}

export function canGoOffline(status: DriverAvailability): boolean {
  return canTransitionAvailability(status, "OFFLINE");
}

export function canGoBusy(status: DriverAvailability): boolean {
  return canTransitionAvailability(status, "BUSY");
}
