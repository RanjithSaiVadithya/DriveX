/** Physical vehicle types for a User-owned car (not platform inventory). */
export type VehicleType = "HATCHBACK" | "SEDAN" | "SUV" | "PREMIUM";

export type UserVehicleStatus = "ACTIVE" | "INACTIVE";

/**
 * Vehicle owned/registered by a User.
 * Drivers never own vehicles in this domain.
 */
export interface UserVehicle {
  id: string;
  userId: string;
  make: string;
  model: string;
  year: number;
  registrationNumber: string;
  color: string;
  vehicleType: VehicleType;
  capacity: number;
  status: UserVehicleStatus;
  createdAt: string;
  updatedAt: string;
}

/** @deprecated Use UserVehicle — kept only if any transitional imports remain */
export type Vehicle = UserVehicle;
