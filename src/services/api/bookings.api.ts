import { apiClient } from "./client";
import { endpoints } from "./endpoints";
import type { ApiCollectionResponse, ApiSuccessResponse } from "@/types/api";
import type { Booking } from "@/types/booking";
import type { Trip } from "@/types/trip";
import type { BookingInput } from "@/schemas/booking.schema";
import type { Address } from "@/types/address";
import type { DriverServiceType } from "@/types/driver-service";
import type { FareEstimate } from "@/services/domain/fare.service";
import type { Driver } from "@/types/driver";
import type { User } from "@/types/user";
import type { UserVehicle } from "@/types/vehicle";
import type { Payment } from "@/types/payment";

export const bookingsApi = {
  list() {
    return apiClient<ApiCollectionResponse<Booking>>(endpoints.bookings.list);
  },
  get(id: string) {
    return apiClient<ApiSuccessResponse<Booking>>(endpoints.bookings.detail(id));
  },
  create(payload: BookingInput) {
    return apiClient<ApiSuccessResponse<Booking>>(endpoints.bookings.create, {
      method: "POST",
      body: payload,
    });
  },
  update(id: string, payload: Partial<Booking>) {
    return apiClient<ApiSuccessResponse<Booking>>(
      endpoints.bookings.update(id),
      { method: "PATCH", body: payload },
    );
  },
  cancel(id: string) {
    return apiClient<ApiSuccessResponse<Booking>>(
      endpoints.bookings.cancel(id),
      { method: "POST" },
    );
  },
  dispatch(id: string) {
    return apiClient<ApiSuccessResponse<{ booking: Booking; trip: Trip }>>(
      endpoints.bookings.dispatch(id),
      { method: "POST" },
    );
  },
  estimate(payload: {
    pickup: Address;
    destination: Address;
    serviceType: DriverServiceType;
    scheduledAt?: string | null;
  }) {
    return apiClient<ApiSuccessResponse<FareEstimate>>(
      endpoints.bookings.estimate,
      { method: "POST", body: payload },
    );
  },
  tripForBooking(id: string) {
    return apiClient<ApiSuccessResponse<Trip>>(endpoints.bookings.trip(id));
  },
  details(id: string) {
    return apiClient<
      ApiSuccessResponse<{
        booking: Booking;
        trip: Trip | null;
        driver: Driver | null;
        driverUser: User | null;
        userVehicle: UserVehicle | null;
        payment: Payment | null;
      }>
    >(endpoints.bookings.details(id));
  },
};
