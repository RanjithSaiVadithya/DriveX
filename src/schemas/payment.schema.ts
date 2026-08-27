import { z } from "zod";

export const paymentSchema = z.object({
  bookingId: z.string().min(1),
  amount: z.number().positive(),
  currency: z.string().length(3).default("INR"),
  method: z.enum(["CARD", "UPI", "CASH", "WALLET"]),
});

export type PaymentInput = z.infer<typeof paymentSchema>;
