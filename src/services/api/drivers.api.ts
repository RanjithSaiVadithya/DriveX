import { apiClient } from "./client";
import { endpoints } from "./endpoints";
import type { ApiCollectionResponse, ApiSuccessResponse } from "@/types/api";
import type { Document } from "@/types/document";
import type { Driver } from "@/types/driver";
import type { DriverAvailability } from "@/types/driver";
import type { Earning } from "@/types/earning";
import type { Trip } from "@/types/trip";
import type { Booking } from "@/types/booking";
import type { UserVehicle } from "@/types/vehicle";
import type { User } from "@/types/user";
import type { WalletTransaction } from "@/types/wallet";

export type DriverTripSummary = Trip & {
  booking: Booking | null;
  userVehicle: UserVehicle | null;
  customer: User | null;
};

export const driversApi = {
  me() {
    return apiClient<ApiSuccessResponse<Driver>>(endpoints.drivers.me);
  },
  updateMe(payload: Partial<Driver>) {
    return apiClient<ApiSuccessResponse<Driver>>(endpoints.drivers.updateMe, {
      method: "PATCH",
      body: payload,
    });
  },
  setStatus(availability: DriverAvailability) {
    return apiClient<ApiSuccessResponse<Driver>>(endpoints.drivers.status, {
      method: "POST",
      body: { availability },
    });
  },
  trips() {
    return apiClient<ApiCollectionResponse<DriverTripSummary>>(
      endpoints.drivers.trips,
    );
  },
  earnings() {
    return apiClient<ApiCollectionResponse<Earning>>(endpoints.drivers.earnings);
  },
  wallet() {
    return apiClient<ApiCollectionResponse<WalletTransaction>>(
      endpoints.drivers.wallet,
    );
  },
  documents() {
    return apiClient<ApiCollectionResponse<Document>>(
      endpoints.drivers.documents,
    );
  },
};
