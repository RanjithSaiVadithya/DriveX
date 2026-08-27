import { z } from "zod";
import { addressSchema } from "./booking.schema";

export const tripActionSchema = z.object({
  tripId: z.string().min(1),
});

export const tripLocationUpdateSchema = z.object({
  location: addressSchema.optional(),
});

export type TripActionInput = z.infer<typeof tripActionSchema>;
