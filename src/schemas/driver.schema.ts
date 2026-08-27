import { z } from "zod";

export const driverProfileSchema = z.object({
  availability: z.enum(["OFFLINE", "ONLINE", "BUSY"]),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]).optional(),
});

export const driverStatusSchema = z.object({
  availability: z.enum(["OFFLINE", "ONLINE", "BUSY"]),
});

export type DriverProfileInput = z.infer<typeof driverProfileSchema>;
export type DriverStatusInput = z.infer<typeof driverStatusSchema>;
