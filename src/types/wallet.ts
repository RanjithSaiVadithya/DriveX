export type WalletTransactionType =
  | "TRIP_EARNING"
  | "WITHDRAWAL"
  | "REFUND"
  | "ADJUSTMENT"
  | "BONUS";

export type WalletTransactionStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface WalletTransaction {
  id: string;
  driverId: string;
  type: WalletTransactionType;
  amount: number;
  balanceAfter: number;
  referenceType: string;
  referenceId: string;
  description: string;
  createdAt: string;
  status: WalletTransactionStatus;
}
