import type { Address } from "./address";

export type TripStatus =
  | "ASSIGNED"
  | "DRIVER_ARRIVING"
  | "DRIVER_ARRIVED"
  | "STARTED"
  | "COMPLETED"
  | "CANCELLED";

export interface Trip {
  id: string;
  bookingId: string;
  userId: string;
  driverId: string;
  /** Customer's vehicle the driver will operate */
  userVehicleId: string;
  pickup: Address;
  destination: Address;
  startedAt: string | null;
  completedAt: string | null;
  status: TripStatus;
  fare: number | null;
  createdAt: string;
}
