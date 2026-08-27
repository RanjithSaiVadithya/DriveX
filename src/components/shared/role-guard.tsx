"use client";

import type { ReactNode } from "react";
import type { ActiveRole } from "@/types/auth";
import { RequireRole } from "@/components/shared/require-auth";

/** @deprecated Prefer RequireRole — kept for Phase 1 compatibility */
export function RoleGuard({
  allowed,
  children,
}: {
  allowed: ActiveRole[];
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return <RequireRole role={allowed}>{children}</RequireRole>;
}
