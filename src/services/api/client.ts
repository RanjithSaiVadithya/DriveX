import { API_TIMEOUT_MS, SESSION_STORAGE_KEY } from "@/lib/constants";
import { env } from "@/lib/env";
import { AppError, mapHttpStatusToCode } from "@/services/domain/errors";
import type { ApiErrorBody } from "@/types/api";
import type { AuthSession } from "@/types/auth";

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  token?: string | null;
  signal?: AbortSignal;
  timeoutMs?: number;
}

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as
      | AuthSession
      | { state?: { session?: AuthSession | null } };
    if (parsed && "token" in parsed && typeof parsed.token === "string") {
      return parsed.token;
    }
    if (
      parsed &&
      "state" in parsed &&
      parsed.state?.session &&
      typeof parsed.state.session.token === "string"
    ) {
      return parsed.state.session.token;
    }
    return null;
  } catch {
    return null;
  }
}

async function parseJsonSafe(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new AppError("Malformed response from server", {
      code: "MALFORMED_RESPONSE",
      status: response.status,
      details: text.slice(0, 200),
    });
  }
}

function toAppError(status: number, payload: unknown): AppError {
  const body = payload as ApiErrorBody | null;
  if (body?.error?.code && body?.error?.message) {
    return new AppError(body.error.message, {
      code: body.error.code,
      status,
      details: body,
    });
  }
  return new AppError(`Request failed with status ${status}`, {
    code: mapHttpStatusToCode(status),
    status,
    details: payload,
  });
}

export async function apiClient<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    method = "GET",
    body,
    headers = {},
    token,
    signal,
    timeoutMs = API_TIMEOUT_MS,
  } = options;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener("abort", () => controller.abort(), { once: true });
  }

  const authToken = token === undefined ? getStoredToken() : token;
  const requestHeaders: Record<string, string> = {
    Accept: "application/json",
    ...headers,
  };

  if (body !== undefined) {
    requestHeaders["Content-Type"] = "application/json";
  }
  if (authToken) {
    requestHeaders.Authorization = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(`${env.apiBaseUrl}${path}`, {
      method,
      headers: requestHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });

    const payload = await parseJsonSafe(response);

    if (!response.ok) {
      throw toAppError(response.status, payload);
    }

    return payload as T;
  } catch (error) {
    if (error instanceof AppError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new AppError("Request timed out", {
        code: "TIMEOUT",
        status: 408,
      });
    }
    throw new AppError("Network request failed", {
      code: "NETWORK_ERROR",
      status: 0,
      details: error,
    });
  } finally {
    clearTimeout(timeout);
  }
}
