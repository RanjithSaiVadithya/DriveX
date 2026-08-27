import type { Address } from "./address";
import type { DriverServiceType } from "./driver-service";

export type BookingStatus =
  | "REQUESTED"
  | "SEARCHING"
  | "DRIVER_ASSIGNED"
  | "CONFIRMED"
  | "CANCELLED"
  | "EXPIRED";

export interface Booking {
  id: string;
  userId: string;
  driverId: string | null;
  /** Vehicle owned by the User for this driver booking */
  userVehicleId: string;
  pickup: Address;
  destination: Address;
  scheduledAt: string | null;
  serviceType: DriverServiceType;
  estimatedFare: number;
  finalFare: number | null;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}
