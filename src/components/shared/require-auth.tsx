"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import type { ActiveRole } from "@/types/auth";
import { authRoutes } from "@/config/routes";
import {
  getHomeForRole,
  getUnauthorizedRedirect,
} from "@/services/domain/role-permissions";

export function requireAuthRedirect(isAuthenticated: boolean, isHydrated: boolean) {
  if (!isHydrated) return null;
  if (!isAuthenticated) return authRoutes.login;
  return null;
}

export function requireRoleRedirect(
  role: ActiveRole | null,
  allowed: ActiveRole[],
): string | null {
  if (!role) return authRoutes.login;
  if (!allowed.includes(role)) {
    const target = allowed.includes("USER") ? "user" : "driver";
    return getUnauthorizedRedirect(role, target);
  }
  return null;
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, isHydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const redirect = requireAuthRedirect(isAuthenticated, isHydrated);
    if (redirect) router.replace(redirect);
  }, [isAuthenticated, isHydrated, router]);

  if (!isHydrated || !isAuthenticated) {
    return (
      <div className="p-6 text-sm text-muted-foreground" role="status">
        Checking session…
      </div>
    );
  }

  return <>{children}</>;
}

export function RequireRole({
  role: allowed,
  children,
}: {
  role: ActiveRole | ActiveRole[];
  children: ReactNode;
}) {
  const allowedList = Array.isArray(allowed) ? allowed : [allowed];
  const allowedKey = allowedList.join("|");
  const { role, isAuthenticated, isHydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated) {
      router.replace(authRoutes.login);
      return;
    }
    const redirect = requireRoleRedirect(role, allowedKey.split("|") as ActiveRole[]);
    if (redirect) router.replace(redirect);
  }, [allowedKey, isAuthenticated, isHydrated, role, router]);

  if (!isHydrated || !isAuthenticated || !role || !allowedList.includes(role)) {
    return (
      <div className="p-6 text-sm text-muted-foreground" role="status">
        Checking access…
      </div>
    );
  }

  return <>{children}</>;
}

export function RedirectIfAuthenticated({ children }: { children: ReactNode }) {
  const { isAuthenticated, isHydrated, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isHydrated || !isAuthenticated || !role) return;
    router.replace(getHomeForRole(role));
  }, [isAuthenticated, isHydrated, role, router]);

  if (isHydrated && isAuthenticated && role) {
    return (
      <div className="p-6 text-sm text-muted-foreground" role="status">
        Redirecting…
      </div>
    );
  }

  return <>{children}</>;
}
