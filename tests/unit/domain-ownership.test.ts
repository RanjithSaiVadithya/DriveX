import { describe, expect, it } from "vitest";
import type { Driver } from "@/types/driver";
import type { UserVehicle } from "@/types/vehicle";
import type { Booking } from "@/types/booking";
import type { Trip } from "@/types/trip";

describe("domain ownership rules", () => {
  it("driver model has no vehicleId", () => {
    const driver: Driver = {
      id: "driver-1",
      userId: "user-5",
      status: "ACTIVE",
      availability: "ONLINE",
      rating: 4.8,
      totalTrips: 10,
      verificationStatus: "VERIFIED",
      documents: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    expect("vehicleId" in driver).toBe(false);
  });

  it("user vehicle belongs to a user", () => {
    const vehicle: UserVehicle = {
      id: "vehicle_001",
      userId: "user_001",
      make: "Toyota",
      model: "Fortuner",
      year: 2024,
      registrationNumber: "KA01AB1234",
      color: "White",
      vehicleType: "SUV",
      capacity: 7,
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    expect(vehicle.userId).toBe("user_001");
  });

  it("booking and trip share userVehicleId", () => {
    const booking = {
      id: "b1",
      userId: "u1",
      driverId: "d1",
      userVehicleId: "v1",
      serviceType: "POINT_TO_POINT",
    } as Pick<Booking, "id" | "userId" | "driverId" | "userVehicleId" | "serviceType">;

    const trip = {
      id: "t1",
      bookingId: booking.id,
      userId: booking.userId,
      driverId: booking.driverId!,
      userVehicleId: booking.userVehicleId,
    } as Pick<Trip, "id" | "bookingId" | "userId" | "driverId" | "userVehicleId">;

    expect(trip.userVehicleId).toBe(booking.userVehicleId);
  });
});
