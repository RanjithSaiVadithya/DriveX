"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "1.5rem",
          background: "#f7f3eb",
          color: "#141210",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
        }}
      >
        <h1 style={{ color: "#0f2744", fontSize: "1.5rem" }}>
          Something went wrong
        </h1>
        <p style={{ color: "#6b6560", maxWidth: "28rem" }}>
          An unexpected error occurred. You can try again without seeing technical
          details.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            background: "#5c6b3a",
            color: "#fffdf8",
            border: 0,
            borderRadius: "0.5rem",
            padding: "0.75rem 1.25rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
