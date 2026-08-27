import { apiClient } from "./client";
import { endpoints } from "./endpoints";
import type { ApiCollectionResponse } from "@/types/api";
import type { Earning } from "@/types/earning";

export const earningsApi = {
  list() {
    return apiClient<ApiCollectionResponse<Earning>>(endpoints.earnings.list);
  },
};
