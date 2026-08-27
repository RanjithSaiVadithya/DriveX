import { describe, expect, it } from "vitest";
import {
  assertBookingTransition,
  canCancelBooking,
  canTransitionBooking,
} from "@/services/domain/booking-state";
import {
  assertTripTransition,
  canCompleteTrip,
  canStartTrip,
  canTransitionTrip,
} from "@/services/domain/trip-state";
import {
  assertAvailabilityTransition,
  canGoOnline,
  canTransitionAvailability,
} from "@/services/domain/driver-state";

describe("booking transitions", () => {
  it("allows REQUESTED → SEARCHING", () => {
    expect(canTransitionBooking("REQUESTED", "SEARCHING")).toBe(true);
  });

  it("allows cancellation from CONFIRMED", () => {
    expect(canCancelBooking("CONFIRMED")).toBe(true);
  });

  it("rejects CANCELLED → SEARCHING", () => {
    expect(canTransitionBooking("CANCELLED", "SEARCHING")).toBe(false);
    expect(() => assertBookingTransition("CANCELLED", "SEARCHING")).toThrow();
  });
});

describe("trip transitions", () => {
  it("allows DRIVER_ARRIVED → STARTED", () => {
    expect(canStartTrip("DRIVER_ARRIVED")).toBe(true);
  });

  it("allows STARTED → COMPLETED", () => {
    expect(canCompleteTrip("STARTED")).toBe(true);
  });

  it("rejects COMPLETED → STARTED", () => {
    expect(canTransitionTrip("COMPLETED", "STARTED")).toBe(false);
    expect(() => assertTripTransition("COMPLETED", "STARTED")).toThrow();
  });

  it("rejects CANCELLED → STARTED", () => {
    expect(canTransitionTrip("CANCELLED", "STARTED")).toBe(false);
  });
});

describe("driver availability", () => {
  it("allows OFFLINE → ONLINE", () => {
    expect(canGoOnline("OFFLINE")).toBe(true);
  });

  it("rejects OFFLINE → BUSY", () => {
    expect(canTransitionAvailability("OFFLINE", "BUSY")).toBe(false);
    expect(() => assertAvailabilityTransition("OFFLINE", "BUSY")).toThrow();
  });
});
