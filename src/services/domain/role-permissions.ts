import type { ActiveRole } from "@/types/auth";
import { authRoutes, driverRoutes, userRoutes } from "@/config/routes";

export function canAccessUserRoutes(role: ActiveRole | null): boolean {
  return role === "USER";
}

export function canAccessDriverRoutes(role: ActiveRole | null): boolean {
  return role === "DRIVER";
}

export function getHomeForRole(role: ActiveRole): string {
  return role === "DRIVER" ? driverRoutes.home : userRoutes.home;
}

export function getUnauthorizedRedirect(
  role: ActiveRole | null,
  target: "user" | "driver",
): string {
  if (!role) return authRoutes.login;
  if (target === "user" && role === "DRIVER") return driverRoutes.home;
  if (target === "driver" && role === "USER") return userRoutes.home;
  return authRoutes.login;
}

export function isRoleAllowed(
  role: ActiveRole | null,
  allowed: ActiveRole[],
): boolean {
  if (!role) return false;
  return allowed.includes(role);
}
