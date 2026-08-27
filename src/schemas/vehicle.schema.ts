import { z } from "zod";

export const userVehicleSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().int().min(1990).max(2100),
  registrationNumber: z.string().min(5, "Registration number is required"),
  color: z.string().min(2, "Color is required"),
  vehicleType: z.enum(["HATCHBACK", "SEDAN", "SUV", "PREMIUM"]),
  capacity: z.number().int().min(1).max(8),
});

export type UserVehicleInput = z.infer<typeof userVehicleSchema>;

/** @deprecated Prefer userVehicleSchema */
export const vehicleSchema = userVehicleSchema;
export type VehicleInput = UserVehicleInput;
