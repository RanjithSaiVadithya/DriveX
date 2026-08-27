import { apiClient } from "./client";
import { endpoints } from "./endpoints";
import type { ApiSuccessResponse } from "@/types/api";
import type {
  AuthSession,
  LoginPayload,
  OtpChallenge,
  SelectRolePayload,
  SignupPayload,
  VerifyOtpPayload,
} from "@/types/auth";
import type { User } from "@/types/user";

export const authApi = {
  login(payload: LoginPayload) {
    return apiClient<ApiSuccessResponse<AuthSession | OtpChallenge>>(
      endpoints.auth.login,
      { method: "POST", body: payload },
    );
  },
  signup(payload: SignupPayload) {
    return apiClient<ApiSuccessResponse<OtpChallenge>>(endpoints.auth.signup, {
      method: "POST",
      body: payload,
    });
  },
  verifyOtp(payload: VerifyOtpPayload) {
    return apiClient<ApiSuccessResponse<AuthSession>>(
      endpoints.auth.verifyOtp,
      { method: "POST", body: payload },
    );
  },
  resendOtp(payload: { email: string }) {
    return apiClient<ApiSuccessResponse<OtpChallenge>>(
      endpoints.auth.resendOtp,
      { method: "POST", body: payload },
    );
  },
  me(token?: string | null) {
    return apiClient<ApiSuccessResponse<User>>(endpoints.auth.me, { token });
  },
  logout(token?: string | null) {
    return apiClient<ApiSuccessResponse<null>>(endpoints.auth.logout, {
      method: "POST",
      token,
    });
  },
  selectRole(payload: SelectRolePayload, token?: string | null) {
    return apiClient<ApiSuccessResponse<AuthSession>>(
      endpoints.auth.selectRole,
      { method: "POST", body: payload, token },
    );
  },
};
