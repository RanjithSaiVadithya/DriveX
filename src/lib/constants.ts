export const APP_ROLES = {
  USER: "USER",
  DRIVER: "DRIVER",
  ADMIN: "ADMIN",
  DISPATCHER: "DISPATCHER",
  FLEET_MANAGER: "FLEET_MANAGER",
  SUPPORT: "SUPPORT",
} as const;

export const ACTIVE_ROLES = {
  USER: APP_ROLES.USER,
  DRIVER: APP_ROLES.DRIVER,
} as const;

export const VEHICLE_TYPES = {
  HATCHBACK: "HATCHBACK",
  SEDAN: "SEDAN",
  SUV: "SUV",
  PREMIUM: "PREMIUM",
} as const;

export const MOCK_OTP = "123456";

export const SESSION_STORAGE_KEY = "driverdosth_session";

export const API_TIMEOUT_MS = 15_000;

export const DEFAULT_CURRENCY = "INR";
