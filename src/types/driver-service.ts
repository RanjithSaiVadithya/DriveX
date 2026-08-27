/**
 * Driving service the User is booking — not a vehicle category.
 * Centralized so business can change offerings without rewriting UI.
 */
export type DriverServiceType =
  | "POINT_TO_POINT"
  | "HOURLY"
  | "FULL_DAY"
  | "AIRPORT"
  | "OUTSTATION";
