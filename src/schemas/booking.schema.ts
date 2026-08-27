import { z } from "zod";

export const addressSchema = z.object({
  label: z.string().min(1),
  address: z.string().min(3),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const bookingSchema = z.object({
  pickup: addressSchema,
  destination: addressSchema,
  scheduledAt: z.string().datetime().nullable().optional(),
  userVehicleId: z.string().min(1),
  serviceType: z.enum([
    "POINT_TO_POINT",
    "HOURLY",
    "FULL_DAY",
    "AIRPORT",
    "OUTSTATION",
  ]),
});

export type BookingInput = z.infer<typeof bookingSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
