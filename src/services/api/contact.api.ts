import { apiClient } from "./client";
import { endpoints } from "./endpoints";
import type { ApiSuccessResponse } from "@/types/api";
import type { ContactInput } from "@/schemas/contact.schema";

export const contactApi = {
  submit(payload: ContactInput) {
    return apiClient<ApiSuccessResponse<{ id: string }>>(endpoints.contact.submit, {
      method: "POST",
      body: payload,
    });
  },
};
