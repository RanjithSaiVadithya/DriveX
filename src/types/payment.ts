export type PaymentMethod = "CARD" | "UPI" | "CASH" | "WALLET";

export type PaymentStatus =
  | "PENDING"
  | "AUTHORIZED"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionReference: string;
  createdAt: string;
  updatedAt: string;
}
