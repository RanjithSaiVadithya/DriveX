import type { Booking, BookingStatus } from "@/types/booking";
import type { Trip, TripStatus } from "@/types/trip";
import { canCancelBooking } from "@/services/domain/booking-state";

export function getBookingStatusLabel(status: BookingStatus): string {
  const labels: Record<BookingStatus, string> = {
    REQUESTED: "Requested",
    SEARCHING: "Finding a driver",
    DRIVER_ASSIGNED: "Driver assigned",
    CONFIRMED: "Confirmed",
    CANCELLED: "Cancelled",
    EXPIRED: "Expired",
  };
  return labels[status];
}

export function getTripStatusLabel(status: TripStatus): string {
  const labels: Record<TripStatus, string> = {
    ASSIGNED: "Driver assigned",
    DRIVER_ARRIVING: "Driver is arriving",
    DRIVER_ARRIVED: "Driver has arrived",
    STARTED: "Trip in progress",
    COMPLETED: "Trip completed",
    CANCELLED: "Booking cancelled",
  };
  return labels[status];
}

export function isUpcomingBooking(booking: Booking): boolean {
  return ["REQUESTED", "SEARCHING", "DRIVER_ASSIGNED", "CONFIRMED"].includes(
    booking.status,
  );
}

export function isActiveBooking(booking: Booking, trip?: Trip | null): boolean {
  if (booking.status === "CANCELLED" || booking.status === "EXPIRED") return false;
  if (!trip) return ["SEARCHING", "DRIVER_ASSIGNED", "CONFIRMED"].includes(booking.status);
  return ["ASSIGNED", "DRIVER_ARRIVING", "DRIVER_ARRIVED", "STARTED"].includes(trip.status);
}

export function isCompletedBooking(booking: Booking, trip?: Trip | null): boolean {
  if (trip?.status === "COMPLETED") return true;
  return booking.status === "CONFIRMED" && Boolean(booking.finalFare);
}

export function getAvailableUserBookingActions(booking: Booking): {
  canCancel: boolean;
  canSimulateDispatch: boolean;
} {
  return {
    canCancel: canCancelBooking(booking.status),
    canSimulateDispatch: ["REQUESTED", "SEARCHING"].includes(booking.status),
  };
}

export function formatCurrency(amount: number, currency = "INR"): string {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `₹${amount}`;
  }
}

export function greetingForNow(date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
