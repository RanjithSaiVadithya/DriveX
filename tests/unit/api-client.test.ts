import { afterEach, describe, expect, it, vi } from "vitest";
import { apiClient } from "@/services/api/client";
import { AppError } from "@/services/domain/errors";

describe("api client", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("parses success responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ data: { id: "1" }, message: "Success" }),
      }),
    );

    const result = await apiClient<{ data: { id: string }; message: string }>(
      "/api/test",
      { token: null },
    );
    expect(result.data.id).toBe("1");
  });

  it("reads token from zustand persist shape", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ data: {}, message: "Success" }),
    });
    vi.stubGlobal("fetch", fetchMock);
    localStorage.setItem(
      "driverdosth_session",
      JSON.stringify({
        state: { session: { token: "persist-token", user: { id: "1" } } },
        version: 0,
      }),
    );

    await apiClient("/api/auth/me");
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe(
      "Bearer persist-token",
    );
    localStorage.removeItem("driverdosth_session");
  });

  it("maps HTTP errors to AppError", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        text: async () =>
          JSON.stringify({
            error: { code: "RESOURCE_NOT_FOUND", message: "Not found" },
          }),
      }),
    );

    await expect(apiClient("/api/missing", { token: null })).rejects.toMatchObject({
      code: "RESOURCE_NOT_FOUND",
      status: 404,
    });
  });

  it("handles malformed JSON", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => "not-json",
      }),
    );

    await expect(apiClient("/api/bad", { token: null })).rejects.toBeInstanceOf(
      AppError,
    );
    await expect(apiClient("/api/bad", { token: null })).rejects.toMatchObject({
      code: "MALFORMED_RESPONSE",
    });
  });
});
