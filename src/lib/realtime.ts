/**
 * Server-state transport abstraction.
 *
 * Phase 5 / mock era: HTTP + TanStack Query only.
 * Future: WebSocket / SSE adapters can implement ServerStateTransport
 * without changing domain services or UI hooks.
 *
 * Do NOT fake WebSockets against JSON Server.
 */

export type ServerStateTransportKind = "http" | "realtime";

export interface ServerStateTransport {
  readonly kind: ServerStateTransportKind;
  /** Optional realtime subscription — no-op for HTTP transport */
  subscribe?(
    channel: string,
    onMessage: (payload: unknown) => void,
  ): () => void;
}

/** Current production-ready transport: HTTP polling/invalidation via TanStack Query */
export const httpTransport: ServerStateTransport = {
  kind: "http",
};

/**
 * Placeholder for a future realtime transport.
 * Not wired; kept so call sites can switch by env later.
 */
export const realtimeTransportStub: ServerStateTransport = {
  kind: "realtime",
  subscribe() {
    return () => undefined;
  },
};

export function getServerStateTransport(): ServerStateTransport {
  // Future: if (env.realtimeUrl) return createWebSocketTransport(...)
  return httpTransport;
}
