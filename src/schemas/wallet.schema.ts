import { z } from "zod";

export const withdrawSchema = z.object({
  amount: z
    .number({ error: "Amount is required" })
    .positive("Amount must be greater than zero"),
});

export type WithdrawInput = z.infer<typeof withdrawSchema>;
