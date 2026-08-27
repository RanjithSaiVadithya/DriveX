"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { walletApi } from "@/services/api/wallet.api";
import { assertOnlineForMutation } from "@/lib/connectivity";
import { useAuth } from "./use-auth";

export function useWallet() {
  const { isAuthenticated, role } = useAuth();
  const queryClient = useQueryClient();

  const summaryQuery = useQuery({
    queryKey: ["wallet", "summary"],
    queryFn: async () => (await walletApi.summary()).data,
    enabled: isAuthenticated && role === "DRIVER",
  });

  const transactionsQuery = useQuery({
    queryKey: ["wallet", "transactions"],
    queryFn: async () => (await walletApi.transactions()).data,
    enabled: isAuthenticated && role === "DRIVER",
  });

  const withdraw = useMutation({
    mutationFn: (amount: number) => {
      assertOnlineForMutation("withdraw");
      return walletApi.withdraw(amount);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["wallet"] });
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return { summaryQuery, transactionsQuery, withdraw };
}
