"use client";

import { Button } from "@/components/ui/button";
import { useServiceWorker } from "@/hooks/use-service-worker";
import { usePathname } from "next/navigation";

export function AppUpdateBanner() {
  const { updateAvailable, applyUpdate } = useServiceWorker();
  const pathname = usePathname();

  if (!updateAvailable) return null;
  // Do not force update during booking or active trip flows
  if (
    pathname.startsWith("/user/book") ||
    /^\/(user\/bookings|driver\/trips)\/[^/]+$/.test(pathname)
  ) {
    return null;
  }

  return (
    <div
      role="status"
      className="border-b border-olive/30 bg-olive/10 px-4 py-2 text-center text-sm text-deep-navy"
    >
      <span className="font-semibold">New version available.</span>{" "}
      <Button
        type="button"
        variant="link"
        className="h-auto p-0 text-olive"
        onClick={applyUpdate}
      >
        Update
      </Button>
    </div>
  );
}
