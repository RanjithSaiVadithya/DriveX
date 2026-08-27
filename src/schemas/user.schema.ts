import { z } from "zod";

export const userProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10).max(15),
  email: z.string().email(),
  avatar: z.string().url().nullable().optional(),
});

export type UserProfileInput = z.infer<typeof userProfileSchema>;
