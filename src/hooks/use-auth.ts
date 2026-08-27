"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/services/api/auth.api";
import { useAuthStore } from "@/stores/auth.store";
import type {
  AuthSession,
  LoginPayload,
  OtpChallenge,
  SelectRolePayload,
  SignupPayload,
  VerifyOtpPayload,
} from "@/types/auth";

function isAuthSession(data: AuthSession | OtpChallenge): data is AuthSession {
  return "token" in data && "user" in data;
}

export function useAuth() {
  const session = useAuthStore((s) => s.session);
  const setSession = useAuthStore((s) => s.setSession);
  const logoutStore = useAuthStore((s) => s.logout);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const queryClient = useQueryClient();

  const meQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const res = await authApi.me(session?.token);
      return res.data;
    },
    enabled: Boolean(session?.token),
  });

  const login = useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (res) => {
      if (isAuthSession(res.data)) {
        setSession(res.data);
        void queryClient.invalidateQueries({ queryKey: ["auth"] });
      }
    },
  });

  const signup = useMutation({
    mutationFn: (payload: SignupPayload) => authApi.signup(payload),
  });

  const verifyOtp = useMutation({
    mutationFn: (payload: VerifyOtpPayload) => authApi.verifyOtp(payload),
    onSuccess: (res) => {
      setSession(res.data);
      void queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });

  const resendOtp = useMutation({
    mutationFn: (email: string) => authApi.resendOtp({ email }),
  });

  const selectRole = useMutation({
    mutationFn: (payload: SelectRolePayload) =>
      authApi.selectRole(payload, useAuthStore.getState().session?.token),
    onSuccess: (res) => {
      setSession(res.data);
      void queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });

  const logout = useMutation({
    mutationFn: () => authApi.logout(useAuthStore.getState().session?.token),
    onSettled: () => {
      logoutStore();
      queryClient.clear();
    },
  });

  return {
    session,
    user: session?.user ?? null,
    role: session?.user.role ?? null,
    isAuthenticated: Boolean(session?.token),
    isHydrated,
    meQuery,
    login,
    signup,
    verifyOtp,
    resendOtp,
    selectRole,
    logout,
    isAuthSession,
  };
}
