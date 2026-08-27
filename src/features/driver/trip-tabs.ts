import type { DriverTripSummary } from "@/services/api/drivers.api";
import type { TripStatus } from "@/types/trip";
import { isActiveDriverTripStatus } from "@/services/domain/driver.service";

export type DriverTripTab =
  | "requests"
  | "upcoming"
  | "active"
  | "completed"
  | "cancelled";

export function classifyDriverTrip(trip: DriverTripSummary): DriverTripTab {
  if (trip.status === "CANCELLED") return "cancelled";
  if (trip.status === "COMPLETED") return "completed";
  if (trip.status === "ASSIGNED" && trip.booking?.status !== "CONFIRMED") {
    return "requests";
  }
  if (trip.status === "ASSIGNED" && trip.booking?.status === "CONFIRMED") {
    return "upcoming";
  }
  if (isActiveDriverTripStatus(trip.status as TripStatus)) {
    if (trip.status === "ASSIGNED") return "upcoming";
    return "active";
  }
  return "upcoming";
}

export function getActiveDriverTrip(trips: DriverTripSummary[]) {
  return (
    trips.find((t) =>
      ["DRIVER_ARRIVING", "DRIVER_ARRIVED", "STARTED"].includes(t.status),
    ) ?? null
  );
}

export function getPendingDriverRequests(trips: DriverTripSummary[]) {
  return trips.filter((t) => classifyDriverTrip(t) === "requests");
}
