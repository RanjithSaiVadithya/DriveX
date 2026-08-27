import { apiClient } from "./client";
import { endpoints } from "./endpoints";
import type { ApiSuccessResponse } from "@/types/api";
import type { Trip } from "@/types/trip";
import type { Booking } from "@/types/booking";
import type { UserVehicle } from "@/types/vehicle";
import type { User } from "@/types/user";

export const tripsApi = {
  get(id: string) {
    return apiClient<ApiSuccessResponse<Trip>>(endpoints.trips.detail(id));
  },
  details(id: string) {
    return apiClient<
      ApiSuccessResponse<{
        trip: Trip;
        booking: Booking | null;
        userVehicle: UserVehicle | null;
        customer: User | null;
      }>
    >(endpoints.trips.details(id));
  },
  accept(id: string) {
    return apiClient<ApiSuccessResponse<Trip>>(endpoints.trips.accept(id), {
      method: "POST",
    });
  },
  arriving(id: string) {
    return apiClient<ApiSuccessResponse<Trip>>(endpoints.trips.arriving(id), {
      method: "POST",
    });
  },
  reject(id: string) {
    return apiClient<ApiSuccessResponse<Trip>>(endpoints.trips.reject(id), {
      method: "POST",
    });
  },
  start(id: string) {
    return apiClient<ApiSuccessResponse<Trip>>(endpoints.trips.start(id), {
      method: "POST",
    });
  },
  arrived(id: string) {
    return apiClient<ApiSuccessResponse<Trip>>(endpoints.trips.arrived(id), {
      method: "POST",
    });
  },
  complete(id: string) {
    return apiClient<ApiSuccessResponse<Trip>>(endpoints.trips.complete(id), {
      method: "POST",
    });
  },
  cancel(id: string) {
    return apiClient<ApiSuccessResponse<Trip>>(endpoints.trips.cancel(id), {
      method: "POST",
    });
  },
  /** Dev-only mock: advance trip one status step */
  advance(id: string) {
    return apiClient<ApiSuccessResponse<Trip>>(endpoints.trips.advance(id), {
      method: "POST",
    });
  },
};
