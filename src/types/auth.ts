export type Role =
  | "USER"
  | "DRIVER"
  | "ADMIN"
  | "DISPATCHER"
  | "FLEET_MANAGER"
  | "SUPPORT";

export type ActiveRole = "USER" | "DRIVER";

export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface SessionUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string | null;
  role: ActiveRole;
  status: UserStatus;
}

export interface AuthSession {
  token: string;
  user: SessionUser;
}

export interface LoginPayload {
  email?: string;
  password?: string;
  phone?: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  phone: string;
  password?: string;
  preferredRole?: ActiveRole;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface SelectRolePayload {
  role: ActiveRole;
}

export interface OtpChallenge {
  email: string;
  phone?: string;
  message: string;
}
