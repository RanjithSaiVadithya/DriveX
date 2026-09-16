"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { trackEvent } from "@/lib/analytics";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "driverdosth-install-dismissed-at";
const DISMISS_DAYS = 14;

function isStandaloneDisplay(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator &&
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone))
  );
}

function isDismissedRecently(): boolean {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const at = Number(raw);
    if (!Number.isFinite(at)) return false;
    return Date.now() - at < DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

function isIos(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function getInstallModeSnapshot(): "installed" | "ios-manual" | "browser" {
  if (typeof window === "undefined") return "browser";
  if (isStandaloneDisplay()) return "installed";
  if (isIos()) return "ios-manual";
  return "browser";
}

function subscribeDisplayMode(onChange: () => void) {
  const mq = window.matchMedia("(display-mode: standalone)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export type InstallAvailability =
  | "installed"
  | "available"
  | "ios-manual"
  | "unavailable";

export function usePwaInstall() {
  const mode = useSyncExternalStore(
    subscribeDisplayMode,
    getInstallModeSnapshot,
    () => "browser" as const,
  );

  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    return isDismissedRecently();
  });

  useEffect(() => {
    if (mode === "installed" || mode === "ios-manual") return;

    const onBip = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
      trackEvent("install_prompt_shown");
    };

    const onInstalled = () => {
      setDeferred(null);
      trackEvent("app_installed");
    };

    window.addEventListener("beforeinstallprompt", onBip);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBip);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, [mode]);

  const availability: InstallAvailability =
    mode === "installed"
      ? "installed"
      : mode === "ios-manual"
        ? "ios-manual"
        : deferred
          ? "available"
          : "unavailable";

  const showPrompt =
    !dismissed &&
    (availability === "available" || availability === "ios-manual");

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
    setDismissed(true);
    trackEvent("install_dismissed");
  }, []);

  const install = useCallback(async () => {
    if (!deferred) return false;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    setDeferred(null);
    if (choice.outcome === "accepted") {
      trackEvent("install_accepted");
      return true;
    }
    trackEvent("install_dismissed");
    dismiss();
    return false;
  }, [deferred, dismiss]);

  return {
    availability,
    showPrompt,
    install,
    dismiss,
    canNativeInstall: Boolean(deferred),
    isInstalled: availability === "installed" || mode === "installed",
  };
}
