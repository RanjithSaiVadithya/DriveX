import { apiClient } from "./client";
import { endpoints } from "./endpoints";
import type { ApiCollectionResponse, ApiSuccessResponse } from "@/types/api";
import type { Rating } from "@/types/rating";

export const ratingsApi = {
  list() {
    return apiClient<ApiCollectionResponse<Rating>>(endpoints.ratings.list);
  },
  create(payload: Omit<Rating, "id" | "createdAt">) {
    return apiClient<ApiSuccessResponse<Rating>>(endpoints.ratings.create, {
      method: "POST",
      body: payload,
    });
  },
};
