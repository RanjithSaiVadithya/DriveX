export type EarningStatus = "PENDING" | "AVAILABLE" | "PAID_OUT";

export interface Earning {
  id: string;
  driverId: string;
  tripId: string;
  grossAmount: number;
  commission: number;
  netAmount: number;
  currency: string;
  status: EarningStatus;
  earnedAt: string;
  createdAt: string;
}
