import type { Address } from "@/types/address";
import type { DriverServiceType } from "@/types/driver-service";
import { SERVICE_FEE, driverServiceCatalog } from "@/config/driver-services";

export interface FareEstimate {
  baseFare: number;
  distanceKm: number;
  distanceFare: number;
  serviceFee: number;
  estimatedTotal: number;
  currency: string;
  isEstimate: true;
  serviceType: DriverServiceType;
}

function toRad(value: number) {
  return (value * Math.PI) / 180;
}

/** Haversine distance in km — used for mock estimates only */
export function distanceKm(a: Address, b: Address): number {
  const R = 6371;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return Math.max(1, Math.round(R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h)) * 10) / 10);
}

/**
 * Mock driver-service fare estimate.
 * Not based on vehicle type or rental — driving service only.
 */
export function calculateFareEstimate(input: {
  pickup: Address;
  destination: Address;
  serviceType: DriverServiceType;
  scheduledAt?: string | null;
}): FareEstimate {
  const catalog = driverServiceCatalog[input.serviceType];
  const km = distanceKm(input.pickup, input.destination);
  let baseFare = catalog.baseFare;
  // Light mock surcharge for scheduled / peak-style bookings
  if (input.scheduledAt) {
    baseFare += 30;
  }
  const distanceFare = Math.round(km * catalog.perKm);
  const estimatedTotal = baseFare + distanceFare + SERVICE_FEE;
  return {
    baseFare,
    distanceKm: km,
    distanceFare,
    serviceFee: SERVICE_FEE,
    estimatedTotal,
    currency: "INR",
    isEstimate: true,
    serviceType: input.serviceType,
  };
}
