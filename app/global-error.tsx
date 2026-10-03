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
    console.error("[global-error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          margin: 0,
          padding: "24px",
          background: "#fafafa",
        }}
      >
        <div style={{ maxWidth: "480px", textAlign: "center" }}>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              margin: "0 0 12px",
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              color: "#666",
              margin: "0 0 24px",
              lineHeight: 1.6,
            }}
          >
            We hit a critical error. Please try refreshing the page.
          </p>
          <button
            onClick={reset}
            style={{
              background: "#00aa6c",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}