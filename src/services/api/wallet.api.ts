import { apiClient } from "./client";
import { endpoints } from "./endpoints";
import type { ApiCollectionResponse, ApiSuccessResponse } from "@/types/api";
import type { WalletTransaction } from "@/types/wallet";

export interface WalletSummary {
  balance: number;
  currency: string;
  driverId: string;
}

export const walletApi = {
  summary() {
    return apiClient<ApiSuccessResponse<WalletSummary>>(endpoints.wallet.summary);
  },
  transactions() {
    return apiClient<ApiCollectionResponse<WalletTransaction>>(
      endpoints.wallet.transactions,
    );
  },
  withdraw(amount: number) {
    return apiClient<
      ApiSuccessResponse<{
        transaction: WalletTransaction;
        balance: number;
        currency: string;
        driverId: string;
      }>
    >(endpoints.wallet.withdraw, {
      method: "POST",
      body: { amount },
    });
  },
};
