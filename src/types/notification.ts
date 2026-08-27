import type { ActiveRole } from "./auth";

export type NotificationType =
  | "BOOKING_UPDATE"
  | "TRIP_UPDATE"
  | "PAYMENT"
  | "EARNING"
  | "DOCUMENT"
  | "SYSTEM";

export interface Notification {
  id: string;
  recipientId: string;
  recipientRole: ActiveRole;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  data: Record<string, unknown> | null;
  createdAt: string;
}
