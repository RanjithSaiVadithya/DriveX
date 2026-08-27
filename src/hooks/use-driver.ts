"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { driversApi } from "@/services/api/drivers.api";
import type { DriverAvailability } from "@/types/driver";
import { useAuth } from "./use-auth";

export function useDriver() {
  const { isAuthenticated, role } = useAuth();
  const queryClient = useQueryClient();

  const driverQuery = useQuery({
    queryKey: ["drivers", "me"],
    queryFn: async () => {
      const res = await driversApi.me();
      return res.data;
    },
    enabled: isAuthenticated && role === "DRIVER",
  });

  const setStatus = useMutation({
    mutationFn: (availability: DriverAvailability) =>
      driversApi.setStatus(availability),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["drivers", "me"] });
    },
  });

  return { ...driverQuery, setStatus };
}
