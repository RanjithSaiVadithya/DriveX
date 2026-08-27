import { describe, expect, it } from "vitest";
import { calculateFareEstimate, distanceKm } from "@/services/domain/fare.service";
import {
  getBookingStatusLabel,
  getTripStatusLabel,
  getAvailableUserBookingActions,
  isUpcomingBooking,
} from "@/services/domain/booking.service";
import type { Booking } from "@/types/booking";

const baseBooking = {
  id: "b1",
  userId: "u1",
  driverId: null,
  userVehicleId: "vehicle-1",
  pickup: {
    label: "A",
    address: "Addr A",
    latitude: 12.97,
    longitude: 77.59,
  },
  destination: {
    label: "B",
    address: "Addr B",
    latitude: 12.98,
    longitude: 77.64,
  },
  scheduledAt: null,
  serviceType: "POINT_TO_POINT" as const,
  estimatedFare: 300,
  finalFare: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe("fare service", () => {
  it("calculates estimate from driver service type, not vehicle type", () => {
    const km = distanceKm(baseBooking.pickup, baseBooking.destination);
    expect(km).toBeGreaterThan(0);
    const fare = calculateFareEstimate({
      pickup: baseBooking.pickup,
      destination: baseBooking.destination,
      serviceType: "POINT_TO_POINT",
    });
    expect(fare.isEstimate).toBe(true);
    expect(fare.serviceType).toBe("POINT_TO_POINT");
    expect(fare.estimatedTotal).toBe(
      fare.baseFare + fare.distanceFare + fare.serviceFee,
    );

    const airport = calculateFareEstimate({
      pickup: baseBooking.pickup,
      destination: baseBooking.destination,
      serviceType: "AIRPORT",
    });
    expect(airport.estimatedTotal).not.toBe(fare.estimatedTotal);
  });
});

describe("booking service labels and actions", () => {
  it("maps status labels", () => {
    expect(getBookingStatusLabel("SEARCHING")).toBe("Finding a driver");
    expect(getTripStatusLabel("DRIVER_ARRIVING")).toBe("Driver is arriving");
  });

  it("allows cancel and dispatch for REQUESTED", () => {
    const booking = { ...baseBooking, status: "REQUESTED" } as Booking;
    expect(isUpcomingBooking(booking)).toBe(true);
    expect(getAvailableUserBookingActions(booking)).toEqual({
      canCancel: true,
      canSimulateDispatch: true,
    });
  });

  it("blocks dispatch after assignment", () => {
    const booking = {
      ...baseBooking,
      status: "DRIVER_ASSIGNED",
      driverId: "d1",
    } as Booking;
    expect(getAvailableUserBookingActions(booking).canSimulateDispatch).toBe(
      false,
    );
  });
});
