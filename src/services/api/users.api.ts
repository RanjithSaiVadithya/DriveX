import { apiClient } from "./client";
import { endpoints } from "./endpoints";
import type { ApiCollectionResponse, ApiSuccessResponse } from "@/types/api";
import type { Booking } from "@/types/booking";
import type { Notification } from "@/types/notification";
import type { Payment } from "@/types/payment";
import type { SavedPlace } from "@/types/saved-place";
import type { User } from "@/types/user";
import type { UserProfileInput } from "@/schemas/user.schema";

export const usersApi = {
  me() {
    return apiClient<ApiSuccessResponse<User>>(endpoints.users.me);
  },
  updateMe(payload: UserProfileInput) {
    return apiClient<ApiSuccessResponse<User>>(endpoints.users.updateMe, {
      method: "PATCH",
      body: payload,
    });
  },
  bookings() {
    return apiClient<ApiCollectionResponse<Booking>>(endpoints.users.bookings);
  },
  payments() {
    return apiClient<ApiCollectionResponse<Payment>>(endpoints.users.payments);
  },
  notifications() {
    return apiClient<ApiCollectionResponse<Notification>>(
      endpoints.users.notifications,
    );
  },
  savedPlaces() {
    return apiClient<ApiCollectionResponse<SavedPlace>>(
      endpoints.users.savedPlaces,
    );
  },
};
