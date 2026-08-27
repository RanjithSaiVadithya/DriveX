"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookingsApi } from "@/services/api/bookings.api";
import type { BookingInput } from "@/schemas/booking.schema";
import type { Address } from "@/types/address";
import type { DriverServiceType } from "@/types/driver-service";
import { useAuth } from "./use-auth";
import { liveRefetchInterval } from "@/lib/polling";

export function useBookings() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const res = await bookingsApi.list();
      return res.data;
    },
    enabled: isAuthenticated,
    refetchInterval: () => liveRefetchInterval(8_000),
  });

  const createBooking = useMutation({
    mutationFn: (payload: BookingInput) => bookingsApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["bookings"] });
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const cancelBooking = useMutation({
    mutationFn: (id: string) => bookingsApi.cancel(id),
    onSuccess: (_res, id) => {
      void queryClient.invalidateQueries({ queryKey: ["bookings"] });
      void queryClient.invalidateQueries({ queryKey: ["bookings", id] });
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });
      void queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
  });

  const dispatchBooking = useMutation({
    mutationFn: (id: string) => bookingsApi.dispatch(id),
    onSuccess: (_res, id) => {
      void queryClient.invalidateQueries({ queryKey: ["bookings"] });
      void queryClient.invalidateQueries({ queryKey: ["bookings", id] });
      void queryClient.invalidateQueries({ queryKey: ["trips"] });
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return { listQuery, createBooking, cancelBooking, dispatchBooking };
}

export function useBooking(id: string) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["bookings", id],
    queryFn: async () => {
      const res = await bookingsApi.get(id);
      return res.data;
    },
    enabled: isAuthenticated && Boolean(id),
    refetchInterval: () => liveRefetchInterval(5_000),
  });
}

export function useBookingTrip(bookingId: string) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["trips", "by-booking", bookingId],
    queryFn: async () => {
      try {
        const res = await bookingsApi.tripForBooking(bookingId);
        return res.data;
      } catch {
        return null;
      }
    },
    enabled: isAuthenticated && Boolean(bookingId),
    refetchInterval: () => liveRefetchInterval(5_000),
    retry: false,
  });
}

export function useFareEstimate(
  pickup: Address | null,
  destination: Address | null,
  serviceType: DriverServiceType | null,
  scheduledAt?: string | null,
) {
  const { isAuthenticated } = useAuth();
  const ready = Boolean(pickup && destination && serviceType);

  return useQuery({
    queryKey: ["fare-estimate", pickup, destination, serviceType, scheduledAt],
    queryFn: async () => {
      const res = await bookingsApi.estimate({
        pickup: pickup!,
        destination: destination!,
        serviceType: serviceType!,
        scheduledAt,
      });
      return res.data;
    },
    enabled: isAuthenticated && ready,
  });
}
