"use client";

import { useEffect } from "react";
import { ConnectivityBanner } from "@/components/shared/connectivity-banner";
import { InstallPrompt } from "@/components/shared/install-prompt";
import { AppUpdateBanner } from "@/components/shared/app-update-banner";
import { SESSION_STORAGE_KEY } from "@/lib/constants";
import { getQueryClient } from "@/lib/query-client";
import { useAuthStore } from "@/stores/auth.store";

/** Registers PWA chrome + multi-tab session sync. */
export function PlatformChrome() {
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== SESSION_STORAGE_KEY) return;
      if (!event.newValue) {
        useAuthStore.getState().logout();
        getQueryClient().clear();
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <>
      <AppUpdateBanner />
      <ConnectivityBanner />
      <InstallPrompt />
    </>
  );
}
