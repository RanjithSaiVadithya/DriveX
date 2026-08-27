import type { BookingStatus } from "@/types/booking";

const bookingTransitions: Record<BookingStatus, BookingStatus[]> = {
  REQUESTED: ["SEARCHING", "CANCELLED", "EXPIRED"],
  SEARCHING: ["DRIVER_ASSIGNED", "CANCELLED", "EXPIRED"],
  DRIVER_ASSIGNED: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["CANCELLED"],
  CANCELLED: [],
  EXPIRED: [],
};

export function canTransitionBooking(
  from: BookingStatus,
  to: BookingStatus,
): boolean {
  return bookingTransitions[from].includes(to);
}

export function assertBookingTransition(
  from: BookingStatus,
  to: BookingStatus,
): void {
  if (!canTransitionBooking(from, to)) {
    throw new Error(`Invalid booking transition: ${from} → ${to}`);
  }
}

export function canCancelBooking(status: BookingStatus): boolean {
  return canTransitionBooking(status, "CANCELLED");
}

export function getAllowedBookingTransitions(
  status: BookingStatus,
): BookingStatus[] {
  return [...bookingTransitions[status]];
}
