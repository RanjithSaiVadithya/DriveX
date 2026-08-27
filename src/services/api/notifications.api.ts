import { apiClient } from "./client";
import { endpoints } from "./endpoints";
import type { ApiCollectionResponse, ApiSuccessResponse } from "@/types/api";
import type { Notification } from "@/types/notification";

export const notificationsApi = {
  list() {
    return apiClient<ApiCollectionResponse<Notification>>(
      endpoints.notifications.list,
    );
  },
  markRead(id: string) {
    return apiClient<ApiSuccessResponse<Notification>>(
      endpoints.notifications.read(id),
      { method: "PATCH" },
    );
  },
  markAllRead() {
    return apiClient<ApiSuccessResponse<{ updated: number }>>(
      endpoints.notifications.readAll,
      { method: "PATCH" },
    );
  },
};
