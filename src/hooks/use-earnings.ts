"use client";

import { useQuery } from "@tanstack/react-query";
import { earningsApi } from "@/services/api/earnings.api";
import { useAuth } from "./use-auth";

export function useEarnings() {
  const { isAuthenticated, role } = useAuth();

  return useQuery({
    queryKey: ["earnings"],
    queryFn: async () => {
      const res = await earningsApi.list();
      return res.data;
    },
    enabled: isAuthenticated && role === "DRIVER",
  });
}
