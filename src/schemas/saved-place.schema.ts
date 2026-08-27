import { z } from "zod";

export const savedPlaceSchema = z.object({
  label: z.string().min(1),
  address: z.string().min(3),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export type SavedPlaceInput = z.infer<typeof savedPlaceSchema>;
