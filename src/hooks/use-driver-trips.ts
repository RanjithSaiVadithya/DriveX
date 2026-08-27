"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { driversApi } from "@/services/api/drivers.api";
import { tripsApi } from "@/services/api/trips.api";
import { assertOnlineForMutation } from "@/lib/connectivity";
import { liveRefetchInterval } from "@/lib/polling";
import { useAuth } from "./use-auth";

function invalidateDriverTripQueries(
  queryClient: ReturnType<typeof useQueryClient>,
) {
  void queryClient.invalidateQueries({ queryKey: ["driver-trips"] });
  void queryClient.invalidateQueries({ queryKey: ["trips"] });
  void queryClient.invalidateQueries({ queryKey: ["bookings"] });
  void queryClient.invalidateQueries({ queryKey: ["payments"] });
  void queryClient.invalidateQueries({ queryKey: ["notifications"] });
  void queryClient.invalidateQueries({ queryKey: ["earnings"] });
  void queryClient.invalidateQueries({ queryKey: ["wallet"] });
  void queryClient.invalidateQueries({ queryKey: ["drivers", "me"] });
}

export function useDriverTrips() {
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ["driver-trips"],
    queryFn: async () => {
      const res = await driversApi.trips();
      return res.data;
    },
    enabled: isAuthenticated && user?.role === "DRIVER",
    refetchInterval: () => liveRefetchInterval(5_000),
  });

  const accept = useMutation({
    mutationFn: (id: string) => {
      assertOnlineForMutation("accept this booking");
      return tripsApi.accept(id);
    },
    onSuccess: () => invalidateDriverTripQueries(queryClient),
  });
  const arriving = useMutation({
    mutationFn: (id: string) => {
      assertOnlineForMutation("mark arriving");
      return tripsApi.arriving(id);
    },
    onSuccess: () => invalidateDriverTripQueries(queryClient),
  });
  const reject = useMutation({
    mutationFn: (id: string) => {
      assertOnlineForMutation("reject this booking");
      return tripsApi.reject(id);
    },
    onSuccess: () => invalidateDriverTripQueries(queryClient),
  });
  const arrived = useMutation({
    mutationFn: (id: string) => {
      assertOnlineForMutation("mark arrived");
      return tripsApi.arrived(id);
    },
    onSuccess: () => invalidateDriverTripQueries(queryClient),
  });
  const start = useMutation({
    mutationFn: (id: string) => {
      assertOnlineForMutation("start this trip");
      return tripsApi.start(id);
    },
    onSuccess: () => invalidateDriverTripQueries(queryClient),
  });
  const complete = useMutation({
    mutationFn: (id: string) => {
      assertOnlineForMutation("complete this trip");
      return tripsApi.complete(id);
    },
    onSuccess: () => invalidateDriverTripQueries(queryClient),
  });

  return { listQuery, accept, arriving, reject, arrived, start, complete };
}

export function useDriverTripDetails(id: string) {
  const { isAuthenticated, user } = useAuth();

  return useQuery({
    queryKey: ["trips", id, "details"],
    queryFn: async () => {
      const res = await tripsApi.details(id);
      return res.data;
    },
    enabled: isAuthenticated && user?.role === "DRIVER" && Boolean(id),
    refetchInterval: () => liveRefetchInterval(5_000),
  });
}
