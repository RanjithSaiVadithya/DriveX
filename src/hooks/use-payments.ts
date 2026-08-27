"use client";

import { useQuery } from "@tanstack/react-query";
import { paymentsApi } from "@/services/api/payments.api";
import { useAuth } from "./use-auth";

export function usePayments() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const res = await paymentsApi.list();
      return res.data;
    },
    enabled: isAuthenticated,
  });
}

export function usePayment(id: string) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["payments", id],
    queryFn: async () => {
      const res = await paymentsApi.get(id);
      return res.data;
    },
    enabled: isAuthenticated && Boolean(id),
  });
}
