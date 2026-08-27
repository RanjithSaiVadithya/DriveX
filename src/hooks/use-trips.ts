"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tripsApi } from "@/services/api/trips.api";
import { bookingsApi } from "@/services/api/bookings.api";
import { useAuth } from "./use-auth";
import { liveRefetchInterval } from "@/lib/polling";

export function useTrip(id: string) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const tripQuery = useQuery({
    queryKey: ["trips", id],
    queryFn: async () => {
      const res = await tripsApi.get(id);
      return res.data;
    },
    enabled: isAuthenticated && Boolean(id),
    refetchInterval: () => liveRefetchInterval(5_000),
  });

  const advance = useMutation({
    mutationFn: () => tripsApi.advance(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["trips"] });
      void queryClient.invalidateQueries({ queryKey: ["bookings"] });
      void queryClient.invalidateQueries({ queryKey: ["payments"] });
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return { tripQuery, advance };
}

export function useBookingDetails(bookingId: string) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["bookings", bookingId, "details"],
    queryFn: async () => {
      const res = await bookingsApi.details(bookingId);
      return res.data;
    },
    enabled: isAuthenticated && Boolean(bookingId),
    refetchInterval: () => liveRefetchInterval(5_000),
  });
}
