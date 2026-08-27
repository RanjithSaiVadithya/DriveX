"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { authRoutes, driverRoutes } from "@/config/routes";
import { APP_VERSION } from "@/lib/app-version";
import { usePwaInstall } from "@/hooks/use-pwa-install";
import { cn } from "@/lib/utils";

export default function DriverSettingsPage() {
  const { logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { canNativeInstall, install, isInstalled, availability } = usePwaInstall();

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <h1 className="text-h1">Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Account preferences for the driver app.
        </p>
      </div>

      <section className="space-y-4 rounded-2xl border border-border bg-warm-white p-5 shadow-soft">
        <h2 className="text-h3">Notifications</h2>
        <label className="flex items-center justify-between gap-3 text-sm">
          <span>In-app notification preference (local)</span>
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={(e) => setNotificationsEnabled(e.target.checked)}
            className="size-4 accent-[var(--olive)]"
            aria-label="Enable in-app notifications"
          />
        </label>
      </section>

      <section className="space-y-3 rounded-2xl border border-border bg-warm-white p-5 shadow-soft">
        <h2 className="text-h3">Install app</h2>
        {isInstalled ? (
          <p className="text-sm text-muted-foreground">Running as installed DriveX.</p>
        ) : canNativeInstall ? (
          <Button type="button" onClick={() => void install()}>
            Install DriveX
          </Button>
        ) : availability === "ios-manual" ? (
          <p className="text-sm text-muted-foreground">
            Use Share → Add to Home Screen to install on iPhone.
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Install is available in supported browsers when criteria are met.
          </p>
        )}
        <p className="text-caption text-muted-foreground">App version {APP_VERSION}</p>
      </section>

      <section className="space-y-3 rounded-2xl border border-border bg-warm-white p-5 shadow-soft">
        <h2 className="text-h3">Account</h2>
        <div className="flex flex-wrap gap-2">
          <Link
            href={driverRoutes.profile}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Profile
          </Link>
          <Link
            href={driverRoutes.documents}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Documents
          </Link>
          <Link
            href={driverRoutes.wallet}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Wallet
          </Link>
        </div>
        <Button
          type="button"
          variant="destructive"
          className="mt-2 min-h-11"
          onClick={() => {
            logout.mutate();
            window.location.href = authRoutes.login;
          }}
        >
          Log out
        </Button>
      </section>
    </div>
  );
}
