/**
 * Lightweight analytics abstraction.
 * Phase 5: no-op in production; logs in development only.
 * Do not send PII.
 */
export type AnalyticsEvent =
  | "booking_created"
  | "booking_completed"
  | "driver_accepted"
  | "driver_started"
  | "app_installed"
  | "install_prompt_shown"
  | "install_accepted"
  | "install_dismissed"
  | "pwa_update_applied";

export function trackEvent(
  event: AnalyticsEvent,
  props?: Record<string, string | number | boolean>,
): void {
  if (process.env.NODE_ENV === "development") {
    console.info("[analytics]", event, props ?? {});
  }
}
