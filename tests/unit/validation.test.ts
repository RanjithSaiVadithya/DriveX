import { describe, expect, it } from "vitest";
import {
  contactSchema,
  loginSchema,
  otpSchema,
  signupSchema,
} from "@/schemas/auth.schema";
import { bookingSchema } from "@/schemas/booking.schema";
import { userVehicleSchema } from "@/schemas/vehicle.schema";
import { userProfileSchema } from "@/schemas/user.schema";

describe("validation schemas", () => {
  it("accepts valid phone login", () => {
    expect(loginSchema.safeParse({ phone: "+919800000001" }).success).toBe(true);
  });

  it("rejects short phone", () => {
    expect(loginSchema.safeParse({ phone: "123" }).success).toBe(false);
  });

  it("rejects invalid email on signup", () => {
    expect(
      signupSchema.safeParse({
        name: "Asha",
        email: "not-an-email",
        phone: "9800000001",
      }).success,
    ).toBe(false);
  });

  it("requires 6-digit OTP", () => {
    expect(otpSchema.safeParse({ email: "a@b.com", otp: "12345" }).success).toBe(
      false,
    );
    expect(
      otpSchema.safeParse({ email: "a@b.com", otp: "123456" }).success,
    ).toBe(true);
  });

  it("validates booking payload with userVehicleId and serviceType", () => {
    expect(
      bookingSchema.safeParse({
        pickup: {
          label: "Home",
          address: "12 Palm Grove",
          latitude: 12.97,
          longitude: 77.59,
        },
        destination: {
          label: "Office",
          address: "MG Road",
          latitude: 12.97,
          longitude: 77.6,
        },
        userVehicleId: "vehicle-1",
        serviceType: "POINT_TO_POINT",
      }).success,
    ).toBe(true);
  });

  it("rejects booking without userVehicleId", () => {
    expect(
      bookingSchema.safeParse({
        pickup: {
          label: "Home",
          address: "12 Palm Grove",
          latitude: 12.97,
          longitude: 77.59,
        },
        destination: {
          label: "Office",
          address: "MG Road",
          latitude: 12.97,
          longitude: 77.6,
        },
        serviceType: "POINT_TO_POINT",
      }).success,
    ).toBe(false);
  });

  it("validates user vehicle", () => {
    expect(
      userVehicleSchema.safeParse({
        make: "Toyota",
        model: "Fortuner",
        year: 2024,
        registrationNumber: "KA01AB1234",
        color: "White",
        vehicleType: "SUV",
        capacity: 7,
      }).success,
    ).toBe(true);
  });

  it("validates user profile", () => {
    expect(
      userProfileSchema.safeParse({
        name: "Asha Reddy",
        phone: "9800000001",
        email: "user@example.test",
      }).success,
    ).toBe(true);
  });

  it("validates contact form", () => {
    expect(
      contactSchema.safeParse({
        name: "Asha",
        email: "asha@example.test",
        phone: "9800000001",
        subject: "Hello",
        message: "This is a longer message",
      }).success,
    ).toBe(true);
    expect(
      contactSchema.safeParse({
        name: "",
        email: "bad",
        phone: "1",
        subject: "",
        message: "short",
      }).success,
    ).toBe(false);
  });
});
