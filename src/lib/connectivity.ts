import { AppError } from "@/services/domain/errors";

/** Block mutations when the device is offline — never fake success. */
export function assertOnlineForMutation(actionLabel = "continue"): void {
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    throw new AppError(
      `You're offline. Reconnect to ${actionLabel}.`,
      { code: "NETWORK_ERROR", status: 0 },
    );
  }
}
