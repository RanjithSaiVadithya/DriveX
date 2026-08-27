"use client";

import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/services/api/users.api";
import { useAuth } from "./use-auth";

export function useUser() {
  const { isAuthenticated, role } = useAuth();

  return useQuery({
    queryKey: ["users", "me"],
    queryFn: async () => {
      const res = await usersApi.me();
      return res.data;
    },
    enabled: isAuthenticated && role === "USER",
  });
}
