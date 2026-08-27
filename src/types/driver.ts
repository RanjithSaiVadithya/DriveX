export type DriverAvailability = "OFFLINE" | "ONLINE" | "BUSY";

export type VerificationStatus =
  | "PENDING"
  | "IN_REVIEW"
  | "VERIFIED"
  | "REJECTED";

export type DriverStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

/** Driver is a service provider — no owned vehicle in this domain. */
export interface Driver {
  id: string;
  userId: string;
  status: DriverStatus;
  availability: DriverAvailability;
  rating: number;
  totalTrips: number;
  verificationStatus: VerificationStatus;
  documents: string[];
  createdAt: string;
  updatedAt: string;
}
