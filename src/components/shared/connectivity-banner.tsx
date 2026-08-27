"use client";

import { useOnlineStatus } from "@/hooks/use-online-status";

export function ConnectivityBanner() {
  const { isOffline } = useOnlineStatus();

  if (!isOffline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="border-b border-orange/30 bg-orange/10 px-4 py-2 text-center text-sm text-deep-navy"
    >
      <span className="font-semibold">You&apos;re offline.</span>{" "}
      <span className="text-muted-foreground">
        Some actions may be unavailable until you reconnect.
      </span>
    </div>
  );
}
