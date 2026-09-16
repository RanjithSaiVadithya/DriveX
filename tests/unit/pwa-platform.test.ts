import { describe, expect, it, vi, afterEach } from "vitest";
import { liveRefetchInterval } from "@/lib/polling";
import { assertOnlineForMutation } from "@/lib/connectivity";
import { getServerStateTransport } from "@/lib/realtime";
import { APP_VERSION } from "@/lib/app-version";
import { isAppError } from "@/services/domain/errors";
import manifest from "@/app/manifest";

describe("PWA / platform helpers", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("manifest exposes DriverDosth standalone metadata", () => {
    const m = manifest();
    expect(m.name).toBe("DriverDosth");
    expect(m.short_name).toBe("DriverDosth");
    expect(m.display).toBe("standalone");
    expect(m.theme_color).toBe("#5c6b3a");
    expect(m.background_color).toBe("#f7f3eb");
    expect(m.start_url).toBe("/");
    expect(m.icons?.some((i) => i.sizes === "192x192")).toBe(true);
    expect(m.icons?.some((i) => i.sizes === "512x512")).toBe(true);
  });

  it("exposes a single app version", () => {
    expect(APP_VERSION).toMatch(/^\d+\.\d+\.\d+/);
  });

  it("uses HTTP transport (no fake realtime)", () => {
    expect(getServerStateTransport().kind).toBe("http");
  });

  it("pauses polling when offline", () => {
    vi.stubGlobal("navigator", { onLine: false });
    vi.stubGlobal("document", { visibilityState: "visible" });
    expect(liveRefetchInterval(5000)).toBe(false);
  });

  it("blocks mutations while offline", () => {
    vi.stubGlobal("navigator", { onLine: false });
    try {
      assertOnlineForMutation("complete this trip");
      expect.unreachable();
    } catch (err) {
      expect(isAppError(err)).toBe(true);
      if (isAppError(err)) {
        expect(err.message).toMatch(/offline/i);
      }
    }
  });
});
