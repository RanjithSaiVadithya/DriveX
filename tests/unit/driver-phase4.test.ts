import { describe, expect, it } from "vitest";
import {
  canGoOffline,
  canGoOnline,
  getDriverTripStatusLabel,
} from "@/services/domain/driver.service";
import {
  calculateDriverEarning,
  filterEarningsByPeriod,
  sumNetEarnings,
} from "@/services/domain/earning.service";
import {
  canWithdraw,
  calculateAvailableBalance,
} from "@/services/domain/wallet.service";
import {
  getDocumentExpiryBucket,
  getDocumentTypeLabel,
} from "@/services/domain/document.service";
import {
  canAcceptTrip,
  canCompleteTrip,
  canMarkArrived,
  canMarkArriving,
  canRejectTrip,
  canStartTrip,
  canTransitionTrip,
} from "@/services/domain/trip-state";
import type { Earning } from "@/types/earning";
import type { WalletTransaction } from "@/types/wallet";
import { mockDocumentUploadSchema } from "@/schemas/document.schema";
import { withdrawSchema } from "@/schemas/wallet.schema";

describe("driver availability helpers", () => {
  it("allows going online from OFFLINE", () => {
    expect(canGoOnline("OFFLINE")).toBe(true);
    expect(canGoOnline("ONLINE")).toBe(false);
  });

  it("blocks going offline while a trip is active", () => {
    expect(canGoOffline("ONLINE", "STARTED")).toEqual({
      allowed: false,
      reason: "You can't go offline while a trip is active.",
    });
    expect(canGoOffline("ONLINE", null).allowed).toBe(true);
  });
});

describe("driver trip transition helpers", () => {
  it("allows accept/reject only on ASSIGNED", () => {
    expect(canAcceptTrip("ASSIGNED")).toBe(true);
    expect(canRejectTrip("ASSIGNED")).toBe(true);
    expect(canAcceptTrip("STARTED")).toBe(false);
  });

  it("follows arriving → arrived → start → complete", () => {
    expect(canMarkArriving("ASSIGNED")).toBe(true);
    expect(canMarkArrived("DRIVER_ARRIVING")).toBe(true);
    expect(canStartTrip("DRIVER_ARRIVED")).toBe(true);
    expect(canCompleteTrip("STARTED")).toBe(true);
    expect(canTransitionTrip("DRIVER_ARRIVING", "COMPLETED")).toBe(false);
  });

  it("exposes driver-facing status labels", () => {
    expect(getDriverTripStatusLabel("DRIVER_ARRIVING")).toBe(
      "You're on the way",
    );
    expect(getDriverTripStatusLabel("STARTED")).toBe("Trip in progress");
  });
});

describe("earnings", () => {
  it("calculates commission from configuration rate", () => {
    expect(calculateDriverEarning(850)).toEqual({
      grossAmount: 850,
      commission: 170,
      netAmount: 680,
    });
  });

  it("filters and sums by period", () => {
    const now = new Date("2026-08-26T12:00:00.000Z");
    const earnings: Earning[] = [
      {
        id: "e1",
        driverId: "d1",
        tripId: "t1",
        grossAmount: 100,
        commission: 20,
        netAmount: 80,
        currency: "INR",
        status: "AVAILABLE",
        earnedAt: "2026-08-26T08:00:00.000Z",
        createdAt: "2026-08-26T08:00:00.000Z",
      },
      {
        id: "e2",
        driverId: "d1",
        tripId: "t2",
        grossAmount: 200,
        commission: 40,
        netAmount: 160,
        currency: "INR",
        status: "AVAILABLE",
        earnedAt: "2026-07-01T08:00:00.000Z",
        createdAt: "2026-07-01T08:00:00.000Z",
      },
    ];
    expect(sumNetEarnings(filterEarningsByPeriod(earnings, "today", now))).toBe(
      80,
    );
    expect(sumNetEarnings(filterEarningsByPeriod(earnings, "all", now))).toBe(
      240,
    );
  });
});

describe("wallet", () => {
  it("derives balance from latest transaction", () => {
    const txs: WalletTransaction[] = [
      {
        id: "w1",
        driverId: "d1",
        type: "TRIP_EARNING",
        amount: 100,
        balanceAfter: 100,
        referenceId: "t1",
        referenceType: "Trip",
        description: "earning",
        createdAt: "2026-08-01T00:00:00.000Z",
        status: "COMPLETED",
      },
      {
        id: "w2",
        driverId: "d1",
        type: "WITHDRAWAL",
        amount: -40,
        balanceAfter: 60,
        referenceId: "wd-1",
        referenceType: "Withdrawal",
        description: "withdraw",
        createdAt: "2026-08-02T00:00:00.000Z",
        status: "COMPLETED",
      },
    ];
    expect(calculateAvailableBalance(txs)).toBe(60);
  });

  it("validates withdrawal amounts", () => {
    expect(canWithdraw(0, 100).allowed).toBe(false);
    expect(canWithdraw(150, 100).allowed).toBe(false);
    expect(canWithdraw(50, 100).allowed).toBe(true);
    expect(withdrawSchema.safeParse({ amount: 10 }).success).toBe(true);
    expect(withdrawSchema.safeParse({ amount: -1 }).success).toBe(false);
  });
});

describe("documents", () => {
  it("labels driver verification document types only", () => {
    expect(getDocumentTypeLabel("DRIVERS_LICENSE")).toMatch(/licence/i);
    expect(getDocumentTypeLabel("IDENTITY")).toMatch(/identity/i);
  });

  it("classifies expiry buckets", () => {
    const now = new Date("2026-08-26T00:00:00.000Z");
    expect(getDocumentExpiryBucket("2026-07-01T00:00:00.000Z", now)).toBe(
      "expired",
    );
    expect(getDocumentExpiryBucket("2026-09-10T00:00:00.000Z", now)).toBe(
      "expiring_soon",
    );
    expect(getDocumentExpiryBucket("2027-01-01T00:00:00.000Z", now)).toBe(
      "valid",
    );
  });

  it("validates mock upload payload", () => {
    expect(
      mockDocumentUploadSchema.safeParse({
        type: "DRIVERS_LICENSE",
        fileName: "licence.pdf",
      }).success,
    ).toBe(true);
    expect(
      mockDocumentUploadSchema.safeParse({
        type: "DRIVERS_LICENSE",
        fileName: "",
      }).success,
    ).toBe(false);
  });
});

describe("ownership", () => {
  it("driver helpers do not imply vehicle ownership APIs", () => {
    // Drivers act on trips/bookings; UserVehicle mutation stays user-scoped.
    expect(canAcceptTrip("ASSIGNED")).toBe(true);
    expect(canRejectTrip("STARTED")).toBe(false);
  });
});
