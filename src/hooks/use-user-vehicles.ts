"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userVehiclesApi } from "@/services/api/user-vehicles.api";
import type { UserVehicleInput } from "@/schemas/vehicle.schema";
import { useAuth } from "./use-auth";

export function useUserVehicles() {
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ["user-vehicles"],
    queryFn: async () => {
      const res = await userVehiclesApi.list();
      return res.data;
    },
    enabled: isAuthenticated && user?.role === "USER",
  });

  const createVehicle = useMutation({
    mutationFn: (payload: UserVehicleInput) => userVehiclesApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["user-vehicles"] });
    },
  });

  const updateVehicle = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<UserVehicleInput>;
    }) => userVehiclesApi.update(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["user-vehicles"] });
    },
  });

  const deleteVehicle = useMutation({
    mutationFn: (id: string) => userVehiclesApi.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["user-vehicles"] });
    },
  });

  return { listQuery, createVehicle, updateVehicle, deleteVehicle };
}

export function useUserVehicle(id: string) {
  const { isAuthenticated, user } = useAuth();

  return useQuery({
    queryKey: ["user-vehicles", id],
    queryFn: async () => {
      const res = await userVehiclesApi.get(id);
      return res.data;
    },
    enabled: isAuthenticated && user?.role === "USER" && Boolean(id),
  });
}
