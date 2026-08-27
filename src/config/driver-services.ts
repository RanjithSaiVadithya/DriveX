import type { DriverServiceType } from "@/types/driver-service";

/**
 * Configurable driver service catalog.
 * Pricing is for the driving service — not vehicle rental.
 */
export const driverServiceCatalog: Record<
  DriverServiceType,
  {
    name: string;
    description: string;
    baseFare: number;
    perKm: number;
  }
> = {
  POINT_TO_POINT: {
    name: "Point-to-point",
    description: "One-way trip to your destination",
    baseFare: 180,
    perKm: 15,
  },
  HOURLY: {
    name: "Hourly",
    description: "Driver for a block of hours",
    baseFare: 350,
    perKm: 12,
  },
  FULL_DAY: {
    name: "Full day",
    description: "Driver for the full day",
    baseFare: 900,
    perKm: 10,
  },
  AIRPORT: {
    name: "Airport",
    description: "Airport pickup or drop with buffer time",
    baseFare: 280,
    perKm: 16,
  },
  OUTSTATION: {
    name: "Outstation",
    description: "Longer intercity driving service",
    baseFare: 500,
    perKm: 14,
  },
};

export const SERVICE_FEE = 40;

export function getDriverServiceLabel(type: DriverServiceType): string {
  return driverServiceCatalog[type]?.name ?? type;
}
