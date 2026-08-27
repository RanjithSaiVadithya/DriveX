/**
 * Safe polling helper for TanStack Query.
 * Pauses when the tab is hidden or the device is offline.
 */
export function liveRefetchInterval(ms: number): number | false {
  if (typeof document !== "undefined" && document.visibilityState === "hidden") {
    return false;
  }
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return false;
  }
  return ms;
}
