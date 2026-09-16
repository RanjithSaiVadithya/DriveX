"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";
import { APP_VERSION } from "@/lib/app-version";

/** Registers the DriverDosth service worker and surfaces controlled updates. */
export function useServiceWorker() {
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    // Avoid SW during Next.js HMR in development to reduce cache confusion
    if (process.env.NODE_ENV === "development") {
      return;
    }

    let registration: ServiceWorkerRegistration | undefined;

    void navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((reg) => {
        registration = reg;
        if (reg.waiting) setWaiting(reg.waiting);

        reg.addEventListener("updatefound", () => {
          const worker = reg.installing;
          if (!worker) return;
          worker.addEventListener("statechange", () => {
            if (worker.state === "installed" && navigator.serviceWorker.controller) {
              setWaiting(worker);
            }
          });
        });
      })
      .catch(() => {
        /* registration optional */
      });

    const onControllerChange = () => {
      trackEvent("pwa_update_applied", { version: APP_VERSION });
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener(
      "controllerchange",
      onControllerChange,
    );

    return () => {
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        onControllerChange,
      );
      void registration;
    };
  }, []);

  function applyUpdate() {
    if (!waiting) return;
    waiting.postMessage({ type: "SKIP_WAITING" });
    toast.message("Updating DriverDosth…");
  }

  return { updateAvailable: Boolean(waiting), applyUpdate };
}
