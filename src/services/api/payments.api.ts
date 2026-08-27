import { apiClient } from "./client";
import { endpoints } from "./endpoints";
import type { ApiCollectionResponse, ApiSuccessResponse } from "@/types/api";
import type { Payment } from "@/types/payment";
import type { PaymentInput } from "@/schemas/payment.schema";

export const paymentsApi = {
  list() {
    return apiClient<ApiCollectionResponse<Payment>>(endpoints.payments.list);
  },
  get(id: string) {
    return apiClient<ApiSuccessResponse<Payment>>(endpoints.payments.detail(id));
  },
  create(payload: PaymentInput) {
    return apiClient<ApiSuccessResponse<Payment>>(endpoints.payments.create, {
      method: "POST",
      body: payload,
    });
  },
};
