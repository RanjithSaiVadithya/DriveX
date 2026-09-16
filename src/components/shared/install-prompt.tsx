"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { usePwaInstall } from "@/hooks/use-pwa-install";

const BLOCKED_PREFIXES = [
  "/user/book",
  "/user/payments",
  "/login",
  "/signup",
  "/verify-otp",
  "/select-role",
];

function shouldSuppress(pathname: string): boolean {
  if (BLOCKED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return true;
  }
  // Active trip detail — keep focus on the trip
  if (/^\/driver\/trips\/[^/]+$/.test(pathname)) return true;
  if (/^\/user\/bookings\/[^/]+$/.test(pathname)) return true;
  return false;
}

export function InstallPrompt() {
  const pathname = usePathname();
  const { showPrompt, availability, install, dismiss, canNativeInstall } =
    usePwaInstall();

  if (!showPrompt || shouldSuppress(pathname)) return null;
  if (availability === "installed" || availability === "unavailable") return null;

  return (
    <div
      role="region"
      aria-label="Install DriverDosth"
      className="fixed inset-x-0 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-50 mx-auto w-[min(100%-1.5rem,28rem)] rounded-2xl border border-border bg-warm-white p-4 shadow-medium md:bottom-6"
    >
      <p className="text-sm font-semibold text-deep-navy">Get the DriverDosth app</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {availability === "ios-manual"
          ? "On iPhone: tap Share, then Add to Home Screen for an app-like experience."
          : "Install DriverDosth for faster access and an app-like experience."}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {canNativeInstall ? (
          <Button type="button" size="sm" onClick={() => void install()}>
            Install
          </Button>
        ) : null}
        <Button type="button" size="sm" variant="outline" onClick={dismiss}>
          Not now
        </Button>
      </div>
    </div>
  );
}
